const tunel = "https://xxm7cmm6-3000.usw3.devtunnels.ms/";

class Tarea {
    constructor(nombre) {
        this.id = Date.now();
        this.nombre = nombre;
        this.siguiente = null;
        this.anterior = null;
    }
}

class ListaTareas {
    constructor() {
        this.primero = null;
        this.ultimo = null;
    }

    async Ingresar(nuevaTarea, userId) {
        if (!userId) {
            console.error("Error: el ID de usuario no fue proporcionado.");
            return;
        }
        if (nuevaTarea.nombre === "") {
            return null;
        } else {
            try {
                const response = await fetch(`${tunel}task`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre: nuevaTarea.nombre, id_user: userId })
                });
                const data = await response.json();
                nuevaTarea.id = data.id;
                return nuevaTarea;
            } catch (error) {
                //console.error("Error al guardar la tarea en la API:", error);
            }
        }
    }

    async obtenerTareas(userId) {
        if (!userId) {
            console.error("Error: el ID de usuario no fue proporcionado.");
            return [];
        }
        const response = await fetch(`${tunel}task/${userId}`);
        return await response.json();
    }

    async Listar(userId) {
        try {
            const tareas = await this.obtenerTareas(userId);
            let res = "<table><tr><th>No. Tarea</th><th>Nombre</th><th>Eliminar</th></tr>";
            tareas.forEach((tarea, index) => {
                res += `<tr><td>${index + 1}</td><td>${tarea.nombre}</td><td><button type='button' onclick='eliminarTarea(${tarea.id}, "${userId}")'>Eliminar</button></td></tr>`;
            });
            document.getElementById("lista").innerHTML = res + "</table>";
        } catch (error) {
           //console.log("Error al cargar las tareas desde la API:", error);
        }
    }

    async Eliminar(id, userId) {
        if (!userId) {
            console.error("Error: el ID de usuario no fue proporcionado.");
            return;
        }
        try {
            const response = await fetch(`${tunel}task/${id}?id_user=${userId}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al eliminar la tarea");
            }

            this.Listar(userId);
        } catch (error) {
            console.error("Error al eliminar la tarea de la API:", error);
        }
    }
}

// Simula el ID de usuario (puedes reemplazarlo con un valor dinámico)
const userId = "1";

let lista = new ListaTareas();
lista.Listar(userId);

function AñadirTarea() {
    let nombre = document.getElementById("input").value;
    if (nombre === "") {
        alert("No se puede ingresar una tarea vacía");
    } else {
        let nuevaTarea = new Tarea(nombre);
        lista.Ingresar(nuevaTarea, userId).then(() => {
            document.getElementById("input").value = "";
            lista.Listar(userId);
        });
    }
}

function eliminarTarea(id, userId) {
    lista.Eliminar(id, userId);
}

function CerrarSesion() {
    console.log("Sesión cerrada");
    location.href = "index.html";
}

module.exports = { ListaTareas };