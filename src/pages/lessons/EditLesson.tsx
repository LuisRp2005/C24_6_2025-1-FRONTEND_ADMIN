import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { getCourses } from '../../services/courseService';
import { getModulesByCourseId, getModuleById } from '../../services/moduleService';
import { getLessonById, updateLesson, getVideoDuration } from '../../services/lessonService';
import { uploadToCloudinary } from '../../services/cloudinaryService';
import { Course } from '../../models/Course';
import { Module } from '../../models/Module';
import { LessonRequest } from '../../models/LessonRequest';
import { AxiosError } from 'axios';

export default function EditLesson() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [lesson, setLesson] = useState<Partial<LessonRequest>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [detectingDuration, setDetectingDuration] = useState(false);
  const [modoEdicionModulo, setModoEdicionModulo] = useState(false);
  const [moduloNombreActual, setModuloNombreActual] = useState('');

  useEffect(() => {
    getCourses()
      .then((res) => setCourses(res.data))
      .catch(console.error);

    if (id) {
      getLessonById(Number(id))
        .then((res) => {
          setLesson(res.data);
          setImagePreview(res.data.imageLesson);
          if (res.data.idModule) {
            getModuleById(res.data.idModule).then((mod) => {
              setModuloNombreActual(mod.data.name);
            });
          }
        })
        .catch(console.error);
    }
  }, [id]);

  useEffect(() => {
    if (selectedCourseId) {
      getModulesByCourseId(selectedCourseId)
        .then((res) => setModules(res.data))
        .catch(console.error);
    }
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
    if (!lesson.idModule || !id) return;

    setLoading(true);
    try {
      const imageLesson = imageFile ? await uploadToCloudinary(imageFile) : lesson.imageLesson || '';
      const urlVideo = videoFile ? await uploadToCloudinary(videoFile) : lesson.urlVideo || '';
      const pdfUrl = pdfFile ? await uploadToCloudinary(pdfFile) : lesson.pdfUrl || '';

      const payload: LessonRequest = {
        imageLesson,
        title: lesson.title || '',
        description: lesson.description || '',
        urlVideo,
        pdfUrl,
        duration: lesson.duration || '00:00:00',
        uploadDate: new Date().toISOString(),
        idModule: lesson.idModule,
        lessonOrder: lesson.lessonOrder || 1
      };

      await updateLesson(Number(id), payload);
      navigate('/lessons');
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error actualizando lección:', axiosError.message);
      if (axiosError.response) console.error('Detalles:', axiosError.response.data);
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
          <Typography variant="h4" gutterBottom>Editar Lección</Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Actualiza los siguientes campos para modificar la lección.
          </Typography>
          <Divider sx={{ my: 2 }} />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Actualizando lección...</Typography>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Título"
                    name="title"
                    value={lesson.title || ''}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Duración (HH:MM:SS)"
                    name="duration"
                    value={lesson.duration || ''}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    disabled
                  />
                </Box>

                {detectingDuration && (
                  <Typography variant="body2" color="text.secondary">
                    Detectando duración del video...
                  </Typography>
                )}

                <TextField
                  label="Descripción"
                  name="description"
                  value={lesson.description || ''}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                  required
                />

                <TextField
                  label="Orden de la Lección"
                  name="lessonOrder"
                  type="number"
                  value={lesson.lessonOrder || ''}
                  onChange={handleChange}
                  fullWidth
                  required
                />

                {!modoEdicionModulo ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                      label="Módulo actual"
                      value={moduloNombreActual}
                      fullWidth
                      disabled
                    />
                    <Button variant="outlined" onClick={() => setModoEdicionModulo(true)}>
                      Cambiar módulo
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
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
                      required
                    >
                      {courses.map((course) => (
                        <MenuItem key={course.idCourse} value={course.idCourse}>
                          {course.name}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      required
                      select
                      label="Módulo"
                      name="idModule"
                      value={lesson.idModule || ''}
                      onChange={(e) => setLesson({ ...lesson, idModule: Number(e.target.value) })}
                      fullWidth
                    >
                      {modules.map((mod) => (
                        <MenuItem key={mod.idModule} value={mod.idModule}>
                          {mod.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                )}

                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  {/* Imagen */}
                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Typography variant="body2" color="text.secondary">Imagen Actual:</Typography>
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: 8 }} />
                    )}
                    <label htmlFor="upload-image">
                      <input
                        id="upload-image"
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImageFile(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                      <Button variant="outlined" component="span">Subir nueva imagen</Button>
                    </label>
                  </Box>

                  {/* Video */}
                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Typography variant="body2" color="text.secondary">Video actual:</Typography>
                    {lesson.urlVideo && (
                      <a href={lesson.urlVideo} target="_blank" rel="noopener noreferrer">Ver video</a>
                    )}
                    <label htmlFor="upload-video">
                      <input
                        id="upload-video"
                        hidden
                        type="file"
                        accept="video/*"
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
                          }
                        }}
                      />
                      <Button variant="outlined" component="span">Subir nuevo video</Button>
                    </label>
                  </Box>

                  {/* PDF */}
                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Typography variant="body2" color="text.secondary">PDF actual:</Typography>
                    {lesson.pdfUrl && (
                      <a href={lesson.pdfUrl} target="_blank" rel="noopener noreferrer">Ver PDF</a>
                    )}
                    <label htmlFor="upload-pdf">
                      <input
                        id="upload-pdf"
                        hidden
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setPdfFile(file);
                        }}
                      />
                      <Button variant="outlined" component="span">Subir nuevo PDF</Button>
                    </label>
                  </Box>
                </Box>

                <Stack direction="row" spacing={2}>
                  <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Actualizar Lección'}
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
