import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField, Button, FormControlLabel, Checkbox, MenuItem,
  Box, Card, CardContent, Typography, Stack, Divider
} from '@mui/material';
import { Category } from '../../models/Category';
import { getCategories } from '../../services/categoryservice';
import { createCourse } from '../../services/courseService';
import { uploadToCloudinary } from '../../services/cloudinaryService';
import { AxiosError } from 'axios';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

interface CreateCoursePayload {
  name: string;
  authorName: string;
  description: string;
  price: number;
  imageProfile: string;
  imageBanner: string;
  status: boolean;
  uploadDate: string;
  level: { idLevel: number };
  category: { idCategory: number };
}

interface CourseFormState extends Omit<CreateCoursePayload, 'imageProfile' | 'imageBanner'> {
  imageProfile: File | null;
  imageBanner: File | null;
}

export default function CreateCourse() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [course, setCourse] = useState<Partial<CourseFormState>>({
    name: '',
    authorName: '',
    description: '',
    price: 0,
    imageProfile: null,
    imageBanner: null,
    status: true,
    uploadDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCourse({
      ...course,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value),
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedId = Number(e.target.value);
    setCourse({
      ...course,
      category: { idCategory: selectedId },
    });
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const levelId = Number(e.target.value);
    setSelectedLevel(levelId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!course.category || !course.imageProfile || !course.imageBanner) {
      console.error('Faltan campos requeridos');
      return;
    }
  
    try {
      const imageProfileUrl = await uploadToCloudinary(course.imageProfile);
      const imageBannerUrl = await uploadToCloudinary(course.imageBanner);
  
      const payload: CreateCoursePayload = {
        name: course.name || '',
        authorName: course.authorName || '',
        description: course.description || '',
        price: course.price || 0,
        imageProfile: imageProfileUrl,
        imageBanner: imageBannerUrl,
        status: course.status ?? true,
        uploadDate: new Date().toISOString().split('T')[0],
        level: { idLevel: selectedLevel },
        category: { idCategory: course.category.idCategory },
      };
  
      await createCourse(payload);
      navigate('/courses');
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error subiendo imagen o creando curso:', axiosError.message);
      if (axiosError.response) {
        console.error('Detalles del error:', axiosError.response.data);
      }
    }
  };
  

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/courses')} sx={{ mb: 3 }}>
        Volver
      </Button>
  
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Crear Nuevo Curso
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Complete los siguientes campos para crear un nuevo curso.
          </Typography>
  
          <Divider sx={{ my: 3 }} />
  
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  required
                  label="Nombre del Curso"
                  name="name"
                  value={course.name}
                  onChange={handleChange}
                  variant="outlined"
                  helperText="Ingrese el nombre del curso"
                />
                <TextField
                  fullWidth
                  required
                  label="Autor"
                  name="authorName"
                  value={course.authorName}
                  onChange={handleChange}
                  variant="outlined"
                  helperText="Ingrese el nombre del autor"
                />
              </Box>
  
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Descripción"
                name="description"
                value={course.description}
                onChange={handleChange}
                variant="outlined"
                helperText="Proporcione una descripción detallada del curso"
              />
  
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Precio"
                  name="price"
                  value={course.price}
                  onChange={handleChange}
                  variant="outlined"
                  helperText="Ingrese el precio del curso"
                />
                <TextField
                  fullWidth
                  required
                  select
                  label="Categoría"
                  value={course.category?.idCategory || ''}
                  onChange={handleCategoryChange}
                  variant="outlined"
                  helperText="Seleccione la categoría del curso"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.idCategory} value={cat.idCategory}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
  
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  required
                  select
                  label="Nivel"
                  value={selectedLevel}
                  onChange={handleLevelChange}
                  variant="outlined"
                  helperText="Seleccione el nivel del curso"
                >
                  <MenuItem value={1}>BÁSICO</MenuItem>
                  <MenuItem value={2}>INTERMEDIO</MenuItem>
                  <MenuItem value={3}>AVANZADO</MenuItem>
                </TextField>
              </Box>
  
              {/* Imagen de Banner */}
              <Box sx={{ display: 'flex', gap: 2 }}>
                {/* Imagen de Perfil */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Imagen de Perfil
                  </Typography>
                  <input
                    required
                    type="file"
                    name="imageProfile"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setCourse((prev) => ({ ...prev, imageProfile: file }));
                    }}
                  />
                </Box>

                {/* Imagen de Banner */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Imagen de Banner
                  </Typography>
                  <input
                    required
                    type="file"
                    name="imageBanner"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setCourse((prev) => ({ ...prev, imageBanner: file }));
                    }}
                  />
                </Box>
              </Box>

  
              <FormControlLabel
                control={
                  <Checkbox
                    checked={course.status ?? true}
                    onChange={handleChange}
                    name="status"
                  />
                }
                label="Curso Activo"
              />
  
              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Button type="submit" variant="contained" color="primary" size="large" sx={{ minWidth: 150 }}>
                  Crear Curso
                </Button>
                <Button variant="outlined" color="inherit" size="large" onClick={() => navigate('/courses')} sx={{ minWidth: 150 }}>
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
  
