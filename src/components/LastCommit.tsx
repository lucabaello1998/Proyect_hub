import React from 'react';
import { Paper, Typography, Box, Chip, Avatar } from '@mui/material';
import { Code, Person, CalendarToday } from '@mui/icons-material';
import type { GitCommit } from '../types/project';

interface LastCommitProps {
  commit: GitCommit;
  totalCommits?: number;
  contributors?: number;
}

export const LastCommit: React.FC<LastCommitProps> = ({ 
  commit, 
  totalCommits = 0, 
  contributors = 0 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'hace menos de 1 hora';
    } else if (diffHours < 24) {
      return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
      return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Code fontSize="small" />
        Último commit
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Avatar 
          sx={{ 
            bgcolor: getAvatarColor(commit.author),
            width: 40, 
            height: 40,
            fontSize: '0.875rem'
          }}
        >
          {commit.author.split(' ').map(n => n[0]).join('').toUpperCase()}
        </Avatar>

        <Box sx={{ flex: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
            {commit.message}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Person fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {commit.author}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarToday fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {formatDate(commit.date)}
              </Typography>
            </Box>

            <Chip 
              label={`${commit.filesChanged} archivo${commit.filesChanged !== 1 ? 's' : ''} modificado${commit.filesChanged !== 1 ? 's' : ''}`}
              size="small" 
              variant="outlined"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>#{commit.hash}</strong>
            </Typography>
            {totalCommits > 0 && (
              <Typography variant="body2" color="text.secondary">
                {totalCommits} commits totales
              </Typography>
            )}
            {contributors > 0 && (
              <Typography variant="body2" color="text.secondary">
                {contributors} colaborador{contributors !== 1 ? 'es' : ''}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};