'use client';

import React from 'react';

const TRUST_POINTS = [
  {
    icon: '⚡',
    title: 'Fast Communication',
    desc: 'Direct developer communication with zero agency middlemen. Quick updates, daily progress, and transparent timelines.',
  },
  {
    icon: '🛠️',
    title: 'Modern Architecture',
    desc: 'Built with TypeScript, Next.js, React, and Supabase. Clean, maintainable, and designed to scale as your users grow.',
  },
  {
    icon: '📱',
    title: 'Responsive & Fast',
    desc: 'Pixel-perfect across all screen sizes (mobile, tablet, desktop) with 95+ Core Web Vitals and built-in SEO.',
  },
  {
    icon: '🤝',
    title: 'Post-Launch Support',
    desc: 'Smooth deployment handoff, comprehensive documentation, and ongoing support for enhancements and fixes.',
  },
];

export default function TrustSignals({ activeColor }: { activeColor: string }) {
  return (
    <section id="trust" className="trust-signals-section">
      <div className="section-head">
        <div className="section-label" style={{ color: activeColor }}>
          Why Choose Me
        </div>
        <h2>Built for Reliability &amp; Speed</h2>
        <p className="section-desc">
          Engineering products with clean code, dependable delivery, and zero friction.
        </p>
      </div>

      <div className="trust-grid">
        {TRUST_POINTS.map((pt, i) => (
          <div key={i} className="trust-card border-glow-card">
            <div className="trust-icon-box" style={{ background: `${activeColor}15`, borderColor: `${activeColor}30` }}>
              <span className="text-2xl">{pt.icon}</span>
            </div>
            <h3 className="trust-title">{pt.title}</h3>
            <p className="trust-desc">{pt.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
