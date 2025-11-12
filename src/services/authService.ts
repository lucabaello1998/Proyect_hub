import { supabase } from '../config/supabase';
import type { User } from '../types/auth';

/**
 * Servicio de autenticación con Supabase
 */
export const authService = {
  /**
   * Iniciar sesión con email y contraseña
   */
  async login(username: string, password: string): Promise<User | null> {
    try {
      // Los usuarios usan su username como email: username@proyecthub.com
      const email = username.includes('@') ? username : `${username}@proyecthub.com`;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Error al iniciar sesión:', error);
        throw new Error('Usuario o contraseña incorrectos');
      }

      if (!data.user) return null;

      // Obtener datos adicionales del usuario desde la tabla users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError || !userData) {
        console.error('Error al obtener datos del usuario:', userError);
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
      console.error('Error al iniciar sesión:', error);
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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!userData) return null;

      return {
        id: user.id,
        username: userData.username,
        email: user.email || '',
        role: userData.role || 'user',
        name: userData.name || userData.username
      } as User;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  }
};
