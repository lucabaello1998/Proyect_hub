import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Tabs, 
  Tab, 
  Alert, 
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import LinkIcon from '@mui/icons-material/Link';
import EditIcon from '@mui/icons-material/Edit';

interface ImageSelectorProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string) => void;
  compact?: boolean;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({ 
  currentImageUrl = '', 
  onImageChange, 
  compact = false 
}) => {
  const [open, setOpen] = useState(false);
  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
  const [urlValue, setUrlValue] = useState(currentImageUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrlValue(currentImageUrl);
  }, [currentImageUrl]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    const finalUrl = imageMode === 'url' ? urlValue : previewUrl;
    onImageChange(finalUrl);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setUrlValue(currentImageUrl);
    clearFile();
  };

  if (compact) {
    return (
      <>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => setOpen(true)}
          variant="outlined"
        >
          Imagen
        </Button>
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>Editar imagen</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 1 }}>
              <Tabs value={imageMode} onChange={(_, value) => setImageMode(value)} sx={{ mb: 2 }}>
                <Tab icon={<LinkIcon />} label="URL" value="url" iconPosition="start" />
                <Tab icon={<CloudUploadIcon />} label="Archivo" value="file" iconPosition="start" />
              </Tabs>

              {imageMode === 'url' ? (
                <TextField 
                  label="URL de la imagen" 
                  value={urlValue} 
                  onChange={e => setUrlValue(e.target.value)}
                  type="url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  fullWidth
                />
              ) : (
                <Box>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    fullWidth
                  >
                    {selectedFile ? selectedFile.name : 'Seleccionar archivo'}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                  </Button>
                  
                  {selectedFile && (
                    <Alert severity="info" sx={{ mt: 1 }} action={
                      <Button color="inherit" size="small" onClick={clearFile}>
                        Limpiar
                      </Button>
                    }>
                      {selectedFile.name}
                    </Alert>
                  )}
                </Box>
              )}

              {/* Vista previa */}
              {((imageMode === 'url' && urlValue) || (imageMode === 'file' && previewUrl)) && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">Vista previa:</Typography>
                  <Box
                    component="img"
                    src={imageMode === 'url' ? urlValue : previewUrl}
                    alt="Vista previa"
                    sx={{
                      width: '100%',
                      maxWidth: 200,
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      mt: 1,
                      display: 'block'
                    }}
                  />
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleSave} variant="contained">Guardar</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  // Versión completa para el formulario principal
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>Imagen del proyecto</Typography>
      
      <Tabs value={imageMode} onChange={(_, value) => setImageMode(value)} sx={{ mb: 2 }}>
        <Tab icon={<LinkIcon />} label="URL" value="url" iconPosition="start" />
        <Tab icon={<CloudUploadIcon />} label="Subir archivo" value="file" iconPosition="start" />
      </Tabs>

      {imageMode === 'url' ? (
        <TextField 
          label="URL de la imagen" 
          value={urlValue} 
          onChange={e => {
            setUrlValue(e.target.value);
            onImageChange(e.target.value);
          }}
          type="url"
          placeholder="https://ejemplo.com/imagen.jpg"
          fullWidth
          helperText="Ingresa la URL directa de la imagen"
        />
      ) : (
        <Box>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
            fullWidth
          >
            {selectedFile ? selectedFile.name : 'Seleccionar archivo'}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleFileSelect(e);
                if (e.target.files?.[0]) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    onImageChange(event.target?.result as string);
                  };
                  reader.readAsDataURL(e.target.files[0]);
                }
              }}
              style={{ display: 'none' }}
            />
          </Button>
          
          {selectedFile && (
            <Alert severity="info" sx={{ mt: 1 }} action={
              <Button color="inherit" size="small" onClick={clearFile}>
                Limpiar
              </Button>
            }>
              Archivo seleccionado: {selectedFile.name}
            </Alert>
          )}
        </Box>
      )}

      {/* Vista previa de la imagen */}
      {((imageMode === 'url' && urlValue) || (imageMode === 'file' && previewUrl)) && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">Vista previa:</Typography>
          <Box
            component="img"
            src={imageMode === 'url' ? urlValue : previewUrl}
            alt="Vista previa"
            sx={{
              width: '100%',
              maxWidth: 200,
              height: 120,
              objectFit: 'cover',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              mt: 1
            }}
          />
        </Box>
      )}
    </Box>
  );
};