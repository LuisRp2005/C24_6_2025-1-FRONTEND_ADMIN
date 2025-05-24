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

import { getUsers, getCurrentUser } from '../services/userService';
import { getCourses } from '../services/courseService';
import { getLessons } from '../services/lessonService';
import { getCategories } from '../services/categoryservice';
import { getModule } from '../services/moduleService';
import logo from '../assets/images/logo_codigo.png';
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
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalLessons: 0,
    totalModules: 0,
    totalCategories: 0,
  });

  const [pieData, setPieData] = useState<any[]>([]);
  const [levelData, setLevelData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [authorData, setAuthorData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  const handleDownloadPDF = () => {
    const input = document.getElementById('dashboard-pdf');
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const date = new Date().toLocaleString('es-PE');

      pdf.addImage(logo, 'PNG', pdfWidth / 2 - 25, 5, 50, 15);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('REPORTE DE ADMINISTRACIÓN - Plataforma Cursos', pdfWidth / 2, 25, { align: 'center' });
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generado: ${date}`, pdfWidth / 2, 30, { align: 'center' });
      pdf.text(`Administrador: ${adminName}`, pdfWidth / 2, 35, { align: 'center' });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 40, pdfWidth, pdfHeight);
      pdf.save('reporte-dashboard.pdf');
    });
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, coursesRes, lessonsRes, categoriesRes, modulesRes, currentUser] = await Promise.all([
          getUsers(),
          getCourses(),
          getLessons(),
          getCategories(),
          getModule(),
          getCurrentUser(),
        ]);

        const users = usersRes.data;
        const courses: Course[] = coursesRes.data;
        const lessons = lessonsRes.data;
        const categories = categoriesRes.data;
        const modules = modulesRes.data;

        setAdminName(`${currentUser.data.name} ${currentUser.data.lastName}`);

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

        const byAuthor = courses.reduce((acc: any, course: Course) => {
          const author = course.authorName;
          if (author) acc[author] = (acc[author] || 0) + 1;
          return acc;
        }, {});
        const authorFormatted = Object.entries(byAuthor).map(([name, count]: any) => ({ name, cantidad: count }))
          .sort((a, b) => b.cantidad - a.cantidad).slice(0, 5);

        const statusFormatted = [
          { name: 'Activos', value: courses.filter((c: Course) => c.status === true).length },
          { name: 'Inactivos', value: courses.filter((c: Course) => c.status === false).length }
        ];

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
        setStatusData(statusFormatted);
        setAuthorData(authorFormatted);
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
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleDownloadPDF} style={{
          padding: '8px 16px', backgroundColor: '#1976d2', color: 'white',
          border: 'none', borderRadius: 6, cursor: 'pointer'
        }}>
          Descargar Reporte en PDF
        </button>
      </Box>

      <Box id="dashboard-pdf" sx={{ p: 2, backgroundColor: 'white' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between' }}>
          <StatCard title="Usuarios" value={stats.totalUsers} icon={<People />} color="#1976d2" loading={loading} />
          <StatCard title="Cursos" value={stats.totalCourses} icon={<School />} color="#2e7d32" loading={loading} />
          <StatCard title="Lecciones" value={stats.totalLessons} icon={<Book />} color="#ed6c02" loading={loading} />
          <StatCard title="Módulos" value={stats.totalModules} icon={<ViewModule />} color="#9c27b0" loading={loading} />
          <StatCard title="Categorías" value={stats.totalCategories} icon={<CategoryIcon />} color="#ff7043" loading={loading} />
        </Box>

        {/* Gráficos */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 4, gap: 4 }}>
          {/* Fila 1 */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', gap: 4 }}>
            <Card sx={{ flex: 1, minWidth: 300 }}>
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

            <Card sx={{ flex: 1, minWidth: 300 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Top Autores</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart layout="vertical" data={authorData}>
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip /><Legend />
                    <Bar dataKey="cantidad" fill="#9c27b0" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>

          {/* Fila 2 */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', gap: 4 }}>
            <Card sx={{ flex: 1, minWidth: 300 }}>
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

            <Card sx={{ flex: 1, minWidth: 300 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Cursos por Estado</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                      {statusData.map((_, index) => (
                        <Cell key={`cell-status-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip /><Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>

          {/* Fila 3 */}
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
