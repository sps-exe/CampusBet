// Auth store — manages login state globally using Zustand.
// "persist" saves user/session to localStorage so they stay logged in on refresh.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

// Converts the raw Supabase profile row into the shape our UI expects
const mapProfile = (dbProfile) => {
  if (!dbProfile) return null;
  return {
    _id: dbProfile.id,
    name: dbProfile.name,
    email: dbProfile.email,
    college: dbProfile.college,
    credits: dbProfile.credits,
    role: dbProfile.role,
    avatarUrl: dbProfile.avatar_url,
    createdAt: dbProfile.created_at,
    stats: {
      matchesPlayed: dbProfile.matches_played || 0,
      matchesWon: dbProfile.matches_won || 0,
      tournamentsPlayed: dbProfile.tournaments_played || 0,
      tournamentsWon: dbProfile.tournaments_won || 0,
    },
  };
};

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,

      // Sign in with email + password, then fetch the user's profile row
      // Called as login({ email, password }) from Login.jsx
      login: async ({ email, password }) => {
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

      // Create a new account. Supabase triggers a DB function to create the profile row.
      signup: async (formData) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: { data: { name: formData.name, college: formData.college } },
          });
          if (error) throw error;

          // Small delay to let the Supabase DB trigger finish creating the profile
          await new Promise((r) => setTimeout(r, 500));

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
            toast.success('Registered! Check your email to verify your account.');
          }
          return { success: true };
        } catch (err) {
          toast.error(err.message || 'Signup failed');
          return { success: false, message: err.message };
        } finally {
          set({ isLoading: false });
        }
      },

      // Sign out from Supabase and clear local state
      logout: async () => {
        try { await supabase.auth.signOut(); } catch (err) { console.error(err); }
        set({ user: null, session: null, isAuthenticated: false });
        toast.success('Logged out successfully.');
      },

      // Called on app load — checks if there's a valid session and re-hydrates the user
      loadUser: async () => {
        set({ isLoading: true });
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error || !session) {
            set({ user: null, session: null, isAuthenticated: false });
            return;
          }

          const { data: profile, error: profileError } = await supabase
            .from('profiles').select('*').eq('id', session.user.id).single();
          if (profileError) throw profileError;

          set({ user: mapProfile(profile), session, isAuthenticated: true });
        } catch {
          set({ user: null, session: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      // Local-only helpers — update state without a DB call
      updateUser: (updates) => set((s) => ({ user: { ...s.user, ...updates } })),
      deductCredits: (amount) => set((s) => ({ user: { ...s.user, credits: (s.user?.credits || 0) - amount } })),
      addCredits: (amount) => set((s) => ({ user: { ...s.user, credits: (s.user?.credits || 0) + amount } })),

      // Update profile name/college in Supabase + local state
      updateProfile: async ({ name, college }) => {
        const state = useAuthStore.getState();
        if (!state.user?._id) return { success: false };
        try {
          const { error } = await supabase
            .from('profiles')
            .update({ name, college })
            .eq('id', state.user._id);
          if (error) throw error;
          set((s) => ({ user: { ...s.user, name, college } }));
          toast.success('Profile updated!');
          return { success: true };
        } catch (err) {
          toast.error(err.message || 'Update failed');
          return { success: false, message: err.message };
        }
      },
    }),
    {
      name: 'campusarena-auth', // localStorage key
      // Only persist what's needed; don't store isLoading etc.
      partialize: (s) => ({ user: s.user, session: s.session, isAuthenticated: s.isAuthenticated }),
    }
  )
);

export default useAuthStore;
