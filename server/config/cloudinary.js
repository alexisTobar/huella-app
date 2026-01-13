const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuramos Cloudinary con tus llaves del .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuramos "Multer", que es el que recibe la foto y la manda a la nube
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'huella_local', // Carpeta que se creará en tu Cloudinary
    allowedFormats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }] // Redimensionar para ahorrar espacio
  }
});

const upload = multer({ storage: storage });

module.exports = upload;