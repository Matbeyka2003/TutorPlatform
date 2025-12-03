import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Snackbar,
Checkbox,
FormGroup,
FormControlLabel,
Popover,
Badge,
} from '@mui/material'
import {
  ChevronLeft,
  ChevronRight,
  Today,
  AccessTime,
  Person,
  Edit,
  Delete,
  Paid,
  Label as LabelIcon,
    AttachFile as AttachFileIcon,
    School as SchoolIcon,
    Assignment as AssignmentIcon,
    Paid as PaidIcon,
    AccessAlarm as PreparationIcon,
    Send as SendIcon,
    FreeBreakfast as TrialIcon,
} from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { ru } from 'date-fns/locale'
import { format, parseISO, startOfWeek, addDays, eachDayOfInterval, isSameDay } from 'date-fns'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { lessonService } from '../services/lessonService'
import { clientService } from '../services/clientService'
import { Lesson, LessonCreate, Client } from '../types'
import { labelService } from '../services/labelService'

const CalendarPage: React.FC = () => {
  const queryClient = useQueryClient()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [openDialog, setOpenDialog] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })
  const [labelAnchorEl, setLabelAnchorEl] = useState<HTMLElement | null>(null)
  const [selectedLessonForLabels, setSelectedLessonForLabels] = useState<Lesson | null>(null)
  const [lessonStatusUpdates, setLessonStatusUpdates] = useState<{
      [key: number]: {
        isPaid: boolean
        requiresPreparation: boolean
        homeworkSent: boolean
        isTrial: boolean
      }
    }>({})

  // Начало недели (понедельник)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6),
  })

  // Запрос для получения занятий на неделю
  const { data: lessons = [], isLoading, error } = useQuery({
    queryKey: ['lessons', format(weekStart, 'yyyy-MM-dd')],
    queryFn: () => lessonService.getLessonsForWeek(format(weekStart, 'yyyy-MM-dd')),
  })

   // Запрос для получения меток
  const { data: labels = [] } = useQuery({
      queryKey: ['labels'],
      queryFn: () => labelService.getAllLabels(),
    })

  // Запрос для получения клиентов
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getAllClients(),
  })

  // Мутация для создания занятия
  const createMutation = useMutation({
    mutationFn: (lesson: LessonCreate) => lessonService.createLesson(lesson),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
      setSnackbar({ open: true, message: 'Занятие успешно создано', severity: 'success' })
      handleCloseDialog()
    },
    onError: (error: any) => {
      setSnackbar({ open: true, message: `Ошибка: ${error.message}`, severity: 'error' })
    },
  })

  // Мутация для обновления занятия
  const updateMutation = useMutation({
    mutationFn: ({ id, lesson }: { id: number; lesson: Partial<LessonCreate> }) =>
      lessonService.updateLesson(id, lesson),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
      setSnackbar({ open: true, message: 'Занятие успешно обновлено', severity: 'success' })
      handleCloseDialog()
    },
    onError: (error: any) => {
      setSnackbar({ open: true, message: `Ошибка: ${error.message}`, severity: 'error' })
    },
  })
 // Мутация для обновления статуса занятия
   const updateStatusMutation = useMutation({
     mutationFn: ({ lessonId, status }: { lessonId: number; status: any }) =>
       labelService.updateLessonStatus(lessonId, status),
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['lessons'] })
       setSnackbar({ open: true, message: 'Статус обновлен', severity: 'success' })
     },
     onError: (error: any) => {
       setSnackbar({ open: true, message: `Ошибка: ${error.message}`, severity: 'error' })
     },
   })

   // Мутация для добавления/удаления метки
   const labelMutation = useMutation({
     mutationFn: ({ lessonId, labelId, action }: { lessonId: number; labelId: number; action: 'add' | 'remove' }) =>
       action === 'add'
         ? labelService.addLabelToLesson(lessonId, labelId)
         : labelService.removeLabelFromLesson(lessonId, labelId),
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['lessons'] })
       setLabelAnchorEl(null)
       setSelectedLessonForLabels(null)
     },
     onError: (error: any) => {
       setSnackbar({ open: true, message: `Ошибка: ${error.message}`, severity: 'error' })
     },
   })

  const deleteMutation = useMutation({
  mutationFn: (id: number) => lessonService.deleteLesson(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['lessons'] })
    setSnackbar({ open: true, message: 'Занятие успешно удалено', severity: 'success' })
  },
  onError: (error: any) => {
    setSnackbar({ open: true, message: `Ошибка: ${error.message}`, severity: 'error' })
  },
})
  // Форма для занятия
  const [formData, setFormData] = useState<{
    clientId: string
    dateTime: string
    description: string
    isPaid: boolean
    tutorTimezone: string
    clientTimezone: string
  }>({
    clientId: '',
    dateTime: '',
    description: '',
    isPaid: false,
    tutorTimezone: 'Europe/Moscow',
    clientTimezone: 'Europe/Moscow',
  })

  const handlePrevWeek = () => {
    setCurrentDate(addDays(currentDate, -7))
  }

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleOpenDialog = (date?: Date, lesson?: Lesson) => {
    console.log('Opening dialog with lesson:', lesson)
    console.log('Available clients:', clients)

    if (lesson) {
      setEditingLesson(lesson)
      setFormData({
        clientId: lesson.client.id.toString(),
        dateTime: lesson.dateTime,
        description: lesson.description || '',
        isPaid: lesson.isPaid,
        tutorTimezone: lesson.tutorTimezone || 'Europe/Moscow',
        clientTimezone: lesson.clientTimezone || lesson.client.timezone,
      })
      setSelectedDate(parseISO(lesson.dateTime))
    } else if (date) {
      setEditingLesson(null)
      setSelectedDate(date)
      const dateTime = format(date, 'yyyy-MM-dd') + 'T10:00:00'

      // Если есть клиенты, выбираем первого по умолчанию
      const defaultClientId = clients.length > 0 ? clients[0].id.toString() : ''
      const defaultClient = clients.find(c => c.id.toString() === defaultClientId)

      setFormData({
        clientId: defaultClientId,
        dateTime,
        description: '',
        isPaid: false,
        tutorTimezone: 'Europe/Moscow',
        clientTimezone: defaultClient?.timezone || 'Europe/Moscow',
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingLesson(null)
    setSelectedDate(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.clientId) {
      setSnackbar({ open: true, message: 'Выберите клиента', severity: 'error' })
      return
    }

    const selectedClient = clients.find(c => c.id.toString() === formData.clientId)
    if (!selectedClient) {
      setSnackbar({ open: true, message: 'Клиент не найден', severity: 'error' })
      return
    }

    // Отправляем полный объект клиента
    const lessonData = {
      client: selectedClient, // Отправляем весь объект клиента
      dateTime: formData.dateTime,
      description: formData.description,
      isPaid: formData.isPaid,
      tutorTimezone: formData.tutorTimezone,
      clientTimezone: formData.clientTimezone,
    }

    console.log('Submitting lesson data:', lessonData)

    if (editingLesson) {
      updateMutation.mutate({ id: editingLesson.id, lesson: lessonData })
    } else {
      createMutation.mutate(lessonData)
    }
  }

  const handleDeleteLesson = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить это занятие?')) {
      deleteMutation.mutate(id)
    }
  }
  const handleLabelClick = (event: React.MouseEvent<HTMLElement>, lesson: Lesson) => {
    setLabelAnchorEl(event.currentTarget)
    setSelectedLessonForLabels(lesson)
  }

  const handleLabelClose = () => {
    setLabelAnchorEl(null)
    setSelectedLessonForLabels(null)
  }

  const handleToggleLabel = (labelId: number) => {
    if (!selectedLessonForLabels) return

    const hasLabel = selectedLessonForLabels.labels?.some(l => l.id === labelId)
    const action = hasLabel ? 'remove' : 'add'

    labelMutation.mutate({
      lessonId: selectedLessonForLabels.id,
      labelId,
      action
    })
  }

  const handleStatusChange = (lessonId: number, field: keyof typeof lessonStatusUpdates[number], value: boolean) => {
    setLessonStatusUpdates(prev => ({
      ...prev,
      [lessonId]: {
        ...prev[lessonId],
        [field]: value
      }
    }))

    // Отправляем обновление на сервер с задержкой (debounce)
    setTimeout(() => {
      updateStatusMutation.mutate({
        lessonId,
        status: { [field]: value }
      })
    }, 300)
  }

  const getLessonsForDay = (date: Date) => {
    return lessons.filter(lesson => {
      const lessonDate = parseISO(lesson.dateTime)
      return isSameDay(lessonDate, date)
    })
  }

  const formatLessonTime = (dateTime: string) => {
    return format(parseISO(dateTime), 'HH:mm')
  }

  // Обновляем часовой пояс клиента при выборе клиента
  useEffect(() => {
    if (formData.clientId && clients.length > 0) {
      const selectedClient = clients.find(c => c.id.toString() === formData.clientId)
      if (selectedClient) {
        setFormData(prev => ({
          ...prev,
          clientTimezone: selectedClient.timezone
        }))
      }
    }
  }, [formData.clientId, clients])

useEffect(() => {
  if (snackbar.open) {
    const timer = setTimeout(() => {
      setSnackbar({ ...snackbar, open: false })
    }, 6000)
    return () => clearTimeout(timer)
  }
}, [snackbar])

  if (isLoading || clientsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error">
        Ошибка загрузки занятий: {(error as Error).message}
      </Alert>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Календарь</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button startIcon={<ChevronLeft />} onClick={handlePrevWeek}>
              Прошлая неделя
            </Button>
            <Button startIcon={<Today />} onClick={handleToday}>
              Сегодня
            </Button>
            <Button endIcon={<ChevronRight />} onClick={handleNextWeek}>
              Следующая неделя
            </Button>
          </Box>
        </Box>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Неделя: {format(weekStart, 'dd.MM.yyyy')} - {format(addDays(weekStart, 6), 'dd.MM.yyyy')}
          </Typography>

          {clients.length === 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Сначала добавьте клиентов, чтобы создавать занятия
            </Alert>
          )}

          <Grid container spacing={2}>
            {weekDays.map((date, index) => (
              <Grid item xs={12} sm={6} md={4} lg key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      {format(date, 'EEE')} {format(date, 'dd.MM')}
                    </Typography>

                    {getLessonsForDay(date).map((lesson) => {
                      const lessonDate = parseISO(lesson.dateTime)
                      return (
                        <Card
                          key={lesson.id}
                          sx={{
                            mb: 1,
                            bgcolor: lesson.isPaid ? 'success.light' : 'warning.light',
                            position: 'relative',
                            borderLeft: lesson.isTrial ? '4px solid #9c27b0' : 'none',
                            borderTop: lesson.requiresPreparation ? '2px solid #ff9800' : 'none',
                            borderBottom: lesson.homeworkSent ? '2px solid #2196f3' : 'none',
                          }}
                        >
                          <CardContent sx={{ p: 1.5 }}>
                            {/* Заголовок с кнопками */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTime fontSize="small" sx={{ mr: 1 }} />
                                <Typography variant="body2">
                                  {formatLessonTime(lesson.dateTime)}
                                </Typography>

                                {/* Иконки статусов */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
                                  {lesson.isPaid && (
                                    <Tooltip title="Оплачено">
                                      <PaidIcon fontSize="small" color="success" />
                                    </Tooltip>
                                  )}
                                  {lesson.requiresPreparation && (
                                    <Tooltip title="Требуется подготовка">
                                      <PreparationIcon fontSize="small" color="warning" />
                                    </Tooltip>
                                  )}
                                  {lesson.homeworkSent && (
                                    <Tooltip title="ДЗ отправлено">
                                      <SendIcon fontSize="small" color="info" />
                                    </Tooltip>
                                  )}
                                  {lesson.isTrial && (
                                    <Tooltip title="Пробное занятие">
                                      <TrialIcon fontSize="small" color="secondary" />
                                    </Tooltip>
                                  )}
                                </Box>
                              </Box>

                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                {/* Кнопка для управления метками */}
                                <Tooltip title="Управление метками">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => handleLabelClick(e, lesson)}
                                  >
                                    <Badge
                                      badgeContent={lesson.labels?.length || 0}
                                      color="primary"
                                      size="small"
                                    >
                                      <LabelIcon fontSize="small" />
                                    </Badge>
                                  </IconButton>
                                </Tooltip>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <Tooltip title="Редактировать">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenDialog(undefined, lesson)}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Удалить">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteLesson(lesson.id)}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>


                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Person fontSize="small" sx={{ mr: 1 }} />
                              <Typography variant="body2" fontWeight="medium">
                                {lesson.client.name}
                              </Typography>
                            </Box>

                            {lesson.description && (
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {lesson.description}
                              </Typography>
                            )}

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                              <Chip
                                label={lesson.client.timezone}
                                size="small"
                                variant="outlined"
                              />
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {lesson.isPaid && (
                                  <Tooltip title="Оплачено">
                                    <Paid fontSize="small" color="success" />
                                  </Tooltip>
                                )}
                              </Box>
                            </Box>
                            {/* Отображение меток */}
                                {lesson.labels && lesson.labels.length > 0 && (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                                    {lesson.labels.map((label) => (
                                      <Chip
                                        key={label.id}
                                        label={label.emoji ? `${label.emoji} ${label.name}` : label.name}
                                        size="small"
                                        sx={{
                                          backgroundColor: label.color,
                                          color: '#fff',
                                          fontSize: '0.7rem',
                                          height: 20,
                                        }}
                                      />
                                    ))}
                                  </Box>
                                )}
                          </CardContent>
                        </Card>
                      )
                    })}

                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={() => handleOpenDialog(date)}
                      disabled={clients.length === 0}
                    >
                      + Добавить занятие
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Диалог добавления/редактирования занятия */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <form onSubmit={handleSubmit}>
            <DialogTitle>
              {editingLesson ? 'Редактировать занятие' : 'Добавить занятие'}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <TextField
                  select
                  label="Клиент *"
                  value={formData.clientId}
                  onChange={(e) => {
                    const clientId = e.target.value
                    console.log('Selected client ID:', clientId)
                    console.log('Available clients:', clients)

                    const selectedClient = clients.find(c => c.id.toString() === clientId)
                    console.log('Selected client:', selectedClient)

                    setFormData({
                      ...formData,
                      clientId,
                      clientTimezone: selectedClient?.timezone || 'Europe/Moscow',
                    })
                  }}
                  required
                  fullWidth
                  disabled={clients.length === 0}
                  error={!formData.clientId}
                  helperText={!formData.clientId ? 'Выберите клиента' : ''}
                >
                  <MenuItem value="">Выберите клиента</MenuItem>
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id.toString()}>
                      {client.name} ({client.phone})
                    </MenuItem>
                  ))}
                </TextField>

                <DatePicker
                  label="Дата"
                  value={selectedDate}
                  onChange={(date) => {
                    if (date) {
                      setSelectedDate(date)
                      const currentTime = formData.dateTime ? formData.dateTime.split('T')[1] : '10:00:00'
                      const dateTime = format(date, 'yyyy-MM-dd') + 'T' + currentTime
                      console.log('Setting dateTime:', dateTime)
                      setFormData({
                        ...formData,
                        dateTime,
                      })
                    }
                  }}
                  sx={{ width: '100%' }}
                />

                <TextField
                  label="Время"
                  type="time"
                  value={formData.dateTime.split('T')[1]?.substring(0, 5) || '10:00'}
                  onChange={(e) => {
                    const time = e.target.value + ':00'
                    const date = formData.dateTime.split('T')[0] || format(new Date(), 'yyyy-MM-dd')
                    const dateTime = date + 'T' + time
                    console.log('Setting time, dateTime:', dateTime)
                    setFormData({
                      ...formData,
                      dateTime,
                    })
                  }}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  InputProps={{
                    inputProps: {
                      step: 300, // 5 минут
                    }
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


<Box sx={{ display: 'flex', gap: 2 }}>
  <TextField
    select
    label="Часовой пояс репетитора"
    value={formData.tutorTimezone}
    onChange={(e) => setFormData({ ...formData, tutorTimezone: e.target.value })}
    fullWidth
  >
    <MenuItem value="Europe/Moscow">Europe/Moscow (Москва)</MenuItem>
    <MenuItem value="Europe/London">Europe/London (Лондон)</MenuItem>
    <MenuItem value="Europe/Berlin">Europe/Berlin (Берлин)</MenuItem>
    <MenuItem value="Asia/Almaty">Asia/Almaty (Алматы)</MenuItem>
    <MenuItem value="America/New_York">America/New_York (Нью-Йорк)</MenuItem>
  </TextField>

  <TextField
    select
    label="Часовой пояс клиента"
    value={formData.clientTimezone}
    onChange={(e) => setFormData({ ...formData, clientTimezone: e.target.value })}
    fullWidth
  >
    <MenuItem value="Europe/Moscow">Europe/Moscow (Москва)</MenuItem>
    <MenuItem value="Europe/London">Europe/London (Лондон)</MenuItem>
    <MenuItem value="Europe/Berlin">Europe/Berlin (Берлин)</MenuItem>
    <MenuItem value="Europe/Samara">Europe/Samara (Самара)</MenuItem>
    <MenuItem value="Asia/Almaty">Asia/Almaty (Алматы)</MenuItem>
    <MenuItem value="America/New_York">America/New_York (Нью-Йорк)</MenuItem>
  </TextField>
</Box>
// В диалоге добавления занятия, после полей с часовыми поясами:
<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
  <FormControlLabel
    control={
      <Checkbox
        checked={formData.isPaid}
        onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
      />
    }
    label={
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PaidIcon fontSize="small" />
        <Typography variant="body2">Оплачено</Typography>
      </Box>
    }
  />

  <FormControlLabel
    control={
      <Checkbox
        checked={formData.requiresPreparation}
        onChange={(e) => setFormData({ ...formData, requiresPreparation: e.target.checked })}
      />
    }
    label={
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PreparationIcon fontSize="small" />
        <Typography variant="body2">Требуется подготовка</Typography>
      </Box>
    }
  />

  <FormControlLabel
    control={
      <Checkbox
        checked={formData.homeworkSent}
        onChange={(e) => setFormData({ ...formData, homeworkSent: e.target.checked })}
      />
    }
    label={
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SendIcon fontSize="small" />
        <Typography variant="body2">ДЗ отправлено</Typography>
      </Box>
    }
  />

  <FormControlLabel
    control={
      <Checkbox
        checked={formData.isTrial}
        onChange={(e) => setFormData({ ...formData, isTrial: e.target.checked })}
      />
    }
    label={
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TrialIcon fontSize="small" />
        <Typography variant="body2">Пробное занятие</Typography>
      </Box>
    }
  />
</Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isPaid}
                      onChange={(e) => setFormData({ ...formData, isPaid: e.target.checked })}
                    />
                  }
                  label="Оплачено"
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Отмена</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={createMutation.isPending || updateMutation.isPending || !formData.clientId}
              >
                {(createMutation.isPending || updateMutation.isPending) ? (
                  <CircularProgress size={24} />
                ) : editingLesson ? (
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


        <Popover
          open={Boolean(labelAnchorEl)}
          anchorEl={labelAnchorEl}
          onClose={handleLabelClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 2, minWidth: 250 }}>
            <Typography variant="subtitle1" gutterBottom>
              Метки для занятия
            </Typography>

            {selectedLessonForLabels && (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Системные статусы:
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={selectedLessonForLabels.isPaid}
                          onChange={(e) => handleStatusChange(selectedLessonForLabels.id, 'isPaid', e.target.checked)}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PaidIcon fontSize="small" />
                          <Typography variant="body2">Оплачено</Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={selectedLessonForLabels.requiresPreparation}
                          onChange={(e) => handleStatusChange(selectedLessonForLabels.id, 'requiresPreparation', e.target.checked)}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PreparationIcon fontSize="small" />
                          <Typography variant="body2">Требуется подготовка</Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={selectedLessonForLabels.homeworkSent}
                          onChange={(e) => handleStatusChange(selectedLessonForLabels.id, 'homeworkSent', e.target.checked)}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SendIcon fontSize="small" />
                          <Typography variant="body2">ДЗ отправлено</Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={selectedLessonForLabels.isTrial}
                          onChange={(e) => handleStatusChange(selectedLessonForLabels.id, 'isTrial', e.target.checked)}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TrialIcon fontSize="small" />
                          <Typography variant="body2">Пробное занятие</Typography>
                        </Box>
                      }
                    />
                  </FormGroup>
                </Box>

                <Divider sx={{ my: 1 }} />

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Пользовательские метки:
                </Typography>

                {labels.length === 0 ? (
                  <Alert severity="info" sx={{ py: 0.5 }}>
                    Создайте метки в разделе "Метки"
                  </Alert>
                ) : (
                  <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                    {labels.map((label) => {
                      const isActive = selectedLessonForLabels.labels?.some(l => l.id === label.id)
                      return (
                        <Box
                          key={label.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 1,
                            borderRadius: 1,
                            bgcolor: isActive ? 'action.selected' : 'transparent',
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                          }}
                          onClick={() => handleToggleLabel(label.id)}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {label.emoji && (
                              <Typography>{label.emoji}</Typography>
                            )}
                            <Typography variant="body2">{label.name}</Typography>
                          </Box>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: label.color,
                            }}
                          />
                        </Box>
                      )
                    })}
                  </Box>
                )}
              </>
            )}
          </Box>
        </Popover>

      </Box>
    </LocalizationProvider>
  )
}

export default CalendarPage