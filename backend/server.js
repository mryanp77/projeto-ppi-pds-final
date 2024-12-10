const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ================= Rota para registrar usuário ===================
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, password], (err, result) => {
        if (err) {
            console.error('Erro ao registrar usuário:', err);
            res.status(500).json({ error: 'Erro ao registrar usuário.' });
        } else {
            res.status(200).json({ message: 'Usuário registrado com sucesso!' });
        }
    });
});


// ========================= Rota para login ================================
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Erro ao fazer login:', err);
            res.status(500).json({ error: 'Erro ao fazer login.' });
        } else if (results.length > 0) {
            res.status(200).json({ message: 'Login bem-sucedido!' });
        } else {
            res.status(401).json({ error: 'Credenciais inválidas.' });
        }
    });
});


// ===================== Rota para obter o nome do usuário logado ====================
app.get('/api/user/:email', (req, res) => {
    const { email } = req.params;
    const query = 'SELECT username FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Erro ao buscar nome do usuário:', err);
            res.status(500).json({ error: 'Erro ao buscar nome do usuário.' });
        } else if (results.length > 0) {
            res.status(200).json({ username: results[0].username });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado.' });
        }
    });
});





const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}.`);
});
