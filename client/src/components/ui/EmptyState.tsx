'use client';

import { motion } from 'framer-motion';
import { Plus, FolderKanban, CheckSquare, Users, Rocket } from 'lucide-react';

interface EmptyStateProps {
  type: 'projects' | 'tasks' | 'team' | 'dashboard';
  onCreate?: () => void;
  actionLabel?: string;
}

const emptyStates = {
  projects: {
    icon: FolderKanban,
    title: 'No projects yet',
    description: 'Create your first project to start organizing your work and collaborating with your team.',
  },
  tasks: {
    icon: CheckSquare,
    title: 'No tasks in this project',
    description: 'Add tasks to your project to track progress and assign work to team members.',
  },
  team: {
    icon: Users,
    title: 'No team members yet',
    description: 'Invite team members to collaborate on projects and tasks together.',
  },
  dashboard: {
    icon: Rocket,
    title: 'Welcome to TaskFlow Pro X',
    description: 'Get started by creating your first workspace and project.',
  },
};

export default function EmptyState({ type, onCreate, actionLabel }: EmptyStateProps) {
  const config = emptyStates[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="mb-6 rounded-full bg-white/5 p-6 border border-white/10">
        <Icon className="h-12 w-12 text-indigo-400" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">{config.title}</h3>
      <p className="mb-8 max-w-md text-sm text-white/50">{config.description}</p>
      {onCreate && (
        <button
          onClick={onCreate}
          className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-white/90 transition-all shadow-xl"
        >
          <Plus className="h-5 w-5" />
          {actionLabel || 'Create'}
        </button>
      )}
    </motion.div>
  );
}
