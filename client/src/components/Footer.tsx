'use client';

import Link from 'next/link';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  Zap,
  Shield,
  Layers,
  Heart
} from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    Product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Changelog', href: '#changelog' },
      { name: 'Integrations', href: '#' },
    ],
    Company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Contact', href: '#' },
    ],
    Resources: [
      { name: 'Documentation', href: '#' },
      { name: 'Help Center', href: '#' },
      { name: 'Community', href: '#' },
      { name: 'Privacy Policy', href: '#' },
    ],
  };

  return (
    <footer className="border-t border-white/5 bg-black pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                T
              </div>
              <span className="font-outfit text-2xl font-bold tracking-tight text-white">
                TaskFlow Pro
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/50">
              The next-generation Work OS for elite teams. Experience speed, choreography, and precision in every task.
            </p>
            <div className="flex gap-4">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <Link key={i} href="#" className="rounded-full bg-white/5 p-2 text-white/40 hover:bg-white/10 hover:text-white transition-all">
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-white">{title}</h4>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-sm text-white/40 hover:text-indigo-400 transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-12 sm:flex-row">
          <p className="text-sm text-white/30">
            © {new Date().getFullYear()} TaskFlow Pro X. Built with <Heart className="inline h-3 w-3 text-red-500" /> for elite builders.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-xs text-white/30 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="text-xs text-white/30 hover:text-white transition-colors">Cookie Policy</Link>
            <Link href="#" className="text-xs text-white/30 hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
