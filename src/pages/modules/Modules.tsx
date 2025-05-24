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
  Pagination,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { getModulePagination, deleteModule } from '../../services/moduleService';
import { Module } from '../../models/Module';

export default function Modules() {
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const loadModules = async (page: number) => {
    try {
      const response = await getModulePagination(page, itemsPerPage);
      setModules(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.number);
    } catch (error) {
      console.error('Error cargando módulos:', error);
    }
  };

  useEffect(() => {
    loadModules(currentPage);
  }, [currentPage]);

  const handleEdit = (id: number) => {
    navigate(`/modules/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este módulo?')) {
      try {
        await deleteModule(id);
        loadModules(currentPage);
      } catch (error) {
        console.error('Error eliminando módulo:', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          Módulos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/modules/create')}
        >
          Nuevo Módulo
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Orden del Módulo</TableCell>
                  <TableCell>Número del Módulo</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modules.map((mod) => (
                  <TableRow key={mod.idModule}>
                    <TableCell>{mod.name}</TableCell>
                    <TableCell>{mod.description}</TableCell>
                    <TableCell>{mod.moduleOrder}</TableCell>
                    <TableCell>{mod.numberModule}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(mod.idModule)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(mod.idModule)} color="error">
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
