const Mascota = require('../models/mascota');
const Usuario = require('../models/usuario'); // Importante para actualizar reputación

exports.crearMascota = async (req, res) => {
    console.log("📥 Datos RAW recibidos:", req.body);
    console.log("📂 Archivos recibidos:", req.files);

    try {
        const { nombre, tipo, categoria, telefono, ubicacion, comuna, autor, descripcion } = req.body;

        // Verificamos si subió al menos una foto
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ mensaje: 'Es obligatorio subir al menos una foto' });
        }

        // Mapeamos las rutas de todas las fotos subidas
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

        // --- MEJORA: LÓGICA DE REPUTACIÓN SOCIAL PET ---
        // Sumamos 10 puntos por cada alerta creada
        await Usuario.findByIdAndUpdate(autor, {
            $inc: { 
                reputacion: 10,
                mascotasReportadas: 1 
            }
        });

        res.status(201).json(guardado);

    } catch (error) {
        console.error("❌ ERROR CRÍTICO AL CREAR:", error.message);
        res.status(500).json({ mensaje: 'Error al procesar el reporte', error: error.message });
    }
};

exports.obtenerMascotas = async (req, res) => {
    try {
        // MEJORA: .populate trae los datos del usuario (reputación, medallas, etc) para el Home
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
        
        // Antes de eliminar, buscamos la mascota para saber quién es el dueño
        const mascota = await Mascota.findById(id);
        if (!mascota) return res.status(404).json({ mensaje: 'Mascota no encontrada' });

        await Mascota.findByIdAndDelete(id);

        // MEJORA: Si la mascota fue encontrada (eliminación positiva), podríamos sumar más puntos
        // Por ahora, solo descontamos la mascota reportada de la estadística
        await Usuario.findByIdAndUpdate(mascota.usuario, {
            $inc: { mascotasReportadas: -1 }
        });

        res.json({ mensaje: 'Reporte eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'No se pudo eliminar el reporte' });
    }
};