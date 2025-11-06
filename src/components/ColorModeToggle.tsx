import { IconButton, Tooltip } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useUiStore } from '../store/useUiStore';

export default function ColorModeToggle() {
  const { mode, toggleMode } = useUiStore();
  const isDark = mode === 'dark';
  
  return (
    <Tooltip title={isDark ? 'Cambiar a claro' : 'Cambiar a oscuro'}>
      <IconButton 
        onClick={toggleMode} 
        edge="end" 
        aria-label="toggle dark mode"
        sx={{
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'rotate(180deg)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}