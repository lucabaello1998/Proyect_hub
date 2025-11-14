import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginCredentials, AuthState } from '../types/auth';
import { authService } from '../services/authService';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      initialize: async () => {
        set({ isLoading: true });
        try {
          const user = await authService.getCurrentUser();
          set({ 
            user, 
            isAuthenticated: !!user, 
            isLoading: false 
          });
        } catch {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        }
      },

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          const user = await authService.login(credentials.username, credentials.password);
          
          if (user) {
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false,
              error: null 
            });
            return true;
          } else {
            set({ 
              error: 'Usuario o contraseña incorrectos', 
              isLoading: false 
            });
            return false;
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
          set({ 
            error: errorMessage, 
            isLoading: false 
          });
          return false;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } finally {
          set({ 
            user: null, 
            isAuthenticated: false, 
            error: null 
          });
        }
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);

// Escuchar cambios de autenticación
authService.onAuthChange((user) => {
  useAuthStore.setState({
    user,
    isAuthenticated: !!user
  });
});