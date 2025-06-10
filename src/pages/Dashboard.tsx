import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, LinearProgress, SvgIcon,
} from '@mui/material';
import {
  People, School, Book, Category as CategoryIcon, ViewModule,
} from '@mui/icons-material';
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, XAxis, YAxis, LineChart, Line,
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';

import { getUsers, getCurrentUser } from '../services/userService';
import { getCourses, getTop10Courses } from '../services/courseService';
import { getLessons } from '../services/lessonService';
import { getCategories } from '../services/categoryservice';
import { getModule } from '../services/moduleService';
import logo from '../assets/images/logo_codigo.png';
import { downloadSalesReport } from "../services/paymentService";
import { Course } from '../models/Course';

const StatCard = ({ title, value, icon, color, loading }: any) => (
  <Card sx={{ flex: 1, minWidth: 200 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ backgroundColor: `${color}33`, borderRadius: '12px', p: 1 }}>
          <SvgIcon sx={{ color, fontSize: 30 }}>{icon}</SvgIcon>
        </Box>
        <Typography variant="h6">{title}</Typography>
      </Box>
      {loading ? (
        <LinearProgress />
      ) : (
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{value}</Typography>
      )}
    </CardContent>
  </Card>
);

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('');
  const navigate = useNavigate();
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [top10Courses, setTop10Courses] = useState<any[]>([]);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalLessons: 0,
    totalModules: 0,
    totalCategories: 0,
  });

  const [pieData, setPieData] = useState<any[]>([]);
  const [levelData, setLevelData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          usersRes, coursesRes, lessonsRes, categoriesRes,
          modulesRes, currentUser, topCoursesRes
        ] = await Promise.all([
          getUsers(),
          getCourses(),
          getLessons(),
          getCategories(),
          getModule(),
          getCurrentUser(),
          getTop10Courses()
        ]);

        const users = usersRes.data;
        const courses: Course[] = coursesRes.data;
        const lessons = lessonsRes.data;
        const categories = categoriesRes.data;
        const modules = modulesRes.data;

        setAdminName(`${currentUser.data.name} ${currentUser.data.lastName}`);
        setTop10Courses(topCoursesRes.data.top10);

        const today = new Date().toISOString().split('T')[0];
        const usersToday = users
          .filter((u: any) => u.registerDate?.startsWith(today))
          .sort((a: any, b: any) => new Date(b.registerDate).getTime() - new Date(a.registerDate).getTime())
          .slice(0, 3);

        setRecentUsers(usersToday);

        const byCategory = courses.reduce((acc: any, course: Course) => {
          const id = course.category?.idCategory;
          if (id) acc[id] = (acc[id] || 0) + 1;
          return acc;
        }, {});
        const pieFormatted = Object.entries(byCategory).map(([catId, count]: any) => {
          const cat = categories.find((c: any) => c.idCategory === parseInt(catId));
          return { name: cat?.name || `Categoría ${catId}`, value: count };
        });

        const byLevel = courses.reduce((acc: any, course: Course) => {
          const name = course.level?.name;
          if (name) acc[name] = (acc[name] || 0) + 1;
          return acc;
        }, {});
        const levelFormatted = Object.entries(byLevel).map(([name, count]: any) => ({ name, cantidad: count }));

        const monthly: any = {};
        courses.forEach((course: Course) => {
          const month = new Date(course.uploadDate).toLocaleDateString('es-PE', { month: 'short', year: 'numeric' });
          monthly[month] = (monthly[month] || 0) + 1;
        });
        const monthlyFormatted = Object.entries(monthly).map(([name, cantidad]) => ({ name, cantidad }));

        setStats({
          totalUsers: users.length,
          totalCourses: courses.length,
          totalLessons: lessons.length,
          totalModules: modules.length,
          totalCategories: categories.length,
        });

        setPieData(pieFormatted);
        setLevelData(levelFormatted);
        setMonthlyData(monthlyFormatted);
      } catch (error) {
        console.error('Error al cargar dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const pieColors = ['#42a5f5', '#66bb6a', '#ffca28', '#ab47bc', '#ef5350', '#26c6da'];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <button
          onClick={downloadSalesReport}
          style={{
            backgroundColor: '#2e7d32',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 16px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            transition: 'background 0.3s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1b5e20'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2e7d32'}
        >
          📊 Descargar Reporte de Ventas (Excel)
        </button>
      </Box>

      <Box id="dashboard-pdf" sx={{ p: 2, bgcolor: 'background.default' }}>
        {/* Tarjetas */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between' }}>
          <Box sx={{ cursor: 'pointer' }} onClick={() => navigate('/users')}>
            <StatCard title="Usuarios" value={stats.totalUsers} icon={<People />} color="#1976d2" loading={loading} />
          </Box>
          <Box sx={{ cursor: 'pointer' }} onClick={() => navigate('/courses')}>
            <StatCard title="Cursos" value={stats.totalCourses} icon={<School />} color="#2e7d32" loading={loading} />
          </Box>
          <Box sx={{ cursor: 'pointer' }} onClick={() => navigate('/lessons')}>
            <StatCard title="Lecciones" value={stats.totalLessons} icon={<Book />} color="#ed6c02" loading={loading} />
          </Box>
          <Box sx={{ cursor: 'pointer' }} onClick={() => navigate('/modules')}>
            <StatCard title="Módulos" value={stats.totalModules} icon={<ViewModule />} color="#9c27b0" loading={loading} />
          </Box>
          <Box sx={{ cursor: 'pointer' }} onClick={() => navigate('/categories')}>
            <StatCard title="Categorías" value={stats.totalCategories} icon={<CategoryIcon />} color="#ff7043" loading={loading} />
          </Box>
        </Box>

        {/* Top 10 Cursos */}
        <Box sx={{ width: '100%', mt: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Top 10 Cursos Más Populares</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                {top10Courses.map((course: any, index: number) => (
                  <Card key={index} variant="outlined" sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                    <Typography variant="h6" sx={{ width: 30 }}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                    </Typography>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {course.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Autor: {course.authorName} | Nivel: {course.level} | Categoría: {course.category}
                      </Typography>
                    </Box>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Últimos usuarios */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>Últimos usuarios registrados hoy</Typography>
          {recentUsers.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No se han registrado usuarios hoy.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {recentUsers.map((user, i) => (
                <Card key={i} variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1">{user.name} {user.lastName}</Typography>
                  <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Registrado a las {new Date(user.registerDate).toLocaleTimeString('es-PE')}
                  </Typography>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        {/* Gráficos */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 4, gap: 4 }}>
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Cursos por Categoría</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label paddingAngle={5}>
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip /><Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Cursos por Nivel</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={levelData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip /><Legend />
                    <Bar dataKey="cantidad" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ width: '100%' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Cursos por Mes</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlyData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip /><Legend />
                    <Line type="monotone" dataKey="cantidad" stroke="#2e7d32" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
