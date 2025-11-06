import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Stack, Button, Paper, Box, Chip, Card, CardMedia, Grid } from '@mui/material';
import { ArrowBack, OpenInNew, GitHub } from '@mui/icons-material';
import { useProjects } from '../store/useProjects';
import { LastCommit } from '../components/LastCommit';
import { FileExplorer } from '../components/FileExplorer';
import { CodeViewer } from '../components/CodeViewer';
import { gitService } from '../services/gitService';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = useProjects(s => s.items.find(p => String(p.id) === id));
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

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

  return (
    <>
      <Stack spacing={3}>
        <Box>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={() => navigate('/')}
            variant="outlined"
            sx={{ mb: 2 }}
          >
            Volver al inicio
          </Button>
          <Typography variant="h4" gutterBottom>{project.title}</Typography>
          
          {project.imageUrl && (
            <Card sx={{ mb: 3, maxWidth: 600 }}>
              <CardMedia
                component="img"
                height="300"
                image={project.imageUrl}
                alt={`Imagen de ${project.title}`}
                sx={{ objectFit: 'cover' }}
              />
            </Card>
          )}
          
          <Typography variant="body1" paragraph>{project.description}</Typography>
          
          {project.category && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Categoría:</Typography>
              <Chip label={project.category} />
            </Box>
          )}
          
          {project.stack && project.stack.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Stack tecnológico:</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {project.stack.map(tech => (
                  <Chip key={tech} label={tech} variant="outlined" />
                ))}
              </Stack>
            </Box>
          )}

          <Stack direction="row" spacing={2} flexWrap="wrap" gap={1} sx={{ mb: 3 }}>
            {project.repoUrl && (
              <Button 
                href={project.repoUrl} 
                target="_blank" 
                rel="noreferrer"
                startIcon={<GitHub />}
                variant="outlined"
              >
                Abrir repo
              </Button>
            )}
            {project.demoUrl && (
              <Button 
                href={project.demoUrl} 
                target="_blank" 
                rel="noreferrer"
                startIcon={<OpenInNew />}
              >
                Ver demo
              </Button>
            )}
          </Stack>
        </Box>

        {/* Información del repositorio */}
        {project.repository?.lastCommit && (
          <LastCommit 
            commit={project.repository.lastCommit}
            totalCommits={project.repository.totalCommits}
            contributors={project.repository.contributors}
          />
        )}

        <Grid container spacing={3}>
          {/* Explorador de archivos */}
          <Grid size={{ xs: 12, md: 6 }}>
            {project.repository?.structure && (
              <FileExplorer
                files={project.repository.structure}
                onFileClick={setSelectedFile}
              />
            )}
          </Grid>

          {/* Métricas */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Métricas del proyecto</Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Estado de build</Typography>
                  <Typography variant="body1">✅ Exitosa</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Commits totales</Typography>
                  <Typography variant="body1">{project.repository?.totalCommits || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Colaboradores</Typography>
                  <Typography variant="body1">{project.repository?.contributors || 'N/A'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Fecha de creación</Typography>
                  <Typography variant="body1">{project.createdAt || 'No especificada'}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">Issues abiertas</Typography>
                  <Typography variant="body1">2</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Stack>

      {/* Visor de código */}
      <CodeViewer
        filePath={selectedFile}
        onClose={() => setSelectedFile(null)}
        onGetFileContent={gitService.getFileContent}
      />
    </>
  );
}