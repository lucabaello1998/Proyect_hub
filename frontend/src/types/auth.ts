export type User = {
  id: string | number; // String para Supabase, number para compatibilidad
  username: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
};

export type LoginCredentials = {
  username: string;
  password: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};