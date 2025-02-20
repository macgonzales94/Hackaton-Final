document.addEventListener("DOMContentLoaded", async function () {
    const btnPagar = document.getElementById("btnPagar");

    // Autocompletar datos del usuario
    async function cargarDatosUsuario() {
        try {
            const respuesta = await fetch("http://localhost:5000/api/usuarios/perfil", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const usuario = await respuesta.json();

            document.getElementById("nombre").value = usuario.nombre;
            document.getElementById("email").value = usuario.email;
            document.getElementById("telefono").value = usuario.telefono || "";
            document.getElementById("calle").value = usuario.direccion?.calle || "";
            document.getElementById("ciudad").value = usuario.direccion?.ciudad || "";
            document.getElementById("distrito").value = usuario.direccion?.distrito || "";
            document.getElementById("codigoPostal").value = usuario.direccion?.codigoPostal || "";
        } catch (error) {
            console.error("Error al cargar datos del usuario:", error);
        }
    }

    // Mostrar información del carrito
    async function cargarDatosCarrito() {
        try {
            const respuesta = await fetch("http://localhost:5000/api/carrito", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const carrito = await respuesta.json();
            
            document.getElementById("carritoId").textContent = carrito._id || "No disponible";
            document.getElementById("subtotal").textContent = `S/. ${carrito.total.toFixed(2)}`;
            document.getElementById("envio").textContent = `S/. ${carrito.envio || 10}`;
            document.getElementById("total").textContent = `S/. ${(carrito.total + (carrito.envio || 10)).toFixed(2)}`;
            
        } catch (error) {
            console.error("Error al cargar datos del carrito:", error);
        }
    }

    // Procesar el pago
    async function procesarPago() {
        try {
            const numeroTarjeta = document.getElementById("numeroTarjeta").value;
            const fechaVencimiento = document.getElementById("fechaVencimiento").value.split("/");
            const cvv = document.getElementById("cvv").value;
            const email = document.getElementById("email").value;
            const monto = 100.00;

            // Generar Token de Tarjeta en el backend
            const tokenResponse = await fetch("http://localhost:5000/api/pagos/generar-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    card_number: numeroTarjeta.replace(/\s+/g, ""),
                    cvv,
                    expiration_month: fechaVencimiento[0],
                    expiration_year: "20" + fechaVencimiento[1],
                    email
                })
            });

            const tokenData = await tokenResponse.json();
            if (!tokenData.token) {
                alert("Error al generar el token de la tarjeta");
                return;
            }

            // Procesar el pago en el backend
            const pagoResponse = await fetch("http://localhost:5000/api/pagos/procesar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token: tokenData.token,
                    email,
                    monto,
                    direccionEnvio: {
                        calle: document.getElementById("calle").value,
                        ciudad: document.getElementById("ciudad").value,
                        distrito: document.getElementById("distrito").value,
                        codigoPostal: document.getElementById("codigoPostal").value,
                        telefono: document.getElementById("telefono").value
                    }
                })
            });

            const pagoData = await pagoResponse.json();
            if (!pagoData.pago || pagoData.pago.status !== "paid") {
                alert("Error en el pago");
                return;
            }

            window.location.href = "confirmacion.html";
        } catch (error) {
            console.error("Error al procesar el pago:", error);
        }
    }

    btnPagar.addEventListener("click", procesarPago);
    cargarDatosCarrito();
    cargarDatosUsuario();
});
