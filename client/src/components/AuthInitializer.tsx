'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCredentials, setLoading, logout } from '@/lib/features/auth/authSlice';
import api from '@/lib/api';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.post('/auth/refresh');
        dispatch(setCredentials(response.data));
      } catch (err) {
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };

    checkAuth();
  }, [dispatch]);

  return <>{children}</>;
}
