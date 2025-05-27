import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCategory } from '../../services/categoryservice';
import { Category } from '../../models/Category';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Stack,
  Divider,
  CircularProgress,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

export default function CreateCategory() {
  const navigate = useNavigate();

  const [category, setCategory] = useState<Category>({
    idCategory: 0,
    name: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCategory(category);
      navigate('/categories');
    } catch (error) {
      console.error('Error creating category:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/categories')}
        sx={{ mb: 3 }}
      >
        Volver
      </Button>

      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Crear Nueva Categoría
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Complete los siguientes campos para crear una nueva categoría.
          </Typography>

          <Divider sx={{ my: 3 }} />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Creando categoría...</Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  required
                  label="Nombre de la Categoría"
                  name="name"
                  value={category.name}
                  onChange={handleChange}
                  variant="outlined"
                  helperText="Ingrese un nombre descriptivo para la categoría"
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Descripción"
                  name="description"
                  value={category.description || ''}
                  onChange={handleChange}
                  variant="outlined"
                  helperText="Proporcione una descripción detallada de la categoría"
                />

                <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ minWidth: 150 }}
                  >
                    Crear Categoría
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    onClick={() => navigate('/categories')}
                    sx={{ minWidth: 150 }}
                  >
                    Cancelar
                  </Button>
                </Stack>
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
