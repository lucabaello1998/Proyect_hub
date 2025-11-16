import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { Login as LoginIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import { useAuthStore } from '../store/useAuthStore';

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Limpiar errores al montar el componente
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(credentials);
    if (success) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  };

  const handleDemoLogin = (type: 'admin' | 'user') => {
    if (type === 'admin') {
      setCredentials({ username: 'admin', password: 'admin123' });
    } else {
      setCredentials({ username: 'demo', password: 'demo123' });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Hub de Proyectos
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Accede al panel de administración
            </Typography>
          </Box>

          {/* Usuarios de prueba */}
          <Card sx={{ mb: 3, bgcolor: 'action.hover' }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                👥 Usuarios de prueba:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label="👑 admin / admin123"
                  onClick={() => handleDemoLogin('admin')}
                  clickable
                  color="primary"
                  size="small"
                />
                <Chip
                  label="👤 demo / demo123"
                  onClick={() => handleDemoLogin('user')}
                  clickable
                  color="secondary"
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>

          {/* Formulario */}
          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Usuario"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              margin="normal"
              required
              autoFocus
              disabled={isLoading}
              color="primary"
            />

            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              margin="normal"
              required
              disabled={isLoading}
              color="primary"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={isLoading}
                      color="default"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={isLoading || !credentials.username || !credentials.password}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} color="inherit" />
                  Iniciando sesión...
                </Box>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                ¿No tienes cuenta? Usa las credenciales de prueba de arriba 👆
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}