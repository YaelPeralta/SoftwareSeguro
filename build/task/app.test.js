/**
 * @jest-environment jsdom
 */

const { ListaTareas, AñadirTarea } = require("./app");

global.fetch = require("jest-fetch-mock");

describe("AñadirTarea y Listar", () => {
    let lista;
    const userId = "1";

    beforeEach(() => {
        document.body.innerHTML = `
      <input id="input" />
      <div id="lista"></div>
    `;
        lista = new ListaTareas();
        fetch.resetMocks();
    });

    test("No debe permitir tareas vacías", async () => {
        document.getElementById("input").value = "";
        const alertMock = jest.spyOn(window, "alert").mockImplementation(() => { });
        await AñadirTarea();
        expect(alertMock).toHaveBeenCalledWith("No se puede ingresar una tarea vacía");
        alertMock.mockRestore();
    });

    test("Debe añadir una tarea correctamente", async () => {
        const mockTarea = { id: 123, nombre: "Tarea prueba" };
        fetch.mockResponseOnce(JSON.stringify({ id: mockTarea.id }));

        document.getElementById("input").value = mockTarea.nombre;
        await lista.Ingresar(mockTarea, userId);

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("task"),
            expect.objectContaining({
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre: mockTarea.nombre, id_user: userId })
            })
        );
    });

    test("Debe listar tareas en el DOM", async () => {
        const tareas = [{ id: 1, nombre: "Primera tarea" }, { id: 2, nombre: "Otra tarea" }];
        fetch.mockResponseOnce(JSON.stringify(tareas));

        await lista.Listar(userId);
        const tabla = document.getElementById("lista").innerHTML;

        expect(tabla).toContain("Primera tarea");
        expect(tabla).toContain("Otra tarea");
        expect(tabla).toContain("<table>");
    });
});
