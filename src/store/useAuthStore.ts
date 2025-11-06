import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginCredentials, AuthState } from '../types/auth';

// Usuarios mock para el sistema de login
const mockUsers: Array<User & { password: string }> = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    email: 'admin@proyecthub.com',
    role: 'admin',
    name: 'Administrador'
  },
  {
    id: 2,
    username: 'demo',
    password: 'demo123',
    email: 'demo@proyecthub.com',
    role: 'user',
    name: 'Usuario Demo'
  }
];

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        // Simular latencia de red
        await new Promise(resolve => setTimeout(resolve, 1000));

        const user = mockUsers.find(
          u => u.username === credentials.username && u.password === credentials.password
        );

        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ 
            user: userWithoutPassword, 
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
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        });
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