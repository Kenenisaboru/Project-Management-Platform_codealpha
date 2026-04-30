'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User as UserIcon, Tag, MessageSquare, Paperclip, Edit2, Trash2, Send } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '@/lib/shared/types';
import { useState } from 'react';
import { toast } from '@/components/ui/Toast';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const priorityColors = {
  LOW: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  MEDIUM: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  URGENT: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusColors = {
  BACKLOG: 'bg-slate-500/20 text-slate-400',
  TODO: 'bg-blue-500/20 text-blue-400',
  IN_PROGRESS: 'bg-amber-500/20 text-amber-400',
  REVIEW: 'bg-purple-500/20 text-purple-400',
  DONE: 'bg-emerald-500/20 text-emerald-400',
};

export default function TaskDetailsModal({ isOpen, onClose, task }: TaskDetailsModalProps) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'John Doe',
      content: 'This task is progressing well. Let me know if you need any help.',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'me',
      userName: 'You',
      content: comment,
      createdAt: new Date().toISOString(),
    };

    setComments([...comments, newComment]);
    setComment('');
    toast.success('Comment added');
  };

  if (!task) return null;

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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 z-50 m-auto max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-white/10 p-6">
                <div className="flex-1">
                  <div className="mb-3 flex items-center gap-2">
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${statusColors[task.status]}`}>
                      {task.status}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{task.title}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {task.description && (
                  <div className="mb-6">
                    <h3 className="mb-2 text-sm font-semibold text-white/60">Description</h3>
                    <p className="text-sm text-white/80">{task.description}</p>
                  </div>
                )}

                {/* Metadata */}
                <div className="mb-6 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <UserIcon className="h-4 w-4" />
                    <span>Assignee: {task.assigneeId || 'Unassigned'}</span>
                  </div>
                  {task.dueDate && (
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Labels */}
                {task.labels.length > 0 && (
                  <div className="mb-6">
                    <h3 className="mb-2 text-sm font-semibold text-white/60">Labels</h3>
                    <div className="flex flex-wrap gap-2">
                      {task.labels.map((label) => (
                        <span
                          key={label}
                          className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-400 border border-indigo-500/30"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments Section */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-white/60 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Comments
                  </h3>
                  <div className="space-y-3">
                    {comments.map((c) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-xl bg-white/5 p-4 border border-white/10"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                            {c.userName.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-white">{c.userName}</span>
                          <span className="text-xs text-white/40">
                            {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-white/70">{c.content}</p>
                      </motion.div>
                    ))}
                  </div>
                  <form onSubmit={handleAddComment} className="mt-4 relative">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full rounded-xl border border-white/10 bg-white/5 pl-4 pr-12 py-3 text-sm text-white placeholder:text-white/40 focus:border-indigo-500 focus:outline-none transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!comment.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-400 hover:text-indigo-300 disabled:text-white/20 transition-colors"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-white/10 p-6">
                <div className="flex items-center gap-2">
                  <button className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white transition-all">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white transition-all">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-2 text-red-400/60 hover:bg-red-400/10 hover:text-red-400 transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-xl bg-white px-6 py-2.5 font-semibold text-black hover:bg-white/90 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
