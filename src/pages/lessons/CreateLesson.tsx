import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Stack,
  MenuItem,
  Divider,
  CircularProgress
} from '@mui/material';
import { getCourses } from '../../services/courseService';
import { getModulesByCourseId } from '../../services/moduleService';
import { createLesson, getVideoDuration } from '../../services/lessonService';
import { uploadToCloudinary } from '../../services/cloudinaryService';
import { Course } from '../../models/Course';
import { Module } from '../../models/Module';
import { AxiosError } from 'axios';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

interface CreateLessonPayload {
  imageLesson: string;
  title: string;
  description: string;
  urlVideo: string;
  pdfUrl: string;
  duration: string;
  uploadDate: string;
  idModule: number;
  lessonOrder: number;
}

export default function CreateLesson() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [detectingDuration, setDetectingDuration] = useState(false);

  const [lesson, setLesson] = useState<Partial<CreateLessonPayload>>({
    title: '',
    description: '',
    duration: '',
    uploadDate: new Date().toISOString(),
    idModule: 0,
    lessonOrder: 1
  });

  useEffect(() => {
    getCourses()
      .then((res) => setCourses(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;
    getModulesByCourseId(selectedCourseId)
      .then((res) => setModules(res.data))
      .catch(console.error);
  }, [selectedCourseId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLesson((prev) => ({
      ...prev,
      [name]: name === 'lessonOrder' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile || !videoFile || !pdfFile || !lesson.idModule) {
      console.error('Faltan archivos o módulo');
      return;
    }

    try {
      setLoading(true);
      const [imageUrl, videoUrl, pdfUrl] = await Promise.all([
        uploadToCloudinary(imageFile),
        uploadToCloudinary(videoFile),
        uploadToCloudinary(pdfFile)
      ]);

      const payload: CreateLessonPayload = {
        imageLesson: imageUrl,
        title: lesson.title || '',
        description: lesson.description || '',
        urlVideo: videoUrl,
        pdfUrl: pdfUrl,
        duration: lesson.duration || '00:00:00',
        uploadDate: new Date().toISOString(),
        idModule: Number(lesson.idModule),
        lessonOrder: lesson.lessonOrder ?? 1
      };

      await createLesson(payload);
      navigate('/lessons');
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error creando lección:', axiosError.message);
      if (axiosError.response) {
        console.error('Detalles:', axiosError.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/lessons')} sx={{ mb: 3 }}>
        Volver
      </Button>

      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Crear Nueva Lección
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Completa los siguientes campos para registrar una nueva lección.
          </Typography>
          <Divider sx={{ my: 2 }} />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Creando lección...</Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    required
                    label="Título"
                    name="title"
                    value={lesson.title}
                    onChange={handleChange}
                    fullWidth
                  />
                  {lesson.duration && (
                    <TextField
                      label="Duración (HH:MM:SS)"
                      name="duration"
                      value={lesson.duration}
                      fullWidth
                      InputProps={{ readOnly: true }}
                      disabled
                    />
                  )}
                </Box>

                {detectingDuration && (
                  <Typography variant="body2" color="text.secondary">
                    Detectando duración del video...
                  </Typography>
                )}

                <TextField
                  required
                  label="Descripción"
                  name="description"
                  value={lesson.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    required
                    type="number"
                    label="Orden de la Lección"
                    name="lessonOrder"
                    value={lesson.lessonOrder}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    required
                    select
                    label="Curso"
                    value={selectedCourseId || ''}
                    onChange={(e) => {
                      const courseId = Number(e.target.value);
                      setSelectedCourseId(courseId);
                      setModules([]);
                      setLesson((prev) => ({ ...prev, idModule: 0 }));
                    }}
                    fullWidth
                  >
                    {courses.map((course) => (
                      <MenuItem key={course.idCourse} value={course.idCourse}>
                        {course.name}
                      </MenuItem>
                    ))}
                  </TextField>

                  {modules.length > 0 && (
                    <TextField
                      required
                      select
                      label="Módulo"
                      name="idModule"
                      value={lesson.idModule || ''}
                      onChange={(e) =>
                        setLesson({ ...lesson, idModule: Number(e.target.value) })
                      }
                      fullWidth
                    >
                      {modules.map((mod) => (
                        <MenuItem key={mod.idModule} value={mod.idModule}>
                          {mod.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  {/* Imagen */}
                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Typography variant="body2" color="text.secondary">
                      Imagen de la Lección
                    </Typography>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          width: '100%',
                          maxHeight: 120,
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    )}
                    <label htmlFor="upload-image">
                      <input
                        id="upload-image"
                        type="file"
                        accept="image/*"
                        hidden
                        required
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImageFile(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                      <Button variant="outlined" component="span">
                        Subir Imagen
                      </Button>
                    </label>
                  </Box>

                  {/* Video */}
                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Typography variant="body2" color="text.secondary">
                      Video (MP4)
                    </Typography>
                    <label htmlFor="upload-video">
                      <input
                        id="upload-video"
                        type="file"
                        accept="video/*"
                        hidden
                        required
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setVideoFile(file);
                            try {
                              setDetectingDuration(true);
                              const response = await getVideoDuration(file);
                              setLesson((prev) => ({
                                ...prev,
                                duration: response.data
                              }));
                            } catch (err) {
                              console.error('Error detectando duración del video', err);
                            } finally {
                              setDetectingDuration(false);
                            }
                          } else {
                            setLesson((prev) => ({ ...prev, duration: '' }));
                          }
                        }}
                      />
                      <Button variant="outlined" component="span">
                        Subir Video
                      </Button>
                    </label>
                  </Box>

                  {/* PDF */}
                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Typography variant="body2" color="text.secondary">
                      Archivo PDF
                    </Typography>
                    <label htmlFor="upload-pdf">
                      <input
                        id="upload-pdf"
                        type="file"
                        accept="application/pdf"
                        hidden
                        required
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setPdfFile(file);
                        }}
                      />
                      <Button variant="outlined" component="span">
                        Subir PDF
                      </Button>
                    </label>
                  </Box>
                </Box>

                <Stack direction="row" spacing={2}>
                  <Button type="submit" variant="contained" color="primary">
                    Crear Lección
                  </Button>
                  <Button variant="outlined" onClick={() => navigate('/lessons')}>
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
