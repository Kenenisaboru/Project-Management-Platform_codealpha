'use client';

import { motion } from 'framer-motion';
import { Search, Zap, Shield, Layers, Rocket, ArrowRight, CheckCircle } from 'lucide-react';

export default function AuthSidebar() {
  const features = [
    { icon: Zap, title: 'Lightning Fast', description: 'Optimistic UI updates for zero-latency experience' },
    { icon: Shield, title: 'Bank-Grade Security', description: 'Enterprise-grade encryption and data protection' },
    { icon: Layers, title: 'Infinite Workspaces', description: 'Organize everything from code to creative projects' },
    { icon: Rocket, title: 'AI-Powered', description: 'Smart suggestions and automated workflows' },
  ];

  const stats = [
    { label: 'Active Projects', value: '10K+' },
    { label: 'Team Members', value: '50K+' },
    { label: 'Tasks Completed', value: '1M+' },
    { label: 'Uptime', value: '99.9%' },
  ];

  return (
    <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/20" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -right-1/2 w-full h-full"
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </motion.div>
      </div>

      <div className="relative z-10 flex flex-col h-full p-12">
        {/* Logo and Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 text-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#00A8E8] to-[#88C057] shadow-lg overflow-hidden">
              <img src="http://192.168.137.89:5000/static/photo_2026-04-30_18-04-43.jpg" alt="KanuTech Logo" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement!.innerHTML = '<span class="text-white font-bold text-2xl">K</span>'; }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">KanuTech Pro</h1>
              <p className="text-sm text-white/80">Enterprise Work OS</p>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
            <input
              type="text"
              placeholder="Search features, pricing, or help..."
              className="w-full rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-12 py-4 text-white placeholder:text-white/60 focus:outline-none focus:border-white/40 transition-all"
            />
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs text-white/60">
              <span>Ctrl</span>
              <span>K</span>
            </kbd>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Why Choose KanuTech Pro?</h2>
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-4"
              >
                <feature.icon className="h-6 w-6 text-white mb-3" />
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/80">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold text-white mb-6">Trusted by Elite Teams</h2>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-auto"
        >
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Ready to get started?</h3>
            <p className="text-sm text-white/80 mb-4">
              Join thousands of teams already using KanuTech Pro to accelerate their workflow.
            </p>
            <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-white text-indigo-600 px-6 py-3 font-semibold hover:bg-white/90 transition-all">
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 flex items-center gap-6 text-xs text-white/60"
        >
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>SOC 2 Certified</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>ISO 27001</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
