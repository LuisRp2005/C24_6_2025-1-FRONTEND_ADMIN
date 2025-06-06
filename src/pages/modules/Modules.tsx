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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { getModulePagination, deleteModule } from '../../services/moduleService';
import { Module } from '../../models/Module';

export default function Modules() {
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [allModules, setAllModules] = useState<Module[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [numberFilter, setNumberFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  const fetchModules = async () => {
    setLoading(true);
    try {
      const response = await getModulePagination(0, 1000);
      const data = response.data.content || [];
      setAllModules(data);
    } catch (error) {
      console.error('Error cargando módulos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, orderFilter, numberFilter]);

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este módulo?')) {
      try {
        await deleteModule(id);
        fetchModules();
      } catch (error) {
        console.error('Error eliminando módulo:', error);
      }
    }
  };

  const orderOptions = Array.from(new Set(allModules.map(m => m.moduleOrder).filter(Boolean)));
  const numberOptions = Array.from(new Set(allModules.map(m => m.numberModule).filter(Boolean)));

  const filteredModules = allModules.filter((mod) => {
    const matchesSearch =
      mod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesOrder =
      orderFilter === 'all' || mod.moduleOrder === parseInt(orderFilter);

    const matchesNumber =
      numberFilter === 'all' || mod.numberModule === numberFilter;

    return matchesSearch && matchesOrder && matchesNumber;
  });

  const paginatedModules = filteredModules.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4">Módulos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/modules/create')}
        >
          Nuevo Módulo
        </Button>
      </Stack>

      {/* Filtros */}
      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap">
        <TextField
          label="Buscar"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Orden</InputLabel>
          <Select
            value={orderFilter}
            label="Orden"
            onChange={(e) => setOrderFilter(e.target.value)}
          >
            <MenuItem value="all">Todos</MenuItem>
            {orderOptions.map((order, i) => (
              <MenuItem key={i} value={order}>{order}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Número</InputLabel>
          <Select
            value={numberFilter}
            label="Número"
            onChange={(e) => setNumberFilter(e.target.value)}
          >
            <MenuItem value="all">Todos</MenuItem>
            {numberOptions.map((num, i) => (
              <MenuItem key={i} value={num}>{num}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Tabla o Cargando */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Cargando módulos...</Typography>
        </Box>
      ) : (
        <>
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
                    {paginatedModules.map((mod) => (
                      <TableRow key={mod.idModule}>
                        <TableCell>{mod.name}</TableCell>
                        <TableCell>{mod.description}</TableCell>
                        <TableCell>{mod.moduleOrder}</TableCell>
                        <TableCell>{mod.numberModule}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => navigate(`/modules/edit/${mod.idModule}`)} color="primary">
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

          {/* Paginación */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={Math.ceil(filteredModules.length / itemsPerPage)}
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
