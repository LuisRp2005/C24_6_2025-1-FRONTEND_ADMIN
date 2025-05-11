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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { deleteLesson, getLessons } from '../../services/lessonService';
import { getModule } from '../../services/moduleService';
import { Lesson } from '../../models/Lesson';
import { Module } from '../../models/Module';

export default function Lessons() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    loadLessons();
    loadModules();
  }, []);

  const loadLessons = async () => {
    try {
      const response = await getLessons();
      setLessons(response.data);
    } catch (error) {
      console.error('Error cargando lecciones:', error);
    }
  };

  const loadModules = async () => {
    try {
      const response = await getModule();
      setModules(response.data);
    } catch (error) {
      console.error('Error cargando módulos:', error);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/lessons/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta lección?')) {
      try {
        await deleteLesson(id);
        await loadLessons();
      } catch (error) {
        console.error('Error eliminando lección:', error);
      }
    }
  };

  const getModuleName = (idModule: number): string => {
    const module = modules.find((m) => m.idModule === idModule);
    return module ? module.name : 'Módulo no encontrado';
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
                  <TableCell>Imagen</TableCell>
                  <TableCell>Título</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Duración</TableCell>
                  <TableCell>Módulo</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lessons.map((lesson) => (
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
        </CardContent>
      </Card>
    </Box>
  );
}
