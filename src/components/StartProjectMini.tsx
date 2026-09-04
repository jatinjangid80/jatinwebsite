'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitContactForm } from '@/app/actions';

export default function StartProjectMini({ activeColor }: { activeColor: string }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedData, setSubmittedData] = useState({ name: '', email: '', message: '', budget: '', timeline: '' });

  const [formDataState, setFormDataState] = useState({
    name: '',
    email: '',
    message: '',
    budget: "Flexible / Let's discuss",
    timeline: 'ASAP (within 1–2 weeks)',
  });

  const fireConfettiBurst = async () => {
    if (typeof window === 'undefined') return;
    try {
      const confetti = (await import('canvas-confetti')).default;
      
      // Central blast
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: [activeColor, '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6'],
      });

      // Left cannon
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.65 },
          colors: [activeColor, '#10B981', '#F59E0B'],
        });
      }, 150);

      // Right cannon
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.65 },
          colors: ['#3B82F6', '#8B5CF6', '#EC4899'],
        });
      }, 300);
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = (formData.get('name') as string) || '';
    const email = (formData.get('email') as string) || '';
    const message = (formData.get('message') as string) || '';
    const budget = (formData.get('budget') as string) || '';
    const timeline = (formData.get('projectType') as string) || '';

    try {
      const res = await submitContactForm(formData);
      if (res.success) {
        setSubmittedData({ name, email, message, budget, timeline });
        setSubmitted(true);
        fireConfettiBurst();
      } else {
        setErrorMsg(res.error || 'Something went wrong. Please try again or reach out on WhatsApp.');
      }
    } catch {
      setErrorMsg('Network error. Please try again or WhatsApp me directly.');
    } finally {
      setLoading(false);
    }
  };

  const grad = { background: `linear-gradient(135deg, ${activeColor}, #8b5cf6)` };
  const waEncodedText = encodeURIComponent(
    `Hi Jatin! My name is ${submittedData.name || 'there'}. I just submitted an inquiry for: "${submittedData.message || 'Custom Web Project'}" (Budget: ${submittedData.budget || 'Flexible'}, Timeline: ${submittedData.timeline || 'Standard'}). Let's connect!`
  );

  return (
    <section id="start-project" className="start-mini-section">
      <div className="start-mini-container border-glow-card">
        <div className="start-mini-glow" style={{ background: `radial-gradient(circle at 50% 0%, ${activeColor}25, transparent 70%)` }} />
        
        <div className="start-mini-header">
          <div className="start-mini-badge" style={{ color: activeColor, borderColor: `${activeColor}40` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: activeColor }} />
            Quick Project Inquiry
          </div>
          <h2>Have a project in mind?</h2>
          <p className="start-mini-desc">
            Tell me what you&apos;re building and I&apos;ll review your requirements and get back to you within <strong>24 hours</strong>.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="start-mini-success"
            >
              <motion.div
                className="start-mini-success-icon"
                style={grad}
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
              >
                ✓
              </motion.div>
              <h3>Inquiry Received, {submittedData.name}! 🎉</h3>
              <p>
                Thanks for reaching out! I&apos;ve logged your request for <strong>&ldquo;{submittedData.message}&rdquo;</strong> and will email you back at <strong>{submittedData.email}</strong> within 24 hours.
              </p>

              <div className="mt-6 flex flex-wrap gap-4 justify-center items-center">
                <a
                  href={`https://wa.me/917340098982?text=${waEncodedText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cp-wa-action-btn"
                  style={{ textDecoration: 'none' }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '18px', height: '18px' }}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Chat Instantly on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormDataState({ name: '', email: '', message: '', budget: "Flexible / Let's discuss", timeline: 'ASAP (within 1–2 weeks)' });
                  }}
                  className="start-mini-reset-btn"
                  style={{ borderColor: `${activeColor}40`, color: 'var(--ink)' }}
                >
                  Submit Another Project
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="start-mini-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="start-mini-grid">
                <div className="start-mini-field">
                  <label htmlFor="mini-name">
                    Your Name * {formDataState.name.trim() && <span className="text-emerald-500 font-bold ml-1">✓</span>}
                  </label>
                  <input
                    id="mini-name"
                    name="name"
                    type="text"
                    required
                    value={formDataState.name}
                    onChange={e => setFormDataState(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Jatin Jangid"
                    className="start-mini-input"
                  />
                </div>

                <div className="start-mini-field">
                  <label htmlFor="mini-email">
                    Work Email * {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formDataState.email) && <span className="text-emerald-500 font-bold ml-1">✓</span>}
                  </label>
                  <input
                    id="mini-email"
                    name="email"
                    type="email"
                    required
                    value={formDataState.email}
                    onChange={e => setFormDataState(p => ({ ...p, email: e.target.value }))}
                    placeholder="jatin@company.com"
                    className="start-mini-input"
                  />
                </div>

                <div className="start-mini-field full-width">
                  <label htmlFor="mini-message">
                    What are you building? * {formDataState.message.trim().length > 3 && <span className="text-emerald-500 font-bold ml-1">✓</span>}
                  </label>
                  <input
                    id="mini-message"
                    name="message"
                    type="text"
                    required
                    value={formDataState.message}
                    onChange={e => setFormDataState(p => ({ ...p, message: e.target.value }))}
                    placeholder="e.g. SaaS MVP, Custom CRM, AI workflow, Real-time Dashboard, Company Web Portal"
                    className="start-mini-input"
                  />
                </div>

                <div className="start-mini-field">
                  <label htmlFor="mini-budget">Estimated Budget</label>
                  <select
                    id="mini-budget"
                    name="budget"
                    value={formDataState.budget}
                    onChange={e => setFormDataState(p => ({ ...p, budget: e.target.value }))}
                    className="start-mini-input start-mini-select"
                  >
                    <option value="Flexible / Let's discuss">Flexible / Let&apos;s discuss</option>
                    <option value="< ₹20,000 (Small Website / Fixes)">&lt; ₹20,000 (Small Website / Fixes)</option>
                    <option value="₹20,000 – ₹50,000 (Full Business Website)">₹20,000 – ₹50,000 (Full Business Website)</option>
                    <option value="₹50,000 – ₹1,00,000 (Web App / MVP)">₹50,000 – ₹1,00,000 (Web App / MVP)</option>
                    <option value="₹1,00,000 – ₹2,50,000+ (Custom SaaS / CRM)">₹1,00,000 – ₹2,50,000+ (Custom SaaS / CRM)</option>
                  </select>
                </div>

                <div className="start-mini-field">
                  <label htmlFor="mini-timeline">Target Timeline</label>
                  <select
                    id="mini-timeline"
                    name="projectType"
                    value={formDataState.timeline}
                    onChange={e => setFormDataState(p => ({ ...p, timeline: e.target.value }))}
                    className="start-mini-input start-mini-select"
                  >
                    <option value="ASAP (within 1-2 weeks)">ASAP (within 1–2 weeks)</option>
                    <option value="Standard (2-4 weeks)">Standard (2–4 weeks)</option>
                    <option value="Next 1-2 months">Next 1–2 months</option>
                    <option value="Exploring / Planning">Exploring / Planning</option>
                  </select>
                </div>
              </div>

              {errorMsg && (
                <div className="start-mini-error">
                  {errorMsg}
                </div>
              )}

              <div className="start-mini-footer">
                <button
                  type="submit"
                  disabled={loading}
                  className="start-mini-submit-btn"
                  style={grad}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span>Start the Conversation &rarr;</span>
                  )}
                </button>
                <span className="start-mini-privacy">
                  🔒 No spam, strictly project discussion. Response in &lt;24h.
                </span>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

