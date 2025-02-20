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

    //información del carrito
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

            //carrito para el pedido
            const carritoResponse = await fetch("http://localhost:5000/api/carrito", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
            });

            const carrito = await carritoResponse.json();
            if (!carrito || !carrito.total) {
                alert("Error: No se pudo obtener el total del carrito.");
                return;
            }

            const pedido = {
                productos: carrito.productos,
                total: carrito.total
            };

            // Definir el monto desde el pedido
            const monto = carrito.total;

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
                    },
                    pedido
                })
            });

            const pagoData = await pagoResponse.json();

            // Si el pago tiene `AUT0000`, mostrar `Pop-up` y redirigir a compras
            if (pagoData.pago?.outcome?.code === "AUT0000") {
                mostrarPopUp(pagoData.user_message);
                return;
            }

            alert("Error en el pago");
        } catch (error) {
            console.error("Error al procesar el pago:", error);
        }
    }

    // Función para mostrar el `Pop-up`
    function mostrarPopUp(mensaje) {
        const popUp = document.createElement("div");
        popUp.classList.add("popup-container");
        popUp.innerHTML = `
            <div class="popup">
                <h2>¡Gracias por tu compra! 🎉</h2>
                <p>${mensaje}</p>
                <button onclick="redirigirCompras()">Ir a Productos</button>
            </div>
        `;
        document.body.appendChild(popUp);
    }

    // Redirigir a compras después del mensaje
    function redirigirCompras() {
        window.location.href = "productos.html";
    }

    window.redirigirCompras = redirigirCompras
    
    document.getElementById("btnPagar").addEventListener("click", procesarPago);
    cargarDatosCarrito();
    cargarDatosUsuario();
});