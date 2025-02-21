// config.js
const config = {
    apiUrl: process.env.NODE_ENV === 'production' 
      ? 'https://hackotan-final.onrender.com'
      : 'http://localhost:5000'
  };
  
  export default config;