const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const upload = require('../config/cloudinary');

// Rutas generales
router.get('/', productoController.obtenerProductos);
router.post('/', upload.array('image', 3), productoController.crearProducto);
router.delete('/:id', productoController.eliminarProducto);

// Ruta para cambiar estado (Vendido/Disponible)
router.put('/:id', productoController.actualizarEstado);

// RUTA CRÍTICA PARA EL PANEL DE USUARIO
router.get('/usuario/:usuarioId', productoController.obtenerMisProductos);

module.exports = router;