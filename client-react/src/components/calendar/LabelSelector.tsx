// src/components/calendar/LabelSelector.tsx
import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Paper,
} from '@mui/material';
import { Label } from '../../types';

interface LabelSelectorProps {
  labels: Label[];
  selectedIds: number[];
  onSelect: (labelId: number) => void;
}

const LabelSelector: React.FC<LabelSelectorProps> = ({
  labels,
  selectedIds,
  onSelect,
}) => {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Выберите метки для занятия:
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {labels.map(label => {
          const isSelected = selectedIds.includes(label.id);

          return (
            <Chip
              key={label.id}
              label={label.emoji ? `${label.emoji} ${label.name}` : label.name}
              onClick={() => onSelect(label.id)}
              variant={isSelected ? 'filled' : 'outlined'}
              sx={{
                bgcolor: isSelected ? label.color : 'transparent',
                color: isSelected ? 'white' : label.color,
                borderColor: label.color,
                '&:hover': {
                  bgcolor: isSelected ? label.color : `${label.color}20`,
                },
              }}
            />
          );
        })}
      </Box>
    </Paper>
  );
};

export default LabelSelector;