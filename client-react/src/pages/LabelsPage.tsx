// src/pages/LabelsPage.tsx
import React from 'react'
import { Container, Typography, Box, Paper } from '@mui/material'
import LabelManager from '../components/LabelManager'

const LabelsPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Метки занятий
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Создавайте и управляйте метками для организации занятий. Метки помогают быстро
          идентифицировать тип занятия, его статус или особенности.
        </Typography>

        <Paper sx={{ p: 3, mt: 3 }}>
          <LabelManager />
        </Paper>
      </Box>
    </Container>
  )
}

export default LabelsPage