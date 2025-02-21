require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const conectarBaseDatos = require("./config/database");

const app = express();
const server = http.createServer(app);

// Configurar WebSockets con `Socket.io`
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
conectarBaseDatos();

// Configurar archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rutas de prueba
app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente");
});
app.use("/api/auth", require("./routes/auth"));
app.use("/api/carrito", require("./routes/carrito"));
app.use("/api/productos", require("./routes/productos"));
app.use("/api/pagos", require("./routes/pagos"));
app.use("/api/pedidos", require("./routes/pedidos"));
app.use("/api/chat", require("./routes/chat")); 

// Manejo de WebSockets para el Chat
io.on("connection", (socket) => {
    console.log("Usuario conectado al chat:", socket.id);

    socket.on("enviarMensaje", async (data) => {
        console.log("Mensaje recibido:", data);
        io.emit("nuevoMensaje", data);
    });

    socket.on("disconnect", () => {
        console.log("Usuario desconectado del chat:", socket.id);
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});