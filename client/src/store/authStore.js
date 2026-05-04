import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const mapProfile = (dbProfile) => {
  if (!dbProfile) return null;
  return {
    _id: dbProfile.id,
    name: dbProfile.name,
    email: dbProfile.email,
    college: dbProfile.college,
    credits: dbProfile.credits,
    stats: {
      matchesPlayed: dbProfile.matches_played || 0,
      matchesWon: dbProfile.matches_won || 0,
      tournamentsPlayed: dbProfile.tournaments_played || 0,
      tournamentsWon: dbProfile.tournaments_won || 0,
    },
    role: dbProfile.role,
    avatarUrl: dbProfile.avatar_url,
    createdAt: dbProfile.created_at
  };
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;

          const { data: profile, error: profileError } = await supabase
            .from('profiles').select('*').eq('id', data.user.id).single();
          if (profileError) throw profileError;

          const mappedUser = mapProfile(profile);
          set({ user: mappedUser, session: data.session, isAuthenticated: true });
          toast.success(`Welcome back, ${mappedUser.name.split(' ')[0]}! ⚡`);
          return { success: true };
        } catch (err) {
          toast.error(err.message || 'Login failed');
          return { success: false, message: err.message };
        } finally {
          set({ isLoading: false });
        }
      },

      signup: async (formData) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: { data: { name: formData.name, college: formData.college } }
          });
          if (error) throw error;

          await new Promise(r => setTimeout(r, 500)); // wait for trigger
          
          let profile = null;
          if (data.user) {
            const { data: fetchedProfile } = await supabase
              .from('profiles').select('*').eq('id', data.user.id).single();
            profile = mapProfile(fetchedProfile);
          }

          if (data.session) {
             set({ user: profile, session: data.session, isAuthenticated: true });
             toast.success('Account created! You got 500 ⚡ starter credits.');
          } else {
             toast.success('Registration successful! Please check your email to verify.');
          }
          return { success: true };
        } catch (err) {
          toast.error(err.message || 'Signup failed');
          return { success: false, message: err.message };
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try { await supabase.auth.signOut(); } catch (err) { console.error(err); }
        set({ user: null, session: null, isAuthenticated: false });
        toast.success('Logged out successfully.');
      },

      loadUser: async () => {
        set({ isLoading: true });
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError || !session) {
            set({ user: null, session: null, isAuthenticated: false });
            return;
          }

          const { data: profile, error: profileError } = await supabase
            .from('profiles').select('*').eq('id', session.user.id).single();
          if (profileError) throw profileError;

          set({ user: mapProfile(profile), session: session, isAuthenticated: true });
        } catch (err) {
          set({ user: null, session: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      updateUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
      deductCredits: (amount) => set((state) => ({ user: { ...state.user, credits: (state.user?.credits || 0) - amount } })),
      addCredits: (amount) => set((state) => ({ user: { ...state.user, credits: (state.user?.credits || 0) + amount } })),
    }),
    {
      name: 'campusbet-auth',
      partialize: (state) => ({ user: state.user, session: state.session, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
