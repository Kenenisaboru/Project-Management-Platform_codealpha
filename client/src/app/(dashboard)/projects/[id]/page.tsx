'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Project, Task, TaskStatus } from '@/lib/shared/types';
import { Plus, MoreVertical, Calendar, User as UserIcon, Clock } from 'lucide-react';
import CreateTaskModal from '@/components/ui/CreateTaskModal';
import TaskDetailPanel from '@/components/ui/TaskDetailPanel';
import { socketService } from '@/lib/socket';

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
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await api.get(`/tasks?projectId=${id}`);
      setTasks(response.data);
    } catch (err) {
      console.error('Fetch tasks error', err);
    }
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projRes = await api.get(`/projects/${id}`);
        setProject(projRes.data);
        await fetchTasks();
      } catch (err) {
        console.error('Fetch error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Socket.io Setup
    const socket = socketService.connect();
    socket.emit('joinProject', id);

    socket.on('taskCreated', (newTask: Task) => {
      setTasks((prev) => {
        if (prev.find(t => t.id === newTask.id)) return prev;
        return [newTask, ...prev];
      });
    });

    socket.on('taskUpdated', (updatedTask: Task) => {
      setTasks((prev) => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    });

    socket.on('taskDeleted', (taskId: string) => {
      setTasks((prev) => prev.filter(t => t.id !== taskId));
    });

    return () => {
      socket.emit('leaveProject', id);
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
  }, [id, fetchTasks]);

  const handleTaskCreated = (newTask: Task) => {
    // Optimistic update already handled by socket if backend emits to reporter too
    // but we can ensure it's here
    setTasks((prev) => {
      if (prev.find(t => t.id === newTask.id)) return prev;
      return [newTask, ...prev];
    });
  };

  if (loading) return (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
    </div>
  );
  
  if (!project) return (
    <div className="flex h-full items-center justify-center text-white/40">
      Project not found
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xl">
              {project.name[0]}
            </div>
            <h1 className="text-3xl font-bold font-outfit text-white">{project.name}</h1>
          </div>
          <p className="text-white/50">{project.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 font-bold text-black hover:bg-white/90 transition-all shadow-xl shadow-white/5"
          >
            <Plus className="h-5 w-5" />
            New Task
          </button>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 min-h-[600px] pb-10">
        {columns.map((column) => (
          <div key={column.status} className="flex flex-col rounded-2xl bg-white/5 p-4 border border-white/5 backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between px-2">
              <h3 className="font-semibold flex items-center gap-2 text-white/80">
                {column.title}
                <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-white/40 border border-white/5">
                  {tasks.filter((t) => t.status === column.status).length}
                </span>
              </h3>
              <button className="text-white/30 hover:text-white transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-4">
              <AnimatePresence mode="popLayout">
                {tasks
                  .filter((t) => t.status === column.status)
                  .map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => {
                        setSelectedTask(task);
                        setIsPanelOpen(true);
                      }}
                      className="glass-card group cursor-pointer p-4 hover:border-indigo-500/30 transition-all active:scale-[0.98]"
                    >
                      <div className="mb-3 flex flex-wrap gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          task.priority === 'URGENT' ? 'bg-red-500/10 text-red-400' :
                          task.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-400' :
                          'bg-indigo-500/10 text-indigo-400'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <h4 className="mb-4 font-medium text-white/90 leading-tight">{task.title}</h4>
                      <div className="flex items-center justify-between text-xs text-white/40">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                          </span>
                        </div>
                        <div className="h-7 w-7 rounded-full bg-white/10 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/50 transition-all">
                          <UserIcon className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-4 text-sm font-medium text-white/20 hover:border-white/30 hover:text-white/40 transition-all group"
              >
                <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
                Add Task
              </button>
            </div>
          </div>
        ))}
      </div>

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        projectId={id as string}
        onTaskCreated={handleTaskCreated}
      />
      <TaskDetailPanel 
        task={selectedTask}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onUpdate={(updates) => {
          // TODO: Implement task update logic
          setTasks(prev => prev.map(t => t.id === selectedTask?.id ? { ...t, ...updates } : t));
        }}
      />
    </div>
  );
}
