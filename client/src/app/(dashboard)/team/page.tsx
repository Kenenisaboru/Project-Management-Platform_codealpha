'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import api from '@/lib/api';
import { User, UserRole } from '@/lib/shared/types';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Mail, 
  MoreHorizontal,
  Loader2,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface Member {
  userId: User;
  role: UserRole;
}

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>(UserRole.MEMBER);
  const [isInviting, setIsInviting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { currentWorkspace } = useSelector((state: RootState) => state.workspace);

  const fetchMembers = async () => {
    if (!currentWorkspace) return;
    setLoading(true);
    try {
      const response = await api.get(`/workspaces/${currentWorkspace.id}/members`);
      setMembers(response.data);
    } catch (err) {
      console.error('Fetch members error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [currentWorkspace]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWorkspace || !inviteEmail) return;

    setIsInviting(true);
    setMessage(null);
    try {
      await api.post(`/workspaces/${currentWorkspace.id}/members`, {
        email: inviteEmail,
        role: inviteRole
      });
      setMessage({ type: 'success', text: 'Member added successfully!' });
      setInviteEmail('');
      fetchMembers();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add member' });
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-outfit text-4xl font-bold tracking-tight text-white">Team Management</h1>
          <p className="text-white/50 text-lg">Manage your workspace members and roles.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Left: Invite Section */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6">
            <div className="mb-6 flex items-center gap-2">
              <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-400">
                <UserPlus className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold font-outfit">Invite Member</h2>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/60">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="teammate@company.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/60">Workspace Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as UserRole)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none transition-all"
                >
                  <option value={UserRole.MEMBER}>Member</option>
                  <option value={UserRole.TEAM_LEAD}>Team Lead</option>
                  <option value={UserRole.PROJECT_MANAGER}>Project Manager</option>
                  <option value={UserRole.ORG_ADMIN}>Admin</option>
                </select>
              </div>

              <button
                disabled={isInviting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-black hover:bg-white/90 disabled:opacity-50 transition-all shadow-xl"
              >
                {isInviting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Add to Team'}
              </button>
            </form>

            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-6 flex items-center gap-2 rounded-xl p-4 text-sm border ${
                    message.type === 'success' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}
                >
                  {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Members List */}
        <div className="lg:col-span-2">
          <div className="glass-card overflow-hidden border-white/5">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-xl font-bold font-outfit">Workspace Members</h2>
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/40 border border-white/5">
                {members.length} Members
              </span>
            </div>

            {loading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-16 animate-pulse rounded-xl bg-white/5" />
                ))}
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {members.map((member) => (
                  <div key={member.userId.id} className="flex items-center gap-4 p-6 hover:bg-white/[0.01] transition-colors">
                    <div className="h-12 w-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold uppercase text-lg">
                      {member.userId.firstName[0]}{member.userId.lastName[0]}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">
                          {member.userId.firstName} {member.userId.lastName}
                        </h3>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                          member.role === UserRole.ORG_ADMIN ? 'bg-indigo-500/10 text-indigo-400' : 'bg-white/5 text-white/40'
                        }`}>
                          {member.role === UserRole.ORG_ADMIN && <Shield className="h-2.5 w-2.5" />}
                          {member.role}
                        </span>
                      </div>
                      <p className="text-sm text-white/40">{member.userId.email}</p>
                    </div>

                    <button className="rounded-lg p-2 text-white/20 hover:bg-white/5 hover:text-white transition-all">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
