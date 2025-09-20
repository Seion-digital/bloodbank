import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { User } from '../types';

// The predefined email for the admin user.
const ADMIN_EMAIL = 'admin@example.com';

interface AuthContextType {
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
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
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsLoading(true);
      if (session?.user) {
        // Check if a profile exists for the user.
        let { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        // If no profile exists, create one.
        if (!profile) {
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert({
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata.full_name || session.user.email,
              profile_image: session.user.user_metadata.avatar_url,
              user_type: 'public', // Default user type
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating user profile:', insertError);
          } else {
            profile = newUser;
          }
        }

        setUser(profile);

        // Check for admin role.
        if (profile?.email === ADMIN_EMAIL) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });

    // Check for an active session on initial load
    const getActiveSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if(!session) {
            setIsLoading(false);
        }
    };
    getActiveSession();


    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      signInWithGoogle,
      logout,
      isLoading,
      isAdmin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};