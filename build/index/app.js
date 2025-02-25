const tunel = "https://sksq0m94-3000.usw3.devtunnels.ms/";

class Usuario {
    constructor(usuario, contraseña) {
        this.usuario = usuario;
        this.contraseña = contraseña;
    }
}


document.getElementById("myForm").addEventListener("submit", onSubmitForm);

async function onSubmitForm(event) {
    event.preventDefault();
    const token = await grecaptcha.execute('6LcRiuEqAAAAAGk_X2kIeLy7jRNmlFzvPdqn3kYV', { action: 'submit' });
    try {
        const response = await fetch(`${tunel}captcha/${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        });
        const data = await response.json();
        console.log("Respuesta del servidor:", data);
        IniciarSesion();
    } catch (error) {
        console.error("Error al enviar el token:", error);
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
