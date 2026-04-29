'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Settings,
  LogOut,
  ChevronDown,
  Building2,
  Plus,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { logout } from '@/lib/features/auth/authSlice';
import { setWorkspaces, setCurrentWorkspace } from '@/lib/features/workspace/workspaceSlice';
import api from '@/lib/api';
import CreateWorkspaceModal from './ui/CreateWorkspaceModal';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FolderKanban, label: 'Projects', href: '/projects' },
  { icon: CheckSquare, label: 'My Tasks', href: '/tasks' },
  { icon: Users, label: 'Team', href: '/team' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);
  const { workspaces, currentWorkspace } = useSelector((state: RootState) => state.workspace);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await api.get('/workspaces');
        dispatch(setWorkspaces(response.data));
      } catch (err) {
        console.error('Fetch workspaces error', err);
      }
    };

    if (workspaces.length === 0) {
      fetchWorkspaces();
    }
  }, [dispatch, workspaces.length]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      dispatch(logout());
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 rounded-xl bg-white/10 backdrop-blur-md p-2.5 text-white hover:bg-white/20 transition-all"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl transition-transform lg:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex h-full flex-col px-4 py-6">
          <div className="mb-10 flex items-center justify-between px-2">
            <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">T</div>
              <span className="font-outfit text-xl font-bold tracking-tight text-white">TaskFlow Pro</span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Workspace Selector */}
          <div className="relative mb-6 px-2">
            <button 
              onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
              className="flex w-full items-center justify-between rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-left hover:bg-white/10 transition-all"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="h-6 w-6 shrink-0 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
                  {currentWorkspace?.name?.[0] || 'W'}
                </div>
                <span className="truncate text-sm font-medium text-white/80">
                  {currentWorkspace?.name || 'Loading...'}
                </span>
              </div>
              <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${isWorkspaceOpen ? 'rotate-180' : ''}`} />
            </button>

            {isWorkspaceOpen && (
              <div className="absolute left-0 top-full mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-2xl z-50">
                <div className="max-h-48 overflow-y-auto py-1">
                  {workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        dispatch(setCurrentWorkspace(ws));
                        setIsWorkspaceOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white transition-all"
                    >
                      <Building2 className="h-4 w-4" />
                      {ws.name}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => {
                    setIsCreateModalOpen(true);
                    setIsWorkspaceOpen(false);
                  }}
                  className="flex w-full items-center gap-2 border-t border-white/10 px-3 py-2 text-xs font-medium text-indigo-400 hover:bg-white/5 transition-all"
                >
                  <Plus className="h-3 w-3" />
                  Create Workspace
                </button>
              </div>
            )}
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-white/10 text-white shadow-lg shadow-black/20' 
                      : 'text-white/50 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-indigo-400' : ''}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-white/10 pt-6">
            <div className="mb-6 flex items-center gap-3 px-2 text-white">
              <div className="h-10 w-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold uppercase">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
                <p className="truncate text-xs text-white/40">{user?.email}</p>
              </div>
            </div>
            
            <div className="mb-4 px-2">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white transition-all"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400/80 hover:bg-red-400/10 hover:text-red-400 transition-all"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>

        <CreateWorkspaceModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
        />
      </aside>
    </>
  );
}
