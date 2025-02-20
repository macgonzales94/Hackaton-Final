const Culqi = require("culqi-node");
const Pedido = require("../models/Pedido");
const Carrito = require("../models/Carrito");
const Usuario = require("../models/Usuario");
const emailService = require("../services/emailService");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const axios = require("axios");
require("dotenv").config();

// Inicializar Culqi con las llaves del backend
const culqi = new Culqi({
    privateKey: process.env.CULQI_PRIVATE_KEY,
    publicKey: process.env.CULQI_PUBLIC_KEY,
    pciCompliant: true,
    apiVersion: "v2"
});

// Obtener la llave pública para el frontend
const obtenerConfig = async (req, res) => {
    try {
        res.json({ publicKey: process.env.CULQI_PUBLIC_KEY });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener configuración", error: error.message });
    }
};

// Generar Token de Tarjeta en el backend con la `CULQI_PUBLIC_KEY`
const generarToken = async (req, res) => {
    try {
        const { card_number, cvv, expiration_month, expiration_year, email } = req.body;
        console.log("Generando token con Culqi...");
        const response = await fetch("https://secure.culqi.com/v2/tokens", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.CULQI_PUBLIC_KEY}`
            },
            body: JSON.stringify({ card_number, cvv, expiration_month, expiration_year, email })
        });

        const data = await response.json();
        console.log("Respuesta de Culqi:", data); // 🔍 Depuración
        if (!response.ok) {
            return res.status(400).json({ mensaje: "Error al generar token", error: data.user_message || data.merchant_message });
        }

        res.json({ token: data.id });
    } catch (error) {
        console.error("Error al generar token:", error);
        res.status(500).json({ mensaje: "Error al generar token", error: error.message });
    }
};

// Procesar el pago con `CULQI_PRIVATE_KEY`
const procesarPago = async (req, res) => {
    try {
        const { token, email, monto, direccionEnvio, pedido } = req.body;

        if (!pedido || !pedido.productos) {
            return res.status(400).json({ mensaje: "Error: No se recibió información del pedido." });
        }

        console.log("Pedido recibido:", pedido); // Debug

        if (!monto || monto <= 0) {
            return res.status(400).json({ mensaje: "Error: Monto inválido." });
        }

        const pagoResponse = await fetch("https://api.culqi.com/v2/charges", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.CULQI_PRIVATE_KEY}`
            },
            body: JSON.stringify({
                amount: Math.round(monto * 100),
                source_id: token,
                email,
                currency_code: "PEN",
                capture: true,
                description: "Pago en Bellisima Salon & Spa",
                metadata: {
                    cliente: email,
                    direccion: `${direccionEnvio.calle}, ${direccionEnvio.ciudad}, ${direccionEnvio.distrito}, ${direccionEnvio.codigoPostal}`
                }
            })
        });

        const pagoData = await pagoResponse.json();
        console.log("Respuesta de Culqi:", pagoData);

        // 🔹 Si la transacción es autorizada (AUT0000), considerar el pago exitoso
        if (pagoData.outcome?.code === "AUT0000") {
            return res.json({
                mensaje: "Pago realizado con éxito",
                pago: pagoData,
                user_message: pagoData.outcome.user_message
            });
        }
        // Enviar correo de confirmación
        const correoEnviado = await emailService.enviarConfirmacionPedido(pedido, { email });

        res.json({
            mensaje: "Pago realizado con éxito",
            pago: pagoData,
            correo: correoEnviado
        });

        // Si no tiene `AUT0000`, se considera error
        return res.status(400).json({ mensaje: "Error en el pago con Culqi", error: pagoData });

    } catch (error) {
        console.error("Error al procesar el pago:", error);
        res.status(500).json({ mensaje: "Error al procesar el pago", error: error.message });
    }
};
module.exports = { obtenerConfig, generarToken, procesarPago };