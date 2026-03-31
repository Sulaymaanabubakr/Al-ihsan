import { createContext } from 'react';
import type { User } from '@supabase/supabase-js';

export interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAdmin: false,
  loading: true,
});
