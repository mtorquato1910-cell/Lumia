import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { supabase, type User, type Session } from '@/lib/supabase';
import type { Profile } from '@/lib/database.types';

/**
 * Auth Context para gerenciamento de autenticação com Supabase
 * 
 * Fornece:
 * - Estado do usuário (user) - dados do auth.users
 * - Estado do profile (profile) - dados da tabela profiles
 * - Estado de carregamento (isLoading)
 * - Função de login com Google (signInWithGoogle)
 * - Função de logout (signOut)
 */

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Busca ou cria o profile do usuário na tabela profiles
   */
  const fetchOrCreateProfile = useCallback(async (authUser: User): Promise<Profile | null> => {
    try {
      // Primeiro, tentar buscar o profile existente
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (existingProfile && !fetchError) {
        console.log('Profile found:', existingProfile);
        return existingProfile as Profile;
      }

      // Se não existe, criar um novo profile
      // Isso pode acontecer se o trigger do banco não funcionou
      console.log('Profile not found, creating new one...');
      
      const newProfile: Partial<Profile> = {
        id: authUser.id,
        email: authUser.email || '',
        full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || null,
        avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null,
        role: 'member',
        organization_id: null,
      };

      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .upsert(newProfile, { onConflict: 'id' })
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        // Mesmo com erro, retornar um profile básico para não quebrar a UI
        return {
          id: authUser.id,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.full_name || null,
          avatar_url: authUser.user_metadata?.avatar_url || null,
          role: 'member',
          organization_id: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Profile;
      }

      console.log('Profile created:', createdProfile);
      return createdProfile as Profile;
    } catch (error) {
      console.error('Error in fetchOrCreateProfile:', error);
      return null;
    }
  }, []);

  /**
   * Atualiza o profile do usuário atual
   */
  const refreshProfile = useCallback(async () => {
    if (!user) return;
    
    const updatedProfile = await fetchOrCreateProfile(user);
    setProfile(updatedProfile);
  }, [user, fetchOrCreateProfile]);

  // Inicializar sessão e configurar listener
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Buscar sessão atual
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        // Se tem usuário, buscar/criar profile
        if (currentSession?.user) {
          const userProfile = await fetchOrCreateProfile(currentSession.user);
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Buscar/criar profile quando usuário loga
        if (event === 'SIGNED_IN' && newSession?.user) {
          const userProfile = await fetchOrCreateProfile(newSession.user);
          setProfile(userProfile);
        }

        // Limpar profile quando usuário desloga
        if (event === 'SIGNED_OUT') {
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, [fetchOrCreateProfile]);

  /**
   * Login com Google OAuth
   * Redireciona para a página de login do Google
   */
  const signInWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Error signing in with Google:', error.message);
        throw error;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
      throw error;
    }
  }, []);

  /**
   * Logout - Remove a sessão atual
   */
  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error.message);
        throw error;
      }

      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    session,
    profile,
    isLoading,
    isAuthenticated: !!user,
    signInWithGoogle,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para acessar o contexto de autenticação
 * 
 * @example
 * const { user, profile, signInWithGoogle, signOut, isLoading } = useAuth();
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export default AuthContext;
