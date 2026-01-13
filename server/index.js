require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); // <-- Aseguramos que esté aquí
const cors = require('cors');

// Importamos el modelo con minúscula para evitar el error anterior
const Usuario = require('./models/usuario'); 

const app = express();
app.use(cors());
app.use(express.json());

// RUTAS
app.use('/api/mascotas', require('./routes/mascotaRoutes'));
app.use('/api/productos', require('./routes/productoRoutes'));
app.use('/api/auth', require('./routes/authRoutes')); 

// CONEXIÓN Y SCRIPT
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('✅ MongoDB Conectado');

        // SCRIPT DE REPUTACIÓN: Se ejecuta una vez al conectar
        try {
            const resultado = await Usuario.updateMany(
                { reputacion: { $exists: false } }, 
                { 
                    $set: { 
                        reputacion: 10, 
                        mascotasReportadas: 0, 
                        mascotasEncontradas: 0, 
                        medallas: ['Nuevo Vecino 🏠'] 
                    } 
                }
            );
            if (resultado.modifiedCount > 0) {
                console.log(`✨ Sistema Social: ${resultado.modifiedCount} usuarios actualizados.`);
            }
        } catch (e) {
            console.error("❌ Error en script social:", e);
        }

        app.listen(process.env.PORT, () => console.log(`🚀 Servidor en puerto ${process.env.PORT}`));
    })
    .catch(err => console.error('❌ Error de conexión:', err));