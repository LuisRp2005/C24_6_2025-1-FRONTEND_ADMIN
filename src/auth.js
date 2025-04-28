export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  // Verificar si el token no ha expirado
  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = tokenData.exp * 1000; // Convertir a milisegundos
    return Date.now() < expirationTime;
  } catch (error) {
    return false;
  }
};

export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
};