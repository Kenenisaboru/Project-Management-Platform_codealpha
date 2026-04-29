'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, FolderKanban, CheckSquare, UserPlus, XCircle } from 'lucide-react';

interface QuickActionsFABProps {
  onCreateProject?: () => void;
  onCreateTask?: () => void;
  onInviteTeam?: () => void;
}

export default function QuickActionsFAB({ onCreateProject, onCreateTask, onInviteTeam }: QuickActionsFABProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: FolderKanban, label: 'New Project', onClick: onCreateProject, color: 'bg-indigo-500' },
    { icon: CheckSquare, label: 'New Task', onClick: onCreateTask, color: 'bg-emerald-500' },
    { icon: UserPlus, label: 'Invite Team', onClick: onInviteTeam, color: 'bg-purple-500' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-4 flex flex-col gap-3 items-end"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  action.onClick?.();
                  setIsOpen(false);
                }}
                disabled={!action.onClick}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-white shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${action.color}`}
              >
                <span className="text-sm font-medium">{action.label}</span>
                <action.icon className="h-5 w-5" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-2xl shadow-indigo-500/30"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
