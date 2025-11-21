
import type { Project } from '../types/project';

export const projectService = {
  /**
   * Obtener todos los proyectos desde el backend
   */
  async getAll(): Promise<Project[]> {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Error al obtener proyectos');
      const data = await response.json();
      return (data || [])
        .filter((item: any) => !item.isDeleted)
        .map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          author: item.author,
          category: item.category,
          stack: (() => {
            if (Array.isArray(item.stack)) return item.stack;
            if (typeof item.stack === 'string' && item.stack.startsWith('[')) {
              try { return JSON.parse(item.stack); } catch { return []; }
            }
            return [];
          })(),
          tags: (() => {
            if (Array.isArray(item.tags)) return item.tags;
            if (typeof item.tags === 'string' && item.tags.startsWith('[')) {
              try { return JSON.parse(item.tags); } catch { return []; }
            }
            return [];
          })(),
          images: (() => {
            if (Array.isArray(item.images)) return item.images;
            if (typeof item.images === 'string' && item.images.startsWith('[')) {
              try { return JSON.parse(item.images); } catch { return []; }
            }
            return [];
          })(),
          imageUrl: item.imageUrl,
          demoUrl: item.demoUrl,
          repoUrl: item.repoUrl,
          createdAt: item.createdAt,
          isDeleted: item.isDeleted
        }));
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
      throw error;
    }
  },

  /**
   * Subir imágenes al backend
   */
  async uploadImages(files: File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/projects/upload-image', {
          method: 'POST',
          body: formData
        });
        if (!response.ok) throw new Error('Error al subir imagen');
        const { url } = await response.json();
        return url;
      });
      return Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo proyecto
   */
  async create(projectData: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    try {
      const token = localStorage.getItem('jwt');
      // Serializar arrays como strings para el backend
      const payload = {
        ...projectData,
        stack: projectData.stack ? JSON.stringify(projectData.stack) : '',
        tags: projectData.tags ? JSON.stringify(projectData.tags) : '',
        images: projectData.images ? JSON.stringify(projectData.images) : ''
      };
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('No se pudo crear el proyecto');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      throw error;
    }
  },

  /**
   * Actualizar un proyecto existente
   */
  async update(id: string, projectData: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project | undefined> {
    try {
      const token = localStorage.getItem('jwt');
      // Obtener el proyecto actual para enviar todos los campos
      const allProjects = await this.getAll();
      const current = allProjects.find(p => p.id === id);
      if (!current) throw new Error('Proyecto no encontrado');
      // Mezclar los datos editados con el proyecto actual
      const merged = {
        ...current,
        ...projectData
      };
      // Serializar arrays como strings para el backend
      const payload = {
        ...merged,
        stack: Array.isArray(merged.stack) ? JSON.stringify(merged.stack) : merged.stack,
        tags: Array.isArray(merged.tags) ? JSON.stringify(merged.tags) : merged.tags,
        images: Array.isArray(merged.images) ? JSON.stringify(merged.images) : merged.images
      };
      // Eliminar campos undefined o vacíos
      Object.keys(payload).forEach(key => {
        if ((payload as any)[key] === undefined || (payload as any)[key] === null) delete (payload as any)[key];
      });
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('No se pudo actualizar el proyecto');
      if (response.status === 204) return;
      try {
        const data = await response.json();
        return data;
      } catch {
        return;
      }
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
      throw error;
    }
  },

  /**
   * Eliminar un proyecto en el backend
   */
  async delete(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('No se pudo eliminar el proyecto');
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      throw error;
    }
  }
};
