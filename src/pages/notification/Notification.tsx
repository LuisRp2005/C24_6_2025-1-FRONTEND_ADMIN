import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  Pagination,
  TextField,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

import {
  getNotificationsPagination,
  deleteNotification,
  sendTutorTip,
  sendTutorRecommendation,
  sendMotivationalNotification,
  sendDailyChallenge,
  sendCourseProgress,
} from '../../services/notificacionService';

import { Notification } from '../../models/Notification';

export default function Notifications() {
  const navigate = useNavigate();
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  const fetchNotifications = async () => {
    try {
      const response = await getNotificationsPagination(0, 1000);
      setAllNotifications(response.data.content || []);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/notifications/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta notificación?')) {
      try {
        await deleteNotification(id);
        fetchNotifications();
      } catch (error) {
        console.error('Error eliminando notificación:', error);
      }
    }
  };

  const handleQuickSend = async (type: string) => {
    try {
      switch (type) {
        case 'tutor-tip':
          await sendTutorTip();
          break;
        case 'tutor-recommendation':
          await sendTutorRecommendation();
          break;
        case 'motivational':
          await sendMotivationalNotification();
          break;
        case 'daily-challenge':
          await sendDailyChallenge();
          break;
        case 'course-progress':
          await sendCourseProgress();
          break;
      }
  
      alert('✅ Notificación enviada con éxito');
      fetchNotifications();
  
    } catch (error) {
      console.error('Error enviando notificación rápida:', error);
      alert('❌ Error al enviar la notificación');
    }
  };

  const filteredNotifications = allNotifications.filter((n) =>
    n.notificationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedNotifications = filteredNotifications.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4" component="h1">Notificaciones</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/notifications/create')}
        >
          Nueva Notificación
        </Button>
      </Stack>

      {/* Botones rápidos */}
      <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
        <Button variant="outlined" onClick={() => handleQuickSend('tutor-tip')}>Tutor Tip</Button>
        <Button variant="outlined" onClick={() => handleQuickSend('tutor-recommendation')}>Recomendación</Button>
        <Button variant="outlined" onClick={() => handleQuickSend('motivational')}>Motivacional</Button>
        <Button variant="outlined" onClick={() => handleQuickSend('daily-challenge')}>Desafío Diario</Button>
        <Button variant="outlined" onClick={() => handleQuickSend('course-progress')}>Progreso Curso</Button>
      </Stack>

      {/* Filtro de búsqueda */}
      <Box sx={{ mb: 2, maxWidth: 300 }}>
        <TextField
          label="Buscar notificación"
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {/* Tabla de notificaciones */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Mensaje</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedNotifications.map((notification) => (
                  <TableRow key={notification.idNotification}>
                    <TableCell>{notification.notificationType}</TableCell>
                    <TableCell>{notification.message}</TableCell>
                    <TableCell>{notification.user?.name}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(notification.idNotification)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(notification.idNotification)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={Math.ceil(filteredNotifications.length / itemsPerPage)}
              page={currentPage + 1}
              onChange={(e, value) => setCurrentPage(value - 1)}
              color="primary"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
