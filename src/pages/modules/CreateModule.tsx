import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { createModule } from '../../services/moduleService';
import { getCourses } from '../../services/courseService';
import { Course } from '../../models/Course';
import { ModuleRequest } from '../../models/ModuleRequest';

export default function CreateModule() {
  const navigate = useNavigate();
  const [form, setForm] = useState<ModuleRequest>({
    name: '',
    description: '',
    numberModule: '',
    moduleOrder: 0,
    courseId: 0,
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data);
      } catch (err) {
        setError('Error al cargar los cursos.');
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'moduleOrder' ? Number(value) : value,
    }));
  };

  const handleCourseChange = (e: any) => {
    setForm(prev => ({
      ...prev,
      courseId: Number(e.target.value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, description, numberModule, moduleOrder, courseId } = form;

    if (!name || !description || !numberModule || !moduleOrder || !courseId) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await createModule(form);
      navigate('/modules');
    } catch (err) {
      console.error('Error creando módulo:', err);
      setError('Error al crear el módulo. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/modules')} sx={{ mb: 3 }}>
        Volver
      </Button>

      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Crear Nuevo Módulo
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Completa los siguientes campos para registrar un nuevo módulo.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {error && <Typography color="error">{error}</Typography>}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                required
                label="Nombre del Módulo"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
              />
              <TextField
                required
                label="Descripción"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  required
                  label="Número del Módulo"
                  name="numberModule"
                  value={form.numberModule}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  required
                  label="Orden del Módulo"
                  name="moduleOrder"
                  type="number"
                  value={form.moduleOrder}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>
              <FormControl fullWidth required>
                <InputLabel id="course-label">Curso</InputLabel>
                <Select
                  labelId="course-label"
                  value={form.courseId.toString()}
                  label="Curso"
                  onChange={handleCourseChange}
                >
                  {courses.map((course) => (
                    <MenuItem key={course.idCourse} value={course.idCourse}>
                      {course.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ minWidth: 150 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Crear Módulo'}
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  sx={{ minWidth: 150 }}
                  onClick={() => navigate('/modules')}
                  disabled={loading}
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
