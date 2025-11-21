export type GitCommit = {
  hash: string;
  message: string;
  author: string;
  date: string;
  filesChanged: number;
};

export type FileItem = {
  name: string;
  type: 'file' | 'folder';
  path: string;
  size?: number;
  lastModified?: string;
  children?: FileItem[];
};

export type FileContent = {
  path: string;
  content: string;
  language: string;
  size: number;
  lastModified: string;
};

export type GitRepository = {
  lastCommit?: GitCommit;
  structure?: FileItem[];
  totalCommits?: number;
  contributors?: number;
};

export type Project = {
  id: string; // Cambiado a string para compatibilidad con Supabase UUID
  title: string;
  description: string;
  repoUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  images?: string[]; // Galería de imágenes
  category?: string;
  createdAt?: string;
  stack?: string[];
  author?: string; // Autor del proyecto
  tags?: string[]; // Tags adicionales
  repository?: GitRepository;
  isDeleted?: boolean;
};