export const uploadToCloudinary = async (file: File): Promise<string> => {
  if (!process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || !process.env.REACT_APP_CLOUDINARY_CLOUD_NAME) {
    throw new Error('Las variables de entorno de Cloudinary no están definidas');
  }

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET as string);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error(`Error al subir: ${res.statusText}`);
    }

    const data = await res.json();
    return data.secure_url;
  } catch (error: any) {
    console.error('Error en uploadToCloudinary:', error?.message || error);
    throw error;
  }
};
