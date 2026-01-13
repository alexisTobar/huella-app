const axios = require('axios');

// URL de tu backend en Render
const url = 'https://talahuellas-backend.onrender.com/api/mascotas'; 

const wakeUpRender = async () => {
    try {
        console.log("⏰ Despertando a Render...");
        const response = await axios.get(url);
        console.log("✅ Render está despierto. Status:", response.status);
    } catch (error) {
        console.error("❌ Error al despertar a Render:", error.message);
    }
};

// Se ejecuta cada 12 minutos (12 * 60 * 1000 milisegundos)
setInterval(wakeUpRender, 12 * 60 * 1000);

// Ejecutar una vez al inicio
wakeUpRender();