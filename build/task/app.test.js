const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

// Simula el DOM con `jest-environment-jsdom`
beforeAll(() => {
    document.body.innerHTML = '<div id="lista"></div>';
});

const ListaTareas = require('./app').ListaTareas;

describe('Pruebas para ListaTareas', () => {
    const mockTunel = "https://xxm7cmm6-3000.usw3.devtunnels.ms/";
    const userId = "1"; // Simula el ID de usuario

    beforeEach(() => {
        fetch.resetMocks();
    });

    it('Debe crear una nueva tarea correctamente', async () => {
        const nuevaTarea = { nombre: 'Tarea de prueba' };
        const mockResponse = { id: 1, nombre: 'Tarea de prueba', id_user: userId };

        // Simula la respuesta de la API
        fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

        const lista = new ListaTareas();
        const tareaCreada = await lista.Ingresar(nuevaTarea, userId);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            `${mockTunel}task`,
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: nuevaTarea.nombre, id_user: userId }),
            })
        );

        expect(tareaCreada).toEqual(expect.objectContaining({
            id: 1,
            nombre: 'Tarea de prueba',
        }));
    });

    it('Debe manejar errores al crear una tarea', async () => {
        const nuevaTarea = { nombre: 'Tarea de prueba' };

        // Simula un error en la respuesta de la API
        fetch.mockRejectOnce(new Error('Error al guardar la tarea en la API'));

        const lista = new ListaTareas();
        const tareaCreada = await lista.Ingresar(nuevaTarea, userId);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(tareaCreada).toBeUndefined();
    });

    it('Debe listar las tareas correctamente', async () => {
        const mockResponse = [{ id: 1, nombre: 'Tarea 1', id_user: userId }];

        // Simula la respuesta de la API
        fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

        const lista = new ListaTareas();
        await lista.Listar(userId);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(`${mockTunel}task/${userId}`);

        // Verifica que el DOM se haya actualizado correctamente
        const listaElement = document.getElementById('lista').innerHTML;
        expect(listaElement).toContain('Tarea 1');
    });

    it('Debe manejar errores al listar tareas', async () => {
        // Simula un error en la respuesta de la API
        fetch.mockRejectOnce(new Error('Error al cargar las tareas desde la API'));

        const lista = new ListaTareas();
        await lista.Listar(userId);

        expect(fetch).toHaveBeenCalledTimes(1);
    });
});