const Carrito = require("../models/Carrito");
const Producto = require("../models/Producto");

// Agregar un producto al carrito
const agregarAlCarrito = async (req, res) => {
    try {
        const { productoId, cantidad } = req.body;

        // Verificar si el producto existe
        const producto = await Producto.findById(productoId);
        if (!producto) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        // Buscar carrito del usuario
        let carrito;
        if (req.usuario) {
            carrito = await Carrito.findOne({ usuario: req.usuario.id });
        } else {
            carrito = await Carrito.findOne({ _id: req.session.carritoId });
        }

        // Si no tiene carrito, se crea uno nuevo
        if (!carrito) {
            carrito = new Carrito({
                usuario: req.usuario ? req.usuario.id : null,
                productos: [],
                total: 0
            });
        }

        // Verificar si el producto ya está en el carrito
        const itemIndex = carrito.productos.findIndex(p => p.producto.toString() === productoId);

        if (itemIndex >= 0) {
            // Si el producto ya está en el carrito, actualizar la cantidad
            carrito.productos[itemIndex].cantidad += cantidad;
        } else {
            // Agregar nuevo producto al carrito
            carrito.productos.push({
                producto: productoId,
                cantidad,
                precioUnitario: producto.precio
            });
        }

        // Calcular total
        carrito.total = carrito.productos.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);

        // Guardar carrito
        await carrito.save();

        res.json({ mensaje: "Producto agregado al carrito", carrito });

    } catch (error) {
        res.status(500).json({ mensaje: "Error al agregar producto", error: error.message });
    }
};

// Obtener el carrito del usuario
const obtenerCarrito = async (req, res) => {
    try {
        let carrito;
        if (req.usuario) {
            carrito = await Carrito.findOne({ usuario: req.usuario.id }).populate("productos.producto");
        } else {
            carrito = await Carrito.findOne({ _id: req.session.carritoId }).populate("productos.producto");
        }

        if (!carrito) {
            return res.json({ mensaje: "El carrito está vacío", carrito: { productos: [], total: 0 } });
        }

        res.json(carrito);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener carrito", error: error.message });
    }
};

// Eliminar un producto del carrito
const eliminarProductoDelCarrito = async (req, res) => {
    try {
        const { productoId } = req.params;

        let carrito;
        if (req.usuario) {
            carrito = await Carrito.findOne({ usuario: req.usuario.id });
        } else {
            carrito = await Carrito.findOne({ _id: req.session.carritoId });
        }

        if (!carrito) {
            return res.status(404).json({ mensaje: "Carrito no encontrado" });
        }

        // Filtrar productos para eliminar el producto seleccionado
        carrito.productos = carrito.productos.filter(p => p.producto.toString() !== productoId);

        // Recalcular total
        carrito.total = carrito.productos.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);

        // Guardar cambios
        await carrito.save();

        res.json({ mensaje: "Producto eliminado del carrito", carrito });

    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar producto", error: error.message });
    }
};

// Vaciar carrito
const vaciarCarrito = async (req, res) => {
    try {
        let carrito;
        if (req.usuario) {
            carrito = await Carrito.findOne({ usuario: req.usuario.id });
        } else {
            carrito = await Carrito.findOne({ _id: req.session.carritoId });
        }

        if (!carrito) {
            return res.status(404).json({ mensaje: "Carrito no encontrado" });
        }

        carrito.productos = [];
        carrito.total = 0;
        await carrito.save();

        res.json({ mensaje: "Carrito vaciado exitosamente" });

    } catch (error) {
        res.status(500).json({ mensaje: "Error al vaciar carrito", error: error.message });
    }
};

const sincronizarCarrito = async (req, res) => {
    try {
        const { productos } = req.body;
        const usuarioId = req.usuario.id;

        if (!productos || productos.length === 0) {
            return res.status(400).json({ mensaje: "No hay productos para sincronizar." });
        }

        // Buscar si el usuario ya tiene un carrito
        let carrito = await Carrito.findOne({ usuario: usuarioId });

        if (!carrito) {
            carrito = new Carrito({
                usuario: usuarioId,
                productos: [],
                total: 0
            });
        }

        // Agregar productos al carrito
        for (const item of productos) {
            const productoDB = await Producto.findById(item.id);
            if (!productoDB) continue;

            const existente = carrito.productos.find(p => p.producto.toString() === item.id);
            if (existente) {
                existente.cantidad += item.cantidad;
            } else {
                carrito.productos.push({
                    producto: item.id,
                    cantidad: item.cantidad,
                    precioUnitario: productoDB.precio
                });
            }
        }

        // Calcular total
        carrito.total = carrito.productos.reduce((sum, item) => sum + (item.cantidad * item.precioUnitario), 0);

        await carrito.save();
        res.json({ mensaje: "Carrito sincronizado con éxito", carrito });

    } catch (error) {
        res.status(500).json({ mensaje: "Error al sincronizar carrito", error: error.message });
    }
};

module.exports = { agregarAlCarrito, obtenerCarrito, eliminarProductoDelCarrito, vaciarCarrito, sincronizarCarrito };
