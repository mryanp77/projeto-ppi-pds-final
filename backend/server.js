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
    const query = 'SELECT username, email FROM users WHERE email = ?';  // Certifique-se de que o email está sendo retornado
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error('Erro ao buscar dados do usuário:', err);
            res.status(500).json({ error: 'Erro ao buscar dados do usuário.' });
        } else if (results.length > 0) {
            res.status(200).json({
                username: results[0].username,
                email: results[0].email  // Inclua o email na resposta
            });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado.' });
        }
    });
});


// ===================== Rota para atualizar o usuário ====================
app.put('/api/user/:email', (req, res) => {
    const { email } = req.params; // Obtém o e-mail do parâmetro da URL
    const { username, newEmail, password } = req.body; // Obtém os dados atualizados do corpo da requisição

    // Verificar se username e newEmail estão preenchidos
    if (!username || !newEmail || !password) {
        return res.status(400).json({ error: 'Nome de usuário, email e senha são obrigatórios!' });
    }

    // Verifica se o novo email não está vazio
    if (newEmail.trim() === '') {
        return res.status(400).json({ error: 'Email não pode ser vazio!' });
    }

    // Verifica se o novo email é diferente do email atual
    if (newEmail === email) {
        return res.status(400).json({ error: 'O novo email não pode ser o mesmo que o atual!' });
    }

    // Verificar se o email já existe no banco de dados (verificação de duplicidade)
    const checkEmailQuery = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
    db.query(checkEmailQuery, [newEmail], (err, result) => {
        if (err) {
            console.error('Erro ao verificar o email no banco:', err);
            return res.status(500).json({ error: 'Erro ao verificar o email.' });
        }

        // Se já existir um usuário com o mesmo email, retornar erro
        if (result[0].count > 0) {
            return res.status(400).json({ error: 'Este email já está em uso.' });
        }

        // Atualiza os dados do usuário no banco de dados
        const updateQuery = 'UPDATE users SET username = ?, email = ?, password = ? WHERE email = ?';
        db.query(updateQuery, [username, newEmail, password, email], (err, results) => {
            if (err) {
                console.error('Erro ao atualizar o usuário:', err);
                return res.status(500).json({ error: 'Erro ao atualizar o usuário.' });
            }

            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Usuário atualizado com sucesso.' });
            } else {
                res.status(404).json({ error: 'Usuário não encontrado.' });
            }
        });
    });
});








const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}.`);
});
