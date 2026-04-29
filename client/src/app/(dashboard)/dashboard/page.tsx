'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, FolderKanban, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import api from '@/lib/api';
import { Project } from '@/lib/shared/types';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import CreateProjectModal from '@/components/ui/CreateProjectModal';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace);

  const fetchProjects = async () => {
    if (!currentWorkspace) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/projects?workspaceId=${currentWorkspace.id}`);
      setProjects(response.data);
    } catch (err) {
      console.error('Fetch projects error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentWorkspace]);

  const stats = [
    { label: 'Active Projects', value: projects.length, icon: FolderKanban, color: 'text-indigo-400' },
    { label: 'Tasks Due Today', value: '12', icon: Clock, color: 'text-amber-400' },
    { label: 'Completed Tasks', value: '128', icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Efficiency', value: '+14%', icon: TrendingUp, color: 'text-pink-400' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-outfit text-4xl font-bold tracking-tight text-white">Overview</h1>
          <p className="text-white/50 text-lg">Welcome back! Here's what's happening today.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-black hover:bg-white/90 transition-all shadow-xl"
        >
          <Plus className="h-5 w-5" />
          New Project
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className={`rounded-lg bg-white/5 p-2 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-white/40">{stat.label}</p>
            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Projects Section */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold font-outfit text-white">Recent Projects</h2>
          <Link href="/projects" className="text-sm text-indigo-400 hover:underline">View All</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-48 animate-pulse rounded-2xl bg-white/5 border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {projects.length > 0 ? projects.slice(0, 6).map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="glass-card group p-6 transition-all hover:border-indigo-500/30"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="h-10 w-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold uppercase">
                      {project.name[0]}
                    </div>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold uppercase text-white/40 border border-white/5">
                      {project.status}
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {project.name}
                  </h3>
                  <p className="line-clamp-2 text-sm text-white/40 mb-4">
                    {project.description || 'No description provided.'}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-white/30">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Updated 2h ago
                    </span>
                  </div>
                </motion.div>
              </Link>
            )) : (
              <div className="col-span-full py-20 text-center glass-card border-dashed">
                <p className="text-white/40">No projects found. Create your first one!</p>
              </div>
            )}
          </div>
        )}
      </section>

      {currentWorkspace && (
        <CreateProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          workspaceId={currentWorkspace.id}
          onProjectCreated={fetchProjects}
        />
      )}
    </div>
  );
}
