import { Typography, Paper, Stack, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Box, Card, CardMedia, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useProjects } from '../store/useProjects';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const navigate = useNavigate();
  const items = useProjects(state => state.items);
  const add = useProjects(state => state.add);
  const update = useProjects(state => state.update);
  const remove = useProjects(state => state.remove);
  const fetchProjects = useProjects(state => state.fetchProjects);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    repoUrl: '',
    demoUrl: '',
    author: '',
    stack: '',
    tags: ''
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages(files);

    // Crear previews
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    // Liberar URL object
    URL.revokeObjectURL(imagePreviews[index]);

    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const onSave = () => {
    if (!form.title.trim()) return;

    const stackArray = form.stack
      ? form.stack.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const tagsArray = form.tags
      ? form.tags.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    add({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim() || undefined,
      repoUrl: form.repoUrl.trim() || undefined,
      demoUrl: form.demoUrl.trim() || undefined,
      author: form.author.trim() || undefined,
      stack: stackArray.length > 0 ? stackArray : undefined,
      tags: tagsArray.length > 0 ? tagsArray : undefined
    }, selectedImages).then(() => fetchProjects()); // Refresca proyectos tras agregar

    // Limpiar formulario
    setForm({
      title: '',
      description: '',
      category: '',
      repoUrl: '',
      demoUrl: '',
      author: '',
      stack: '',
      tags: ''
    });

    // Limpiar imágenes
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    setSelectedImages([]);
    setImagePreviews([]);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" gutterBottom>
        Administración de Proyectos
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Crear Proyecto</Typography>
        <Stack spacing={2}>
          <TextField
            label="Título *"
            value={form.title}
            onChange={e => setForm(v => ({ ...v, title: e.target.value }))}
            fullWidth
          />
          <TextField
            label="Descripción"
            value={form.description}
            onChange={e => setForm(v => ({ ...v, description: e.target.value }))}
            multiline
            minRows={3}
            fullWidth
          />

          {/* Upload de imágenes */}
          <Box>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 2 }}
            >
              Subir Imágenes del Proyecto
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageSelect}
              />
            </Button>

            <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
              La primera imagen será la portada. Las demás formarán la galería automáticamente.
            </Typography>

            {/* Previews de imágenes */}
            {imagePreviews.length > 0 && (
              <Grid container spacing={2}>
                {imagePreviews.map((preview, index) => (
                  <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={preview}
                        alt={`Imagen ${index + 1}`}
                      />
                      <IconButton
                        onClick={() => removeImage(index)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'background.paper',
                          '&:hover': { bgcolor: 'error.light', color: 'white' }
                        }}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      {index === 0 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 4,
                            left: 4,
                            bgcolor: 'primary.main',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                        >
                          PORTADA
                        </Box>
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>

          <TextField
            label="Autor"
            value={form.author}
            onChange={e => setForm(v => ({ ...v, author: e.target.value }))}
            placeholder="Nombre del autor del proyecto"
            fullWidth
          />
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Categoría"
              value={form.category}
              onChange={e => setForm(v => ({ ...v, category: e.target.value }))}
              sx={{ flex: 1, minWidth: '200px' }}
            />
            <TextField
              label="Stack (separado por comas)"
              value={form.stack}
              onChange={e => setForm(v => ({ ...v, stack: e.target.value }))}
              placeholder="React, TypeScript, Node.js"
              sx={{ flex: 1, minWidth: '200px' }}
            />
          </Box>
          <TextField
            label="Tags (separados por comas)"
            value={form.tags}
            onChange={e => setForm(v => ({ ...v, tags: e.target.value }))}
            placeholder="Web, Mobile, API, Firebase"
            fullWidth
          />
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="URL del repositorio"
              value={form.repoUrl}
              onChange={e => setForm(v => ({ ...v, repoUrl: e.target.value }))}
              type="url"
              sx={{ flex: 1, minWidth: '200px' }}
            />
            <TextField
              label="URL de la demo"
              value={form.demoUrl}
              onChange={e => setForm(v => ({ ...v, demoUrl: e.target.value }))}
              type="url"
              sx={{ flex: 1, minWidth: '200px' }}
            />
          </Box>
          <Button
            startIcon={<SaveIcon />}
            onClick={onSave}
            disabled={!form.title.trim()}
            sx={{ alignSelf: 'flex-start' }}
          >
            Guardar Proyecto
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Listado de Proyectos ({items.length})
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Imágenes</TableCell>
                <TableCell>Stack</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(p => ((
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      defaultValue={p.title}
                      onBlur={async (e) => { await update(p.id, { title: e.target.value }); await fetchProjects(); }}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      defaultValue={p.category || ''}
                      onBlur={async (e) => { await update(p.id, { category: e.target.value || undefined }); await fetchProjects(); }}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      defaultValue={Array.isArray(p.images)
                        ? p.images.join(', ')
                        : (typeof p.images === 'string' && (p.images as string).startsWith('[')
                          ? (() => { try { return JSON.parse(p.images as string).join(', '); } catch { return ''; } })()
                          : '')}
                      onBlur={async (e) => {
                        const imagesArray = e.target.value
                          ? e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          : [];
                        const imageUrl = imagesArray.length > 0 ? imagesArray[0] : undefined;
                        await update(p.id, {
                          images: imagesArray.length > 0 ? imagesArray : undefined,
                          imageUrl: imageUrl
                        });
                        await fetchProjects();
                      }}
                      placeholder="URLs separadas por comas"
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      defaultValue={Array.isArray(p.stack)
                        ? p.stack.join(', ')
                        : (typeof p.stack === 'string' && (p.stack as string).startsWith('[')
                          ? (() => { try { return JSON.parse(p.stack as string).join(', '); } catch { return ''; } })()
                          : '')}
                      onBlur={async (e) => {
                        const stackArray = e.target.value
                          ? e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          : [];
                        await update(p.id, { stack: stackArray.length > 0 ? stackArray : undefined });
                        await fetchProjects();
                      }}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={async () => { await remove(p.id); await fetchProjects(); }}
                      aria-label={`eliminar proyecto ${p.title}`}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>)
              ))}
            </TableBody>
          </Table>
        </Box>
        {items.length === 0 && (
          <Typography variant="body2" sx={{ textAlign: 'center', py: 4, opacity: 0.7 }}>
            No hay proyectos creados aún
          </Typography>
        )}
      </Paper>
    </Stack >
  );
}