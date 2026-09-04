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
    title: 'LookMyHolidays',
    status: 'Live',
    description: 'A full-scale travel agency platform handling package listings, SEO optimization, and live customer inquiry booking flows.',
    problem: 'Slow static booking pages with zero dynamic package search and poor mobile SEO rankings.',
    solution: 'Built a dynamic React app with optimized metadata, structured schema, and instant inquiry forms.',
    result: 'Live in production, indexed on Google, generating customer booking inquiries daily.',
    stack: ['React', 'TypeScript', 'Vercel', 'SEO'],
    liveUrl: 'https://www.lookmyholiday.co.in/',
    githubUrl: 'https://github.com/jatinjangid80/lookmyholidays',
    ctaText: 'Visit site',
  },
  {
    title: 'CRM Dashboard',
    status: 'Live',
    description: 'An internal enterprise CRM for managing employees and client records, server-rendered and deployed on custom domain.',
    problem: 'Disorganized customer records spread across spreadsheets with zero permission control.',
    solution: 'Engineered a full-stack SSR dashboard with role-based auth, client lead logs, and analytics.',
    result: 'Streamlined team operations with sub-100ms server responses and centralized data.',
    stack: ['TanStack Start', 'Nitro SSR', 'TypeScript', 'Vercel'],
    liveUrl: 'https://www.crmlookmyholidays.com',
    githubUrl: 'https://github.com/jatinjangid80/CRM-lookmywebsites',
    ctaText: 'Visit dashboard',
  },
  {
    title: 'Studypoint SaaS',
    status: 'Featured',
    description: 'Multi-PG & student accommodation management SaaS platform for student allocations, payment tracking, and automated records.',
    problem: 'Managing multiple hostel buildings, student dues, and room vacant statuses manually.',
    solution: 'Developed a multi-tenant Next.js & Supabase SaaS platform with automated payment receipts.',
    result: 'Eliminated manual ledger errors, automated tenant tracking across multi-location properties.',
    stack: ['Next.js', 'TypeScript', 'SaaS', 'Supabase'],
    liveUrl: 'https://github.com/jatinjangid80/Studypoint',
    githubUrl: 'https://github.com/jatinjangid80/Studypoint',
    ctaText: 'View on GitHub',
  },
  {
    title: 'SahkariGig',
    status: 'Featured',
    description: 'A collaborative freelance & cooperative gig economy portal connecting verified service providers with local gigs and instant job tracking.',
    problem: 'Freelancers and local service providers face high marketplace commissions, disorganized task bidding, and poor trust verification.',
    solution: 'Engineered a modern web platform featuring structured task listings, verified user profiles, direct client messaging, and transparent bids.',
    result: 'Streamlined gig discovery and local service hiring with fast search filters and instant proposal workflows.',
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
    liveUrl: 'https://github.com/jatinjangid80/SahkariGig',
    githubUrl: 'https://github.com/jatinjangid80/SahkariGig',
    ctaText: 'View on GitHub',
  },
  {
    title: 'Logo-Motion AI',
    status: 'New',
    description: 'AI-assisted motion design tool to transform static SVG logos into animated vector assets and smooth interactive web motion.',
    problem: 'Manual CSS and keyframe animation for vector logos is time-consuming and difficult to synchronize smoothly.',
    solution: 'Built an interactive TypeScript web tool that parses SVG paths, applies dynamic easing curves, and exports production-ready code.',
    result: 'Cut animation prototyping time by 80% with real-time browser playback and clean code exports.',
    stack: ['TypeScript', 'SVG Canvas', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: 'https://github.com/jatinjangid80/Logo-Motion',
    githubUrl: 'https://github.com/jatinjangid80/Logo-Motion',
    ctaText: 'View on GitHub',
  },
  {
    title: 'AS Classes',
    status: 'Live',
    description: 'An educational coaching and classroom web platform featuring course catalogs, student admissions, and study resources.',
    problem: 'Lack of digital presence to display coaching batches, syllabus info, and student enrollment forms.',
    solution: 'Designed a sleek, modern UI with clear course curriculum tracks, student registration, and fast CDN hosting.',
    result: 'Live in production with direct student inquiry capture and digital brand recognition.',
    stack: ['React', 'TypeScript', 'Web App', 'UI/UX'],
    liveUrl: 'https://as-classes.vercel.app',
    githubUrl: 'https://github.com/jatinjangid80/as-classes-',
    ctaText: 'Visit site',
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
