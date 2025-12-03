import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AccessTime as TimezoneIcon,
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { ru } from 'date-fns/locale'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientService } from '../services/clientService'
import { Client } from '../types'

const ClientsPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [openDialog, setOpenDialog] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

  // Запрос для получения клиентов
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getAllClients(),
  })

  // Мутация для создания клиента
  const createMutation = useMutation({
    mutationFn: (client: Omit<Client, 'id'>) => clientService.createClient(client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      setSnackbar({ open: true, message: 'Клиент успешно создан', severity: 'success' })
      setOpenDialog(false)
    },
    onError: (error: any) => {
      setSnackbar({ open: true, message: `Ошибка: ${error.message}`, severity: 'error' })
    },
  })

  // Мутация для обновления клиента
  const updateMutation = useMutation({
    mutationFn: ({ id, client }: { id: number; client: Partial<Client> }) =>
      clientService.updateClient(id, client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      setSnackbar({ open: true, message: 'Клиент успешно обновлен', severity: 'success' })
      setOpenDialog(false)
      setEditingClient(null)
    },
    onError: (error: any) => {
      setSnackbar({ open: true, message: `Ошибка: ${error.message}`, severity: 'error' })
    },
  })

  // Мутация для удаления клиента
  const deleteMutation = useMutation({
    mutationFn: (id: number) => clientService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      setSnackbar({ open: true, message: 'Клиент успешно удален', severity: 'success' })
    },
    onError: (error: any) => {
      setSnackbar({ open: true, message: `Ошибка: ${error.message}`, severity: 'error' })
    },
  })

  // Форма для клиента
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    timezone: 'Europe/Moscow',
    city: '',
    description: '',
    lessonPrice: '',
  })

  const handleOpenDialog = (client?: Client) => {
    if (client) {
      setEditingClient(client)
      setFormData({
        name: client.name,
        phone: client.phone,
        timezone: client.timezone,
        city: client.city || '',
        description: client.description || '',
        lessonPrice: client.lessonPrice?.toString() || '',
      })
    } else {
      setEditingClient(null)
      setFormData({
        name: '',
        phone: '',
        timezone: 'Europe/Moscow',
        city: '',
        description: '',
        lessonPrice: '',
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingClient(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const clientData = {
      name: formData.name,
      phone: formData.phone,
      timezone: formData.timezone,
      city: formData.city || undefined,
      description: formData.description || undefined,
      lessonPrice: formData.lessonPrice ? parseFloat(formData.lessonPrice) : undefined,
    }

    if (editingClient) {
      updateMutation.mutate({ id: editingClient.id, client: clientData })
    } else {
      createMutation.mutate(clientData)
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этого клиента?')) {
      deleteMutation.mutate(id)
    }
  }

  const timezones = [
    'Europe/Moscow',
    'Europe/London',
    'Europe/Berlin',
    'Europe/Paris',
    'America/New_York',
    'Asia/Tokyo',
    'Asia/Shanghai',
  ]

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error">
        Ошибка загрузки клиентов: {(error as Error).message}
      </Alert>
    )
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Клиенты</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Добавить клиента
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Имя</TableCell>
              <TableCell>Контакт</TableCell>
              <TableCell>Город</TableCell>
              <TableCell>Часовой пояс</TableCell>
              <TableCell>Стоимость занятия</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id} hover>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {client.name}
                  </Typography>
                  {client.description && (
                    <Typography variant="body2" color="text.secondary">
                      {client.description}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2">{client.phone}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {client.city && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2">{client.city}</Typography>
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    label={client.timezone}
                    size="small"
                    variant="outlined"
                    icon={<TimezoneIcon fontSize="small" />}
                  />
                </TableCell>
                <TableCell>
                  {client.lessonPrice && (
                    <Typography variant="body1" fontWeight="medium">
                      {client.lessonPrice.toLocaleString('ru-RU')} ₽
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Редактировать">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(client)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Удалить">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(client.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалог добавления/редактирования клиента */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingClient ? 'Редактировать клиента' : 'Добавить клиента'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Имя *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Телефон *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                fullWidth
              />
              <TextField
                select
                label="Часовой пояс *"
                value={formData.timezone}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                required
                fullWidth
                SelectProps={{
                  native: true,
                }}
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </TextField>
              <TextField
                label="Город"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                fullWidth
              />
              <TextField
                label="Стоимость занятия"
                type="number"
                value={formData.lessonPrice}
                onChange={(e) => setFormData({ ...formData, lessonPrice: e.target.value })}
                fullWidth
                InputProps={{
                  endAdornment: <Typography variant="body2">₽</Typography>,
                }}
              />
              <TextField
                label="Описание"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                fullWidth
              />
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
              ) : editingClient ? (
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

export default ClientsPage