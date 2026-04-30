'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 sm:pt-6 px-4">
      <nav className="flex w-full max-w-5xl items-center justify-between rounded-2xl sm:rounded-full border border-white/10 bg-[#0A0A0A]/60 px-4 sm:px-6 py-3 backdrop-blur-2xl shadow-2xl shadow-black/50">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00A8E8] to-[#88C057] shadow-[0_0_15px_rgba(0,168,232,0.4)] transition-transform group-hover:scale-105 group-hover:rotate-3 group-hover:shadow-[0_0_25px_rgba(136,192,87,0.6)] overflow-hidden">
            <img src="http://localhost:5000/static/photo_2026-04-30_18-04-43.jpg" alt="KanuTech Logo" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="text-white font-bold text-xl">K</span>'; }} />
          </div>
          <span className="font-outfit text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 hidden sm:block transition-colors group-hover:text-white">
            KanuTech Pro
          </span>
        </Link>

        {/* Middle Links */}
        <div className="hidden items-center gap-1 md:flex bg-white/5 p-1 rounded-full border border-white/5">
          {['Features', 'Changelog', 'Pricing'].map((item) => (
            <Link 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="relative rounded-full px-5 py-2 text-sm font-medium text-white/70 transition-all hover:text-white hover:bg-white/10"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="hidden sm:block text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            Log in
          </Link>
          <Link href="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group overflow-hidden rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black transition-all hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
            >
              <span className="relative z-10">Sign Up</span>
            </motion.button>
          </Link>
        </div>
      </nav>
    </div>
  );
}
