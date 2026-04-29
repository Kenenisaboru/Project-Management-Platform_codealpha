'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import api from '@/lib/api';
import { socket } from '@/lib/socket';
import { Project, Task, TaskStatus, TaskPriority } from '@/lib/shared/types';
import { Plus, MoreVertical, Calendar, User as UserIcon, Clock, Filter, X, Zap } from 'lucide-react';
import TaskDetailsModal from '@/components/ui/TaskDetailsModal';
import { toast } from 'sonner';

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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priority: null as TaskPriority | null,
    assignee: null as string | null,
  });

  const fetchData = useCallback(async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?projectId=${id}`),
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error('Fetch error', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();

    // Socket.io integration
    socket.emit('joinProject', id);

    socket.on('taskCreated', (newTask: Task) => {
      setTasks((prev) => [newTask, ...prev]);
      toast.success('New task added by teammate');
    });

    socket.on('taskUpdated', (updatedTask: Task) => {
      setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    });

    socket.on('taskDeleted', (deletedId: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== deletedId));
    });

    return () => {
      socket.emit('leaveProject', id);
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
  }, [id, fetchData]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId as TaskStatus;
    const taskIndex = tasks.findIndex(t => t.id === draggableId);
    if (taskIndex === -1) return;

    // Optimistic update
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(taskIndex, 1);
    movedTask.status = newStatus;
    updatedTasks.splice(destination.index, 0, movedTask);
    setTasks(updatedTasks);

    try {
      await api.put(`/tasks/${draggableId}`, { status: newStatus });
    } catch (err) {
      toast.error('Failed to update task status');
      fetchData(); // Rollback
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filters.priority && t.priority !== filters.priority) return false;
    if (filters.assignee && t.assigneeId !== filters.assignee) return false;
    return true;
  });

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
          <button className="glass-button flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </button>
        </div>
      </header>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 min-h-[600px]">
          {columns.map((column) => (
            <div key={column.status} className="flex flex-col rounded-2xl bg-white/5 p-4 border border-white/5">
              <div className="mb-4 flex items-center justify-between px-2">
                <h3 className="font-semibold flex items-center gap-2 text-white/80 uppercase text-xs tracking-widest">
                  {column.title}
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/40">
                    {filteredTasks.filter((t) => t.status === column.status).length}
                  </span>
                </h3>
              </div>

              <Droppable droppableId={column.status}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 space-y-4 rounded-xl transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-white/[0.02]' : ''}`}
                  >
                    {filteredTasks
                      .filter((t) => t.status === column.status)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedTask(task)}
                              className={`glass-card p-4 transition-all ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-2xl z-50 border-indigo-500/50' : 'hover:border-white/20'}`}
                            >
                              <div className="mb-3 flex flex-wrap gap-2">
                                {task.labels.map((label) => (
                                  <span key={label} className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400">
                                    {label}
                                  </span>
                                ))}
                              </div>
                              <h4 className="mb-3 font-medium text-white/90">{task.title}</h4>
                              <div className="flex items-center justify-between text-[10px] text-white/40">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-3 w-3" />
                                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                                </div>
                                <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
                                  <UserIcon className="h-2 w-2 text-indigo-400" />
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <TaskDetailsModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
      />
    </div>
  );
}

