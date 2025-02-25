const tunel = "https://sksq0m94-3000.usw3.devtunnels.ms/"

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

    async Ingresar(nuevaTarea) {
        const userId = localStorage.getItem("id_user");
        if (!userId) {
            console.error("Error: el ID de usuario no está en el almacenamiento local.");
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
                console.error("Error al guardar la tarea en la API:", error);
            }
        }
    }


    async Listar() {
        const userId = localStorage.getItem("id_user");
        try {
            const response = await fetch(`${tunel}task/${userId}`);
            const tareas = await response.json();
            let res = "<table><tr><th>No. Tarea</th><th>Nombre</th><th>Eliminar</th></tr>";
            tareas.forEach((tarea, index) => {
                res += `<tr><td>${index + 1}</td><td>${tarea.nombre}</td><td><button type='button' onclick='eliminarTarea(${tarea.id})'>Eliminar</button></td></tr>`;
            });
            document.getElementById("lista").innerHTML = res + "</table>";
        } catch (error) {
            console.error("Error al cargar las tareas desde la API:", error);
        }
    }

    async Eliminar(id) {
        try {
            await fetch(`${tunel}${id}`, { method: "DELETE" });
            this.Listar();
        } catch (error) {
            console.error("Error al eliminar la tarea de la API:", error);
        }
    }
}

let lista = new ListaTareas();
lista.Listar()

function AñadirTarea() {
    let nombre = document.getElementById("input").value;
    if (nombre === "") {
        alert("No se puede ingresar una tarea vacía");
    } else {
        let nuevaTarea = new Tarea(nombre);
        lista.Ingresar(nuevaTarea).then(() => {
            document.getElementById("input").value = "";
            lista.Listar();
        });
    }
}

function eliminarTarea(id) {
    lista.Eliminar(id);
}

function CerrarSesion() {
    localStorage.removeItem("user_id");
    location.href = "index.html";
}

