'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Starter',
    price: '$0',
    description: 'Perfect for individuals and small teams getting started.',
    features: ['Up to 5 team members', '3 active projects', 'Basic Kanban board', '1GB storage', 'Email support'],
    buttonText: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$12',
    description: 'For growing teams that need more power and flexibility.',
    features: ['Unlimited team members', 'Unlimited projects', 'Advanced filters & search', '50GB storage', 'Priority support', 'Activity feed', 'Custom integrations'],
    buttonText: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with advanced security needs.',
    features: ['Everything in Pro', 'SSO & SAML', 'Advanced security controls', 'Unlimited storage', 'Dedicated account manager', 'Custom contracts', 'SLA guarantee'],
    buttonText: 'Contact Sales',
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section className="py-24 sm:py-32" id="pricing">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl font-outfit">
            Choose the right plan for your team
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              whileHover={{ y: -10 }}
              className={`relative flex flex-col justify-between rounded-3xl p-8 ring-1 transition-all ${
                tier.popular 
                ? 'bg-zinc-900/50 ring-indigo-500 shadow-2xl shadow-indigo-500/10' 
                : 'bg-zinc-950 ring-white/10 hover:ring-white/20'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-1 text-xs font-bold text-white flex items-center gap-1 shadow-lg">
                  <span className="text-[10px]">👑</span> Most Popular
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white font-outfit">{tier.name}</h3>
                <div className="mt-4 flex items-baseline gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-white">{tier.price}</span>
                  {tier.price !== 'Custom' && <span className="text-sm font-semibold leading-6 text-white/40">/per user/month</span>}
                </div>
                <p className="mt-6 text-sm leading-6 text-white/50">{tier.description}</p>
                <ul className="mt-8 space-y-3 text-sm leading-6 text-white/70">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="h-5 w-5 flex-none text-emerald-400" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className={`mt-10 block w-full rounded-xl px-3 py-4 text-center text-sm font-bold transition-all ${
                  tier.popular
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:from-indigo-500 hover:to-purple-500'
                    : 'bg-white/5 text-white ring-1 ring-inset ring-white/10 hover:bg-white/10'
                }`}
              >
                {tier.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
