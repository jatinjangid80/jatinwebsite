/**
 * Authentication Security & Brute-Force Defense Utilities
 *
 * Implements:
 * 1. Rate limiting & account/device brute-force protection
 * 2. Progressive backoff delays (exponential)
 * 3. Temporary account lockout with countdown
 * 4. Failed authentication audit logging
 * 5. Breached password blocking & passphrase allowance
 */

export interface RateLimitStatus {
  isLocked: boolean;
  lockoutRemainingSeconds: number;
  progressiveDelayMs: number;
  failedAttempts: number;
  warningMessage?: string;
}

export interface SecurityAuditLog {
  timestamp: string;
  identifier: string;
  event: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOCKOUT_TRIGGERED' | 'RATE_LIMIT_HIT';
  reason?: string;
}

// In-memory / persistent rate limit store per account/device
interface AttemptRecord {
  count: number;
  lastAttemptTime: number;
  lockedUntil: number;
  consecutiveFailures: number;
}

const MAX_FAILED_ATTEMPTS = 5; // Lockout triggered after 5 consecutive failures
const LOCKOUT_DURATION_MS = 10 * 60 * 1000; // 10 minutes temporary lockout
const BASE_DELAY_MS = 1000; // 1 second base progressive delay

// Top breached/weak passwords to block automatically
const COMMONLY_BREACHED_PASSWORDS = new Set([
  'password',
  'password123',
  '123456',
  '12345678',
  '123456789',
  '12345',
  'qwerty',
  'admin',
  'admin123',
  'welcome',
  'welcome123',
  'letmein',
  'iloveyou',
  'sunshine',
  'master',
  'monkey',
  'dragon',
  'football',
  'baseball',
  'superman',
  'starwars',
  'secret',
  'trustno1',
  'jatin123',
]);

const getStorageKey = (identifier: string) => `auth_sec_${identifier.toLowerCase().trim()}`;

/**
 * Retrieves the current rate limit and lockout state for an account/device.
 */
export function getRateLimitStatus(identifier: string): RateLimitStatus {
  if (typeof window === 'undefined' || !identifier) {
    return { isLocked: false, lockoutRemainingSeconds: 0, progressiveDelayMs: 0, failedAttempts: 0 };
  }

  try {
    const raw = localStorage.getItem(getStorageKey(identifier));
    if (!raw) {
      return { isLocked: false, lockoutRemainingSeconds: 0, progressiveDelayMs: 0, failedAttempts: 0 };
    }

    const record: AttemptRecord = JSON.parse(raw);
    const now = Date.now();

    // Check if currently locked out
    if (record.lockedUntil && now < record.lockedUntil) {
      const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return {
        isLocked: true,
        lockoutRemainingSeconds: remainingSeconds,
        progressiveDelayMs: 0,
        failedAttempts: record.consecutiveFailures,
        warningMessage: `Account temporarily locked due to repeated failed attempts. Please try again in ${remainingSeconds}s.`,
      };
    }

    // Lockout expired - reset lockout status
    if (record.lockedUntil && now >= record.lockedUntil) {
      record.lockedUntil = 0;
      record.consecutiveFailures = 0;
      localStorage.setItem(getStorageKey(identifier), JSON.stringify(record));
    }

    // Progressive delay calculation (2^(n-1) * BASE_DELAY)
    const progressiveDelayMs = record.consecutiveFailures > 0
      ? Math.min(Math.pow(2, record.consecutiveFailures - 1) * BASE_DELAY_MS, 15000)
      : 0;

    return {
      isLocked: false,
      lockoutRemainingSeconds: 0,
      progressiveDelayMs,
      failedAttempts: record.consecutiveFailures,
      warningMessage: record.consecutiveFailures >= 3
        ? `Warning: ${MAX_FAILED_ATTEMPTS - record.consecutiveFailures} attempts remaining before temporary account lock.`
        : undefined,
    };
  } catch {
    return { isLocked: false, lockoutRemainingSeconds: 0, progressiveDelayMs: 0, failedAttempts: 0 };
  }
}

/**
 * Records a failed authentication attempt, applies progressive backoff,
 * and triggers temporary lockout when the threshold is reached.
 */
export function recordFailedAttempt(identifier: string, reason: string = 'Invalid credentials'): RateLimitStatus {
  if (typeof window === 'undefined' || !identifier) {
    return { isLocked: false, lockoutRemainingSeconds: 0, progressiveDelayMs: 0, failedAttempts: 1 };
  }

  try {
    const key = getStorageKey(identifier);
    const raw = localStorage.getItem(key);
    const now = Date.now();

    let record: AttemptRecord = raw
      ? JSON.parse(raw)
      : { count: 0, lastAttemptTime: now, lockedUntil: 0, consecutiveFailures: 0 };

    record.count += 1;
    record.lastAttemptTime = now;
    record.consecutiveFailures += 1;

    // Log the failed authentication event
    logSecurityEvent(identifier, 'LOGIN_FAILED', reason);

    if (record.consecutiveFailures >= MAX_FAILED_ATTEMPTS) {
      record.lockedUntil = now + LOCKOUT_DURATION_MS;
      localStorage.setItem(key, JSON.stringify(record));
      logSecurityEvent(identifier, 'LOCKOUT_TRIGGERED', `Exceeded ${MAX_FAILED_ATTEMPTS} attempts`);

      return {
        isLocked: true,
        lockoutRemainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
        progressiveDelayMs: 0,
        failedAttempts: record.consecutiveFailures,
        warningMessage: `Too many failed attempts. Account temporarily locked for 10 minutes.`,
      };
    }

    localStorage.setItem(key, JSON.stringify(record));
    const delayMs = Math.min(Math.pow(2, record.consecutiveFailures - 1) * BASE_DELAY_MS, 15000);

    return {
      isLocked: false,
      lockoutRemainingSeconds: 0,
      progressiveDelayMs: delayMs,
      failedAttempts: record.consecutiveFailures,
      warningMessage: `${record.consecutiveFailures}/${MAX_FAILED_ATTEMPTS} failed attempts. Slowing down login requests.`,
    };
  } catch {
    return { isLocked: false, lockoutRemainingSeconds: 0, progressiveDelayMs: 0, failedAttempts: 1 };
  }
}

/**
 * Clears failed attempts upon successful login.
 */
export function recordSuccessfulLogin(identifier: string) {
  if (typeof window === 'undefined' || !identifier) return;

  try {
    const key = getStorageKey(identifier);
    localStorage.removeItem(key);
    logSecurityEvent(identifier, 'LOGIN_SUCCESS');
  } catch {}
}

/**
 * Validates password security & checks against commonly breached passwords.
 * Supports long passphrases instead of arbitrary complexity limitations.
 */
export function validatePasswordSecurity(password: string): { isValid: boolean; error?: string; strength: 'weak' | 'moderate' | 'strong' } {
  if (!password) {
    return { isValid: false, error: 'Password is required', strength: 'weak' };
  }

  // Minimum length check
  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password or passphrase must be at least 8 characters long.',
      strength: 'weak',
    };
  }

  // Check against breached passwords dictionary
  const normalized = password.toLowerCase().trim();
  if (COMMONLY_BREACHED_PASSWORDS.has(normalized)) {
    return {
      isValid: false,
      error: 'This password is too common and has appeared in known data breaches. Please choose a more secure password or passphrase.',
      strength: 'weak',
    };
  }

  // Evaluate passphrase strength: long passphrases (14+ chars) are inherently strong
  if (password.length >= 14 || (password.includes(' ') && password.length >= 12)) {
    return { isValid: true, strength: 'strong' };
  }

  if (password.length >= 10) {
    return { isValid: true, strength: 'moderate' };
  }

  return { isValid: true, strength: 'moderate' };
}

/**
 * Security Audit Logger for recording security events.
 */
function logSecurityEvent(identifier: string, event: SecurityAuditLog['event'], reason?: string) {
  try {
    const logItem: SecurityAuditLog = {
      timestamp: new Date().toISOString(),
      identifier: identifier.toLowerCase().trim(),
      event,
      reason,
    };

    const logsRaw = localStorage.getItem('auth_security_audit_logs');
    const logs: SecurityAuditLog[] = logsRaw ? JSON.parse(logsRaw) : [];
    logs.unshift(logItem);

    // Keep last 50 events
    localStorage.setItem('auth_security_audit_logs', JSON.stringify(logs.slice(0, 50)));
    console.info(`[Auth Security Audit] ${event} for ${identifier}`, reason ? `(${reason})` : '');
  } catch {}
}
