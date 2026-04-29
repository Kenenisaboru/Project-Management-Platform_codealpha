'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Project, Task, TaskStatus, TaskPriority } from '@/lib/shared/types';
import { Plus, MoreVertical, Calendar, User as UserIcon, Clock, Filter, X } from 'lucide-react';
import TaskDetailsModal from '@/components/ui/TaskDetailsModal';

const columns: { title: string; status: TaskStatus }[] = [
  { title: 'To Do', status: TaskStatus.TODO },
  { title: 'In Progress', status: TaskStatus.IN_PROGRESS },
  { title: 'Review', status: TaskStatus.REVIEW },
  { title: 'Done', status: TaskStatus.DONE },
];

export default function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priority: null as TaskPriority | null,
    assignee: null as string | null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, tasksRes] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get(`/tasks?projectId=${id}`),
        ]);
        setProject(projRes.data);
        setTasks(tasksRes.data);
        setFilteredTasks(tasksRes.data);
      } catch (err) {
        console.error('Fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    let filtered = tasks;
    
    if (filters.priority) {
      filtered = filtered.filter(t => t.priority === filters.priority);
    }
    
    if (filters.assignee) {
      filtered = filtered.filter(t => t.assigneeId === filters.assignee);
    }
    
    setFilteredTasks(filtered);
  }, [filters, tasks]);

  const clearFilters = () => {
    setFilters({ priority: null, assignee: null });
  };

  const hasActiveFilters = filters.priority || filters.assignee;

  if (loading) return <div className="flex h-full items-center justify-center text-white">Loading...</div>;
  if (!project) return <div className="flex h-full items-center justify-center text-white/40">Project not found</div>;

  return (
    <div className="flex h-full flex-col">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
              {project.name[0]}
            </div>
            <h1 className="text-3xl font-bold font-outfit">{project.name}</h1>
          </div>
          <p className="text-white/50">{project.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`glass-button flex items-center gap-2 ${hasActiveFilters ? 'bg-indigo-500/20 border-indigo-500/50' : ''}`}
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && <span className="h-2 w-2 rounded-full bg-indigo-400" />}
            </button>
            
            {filterOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-white/10 bg-zinc-900 shadow-2xl p-4 z-50">
                <div className="mb-4">
                  <label className="mb-2 block text-xs font-medium text-white/60">Priority</label>
                  <select
                    value={filters.priority || ''}
                    onChange={(e) => setFilters({ ...filters, priority: e.target.value as TaskPriority | null })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">All Priorities</option>
                    <option value={TaskPriority.LOW}>Low</option>
                    <option value={TaskPriority.MEDIUM}>Medium</option>
                    <option value={TaskPriority.HIGH}>High</option>
                    <option value={TaskPriority.URGENT}>Urgent</option>
                  </select>
                </div>
                
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-all"
                  >
                    <X className="h-4 w-4" />
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
          
          <button className="glass-button flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </button>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 min-h-[600px]">
        {columns.map((column) => (
          <div key={column.status} className="flex flex-col rounded-2xl bg-white/5 p-4 border border-white/5">
            <div className="mb-4 flex items-center justify-between px-2">
              <h3 className="font-semibold flex items-center gap-2">
                {column.title}
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-white/40">
                  {filteredTasks.filter((t) => t.status === column.status).length}
                </span>
              </h3>
              <button className="text-white/30 hover:text-white transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-4">
              <AnimatePresence>
                {filteredTasks
                  .filter((t) => t.status === column.status)
                  .map((task) => (
                    <motion.div
                      key={task.id}
                      layoutId={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="glass-card cursor-grab p-4 active:cursor-grabbing hover:border-white/20 transition-all"
                    >
                      <div className="mb-3 flex flex-wrap gap-2">
                        {task.labels.map((label) => (
                          <span key={label} className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400">
                            {label}
                          </span>
                        ))}
                      </div>
                      <h4 className="mb-3 font-medium">{task.title}</h4>
                      <div className="flex items-center justify-between text-xs text-white/40">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                          </span>
                        </div>
                        <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                          <UserIcon className="h-3 w-3" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
              
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-3 text-sm text-white/30 hover:border-white/20 hover:text-white/50 transition-all">
                <Plus className="h-4 w-4" />
                Add Task
              </button>
            </div>
          </div>
        ))}
      </div>

      <TaskDetailsModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
      />
    </div>
  );
}
