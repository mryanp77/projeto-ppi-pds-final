const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
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
    const { email } = req.params; // Email atual no parâmetro
    const { username, newEmail, password } = req.body; // Dados enviados pelo cliente

    console.log('Requisição recebida:', { email, body: req.body });

    // Validar se pelo menos um campo foi enviado
    if (!username && !newEmail && !password) {
        return res.status(400).json({ error: 'Pelo menos um campo deve ser fornecido para atualização.' });
    }

    // Verifica se o novo email é igual ao atual
    if (newEmail && newEmail.trim() === email) {
        return res.status(400).json({ error: 'O novo email não pode ser o mesmo que o atual.' });
    }

    // Função para atualizar o usuário no banco
    const updateUser = (currentEmail, fieldsToUpdate, res) => {
        const updates = [];
        const params = [];

        // Monta a query com base nos campos enviados
        if (fieldsToUpdate.username) {
            updates.push('username = ?');
            params.push(fieldsToUpdate.username);
        }
        if (fieldsToUpdate.newEmail) {
            updates.push('email = ?');
            params.push(fieldsToUpdate.newEmail);
        }
        if (fieldsToUpdate.password) {
            updates.push('password = ?');
            params.push(fieldsToUpdate.password);
        }
        params.push(currentEmail); // Email atual para a cláusula WHERE

        const updateQuery = `UPDATE users SET ${updates.join(', ')} WHERE email = ?`;

        db.query(updateQuery, params, (err, results) => {
            if (err) {
                console.error('Erro ao atualizar usuário:', err);
                return res.status(500).json({ error: 'Erro ao atualizar o usuário.' });
            }
            if (results.affectedRows > 0) {
                res.status(200).json({ message: 'Usuário atualizado com sucesso.' });
            } else {
                res.status(404).json({ error: 'Usuário não encontrado.' });
            }
        });
    };

    // Verifica duplicidade de email se newEmail for fornecido
    if (newEmail) {
        const checkEmailQuery = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
        db.query(checkEmailQuery, [newEmail], (err, result) => {
            if (err) {
                console.error('Erro ao verificar o email no banco:', err);
                return res.status(500).json({ error: 'Erro ao verificar o email no banco.' });
            }

            if (result[0] && result[0].count > 0) {
                return res.status(400).json({ error: 'Este email já está em uso.' });
            }

            // Prossegue com a atualização
            updateUser(email, { username, newEmail, password }, res);
        });
    } else {
        // Atualiza diretamente se newEmail não for enviado
        updateUser(email, { username, password }, res);
    }
});


// Função para atualizar dinamicamente o usuário
function updateUser(email, fieldsToUpdate, res) {
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(fieldsToUpdate)) {
        if (value) {
            updates.push(`${key} = ?`);
            values.push(value);
        }
    }
    values.push(email); // Adiciona o email para a cláusula WHERE

    const updateQuery = `UPDATE users SET ${updates.join(', ')} WHERE email = ?`;
    db.query(updateQuery, values, (err, results) => {
        if (err) {
            console.error('Erro ao atualizar o usuário:', err);
            return res.status(500).json({ error: 'Erro ao atualizar o usuário no banco de dados.' });
        }

        if (results.affectedRows > 0) {
            console.log('Usuário atualizado com sucesso:', fieldsToUpdate);
            return res.status(200).json({ message: 'Usuário atualizado com sucesso.' });
        } else {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
    });
}









const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}.`);
});
