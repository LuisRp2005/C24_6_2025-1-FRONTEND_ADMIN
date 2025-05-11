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
import { getModule, deleteModule} from '../../services/moduleService';
import { Module } from '../../models/Module';

export default function Modules() {
    const navigate = useNavigate();
    const [ modules, setModules] = useState<Module[]>([]);

    useEffect(() => {
      loadModules();
    }, []);

    const loadModules = async () => {
      try {
        const response = await getModule();
        setModules(response.data);
      }catch (error) {
        console.error('Error cargando modulos:', error);
      }
    };

    const handleEdit = (id: number) => {
      navigate(`/modules/edit/${id}`);
    };

    const handleDelete = async (id: number) => {
      if (window.confirm('¿Estás seguro de que deseas eliminar esta notificación?')) {
        try {
          await deleteModule(id);
          loadModules();
        } catch (error) {
          console.error('Error eliminando notificación:', error);
        }
      }
    };

    return (
        <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1">
            Modulo
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/modules/create')}
          >
            Nuevo Modulos
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
                    <TableCell>Orden Modulo</TableCell>
                    <TableCell>Numero de Modulo</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modules.map((modules) => (
                    <TableRow key={modules.idModule}>
                      <TableCell>{modules.name}</TableCell>
                      <TableCell>{modules.description}</TableCell>
                      <TableCell>{modules.moduleOrder}</TableCell>
                      <TableCell>{modules.numberModule}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(modules.idModule)} color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(modules.idModule)} color="error">
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