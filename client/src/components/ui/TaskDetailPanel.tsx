'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Clock, 
  Calendar, 
  User as UserIcon, 
  Tag, 
  MessageSquare, 
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  Save,
  Edit2
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '@/lib/shared/types';
import { format } from 'date-fns';
import RichTextEditor from './RichTextEditor';
import { socket } from '@/lib/socket';
import api from '@/lib/api';
import { toast } from 'sonner';

interface TaskDetailPanelProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedTask: Partial<Task>) => void;
}

export default function TaskDetailPanel({ task, isOpen, onClose, onUpdate }: TaskDetailPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(task?.description || '');
  const [comment, setComment] = useState('');
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (task) {
      setDescription(task.description || '');
      // In a real app, fetch activities for this task
      setActivities([
        { id: '1', user: 'System', text: `Task created`, time: task.createdAt },
        { id: '2', user: 'System', text: `Priority set to ${task.priority}`, time: task.createdAt }
      ]);
    }
  }, [task]);

  useEffect(() => {
    if (!task) return;

    const handleUpdate = (updatedTask: Task) => {
      if (updatedTask.id === task.id) {
        setActivities(prev => [{
          id: Date.now().toString(),
          user: 'Teammate',
          text: 'updated this task',
          time: new Date()
        }, ...prev]);
      }
    };

    socket.on('taskUpdated', handleUpdate);
    return () => {
      socket.off('taskUpdated', handleUpdate);
    };
  }, [task]);

  if (!task) return null;

  const handleSaveDescription = async () => {
    try {
      await api.put(`/tasks/${task.id}`, { description });
      onUpdate({ ...task, description });
      setIsEditing(false);
      toast.success('Description updated');
    } catch (err) {
      toast.error('Failed to update description');
    }
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    const newActivity = {
      id: Date.now().toString(),
      user: 'You',
      text: comment,
      time: new Date(),
      isComment: true
    };
    setActivities(prev => [newActivity, ...prev]);
    setComment('');
    // Emit comment event via socket if supported by backend
    socket.emit('newMessage', { taskId: task.id, text: comment });
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.URGENT: return 'text-red-400 bg-red-400/10';
      case TaskPriority.HIGH: return 'text-orange-400 bg-orange-400/10';
      case TaskPriority.MEDIUM: return 'text-indigo-400 bg-indigo-400/10';
      case TaskPriority.LOW: return 'text-emerald-400 bg-emerald-400/10';
      default: return 'text-white/40 bg-white/5';
    }
  };

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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 right-0 top-0 z-50 w-full max-w-xl border-l border-white/10 bg-zinc-950 shadow-2xl"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 p-6">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </div>
                  <span className="text-white/20">/</span>
                  <span className="text-sm font-medium text-white/40">{task.status.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={onClose}
                    className="rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white transition-all"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="mb-8">
                  <h2 className="font-outfit text-3xl font-bold text-white leading-tight mb-4">
                    {task.title}
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-6 border-y border-white/5 py-6">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-white/30 uppercase tracking-widest flex items-center gap-2">
                        <UserIcon className="h-3 w-3" /> Assignee
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <div className="h-6 w-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] text-indigo-400 font-bold uppercase">
                          {(task as any).assigneeId?.firstName?.[0] || 'U'}
                        </div>
                        <span className="text-sm text-white/80">
                          {(task as any).assigneeId ? `${(task as any).assigneeId.firstName} ${(task as any).assigneeId.lastName}` : 'Unassigned'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-white/30 uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="h-3 w-3" /> Due Date
                      </p>
                      <p className="text-sm text-white/80 pt-1">
                        {task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No due date'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description with Rich Text */}
                <div className="mb-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Description</h3>
                    <button 
                      onClick={() => isEditing ? handleSaveDescription() : setIsEditing(true)}
                      className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      {isEditing ? (
                        <><Save className="h-3 w-3" /> Save Changes</>
                      ) : (
                        <><Edit2 className="h-3 w-3" /> Edit Description</>
                      )}
                    </button>
                  </div>
                  
                  {isEditing ? (
                    <RichTextEditor 
                      content={description} 
                      onChange={setDescription} 
                      placeholder="Describe the task in detail..."
                    />
                  ) : (
                    <div 
                      className="rounded-xl bg-white/5 p-4 text-white/70 leading-relaxed min-h-[120px] prose prose-invert prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: description || 'No description provided.' }}
                    />
                  )}
                </div>

                {/* Activity Feed */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> Activity
                  </h3>
                  
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex gap-3">
                        <div className={`h-8 w-8 rounded-full ${activity.isComment ? 'bg-indigo-500/20' : 'bg-white/10'} shrink-0 flex items-center justify-center text-[10px] font-bold text-indigo-400`}>
                          {activity.user[0]}
                        </div>
                        <div className={`flex-1 rounded-xl p-3 ${activity.isComment ? 'bg-indigo-500/5 border border-indigo-500/10' : 'bg-white/5'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-bold text-white/80">{activity.user}</p>
                            <p className="text-[10px] text-white/30">{format(new Date(activity.time), 'HH:mm')}</p>
                          </div>
                          <p className="text-sm text-white/60 leading-relaxed">{activity.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comment Input */}
              <div className="border-t border-white/5 p-6 bg-zinc-900/50">
                <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-2 focus-within:border-indigo-500/50 transition-all">
                  <div className="h-8 w-8 rounded-full bg-indigo-500/20 shrink-0 flex items-center justify-center text-xs font-bold text-indigo-400">Y</div>
                  <input 
                    type="text" 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    placeholder="Add a comment..." 
                    className="flex-1 bg-transparent text-sm text-white outline-none"
                  />
                  <button 
                    onClick={handleAddComment}
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

