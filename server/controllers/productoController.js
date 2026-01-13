const Producto = require('../models/producto');

exports.crearProducto = async (req, res) => {
    try {
        const { titulo, precio, descripcion, whatsappVendedor, tienda, categoria, autor } = req.body;

        if (!autor) {
            return res.status(400).json({ mensaje: 'El ID del autor es obligatorio' });
        }

        // Verificamos fotos
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ mensaje: 'Debe subir al menos una foto del producto' });
        }

        const rutasFotos = req.files.map(file => file.path);

        const nuevoProducto = new Producto({
            titulo, 
            precio, 
            descripcion, 
            whatsappVendedor, 
            tienda: tienda || "Tienda Local", 
            categoria,
            autor: autor,
            fotos: rutasFotos // Guardamos el array de URLs
        });

        await nuevoProducto.save();
        res.status(201).json({ mensaje: 'Producto publicado', data: nuevoProducto });
    } catch (error) {
        console.error("❌ Error al publicar producto:", error);
        res.status(500).json({ mensaje: 'Error interno al publicar', error: error.message });
    }
};

// ... obtenerProductos, obtenerMisProductos, actualizarEstado y eliminarProducto se mantienen igual
exports.obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find().sort({ fecha: -1 });
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener productos' });
    }
};

exports.obtenerMisProductos = async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const productos = await Producto.find({ autor: usuarioId }).sort({ fecha: -1 });
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener tus productos' });
    }
};

exports.actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { vendido } = req.body;
        const actualizado = await Producto.findByIdAndUpdate(id, { vendido }, { new: true });
        res.json(actualizado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar estado' });
    }
};

exports.eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        await Producto.findByIdAndDelete(id);
        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar' });
    }
};