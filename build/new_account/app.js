const tunel = "https://sksq0m94-3000.usw3.devtunnels.ms/";

class Usuario{
    constructor(nombre, usuario, contraseña){
        this.nombre = nombre;
        this.usuario = usuario;
        this.contraseña = contraseña;
    }
}

function Cancelar() {
    location.href = "index.html";
}

async function AñadirUsuario() {
    let nombre = document.getElementById("nombre").value;
    let usuario = document.getElementById("usuario").value;
    let contraseña = document.getElementById("Contraseña").value;

    let newUser = new Usuario(nombre,usuario,contraseña);

    if (nombre != "" && nombre != null && usuario != "" && usuario != null && contraseña != "" && contraseña != null) {
        try {
            const response = await fetch(`${tunel}user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre: newUser.nombre, usuario: newUser.usuario, contraseña: newUser.contraseña })
            });
            const data = await response.json();
            localStorage.setItem("id_user", data.id);
            alert("Usuario creado con exito");
            location.href = "tasks.html";
        } catch (error) {
            console.error("Error al crear un usuario en la API:", error);
        }
    } else {
        alert("Ingresar todos los datos por favor");
    }
}