'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Clock, 
  Calendar, 
  User as UserIcon, 
  MessageSquare, 
  Save,
  Edit2,
  Send,
  Trash2
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority } from '@/lib/shared/types';
import RichTextEditor from './RichTextEditor';
import { socket } from '@/lib/socket';
import api from '@/lib/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';

interface Comment {
  _id: string;
  text: string;
  authorId: { _id: string; firstName: string; lastName: string; avatarUrl?: string };
  createdAt: string;
}

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
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [posting, setPosting] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Fetch real comments from API
  useEffect(() => {
    if (!task) return;
    setDescription(task.description || '');
    setIsEditing(false);

    const fetchComments = async () => {
      setCommentsLoading(true);
      try {
        const res = await api.get(`/tasks/${task.id}/comments`);
        setComments(res.data);
      } catch (err) {
        console.error('Failed to fetch comments', err);
      } finally {
        setCommentsLoading(false);
      }
    };
    fetchComments();
  }, [task]);

  // Real-time: receive new comments via Socket.io
  useEffect(() => {
    if (!task) return;

    const handleNewComment = (newComment: Comment) => {
      // Only add if it belongs to this task
      if ((newComment as any).taskId === task.id) {
        setComments(prev => [...prev, newComment]);
        setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    };

    const handleCommentDeleted = ({ commentId, taskId }: { commentId: string; taskId: string }) => {
      if (taskId === task.id) {
        setComments(prev => prev.filter(c => c._id !== commentId));
      }
    };

    socket.on('newComment', handleNewComment);
    socket.on('commentDeleted', handleCommentDeleted);
    return () => {
      socket.off('newComment', handleNewComment);
      socket.off('commentDeleted', handleCommentDeleted);
    };
  }, [task]);

  if (!task) return null;

  const handleSaveDescription = async () => {
    setSaving(true);
    try {
      await api.put(`/tasks/${task.id}`, { description });
      onUpdate({ ...task, description });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update description', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim() || posting) return;
    setPosting(true);
    try {
      const res = await api.post(`/tasks/${task.id}/comments`, { text: comment.trim() });
      setComments(prev => [...prev, res.data]);
      setComment('');
      setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await api.delete(`/tasks/${task.id}/comments/${commentId}`);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
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

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return d.toLocaleDateString();
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
                <button 
                  onClick={onClose}
                  className="rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Title & Meta */}
                <div>
                  <h2 className="font-outfit text-3xl font-bold text-white leading-tight mb-6">
                    {task.title}
                  </h2>
                  <div className="grid grid-cols-2 gap-6 border-y border-white/5 py-6">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-white/30 uppercase tracking-widest flex items-center gap-2">
                        <UserIcon className="h-3 w-3" /> Assignee
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <div className="h-7 w-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] text-indigo-400 font-bold uppercase">
                          {(task as any).assigneeId?.firstName?.[0] || '?'}
                        </div>
                        <span className="text-sm text-white/80">
                          {(task as any).assigneeId
                            ? `${(task as any).assigneeId.firstName} ${(task as any).assigneeId.lastName}`
                            : 'Unassigned'}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-white/30 uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="h-3 w-3" /> Due Date
                      </p>
                      <p className="text-sm text-white/80 pt-1">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString('en-US', { dateStyle: 'medium' })
                          : 'No due date'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Description</h3>
                    <button 
                      onClick={() => isEditing ? handleSaveDescription() : setIsEditing(true)}
                      disabled={saving}
                      className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-50"
                    >
                      {isEditing ? (
                        <><Save className="h-3 w-3" /> {saving ? 'Saving...' : 'Save Changes'}</>
                      ) : (
                        <><Edit2 className="h-3 w-3" /> Edit</>
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
                      className="rounded-xl bg-white/5 p-4 text-white/70 leading-relaxed min-h-[100px] prose prose-invert prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: description || '<p class="text-white/30">No description provided.</p>' }}
                    />
                  )}
                </div>

                {/* Comments */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> 
                    Comments
                    {comments.length > 0 && (
                      <span className="ml-1 rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-400">
                        {comments.length}
                      </span>
                    )}
                  </h3>

                  {commentsLoading ? (
                    <div className="space-y-3">
                      {[1, 2].map(n => (
                        <div key={n} className="h-16 animate-pulse rounded-xl bg-white/5" />
                      ))}
                    </div>
                  ) : comments.length === 0 ? (
                    <p className="text-sm text-white/30 py-4 text-center">No comments yet. Be the first!</p>
                  ) : (
                    <div className="space-y-3">
                      {comments.map((c) => (
                        <div key={c._id} className="group flex gap-3">
                          <div className="h-8 w-8 shrink-0 rounded-full bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400 uppercase">
                            {c.authorId?.firstName?.[0] || '?'}
                          </div>
                          <div className="flex-1 rounded-xl bg-white/5 border border-white/5 p-3">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs font-bold text-white/80">
                                {c.authorId ? `${c.authorId.firstName} ${c.authorId.lastName}` : 'Unknown'}
                              </p>
                              <div className="flex items-center gap-2">
                                <p className="text-[10px] text-white/30">{formatTime(c.createdAt)}</p>
                                {currentUser?.id === c.authorId?._id && (
                                  <button
                                    onClick={() => handleDeleteComment(c._id)}
                                    className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">{c.text}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={commentsEndRef} />
                    </div>
                  )}
                </div>
              </div>

              {/* Comment Input — always visible at bottom */}
              <div className="border-t border-white/5 p-4 bg-zinc-900/50">
                <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 focus-within:border-indigo-500/50 transition-all">
                  <div className="h-7 w-7 shrink-0 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 uppercase">
                    {currentUser?.firstName?.[0] || 'Y'}
                  </div>
                  <input 
                    type="text" 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
                    placeholder="Add a comment… (Enter to send)" 
                    className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                  />
                  <button 
                    onClick={handleAddComment}
                    disabled={!comment.trim() || posting}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-500/20 px-3 py-1.5 text-xs font-bold text-indigo-400 hover:bg-indigo-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {posting ? 'Posting...' : 'Post'}
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
