import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  FormControl
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material';
import { updateModule, getModuleById } from '../../services/moduleService';
import { getCourses } from '../../services/courseService';
import { Course } from '../../models/Course';
import { ModuleRequest } from '../../models/ModuleRequest';

export default function EditModule() {
  const navigate = useNavigate();
  const { id } = useParams();  // Get the module ID from the route parameters

  const [form, setForm] = useState<Partial<ModuleRequest>>({
    name: '',
    description: '',
    numberModule: '',
    moduleOrder: 0,
    courseId: 0
  });

  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getCourses();
        setCourses(res.data);
      } catch (error) {
        console.error('Error cargando cursos:', error);
      }
    };

    const fetchModule = async () => {
      if (id) {
        try {
          const res = await getModuleById(Number(id));
          console.log("Fetched module:", res.data); // Check the response data
          if (res.data) {
            setForm({
              ...res.data,
              courseId: res.data.courseId || 0, // Asegúrate de manejar correctamente courseId
            });
          }
        } catch (error) {
          console.error('Error cargando el módulo:', error);
        }
      }
    };

    fetchCourses();
    fetchModule();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'moduleOrder' ? Number(value) : value,
    }));
  };

  const handleCourseChange = (event: SelectChangeEvent<string>) => {
    const courseId = Number(event.target.value);
    setForm((prev) => ({
      ...prev,
      courseId, // Asegúrate de actualizar correctamente courseId
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, description, numberModule, moduleOrder, courseId } = form;

    if (!name || !description || !numberModule || !moduleOrder || !courseId) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const payload: ModuleRequest = {
      name,
      description,
      numberModule,
      moduleOrder,
      courseId,
    };

    try {
      await updateModule(Number(id), payload);  // Update the module
      navigate('/modules');
    } catch (error: any) {
      console.error('Error actualizando módulo:', error?.response?.data || error.message);
      alert('Error actualizando módulo. Verifica los datos.');
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
            Editar Módulo
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Actualiza los siguientes campos para modificar el módulo.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                required
                label="Nombre del Módulo"
                name="name"
                value={form.name || ''}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                required
                label="Descripción"
                name="description"
                value={form.description || ''}
                onChange={handleChange}
                multiline
                rows={3}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  required
                  label="Número del Módulo"
                  name="numberModule"
                  value={form.numberModule || ''}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  required
                  label="Orden del Módulo"
                  name="moduleOrder"
                  type="number"
                  value={form.moduleOrder || ''}
                  onChange={handleChange}
                />
              </Box>

              <FormControl fullWidth required>
                <InputLabel id="select-course-label">Curso</InputLabel>
                <Select
                  labelId="select-course-label"
                  value={form.courseId?.toString() || ''}
                  onChange={handleCourseChange}
                  label="Curso"
                >
                  {courses.map((course) => (
                    <MenuItem key={course.idCourse} value={course.idCourse}>
                      {course.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Button type="submit" variant="contained" color="primary" size="large" sx={{ minWidth: 150 }}>
                  Actualizar Módulo
                </Button>
                <Button variant="outlined" color="inherit" size="large" onClick={() => navigate('/modules')} sx={{ minWidth: 150 }}>
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
   