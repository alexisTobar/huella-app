const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas existentes
router.post('/registrar', authController.registrar);
router.post('/login', authController.login);

// --- NUEVAS RUTAS DE SEGURIDAD ---

// Ruta para confirmar el correo (el link del email llevará aquí)
router.get('/verificar/:token', authController.verificarCorreo);

// Ruta para solicitar el correo de recuperación
router.post('/olvide-password', authController.olvidePassword);

// Ruta para guardar la nueva contraseña
router.post('/reset-password/:token', authController.resetPassword);

// --- RUTA PARA GOOGLE ---
router.post('/google', authController.googleLogin);

router.get('/usuarios', authController.obtenerUsuarios);
// ... otras rutas
router.patch('/usuarios/rol/:id', authController.cambiarRol);

module.exports = router;