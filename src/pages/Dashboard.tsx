import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  SvgIcon,
  useTheme,
} from '@mui/material';
import { People, School, Book, Assessment } from '@mui/icons-material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
} from 'recharts';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, loading = false }) => {
  const theme = useTheme();

  return (
    <Card sx={{ flex: 1, minWidth: 240, backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ backgroundColor: `${color}33`, borderRadius: '12px', p: 1 }}>
            <SvgIcon sx={{ color: color, fontSize: 30 }}>{icon}</SvgIcon>
          </Box>
          <Typography variant="h6">{title}</Typography>
        </Box>
        {loading ? (
          <LinearProgress />
        ) : (
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const loading = false;
  const theme = useTheme();

  const stats = {
    totalUsers: 500,
    activeCourses: 50,
    totalLessons: 250,
    completionRate: 85,
  };

  const barData = [
    { name: 'Usuarios', cantidad: stats.totalUsers },
    { name: 'Cursos', cantidad: stats.activeCourses },
  ];

  const pieData = [
    { name: 'Lecciones', value: stats.totalLessons },
    { name: 'Completado', value: stats.completionRate },
    { name: 'Pendiente', value: 100 - stats.completionRate },
  ];

  const pieColors = ['#ed6c02', '#9c27b0', '#455a64'];

  return (
    <Box sx={{ p: 3 }}>
      {/* Cards */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'space-between',
        }}
      >
        <StatCard title="Total Usuarios" value={stats.totalUsers} icon={<People />} color="#1976d2" loading={loading} />
        <StatCard title="Cursos Activos" value={stats.activeCourses} icon={<School />} color="#2e7d32" loading={loading} />
        <StatCard title="Lecciones Totales" value={stats.totalLessons} icon={<Book />} color="#ed6c02" loading={loading} />
        <StatCard title="Tasa de Completación" value={`${stats.completionRate}%`} icon={<Assessment />} color="#9c27b0" loading={loading} />
      </Box>

      {/* Gráficos */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 4, gap: 4 }}>
        {/* Bar Chart */}
        <Card sx={{ flex: 1, minWidth: 300, backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Resumen de Usuarios y Cursos
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke={theme.palette.text.primary} />
                <YAxis stroke={theme.palette.text.primary} />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill={theme.palette.primary.main} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card sx={{ flex: 1, minWidth: 300, backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Distribución de Lecciones y Progreso
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
