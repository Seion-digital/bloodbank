import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { User } from '../types';
import { AuthChangeEvent, Session, User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getActiveUser = async (supabaseUser: SupabaseUser | null) => {
      if (!supabaseUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const { data: userProfile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setUser(null);
      } else {
        setUser(userProfile as User);
      }
      setIsLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setIsLoading(true);
        await getActiveUser(session?.user ?? null);
      }
    );
    
    // Initial load
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await getActiveUser(session?.user ?? null);
    };
    checkInitialSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error) {
      console.error('Login error:', error.message);
      return false;
    }
    return true;
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    const { email, password } = userData as any;
    if (!email || !password) {
      console.error("Email and password are required for registration.");
      setIsLoading(false);
      return false;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      console.error('Registration error:', signUpError.message);
      setIsLoading(false);
      return false;
    }
    
    if (data.user) {
        const { password, ...profileData } = userData as any;
        const { error: profileError } = await supabase
            .from('users')
            .insert({ ...profileData, id: data.user.id, email: data.user.email });

        if (profileError) {
            console.error('Error creating user profile:', profileError.message);
            setIsLoading(false);
            return false;
        }
    }

    setIsLoading(false);
    return true;
  };

  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setIsLoading(false);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    setIsLoading(true);
    const { error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating profile:', error.message);
    } else {
      setUser(prevUser => (prevUser ? { ...prevUser, ...updates } : null));
    }
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};