import { Grid, Card, CardActionArea, CardContent, CardMedia, Typography, TextField, Stack, Chip, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../store/useProjects';

export default function Home() {
  const nav = useNavigate();
  const { items, filterText, setFilterText } = useProjects();
  const filtered = items.filter(p => 
    p.title.toLowerCase().includes(filterText.toLowerCase()) || 
    (p.category ?? '').toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <Stack spacing={2}>
      <TextField
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
        placeholder="Buscar por título o categoría…"
        fullWidth
      />
      <Grid container spacing={2}>
        {filtered.map(p => (
          <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card role="article" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardActionArea onClick={() => nav(`/dashboard/${p.id}`)} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {p.imageUrl && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={p.imageUrl}
                    alt={`Imagen de ${p.title}`}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" gutterBottom>
                    {p.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      opacity: 0.8, 
                      mb: 2,
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {p.description}
                  </Typography>
                  <Box>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {p.category && <Chip size="small" label={p.category} />}
                      {(p.stack ?? []).slice(0, 3).map(s => (
                        <Chip key={s} size="small" label={s} />
                      ))}
                      {(p.stack ?? []).length > 3 && (
                        <Chip size="small" label={`+${(p.stack?.length ?? 0) - 3}`} variant="outlined" />
                      )}
                    </Stack>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      {filtered.length === 0 && (
        <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
          No se encontraron proyectos que coincidan con "{filterText}"
        </Typography>
      )}
    </Stack>
  );
}