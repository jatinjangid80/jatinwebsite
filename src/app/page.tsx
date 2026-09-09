"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ParticleBackground from '../components/ParticleBackground';
import AboutProfile from '../components/AboutProfile';
import StartProjectMini from '../components/StartProjectMini';
import TrustSignals from '../components/TrustSignals';
import HowIWork from '../components/HowIWork';
import StackingCards from '../components/StackingCards';
import ContactSection from '../components/ContactSection';
import FinalCTA from '../components/FinalCTA';
import FooterSection from '../components/FooterSection';
import LoginModal from '../components/LoginModal';
import AIChatbot from '../components/AIChatbot';
import { supabase } from '@/lib/supabaseClient';

const PALETTE = ['#2563EB', '#7C3AED', '#EC4899', '#F97316', '#FACC15', '#10B981', '#06B6D4'];

const hexToRgb = (hex: string = '#2563EB') => {
  const safeHex = (hex && typeof hex === 'string') ? hex : '#2563EB';
  const bigint = parseInt(safeHex.replace('#', ''), 16) || 0;
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
};

const interpolateColors = (color1: string = '#2563EB', color2: string = '#7C3AED', factor: number = 0) => {
  const safeColor1 = (color1 && typeof color1 === 'string') ? color1 : '#2563EB';
  const safeColor2 = (color2 && typeof color2 === 'string') ? color2 : '#7C3AED';
  const bigint1 = parseInt(safeColor1.replace('#', ''), 16) || 0;
  const bigint2 = parseInt(safeColor2.replace('#', ''), 16) || 0;

  const r1 = (bigint1 >> 16) & 255;
  const g1 = (bigint1 >> 8) & 255;
  const b1 = bigint1 & 255;

  const r2 = (bigint2 >> 16) & 255;
  const g2 = (bigint2 >> 8) & 255;
  const b2 = bigint2 & 255;

  const r = Math.max(0, Math.min(255, r1 + factor * (r2 - r1)));
  const g = Math.max(0, Math.min(255, g1 + factor * (g2 - g1)));
  const b = Math.max(0, Math.min(255, b1 + factor * (b2 - b1)));

  const rgbBigInt = (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b);
  const hex = rgbBigInt.toString(16);
  return '#' + '000000'.substring(0, 6 - hex.length) + hex;
};

function NavUserAvatar({ user, activeColor }: { user: any; activeColor: string }) {
  const [imgError, setImgError] = useState(false);
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const initial = (user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'J').toUpperCase();

  if (avatarUrl && typeof avatarUrl === 'string' && avatarUrl.startsWith('http') && !imgError) {
    return (
      <img
        src={avatarUrl}
        alt={user?.user_metadata?.full_name || 'Google User Avatar'}
        className="nav-user-avatar-img"
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className="nav-user-avatar-fallback"
      style={{
        background: `linear-gradient(135deg, ${activeColor}, #7C3AED)`,
      }}
    >
      {initial}
    </div>
  );
}

export default function Home() {
  const [isLight, setIsLight] = useState(true);
  const [activeColor, setActiveColor] = useState(PALETTE[0]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // 1. Check & sync user auth state
  useEffect(() => {
    const syncUser = () => {
      if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            setCurrentUser(session.user);
          } else {
            const localUser = localStorage.getItem('demo_auth_user');
            if (localUser) {
              try { setCurrentUser(JSON.parse(localUser)); } catch {}
            } else {
              setCurrentUser(null);
            }
          }
        });
      } else {
        const localUser = localStorage.getItem('demo_auth_user');
        if (localUser) {
          try { setCurrentUser(JSON.parse(localUser)); } catch {}
        } else {
          setCurrentUser(null);
        }
      }
    };

    syncUser();

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setCurrentUser(session.user);
        } else {
          syncUser();
        }
      });
      window.addEventListener('auth-changed', syncUser);
      return () => {
        subscription.unsubscribe();
        window.removeEventListener('auth-changed', syncUser);
      };
    } else {
      window.addEventListener('auth-changed', syncUser);
      return () => window.removeEventListener('auth-changed', syncUser);
    }
  }, []);

  // 2. Auto popup login modal after 2 seconds on initial visit if not logged in
  useEffect(() => {
    const timer = setTimeout(() => {
      const localUser = localStorage.getItem('demo_auth_user');
      if (localUser) return;

      if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (!session?.user) {
            setIsLoginOpen(true);
          }
        });
      } else {
        setIsLoginOpen(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-nav-menu-wrap')) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [showUserMenu]);

  const handleSignOut = async () => {
    setShowUserMenu(false);
    if (supabase) {
      await supabase.auth.signOut();
    }
    try {
      localStorage.removeItem('demo_auth_user');
      window.dispatchEvent(new Event('auth-changed'));
    } catch {}
    setCurrentUser(null);
  };

  // 3. Theme sync
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsLight(false);
      document.body.classList.remove('light-theme');
    } else {
      setIsLight(true);
      document.body.classList.add('light-theme');
    }
  }, []);

  const toggleTheme = () => {
    const nextState = !isLight;
    setIsLight(nextState);
    if (nextState) {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  };

  // Continuous smooth color cycling
  useEffect(() => {
    let animationFrameId: number;
    let startTime = performance.now();
    const durationPerTransition = 4000;

    const animateColor = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const totalCycleDuration = durationPerTransition * PALETTE.length;
      const rawProgress = (elapsed % totalCycleDuration) / durationPerTransition;

      const currentIndex = Math.floor(rawProgress) % PALETTE.length;
      const nextIndex = (currentIndex + 1) % PALETTE.length;
      const factor = rawProgress - Math.floor(rawProgress);

      const color1 = PALETTE[currentIndex] || PALETTE[0];
      const color2 = PALETTE[nextIndex] || PALETTE[0];
      const currentColor = interpolateColors(color1, color2, factor);
      setActiveColor(currentColor);

      const rgb = hexToRgb(currentColor);
      document.documentElement.style.setProperty('--accent', currentColor);
      document.documentElement.style.setProperty('--accent-glow', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`);
      document.documentElement.style.setProperty('--accent-soft', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`);

      animationFrameId = requestAnimationFrame(animateColor);
    };

    animationFrameId = requestAnimationFrame(animateColor);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Spotlight Card mouse interaction
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  // Magnetic targets
  useEffect(() => {
    const magneticElements = document.querySelectorAll('.magnetic-target');

    const handleMagneticMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const target = mouseEvent.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left - rect.width / 2;
      const y = mouseEvent.clientY - rect.top - rect.height / 2;
      target.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    };

    const handleMagneticLeave = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      target.style.transform = `translate(0px, 0px)`;
    };

    magneticElements.forEach(el => {
      el.addEventListener('mousemove', handleMagneticMove);
      el.addEventListener('mouseleave', handleMagneticLeave);
    });

    return () => {
      magneticElements.forEach(el => {
        el.removeEventListener('mousemove', handleMagneticMove);
        el.removeEventListener('mouseleave', handleMagneticLeave);
      });
    };
  }, []);

  const eyebrow = "OPEN FOR FREELANCE & FULL-STACK COLLABORATION";

  const scrollToSection = (id: string) => {
    if (!id || id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 90;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <div className="ambient-blur ambient-blur-1" />
      <div className="ambient-blur ambient-blur-2" />

      {/* THREE.JS 3D PARTICLE FIELD */}
      <ParticleBackground activeColorHex={activeColor} />

      {/* NAVIGATION */}
      <header className="floating-header">
        <div className="floating-nav-container">
          <a href="#" className="floating-logo-link" onClick={e => { e.preventDefault(); scrollToSection('top'); }}>
            <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '33px', height: '33px' }}>
              <defs>
                <linearGradient id="j-logo-grad" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#be377bff" />
                  <stop offset="100%" stopColor="#7127a3ff" />
                </linearGradient>
              </defs>
              <path
                d="M 44 24 L 76 24 L 76 60 A 28 28 0 0 1 20 60"
                stroke="url(#j-logo-grad)"
                strokeWidth="10"
                strokeLinecap="butt"
                strokeLinejoin="miter"
              />
              <path
                d="M 44 42 L 60 42 L 60 60 A 12 12 0 0 1 36 60"
                stroke="url(#j-logo-grad)"
                strokeWidth="10"
                strokeLinecap="butt"
                strokeLinejoin="miter"
              />
            </svg>
          </a>

          <div className="floating-links-list">
            <a href="#" onClick={e => { e.preventDefault(); scrollToSection('top'); }} className="magnetic-target">Home</a>
            <a href="#about" onClick={e => { e.preventDefault(); scrollToSection('about'); }} className="magnetic-target">About</a>
            <a href="#skills" onClick={e => { e.preventDefault(); scrollToSection('skills'); }} className="magnetic-target">Tech Stack</a>
            <a href="#projects" onClick={e => { e.preventDefault(); scrollToSection('projects'); }} className="magnetic-target">Projects</a>
            <a href="#services" onClick={e => { e.preventDefault(); scrollToSection('services'); }} className="magnetic-target">Services</a>
            <a href="#process" onClick={e => { e.preventDefault(); scrollToSection('process'); }} className="magnetic-target">Process</a>
            <a href="#contact" onClick={e => { e.preventDefault(); scrollToSection('contact'); }} className="magnetic-target">Contact</a>
          </div>

          <div className="floating-actions-container">
            <a href="#contact" onClick={e => { e.preventDefault(); scrollToSection('contact'); }} className="floating-btn-hire magnetic-target">
              Hire Me
            </a>

            {currentUser ? (
              <div className="relative user-nav-menu-wrap">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="nav-user-profile-btn magnetic-target"
                  title={currentUser.user_metadata?.full_name || currentUser.email || 'Client Profile'}
                >
                  <NavUserAvatar user={currentUser} activeColor={activeColor} />
                  <span className="nav-user-name">
                    {currentUser.user_metadata?.full_name?.split(' ')[0] || currentUser.email?.split('@')[0] || 'Account'}
                  </span>
                  <span className="nav-user-online-dot" />
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    style={{
                      transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="nav-user-dropdown-menu">
                    <div className="nav-user-dropdown-header">
                      <p className="nav-user-dropdown-name">{currentUser.user_metadata?.full_name || 'Client Member'}</p>
                      <p className="nav-user-dropdown-email">{currentUser.email || 'Authenticated'}</p>
                    </div>
                    <div className="nav-user-dropdown-divider" />
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="nav-user-dropdown-signout"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
                className="nav-google-signin magnetic-target"
                title="Client Portal & Sign in"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" className="w-[18px] h-[18px] shrink-0">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Sign in</span>
              </button>
            )}

            <button
              className="theme-toggle magnetic-target"
              id="themeToggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isLight ? (
                <svg className="sun-icon" style={{ display: 'block' }} viewBox="0 0 24 24">
                  <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06z" />
                </svg>
              ) : (
                <svg className="moon-icon" style={{ display: 'block' }} viewBox="0 0 24 24">
                  <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* HERO CONTAINER */}
      <header className="hero wrap flex flex-col justify-center items-start">
        <div className="hero-content">
          {/* Pill Eyebrow */}
          <div
            className="self-start inline-flex items-center gap-2 px-5 py-2 rounded-full font-mono text-[11px] font-bold tracking-wider uppercase mb-6 border border-solid"
            style={{ borderColor: `${activeColor}40`, color: activeColor, background: 'var(--accent-soft)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: activeColor }} />
            {eyebrow}
          </div>

          <h1 style={{ color: 'var(--ink)' }}>
            Jatin Jangid <span className="waving-hand">👋</span><br />
            Full Stack / Web Developer
          </h1>

          <p className="hero-sub" style={{ color: 'var(--ink-soft)', marginBottom: '36px' }}>
            I build modern, responsive web applications, business tools, and digital experiences that turn ideas into working products.
          </p>

          <div className="hero-ctas">
            <a
              href="#projects"
              onClick={e => { e.preventDefault(); scrollToSection('projects'); }}
              className="group relative inline-flex items-center gap-3 font-semibold px-10 py-4 transition-all duration-300 shadow-xl magnetic-target overflow-hidden btn btn-primary"
              style={{
                color: '#fff',
                boxShadow: `0 8px 32px ${activeColor}66`,
                letterSpacing: '-0.01em',
              }}
            >
              <span>View Projects</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1.5 text-xl">&rarr;</span>
            </a>
            <a
              href="#contact"
              onClick={e => { e.preventDefault(); scrollToSection('contact'); }}
              className="inline-flex items-center gap-3 font-semibold px-10 py-4 border-2 transition-all duration-300 magnetic-target backdrop-blur-sm hover:scale-105 btn btn-ghost"
              style={{
                borderColor: `${activeColor}66`,
                color: 'var(--ink)',
                background: `${activeColor}12`,
                letterSpacing: '-0.01em',
              }}
            >
              Hire Me / Let&apos;s Work Together
            </a>
            <a
              href="https://drive.google.com/uc?export=download&id=141wwqVCfidnsv5iwHF2wbZaSarzLvSmF"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-semibold px-8 py-4 border-2 transition-all duration-300 magnetic-target backdrop-blur-sm hover:scale-105 btn btn-ghost"
              style={{
                borderColor: `${activeColor}44`,
                color: 'var(--ink)',
                background: `transparent`,
                letterSpacing: '-0.01em',
              }}
            >
              Download Resume
            </a>
          </div>

          <div className="hero-availability-indicator">
            <span className="status-dot-green" />
            <span>Available for freelance projects · 3rd Year B.Tech Developer · Fast response</span>
          </div>
        </div>
      </header>

      {/* PORTFOLIO & FUNNEL SECTIONS */}
      <div className="wrap">

        {/* 1. AUTHENTIC DEVELOPER PROFILE (ABOUT SECTION) */}
        <AboutProfile activeColor={activeColor} onScrollToSection={scrollToSection} />

        {/* 2. ORGANIZED TECH STACK SECTION */}
        <section id="skills" className="border-t border-[var(--line)]">
          <div className="section-head">
            <div className="section-label" style={{ color: activeColor }}>Tech Stack</div>
            <h2>Technologies &amp; Core Tools</h2>
            <p className="section-desc">Organized tools and frameworks I actively use to engineer modern, scalable web solutions.</p>
          </div>
          <div className="skill-grid">
            <div className="skill-card border-glow-card spotlight-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight-overlay" />
              <div className="relative z-10">
                <div className="text-2xl mb-2">🎨</div>
                <h3>Frontend</h3>
                <p className="text-xs text-[var(--ink-soft)] mb-3">Modern, responsive user interfaces &amp; animations</p>
                <ul>
                  <li>HTML5 &amp; Semantic CSS3</li>
                  <li>JavaScript (ES6+) &amp; TypeScript</li>
                  <li>React 19 &amp; Next.js 16</li>
                  <li>Tailwind CSS &amp; Framer Motion</li>
                </ul>
              </div>
            </div>
            <div className="skill-card border-glow-card spotlight-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight-overlay" />
              <div className="relative z-10">
                <div className="text-2xl mb-2">⚙️</div>
                <h3>Backend</h3>
                <p className="text-xs text-[var(--ink-soft)] mb-3">Server logic, APIs &amp; full-stack SSR</p>
                <ul>
                  <li>Node.js &amp; Express.js</li>
                  <li>Next.js Server Actions</li>
                  <li>RESTful APIs &amp; Webhooks</li>
                  <li>SSR &amp; Serverless Handlers</li>
                </ul>
              </div>
            </div>
            <div className="skill-card border-glow-card spotlight-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight-overlay" />
              <div className="relative z-10">
                <div className="text-2xl mb-2">🗄️</div>
                <h3>Database</h3>
                <p className="text-xs text-[var(--ink-soft)] mb-3">Data modeling, relational &amp; document stores</p>
                <ul>
                  <li>MongoDB (NoSQL)</li>
                  <li>MySQL &amp; Relational Schemas</li>
                  <li>PostgreSQL</li>
                  <li>Supabase &amp; Row-Level Security</li>
                </ul>
              </div>
            </div>
            <div className="skill-card border-glow-card spotlight-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight-overlay" />
              <div className="relative z-10">
                <div className="text-2xl mb-2">🛠️</div>
                <h3>Tools &amp; Workflow</h3>
                <p className="text-xs text-[var(--ink-soft)] mb-3">Development, testing &amp; deployment pipelines</p>
                <ul>
                  <li>Git &amp; GitHub Version Control</li>
                  <li>Vercel Hosting &amp; CI/CD</li>
                  <li>Postman API Testing</li>
                  <li>Figma &amp; UI Prototyping</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CASE-STUDY ORIENTED PROJECTS SECTION */}
        <section id="projects" className="border-t border-[var(--line)]">
          <div className="section-head">
            <div className="section-label" style={{ color: activeColor }}>Selected Work &amp; Case Studies</div>
            <h2>Things I&apos;ve Shipped</h2>
            <p className="section-desc">Production applications, enterprise dashboards, and full-stack systems solving real business challenges.</p>
          </div>

          {/* Stacking Cards Deck Effect */}
          <StackingCards activeColor={activeColor} />
        </section>

        {/* 4. FREELANCE SERVICES (8 SPECIFIC OFFERINGS) */}
        <section id="services" className="border-t border-[var(--line)]">
          <div className="section-head">
            <div className="section-label" style={{ color: activeColor }}>Freelance Services</div>
            <h2>Tailored Solutions for Your Business</h2>
            <p className="section-desc">Direct engineering services to build, launch, and optimize your web presence.</p>
          </div>
          <div className="services-grid">
            <div className="service-card border-glow-card spotlight-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight-overlay" />
              <div className="relative z-10">
                <div className="text-2xl mb-3">🏢</div>
                <h3>Business Websites</h3>
                <p>Fast, professional company websites that establish authority, rank on Google, and convert visitors into clients.</p>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="service-cta-link magnetic-target"
                  style={{ color: activeColor }}
                >
                  Discuss this project &rarr;
                </button>
              </div>
            </div>

            <div className="service-card border-glow-card spotlight-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight-overlay" />
              <div className="relative z-10">
                <div className="text-2xl mb-3">✨</div>
                <h3>Portfolio Websites</h3>
                <p>Interactive, visually stunning personal brand websites for developers, creators, and consultants.</p>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="service-cta-link magnetic-target"
                  style={{ color: activeColor }}
                >
                  Discuss this project &rarr;
                </button>
              </div>
            </div>

            <div className="service-card border-glow-card spotlight-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight-overlay" />
              <div className="relative z-10">
                <div className="text-2xl mb-3">🎯</div>
                <h3>Landing Pages &amp; Funnels</h3>
                <p>High-conversion campaign pages with clean copy structure, fast load times, and lead capture forms.</p>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="service-cta-link magnetic-target"
                  style={{ color: activeColor }}
                >
                  Discuss this project &rarr;
                </button>
              </div>
            </div>

            <div className="service-card border-glow-card spotlight-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight-overlay" />
              <div className="relative z-10">
                <div className="text-2xl mb-3">🛍️</div>
                <h3>E-Commerce Websites</h3>
                <p>Seamless online stores with structured product catalogs, shopping carts, and secure payment workflows.</p>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="service-cta-link magnetic-target"
                  style={{ color: activeColor }}
                >
                  Discuss this project &rarr;
                </button>
              </div>
            </div>

            <div className="service-card border-glow-card spotlight-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight-overlay" />
              <div className="relative z-10">
                <div className="text-2xl mb-3">⚛️</div>
                <h3>React Web Applications</h3>
                <p>Custom dynamic web applications built with React 19 and Next.js 16 with robust state and API integrations.</p>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="service-cta-link magnetic-target"
                  style={{ color: activeColor }}
                >
                  Discuss this project &rarr;
                </button>
              </div>
            </div>

            <div className="service-card border-glow-card spotlight-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight-overlay" />
              <div className="relative z-10">
                <div className="text-2xl mb-3">📊</div>
                <h3>CRM &amp; Dashboard Development</h3>
                <p>Centralized internal management tools, lead pipelines, role-based auth, and admin dashboards (like Look My Holiday CRM).</p>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="service-cta-link magnetic-target"
                  style={{ color: activeColor }}
                >
                  Discuss this project &rarr;
                </button>
              </div>
            </div>

            <div className="service-card border-glow-card spotlight-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight-overlay" />
              <div className="relative z-10">
                <div className="text-2xl mb-3">🔄</div>
                <h3>Website Redesign</h3>
                <p>Modernize your existing website with a fresh, sleek design system, improved UX, and responsive layouts.</p>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="service-cta-link magnetic-target"
                  style={{ color: activeColor }}
                >
                  Discuss this project &rarr;
                </button>
              </div>
            </div>

            <div className="service-card border-glow-card spotlight-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight-overlay" />
              <div className="relative z-10">
                <div className="text-2xl mb-3">⚡</div>
                <h3>Bug Fixing &amp; Speed Optimization</h3>
                <p>Core Web Vitals tuning, mobile responsiveness fixes, layout bug resolution, and Google search indexing audit.</p>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="service-cta-link magnetic-target"
                  style={{ color: activeColor }}
                >
                  Discuss this project &rarr;
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. HOW I WORK (4-STEP AGILE PROCESS) */}
        <HowIWork activeColor={activeColor} onScrollToSection={scrollToSection} />

        {/* 6. TRUST SIGNALS */}
        <TrustSignals activeColor={activeColor} />

        {/* 7. COMPACT LEAD INTAKE MINI FORM */}
        <StartProjectMini activeColor={activeColor} />
      </div>

      {/* 7. CONTACT SECTION */}
      <ContactSection activeColor={activeColor} />

      {/* 8. FINAL CTA BANNER */}
      <FinalCTA activeColor={activeColor} onScrollToSection={scrollToSection} />

      {/* 9. FOOTER */}
      <FooterSection activeColor={activeColor} onScrollToSection={scrollToSection} />

      {/* 10. LOGIN MODAL POPUP */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* 11. FLOATING AI CHATBOT (BOTTOM RIGHT) */}
      <AIChatbot activeColor={activeColor} />
    </>
  );
}
