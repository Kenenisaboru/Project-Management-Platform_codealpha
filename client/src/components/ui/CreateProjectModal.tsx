'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Modal from './Modal';
import api from '@/lib/api';
import { ProjectStatus } from '@/lib/shared/types';
import { Loader2 } from 'lucide-react';

const projectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().optional(),
  status: z.nativeEnum(ProjectStatus),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  onProjectCreated: (project: any) => void;
}

export default function CreateProjectModal({ isOpen, onClose, workspaceId, onProjectCreated }: CreateProjectModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: ProjectStatus.PLANNING,
    },
  });

  const onSubmit = async (data: ProjectFormValues) => {
    console.log('Creating project with workspaceId:', workspaceId);
    setIsLoading(true);
    try {
      const response = await api.post('/projects', { ...data, workspaceId });
      onProjectCreated(response.data);
      reset();
      onClose();
    } catch (err) {
      console.error('Create project error', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-white/60">Project Name</label>
          <input
            {...register('name')}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none transition-all"
            placeholder="e.g. Website Redesign"
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white/60">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none transition-all resize-none"
            placeholder="What is this project about?"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-white/60">Initial Status</label>
          <select
            {...register('status')}
            className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none transition-all"
          >
            {Object.values(ProjectStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
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
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
