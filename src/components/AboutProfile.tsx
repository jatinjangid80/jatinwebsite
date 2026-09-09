'use client';

import React from 'react';

interface AboutProfileProps {
  activeColor: string;
  onScrollToSection: (id: string) => void;
}

export default function AboutProfile({ activeColor, onScrollToSection }: AboutProfileProps) {
  return (
    <section id="about" className="about-profile-section border-t border-[var(--line)]">
      <div className="section-head">
        <div className="section-label" style={{ color: activeColor }}>
          Developer Profile
        </div>
        <h2>Engineering Practical Software for Real People</h2>
        <p className="section-desc">
          Honest, engineering-first development combining modern web frameworks with dependable execution.
        </p>
      </div>

      <div className="about-profile-grid">
        {/* Left: Story & Positioning */}
        <div className="about-story-card border-glow-card spotlight-card">
          <div className="spotlight-overlay" />
          <div className="relative z-10">
            <div className="about-badge-pill" style={{ borderColor: `${activeColor}44`, color: activeColor, background: `${activeColor}12` }}>
              <span className="w-2 h-2 rounded-full" style={{ background: activeColor }} />
              B.Tech Student &amp; Full-Stack Builder
            </div>

            <h3 className="about-title">Hi, I&apos;m Jatin Jangid</h3>

            <p className="about-lead">
              I am a <strong>3rd-year B.Tech engineering student</strong> based in Jaipur, India, specializing in 
              <strong> full-stack web development</strong>.
            </p>

            <p className="about-text">
              Instead of sticking to toy demo apps, I spend my time designing, engineering, and launching production 
              software — including enterprise CRM platforms (like <em>Look My Holiday CRM</em>), dynamic booking portals, 
              and multi-tenant SaaS tools.
            </p>

            <p className="about-text">
              I work directly with founders, small businesses, and agencies looking to turn ideas into fast, responsive, 
              and clean web applications.
            </p>

            {/* Quick Metrics & Facts */}
            <div className="about-facts-grid">
              <div className="about-fact-item">
                <span className="about-fact-label">Academic Status</span>
                <span className="about-fact-value">B.Tech (3rd Year)</span>
              </div>
              <div className="about-fact-item">
                <span className="about-fact-label">Location</span>
                <span className="about-fact-value">Jaipur, Rajasthan, India</span>
              </div>
              <div className="about-fact-item">
                <span className="about-fact-label">Availability</span>
                <span className="about-fact-value text-emerald-500 font-medium">Remote &amp; Freelance Open</span>
              </div>
              <div className="about-fact-item">
                <span className="about-fact-label">Current Learning Focus</span>
                <span className="about-fact-value">SSR Architecture &amp; System Optimization</span>
              </div>
            </div>

            <div className="about-actions-row">
              <button
                onClick={() => onScrollToSection('contact')}
                className="btn btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all shadow-md magnetic-target"
                style={{ background: activeColor, boxShadow: `0 4px 20px ${activeColor}40` }}
              >
                Let&apos;s Work Together &rarr;
              </button>
              <a
                href="https://github.com/jatinjangid80"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost inline-flex items-center gap-2 px-5 py-3 rounded-lg font-semibold border transition-all magnetic-target"
                style={{ borderColor: `${activeColor}40`, color: 'var(--ink)' }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}>
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub Profile
              </a>
            </div>
          </div>
        </div>

        {/* Right: Working Principles & Core Competencies */}
        <div className="about-values-col">
          <div className="about-value-card border-glow-card">
            <div className="about-value-icon" style={{ background: `${activeColor}15`, color: activeColor }}>
              🛠️
            </div>
            <div>
              <h4>Pragmatic Engineering</h4>
              <p>Writing clean, type-safe, and maintainable TypeScript code. I prioritize building tools that solve actual business bottlenecks over complex over-engineering.</p>
            </div>
          </div>

          <div className="about-value-card border-glow-card">
            <div className="about-value-icon" style={{ background: `${activeColor}15`, color: activeColor }}>
              ⚡
            </div>
            <div>
              <h4>Performance &amp; Mobile-First</h4>
              <p>Every website and web app is built responsive from 320px to 4K displays with high Core Web Vitals scores and built-in search engine optimization.</p>
            </div>
          </div>

          <div className="about-value-card border-glow-card">
            <div className="about-value-icon" style={{ background: `${activeColor}15`, color: activeColor }}>
              🤝
            </div>
            <div>
              <h4>Direct, Honest Communication</h4>
              <p>No agency bureaucracy. You work directly with the engineer writing your code with transparent timelines, daily syncs, and clear milestone progress.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
