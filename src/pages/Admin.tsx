import { Typography, Paper, Stack, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { useProjects } from '../store/useProjects';
import { useState } from 'react';
import { ImageSelector } from '../components/ImageSelector';

export default function Admin() {
  const { items, add, update, remove } = useProjects();
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    category: '', 
    repoUrl: '', 
    demoUrl: '',
    imageUrl: '',
    stack: ''
  });

  const onSave = () => {
    if (!form.title.trim()) return;
    
    const stackArray = form.stack 
      ? form.stack.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    
    add({ 
      title: form.title.trim(), 
      description: form.description.trim(), 
      category: form.category.trim() || undefined,
      repoUrl: form.repoUrl.trim() || undefined,
      demoUrl: form.demoUrl.trim() || undefined,
      imageUrl: form.imageUrl.trim() || undefined,
      stack: stackArray.length > 0 ? stackArray : undefined
    });
    
    setForm({ title: '', description: '', category: '', repoUrl: '', demoUrl: '', imageUrl: '', stack: '' });
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
            onChange={e => setForm(v => ({...v, title: e.target.value}))} 
            fullWidth
          />
          <TextField 
            label="Descripción" 
            value={form.description} 
            onChange={e => setForm(v => ({...v, description: e.target.value}))} 
            multiline 
            minRows={3}
            fullWidth
          />
          <ImageSelector
            currentImageUrl={form.imageUrl}
            onImageChange={(url) => setForm(v => ({...v, imageUrl: url}))}
          />
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField 
              label="Categoría" 
              value={form.category} 
              onChange={e => setForm(v => ({...v, category: e.target.value}))}
              sx={{ flex: 1, minWidth: '200px' }}
            />
            <TextField 
              label="Stack (separado por comas)" 
              value={form.stack} 
              onChange={e => setForm(v => ({...v, stack: e.target.value}))}
              placeholder="React, TypeScript, Node.js"
              sx={{ flex: 1, minWidth: '200px' }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField 
              label="URL del repositorio" 
              value={form.repoUrl} 
              onChange={e => setForm(v => ({...v, repoUrl: e.target.value}))}
              type="url"
              sx={{ flex: 1, minWidth: '200px' }}
            />
            <TextField 
              label="URL de la demo" 
              value={form.demoUrl} 
              onChange={e => setForm(v => ({...v, demoUrl: e.target.value}))}
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
                <TableCell>Imagen</TableCell>
                <TableCell>Stack</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      defaultValue={p.title}
                      onBlur={(e) => update(p.id, { title: e.target.value })}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      defaultValue={p.category || ''}
                      onBlur={(e) => update(p.id, { category: e.target.value || undefined })}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <ImageSelector
                      currentImageUrl={p.imageUrl}
                      onImageChange={(url) => update(p.id, { imageUrl: url || undefined })}
                      compact
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant="standard"
                      defaultValue={p.stack?.join(', ') || ''}
                      onBlur={(e) => {
                        const stackArray = e.target.value 
                          ? e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          : [];
                        update(p.id, { stack: stackArray.length > 0 ? stackArray : undefined });
                      }}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="error" 
                      onClick={() => remove(p.id)} 
                      aria-label={`eliminar proyecto ${p.title}`}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
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
    </Stack>
  );
}