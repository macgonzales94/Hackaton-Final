const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    telefono: { type: String },
    direccion: {
        calle: { type: String },
        ciudad: { type: String },
        distrito: { type: String },
        codigoPostal: { type: String }
    },
    rol: { type: String, enum: ["cliente", "admin"], default: "cliente" },
    activo: { type: Boolean, default: true }
}, {
    timestamps: true
});

// Método para encriptar la contraseña antes de guardar
usuarioSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Método para comparar contraseñas en login
usuarioSchema.methods.compararPassword = async function (passwordIngresada) {
    return await bcrypt.compare(passwordIngresada, this.password);
};

module.exports = mongoose.model("Usuario", usuarioSchema);
