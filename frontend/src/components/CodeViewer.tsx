import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  IconButton, 
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { 
  Close, 
  ContentCopy, 
  Code
} from '@mui/icons-material';
import type { FileContent } from '../types/project';

interface CodeViewerProps {
  filePath: string | null;
  onClose: () => void;
  onGetFileContent: (path: string) => Promise<FileContent>;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ 
  filePath, 
  onClose, 
  onGetFileContent 
}) => {
  const [fileContent, setFileContent] = useState<FileContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!filePath) {
      setFileContent(null);
      return;
    }

    const loadFile = async () => {
      setLoading(true);
      setError(null);
      try {
        const content = await onGetFileContent(filePath);
        setFileContent(content);
      } catch (err) {
        setError('Error al cargar el archivo');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFile();
  }, [filePath, onGetFileContent]);

  const copyToClipboard = async () => {
    if (fileContent?.content) {
      try {
        await navigator.clipboard.writeText(fileContent.content);
      } catch (err) {
        console.error('Error al copiar al portapapeles:', err);
      }
    }
  };

  const getLanguageLabel = (language: string) => {
    const languageLabels: Record<string, string> = {
      'typescript': 'TypeScript',
      'javascript': 'JavaScript',
      'json': 'JSON',
      'markdown': 'Markdown',
      'html': 'HTML',
      'css': 'CSS',
      'csharp': 'C#',
      'python': 'Python',
      'java': 'Java'
    };
    return languageLabels[language] || language.toUpperCase();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const addLineNumbers = (code: string) => {
    const lines = code.split('\\n');
    return lines.map((line, index) => (
      <div key={index} className="code-line">
        <span className="line-number">{index + 1}</span>
        <span className="line-content">{line}</span>
      </div>
    ));
  };

  if (!filePath) return null;

  return (
    <Paper sx={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      zIndex: 1300,
      m: 2,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Code />
          <Box>
            <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
              {filePath.split('/').pop()}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
              {filePath}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {fileContent && (
            <>
              <Chip 
                label={getLanguageLabel(fileContent.language)} 
                size="small" 
                color="primary"
              />
              <Chip 
                label={formatFileSize(fileContent.size)} 
                size="small" 
                variant="outlined"
              />
            </>
          )}
          <IconButton onClick={copyToClipboard} disabled={!fileContent}>
            <ContentCopy />
          </IconButton>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        {loading && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {fileContent && !loading && !error && (
          <Box 
            sx={{ 
              fontFamily: 'Courier New, monospace',
              fontSize: '0.875rem',
              lineHeight: 1.5,
              backgroundColor: '#1e1e1e', // Fondo oscuro consistente
              color: '#d4d4d4', // Texto claro
              p: 2,
              height: '100%',
              overflow: 'auto',
              '& .code-line': {
                display: 'flex',
                minHeight: '1.5rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)' // Hover sutil
                }
              },
              '& .line-number': {
                width: '3rem',
                textAlign: 'right',
                paddingRight: '1rem',
                color: '#858585', // Números de línea en gris
                userSelect: 'none',
                borderRight: '1px solid #3e3e3e',
                marginRight: '1rem'
              },
              '& .line-content': {
                flex: 1,
                whiteSpace: 'pre',
                wordBreak: 'break-all',
                color: '#d4d4d4' // Código en color claro
              }
            }}
          >
            {addLineNumbers(fileContent.content)}
          </Box>
        )}
      </Box>
    </Paper>
  );
};