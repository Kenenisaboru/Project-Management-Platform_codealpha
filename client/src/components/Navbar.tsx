'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/5 bg-[#0A0A0A]/80 px-6 py-3 backdrop-blur-xl md:px-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
          T
        </div>
        <span className="font-outfit text-xl font-bold tracking-tight text-white hidden sm:block">
          TaskFlow Pro
        </span>
      </Link>

      {/* Middle Links */}
      <div className="hidden items-center gap-8 md:flex">
        {['Features', 'Changelog', 'Pricing'].map((item) => (
          <Link 
            key={item} 
            href={`#${item.toLowerCase()}`}
            className="text-sm font-medium text-white/50 transition-colors hover:text-white"
          >
            {item}
          </Link>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-6">
        <Link 
          href="/login" 
          className="text-sm font-medium text-white/50 transition-colors hover:text-white"
        >
          Log in
        </Link>
        <Link href="/register">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition-all hover:bg-white/90 shadow-xl shadow-white/5"
          >
            Sign Up
          </motion.button>
        </Link>
      </div>
    </nav>
  );
}
