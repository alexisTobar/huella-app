const Mascota = require('../models/mascota');
const Usuario = require('../models/usuario');
const admin = require('firebase-admin');

// 1. INICIALIZACIÓN DE FIREBASE ADMIN (MEJORADA PARA RENDER)
try {
    if (!admin.apps.length) {
        let serviceAccount;

        // Si existe la variable de entorno en Render, la usamos
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } else {
            // Si no (estás en local), busca el archivo físico
            serviceAccount = require("../firebase-key.json");
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("✅ Firebase Admin conectado correctamente");
    }
} catch (error) {
    console.error("❌ Error al inicializar Firebase Admin:", error.message);
    console.log("Asegúrate de configurar FIREBASE_SERVICE_ACCOUNT en Render o tener el JSON en local.");
}

exports.crearMascota = async (req, res) => {
    console.log("📥 Datos RAW recibidos:", req.body);
    console.log("📂 Archivos recibidos:", req.files);

    try {
        const { nombre, tipo, categoria, telefono, ubicacion, comuna, autor, descripcion } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ mensaje: 'Es obligatorio subir al menos una foto' });
        }

        const rutasFotos = req.files.map(file => file.path);

        const nuevaMascota = new Mascota({
            nombre: nombre || "Sin nombre",
            tipo: tipo || "Perro",
            categoria: categoria,
            fotos: rutasFotos, 
            ubicacion: ubicacion || "Dirección no especificada",
            comuna: comuna || "Talagante",
            descripcion: descripcion || "El usuario no proporcionó descripción", 
            contacto: { 
                telefono: telefono 
            },
            usuario: autor 
        });

        const guardado = await nuevaMascota.save();

        // --- LÓGICA DE REPUTACIÓN SOCIAL PET ---
        await Usuario.findByIdAndUpdate(autor, {
            $inc: { 
                reputacion: 10,
                mascotasReportadas: 1 
            }
        });

        // --- 🔔 ENVIAR NOTIFICACIONES PUSH A TODOS ---
        try {
            // Buscamos todos los usuarios que tengan al menos un token registrado
            const usuariosConToken = await Usuario.find({ 
                pushTokens: { $exists: true, $not: { $size: 0 } } 
            });

            // Creamos una lista plana con todos los tokens encontrados
            const todosLosTokens = usuariosConToken.flatMap(u => u.pushTokens);

            if (todosLosTokens.length > 0) {
                const mensaje = {
                    notification: {
                        title: `🚨 NUEVA ALERTA: ${categoria.toUpperCase()}`,
                        body: `Se ha reportado un ${tipo} (${nombre || 'Sin nombre'}) en ${comuna}. ¡Ayúdanos a encontrarlo!`,
                    },
                    tokens: todosLosTokens,
                };

                const response = await admin.messaging().sendEachForMulticast(mensaje);
                console.log(`📢 Notificaciones: ${response.successCount} enviadas, ${response.failureCount} fallidas`);
            } else {
                console.log("ℹ️ No hay tokens registrados para enviar notificaciones.");
            }
        } catch (pushError) {
            console.error("⚠️ Error al enviar notificaciones push:", pushError);
            // No detenemos la respuesta al cliente si falla el envío de notificaciones
        }

        res.status(201).json(guardado);

    } catch (error) {
        console.error("❌ ERROR CRÍTICO AL CREAR:", error.message);
        res.status(500).json({ mensaje: 'Error al procesar el reporte', error: error.message });
    }
};

exports.obtenerMascotas = async (req, res) => {
    try {
        const mascotas = await Mascota.find()
            .populate('usuario', 'nombre fotoPerfil reputacion medallas mascotasReportadas mascotasEncontradas')
            .sort({ fecha: -1 }); 
        res.json(mascotas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener datos' });
    }
};

exports.obtenerMisMascotas = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const mascotas = await Mascota.find({ usuario: usuarioId }).sort({ fecha: -1 });
        res.json(mascotas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener tus reportes' });
    }
};

exports.eliminarMascota = async (req, res) => {
    try {
        const { id } = req.params;
        const mascota = await Mascota.findById(id);
        if (!mascota) return res.status(404).json({ mensaje: 'Mascota no encontrada' });

        await Mascota.findByIdAndDelete(id);

        await Usuario.findByIdAndUpdate(mascota.usuario, {
            $inc: { mascotasReportadas: -1 }
        });

        res.json({ mensaje: 'Reporte eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'No se pudo eliminar el reporte' });
    }
};