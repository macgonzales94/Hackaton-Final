require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const conectarBaseDatos = require("./config/database");

// Crear la aplicación Express
const app = express();

// Configurar middleware
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
conectarBaseDatos();

app.use(express.static(path.join(__dirname, "public")));

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente");
});
app.get("/productos", (req, res) => {
    res.sendFile(path.join(__dirname, "public/productos.html"));
});
app.get("/carrito", (req, res) => {
    res.sendFile(path.join(__dirname, "public/carrito.html"));
});
app.get("/checkout", (req, res) => {
    res.sendFile(path.join(__dirname, "public/checkout.html"));
});
app.get("/contacto", (req, res) => {
    res.sendFile(path.join(__dirname, "public/contacto.html"));
});


app.use("/api/auth", require("./routes/auth"));
app.use("/api/carrito", require("./routes/carrito"));
app.use("/api/productos", require("./routes/productos"));
app.use("/api/pagos", require("./routes/pagos"));
app.use("/api/pedidos", require("./routes/pedidos"));

// Definir puerto y escuchar
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
