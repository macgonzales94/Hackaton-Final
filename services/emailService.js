const nodemailer = require('nodemailer');


// Crear el transportador de correo
const transporter = nodemailer.createTransport({
    service: 'gmail',  
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false 
    }
});

// Verificar la conexión
transporter.verify(function(error, success) {
    if (error) {
        console.log('Error con el servidor de correo:', error);
    } else {
        console.log('Servidor de correo listo');
    }
});

const emailService = {
    // Enviar correo de bienvenida
    enviarBienvenida: async (usuario) => {
        try {
            await transporter.sendMail({
                from: '"Bellisima Salon & Spa" <noreply@bellisima.com>',
                to: usuario.email,
                subject: "¡Bienvenido/a a Bellisima Salon & Spa!",
                html: `
                    <h1>¡Bienvenido/a ${usuario.nombre}!</h1>
                    <p>Gracias por registrarte en Bellisima Salon & Spa.</p>
                    <p>Ahora podrás acceder a todos nuestros productos y servicios.</p>
                `
            });
            console.log('Email de bienvenida enviado');
        } catch (error) {
            console.error('Error al enviar email de bienvenida:', error);
        }
    },

    // Enviar confirmación de pedido
    enviarConfirmacionPedido: async (pedido, usuario) => {
        try {
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER, 
                    pass: process.env.EMAIL_PASS 
                }
            });
    
            let mailOptions = {
                from: process.env.EMAIL_USER,
                to: usuario.email,
                subject: "¡Gracias por tu compra en Bellisima Salon & Spa! 💖",
                html: `
                    <h2>¡Hola ${usuario.email}!</h2>
                    <p>Gracias por tu compra. Tu pedido está en proceso y pronto te llegará una actualización.</p>
                    <h3>Detalles de tu compra:</h3>
                    <ul>
                        ${pedido.productos.map(p => `<li>${p.nombre} - Cantidad: ${p.cantidad}</li>`).join("")}
                    </ul>
                    <p><strong>Total:</strong> S/. ${pedido.total.toFixed(2)}</p>
                    <br>
                    <p>Si tienes alguna consulta, no dudes en contactarnos.</p>
                    <p>¡Esperamos verte pronto! 💄✨</p>
                `
            };
    
            let info = await transporter.sendMail(mailOptions);
            console.log("Correo enviado con éxito:", info.response);
            return { mensaje: "Correo enviado correctamente." };
        } catch (error) {
            console.error("Error al enviar el correo:", error);
            return { mensaje: "Error al enviar el correo", error: error.message };
        }
    },

    // Enviar actualización de estado de pedido
    enviarActualizacionEstado: async (pedido, usuario) => {
        try {
            await transporter.sendMail({
                from: '"Bellisima Salon & Spa" <noreply@bellisima.com>',
                to: usuario.email,
                subject: `Actualización de Pedido #${pedido._id}`,
                html: `
                    <h1>¡Tu pedido ha sido actualizado!</h1>
                    <p>El estado de tu pedido ha cambiado a: ${pedido.estado}</p>
                    <p>Número de seguimiento: ${pedido.numeroSeguimiento || 'Pendiente'}</p>
                `
            });
            console.log('Email de actualización enviado');
        } catch (error) {
            console.error('Error al enviar actualización:', error);
        }
    },

    // Enviar recordatorio de carrito abandonado
    enviarRecordatorioCarrito: async (usuario, carrito) => {
        try {
            await transporter.sendMail({
                from: '"Bellisima Salon & Spa" <noreply@bellisima.com>',
                to: usuario.email,
                subject: "¡No olvides tus productos!",
                html: `
                    <h1>¡Hola ${usuario.nombre}!</h1>
                    <p>Notamos que dejaste algunos productos en tu carrito.</p>
                    <p>¡Regresa y completa tu compra!</p>
                `
            });
            console.log('Email de recordatorio enviado');
        } catch (error) {
            console.error('Error al enviar recordatorio:', error);
        }
    }
};

module.exports = emailService;