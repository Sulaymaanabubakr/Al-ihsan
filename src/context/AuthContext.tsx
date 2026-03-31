import React, { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { AuthContext } from './auth-context';
import { supabase } from '../lib/supabase';

const fetchIsAdmin = async (uid: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', uid)
    .maybeSingle();

  if (error) {
    console.error('Admin check failed:', error);
    return false;
  }

  return !!data;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const syncAuthState = async (user: User | null) => {
      if (!mounted) return;

      if (!user) {
        setCurrentUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      setCurrentUser(user);

      try {
        const adminStatus = await fetchIsAdmin(user.id);
        if (mounted) setIsAdmin(adminStatus);
      } catch (error) {
        console.error('Failed to verify admin status:', error);
        if (mounted) setIsAdmin(false);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Check current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncAuthState(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Do NOT force setLoading(true) on every auth state change here 
      // otherwise consecutive logins will glitch the UI.
      // The session transition is synchronous enough.
      syncAuthState(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
