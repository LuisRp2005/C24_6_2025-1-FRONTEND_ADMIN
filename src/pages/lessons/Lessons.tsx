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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { getLessons } from '../../services/lessonService';
import { getCourses } from '../../services/courseService';
import { Lesson } from '../../models/Lesson';
import { Course } from '../../models/Course';

export default function Lessons() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    loadLessons();
    loadCourses();
  }, []);

  const loadLessons = async () => {
    try {
      const response = await getLessons();
      setLessons(response.data);
    } catch (error) {
      console.error('Error cargando lecciones:', error);
    }
  };

  const loadCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data);
    } catch (error) {
      console.error('Error cargando cursos:', error);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/lessons/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta lección?')) {
      try {
        // await deleteLesson(id);
        await loadLessons();
      } catch (error) {
        console.error('Error eliminando lección:', error);
      }
    }
  };

  const getCourseName = (idCourse: number): string => {
    const course = courses.find((c) => c.idCourse === idCourse);
    return course ? course.name : 'Curso no encontrado';
  };

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

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Duración</TableCell>
                  <TableCell>Curso</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lessons.map((lesson) => (
                  <TableRow key={lesson.idLesson}>
                    <TableCell>{lesson.title}</TableCell>
                    <TableCell>{lesson.description}</TableCell>
                    <TableCell>{lesson.duration} minutos</TableCell>
                    <TableCell>{getCourseName(lesson.idCourse)}</TableCell>
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
        </CardContent>
      </Card>
    </Box>
  );
}
