const Producto = require("../models/Producto");

// Crear un nuevo producto
const crearProducto = async (req, res) => {
    try {
        const { nombre, marca, descripcion, precio, categoria, subcategoria, imagenes, stock, caracteristicas, activo, destacado } = req.body;

        const nuevoProducto = new Producto({
            nombre,
            marca,
            descripcion,
            precio,
            categoria,
            subcategoria,
            imagenes,
            stock,
            caracteristicas,
            activo,
            destacado
        });

        await nuevoProducto.save();
        res.status(201).json({ mensaje: "Producto creado exitosamente", producto: nuevoProducto });

    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear producto", error: error.message });
    }
};

// Obtener todos los productos
const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener productos", error: error.message });
    }
};

// Obtener un producto por ID
const obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.json(producto);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener producto", error: error.message });
    }
};

// Actualizar un producto
const actualizarProducto = async (req, res) => {
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!productoActualizado) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.json({ mensaje: "Producto actualizado", producto: productoActualizado });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar producto", error: error.message });
    }
};

// Eliminar un producto
const eliminarProducto = async (req, res) => {
    try {
        const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
        if (!productoEliminado) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        res.json({ mensaje: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar producto", error: error.message });
    }
};

module.exports = { crearProducto, obtenerProductos, obtenerProductoPorId, actualizarProducto, eliminarProducto };
