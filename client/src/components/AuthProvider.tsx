'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading, setCredentials, logout } from '@/lib/features/auth/authSlice';
import api from '@/lib/api';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we have a valid session/profile
        const response = await api.get('/auth/profile');
        if (response.data) {
          dispatch(setCredentials({ 
            user: response.data, 
            accessToken: 'session-active' // The cookie handles the actual auth
          }));
        }
      } catch (err) {
        dispatch(logout());
      } finally {
        dispatch(setLoading(false));
      }
    };

    initAuth();
  }, [dispatch]);

  return <>{children}</>;
}
