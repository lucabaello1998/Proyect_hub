import { jwtDecode } from 'jwt-decode';
import { supabase } from '../config/supabase';
import type { User } from '../types/auth';
import { AUTH_URL } from './api';

/**
 * Servicio de autenticación con Supabase
 */
export const authService = {
  /**
   * Iniciar sesión con email y contraseña
   */
  async login(username: string, password: string): Promise<User | null> {
    // Los usuarios usan su username como email: username@proyecthub.com
    const email = username.includes('@') ? username : `${username}@proyecthub.com`;
    try {
      const response = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('jwt', token);
        return { id: '', username: email, email, role: 'user', name: email } as User;
      } else {
        const errorData = await response.json();
        console.error('Error backend login:', errorData.message || errorData);
      }
    } catch (err) {
      console.error('Error de red al intentar login backend:', err);
    }
    // Fallback: login con Supabase
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error || !data.user) {
        console.error('Error Supabase login:', error?.message || error);
        return null;
      }
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      if (!userData) {
        console.error('No se encontró el usuario en Supabase.');
        return null;
      }
      return {
        id: data.user.id,
        username: userData.username,
        email: data.user.email || '',
        role: userData.role || 'user',
        name: userData.name || username
      } as User;
    } catch (error) {
      console.error('Error al iniciar sesión con Supabase:', error);
      throw error;
    }
  },

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  },

  /**
   * Observar cambios en el estado de autenticación
   */
  onAuthChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userData) {
          callback({
            id: session.user.id,
            username: userData.username,
            email: session.user.email || '',
            role: userData.role || 'user',
            name: userData.name || userData.username
          } as User);
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  },

  /**
   * Obtener usuario actual
   */
  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('jwt');
    if (!token) return null;
    try {
      const decoded: any = jwtDecode(token);
      return {
        id: decoded.userId || '',
        username: decoded.sub || '',
        email: decoded.sub || '',
        role: decoded.role || 'user',
        name: decoded.sub || ''
      } as User;
    } catch {
      return null;
    }
  }
};
