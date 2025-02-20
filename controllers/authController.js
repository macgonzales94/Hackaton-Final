const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");

// Función para generar un token JWT
const generarToken = (usuario) => {
    return jwt.sign(
        { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
        process.env.JWT_SECRETO,
        { expiresIn: "7d" }
    );
};

// Registro de usuario
const registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password, telefono, direccion, rol } = req.body;

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: "El correo ya está registrado" });
        }

        // Si no hay admins, permitir crear el primero como admin
        const hayAdmin = await Usuario.findOne({ rol: "admin" });
        const nuevoRol = hayAdmin ? "cliente" : rol || "cliente"; // Si no hay admin, permite crearlo

        // Crear nuevo usuario
        const nuevoUsuario = new Usuario({ nombre, email, password, telefono, direccion, rol: nuevoRol });
        await nuevoUsuario.save();

        // Generar token y enviar respuesta
        res.status(201).json({
            mensaje: "Usuario registrado exitosamente",
            usuario: { id: nuevoUsuario._id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email, rol: nuevoUsuario.rol },
            token: generarToken(nuevoUsuario)
        });

    } catch (error) {
        res.status(500).json({ mensaje: "Error al registrar usuario", error: error.message });
    }
};

// Iniciar sesión
const iniciarSesion = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario por email
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ mensaje: "Correo o contraseña incorrectos" });
        }

        // Verificar contraseña
        const esCorrecta = await usuario.compararPassword(password);
        if (!esCorrecta) {
            return res.status(400).json({ mensaje: "Correo o contraseña incorrectos" });
        }

        // Generar token y responder
        res.json({
            mensaje: "Inicio de sesión exitoso",
            usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email },
            token: generarToken(usuario)
        });

    } catch (error) {
        res.status(500).json({ mensaje: "Error al iniciar sesión", error: error.message });
    }
};

module.exports = { registrarUsuario, iniciarSesion };
