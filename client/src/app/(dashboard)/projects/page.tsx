'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, FolderKanban, Clock, Search, Filter } from 'lucide-react';
import api from '@/lib/api';
import { Project } from '@/lib/shared/types';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import CreateProjectModal from '@/components/ui/CreateProjectModal';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
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

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-outfit text-4xl font-bold tracking-tight text-white">Projects</h1>
          <p className="text-white/50 text-lg">Manage and track all your team initiatives.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-black hover:bg-white/90 transition-all shadow-lg"
        >
          <Plus className="h-5 w-5" />
          New Project
        </button>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white focus:border-indigo-500 focus:outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/60 hover:bg-white/10 transition-all">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-48 animate-pulse rounded-2xl bg-white/5 border border-white/10" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.length > 0 ? filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/projects/${project.id}`}>
                <div className="glass-card group p-6 hover:border-indigo-500/30 transition-all">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="h-12 w-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xl uppercase">
                      {project.name[0]}
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                      project.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400' :
                      project.status === 'PLANNING' ? 'bg-indigo-500/10 text-indigo-400' :
                      'bg-white/5 text-white/40'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {project.name}
                  </h3>
                  <p className="line-clamp-2 text-sm text-white/40 mb-6 min-h-[40px]">
                    {project.description || 'No description provided.'}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-white/30">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Updated 2h ago
                    </span>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="h-6 w-6 rounded-full bg-white/10 border border-black flex items-center justify-center">
                          <span className="text-[10px] font-bold">U{n}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )) : (
            <div className="col-span-full py-20 text-center glass-card border-dashed">
              <FolderKanban className="mx-auto h-12 w-12 text-white/10 mb-4" />
              <p className="text-white/40">No projects match your search.</p>
            </div>
          )}
        </div>
      )}

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
