import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Stack,
    Divider,
    CircularProgress,
  } from '@mui/material';
  import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
  import { useEffect, useState } from 'react';
  import { useNavigate, useParams } from 'react-router-dom';
  import { Notification } from '../../models/Notification';
  import { getNotificationById, updateNotification } from '../../services/notificacionService';
  
  export default function EditNotification() {
    const { id } = useParams();
    const navigate = useNavigate();
  
    const [notification, setNotification] = useState<Partial<Notification>>({
      notificationType: '',
      message: '',
    });
  
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchNotification = async () => {
        try {
          const data = await getNotificationById(Number(id));
          setNotification({
            notificationType: data.data.notificationType,
            message: data.data.message,
          });
          setLoading(false);
        } catch (error) {
          console.error('Error al cargar la notificación:', error);
        }
      };
  
      fetchNotification();
    }, [id]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setNotification((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await updateNotification(Number(id), notification as Notification);
        navigate('/notification');
      } catch (error) {
        console.error('Error al actualizar la notificación:', error);
      }
    };
  
    if (loading) {
      return (
        <Box sx={{ p: 5, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Cargando notificación...
          </Typography>
        </Box>
      );
    }
  
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/notifications')} sx={{ mb: 3 }}>
          Volver
        </Button>
  
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Editar Notificación
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Modifique el tipo y el mensaje de la notificación.
            </Typography>
  
            <Divider sx={{ my: 3 }} />
  
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  required
                  name="notificationType"
                  label="Tipo de Notificación"
                  value={notification.notificationType || ''}
                  onChange={handleChange}
                />
  
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  required
                  name="message"
                  label="Mensaje"
                  value={notification.message || ''}
                  onChange={handleChange}
                />
  
                <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                  <Button type="submit" variant="contained" color="primary" size="large" sx={{ minWidth: 150 }}>
                    Guardar Cambios
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    onClick={() => navigate('/notification')}
                    sx={{ minWidth: 150 }}
                  >
                    Cancelar
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }
  