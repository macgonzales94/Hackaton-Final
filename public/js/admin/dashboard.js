document.addEventListener("DOMContentLoaded", () => {
    const socket = io("http://localhost:5000");

    const chatContainer = document.getElementById("adminChatMessages");

    socket.on("nuevoMensaje", (data) => {
        const mensajeElemento = document.createElement("div");
        mensajeElemento.classList.add("mensaje");
        mensajeElemento.innerHTML = `<strong>Cliente:</strong> ${data.contenido}`;
        chatContainer.appendChild(mensajeElemento);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    });

    socket.on("mensaje_sistema", (data) => {
        const mensajeElemento = document.createElement("div");
        mensajeElemento.classList.add("mensaje", "sistema");
        mensajeElemento.innerHTML = `<strong>Sistema:</strong> ${data.mensaje}`;
        chatContainer.appendChild(mensajeElemento);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    });
});
