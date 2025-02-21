const API_URL = "https://hackaton-final-n7s2.onrender.com"; 


document.addEventListener("DOMContentLoaded", function () {
    const productosContainer = document.getElementById("productosContainer");
    const resumenSubtotal = document.getElementById("subtotal");
    const resumenEnvio = document.getElementById("envio");
    const resumenTotal = document.getElementById("total");
    const btnProcederPago = document.getElementById("btnProcederPago");
    const authModal = document.getElementById("authModal");
    const loginForm = document.getElementById("loginForm");
    const registroForm = document.getElementById("registroForm");
    const btnLogin = document.getElementById("btnLogin");
    const btnRegistro = document.getElementById("btnRegistro");
    
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    async function obtenerProductos() {
        try {
            const respuesta = await fetch(`${API_URL}/api/productos`);
            const productos = await respuesta.json();
            console.log("Productos obtenidos:", productos);
            mostrarProductos(productos);
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }
    }

    function mostrarProductos(productos) {
        if (!productos || productos.length === 0) {
            console.warn("No hay productos para mostrar.");
            return;
        }
    
        productosContainer.innerHTML = "";
        productos.forEach(producto => {
            console.log("Mostrando producto:", producto.nombre); // <-- Para verificar
            const productoCard = document.createElement("div");
            productoCard.classList.add("producto-card");
    
            productoCard.innerHTML = `
                <img src="${producto.imagenes?.[0]?.url || 'assets/images/placeholder.png'}" alt="${producto.nombre}" class="producto-imagen">
                <div class="producto-info">
                    <h3 class="producto-nombre">${producto.nombre}</h3>
                    <p class="producto-precio">S/. ${producto.precio.toFixed(2)}</p>
                    <button class="btn-agregar" data-id="${producto._id}">Agregar al carrito</button>
                </div>
            `;
            productosContainer.appendChild(productoCard);
        });
    
        document.querySelectorAll(".btn-agregar").forEach(boton => {
            boton.addEventListener("click", agregarAlCarrito);
        });
    }

    function agregarAlCarrito(event) {
        const productoId = event.target.dataset.id;
        const producto = carrito.find(item => item.id === productoId);

        if (producto) {
            producto.cantidad++;
        } else {
            carrito.push({ id: productoId, cantidad: 1 });
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarResumenCompra();
    }

    function actualizarResumenCompra() {
        let subtotal = 0;
        carrito.forEach(item => {
            subtotal += item.cantidad * 20; // Precio ficticio, reemplazar con datos reales
        });
        const envio = subtotal > 0 ? 10 : 0;
        const total = subtotal + envio;

        resumenSubtotal.textContent = `S/. ${subtotal.toFixed(2)}`;
        resumenEnvio.textContent = `S/. ${envio.toFixed(2)}`;
        resumenTotal.textContent = `S/. ${total.toFixed(2)}`;
    }

    btnProcederPago.addEventListener("click", function () {
        const usuarioToken = localStorage.getItem("token");
        if (!usuarioToken) {
            authModal.style.display = "block";
        } else {
            enviarCarritoAlServidor();
        }
    });

    btnLogin.addEventListener("click", function () {
        loginForm.style.display = "block";
        registroForm.style.display = "none";
    });

    btnRegistro.addEventListener("click", function () {
        loginForm.style.display = "none";
        registroForm.style.display = "block";
    });

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            const respuesta = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const resultado = await respuesta.json();
            if (resultado.token) {
                localStorage.setItem("token", resultado.token);
                enviarCarritoAlServidor();
            }
        } catch (error) {
            console.error("Error en login:", error);
        }
    });

    registroForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const formData = {
            nombre: document.getElementById('regNombre').value,
            email: document.getElementById('regEmail').value,
            password: document.getElementById('regPassword').value,
            telefono: document.getElementById('regTelefono').value
        }
        
        try {
            const respuesta = await fetch(`${API_URL}/api/auth/registro`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const resultado = await respuesta.json();
            if (resultado.token) {
                localStorage.setItem("token", resultado.token);
                enviarCarritoAlServidor();
            }
        } catch (error) {
            console.error("Error en registro:", error);
        }
    });

    async function enviarCarritoAlServidor() {
        try {
            await fetch(`${API_URL}/api/carrito/sincroniza`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ productos: carrito })
            });
            localStorage.removeItem("carrito");
            await procesarPago();
        } catch (error) {
            console.error("Error al sincronizar carrito:", error);
        }
    }

    async function procesarPago() {
        try {
            const respuesta = await fetch(`${API_URL}/api/carrito/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const carrito = await respuesta.json();
            if (!carrito || carrito.productos.length === 0) {
                alert("El carrito está vacío");
                return;
            }
            const totalEnCentavos = Math.round(carrito.total * 100);
            if (totalEnCentavos > 9999900 || totalEnCentavos <= 0) {
                alert("El total de la compra es inválido.");
                return;
            }

            const nuevoPedido = await fetch(`${API_URL}/api/pedidos/crear`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    direccionEnvio: {
                        calle: "Av. Primavera",
                        ciudad: "Lima",
                        distrito: "Surco",
                        codigoPostal: "15039",
                        telefono: "987654321"
                    }
                })
            });
            window.location.href = 'checkout.html';
            const pedido = await nuevoPedido.json();
            console.log("Pedido registrado:", pedido);
        } catch (error) {
            console.error("Error al procesar el pago:", error);
        }
    }

    obtenerProductos();
    //actualizarResumenCompra();
});
