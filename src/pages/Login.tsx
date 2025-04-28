import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Container,
  CssBaseline,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import logo from '../assets/images/logo_edustream.png'; // <-- Importa la imagen

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          background: 'linear-gradient(45deg,rgb(46, 45, 45) 30%, #388e3c 90%)', // Degradado blanco a verde semioscuro
          '&:hover': {
            background: 'linear-gradient(45deg,rgb(46, 45, 45, #2c6e2f 90%)', // Hover con verde más oscuro
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:4000/auth/login', {
                email,
                password,
            });

            const { token, user } = response.data;

            // Guardamos el token y datos del usuario (opcional)
            localStorage.setItem('token', token);

            navigate('/home');
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Credenciales incorrectas. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                            borderRadius: 2,
                            background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                        }}
                    >
                        {/* Reemplazar icono por imagen */}
                        <Box component="img" src={logo} alt="Logo" sx={{ width: 100, height: 100, mb: 2 }} />
                        <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
                            Inicia Sesión
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Correo electrónico"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Contraseña"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ mb: 3 }}
                            />
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                sx={{ mt: 2, mb: 2, py: 1.5 }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar sesión'}
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
