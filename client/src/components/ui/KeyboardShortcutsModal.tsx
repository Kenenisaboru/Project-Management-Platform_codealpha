'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard, Search, Plus, User, LogOut, Command } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { key: 'K', description: 'Search projects and tasks', icon: Search },
  { key: 'N', description: 'Create new project', icon: Plus },
  { key: 'T', description: 'Create new task', icon: Plus },
  { key: 'U', description: 'Go to user profile', icon: User },
  { key: 'L', description: 'Logout', icon: LogOut },
  { key: '?', description: 'Show keyboard shortcuts', icon: Keyboard },
];

export default function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 z-50 m-auto max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-500/20 p-2.5 text-indigo-400">
                    <Keyboard className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Keyboard Shortcuts</h2>
                    <p className="text-sm text-white/50">Press ? to open this menu</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-3">
                  {shortcuts.map((shortcut, index) => {
                    const Icon = shortcut.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between rounded-xl bg-white/5 p-4 border border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-white/10 p-2 text-white/60">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-sm text-white/80">{shortcut.description}</span>
                        </div>
                        <kbd className="flex items-center gap-1 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-mono text-white/60">
                          <Command className="h-3 w-3" />
                          {shortcut.key}
                        </kbd>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-4">
                  <p className="text-sm text-indigo-300">
                    <strong>Tip:</strong> These shortcuts work when you're focused on the main content area.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 p-6">
                <button
                  onClick={onClose}
                  className="w-full rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-white/90 transition-all"
                >
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
