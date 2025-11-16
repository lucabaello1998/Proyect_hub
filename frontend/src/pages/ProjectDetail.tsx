import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Stack, 
  Button, 
  Box, 
  Chip, 
  Card, 
  CardMedia, 
  Grid,
  Dialog,
  IconButton,
  Paper,
  Avatar
} from '@mui/material';
import { ArrowBack, OpenInNew, Close, Person } from '@mui/icons-material';
import { useProjects } from '../store/useProjects';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = useProjects(s => s.items.find(p => String(p.id) === id));
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  if (!project) {
    return (
      <Stack spacing={2}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/')}
          variant="outlined"
        >
          Volver al inicio
        </Button>
        <Typography variant="h5">Proyecto no encontrado.</Typography>
      </Stack>
    );
  }

  const images = project.images || (project.imageUrl ? [project.imageUrl] : []);

  return (
    <>
      <Stack spacing={4}>
        {/* Botón volver */}
        <Box>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={() => navigate('/')}
            variant="outlined"
          >
            Volver al inicio
          </Button>
        </Box>

        {/* Header: Título y botón de demo */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
            {project.title}
          </Typography>
          {project.demoUrl && (
            <Button 
              href={project.demoUrl} 
              target="_blank" 
              rel="noreferrer"
              startIcon={<OpenInNew />}
              variant="contained"
              size="large"
            >
              Ver Demo
            </Button>
          )}
        </Box>

        {/* Galería de imágenes */}
        {images.length > 0 && (
          <Box>
            <Grid container spacing={2}>
              {images.map((img, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: images.length === 1 ? 12 : 6 }}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer', 
                      transition: 'transform 0.2s',
                      '&:hover': { 
                        transform: 'scale(1.02)',
                        boxShadow: 4
                      }
                    }}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <CardMedia
                      component="img"
                      height={images.length === 1 ? '400' : '300'}
                      image={img}
                      alt={`${project.title} - Imagen ${index + 1}`}
                      sx={{ objectFit: 'cover' }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Información principal */}
        <Grid container spacing={3}>
          {/* Columna izquierda: Descripción */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                Descripción
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                {project.description}
              </Typography>
            </Paper>
          </Grid>

          {/* Columna derecha: Detalles */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={3}>
              {/* Autor */}
              {project.author && (
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Autor
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                      <Person />
                    </Avatar>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {project.author}
                    </Typography>
                  </Box>
                </Paper>
              )}

              {/* Tecnologías */}
              {project.stack && project.stack.length > 0 && (
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Tecnologías
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {project.stack.map(tech => (
                      <Chip 
                        key={tech} 
                        label={tech} 
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Paper>
              )}

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Tags
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {project.tags.map(tag => (
                      <Chip 
                        key={tag} 
                        label={tag} 
                        size="small"
                      />
                    ))}
                  </Stack>
                </Paper>
              )}

              {/* Categoría */}
              {project.category && (
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Categoría
                  </Typography>
                  <Chip 
                    label={project.category} 
                    color="secondary"
                  />
                </Paper>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Stack>

      {/* Modal de imagen ampliada */}
      <Dialog
        open={selectedImageIndex !== null}
        onClose={() => setSelectedImageIndex(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible'
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => setSelectedImageIndex(null)}
            sx={{
              position: 'absolute',
              top: -50,
              right: 0,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
            }}
          >
            <Close />
          </IconButton>
          {selectedImageIndex !== null && (
            <Box
              component="img"
              src={images[selectedImageIndex]}
              alt={`${project.title} - Ampliada`}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: 1
              }}
            />
          )}
        </Box>
      </Dialog>
    </>
  );
}