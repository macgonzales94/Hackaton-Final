// config.js
const config = {
    apiUrl: process.env.NODE_ENV === 'production' 
      ? 'https://tu-app.onrender.com'
      : 'http://localhost:5000'
  };
  
  export default config;