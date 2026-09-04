"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
  actions?: { label: string; url?: string; actionType?: string }[];
}

const KNOWLEDGE_BASE = [
  {
    keywords: ["who", "about", "jatin", "developer", "experience", "bio", "background", "introduce"],
    answer: "I'm **Jatin Jangid** — a Full-Stack Developer specializing in high-performance web applications, SaaS platforms, AI integrations, and real-time systems. I build fast, production-ready software for startups and global clients.",
    actions: [
      { label: "View Projects", actionType: "scroll-projects" },
      { label: "Start a Project", actionType: "scroll-contact" },
    ],
  },
  {
    keywords: ["service", "services", "offer", "build", "stack", "frontend", "backend", "skills", "tech"],
    answer: "Here is what I engineer:\n• **Full-Stack SaaS & Web Apps**: Next.js 15, React, TypeScript, Tailwind CSS\n• **Backend & APIs**: Node.js, Nitro SSR, TanStack Start, Serverless\n• **Databases & Cloud**: Supabase, PostgreSQL, Redis, Vercel CI/CD\n• **AI Workflows**: LLM integrations, automations, vector databases\n• **Mobile Apps**: React Native, Expo, Cross-platform",
    actions: [
      { label: "See How I Work", actionType: "scroll-process" },
      { label: "Book Consultation", url: "https://wa.me/917340098982" },
    ],
  },
  {
    keywords: ["project", "projects", "work", "portfolio", "case study", "apps", "lookmyholidays", "crm", "studypoint", "sahkarigig", "as classes"],
    answer: "Here are some of my featured live products:\n1. **LookMyHolidays**: Full-scale travel agency platform with dynamic SEO & live booking flows.\n2. **Enterprise CRM Dashboard**: Role-based internal SSR dashboard built with TanStack Start & Nitro.\n3. **Studypoint SaaS**: Multi-tenant student accommodation management platform.\n4. **SahkariGig**: Collaborative gig economy portal with verified bidding.\n5. **Logo-Motion AI**: Motion design web tool converting vector SVGs into animated assets.\n6. **AS Classes**: Modern coaching catalog & enrollment web platform.",
    actions: [
      { label: "Explore Case Studies", actionType: "scroll-projects" },
      { label: "GitHub Profile", url: "https://github.com/jatinjangid80" },
    ],
  },
  {
    keywords: ["price", "pricing", "cost", "rate", "quote", "budget", "how much", "charges"],
    answer: "Pricing depends on project scope, architecture, and timeline:\n• **Landing Pages & MVPs**: Typically $300 – $900 (1–2 weeks delivery)\n• **Full-Stack SaaS & Custom Web Apps**: $1,000 – $3,500+\n• **Consulting & Feature Additions**: Flexible hourly or milestone-based.\n\nEvery project includes clean TypeScript, responsive UI, SEO setup, and post-launch support.",
    actions: [
      { label: "Get Instant Quote", actionType: "scroll-calculator" },
      { label: "Chat on WhatsApp", url: "https://wa.me/917340098982" },
    ],
  },
  {
    keywords: ["contact", "hire", "email", "reach", "whatsapp", "call", "message", "talk", "touch"],
    answer: "Let's connect! You can reach me directly via:\n• **WhatsApp**: [+91 7340098982](https://wa.me/917340098982)\n• **Email**: [jatinnjangid72973@gmail.com](mailto:jatinnjangid72973@gmail.com)\n• **LinkedIn**: [linkedin.com/in/jatin-jangid](https://linkedin.com/)\n• **GitHub**: [github.com/jatinjangid80](https://github.com/jatinjangid80)",
    actions: [
      { label: "WhatsApp Direct", url: "https://wa.me/917340098982" },
      { label: "Send Message", actionType: "scroll-contact" },
    ],
  },
  {
    keywords: ["timeline", "duration", "how long", "time", "turnaround", "fast"],
    answer: "Most MVP projects and web applications are delivered within **7 to 21 business days** depending on complexity. I work with rapid weekly sprints and provide daily milestone updates.",
    actions: [
      { label: "Start a Project", actionType: "scroll-contact" },
    ],
  },
];

const SUGGESTED_CHIPS = [
  "💼 What services do you offer?",
  "🚀 Show me recent projects",
  "💰 Pricing & timelines?",
  "📞 How can I hire Jatin?",
];

export default function AIChatbot({ activeColor = "#3B82F6" }: { activeColor?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "👋 Hi there! I'm **Jatin's AI Assistant**. Ask me anything about Jatin's full-stack services, projects, pricing, or tech stack!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showGreetingPill, setShowGreetingPill] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setShowGreetingPill(false);
      setHasOpenedBefore(true);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  // Hide greeting pill after 10s if not clicked
  useEffect(() => {
    const timer = setTimeout(() => setShowGreetingPill(false), 12000);
    return () => clearTimeout(timer);
  }, []);

  const handleActionClick = (action: { label: string; url?: string; actionType?: string }) => {
    if (action.url) {
      window.open(action.url, "_blank", "noopener,noreferrer");
      return;
    }

    if (action.actionType === "scroll-projects") {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    } else if (action.actionType === "scroll-contact") {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    } else if (action.actionType === "scroll-process") {
      document.getElementById("process")?.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    } else if (action.actionType === "scroll-calculator") {
      document.getElementById("start-project")?.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  const generateAnswer = (userQuery: string): { text: string; actions?: { label: string; url?: string; actionType?: string }[] } => {
    const clean = userQuery.toLowerCase();

    for (const item of KNOWLEDGE_BASE) {
      if (item.keywords.some((k) => clean.includes(k))) {
        return { text: item.answer, actions: item.actions };
      }
    }

    return {
      text: "Thanks for asking! Jatin specializes in building custom high-conversion web apps, SaaS dashboards, and AI products. Would you like to view his portfolio projects or schedule a quick chat on WhatsApp?",
      actions: [
        { label: "View Portfolio", actionType: "scroll-projects" },
        { label: "Chat on WhatsApp", url: "https://wa.me/917340098982" },
        { label: "Contact Form", actionType: "scroll-contact" },
      ],
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAnswer(query);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: response.text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actions: response.actions,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "bot",
        text: "✨ Chat cleared! How can I help you with your next project?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Widget Trigger (Bottom Right) */}
      <div className="ai-chatbot-dock">
        {/* Proactive Greeting Pill */}
        <AnimatePresence>
          {showGreetingPill && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              onClick={() => setIsOpen(true)}
              className="ai-greeting-pill"
            >
              <span className="ai-greeting-dot" />
              <span>👋 Ask Jatin&apos;s AI anything!</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGreetingPill(false);
                }}
                className="ai-greeting-close"
                aria-label="Dismiss greeting"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Circular Floating Button */}
        <motion.button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="ai-chatbot-trigger-btn magnetic-target"
          style={{
            background: `linear-gradient(135deg, ${activeColor}, #7C3AED)`,
            boxShadow: `0 8px 32px ${activeColor}55`,
          }}
          aria-label={isOpen ? "Close AI chat assistant" : "Open AI chat assistant"}
        >
          {isOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <div className="relative flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M8 9h8" strokeWidth="2" />
                <path d="M8 13h5" strokeWidth="2" />
              </svg>
              <span className="ai-trigger-sparkle">✨</span>
            </div>
          )}
        </motion.button>
      </div>

      {/* Floating Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.92 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="ai-chat-window border-glow-card"
          >
            {/* Header */}
            <div className="ai-chat-header" style={{ borderBottom: `1px solid var(--line)` }}>
              <div className="flex items-center gap-3">
                <div
                  className="ai-chat-avatar-halo"
                  style={{ background: `linear-gradient(135deg, ${activeColor}, #7C3AED)` }}
                >
                  <span className="text-base">🤖</span>
                  <span className="ai-online-beacon" />
                </div>
                <div>
                  <h3 className="ai-chat-title flex items-center gap-1.5">
                    <span>Jatin AI</span>
                    <span className="ai-badge-chip">Active</span>
                  </h3>
                  <p className="ai-chat-subtitle">Answers questions in &lt;1 sec</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={clearChat}
                  className="ai-chat-ctrl-btn"
                  title="Clear conversation"
                  aria-label="Clear chat"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="ai-chat-ctrl-btn"
                  title="Minimize chat"
                  aria-label="Close chat window"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="ai-chat-body">
              {messages.map((m) => (
                <div key={m.id} className={`ai-message-row ${m.sender === "user" ? "user-row" : "bot-row"}`}>
                  {m.sender === "bot" && (
                    <div className="ai-bot-msg-icon" style={{ background: `${activeColor}20`, color: activeColor }}>
                      🤖
                    </div>
                  )}
                  <div className="ai-msg-bubble-wrap">
                    <div
                      className={`ai-msg-bubble ${m.sender === "user" ? "user-bubble" : "bot-bubble"}`}
                      style={
                        m.sender === "user"
                          ? { background: `linear-gradient(135deg, ${activeColor}, #7C3AED)`, color: "#fff" }
                          : {}
                      }
                    >
                      <div className="ai-msg-text">
                        {m.text.split("\n").map((line, li) => (
                          <p key={li} className={li > 0 ? "mt-1.5" : ""}>
                            {line.split(/(\*\*.*?\*\*)/g).map((part, pi) => {
                              if (part.startsWith("**") && part.endsWith("**")) {
                                return <strong key={pi}>{part.slice(2, -2)}</strong>;
                              }
                              return part;
                            })}
                          </p>
                        ))}
                      </div>

                      {/* Bot Action Buttons */}
                      {m.actions && m.actions.length > 0 && (
                        <div className="ai-msg-actions-row">
                          {m.actions.map((act, ai) => (
                            <button
                              key={ai}
                              type="button"
                              onClick={() => handleActionClick(act)}
                              className="ai-msg-action-chip"
                              style={{ borderColor: `${activeColor}50`, color: activeColor }}
                            >
                              <span>{act.label}</span>
                              <span className="text-xs">&rarr;</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="ai-msg-timestamp">{m.time}</span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="ai-message-row bot-row">
                  <div className="ai-bot-msg-icon" style={{ background: `${activeColor}20`, color: activeColor }}>
                    🤖
                  </div>
                  <div className="ai-msg-bubble bot-bubble ai-typing-bubble">
                    <span className="ai-dot" />
                    <span className="ai-dot" />
                    <span className="ai-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="ai-chips-shelf">
              <div className="ai-chips-scroll">
                {SUGGESTED_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSend(chip)}
                    className="ai-suggest-chip"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="ai-chat-input-bar"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about services, projects, rates..."
                className="ai-chat-input-field"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="ai-chat-send-btn"
                style={{
                  background: input.trim() ? `linear-gradient(135deg, ${activeColor}, #7C3AED)` : "var(--line)",
                  color: "#fff",
                }}
                aria-label="Send message"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
