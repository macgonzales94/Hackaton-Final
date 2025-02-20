document.addEventListener("DOMContentLoaded", () => {
    const socket = io("http://localhost:5000", { transports: ["websocket", "polling"] });

    const btnAbrirChat = document.getElementById("btnAbrirChat"); // Botón de abrir chat
    const contenedorChat = document.getElementById("contenedorChat"); // Contenedor del chat
    const chatHeader = document.querySelector(".chat-header h3");
    const chatMessages = document.getElementById("chatMessages");
    const messageInput = document.getElementById("messageInput");
    const sendMessageBtn = document.getElementById("sendMessageBtn");

    // ✅ Agregar un console.log para depurar si el botón de chat funciona
    btnAbrirChat.addEventListener("click", () => {
        console.log("Botón de chat clickeado");

        // Alternar visibilidad del chat
        contenedorChat.classList.toggle("mostrar");
    });

    // ✅ También aseguramos que se detecta correctamente el botón en la consola
    console.log("btnAbrirChat detectado:", btnAbrirChat);

    // Obtener el token del usuario (si está autenticado)
    const token = localStorage.getItem("token");

    // Iniciar chat con el token para identificar al usuario
    socket.emit("iniciarChat", token);

    // Recibir mensaje de bienvenida
    socket.on("mensaje_sistema", (data) => {
        chatHeader.textContent = data.isAuthenticated
            ? `Chat con Bellisima - ${data.userName}`
            : "Chat con Bellisima";
        agregarMensaje("sistema", data.mensaje);
    });

    // Evento para recibir mensajes
    socket.on("nuevoMensaje", (data) => {
        agregarMensaje("usuario", data.contenido);
    });

    // Evento para enviar mensajes
    sendMessageBtn.addEventListener("click", () => {
        enviarMensaje();
    });

    messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            enviarMensaje();
        }
    });

    function enviarMensaje() {
        const mensaje = messageInput.value.trim();
        if (!mensaje) return;

        socket.emit("enviarMensaje", { contenido: mensaje });

        agregarMensaje("yo", mensaje);
        messageInput.value = "";
    }

    function agregarMensaje(tipo, mensaje) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", tipo);
        messageElement.innerHTML = `<span>${mensaje}</span>`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
