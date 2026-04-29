"use client";

import { motion } from "framer-motion";
import { ArrowRight, Layers, Zap, Shield, Rocket, Star, Quote, Check, Crown } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO at TechFlow",
    content: "TaskFlow Pro X transformed how our team collaborates. The real-time updates and intuitive interface increased our productivity by 40%.",
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
      <main className="flex flex-col items-center justify-center p-6 text-center pt-32">
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

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-32 w-full max-w-6xl"
        >
          <h2 className="mb-12 font-outfit text-4xl font-bold text-white">
            Loved by <span className="text-indigo-400">elite teams</span>
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 text-left"
              >
                <div className="mb-4 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-6 text-sm text-white/70 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{testimonial.name}</p>
                    <p className="text-xs text-white/50">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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

        {/* Social Proof */}
        <Testimonials />

        {/* Pricing Section */}
        <Pricing />
      </main>
    </div>
  );
}
