'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Server, Activity, Search, Edit2, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/Toast';

// Mock data for Admin Dashboard
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'ORG_ADMIN', status: 'Active', joined: '2026-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'PROJECT_MANAGER', status: 'Active', joined: '2026-02-20' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'MEMBER', status: 'Inactive', joined: '2026-03-05' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'TEAM_LEAD', status: 'Active', joined: '2026-03-10' },
  { id: '5', name: 'Alex Brown', email: 'alex@example.com', role: 'GUEST', status: 'Active', joined: '2026-04-01' },
];

export default function AdminDashboardPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Protect route
  useEffect(() => {
    // Note: For demo purposes, we might allow viewing if it's a showcase.
    // In production, uncomment the following line to strictly enforce:
    // if (user?.role !== 'SUPER_ADMIN') router.push('/dashboard');
  }, [user, router]);

  const stats = [
    { label: 'Total Users', value: '1,248', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { label: 'Active Workspaces', value: '342', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
    { label: 'System Health', value: '99.9%', icon: Server, color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
    { label: 'Security Alerts', value: '0', icon: Shield, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  ];

  const filteredUsers = mockUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-10 pb-10">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h1 className="font-outfit text-3xl sm:text-4xl font-bold tracking-tight text-white">Admin Console</h1>
          </div>
          <p className="text-white/50 text-base">Platform oversight, user management, and system health.</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 border-t-4 border-t-transparent hover:border-t-indigo-500 transition-all duration-300"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className={`rounded-lg p-2 ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-white/40">{stat.label}</p>
            <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Management Table */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col min-h-[500px]">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white font-outfit">User Management</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-indigo-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/5 bg-black/20 flex-1">
            <table className="w-full text-left text-sm text-white/70">
              <thead className="bg-white/5 text-xs uppercase text-white/40">
                <tr>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u, i) => (
                  <motion.tr 
                    key={u.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-4 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white">{u.name}</div>
                        <div className="text-xs text-white/40">{u.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full ${u.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span className="text-xs">{u.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button 
                        onClick={() => toast.info(`Editing ${u.name}...`)}
                        className="p-1.5 text-white/40 hover:text-white transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => toast.warning(`Deleted user ${u.name}`)}
                        className="p-1.5 text-white/40 hover:text-red-400 transition-colors ml-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-white/40">
                No users found matching your search.
              </div>
            )}
          </div>
        </div>

        {/* System Logs / Server Status */}
        <div className="glass-card p-6 flex flex-col">
          <h2 className="mb-6 text-xl font-bold text-white font-outfit flex items-center gap-2">
            <Server className="h-5 w-5 text-indigo-400" />
            System Status
          </h2>
          
          <div className="space-y-4 mb-6">
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" /> API Server
                </span>
                <span className="text-xs text-white/40">Operational</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" /> Database (MongoDB)
                </span>
                <span className="text-xs text-white/40">12ms latency</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> WebSocket Server
                </span>
                <span className="text-xs text-white/40">High Load</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 mt-2 overflow-hidden">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-white/60 mb-3 mt-auto">Recent Logs</h3>
          <div className="space-y-2 text-xs font-mono bg-black/40 p-4 rounded-xl border border-white/5 overflow-hidden">
            <div className="text-white/60"><span className="text-emerald-400">[INFO]</span> New user registration: alex@example.com</div>
            <div className="text-white/60"><span className="text-blue-400">[AUTH]</span> User login successful (ID: 104)</div>
            <div className="text-white/60"><span className="text-amber-400">[WARN]</span> High memory usage detected (82%)</div>
            <div className="text-white/60"><span className="text-emerald-400">[INFO]</span> Daily backup completed successfully.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
