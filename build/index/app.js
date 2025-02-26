const tunel = "https://sksq0m94-3000.usw3.devtunnels.ms/";

class Usuario {
    constructor(usuario, contraseña) {
        this.usuario = usuario;
        this.contraseña = contraseña;
    }
}

document.getElementById("myForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    if (document.getElementById("recaptchaV2Container").style.display === "block") {
        // Si el reCAPTCHA v2 está visible, validar su respuesta
        let v2Response = grecaptcha.getResponse();
        if (!v2Response) {
            alert("Por favor, completa el reCAPTCHA");
            return;
        }
        validarUsuario(v2Response);
    } else {
        // Ejecutar reCAPTCHA v3 primero
        const token = await grecaptcha.execute('6Lely-IqAAAAAEb2tMSkoger4XlGYTdf8Q0lDRE3', { action: 'submit' });

        try {
            const response = await fetch(`${tunel}captcha/${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            });
            const data = await response.json();
            console.log("Respuesta del servidor:", data);

            if (data.score <= 0.5) {
                // Mostrar reCAPTCHA v2
                alert("Verificación adicional requerida. Por favor, marca el reCAPTCHA.");
                document.getElementById("recaptchaV2Container").style.display = "block";
            } else {
                // Si la puntuación es suficiente, iniciar sesión
                validarUsuario(token);
            }
        } catch (error) {
            console.error("Error al enviar el token:", error);
        }
    }
});

async function validarUsuario(token) {
    let usuario = document.getElementById("usuario").value;
    let contraseña = document.getElementById("contraseña").value;

    let newUsuario = new Usuario(usuario, contraseña);

    try {
        const response = await fetch(`${tunel}user/${newUsuario.usuario}`);
        if (!response.ok) {
            alert("Usuario no encontrado");
            return;
        }

        const usuarioData = await response.json();

        if (usuarioData.contraseña === newUsuario.contraseña) {
            alert("Inicio de sesión exitoso");
            localStorage.setItem("id_user", usuarioData.id);
            location.href = "tasks.html";
        } else {
            alert("Contraseña incorrecta");
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
    }
}

async function IniciarSesion() {
    let usuario = document.getElementById("usuario").value;
    let contraseña = document.getElementById("contraseña").value;
    let newUsuario = new Usuario(usuario, contraseña);

    try {
        const response = await fetch(`${tunel}user/${newUsuario.usuario}`);
        if (!response.ok) {
            alert("Usuario no encontrado");
            return;
        }

        const usuarioData = await response.json();

        if (usuarioData.contraseña === newUsuario.contraseña) {
            alert("Inicio de sesión exitoso");
            localStorage.setItem("id_user", usuarioData.id);
            location.href = "tasks.html";
        } else {
            alert("Contraseña incorrecta");
        }

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
    }
}

function CrearCuenta() {
    location.href = "new_account.html"
}
