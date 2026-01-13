const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tu-correo@gmail.com', // Tu correo
        pass: 'xxxx xxxx xxxx xxxx'  // Contraseña de aplicación generada en Google
    }
});

module.exports = transporter;