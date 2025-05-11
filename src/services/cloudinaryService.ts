export const uploadToCloudinary = async (file: File): Promise<string> => {
  const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;
  const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

  if (!UPLOAD_PRESET || !CLOUD_NAME) {
    throw new Error('Las variables de entorno de Cloudinary no están definidas');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const mime = file.type;
    let resourceType = 'image'; // por defecto, incluso para PDFs

    if (mime.startsWith('video/')) {
      resourceType = 'video'; // solo si es video
    }

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!res.ok) {
      const errData = await res.json();
      console.error('Cloudinary error:', errData);
      throw new Error(errData.error?.message || 'Error al subir archivo');
    }

    const data = await res.json();
    return data.secure_url;
  } catch (error: any) {
    console.error('Error en uploadToCloudinary:', error.message || error);
    throw error;
  }
};
