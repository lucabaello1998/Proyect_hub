import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';
import { useProjects } from './store/useProjects';

export default function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const fetchProjects = useProjects((state) => state.fetchProjects);

  useEffect(() => {
    // Inicializar autenticación y cargar proyectos al montar la app
    initialize();
    fetchProjects();
  }, [initialize, fetchProjects]);

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard/:id" element={<ProjectDetail />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/audit" 
          element={
            <ProtectedRoute>
              {React.createElement(require('./pages/AuditLog').default)}
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AppLayout>
  );
}
