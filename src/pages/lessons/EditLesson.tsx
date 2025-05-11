// EditLesson.tsx (actualizado con el mismo diseño que CreateLesson)

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
import { getModule } from '../../services/moduleService';
import { getLessonById, updateLesson } from '../../services/lessonService';
import { uploadToCloudinary } from '../../services/cloudinaryService';
import { Module } from '../../models/Module';
import { LessonRequest } from '../../models/LessonRequest';
import { AxiosError } from 'axios';

export default function EditLesson() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [modules, setModules] = useState<Module[]>([]);
  const [lesson, setLesson] = useState<Partial<LessonRequest>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getModule().then((res) => setModules(res.data)).catch(console.error);
    if (id) {
      getLessonById(Number(id)).then((res) => {
        setLesson(res.data);
        setImagePreview(res.data.imageLesson);
      }).catch(console.error);
    }
  }, [id]);

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
                  <TextField label="Título" name="title" value={lesson.title || ''} onChange={handleChange} fullWidth required />
                  <TextField label="Duración (HH:MM:SS)" name="duration" value={lesson.duration || ''} onChange={handleChange} fullWidth required />
                </Box>

                <TextField label="Descripción" name="description" value={lesson.description || ''} onChange={handleChange} fullWidth multiline rows={3} required />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField label="Orden de la Lección" name="lessonOrder" type="number" value={lesson.lessonOrder || ''} onChange={handleChange} fullWidth required />
                  <TextField
                    select
                    label="Módulo"
                    name="idModule"
                    value={lesson.idModule || ''}
                    onChange={(e) => setLesson({ ...lesson, idModule: Number(e.target.value) })}
                    fullWidth
                    required
                  >
                    {modules.map((mod) => (
                      <MenuItem key={mod.idModule} value={mod.idModule}>{mod.name}</MenuItem>
                    ))}
                  </TextField>
                </Box>

                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Typography variant="body2" color="text.secondary">Imagen Actual:</Typography>
                    {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: 120, objectFit: 'cover', borderRadius: '8px' }} />}
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setImagePreview(URL.createObjectURL(file));
                      }
                    }} />
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Typography variant="body2" color="text.secondary">Video actual:</Typography>
                    {lesson.urlVideo && (
                      <a href={lesson.urlVideo} target="_blank" rel="noopener noreferrer">Ver video</a>
                    )}
                    <input type="file" accept="video/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setVideoFile(file);
                    }} />
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Typography variant="body2" color="text.secondary">PDF actual:</Typography>
                    {lesson.pdfUrl && (
                      <a href={lesson.pdfUrl} target="_blank" rel="noopener noreferrer">Ver PDF</a>
                    )}
                    <input type="file" accept="application/pdf" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setPdfFile(file);
                    }} />
                  </Box>
                </Box>

                <Stack direction="row" spacing={2}>
                  <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Actualizar Lección'}
                  </Button>
                  <Button variant="outlined" onClick={() => navigate('/lessons')}>Cancelar</Button>
                </Stack>
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
