const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: function() { return !this.googleId; } },
    telefono: { type: String, trim: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    googleId: { type: String, unique: true, sparse: true },
    fotoPerfil: String,
    reputacion: { type: Number, default: 0 },
    mascotasReportadas: { type: Number, default: 0 },
    mascotasEncontradas: { type: Number, default: 0 },
    medallas: { type: [String], default: ['Nuevo Vecino 🏠'] },
    fecha: { type: Date, default: Date.now }
});

// CAMBIO AQUÍ: Verificamos si el modelo ya existe antes de crearlo
module.exports = mongoose.models.Usuario || mongoose.model('Usuario', usuarioSchema);