import { useState, useEffect } from 'react';
import { getCourses, deleteCourse } from '../../services/courseService';
import { Course } from '../../models/Course';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Stack,
  Tooltip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteCourse(id);
      setCourses(courses.filter((course) => course.idCourse !== id));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Cursos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/courses/create')}
        >
          Crear Curso
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Imagen</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Autor</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Nivel</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.idCourse} hover>
                <TableCell>
                  <CardMedia
                    component="img"
                    sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }}
                    image={course.imageProfile}
                    alt={course.name}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1">{course.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.description.substring(0, 50)}...
                  </Typography>
                </TableCell>
                <TableCell>{course.authorName}</TableCell>
                <TableCell>${course.price}</TableCell>
                <TableCell>
                  <Chip
                    label={course.level.name}
                    color={
                      course.level.idLevel === 1
                        ? 'success'
                        : course.level.idLevel === 2
                        ? 'warning'
                        : 'error'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip label={course.category.name} color="info" size="small" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={course.status ? 'Active' : 'Inactive'}
                    color={course.status ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/courses/edit/${course.idCourse}`)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(course.idCourse)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
