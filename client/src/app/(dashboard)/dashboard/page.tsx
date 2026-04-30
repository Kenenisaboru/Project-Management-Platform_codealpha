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
import EmptyState from '@/components/ui/EmptyState';
import SearchBar from '@/components/ui/SearchBar';
import QuickActionsFAB from '@/components/ui/QuickActionsFAB';
import { ProjectCardSkeleton, StatCardSkeleton } from '@/components/ui/Skeleton';
import OnboardingTour from '@/components/OnboardingTour';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace);

  const [stats, setStats] = useState({
    activeProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    efficiency: 0
  });

  const fetchProjects = async () => {
    if (!currentWorkspace) return;
    
    setLoading(true);
    try {
      const [projRes, statsRes] = await Promise.all([
        api.get(`/projects?workspaceId=${currentWorkspace.id}`),
        api.get(`/workspaces/${currentWorkspace.id}/stats`)
      ]);
      setProjects(projRes.data);
      setFilteredProjects(projRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentWorkspace]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = projects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  }, [searchQuery, projects]);

  const statCards = [
    { label: 'Active Projects', value: stats.activeProjects, icon: FolderKanban, color: 'text-indigo-400' },
    { label: 'Pending Tasks', value: stats.pendingTasks, icon: Clock, color: 'text-amber-400' },
    { label: 'Completed Tasks', value: stats.completedTasks, icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Completion Rate', value: `${stats.efficiency}%`, icon: TrendingUp, color: 'text-pink-400' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-outfit text-4xl font-bold tracking-tight text-white">Overview</h1>
          <p className="text-white/50 text-lg">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar 
            onSearch={setSearchQuery} 
            placeholder="Search projects..."
            className="tour-search-bar"
          />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-black hover:bg-white/90 transition-all shadow-xl shrink-0"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">New Project</span>
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="tour-stats grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          statCards.map((stat, i) => (
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
          ))
        )}
      </div>

      {/* Projects Section */}
      <section className="tour-projects">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold font-outfit text-white">Recent Projects</h2>
          <Link href="/projects" className="text-sm text-indigo-400 hover:underline">View All</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {filteredProjects.length > 0 ? filteredProjects.slice(0, 6).map((project) => (
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
              <EmptyState 
                type="projects" 
                onCreate={() => setIsModalOpen(true)}
                actionLabel="Create Project"
              />
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

      <QuickActionsFAB
        onCreateProject={() => setIsModalOpen(true)}
        className="tour-quick-actions"
      />
      
      <OnboardingTour />
    </div>
  );
}
