import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Collapse,
  Box,
  Chip
} from '@mui/material';
import { 
  Folder, 
  InsertDriveFile, 
  ExpandLess, 
  ExpandMore,
  Code,
  Description,
  DataObject,
  Web
} from '@mui/icons-material';
import type { FileItem } from '../types/project';

interface FileExplorerProps {
  files: FileItem[];
  onFileClick: (filePath: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ files, onFileClick }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src/']));

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (fileName: string, isFolder: boolean) => {
    if (isFolder) return <Folder color="primary" />;
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'tsx':
      case 'ts':
      case 'js':
      case 'jsx':
        return <Code color="info" />;
      case 'json':
        return <DataObject color="warning" />;
      case 'html':
      case 'css':
      case 'scss':
        return <Web color="secondary" />;
      case 'md':
        return <Description color="action" />;
      default:
        return <InsertDriveFile color="action" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderFileItem = (item: FileItem, depth = 0) => {
    const isExpanded = expandedFolders.has(item.path);
    
    return (
      <React.Fragment key={item.path}>
        <ListItem disablePadding sx={{ pl: depth * 2 }}>
          <ListItemButton
            onClick={() => {
              if (item.type === 'folder') {
                toggleFolder(item.path);
              } else {
                onFileClick(item.path);
              }
            }}
            sx={{ 
              py: 0.5,
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              {getFileIcon(item.name, item.type === 'folder')}
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {item.name}
                  </Typography>
                  {item.type === 'file' && item.size && (
                    <Chip 
                      label={formatFileSize(item.size)} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 18 }}
                    />
                  )}
                </Box>
              }
            />
            {item.type === 'folder' && (
              <ListItemIcon sx={{ minWidth: 24 }}>
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </ListItemIcon>
            )}
          </ListItemButton>
        </ListItem>

        {item.type === 'folder' && item.children && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => renderFileItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <Paper sx={{ maxHeight: 380, overflow: 'auto' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Folder />
          Estructura del proyecto
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Haz clic en un archivo para ver su contenido
        </Typography>
      </Box>
      
      <List dense>
        {files.map((item) => renderFileItem(item))}
      </List>
    </Paper>
  );
};