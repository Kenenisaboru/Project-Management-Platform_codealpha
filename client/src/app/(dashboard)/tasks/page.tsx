'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import api from '@/lib/api';
import { Task, TaskStatus, TaskPriority } from '@/lib/shared/types';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter,
  MoreHorizontal,
  ChevronRight,
  Layout
} from 'lucide-react';
import Link from 'next/link';

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchMyTasks = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const response = await api.get(`/tasks?assigneeId=${user.id}`);
        setTasks(response.data);
      } catch (err) {
        console.error('Fetch tasks error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTasks();
  }, [user]);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.URGENT: return 'text-red-400 bg-red-400/10';
      case TaskPriority.HIGH: return 'text-orange-400 bg-orange-400/10';
      case TaskPriority.MEDIUM: return 'text-indigo-400 bg-indigo-400/10';
      case TaskPriority.LOW: return 'text-emerald-400 bg-emerald-400/10';
      default: return 'text-white/40 bg-white/5';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE: return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case TaskStatus.IN_PROGRESS: return <Clock className="h-4 w-4 text-indigo-400" />;
      case TaskStatus.REVIEW: return <AlertCircle className="h-4 w-4 text-amber-400" />;
      default: return <div className="h-2 w-2 rounded-full bg-white/20" />;
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-outfit text-4xl font-bold tracking-tight text-white">My Tasks</h1>
        <p className="text-white/50 text-lg">Focus on what needs to be done next.</p>
      </header>

      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">
            <Filter className="h-4 w-4 text-white/30" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-sm text-white/80 outline-none"
            >
              <option value="ALL">All Status</option>
              {Object.values(TaskStatus).map(status => (
                <option key={status} value={status}>{status.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden border-white/5">
        {loading ? (
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4, 5].map(n => (
              <div key={n} className="h-16 animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                    {getStatusIcon(task.status)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="truncate font-medium text-white group-hover:text-indigo-400 transition-colors">
                        {task.title}
                      </h3>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/30">
                      <span className="flex items-center gap-1">
                        <Layout className="h-3 w-3" />
                        {(task as any).projectId?.name || 'Project'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link 
                      href={`/projects/${task.projectId}`}
                      className="rounded-lg bg-white/5 p-2 text-white/40 hover:bg-white/10 hover:text-white transition-all"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                    <button className="rounded-lg p-2 text-white/20 hover:text-white transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-white/40">No tasks found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
