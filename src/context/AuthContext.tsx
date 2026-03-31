import React, { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { AuthContext, type UserRole } from './auth-context';
import { supabase } from '../lib/supabase';

const fetchAdminInfo = async (uid: string): Promise<{ isAdmin: boolean; role: UserRole }> => {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, role')
    .eq('id', uid)
    .maybeSingle();

  if (error) {
    console.error('Admin check failed:', error);
    return { isAdmin: false, role: 'FIELD_AGENT' };
  }

  if (!data) return { isAdmin: false, role: 'FIELD_AGENT' };
  return { isAdmin: true, role: (data.role as UserRole) || 'SUPER_ADMIN' };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('FIELD_AGENT');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const syncAuthState = async (user: User | null) => {
      if (!mounted) return;

      if (!user) {
        setCurrentUser(null);
        setIsAdmin(false);
        setUserRole('FIELD_AGENT');
        setLoading(false);
        return;
      }

      setLoading(true);
      setCurrentUser(user);

      try {
        const { isAdmin: admin, role } = await fetchAdminInfo(user.id);
        if (mounted) {
          setIsAdmin(admin);
          setUserRole(role);
        }
      } catch (error) {
        console.error('Failed to verify admin status:', error);
        if (mounted) {
          setIsAdmin(false);
          setUserRole('FIELD_AGENT');
        }
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
      syncAuthState(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, userRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
