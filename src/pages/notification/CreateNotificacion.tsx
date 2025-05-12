import {
    Box,
    Button,
    Card,
    CardContent,
    TextField,
    Typography,
    Stack,
    Divider,
    Checkbox,
    FormControlLabel,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    CircularProgress,
  } from '@mui/material';
  import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
  import { useEffect, useState } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { Notification } from '../../models/Notification';
  import { getUsers } from '../../services/userService';
  import { createNotification, createNotificationForAll } from '../../services/notificacionService';
  import { User } from '../../models/User';
  
  export default function CreateNotification() {
    const navigate = useNavigate();
  
    const [notification, setNotification] = useState<Partial<Notification>>({
      notificationType: '',
      message: '',
    });
  
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [sendToAll, setSendToAll] = useState(false);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const data = await getUsers();
          setUsers(data.data);
          setLoading(false);
        } catch (error) {
          console.error('Error al obtener usuarios:', error);
        }
      };
      fetchUsers();
    }, []);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setNotification((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (sendToAll) {
          await createNotificationForAll(notification as Notification);
        } else {
          if (!selectedUser) return alert('Seleccione un usuario');
          await createNotification({ ...notification, idUser: selectedUser } as Notification);
        }
        navigate('/notifications');
      } catch (error) {
        console.error('Error al crear notificación:', error);
      }
    };
  
    if (loading) {
      return (
        <Box sx={{ p: 5, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Cargando usuarios...
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
              Crear Nueva Notificación
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Complete los campos para crear una notificación personalizada o para todos los usuarios.
            </Typography>
  
            <Divider sx={{ my: 3 }} />
  
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
              <FormControl fullWidth disabled={sendToAll}>
                <InputLabel id="user-select-label">Seleccionar Usuario</InputLabel>
                <Select
                  labelId="user-select-label"
                  value={selectedUser ?? ''}
                  onChange={(e) => setSelectedUser(Number(e.target.value))}
                  label="Seleccionar Usuario"
                  required={!sendToAll}
                >
                  {users.map((user) => (
                    <MenuItem key={user.idUser} value={user.idUser}>
                      {user.name} {user.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
  
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sendToAll}
                      onChange={(e) => {
                        setSendToAll(e.target.checked);
                        if (e.target.checked) setSelectedUser(null);
                      }}
                    />
                  }
                  label="Enviar a todos los usuarios"
                />
  
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
                    Crear Notificación
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
  