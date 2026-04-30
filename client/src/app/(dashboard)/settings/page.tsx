'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import api from '@/lib/api';
import { setCredentials, updateUser } from '@/lib/features/auth/authSlice';
import { setCurrentWorkspace, setWorkspaces } from '@/lib/features/workspace/workspaceSlice';
import { 
  User, 
  Building2, 
  Bell, 
  Shield, 
  Save, 
  Loader2,
  Trash2
} from 'lucide-react';
import OnboardingTour from '@/components/OnboardingTour';

export default function SettingsPage() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { currentWorkspace } = useSelector((state: RootState) => state.workspace);

  const [isSavingUser, setIsSavingUser] = useState(false);
  const [isSavingWorkspace, setIsSavingWorkspace] = useState(false);
  
  // Local state for forms
  const [userForm, setUserForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });

  const [workspaceForm, setWorkspaceForm] = useState({
    name: currentWorkspace?.name || '',
    description: currentWorkspace?.description || '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingUser(true);
    try {
      const response = await api.put('/auth/profile', userForm);
      dispatch(updateUser(response.data));
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Update profile error', err);
    } finally {
      setIsSavingUser(false);
    }
  };

  const handleUpdateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWorkspace) return;
    setIsSavingWorkspace(true);
    try {
      const response = await api.put(`/workspaces/${currentWorkspace.id}`, workspaceForm);
      dispatch(setCurrentWorkspace(response.data));
      
      // Refresh list
      const wsRes = await api.get('/workspaces');
      dispatch(setWorkspaces(wsRes.data));
      
      alert('Workspace updated successfully!');
    } catch (err) {
      console.error('Update workspace error', err);
    } finally {
      setIsSavingWorkspace(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-10">
      <header>
        <h1 className="font-outfit text-4xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-white/50 text-lg">Manage your account and workspace preferences.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Settings */}
        <section className="tour-profile-settings glass-card p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/20 p-2.5 text-indigo-400">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-outfit">Personal Profile</h2>
              <p className="text-sm text-white/40">Manage your personal information.</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/60">First Name</label>
              <input
                type="text"
                value={userForm.firstName}
                onChange={(e) => setUserForm({...userForm, firstName: e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-indigo-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-white/60">Last Name</label>
              <input
                type="text"
                value={userForm.lastName}
                onChange={(e) => setUserForm({...userForm, lastName: e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-indigo-500 focus:outline-none transition-all"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                disabled={isSavingUser}
                className="flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-bold text-black hover:bg-white/90 disabled:opacity-50 transition-all shadow-xl"
              >
                {isSavingUser ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="h-5 w-5" /> Save Changes</>}
              </button>
            </div>
          </form>
        </section>

        {/* Workspace Settings */}
        <section className="tour-workspace-settings glass-card p-8 border-indigo-500/10">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-xl bg-purple-500/20 p-2.5 text-purple-400">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-outfit">Workspace Settings</h2>
              <p className="text-sm text-white/40">Configure your active workspace.</p>
            </div>
          </div>

          <form onSubmit={handleUpdateWorkspace} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/60">Workspace Name</label>
              <input
                type="text"
                value={workspaceForm.name}
                onChange={(e) => setWorkspaceForm({...workspaceForm, name: e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-indigo-500 focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-white/60">Description</label>
              <textarea
                rows={3}
                value={workspaceForm.description}
                onChange={(e) => setWorkspaceForm({...workspaceForm, description: e.target.value})}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-indigo-500 focus:outline-none transition-all resize-none"
              />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <button
                type="button"
                className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete Workspace
              </button>
              <button
                disabled={isSavingWorkspace}
                className="flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-bold text-black hover:bg-white/90 disabled:opacity-50 transition-all shadow-xl"
              >
                {isSavingWorkspace ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="h-5 w-5" /> Update Workspace</>}
              </button>
            </div>
          </form>
        </section>

        {/* Security / Other Placeholder */}
        <section className="glass-card p-8 opacity-50 grayscale cursor-not-allowed">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/5 p-2.5 text-white/40">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-outfit">Security & Privacy</h2>
              <p className="text-sm text-white/40">Two-factor authentication and login history (Coming soon).</p>
            </div>
          </div>
        </section>
      </div>

      <OnboardingTour />
    </div>
  );
}
