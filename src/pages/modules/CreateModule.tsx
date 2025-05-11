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
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { ModuleRequest } from '../../models/ModuleRequest';
import { createModule } from '../../services/moduleService';
import { getCourses } from '../../services/courseService';
import { Course } from '../../models/Course';

export default function CreateModule() {
  const navigate = useNavigate();

  // Estado para el formulario
  const [moduleData, setModuleData] = useState<ModuleRequest>({
    name: '',
    description: '',
    numberModule: '',
    moduleOrder: 0,
    courseId: 0
  });

  // Estado para los cursos
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Cargar los cursos desde la API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data); // Asumiendo que la respuesta tiene la lista de cursos
      } catch (err) {
        setError('Hubo un error al cargar los cursos.');
      }
    };

    fetchCourses();
  }, []);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    const newValue = ['moduleOrder'].includes(name) ? Number(value) : value;
  
    setModuleData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };
  

  const handleSelectChange = (e: any) => {
    const value = Number(e.target.value);
    setModuleData({ ...moduleData, courseId: value });
  };
  
  

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validación simple
    if (
      !moduleData.name ||
      !moduleData.description ||
      !moduleData.numberModule ||
      !moduleData.courseId ||
      moduleData.moduleOrder <= 0
    ) {
      setError('Por favor, complete todos los campos.');
      return;
    }
  
    setError(null); // Limpiar errores
  
    try {
      await createModule(moduleData);
      navigate('/modules'); // Redirigir al listado de módulos después de la creación
    } catch (err) {
      console.error('Error en la creación del módulo:', err);
      setError('Hubo un error al crear el módulo. Intente de nuevo.');
    }
  };
  

  return (
    <Box sx={{ padding: 2 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/modules')}
      >
        Volver a módulos
      </Button>

      <Card sx={{ marginTop: 3 }}>
        <CardContent>
          <Typography variant="h5">Crear Nuevo Módulo</Typography>
          <Divider sx={{ marginY: 2 }} />
          {error && <Typography color="error">{error}</Typography>}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Nombre del Módulo"
                variant="outlined"
                fullWidth
                name="name"
                value={moduleData.name}
                onChange={handleInputChange}
              />
              <TextField
                label="Descripción"
                variant="outlined"
                fullWidth
                name="description"
                value={moduleData.description}
                onChange={handleInputChange}
              />
              <TextField
                label="Número del Módulo"
                variant="outlined"
                fullWidth
                name="numberModule"
                value={moduleData.numberModule}
                onChange={handleInputChange}
              />
              <TextField
                label="Orden del Módulo"
                variant="outlined"
                fullWidth
                type="number"
                name="moduleOrder"
                value={moduleData.moduleOrder}
                onChange={handleInputChange}
              />
              <FormControl fullWidth>
                <InputLabel id="course-select-label">Seleccionar Curso</InputLabel>
                <Select
                  labelId="course-select-label"
                  value={moduleData.courseId}
                  onChange={handleSelectChange}
                  label="Seleccionar Curso"
                >
                  {courses.map((course) => (
                    <MenuItem key={course.idCourse} value={course.idCourse}>
                      {course.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" type="submit">
                Crear Módulo
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
