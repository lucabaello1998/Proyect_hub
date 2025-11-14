import { create } from 'zustand';
import type { Project } from '../types/project';
import { projectService } from '../services/projectService';

type ProjectsState = {
  items: Project[];
  filterText: string;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProjects: () => Promise<void>;
  setFilterText: (t: string) => void;
  add: (p: Omit<Project, 'id' | 'createdAt'>, images: File[]) => Promise<void>;
  update: (id: string, partial: Partial<Omit<Project, 'id'>>, newImages?: File[]) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export const useProjects = create<ProjectsState>((set, get) => ({
  items: [],
  filterText: '',
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await projectService.getAll();
      set({ items: projects, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar proyectos';
      set({ error: errorMessage, isLoading: false });
    }
  },

  setFilterText: (t) => set({ filterText: t }),

  add: async (projectData, images) => {
    set({ isLoading: true, error: null });
    try {
      // Subir imágenes y obtener URLs
      const imageUrls = await projectService.uploadImages(images);
      
      // Crear proyecto con las URLs de las imágenes
      const newProject: Omit<Project, 'id' | 'createdAt'> = {
        ...projectData,
        images: imageUrls,
        imageUrl: imageUrls[0] || '' // Primera imagen como portada
      };

      const createdProject = await projectService.create(newProject);
      set({ items: [...get().items, createdProject], isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear proyecto';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  update: async (id, partial, newImages) => {
    set({ isLoading: true, error: null });
    try {
      let updateData = { ...partial };

      // Si hay nuevas imágenes, subirlas
      if (newImages && newImages.length > 0) {
        const imageUrls = await projectService.uploadImages(newImages);
        updateData.images = imageUrls;
        updateData.imageUrl = imageUrls[0]; // Primera imagen como portada
      }

      const updatedProject = await projectService.update(id, updateData);
      
      set({ 
        items: get().items.map(i => (i.id === id ? updatedProject : i)),
        isLoading: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar proyecto';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  remove: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await projectService.delete(id);
      set({ 
        items: get().items.filter(i => i.id !== id),
        isLoading: false 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar proyecto';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
}));