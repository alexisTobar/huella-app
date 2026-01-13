const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    precio: { type: Number, required: true },
    descripcion: String,
    // CAMBIO: Ahora es un Array de Strings para soportar hasta 3 fotos
    fotos: [{ 
        type: String 
    }],
    categoria: { 
        type: String, 
        enum: ['Alimento', 'Accesorios', 'Salud', 'Juguetes'], 
        default: 'Accesorios' 
    },
    whatsappVendedor: String,
    tienda: String,
    autor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    },
    vendido: { type: Boolean, default: false },
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Producto', ProductoSchema);