"use client";

import { motion } from "framer-motion";
import { ArrowRight, Layers, Zap, Shield, Rocket, Star, Quote, Check, Crown, Mail, Lock, Eye, LogIn } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Collaboration from "@/components/Collaboration";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO at TechFlow",
    content: "KanuTech Pro transformed how our team collaborates. The real-time updates and intuitive interface increased our productivity by 40%.",
    avatar: "SC",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Product Manager at ScaleUp",
    content: "Finally, a project management tool that doesn't get in the way. The Kanban board is smooth and the activity feed keeps everyone aligned.",
    avatar: "MJ",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Lead Developer at CodeCraft",
    content: "The dark mode and keyboard shortcuts make it a developer's dream. We migrated from Jira and never looked back.",
    avatar: "ER",
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Perfect for individuals and small teams getting started.",
    features: [
      "Up to 5 team members",
      "3 active projects",
      "Basic Kanban board",
      "1GB storage",
      "Email support",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per user/month",
    description: "For growing teams that need more power and flexibility.",
    features: [
      "Unlimited team members",
      "Unlimited projects",
      "Advanced filters & search",
      "50GB storage",
      "Priority support",
      "Activity feed",
      "Custom integrations",
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact sales",
    description: "For large organizations with advanced security needs.",
    features: [
      "Everything in Pro",
      "SSO & SAML",
      "Advanced security controls",
      "Unlimited storage",
      "Dedicated account manager",
      "Custom contracts",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Home() {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Hero Section with Login */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <div className="mb-6 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium backdrop-blur-md">
              <span className="mr-2 flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Now in Elite Early Access v1.0
            </div>
            
            <h1 className="mb-6 font-outfit text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl leading-[1.1]">
              The Work OS for <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Elite Teams.
              </span>
            </h1>
            
            <p className="mb-10 max-w-xl text-lg text-white/60 md:text-xl">
              KanuTech Pro combines the flexibility of Notion with the power of Jira. 
              Engineered for speed, choreography, and enterprise-grade collaboration.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex -space-x-3 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="inline-block h-10 w-10 rounded-full border-2 border-black bg-white/10 backdrop-blur-sm" />
                ))}
              </div>
              <div className="text-sm">
                <span className="block font-bold text-white">Join 10k+ elite builders</span>
                <span className="text-white/50">Experience the future of work</span>
              </div>
            </div>
          </motion.div>

          {/* The Login Part Requested */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md mx-auto lg:ml-auto"
          >
            <div className="glass-card p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Crown className="h-12 w-12 text-indigo-500" />
              </div>
              
              <div className="mb-8">
                <h2 className="font-outfit text-4xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-white/60">Sign in to access your workspace</p>
              </div>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500/60" />
                    <input
                      type="email"
                      defaultValue="Gamachis@haramaya.edu.et"
                      className="w-full rounded-2xl border-none bg-[#F0F7FF] pl-12 pr-4 py-4 text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500/60" />
                    <input
                      type="password"
                      defaultValue="••••••••••••"
                      className="w-full rounded-2xl border-none bg-[#F0F7FF] pl-12 pr-12 py-4 text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400"
                    />
                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <label className="flex items-center gap-2 text-white/60 cursor-pointer">
                    <input type="checkbox" className="rounded border-white/20 bg-white/5 text-indigo-500" />
                    Remember me
                  </label>
                  <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                    Forgot password?
                  </Link>
                </div>

                <button className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 py-4 font-bold text-white shadow-xl shadow-indigo-500/20 hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Sign In to KanuTech Pro
                </button>

                <p className="text-center text-sm text-white/40">
                  New to KanuTech Pro?{' '}
                  <Link href="/register" className="text-white hover:underline font-bold">
                    Create free account
                  </Link>
                </p>
              </form>
            </div>
          </motion.div>
        </div>

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

        {/* Pricing Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-32 w-full max-w-6xl"
        >
          <h2 className="mb-4 font-outfit text-4xl font-bold text-white">
            Simple, <span className="text-indigo-400">transparent</span> pricing
          </h2>
          <p className="mb-12 text-white/50">No hidden fees. Cancel anytime.</p>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-card p-8 text-left relative ${
                  plan.popular ? 'border-indigo-500/50 bg-indigo-500/5' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1 text-xs font-bold text-white">
                      <Crown className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}
                
                <h3 className="mb-2 text-xl font-semibold text-white">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-white/50">/{plan.period}</span>
                </div>
                <p className="mb-6 text-sm text-white/50">{plan.description}</p>
                
                <ul className="mb-8 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                      <Check className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  className={`w-full rounded-xl py-3 font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:opacity-90'
                      : 'border border-white/20 text-white hover:bg-white/5'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Collaboration Section */}
        <Collaboration />
      </main>
      <Footer />
    </div>
  );
}
