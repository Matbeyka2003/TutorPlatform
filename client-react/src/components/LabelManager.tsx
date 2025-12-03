// src/components/LabelManager.tsx
import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Label as LabelIcon,
  ColorLens as ColorLensIcon,
  EmojiEmotions as EmojiIcon,
} from '@mui/icons-material'
import { SketchPicker } from 'react-color'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { labelService } from '../services/labelService'

const LabelManager: React.FC = () => {
  const queryClient = useQueryClient()
  const [openDialog, setOpenDialog] = useState(false)
  const [editingLabel, setEditingLabel] = useState<Label | null>(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

  const [formData, setFormData] = useState({
    name: '',
    color: '#3498db',
    emoji: '',
  })

  const emojis = [
    '🔥', '⭐', '🎯', '📚', '💡', '🎓', '🏆', '💯',
    '📝', '✏️', '📖', '🎨', '🎵', '⚡', '💎', '🌟',
    '✅', '⚠️', '❌', '❓', '❗', '💬', '📅', '⏰'
  ]

  // Запрос для получения меток
  const { data: labels = [], isLoading, error } = useQuery({
    queryKey: ['labels'],
    queryFn: () => labelService.getAllLabels(),
  })

  // Мутация для создания метки
  const createMutation = useMutation({
    mutationFn: (label: Omit<Label, 'id'>) => labelService.createLabel(label),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] })
      setSnackbar({ open: true, message: 'Метка успешно создана', severity: 'success' })
      handleCloseDialog()
    },
    onError: (error: any) => {
      setSnackbar({ open: true, message: `Ошибка: ${error.message}`, severity: 'error' })
    },
  })

  // Мутация для обновления метки
  const updateMutation = useMutation({
    mutationFn: ({ id, label }: { id: number; label: Partial<Label> }) =>
      labelService.updateLabel(id, label),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] })
      setSnackbar({ open: true, message: 'Метка успешно обновлена', severity: 'success' })
      handleCloseDialog()
    },
    onError: (error: any) => {
      setSnackbar({ open: true, message: `Ошибка: ${error.message}`, severity: 'error' })
    },
  })

  // Мутация для удаления метки
  const deleteMutation = useMutation({
    mutationFn: (id: number) => labelService.deleteLabel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labels'] })
      setSnackbar({ open: true, message: 'Метка успешно удалена', severity: 'success' })
    },
    onError: (error: any) => {
      setSnackbar({ open: true, message: `Ошибка: ${error.message}`, severity: 'error' })
    },
  })

  const handleOpenDialog = (label?: Label) => {
    if (label) {
      setEditingLabel(label)
      setFormData({
        name: label.name,
        color: label.color,
        emoji: label.emoji || '',
      })
    } else {
      setEditingLabel(null)
      setFormData({
        name: '',
        color: '#3498db',
        emoji: '',
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingLabel(null)
    setShowColorPicker(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setSnackbar({ open: true, message: 'Введите название метки', severity: 'error' })
      return
    }

    const labelData = {
      name: formData.name.trim(),
      color: formData.color,
      emoji: formData.emoji || undefined,
    }

    if (editingLabel) {
      updateMutation.mutate({ id: editingLabel.id, label: labelData })
    } else {
      createMutation.mutate(labelData)
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить эту метку?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleColorChange = (color: any) => {
    setFormData({ ...formData, color: color.hex })
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error">
        Ошибка загрузки меток: {(error as Error).message}
      </Alert>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LabelIcon /> Управление метками
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Создать метку
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        {labels.length === 0 ? (
          <Alert severity="info">
            У вас пока нет меток. Создайте первую метку для организации занятий.
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {labels.map((label) => (
              <Grid item xs={12} sm={6} md={4} key={label.id}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderLeft: `4px solid ${label.color}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {label.emoji && (
                      <Typography variant="h6">{label.emoji}</Typography>
                    )}
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {label.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: label.color,
                            border: '1px solid #ddd',
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {label.color}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                    <Tooltip title="Редактировать">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(label)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Удалить">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(label.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Диалог создания/редактирования метки */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingLabel ? 'Редактировать метку' : 'Создать метку'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
              <TextField
                label="Название метки *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                fullWidth
                placeholder="Например: Сложная тема, Домашнее задание"
              />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Цвет метки
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      backgroundColor: formData.color,
                      border: '2px solid #ddd',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  >
                    <ColorLensIcon sx={{ color: '#fff', fontSize: 20 }} />
                  </Box>
                  <TextField
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    size="small"
                    sx={{ width: 120 }}
                  />
                </Box>

                {showColorPicker && (
                  <Box sx={{ position: 'absolute', zIndex: 1000, mt: 1 }}>
                    <SketchPicker
                      color={formData.color}
                      onChange={handleColorChange}
                      onChangeComplete={handleColorChange}
                    />
                  </Box>
                )}
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmojiIcon /> Эмодзи (опционально)
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxHeight: 120, overflowY: 'auto', p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
                  {emojis.map((emoji) => (
                    <Button
                      key={emoji}
                      variant={formData.emoji === emoji ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setFormData({ ...formData, emoji })}
                      sx={{ minWidth: 40, minHeight: 40, fontSize: '1.2rem' }}
                    >
                      {emoji}
                    </Button>
                  ))}
                </Box>
                {formData.emoji && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Typography variant="body2">Выбрано:</Typography>
                    <Typography variant="h5">{formData.emoji}</Typography>
                    <Button
                      size="small"
                      onClick={() => setFormData({ ...formData, emoji: '' })}
                    >
                      Очистить
                    </Button>
                  </Box>
                )}
              </Box>

              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Предпросмотр:
                </Typography>
                <Chip
                  label={formData.name || 'Название метки'}
                  sx={{
                    backgroundColor: formData.color,
                    color: '#fff',
                    fontWeight: 'medium',
                    fontSize: '0.9rem',
                  }}
                  icon={formData.emoji ? <Typography>{formData.emoji}</Typography> : undefined}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Отмена</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) ? (
                <CircularProgress size={24} />
              ) : editingLabel ? (
                'Сохранить'
              ) : (
                'Создать'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Снекбар для уведомлений */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default LabelManager