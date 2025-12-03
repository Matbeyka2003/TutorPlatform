import React from 'react'
import { CircularProgress, Box } from '@mui/material'

interface LoadingSpinnerProps {
  size?: number
  fullScreen?: boolean
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  fullScreen = false
}) => {
  const spinner = <CircularProgress size={size} />

  if (fullScreen) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        {spinner}
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3,
      }}
    >
      {spinner}
    </Box>
  )
}

export default LoadingSpinner