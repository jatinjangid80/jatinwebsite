"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const triggerCelebration = () => {
    try {
      const count = 180;
      const defaults = { origin: { y: 0.7 }, zIndex: 99999 };
      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    } catch {
      // Confetti fallback
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!isSupabaseConfigured || !supabase) {
      setTimeout(() => {
        setIsLoading(false);
        const demoUser = {
          email: provider === "google" ? "jatin.jangid@gmail.com" : "jatin@github.com",
          user_metadata: {
            full_name: "Jatin Jangid",
            avatar_url: provider === "google"
              ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"
              : "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80",
          },
        };
        try {
          localStorage.setItem("demo_auth_user", JSON.stringify(demoUser));
          window.dispatchEvent(new Event("auth-changed"));
        } catch {}
        triggerCelebration();
        setSuccessMessage(`Signed in successfully via ${provider === "google" ? "Google" : "GitHub"}!`);
        setTimeout(() => onClose(), 800);
      }, 700);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMessage(err?.message || `Failed to initiate ${provider} login.`);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    if (!email) {
      setErrorMessage("Please enter your email address.");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      setIsLoading(false);
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setTimeout(() => {
        setIsLoading(false);
        const demoUser = {
          email: email,
          user_metadata: {
            full_name: fullName || email.split("@")[0] || "Jatin Jangid",
            avatar_url: "",
          },
        };
        try {
          localStorage.setItem("demo_auth_user", JSON.stringify(demoUser));
          window.dispatchEvent(new Event("auth-changed"));
        } catch {}
        triggerCelebration();
        setSuccessMessage(`Welcome back! You are now signed in.`);
        setTimeout(() => onClose(), 800);
      }, 700);
      return;
    }

    try {
      if (authMode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          triggerCelebration();
          setSuccessMessage("Signed in successfully!");
          setTimeout(() => onClose(), 700);
        }
      } else if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        if (data.user) {
          triggerCelebration();
          setSuccessMessage("Account created successfully!");
          setTimeout(() => onClose(), 700);
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Authentication error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="login-modal-overlay-root">
          {/* Frosted Glass Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="login-modal-backdrop"
            onClick={onClose}
            aria-label="Close login popup"
          />

          {/* Centered Modal Container */}
          <div className="login-popup-wrapper">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="login-card-container login-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="login-modal-close-btn"
                aria-label="Close login popup"
                title="Close (Esc)"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Glowing perimeter border effect */}
              <div className="login-card-glow" />

              <div className="login-card-header">
                <h1 className="login-card-title">
                  {authMode === "signin" && "Welcome Back"}
                  {authMode === "signup" && "Create Portal Account"}
                </h1>
                <p className="login-card-desc">
                  {authMode === "signin" && "Access project milestones, direct client communication, and private repos."}
                  {authMode === "signup" && "Join as a collaborator, client, or technology partner."}
                </p>
              </div>

              {/* Social Login Buttons */}
              <div className="login-social-group">
                <button
                  type="button"
                  onClick={() => handleOAuthLogin("google")}
                  disabled={isLoading}
                  className="login-social-btn login-btn-google magnetic-target"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" className="shrink-0">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthLogin("github")}
                  disabled={isLoading}
                  className="login-social-btn login-btn-github magnetic-target"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>Continue with GitHub</span>
                </button>
              </div>

              {/* Divider */}
              <div className="login-divider">
                <span className="login-divider-line" />
                <span className="login-divider-text">OR WITH EMAIL</span>
                <span className="login-divider-line" />
              </div>

              {/* Auth Mode Tabs */}
              <div className="login-tab-switcher">
                <button
                  type="button"
                  onClick={() => { setAuthMode("signin"); setErrorMessage(""); setSuccessMessage(""); }}
                  className={`login-tab-btn ${authMode === "signin" ? "active" : ""}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode("signup"); setErrorMessage(""); setSuccessMessage(""); }}
                  className={`login-tab-btn ${authMode === "signup" ? "active" : ""}`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form Alerts */}
              <AnimatePresence mode="wait">
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="login-alert login-alert-error"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="login-alert login-alert-success"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{successMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Credentials Form */}
              <form onSubmit={handleSubmit} className="login-form-inner">
                {authMode === "signup" && (
                  <div className="login-input-group">
                    <label className="login-input-label">Full Name</label>
                    <div className="login-input-wrapper">
                      <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Jatin Jangid"
                        className="login-field-input"
                        required={authMode === "signup"}
                      />
                    </div>
                  </div>
                )}

                <div className="login-input-group">
                  <label className="login-input-label">Work / Personal Email</label>
                  <div className="login-input-wrapper">
                    <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jatin@company.com"
                      className="login-field-input"
                      required
                    />
                  </div>
                </div>

                <div className="login-input-group">
                  <div className="login-input-label-row">
                    <label className="login-input-label">Password</label>
                    {authMode === "signin" && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (!email) {
                            setErrorMessage("Enter your email address above to receive a password reset link.");
                            return;
                          }
                          setIsLoading(true);
                          try {
                            if (supabase) {
                              const { error } = await supabase.auth.resetPasswordForEmail(email, {
                                redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
                              });
                              if (error) throw error;
                            }
                            setSuccessMessage(`Password reset link sent to ${email}`);
                          } catch (err: any) {
                            setErrorMessage(err?.message || "Failed to send reset link.");
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                        className="login-forgot-link"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="login-input-wrapper">
                    <svg className="login-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="login-field-input"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="login-toggle-eye"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="login-submit-btn magnetic-target"
                >
                  {isLoading ? (
                    <div className="login-spinner" />
                  ) : (
                    <>
                      <span>
                        {authMode === "signin" && "Sign In to Portal"}
                        {authMode === "signup" && "Create Account"}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
