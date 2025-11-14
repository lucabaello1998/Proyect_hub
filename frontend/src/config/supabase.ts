import { createClient } from '@supabase/supabase-js';

// TODO: Reemplaza con tus credenciales de Supabase
// Las encontrarás en: Project Settings > API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bmtqsypjbjsemjguogvh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdHFzeXBqYmpzZW1qZ3VvZ3ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MDUyMzAsImV4cCI6MjA3ODQ4MTIzMH0.HCQ_FFCCr1x9rzaZ6cBefR-OodrnNTNQ243cd5mVxAo';

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

