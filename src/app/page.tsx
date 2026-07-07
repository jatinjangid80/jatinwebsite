"use client";

import React, { useEffect, useState, useRef } from 'react';
import ParticleBackground from '../components/ParticleBackground';
import { submitContactForm } from './actions';
import { motion, AnimatePresence } from 'framer-motion';

const PALETTE = ['#2563EB', '#7C3AED', '#EC4899', '#F97316', '#FACC15', '#10B981', '#06B6D4'];

const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
};

// Simplified dynamic hex-to-rgb lerp
const interpolateColors = (color1: string, color2: string, factor: number) => {
  const bigint1 = parseInt(color1.replace('#', ''), 16);
  const bigint2 = parseInt(color2.replace('#', ''), 16);

  const r1 = (bigint1 >> 16) & 255;
  const g1 = (bigint1 >> 8) & 255;
  const b1 = bigint1 & 255;

  const r2 = (bigint2 >> 16) & 255;
  const g2 = (bigint2 >> 8) & 255;
  const b2 = bigint2 & 255;

  const r = r1 + factor * (r2 - r1);
  const g = g1 + factor * (g2 - g1);
  const b = b1 + factor * (b2 - b1);

  const rgbBigInt = (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b);
  const hex = rgbBigInt.toString(16);
  return '#' + '000000'.substring(0, 6 - hex.length) + hex;
};

export default function Home() {
  const [isLight, setIsLight] = useState(true);
  const [formStatus, setFormStatus] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Active animated color state
  const [activeColor, setActiveColor] = useState(PALETTE[0]);

  // Typewriter states

  // 1. Theme sync
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsLight(false);
      document.body.classList.remove('light-theme');
      document.documentElement.classList.add('dark');
    } else {
      setIsLight(true);
      document.body.classList.add('light-theme');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Theme toggle
  const toggleTheme = () => {
    const nextLight = !isLight;
    setIsLight(nextLight);
    if (nextLight) {
      document.body.classList.add('light-theme');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  // 2. Static blue theme setup
  useEffect(() => {
    const staticColor = '#2563EB';
    setActiveColor(staticColor);

    document.documentElement.style.setProperty('--active-color', staticColor);
    const bigint = parseInt(staticColor.replace('#', ''), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    document.documentElement.style.setProperty('--accent-soft', `rgba(${r}, ${g}, ${b}, 0.15)`);
  }, []);

  // 3. Click ripple effect and magnetics follow setup
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const ripple = document.createElement('div');
      ripple.className = 'cursor-ripple';
      ripple.style.left = e.clientX + 'px';
      ripple.style.top = e.clientY + 'px';
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    };
    document.addEventListener('mousedown', handleMouseDown);

    // Magnetic follow logic
    const magneticElements = document.querySelectorAll('.magnetic-target');
    const handleMagneticMove = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      const me = e as MouseEvent;

      const currentX = parseFloat(el.dataset.magneticX || '0');
      const currentY = parseFloat(el.dataset.magneticY || '0');

      const baseLeft = rect.left - currentX;
      const baseTop = rect.top - currentY;

      const x = me.clientX - baseLeft - rect.width / 2;
      const y = me.clientY - baseTop - rect.height / 2;

      const targetX = x * 0.25;
      const targetY = y * 0.25;

      el.dataset.magneticX = targetX.toString();
      el.dataset.magneticY = targetY.toString();

      el.style.transform = `translate(${targetX}px, ${targetY}px)`;
      el.style.transition = 'transform 0.15s ease-out';
    };
    const handleMagneticLeave = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      el.dataset.magneticX = '0';
      el.dataset.magneticY = '0';
      el.style.transform = 'translate(0px, 0px)';
      el.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    };

    magneticElements.forEach(el => {
      el.addEventListener('mousemove', handleMagneticMove);
      el.addEventListener('mouseleave', handleMagneticLeave);
    });

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      magneticElements.forEach(el => {
        el.removeEventListener('mousemove', handleMagneticMove);
        el.removeEventListener('mouseleave', handleMagneticLeave);
      });
    };
  }, []);

  // Removed typewriter effect so text appears instantly
  const eyebrow = "AVAILABLE FOR FREELANCE WORK";


  // Local card hover spotlight tracking
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  // Contact Form Submission
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('Sending message...');

    const formData = new FormData(e.currentTarget);
    const result = await submitContactForm(formData);

    if (result.error) {
      setFormStatus(result.error);
    } else {
      setFormStatus('');
      setShowSuccessPopup(true);
      (e.target as HTMLFormElement).reset();

      // Auto-hide popup after 3.5 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3500);
    }
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Ambient background glows cycling colors and drifting */}
      <div className="ambient-glow glow-top-left" />
      <div className="ambient-glow glow-top-right" />
      <div className="ambient-glow glow-bottom-left" />
      <div className="ambient-glow glow-bottom-right" />

      {/* GPU-Accelerated WebGL Background */}
      <ParticleBackground activeColorHex={activeColor} />

      {/* NAVIGATION */}
      <header className="floating-header">
        <div className="floating-nav-container">
          <a href="#" className="floating-logo-link">
            <div className="floating-logo-text">
              <span className="logo-look">LOOK</span>
              <span className="logo-my">MY</span>
              <span className="logo-holiday">Holiday</span>
            </div>
            <svg className="w-5 h-5 text-[#2563EB] transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'inline', width: '20px', height: '20px', marginLeft: '2px' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </a>
          
          <div className="floating-links-list">
            <a href="#" className="magnetic-target">Home</a>
            <a href="#" className="magnetic-target">Destinations</a>
            <a href="#" className="magnetic-target">Packages</a>
            <a href="#" className="magnetic-target">Visa</a>
            <a href="#" className="magnetic-target">About</a>
            <a href="#" className="magnetic-target">Gallery</a>
            <a href="#" className="magnetic-target">Blog</a>
            <a href="#" className="magnetic-target">Contact</a>
          </div>

          <div className="floating-actions-container">
            <button className="floating-btn-signin magnetic-target">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: 'inline', width: '16px', height: '16px', marginRight: '6px' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Sign In
            </button>
            <button className="floating-btn-book magnetic-target">
              Book Now
            </button>
            
            <button
              className="theme-toggle magnetic-target"
              id="themeToggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={{ marginLeft: '8px' }}
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

      {/* HERO CONTAINER (Clean Full-Width Original Layout) */}
      <div className="wrap pt-40 pb-28 md:pt-48 flex flex-col justify-center items-start">
        <div className="hero-content">
          {/* Pill Eyebrow */}
          <div
            className="self-start inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100/30 text-indigo-600 font-mono text-[14px] font-bold tracking-wide uppercase mb-6 dark:bg-indigo-950/40 dark:border-indigo-900/50"
            style={{ borderColor: activeColor, color: activeColor }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: activeColor }} />
            {eyebrow}
          </div>

          <h1 className="font-display font-bold text-slate-900 dark:text-white leading-[1.08] tracking-tight mb-8">
            Hi, I'm Jatin 👋<br /><br />
            Full-Stack Developer<br />
            building modern web products<br />
            for startups & businesses.
          </h1>

          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-normal leading-relaxed mb-10">
            I design and develop fast, scalable websites,<br />
            SaaS products, CRM systems, AI automations,<br />
            and modern web applications.
          </p>

          <div className="hero-ctas">
            <a
              href="#projects"
              onClick={(e) => scrollToSection(e, 'projects')}
              className="group relative inline-flex items-center gap-3 font-semibold px-12 py-5 transition-all duration-300 shadow-xl magnetic-target overflow-hidden btn btn-primary"
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
              onClick={(e) => scrollToSection(e, 'contact')}
              className="inline-flex items-center gap-3 font-semibold px-12 py-5 border-2 transition-all duration-300 magnetic-target backdrop-blur-sm hover:scale-105 btn btn-ghost"
              style={{
                borderColor: `${activeColor}66`,
                color: 'var(--ink)',
                background: `${activeColor}12`,
                letterSpacing: '-0.01em',
              }}
            >
              Book a Call
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-semibold px-12 py-5 border-2 transition-all duration-300 magnetic-target backdrop-blur-sm hover:scale-105 btn btn-ghost"
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
        </div>
      </div>
      {/* ORIGINAL PORTFOLIO SECTIONS */}
      <div className="wrap">

        {/* PROJECTS SECTION */}
        <section id="projects" className="border-t border-[var(--line)]">
          <div className="section-head">
            <div className="section-label" style={{ color: activeColor }}>Selected work</div>
            <h2>Things I've shipped</h2>
            <p className="section-desc">A mix of client work and personal builds — live products, not mockups.</p>
          </div>

          <div className="projects-list">
            <div className="project border-glow-card spotlight-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight-overlay" />
              <div className="project-inner relative z-10">
                <div className="project-top">
                  <h3>LookMyHolidays</h3>
                  <span className="project-status">Live</span>
                </div>
                <p>A travel agency website handling package listings, SEO, and customer-facing content, deployed with a custom domain.</p>
                <div className="stack-row">
                  <span className="stack-tag">React</span>
                  <span className="stack-tag">Vercel</span>
                  <span className="stack-tag">SEO</span>
                </div>
                <a href="https://www.lookmyholiday.co.in/" target="_blank" rel="noopener noreferrer" className="project-link magnetic-target">
                  Visit site
                </a>
              </div>
            </div>

            <div className="project border-glow-card spotlight-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight-overlay" />
              <div className="project-inner relative z-10">
                <div className="project-top">
                  <h3>CRM Dashboard</h3>
                  <span className="project-status">Live</span>
                </div>
                <p>An internal CRM for managing employees and client records, server-rendered and deployed on Vercel.</p>
                <div className="stack-row">
                  <span className="stack-tag">TanStack Start</span>
                  <span className="stack-tag">Nitro SSR</span>
                  <span className="stack-tag">Vercel</span>
                </div>
                <a href="https://crm-lookmywebsites.vercel.app" target="_blank" rel="noopener noreferrer" className="project-link magnetic-target">
                  Visit dashboard
                </a>
              </div>
            </div>

            <div className="project border-glow-card spotlight-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight-overlay" />
              <div className="project-inner relative z-10">
                <div className="project-top">
                  <h3>Space Escape Runner</h3>
                  <span className="project-status">In progress</span>
                </div>
                <p>A mobile arcade game built with React Native and Expo, currently in active development.</p>
                <div className="stack-row">
                  <span className="stack-tag">React Native</span>
                  <span className="stack-tag">Expo</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="border-t border-[var(--line)]">
          <div className="section-head">
            <div className="section-label" style={{ color: activeColor }}>Services</div>
            <h2>How I can help</h2>
            <p className="section-desc">Fixed-scope engagements for small businesses that need a working site or tool — not a maintenance contract.</p>
          </div>
          <div className="services-grid">
            <div className="service-card border-glow-card spotlight-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight-overlay" />
              <div className="relative z-10">
                <h3>Business Website</h3>
                <p>A fast, SEO-ready site for your business — built, deployed, and connected to your domain.</p>
                <div className="service-price">Custom Quote</div>
              </div>
            </div>
            <div className="service-card border-glow-card spotlight-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight-overlay" />
              <div className="relative z-10">
                <h3>Custom Dashboard / CRM</h3>
                <p>An internal tool for managing customers, staff, or operations, tailored to how your team actually works.</p>
                <div className="service-price">Custom Quote</div>
              </div>
            </div>
            <div className="service-card border-glow-card spotlight-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight-overlay" />
              <div className="relative z-10">
                <h3>Website Audit & Fixes</h3>
                <p>A full pass on an existing site — broken SEO, dead content, performance issues — with a fix list and implementation.</p>
                <div className="service-price">Custom Quote</div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT / SKILLS SECTION */}
        <section id="skills" className="border-t border-[var(--line)]">
          <div className="section-head">
            <div className="section-label" style={{ color: activeColor }}>Capabilities</div>
            <h2>What I work with</h2>
          </div>
          <div className="skill-grid">
            <div className="skill-card border-glow-card spotlight-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight-overlay" />
              <div className="relative z-10">
                <h3>Frontend</h3>
                <ul>
                  <li>React / Next.js</li>
                  <li>TanStack Start</li>
                  <li>Responsive UI/UX</li>
                </ul>
              </div>
            </div>
            <div className="skill-card border-glow-card spotlight-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight-overlay" />
              <div className="relative z-10">
                <h3>Backend</h3>
                <ul>
                  <li>Node.js</li>
                  <li>Supabase</li>
                  <li>REST APIs</li>
                </ul>
              </div>
            </div>
            <div className="skill-card border-glow-card spotlight-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight-overlay" />
              <div className="relative z-10">
                <h3>Mobile</h3>
                <ul>
                  <li>React Native / Expo</li>
                  <li>Capacitor</li>
                </ul>
              </div>
            </div>
            <div className="skill-card border-glow-card spotlight-card" onMouseMove={handleCardMouseMove}>
              <div className="spotlight-overlay" />
              <div className="relative z-10">
                <h3>IoT & AI/ML</h3>
                <ul>
                  <li>ESP32 / Raspberry Pi</li>
                  <li>MQTT</li>
                  <li>Applied ML basics</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="border-t border-[var(--line)]">
          <div className="contact-grid">
            <div className="contact-left">
              <div className="section-label" style={{ color: activeColor }}>Get in touch</div>
              <h2>Tell me about your project</h2>
              <p>Send me a message below and I'll get back to you within 24 hours.</p>
              <div className="contact-detail">jatinnjangid72973@gmail.com</div>
              <div className="contact-detail">Jaipur, India</div>
            </div>
            <div className="contact-right">
              <form onSubmit={handleContactSubmit}>
                <div>
                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" type="text" required />
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" required />
                </div>
                <div>
                  <label htmlFor="message">Project details</label>
                  <textarea id="message" name="message" required placeholder="What are you looking to build?"></textarea>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary magnetic-target"
                  style={{ backgroundColor: activeColor }}
                >
                  Send message
                </button>
                <div className="form-status">{formStatus}</div>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-[var(--line)]">
        <div className="wrap">Jatin — built and maintained by Jatin Jangid</div>
      </footer>

      {/* SUCCESS POPUP MODAL */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative border border-slate-200 dark:border-slate-800"
            >
              <div
                className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-white shadow-lg"
                style={{ background: `linear-gradient(135deg, ${activeColor}, #7C3AED)` }}
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Thank You!</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Your message has been sent successfully. I'll get back to you soon.
              </p>
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: activeColor }}
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
