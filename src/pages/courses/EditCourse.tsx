import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCourseById, updateCourse } from '../../services/courseService';
import { getCategories } from '../../services/categoryservice';
import { uploadToCloudinary } from '../../services/cloudinaryService';
import { Category } from '../../models/Category';
import { CourseEditDTO } from '../../models/CourseEditDTO';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Stack,
  Divider,
  MenuItem,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { AxiosError } from 'axios';

interface EditCoursePayload {
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

export default function EditCourse() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [course, setCourse] = useState<Partial<EditCoursePayload>>({});
  const [imageProfile, setImageProfile] = useState<File | null>(null);
  const [imageBanner, setImageBanner] = useState<File | null>(null);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(console.error);

    if (id) {
      getCourseById(Number(id))
        .then((res) => {
          const courseData: CourseEditDTO = res.data;
          setCourse({
            ...courseData,
            level: { idLevel: courseData.levelId },
            category: { idCategory: courseData.categoryId },
          });
          setSelectedLevel(courseData.levelId);
        })
        .catch(console.error);
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setCourse({
      ...course,
      [name]: type === 'number' ? Number(value) : value,
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
    setCourse({
      ...course,
      level: { idLevel: levelId },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'imageProfile' | 'imageBanner') => {
    const file = e.target.files?.[0];
    if (file) {
      if (fileType === 'imageProfile') {
        setImageProfile(file);
        setCourse((prev) => ({ ...prev, imageProfile: URL.createObjectURL(file) }));
      } else {
        setImageBanner(file);
        setCourse((prev) => ({ ...prev, imageBanner: URL.createObjectURL(file) }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!course.category || !course.level) {
      console.error('Faltan categoría o nivel.');
      return;
    }

    try {
      let imageProfileUrl = course.imageProfile;
      let imageBannerUrl = course.imageBanner;

      if (imageProfile) imageProfileUrl = await uploadToCloudinary(imageProfile);
      if (imageBanner) imageBannerUrl = await uploadToCloudinary(imageBanner);

      const payload: EditCoursePayload = {
        name: course.name || '',
        authorName: course.authorName || '',
        description: course.description || '',
        price: course.price || 0,
        imageProfile: imageProfileUrl || '',
        imageBanner: imageBannerUrl || '',
        status: true,
        uploadDate: course.uploadDate || new Date().toISOString().split('T')[0],
        level: { idLevel: selectedLevel },
        category: { idCategory: course.category.idCategory },
      };

      await updateCourse(Number(id), payload);
      navigate('/courses');
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error al actualizar curso:', axiosError.message);
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
          <Typography variant="h4" gutterBottom>
            Editar Curso
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Modifique los campos que desee actualizar.
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
                  value={course.name || ''}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  required
                  label="Autor"
                  name="authorName"
                  value={course.authorName || ''}
                  onChange={handleChange}
                />
              </Box>

              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Descripción"
                name="description"
                value={course.description || ''}
                onChange={handleChange}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Precio"
                  name="price"
                  value={course.price || ''}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  required
                  select
                  label="Categoría"
                  value={course.category?.idCategory || ''}
                  onChange={handleCategoryChange}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.idCategory} value={cat.idCategory}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <TextField
                fullWidth
                required
                select
                label="Nivel"
                value={selectedLevel}
                onChange={handleLevelChange}
              >
                <MenuItem value={1}>BASIC</MenuItem>
                <MenuItem value={2}>INTERMEDIATE</MenuItem>
                <MenuItem value={3}>ADVANCED</MenuItem>
              </TextField>

              <Box sx={{ display: 'flex', gap: 3 }}>
                {/* Imagen de Perfil */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">Imagen de Perfil</Typography>
                  {course.imageProfile && (
                    <img
                      src={course.imageProfile}
                      alt="Imagen perfil"
                      style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '8px' }}
                    />
                  )}
                  <label htmlFor="edit-profile">
                    <input
                      id="edit-profile"
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={(e) => handleFileChange(e, 'imageProfile')}
                    />
                    <Button variant="outlined" component="span">
                      Subir nueva imagen
                    </Button>
                  </label>
                </Box>

                {/* Imagen de Banner */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">Imagen de Banner</Typography>
                  {course.imageBanner && (
                    <img
                      src={course.imageBanner}
                      alt="Imagen banner"
                      style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: '8px' }}
                    />
                  )}
                  <label htmlFor="edit-banner">
                    <input
                      id="edit-banner"
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={(e) => handleFileChange(e, 'imageBanner')}
                    />
                    <Button variant="outlined" component="span">
                      Subir nuevo banner
                    </Button>
                  </label>
                </Box>
              </Box>

              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Button type="submit" variant="contained" color="primary" size="large">
                  Actualizar Curso
                </Button>
                <Button variant="outlined" onClick={() => navigate('/courses')} size="large">
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
