'use client';

import { motion } from 'framer-motion';

const logos = [
  { name: 'Vercel', logo: '▲' },
  { name: 'Stripe', logo: 'S' },
  { name: 'Linear', logo: 'L' },
  { name: 'Raycast', logo: 'R' },
  { name: 'Supabase', logo: '⚡' },
];

export default function LogoCloud() {
  return (
    <section className="bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-sm font-semibold leading-8 text-white/30 uppercase tracking-[0.2em] mb-12">
          Trusted by innovative teams worldwide
        </h2>
        <div className="mx-auto grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-3 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          {logos.map((company) => (
            <motion.div
              key={company.name}
              whileHover={{ scale: 1.05, filter: 'brightness(1.5)' }}
              className="flex items-center justify-center gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 font-bold text-white text-xl">
                {company.logo}
              </div>
              <span className="text-lg font-outfit font-bold text-white/80">
                {company.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
