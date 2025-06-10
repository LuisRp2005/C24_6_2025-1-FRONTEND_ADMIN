import { useEffect, useState } from 'react';
import { getUsers, blockUser, unblockUser } from '../../services/userService';
import { User, StatusUserEnum } from '../../models/User';
import {
  Box, Chip, CircularProgress, FormControl, IconButton,
  InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography, Tooltip, Pagination
} from '@mui/material';
import { Block as BlockIcon, LockOpen as UnblockIcon } from '@mui/icons-material';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | StatusUserEnum>('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (email: string) => {
    await blockUser(email);
    fetchUsers();
  };

  const handleUnblock = async (email: string) => {
    await unblockUser(email);
    fetchUsers();
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const paginated = filtered.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const roles = Array.from(new Set(users.map(u => u.role).filter(Boolean)));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Usuarios</Typography>

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
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value={StatusUserEnum.ACTIVE}>Activo</MenuItem>
            <MenuItem value={StatusUserEnum.INACTIVE}>Inactivo</MenuItem>
            <MenuItem value={StatusUserEnum.BLOCK}>Bloqueado</MenuItem>
            <MenuItem value={StatusUserEnum.PENDING}>Pendiente</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Rol</InputLabel>
          <Select
            value={roleFilter}
            label="Rol"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <MenuItem value="all">Todos</MenuItem>
            {roles.map((role, i) => (
              <MenuItem key={i} value={role}>{role}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Tabla */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre completo</TableCell>
                  <TableCell>Correo</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Registrado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((user) => (
                  <TableRow key={user.idUser}>
                    <TableCell>{`${user.name ?? ''} ${user.lastName ?? ''} ${user.maternalName ?? ''}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role ?? 'Sin rol'}</TableCell>
                    <TableCell>
                    <Chip
                      label={user.status}
                      color={
                        user.status === StatusUserEnum.ACTIVE ? 'success' :
                        user.status === StatusUserEnum.INACTIVE ? 'default' :
                        user.status === StatusUserEnum.BLOCK ? 'error' :
                        user.status === StatusUserEnum.PENDING ? 'warning' :
                        'default'
                      }
                      size="small"
                    />
                    </TableCell>
                    <TableCell>
                      {user.registerDate
                        ? new Date(user.registerDate).toLocaleDateString()
                        : 'Sin registro'}
                    </TableCell>
                    <TableCell align="right">
                      {user.status === StatusUserEnum.ACTIVE ? (
                        <Tooltip title="Bloquear">
                          <IconButton color="warning" onClick={() => handleBlock(user.email)}>
                            <BlockIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Desbloquear">
                          <IconButton color="success" onClick={() => handleUnblock(user.email)}>
                            <UnblockIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={Math.ceil(filtered.length / itemsPerPage)}
              page={currentPage + 1}
              onChange={(e, val) => setCurrentPage(val - 1)}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
}
