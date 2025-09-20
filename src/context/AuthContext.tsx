import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { User } from '../types';

// Define admin users
const ADMIN_USERS = [
  { email: 'admin1@example.com', password: 'password1' },
  { email: 'admin2@example.com', password: 'password2' },
];

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isLoading: boolean;
  isAdmin: boolean;
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getActiveSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userProfile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
        } else {
          setUser(userProfile);
          const adminUser = ADMIN_USERS.find(admin => admin.email === session.user.email);
          if (adminUser) {
            setIsAdmin(true);
          }
        }
      }
      setIsLoading(false);
    };

    getActiveSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const adminUser = ADMIN_USERS.find(admin => admin.email === session.user.email);
        if (adminUser) {
          setIsAdmin(true);
        }
        // Fetch user profile
        supabase.from('users').select('*').eq('id', session.user.id).single().then(({ data, error }) => {
          if (error) {
            console.error('Error fetching user profile:', error);
          } else {
            setUser(data);
          }
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    const adminUser = ADMIN_USERS.find(admin => admin.email === email && admin.password === password);
    
    if (adminUser) {
      // First, try to sign up the admin user if they don't exist in Supabase auth
      let { data: existingUser, error: existingUserError } = await supabase.from('users').select('id').eq('email', email).single();
      if (!existingUser) {
          const { data: authData, error: signUpError } = await supabase.auth.signUp({ email, password });
          if (signUpError && signUpError.message !== 'User already registered') {
              console.error('Admin sign up error:', signUpError);
              setIsLoading(false);
              return false;
          }

          if (authData.user) {
            const { error: insertError } = await supabase.from('users').insert([{ id: authData.user.id, email: email, user_type: 'admin', verification_status: 'verified' }]);
            if (insertError) {
              console.error('Admin profile creation error:', insertError);
              setIsLoading(false);
              return false;
            }
          }
      }
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }

    setIsLoading(false);
    return true;
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    const { email, password, ...profileData } = userData;

    if (!email || !password) {
      console.error('Email and password are required for registration.');
      setIsLoading(false);
      return false;
    }

    const { data: authData, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      console.error('Registration error:', signUpError);
      setIsLoading(false);
      return false;
    }

    if (authData.user) {
      const { error: insertError } = await supabase.from('users').insert([{ id: authData.user.id, ...profileData, email }]);
      if (insertError) {
        console.error('Profile creation error:', insertError);
        // Optional: delete the user from auth if profile creation fails
        // await supabase.auth.api.deleteUser(authData.user.id);
        setIsLoading(false);
        return false;
      }
    }

    setIsLoading(false);
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (user) {
      const { error } = await supabase.from('users').update(updates).eq('id', user.id);
      if (error) {
        console.error('Profile update error:', error);
      } else {
        setUser({ ...user, ...updates });
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      isLoading,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};