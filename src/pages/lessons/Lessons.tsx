import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  Avatar,
  Pagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { deleteLesson, getLessonsPagination } from '../../services/lessonService';
import { getModulePagination } from '../../services/moduleService';
import { getCourses } from '../../services/courseService';
import { Lesson } from '../../models/Lesson';
import { Module } from '../../models/Module';
import { Course } from '../../models/Course';

export default function Lessons() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedModule, setSelectedModule] = useState('all');

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [lessonRes, moduleRes, courseRes] = await Promise.all([
        getLessonsPagination(0, 1000),
        getModulePagination(0, 1000),
        getCourses()
      ]);
      setAllLessons(lessonRes.data.content || []);
      setModules(moduleRes.data.content || []);
      setCourses(courseRes.data || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, selectedCourse, selectedModule]);

  const handleEdit = (id: number) => {
    navigate(`/lessons/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta lección?')) {
      try {
        await deleteLesson(id);
        fetchAllData();
      } catch (error) {
        console.error('Error eliminando lección:', error);
      }
    }
  };

  const getModuleName = (idModule: number): string => {
    const mod = modules.find((m) => m.idModule === idModule);
    return mod ? mod.name : 'Módulo no encontrado';
  };

  const filteredModules = selectedCourse === 'all'
    ? modules
    : modules.filter(mod => mod.course?.idCourse?.toString() === selectedCourse);

  const filteredLessons = allLessons.filter(lesson => {
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesModule =
      selectedModule === 'all' || lesson.idModule.toString() === selectedModule;

    const matchesCourse =
      selectedCourse === 'all' ||
      filteredModules.some(mod => mod.idModule === lesson.idModule);

    return matchesSearch && matchesCourse && matchesModule;
  });

  const paginatedLessons = filteredLessons.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Lecciones
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/lessons/create')}
        >
          Nueva Lección
        </Button>
      </Stack>

      {/* Filtros */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap">
        <TextField
          label="Buscar"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Curso</InputLabel>
          <Select
            value={selectedCourse}
            label="Curso"
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setSelectedModule('all');
            }}
          >
            <MenuItem value="all">Todos</MenuItem>
            {courses.map((c) => (
              <MenuItem key={c.idCourse} value={c.idCourse.toString()}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Módulo</InputLabel>
          <Select
            value={selectedModule}
            label="Módulo"
            onChange={(e) => setSelectedModule(e.target.value)}
          >
            <MenuItem value="all">Todos</MenuItem>
            {filteredModules.map((m) => (
              <MenuItem key={m.idModule} value={m.idModule.toString()}>
                {m.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Tabla o Cargando */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Cargando lecciones...</Typography>
        </Box>
      ) : (
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Imagen</TableCell>
                    <TableCell>Título</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Duración</TableCell>
                    <TableCell>Módulo</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedLessons.map((lesson) => (
                    <TableRow key={lesson.idLesson}>
                      <TableCell>
                        <Avatar
                          variant="rounded"
                          src={lesson.imageLesson}
                          alt={lesson.title}
                          sx={{ width: 56, height: 56 }}
                        />
                      </TableCell>
                      <TableCell>{lesson.title}</TableCell>
                      <TableCell>{lesson.description}</TableCell>
                      <TableCell>{lesson.duration}</TableCell>
                      <TableCell>{getModuleName(lesson.idModule)}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(lesson.idLesson)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(lesson.idLesson)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Paginación */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={Math.ceil(filteredLessons.length / itemsPerPage)}
                page={currentPage + 1}
                onChange={(e, value) => setCurrentPage(value - 1)}
                color="primary"
              />
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
