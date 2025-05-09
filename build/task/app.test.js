const fetchMock = require('jest-fetch-mock');
fetchMock.enableMocks();

global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};

const ListaTareas = require('./app').ListaTareas;

describe('Pruebas para ListaTareas', () => {
    const mockTunel = "https://xxm7cmm6-3000.usw3.devtunnels.ms/";

    beforeEach(() => {
        fetch.resetMocks();
        localStorage.getItem.mockReturnValue('1'); // Simula un ID de usuario en localStorage
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('Debe crear una nueva tarea correctamente', async () => {
        const nuevaTarea = { nombre: 'Tarea de prueba' };
        const mockResponse = { id: 1, nombre: 'Tarea de prueba', id_user: '1' };

        // Simula la respuesta de la API
        fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

        const lista = new ListaTareas();
        const tareaCreada = await lista.Ingresar(nuevaTarea);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(
            `${mockTunel}task`,
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: nuevaTarea.nombre, id_user: '1' }),
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
        const tareaCreada = await lista.Ingresar(nuevaTarea);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(tareaCreada).toBeUndefined();
    });

    it('Debe listar las tareas correctamente', async () => {
        const mockResponse = [
            { id: 1, nombre: 'Tarea 1', id_user: '1' },
            { id: 2, nombre: 'Tarea 2', id_user: '1' },
        ];

        // Simula la respuesta de la API
        fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

        const lista = new ListaTareas();
        await lista.Listar();

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(`${mockTunel}task/1`);
    });

    it('Debe manejar errores al listar tareas', async () => {
        // Simula un error en la respuesta de la API
        fetch.mockRejectOnce(new Error('Error al cargar las tareas desde la API'));

        const lista = new ListaTareas();
        await lista.Listar();

        expect(fetch).toHaveBeenCalledTimes(1);
    });
});