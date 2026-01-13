const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const Usuario = require('../models/usuario'); // Importamos el modelo para la nueva ruta

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

// --- NUEVA RUTA: REGISTRAR TOKEN DE NOTIFICACIONES PUSH ---
router.post('/registrar-token', async (req, res) => {
    try {
        const { userId, token } = req.body;
        
        if (!userId || !token) {
            return res.status(400).json({ mensaje: "Falta userId o token" });
        }

        // $addToSet agrega el token al array solo si no existe ya
        await Usuario.findByIdAndUpdate(userId, {
            $addToSet: { pushTokens: token }
        });

        res.status(200).json({ mensaje: "Token registrado correctamente" });
    } catch (error) {
        console.error("Error al registrar token:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});

module.exports = router;