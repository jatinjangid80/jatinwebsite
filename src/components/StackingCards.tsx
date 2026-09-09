'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

export interface ProjectItem {
  title: string;
  status: string;
  description: string;
  problem: string;
  solution: string;
  result: string;
  stack: string[];
  liveUrl: string;
  githubUrl: string;
  ctaText: string;
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    title: 'Look My Holiday CRM',
    status: 'Featured Enterprise CRM',
    description: 'A full-stack enterprise CRM system engineered for travel agencies to manage employee operations, lead conversion pipelines, customer bookings, and multi-tier access controls.',
    problem: 'Client lead records, team follow-ups, and booking quotes were scattered across spreadsheets with zero permission control or analytics.',
    solution: 'Architected an end-to-end SSR dashboard with role-based auth, dynamic lead pipelines, automated status tracking, and sub-100ms response times.',
    result: 'Streamlined day-to-day operations, unified customer data, and secured enterprise access control across staff tiers.',
    stack: ['TanStack Start', 'Nitro SSR', 'TypeScript', 'Node.js', 'Vercel'],
    liveUrl: 'https://www.crmlookmyholidays.com',
    githubUrl: 'https://github.com/jatinjangid80/CRM-lookmywebsites',
    ctaText: 'Visit Live CRM',
  },
  {
    title: 'LookMyHolidays Portal',
    status: 'Production Client Site',
    description: 'High-performance commercial travel agency platform with interactive tour package discovery, automated lead capture, and dynamic SEO indexing.',
    problem: 'Previous static pages suffered from slow load times, poor mobile conversions, and zero dynamic holiday search capabilities.',
    solution: 'Designed and deployed a responsive React web application featuring instant holiday inquiries, schema markup, and optimized media delivery.',
    result: 'Fully indexed on Google, delivering sub-second page loads and capturing inbound customer booking inquiries daily.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vercel', 'SEO Schema'],
    liveUrl: 'https://www.lookmyholiday.co.in/',
    githubUrl: 'https://github.com/jatinjangid80/lookmyholidays',
    ctaText: 'Visit Live Site',
  },
  {
    title: 'SahkariGig Marketplace',
    status: 'Full-Stack Platform',
    description: 'A collaborative freelance and cooperative gig economy web application connecting verified service providers with local gigs, instant bids, and direct hiring.',
    problem: 'Freelancers and local service providers face prohibitive marketplace fees, fragmented job boards, and lack of verified credentials.',
    solution: 'Engineered a modern web platform featuring structured gig listings, verified worker profiles, live search filters, and transparent proposal workflows.',
    result: 'Accelerated local service hiring with zero middleman commissions and real-time job proposal management.',
    stack: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
    liveUrl: 'https://github.com/jatinjangid80/SahkariGig',
    githubUrl: 'https://github.com/jatinjangid80/SahkariGig',
    ctaText: 'View on GitHub',
  },
  {
    title: 'Studypoint SaaS',
    status: 'Multi-Tenant SaaS',
    description: 'Hostel and PG accommodation management SaaS enabling landlords to track room occupancies, automate rent dues, and manage student allocations.',
    problem: 'Hostel managers faced recurring record discrepancies, missed rent dues, and disorganized tenant record-keeping across multiple properties.',
    solution: 'Built a multi-tenant Next.js & Supabase SaaS application with role-based dashboards, automated ledger tracking, and instant digital receipts.',
    result: 'Eliminated manual bookkeeping errors and automated tenant check-ins across multi-building properties.',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS'],
    liveUrl: 'https://github.com/jatinjangid80/Studypoint',
    githubUrl: 'https://github.com/jatinjangid80/Studypoint',
    ctaText: 'View on GitHub',
  },
  {
    title: 'AS Classes Portal',
    status: 'Live Client Portal',
    description: 'An educational coaching institution platform featuring course catalogs, student registration pipelines, syllabus guides, and resource downloads.',
    problem: 'The coaching center had no digital inquiry system to showcase faculty, batch schedules, and enroll new students online.',
    solution: 'Created a sleek, mobile-optimized web application with dedicated course tracks, fast contact channels, and Google Search optimization.',
    result: 'Production deployment with high mobile engagement and direct digital student inquiries.',
    stack: ['React', 'TypeScript', 'CSS3', 'Vercel Hosting'],
    liveUrl: 'https://as-classes.vercel.app',
    githubUrl: 'https://github.com/jatinjangid80/as-classes-',
    ctaText: 'Visit Live Site',
  },
  {
    title: 'Logo-Motion AI Engine',
    status: 'Developer Tool',
    description: 'Interactive SVG animation prototyping tool transforming static vector logos into fluid interactive animations with exportable CSS and Framer Motion code.',
    problem: 'Writing manual keyframes and bezier curves for complex vector path animations was tedious and error-prone.',
    solution: 'Constructed an interactive browser application that parses SVG vectors, applies animated path transitions, and generates ready-to-use code.',
    result: 'Reduced motion asset prototyping from hours to minutes with live in-browser preview and code generation.',
    stack: ['TypeScript', 'SVG Canvas', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: 'https://github.com/jatinjangid80/Logo-Motion',
    githubUrl: 'https://github.com/jatinjangid80/Logo-Motion',
    ctaText: 'View on GitHub',
  },
];

interface CardProps {
  project: ProjectItem;
  i: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  activeColor: string;
}

function ProjectCard({ project, i, progress, range, targetScale, activeColor }: CardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={containerRef} className="stack-card-holder">
      <motion.div
        style={{
          scale,
          top: `calc(90px + ${i * 24}px)`,
          zIndex: i + 10,
        }}
        className="stack-card-item border-glow-card spotlight-card"
      >
        <div className="spotlight-overlay" />
        <div className="project-inner relative z-10">
          <div className="project-top">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-[var(--line)] text-[var(--accent)] font-bold">
                0{i + 1}
              </span>
              <h3>{project.title}</h3>
            </div>
            <span
              className="project-status"
              style={{
                borderColor: `${activeColor}44`,
                color: activeColor,
              }}
            >
              {project.status}
            </span>
          </div>

          <p>{project.description}</p>

          <div className="project-case-grid">
            <div className="project-case-item">
              <span className="project-case-label">Problem</span>
              <span className="project-case-val">{project.problem}</span>
            </div>
            <div className="project-case-item">
              <span className="project-case-label">Solution</span>
              <span className="project-case-val">{project.solution}</span>
            </div>
            <div className="project-case-item">
              <span className="project-case-label">Result</span>
              <span className="project-case-val">{project.result}</span>
            </div>
          </div>

          <div className="stack-row">
            {project.stack.map(tech => (
              <span key={tech} className="stack-tag">
                {tech}
              </span>
            ))}
          </div>

          <div className="project-links-row">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link magnetic-target"
            >
              {project.ctaText}
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link project-github-link magnetic-target"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px' }}>
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              GitHub Repo
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function StackingCards({ activeColor }: { activeColor: string }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={container} className="stacking-cards-section-wrapper">
      {PROJECTS_DATA.map((project, i) => {
        const targetScale = 1 - (PROJECTS_DATA.length - i) * 0.03;
        const step = 1 / PROJECTS_DATA.length;
        return (
          <ProjectCard
            key={project.title}
            project={project}
            i={i}
            progress={scrollYProgress}
            range={[i * step, 1]}
            targetScale={targetScale}
            activeColor={activeColor}
          />
        );
      })}
    </div>
  );
}
