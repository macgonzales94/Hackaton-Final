const Pedido = require("../models/Pedido");
const Carrito = require("../models/Carrito");
const Usuario = require("../models/Usuario");

// Generar un código único de pedido
const generarCodigoPedido = () => {
    return "PED-" + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Crear un pedido a partir del carrito
const crearPedido = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;
        const { direccionEnvio } = req.body;

        // Verificar si el carrito tiene productos
        const carrito = await Carrito.findOne({ usuario: usuarioId }).populate("productos.producto");
        if (!carrito || carrito.productos.length === 0) {
            return res.status(400).json({ mensaje: "El carrito está vacío" });
        }

        // Crear el pedido
        const nuevoPedido = new Pedido({
            codigoPedido: generarCodigoPedido(),
            usuario: usuarioId,
            productos: carrito.productos.map(item => ({
                producto: item.producto._id,
                cantidad: item.cantidad,
                precioUnitario: item.precioUnitario
            })),
            direccionEnvio,
            pago: {
                estado: "pendiente",
                metodoPago: "por definir",
                referencia: null
            },
            total: carrito.total
        });

        await nuevoPedido.save();

        // Vaciar el carrito después de la creación del pedido
        //await Carrito.findOneAndDelete({ usuario: usuarioId });

        res.status(201).json({ mensaje: "Pedido creado exitosamente", pedido: nuevoPedido });

    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear el pedido", error: error.message });
    }
};

// Obtener todos los pedidos del usuario autenticado
const obtenerPedidosUsuario = async (req, res) => {
    try {
        const pedidos = await Pedido.find({ usuario: req.usuario.id }).populate("productos.producto");
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener pedidos", error: error.message });
    }
};

// Obtener todos los pedidos (ADMIN)
const obtenerTodosLosPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find().populate("usuario", "nombre email").populate("productos.producto");
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener pedidos", error: error.message });
    }
};

// Actualizar el estado de un pedido (ADMIN)
const actualizarEstadoPedido = async (req, res) => {
    try {
        const { estado } = req.body;
        const pedido = await Pedido.findByIdAndUpdate(req.params.id, { estado }, { new: true });

        if (!pedido) {
            return res.status(404).json({ mensaje: "Pedido no encontrado" });
        }

        res.json({ mensaje: "Estado del pedido actualizado", pedido });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar pedido", error: error.message });
    }
};

// Eliminar un pedido (ADMIN)
const eliminarPedido = async (req, res) => {
    try {
        const pedidoEliminado = await Pedido.findByIdAndDelete(req.params.id);

        if (!pedidoEliminado) {
            return res.status(404).json({ mensaje: "Pedido no encontrado" });
        }

        res.json({ mensaje: "Pedido eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar pedido", error: error.message });
    }
};

module.exports = { crearPedido, obtenerPedidosUsuario, obtenerTodosLosPedidos, actualizarEstadoPedido, eliminarPedido };
