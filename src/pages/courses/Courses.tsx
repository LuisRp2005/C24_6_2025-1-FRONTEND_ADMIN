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
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | 1 | 2 | 3>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateOrder, setDateOrder] = useState<'recent' | 'oldest'>('recent');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await getCoursesPagination(0, 1000);
      const data = response.data;
      setCourses(Array.isArray(data?.content) ? data.content : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, statusFilter, levelFilter, categoryFilter, dateOrder]);

  const handleDelete = async (id: number) => {
    try {
      await deleteCourse(id);
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const categoryOptions = Array.from(new Set(courses.map(c => c.category?.name).filter(Boolean)));

  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && course.status) ||
      (statusFilter === 'inactive' && !course.status);

    const matchesLevel =
      levelFilter === 'all' || course.level?.idLevel === levelFilter;

    const matchesCategory =
      categoryFilter === 'all' || course.category?.name === categoryFilter;

    return matchesSearch && matchesStatus && matchesLevel && matchesCategory;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    const dateA = new Date(a.uploadDate).getTime();
    const dateB = new Date(b.uploadDate).getTime();
    return dateOrder === 'recent' ? dateB - dateA : dateA - dateB;
  });

  const paginatedCourses = sortedCourses.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Cursos</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/courses/create')}
        >
          Crear Curso
        </Button>
      </Box>

      {/* Filtros */}
      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap">
        <TextField
          label="Buscar"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <FormControl size="small">
          <InputLabel>Estado</InputLabel>
          <Select
            value={statusFilter}
            label="Estado"
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="active">Activos</MenuItem>
            <MenuItem value="inactive">Inactivos</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Nivel</InputLabel>
          <Select
            value={levelFilter}
            label="Nivel"
            onChange={(e) => {
              const val = e.target.value;
              setLevelFilter(val === 'all' ? 'all' : Number(val) as 1 | 2 | 3);
            }}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value={1}>Básico</MenuItem>
            <MenuItem value={2}>Intermedio</MenuItem>
            <MenuItem value={3}>Avanzado</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Categoría</InputLabel>
          <Select
            value={categoryFilter}
            label="Categoría"
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="all">Todas</MenuItem>
            {categoryOptions.map((cat, i) => (
              <MenuItem key={i} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Fecha de subida</InputLabel>
          <Select
            value={dateOrder}
            label="Fecha de subida"
            onChange={(e) => setDateOrder(e.target.value as 'recent' | 'oldest')}
          >
            <MenuItem value="recent">Más recientes</MenuItem>
            <MenuItem value="oldest">Más antiguos</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Indicador de carga */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2, mt: 0.5 }}>Cargando cursos...</Typography>
        </Box>
      ) : (
        <>
          {/* Tabla */}
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
                {paginatedCourses.map((course) => (
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
                          <IconButton color="primary" onClick={() => navigate(`/courses/edit/${course.idCourse}`)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton color="error" onClick={() => handleDelete(course.idCourse)}>
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

          {/* Paginación */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={Math.ceil(sortedCourses.length / itemsPerPage)}
              page={currentPage + 1}
              onChange={(e, value) => setCurrentPage(value - 1)}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
}
