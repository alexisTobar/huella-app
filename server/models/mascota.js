const mongoose = require('mongoose');

const MascotaSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        default: "Sin nombre",
        trim: true 
    },
    tipo: { 
        type: String, 
        default: "Perro",
        trim: true 
    },
    categoria: { 
        type: String, 
        required: true,
        enum: ['Perdida', 'Adopcion'] 
    },
    // CAMBIO: Ahora es un Array de Strings para soportar hasta 3 fotos
    fotos: [{ 
        type: String 
    }],
    ubicacion: { 
        type: String, 
        default: "Dirección no especificada",
        trim: true 
    },
    comuna: { 
        type: String, 
        default: "Talagante",
        trim: true 
    },
    descripcion: {
        type: String,
        default: "Sin descripción adicional",
        trim: true
    },
    contacto: {
        telefono: { 
            type: String, 
            required: true 
        }
    },
    usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    },
    // MEJORA: Campo para registrar avistamientos de la comunidad
    avistamientos: [{
        coordenadas: {
            lat: Number,
            lng: Number
        },
        fecha: { 
            type: Date, 
            default: Date.now 
        },
        mensaje: String,
        informante: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Usuario' 
        }
    }],
    fecha: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Mascota', MascotaSchema);