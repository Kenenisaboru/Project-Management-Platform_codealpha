'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from './Modal';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setWorkspaces, setCurrentWorkspace } from '@/lib/features/workspace/workspaceSlice';

const workspaceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional(),
});

type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateWorkspaceModal({ isOpen, onClose }: CreateWorkspaceModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
  });

  const onSubmit = async (data: WorkspaceFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post('/workspaces', data);
      
      // Refresh workspaces in redux
      const workspacesRes = await api.get('/workspaces');
      dispatch(setWorkspaces(workspacesRes.data));
      dispatch(setCurrentWorkspace(response.data));
      
      reset();
      onClose();
    } catch (err) {
      console.error('Create workspace error', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Workspace">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-white/60">Workspace Name</label>
          <input
            {...register('name')}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none transition-all"
            placeholder="e.g. Acme Corp Team"
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white/60">Description (Optional)</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none transition-all resize-none"
            placeholder="What will this workspace be used for?"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-black hover:bg-white/90 disabled:opacity-50 transition-all"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Workspace'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
