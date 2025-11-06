import { create } from 'zustand';
import type { Project } from '../types/project';
import { gitService } from '../services/gitService';

type ProjectsState = {
  items: Project[];
  filterText: string;
  setFilterText: (t: string) => void;
  add: (p: Omit<Project, 'id'>) => void;
  update: (id: number, partial: Partial<Project>) => void;
  remove: (id: number) => void;
};

// Función auxiliar para generar datos de repositorio
const generateProjectWithRepo = (baseProject: Omit<Project, 'repository'>): Project => ({
  ...baseProject,
  repository: gitService.getRepository(baseProject.id)
});

const baseProjects = [
  { 
    id: 1, 
    title: 'Running App', 
    description: 'Plataforma de running donde los usuarios pueden puntuar recorridos por área geográfica y competir entre ellos. Incluye mapas interactivos, rankings, desafíos semanales y estadísticas de rendimiento.', 
    category: 'Deportes', 
    stack: ['React Native', 'Node.js', 'MongoDB', 'Maps API'],
    repoUrl: 'https://github.com/ejemplo/running-app',
    demoUrl: 'https://running-app-demo.com',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    createdAt: '2024-01-15'
  },
  { 
    id: 2, 
    title: 'Court Finder', 
    description: 'Buscador inteligente de canchas deportivas para fútbol, natación, tenis, paddle y más deportes. Permite filtrar por ubicación, precio, horarios disponibles y reservar online con sistema de pagos integrado.', 
    category: 'Deportes', 
    stack: ['React', 'TypeScript', 'Google Maps', 'Stripe'],
    repoUrl: 'https://github.com/ejemplo/court-finder',
    demoUrl: 'https://court-finder-demo.com',
    imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    createdAt: '2024-02-20'
  },
  { 
    id: 3, 
    title: 'ERP Interno', 
    description: 'Sistema empresarial robusto de gestión de recursos que incluye control de inventario, facturación automática, reportes financieros y dashboard ejecutivo en tiempo real.', 
    category: 'ERP', 
    stack: ['React', 'C#', 'SQL Server'],
    repoUrl: 'https://github.com/ejemplo/erp-interno',
    imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    createdAt: '2024-02-28'
  },
  { 
    id: 4, 
    title: 'Fichaje QR', 
    description: 'Aplicación web progresiva innovadora para control de asistencia laboral mediante códigos QR. Funciona offline y sincroniza automáticamente cuando hay conexión.', 
    category: 'RRHH', 
    stack: ['React', 'PWA', 'Service Workers'],
    demoUrl: 'https://fichaje-qr.netlify.app',
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    createdAt: '2024-03-10'
  },
];

const initial: Project[] = baseProjects.map(generateProjectWithRepo);

export const useProjects = create<ProjectsState>((set, get) => ({
  items: initial,
  filterText: '',
  setFilterText: (t) => set({ filterText: t }),
  add: (p) => {
    const nextId = Math.max(...get().items.map(i => i.id)) + 1;
    set({ items: [...get().items, { id: nextId, createdAt: new Date().toISOString().split('T')[0], ...p }] });
  },
  update: (id, partial) => {
    set({ items: get().items.map(i => (i.id === id ? { ...i, ...partial } : i)) });
  },
  remove: (id) => {
    set({ items: get().items.filter(i => i.id !== id) });
  },
}));