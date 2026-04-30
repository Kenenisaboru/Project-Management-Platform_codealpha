'use client';

import { motion } from 'framer-motion';
import { Users, Zap, Globe, MessageSquare, Rocket } from 'lucide-react';
import Link from 'next/link';

export default function Collaboration() {
  const features = [
    {
      icon: Users,
      title: 'Real-time Collaboration',
      desc: 'Work together with your team members in real-time on any project.',
    },
    {
      icon: Zap,
      title: 'Instant Updates',
      desc: 'See changes as they happen with our high-speed sync engine.',
    },
    {
      icon: MessageSquare,
      title: 'Team Chat',
      desc: 'Discuss tasks and share ideas directly within your workspace.',
    },
    {
      icon: Globe,
      title: 'Global Access',
      desc: 'Access your projects from anywhere in the world, on any device.',
    },
  ];

  return (
    <section className="py-24 sm:py-32" id="collaboration">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="glass-card overflow-hidden bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 p-12 lg:p-20">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-base font-semibold leading-7 text-indigo-400">KanuTech Pro is Free Forever</h2>
              <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-6xl font-outfit">
                Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">collaborate</span> together.
              </p>
              <p className="mt-6 text-lg leading-8 text-white/50">
                Forget complicated pricing tiers. KanuTech Pro is designed for everyone to build amazing projects together, for free. Invite your team, start a project, and experience the future of work.
              </p>
              
              <div className="mt-10 flex items-center gap-x-6">
                <Link href="/register">
                  <button className="rounded-full bg-white px-8 py-4 text-sm font-bold text-black shadow-lg hover:bg-white/90 transition-all">
                    Start Collaborating Now
                  </button>
                </Link>
                <Link href="/login" className="text-sm font-semibold leading-6 text-white hover:text-indigo-400 transition-colors">
                  Join a Workspace <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl bg-white/5 p-6 border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Big CTA */}
        <div className="mt-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-bold text-indigo-400 border border-white/5 mb-8">
            <Rocket className="h-3 w-3" />
            No credit card required. Ever.
          </div>
          <h3 className="text-3xl font-bold text-white font-outfit mb-4">Ready to build something great?</h3>
          <p className="text-white/40 max-w-xl mx-auto mb-10">
            Join thousands of teams who have already switched to KanuTech Pro for their daily collaboration needs.
          </p>
        </div>
      </div>
    </section>
  );
}
