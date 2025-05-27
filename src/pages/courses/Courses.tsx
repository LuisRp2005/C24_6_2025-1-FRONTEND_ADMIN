import { useState, useEffect } from 'react';
import { getCoursesPagination, deleteCourse } from '../../services/courseService';
import { Course } from '../../models/Course';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CardMedia,
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
  Tooltip,
  Pagination,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const fetchCourses = async (page: number) => {
    try {
      const response = await getCoursesPagination(page, itemsPerPage);
      const data = response.data;
      setCourses(Array.isArray(data?.content) ? data.content : []);
      setTotalPages(data?.totalPages || 0);
      setCurrentPage(data?.number || 0);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  };

  useEffect(() => {
    fetchCourses(currentPage);
  }, [currentPage]);

  const handleDelete = async (id: number) => {
    try {
      await deleteCourse(id);
      fetchCourses(currentPage);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">Cursos</Typography>
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
            {Array.isArray(courses) && courses.map((course) => (
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
                    {course.description?.substring(0, 50)}...
                  </Typography>
                </TableCell>
                <TableCell>{course.authorName}</TableCell>
                <TableCell>s/{course.price}</TableCell>
                <TableCell>
                <Chip
                  label={course.level?.name || 'Sin nivel'}
                  color={
                    course.level?.idLevel === 1 ? 'success'
                      : course.level?.idLevel === 2 ? 'warning'
                      : course.level?.idLevel === 3 ? 'error'
                      : 'default'
                  }
                  size="small"
                />
                </TableCell>
                <TableCell>
                  <Chip label={course.category?.name || 'Sin categoría'} color="info" size="small" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={course.status ? 'Activo' : 'Inactivo'}
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

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={currentPage + 1}
          onChange={(e, value) => setCurrentPage(value - 1)}
          color="primary"
        />
      </Box>
    </Box>
  );
}
