"use client";

import { motion } from "framer-motion";
import { ArrowRight, Layers, Zap, Shield, Rocket } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl"
      >
        <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium backdrop-blur-md">
          <span className="mr-2 flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Now in Private Alpha v1.0
        </div>
        
        <h1 className="mb-6 font-outfit text-6xl font-bold tracking-tight md:text-8xl">
          The Work OS for <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Elite Teams.
          </span>
        </h1>
        
        <p className="mx-auto mb-10 max-w-2xl text-lg text-white/60 md:text-xl">
          TaskFlow Pro X combines the flexibility of Notion with the power of Jira. 
          Engineered for speed, choreography, and enterprise-grade collaboration.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/register">
            <button className="glass-button group flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-8 text-black transition-all hover:bg-white/90">
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
          <button className="glass-button h-12 rounded-xl px-8 font-medium">
            Watch Demo
          </button>
        </div>
      </motion.div>

      {/* Feature Grid */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="mt-32 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3"
      >
        {[
          { icon: Zap, title: "Zero Latency", desc: "Optimistic UI updates for a lag-free experience." },
          { icon: Shield, title: "Bank-Grade Security", desc: "Multi-tenant isolation and encrypted data." },
          { icon: Layers, title: "Infinite Workspaces", desc: "Organize everything from code to creative." },
        ].map((feature, i) => (
          <div key={i} className="glass-card p-8 text-left transition-all hover:border-white/20">
            <feature.icon className="mb-4 h-8 w-8 text-indigo-400" />
            <h3 className="mb-2 font-outfit text-xl font-semibold">{feature.title}</h3>
            <p className="text-sm text-white/50">{feature.desc}</p>
          </div>
        ))}
      </motion.div>
    </main>
  );
}
