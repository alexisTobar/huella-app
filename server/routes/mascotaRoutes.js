const express = require('express');
const router = express.Router();
const mascotaController = require('../controllers/mascotaController');
const upload = require('../config/cloudinary');

// Rutas principales
router.get('/', mascotaController.obtenerMascotas);
router.post('/', upload.array('image', 3), mascotaController.crearMascota);
router.delete('/:id', mascotaController.eliminarMascota);

// Nueva ruta para filtrar por usuario
router.get('/usuario/:usuarioId', mascotaController.obtenerMisMascotas);

module.exports = router;