const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;
const cors = require('cors');
const axios = require('axios');
const recaptchaSecret = '6Lely-IqAAAAAMN5GLU9r5qszx2pRcDwzdjjuM_s';
app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Permite solicitudes desde cualquier origen
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'passwd1',
    database: 'taskDB'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado a MySQL');
});

app.use(express.json());

app.post('/captcha/:token', async (req, res) => {
    const token = req.params.token;
    const params = new URLSearchParams();
    params.append('secret', recaptchaSecret);
    params.append('response', token);

    try {
        const googleResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        res.json(googleResponse.data);
    } catch (error) {
        console.error('Error al verificar reCAPTCHA:', error);
        res.status(500).json({ error: 'Error al verificar reCAPTCHA' });
    }
});

app.get('/task/:id_user', (req, res) => {
    const { id_user } = req.params;
    db.query('SELECT * FROM task WHERE id_user = ?', [id_user], (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


app.post('/task', (req, res) => {
    const newTask = { nombre: req.body.nombre, id_user: req.body.id_user };
    db.query('INSERT INTO task SET ?', newTask, (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, ...newTask });
    });
});


app.delete('/task/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM task WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.sendStatus(204);
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

app.get('/user/:usuario', (req, res) => {
    const { usuario } = req.params;
    db.query('SELECT * FROM user WHERE usuario = ?', [usuario], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json(results[0]); // Devuelve el primer usuario encontrado
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    });
});

app.post('/user', (req, res) => {
    const newUser = { nombre: req.body.nombre, usuario: req.body.usuario, contraseña: req.body.contraseña };
    db.query('INSERT INTO user SET ?', newUser, (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, ...newUser });
    });
});