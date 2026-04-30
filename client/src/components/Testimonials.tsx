'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    content: '"KanuTech Pro transformed how our team collaborates. The real-time updates and intuitive interface increased our productivity by 40%."',
    author: 'Sarah Chen',
    role: 'CTO at TechFlow',
    avatar: 'SC',
    color: 'bg-indigo-500',
  },
  {
    content: '"Finally, a project management tool that doesn\'t get in the way. The Kanban board is smooth and the activity feed keeps everyone aligned."',
    author: 'Marcus Johnson',
    role: 'Product Manager at ScaleUp',
    avatar: 'MJ',
    color: 'bg-purple-500',
  },
  {
    content: '"The dark mode and keyboard shortcuts make it a developer\'s dream. We migrated from Jira and never looked back."',
    author: 'Emily Rodriguez',
    role: 'Lead Developer at CodeCraft',
    avatar: 'ER',
    color: 'bg-emerald-500',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-outfit">
            Loved by <span className="text-indigo-400">elite teams</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card flex flex-col justify-between p-8"
            >
              <div>
                <div className="flex gap-1 mb-6 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-lg text-white/80 leading-relaxed italic">
                  {testimonial.content}
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full ${testimonial.color} flex items-center justify-center font-bold text-white shadow-lg`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-white">{testimonial.author}</h4>
                  <p className="text-sm text-white/40">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
