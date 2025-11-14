import { supabase } from '../config/supabase';
import type { Project } from '../types/project';

/**
 * Servicio para gestionar proyectos en Supabase
 */
export const projectService = {
  /**
   * Obtener todos los proyectos
   */
  async getAll(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convertir de snake_case a camelCase
      return (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        author: item.author,
        category: item.category,
        stack: item.stack || [],
        tags: item.tags || [],
        images: item.images || [],
        imageUrl: item.image_url,
        demoUrl: item.demo_url,
        repoUrl: item.repo_url,
        createdAt: item.created_at
      }));
    } catch (error) {
      console.error('Error al obtener proyectos:', error);
      throw error;
    }
  },

  /**
   * Subir imágenes a Supabase Storage
   */
  async uploadImages(files: File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map(async (file, index) => {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${index}_${file.name}`;
        const filePath = `projects/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Obtener URL pública
        const { data } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);

        return data.publicUrl;
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
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          title: projectData.title,
          description: projectData.description,
          author: projectData.author,
          category: projectData.category,
          stack: projectData.stack || [],
          tags: projectData.tags || [],
          images: projectData.images || [],
          image_url: projectData.imageUrl || '',
          demo_url: projectData.demoUrl || '',
          repo_url: projectData.repoUrl || '',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No se pudo crear el proyecto');

      // Convertir de snake_case a camelCase
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        author: data.author,
        category: data.category,
        stack: data.stack,
        tags: data.tags,
        images: data.images,
        imageUrl: data.image_url,
        demoUrl: data.demo_url,
        repoUrl: data.repo_url,
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      throw error;
    }
  },

  /**
   * Actualizar un proyecto existente
   */
  async update(id: string, projectData: Partial<Omit<Project, 'id' | 'createdAt'>>): Promise<Project> {
    try {
      // Convertir de camelCase a snake_case
      const updateData: any = {};
      
      if (projectData.title !== undefined) updateData.title = projectData.title;
      if (projectData.description !== undefined) updateData.description = projectData.description;
      if (projectData.author !== undefined) updateData.author = projectData.author;
      if (projectData.category !== undefined) updateData.category = projectData.category;
      if (projectData.stack !== undefined) updateData.stack = projectData.stack;
      if (projectData.tags !== undefined) updateData.tags = projectData.tags;
      if (projectData.images !== undefined) updateData.images = projectData.images;
      if (projectData.imageUrl !== undefined) updateData.image_url = projectData.imageUrl;
      if (projectData.demoUrl !== undefined) updateData.demo_url = projectData.demoUrl;
      if (projectData.repoUrl !== undefined) updateData.repo_url = projectData.repoUrl;

      const { data, error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No se pudo actualizar el proyecto');

      // Convertir de snake_case a camelCase
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        author: data.author,
        category: data.category,
        stack: data.stack,
        tags: data.tags,
        images: data.images,
        imageUrl: data.image_url,
        demoUrl: data.demo_url,
        repoUrl: data.repo_url,
        createdAt: data.created_at
      };
    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
      throw error;
    }
  },

  /**
   * Eliminar un proyecto
   */
  async delete(id: string): Promise<void> {
    try {
      // Primero obtener el proyecto para eliminar sus imágenes
      const { data: project } = await supabase
        .from('projects')
        .select('images')
        .eq('id', id)
        .single();

      // Eliminar imágenes del storage
      if (project?.images && project.images.length > 0) {
        const filePaths = project.images.map((url: string) => {
          const urlObj = new URL(url);
          const pathParts = urlObj.pathname.split('/');
          return pathParts.slice(-2).join('/'); // "projects/filename"
        });

        await supabase.storage
          .from('project-images')
          .remove(filePaths);
      }

      // Eliminar el proyecto
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      throw error;
    }
  }
};
