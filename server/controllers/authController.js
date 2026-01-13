const Usuario = require('../models/usuario');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// --- AGREGADO PARA GOOGLE ---
const { OAuth2Client } = require('google-auth-library');
// Reemplaza esto con el ID que copiaste de Google Cloud Console
const client = new OAuth2Client('535267678930-rufk56n1amq6lvtq84an3g5g80qamc5f.apps.googleusercontent.com');

// CONFIGURACIÓN DE NODEMAILER (GMAIL)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'drokuas@gmail.com',
        pass: 'tcfyqdskyhrbduug' 
    }
});

// URL del Logo de la App
const LOGO_URL = "https://i.postimg.cc/C5vpkC30/Copilot-20260110-194421.png";

// 1. REGISTRAR CON VERIFICACIÓN DE CORREO
exports.registrar = async (req, res) => {
    try {
        const { nombre, email, password, telefono } = req.body;

        const existe = await Usuario.findOne({ email: email.toLowerCase() });
        if (existe) {
            return res.status(400).json({ mensaje: "Este correo electrónico ya está registrado." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const tokenVerificacion = crypto.randomBytes(32).toString('hex');

        const nuevoUsuario = new Usuario({ 
            nombre, 
            email: email.toLowerCase(), 
            password: hashedPassword, 
            telefono,
            verificationToken: tokenVerificacion,
            isVerified: false 
        });

        await nuevoUsuario.save();

        const urlVerificacion = `http://localhost:5173/verificar-correo/${tokenVerificacion}`;
        
        // CORREO DE BIENVENIDA ESTILIZADO
        await transporter.sendMail({
            from: '"TalaHuellas 🐾" <drokuas@gmail.com>',
            to: email,
            subject: "¡Bienvenido a la manada! Activa tu cuenta 🐾",
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; background-color: #fcfaf7; border-radius: 20px; overflow: hidden; border: 1px solid #f1f5f9;">
                    <div style="background-color: #0f172a; padding: 40px; text-align: center;">
                        <img src="${LOGO_URL}" alt="TalaHuellas Logo" style="width: 120px; margin-bottom: 20px;">
                        <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: -1px;">¡Hola, ${nombre}!</h1>
                    </div>
                    <div style="padding: 40px; text-align: center; color: #334155;">
                        <h2 style="color: #f97316; margin-bottom: 20px;">¡Gracias por unirte a TalaHuellas!</h2>
                        <p style="font-size: 16px; line-height: 1.6;">Estamos muy felices de que seas parte de la red de protección animal más grande de la <strong>Provincia del Maipo</strong>.</p>
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">Ninguna huella debe quedarse atrás. Para comenzar a reportar y ayudar a nuestra comunidad, por favor activa tu cuenta.</p>
                        
                        <a href="${urlVerificacion}" style="background-color: #f97316; color: white; padding: 18px 35px; text-decoration: none; font-weight: 900; border-radius: 50px; display: inline-block; letter-spacing: 1px; box-shadow: 0 10px 20px rgba(249, 115, 22, 0.2);">ACTIVAR MI CUENTA</a>
                        
                        <p style="font-size: 12px; color: #94a3b8; margin-top: 40px;">Si el botón no funciona, copia y pega este link en tu navegador:<br>${urlVerificacion}</p>
                    </div>
                    <div style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="font-size: 11px; color: #64748b; margin: 0; text-transform: uppercase; font-weight: bold; letter-spacing: 2px;">© 2026 TalaHuellas • Talagante, Chile</p>
                    </div>
                </div>
            `
        });

        console.log(`📩 Correo de verificación enviado a: ${email}`);
        res.status(201).json({ mensaje: "Registro exitoso. Por favor, revisa tu correo para activar tu cuenta." });

    } catch (error) {
        console.error("❌ Error en registro:", error);
        res.status(500).json({ mensaje: "Error al procesar el registro." });
    }
};

// 2. LOGUEAR (Validando verificación)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ email: email.toLowerCase() });
        
        if (!usuario) {
            return res.status(401).json({ mensaje: "El correo o la contraseña son incorrectos." });
        }

        if (!usuario.isVerified) {
            return res.status(403).json({ 
                mensaje: "Tu cuenta aún no ha sido activada. Revisa tu correo electrónico para verificarla." 
            });
        }

        const esCorrecta = await bcrypt.compare(password, usuario.password);
        if (!esCorrecta) {
            return res.status(401).json({ mensaje: "El correo o la contraseña son incorrectos." });
        }

        res.json({ 
            mensaje: "Bienvenido", 
            usuario: { 
                id: usuario._id, 
                nombre: usuario.nombre, 
                email: usuario.email, 
                role: usuario.role 
            } 
        });
    } catch (error) {
        console.error("❌ Error en login:", error);
        res.status(500).json({ mensaje: "Error interno del servidor." });
    }
};

// 3. CONFIRMAR CORREO
exports.verificarCorreo = async (req, res) => {
    try {
        const { token } = req.params;
        const usuario = await Usuario.findOne({ verificationToken: token });

        if (!usuario) {
            return res.status(400).json({ mensaje: "El enlace de verificación es inválido o ha expirado." });
        }

        usuario.isVerified = true;
        usuario.verificationToken = undefined;
        await usuario.save();

        res.json({ mensaje: "¡Cuenta activada con éxito! Ya puedes iniciar sesión." });
    } catch (error) {
        console.error("❌ Error al verificar correo:", error);
        res.status(500).json({ mensaje: "Error al procesar la verificación." });
    }
};

// 4. SOLICITAR RECUPERACIÓN DE CLAVE
exports.olvidePassword = async (req, res) => {
    try {
        const { email } = req.body;
        const usuario = await Usuario.findOne({ email: email.toLowerCase() });

        if (!usuario) {
            return res.status(404).json({ mensaje: "No encontramos ninguna cuenta asociada a este correo." });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        usuario.resetPasswordToken = resetToken;
        usuario.resetPasswordExpires = Date.now() + 3600000;
        await usuario.save();

        const urlReset = `http://localhost:5173/reset-password/${resetToken}`;

        // CORREO DE RECUPERACIÓN ESTILIZADO
        await transporter.sendMail({
            from: '"TalaHuellas 🐾" <drokuas@gmail.com>',
            to: email,
            subject: "Restablece tu contraseña - TalaHuellas 🔐",
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #f1f5f9; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
                    <div style="background-color: #0f172a; padding: 30px; text-align: center;">
                        <img src="${LOGO_URL}" alt="TalaHuellas Logo" style="width: 100px;">
                    </div>
                    <div style="padding: 40px; text-align: center; color: #1e293b;">
                        <div style="font-size: 50px; margin-bottom: 20px;">🔐</div>
                        <h2 style="margin: 0 0 20px 0; font-size: 24px;">¿Olvidaste tu contraseña?</h2>
                        <p style="font-size: 16px; color: #64748b; line-height: 1.6;">No te preocupes, a todos nos pasa. Haz clic en el botón de abajo para crear una nueva clave y volver a proteger a nuestros amigos.</p>
                        <div style="margin: 35px 0;">
                            <a href="${urlReset}" style="background-color: #0f172a; color: white; padding: 15px 30px; text-decoration: none; font-weight: bold; border-radius: 12px; display: inline-block;">CAMBIAR CONTRASEÑA</a>
                        </div>
                        <p style="font-size: 14px; color: #94a3b8;">Este enlace expirará en 1 hora por tu seguridad.</p>
                    </div>
                    <div style="background-color: #f97316; padding: 10px; text-align: center;">
                        <p style="color: white; font-size: 12px; margin: 0; font-weight: bold;">TalaHuellas • Siempre cuidándolos</p>
                    </div>
                </div>
            `
        });

        res.json({ mensaje: "Te hemos enviado un correo con las instrucciones." });
    } catch (error) {
        console.error("❌ Error en olvidePassword:", error);
        res.status(500).json({ mensaje: "Hubo un error al procesar tu solicitud." });
    }
};

// 5. RESTABLECER NUEVA CLAVE
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { nuevaPassword } = req.body;

        const usuario = await Usuario.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!usuario) {
            return res.status(400).json({ mensaje: "El enlace es inválido o ha caducado." });
        }

        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(nuevaPassword, salt);
        usuario.resetPasswordToken = undefined;
        usuario.resetPasswordExpires = undefined;
        await usuario.save();

        res.json({ mensaje: "¡Contraseña actualizada! Ya puedes entrar con tu nueva clave." });
    } catch (error) {
        console.error("❌ Error en resetPassword:", error);
        res.status(500).json({ mensaje: "No se pudo actualizar la contraseña." });
    }
};

// --- 6. NUEVA FUNCIÓN: LOGIN CON GOOGLE ---
exports.googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        // USAMOS TU ID REAL
        const GOOGLE_CLIENT_ID = '535267678930-rufk56n1amq6lvtq84an3g5g80qamc5f.apps.googleusercontent.com';

        const ticket = await client.verifyIdToken({
            idToken,
            audience: GOOGLE_CLIENT_ID
        });

        const { name, email, picture, sub } = ticket.getPayload();

        let usuario = await Usuario.findOne({ email: email.toLowerCase() });

        if (!usuario) {
            usuario = new Usuario({
                nombre: name,
                email: email.toLowerCase(),
                googleId: sub,
                fotoPerfil: picture,
                isVerified: true 
            });
            await usuario.save();
        } else {
            if (!usuario.googleId) {
                usuario.googleId = sub;
                usuario.fotoPerfil = picture;
                usuario.isVerified = true;
                await usuario.save();
            }
        }

        res.json({
            mensaje: "Login con Google exitoso",
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                role: usuario.role,
                fotoPerfil: usuario.fotoPerfil
            }
        });

    } catch (error) {
        console.error("❌ Error en Google Login:", error);
        res.status(400).json({ mensaje: "Fallo en la autenticación con Google" });
    }
};

// 7. OBTENER TODOS LOS USUARIOS (Solo para Admin)
exports.obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-password'); // Traemos todo menos la contraseña
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener usuarios" });
    }
};

// --- 8. NUEVA FUNCIÓN: CAMBIAR ROL DE USUARIO ---
exports.cambiarRol = async (req, res) => {
    try {
        const { id } = req.params;
        const { nuevoRol } = req.body; // Recibe 'admin' o 'user'

        const usuario = await Usuario.findByIdAndUpdate(
            id, 
            { role: nuevoRol }, 
            { new: true }
        ).select('-password');

        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.json({ mensaje: `Rol actualizado a ${nuevoRol} con éxito`, usuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al actualizar el rol" });
    }
};