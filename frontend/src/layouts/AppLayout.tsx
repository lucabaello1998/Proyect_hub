import { AppBar, Toolbar, Typography, Box, Container, Button, Menu, MenuItem, Avatar, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ExitToApp, Person, AdminPanelSettings } from '@mui/icons-material';
import ColorModeToggle from '../components/ColorModeToggle';
import { useAuthStore } from '../store/useAuthStore';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" color="default" enableColorOnDark>
        <Toolbar sx={{ gap: 2 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ color: 'text.primary', textDecoration: 'none', flexGrow: 1 }}
          >
            Hub de Proyectos
          </Typography>

          {/* Navegación */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAuthenticated && (
              <>
                <Button
                  component={Link}
                  to="/admin"
                  startIcon={<AdminPanelSettings />}
                  sx={{ textTransform: 'none' }}
                >
                  Admin
                </Button>
                <Button
                  component={Link}
                  to="/audit"
                  sx={{ textTransform: 'none' }}
                >
                  Auditoría
                </Button>
              </>
            )}

            <ColorModeToggle />

            {/* Usuario autenticado */}
            {isAuthenticated && user ? (
              <>
                <Button
                  onClick={handleUserMenuOpen}
                  startIcon={
                    <Avatar
                      sx={{
                        bgcolor: getAvatarColor(user.name),
                        width: 32,
                        height: 32,
                        fontSize: '0.875rem'
                      }}
                    >
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </Avatar>
                  }
                  sx={{ textTransform: 'none' }}
                >
                  {user.name}
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem disabled>
                    <Person sx={{ mr: 1 }} />
                    {user.email}
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ExitToApp sx={{ mr: 1 }} />
                    Cerrar Sesión
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{ textTransform: 'none' }}
              >
                Iniciar Sesión
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 3, flex: 1 }}>{children}</Container>
    </Box>
  );
}