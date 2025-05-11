import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Courses from './pages/courses/Courses';
import Categories from './pages/categories/Categories';
import CreateCategory from './pages/categories/CreateCategory';
import EditCategory from './pages/categories/EditCategory';
import CreateCourse from './pages/courses/CreateCourse';
import EditCourse from './pages/courses/EditCourse';
import Login from './pages/Login';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from './components/layouts/MainLayout';
import Lessons from './pages/lessons/Lessons';
import CreateLesson from './pages/lessons/CreateLesson';
import EditLesson from './pages/lessons/EditLesson';
import Notification from './pages/notification/Notification';
import CreateNotification from './pages/notification/CreateNotificacion';
import EditNotification from './pages/notification/EditNotification';
import Module from './pages/modules/Modules';
import CreateModule from './pages/modules/CreateModule';
import EditModule from './pages/modules/EditModule';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/courses" element={
          <ProtectedRoute>
            <MainLayout>
              <Courses />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/categories" element={
          <ProtectedRoute>
            <MainLayout>
              <Categories />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/categories/create" element={
          <ProtectedRoute>
            <MainLayout>
              <CreateCategory />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/categories/edit/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <EditCategory />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/courses/create" element={
          <ProtectedRoute>
            <MainLayout>
              <CreateCourse />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/courses/edit/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <EditCourse />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/lessons" element={
          <ProtectedRoute>
            <MainLayout>
              <Lessons />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/lessons/create" element={
          <ProtectedRoute>
            <MainLayout>
              <CreateLesson />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/lessons/edit/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <EditLesson />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/notification" element={
          <ProtectedRoute>
            <MainLayout>
              <Notification />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/notification/create" element={
          <ProtectedRoute>
            <MainLayout>
              <CreateNotification />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/notification/edit/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <EditNotification />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/modules" element={
          <ProtectedRoute>
            <MainLayout>
              <Module />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/modules/create" element={
          <ProtectedRoute>
            <MainLayout>
              <CreateModule />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/modules/edit/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <EditModule />
            </MainLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
