document.getElementById("pagar").addEventListener("click", async function () {
    const datosTarjeta = {
        card_number: document.getElementById("card_number").value,
        cvv: document.getElementById("cvv").value,
        expiration_month: document.getElementById("expiration_month").value,
        expiration_year: document.getElementById("expiration_year").value,
        email: document.getElementById("email").value,
        direccionEnvio: {
            calle: document.getElementById("calle").value,
            ciudad: document.getElementById("ciudad").value,
            distrito: document.getElementById("distrito").value,
            codigoPostal: document.getElementById("codigoPostal").value,
            telefono: document.getElementById("telefono").value
        }
    };

    try {
        const response = await fetch("http://localhost:5000/api/pagos/procesar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(datosTarjeta)
        });

        const resultado = await response.json();
        alert(resultado.mensaje);

    } catch (error) {
        console.error("Error en el pago:", error);
    }
});
