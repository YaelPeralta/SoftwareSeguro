const tunel = "https://sksq0m94-3000.usw3.devtunnels.ms/";

class Usuario{
    constructor(nombre, usuario, contraseña){
        this.nombre = nombre;
        this.usuario = usuario;
        this.contraseña = contraseña;
    }
}

document.getElementById("myForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    if (document.getElementById("recaptchaV2Container").style.display === "block") {
        let v2Response = grecaptcha.getResponse();
        if (!v2Response) {
            alert("Por favor, completa el reCAPTCHA");
            return;
        }
        crearUsuario(v2Response);
    } else {
        // Ejecutar reCAPTCHA v3
        const token = await grecaptcha.execute('6Lely-IqAAAAAEb2tMSkoger4XlGYTdf8Q0lDRE3', { action: 'submit' });

        try {
            const response = await fetch(`${tunel}captcha/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            });
            const data = await response.json();
            console.log("Respuesta del servidor:", data);

            if (data.score <= 0.95) {
                alert("Verificación adicional requerida. Por favor, marca el reCAPTCHA.");
                document.getElementById("recaptchaV2Container").style.display = "block";
            } else {
                crearUsuario(token);
            }
        } catch (error) {
            console.error("Error al enviar el token:", error);
        }
    }
});

async function crearUsuario(token) {
    let nombre = document.getElementById("nombre").value;
    let usuario = document.getElementById("usuario").value;
    let contraseña = document.getElementById("Contraseña").value;

    let newUser = new Usuario(nombre, usuario, contraseña);

    if (nombre && usuario && contraseña) {
        try {
            const response = await fetch(`${tunel}user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre: newUser.nombre, usuario: newUser.usuario, contraseña: newUser.contraseña })
            });
            const data = await response.json();
            localStorage.setItem("id_user", data.id);
            alert("Usuario creado con éxito");
            location.href = "tasks.html";
        } catch (error) {
            console.error("Error al crear usuario:", error);
        }
    } else {
        alert("Por favor, ingresa todos los datos.");
    }
}

function Cancelar() {
    location.href = "index.html";
}
