'use client';

import React from 'react';

const STEPS = [
  {
    num: '01',
    title: 'Discover',
    desc: 'We dive deep into your project vision, user needs, feature scope, and business objectives to define the roadmap.',
    tag: 'Requirements & Goals',
  },
  {
    num: '02',
    title: 'Plan & Architect',
    desc: 'Design database schemas, UI wireframes, API integrations, and establish milestone delivery timelines.',
    tag: 'Tech Stack & Design',
  },
  {
    num: '03',
    title: 'Build & Iterate',
    desc: 'Fast agile engineering with continuous updates, live preview staging links, and direct code testing.',
    tag: 'Clean & Scalable Code',
  },
  {
    num: '04',
    title: 'Launch & Scale',
    desc: 'Production deployment on custom domains, performance audits, SEO setup, and post-launch support handoff.',
    tag: 'Live Product Delivery',
  },
];

export default function HowIWork({
  activeColor,
  onScrollToSection,
}: {
  activeColor: string;
  onScrollToSection: (id: string) => void;
}) {
  return (
    <section id="process" className="how-i-work-section">
      <div className="section-head">
        <div className="section-label" style={{ color: activeColor }}>
          Process
        </div>
        <h2>How I Work</h2>
        <p className="section-desc">
          A structured, transparent engineering process that turns your idea into a reliable, high-performing product.
        </p>
      </div>

      <div className="how-steps-grid">
        {STEPS.map((step) => (
          <div key={step.num} className="how-step-card border-glow-card">
            <div className="how-step-top">
              <span className="how-step-num" style={{ color: activeColor }}>
                {step.num}
              </span>
              <span className="how-step-tag">{step.tag}</span>
            </div>
            <h3 className="how-step-title">{step.title}</h3>
            <p className="how-step-desc">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="how-cta-banner border-glow-card">
        <div className="how-cta-text">
          <h3>Have an idea worth building?</h3>
          <p>Let&apos;s map out the architecture and get it shipped fast.</p>
        </div>
        <button
          onClick={() => onScrollToSection('start-project')}
          className="how-cta-btn magnetic-target"
          style={{
            background: `linear-gradient(135deg, ${activeColor}, #8b5cf6)`,
            color: '#fff',
          }}
        >
          Let&apos;s talk &rarr;
        </button>
      </div>
    </section>
  );
}
