import { jwtDecode } from 'jwt-decode';
import type { User } from '../types/auth';
import { AUTH_URL } from './api';

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
    return null;
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
  },

  /**
   * Cerrar sesión
   */
  logout() {
    localStorage.removeItem('jwt');
  }
};
