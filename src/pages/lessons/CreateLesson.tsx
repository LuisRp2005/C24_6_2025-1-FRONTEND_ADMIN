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
  Divider,
  MenuItem,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { createLesson } from '../../services/lessonService';
import { getCourses } from '../../services/courseService';
import { Course } from '../../models/Course';
import { Lesson } from '../../models/Lesson';
import { AxiosError } from 'axios';

export default function CreateLesson() {

  return (
    <h1>CreateLesson</h1>
  );
} 