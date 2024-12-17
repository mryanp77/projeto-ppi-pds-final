const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const connection = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// ================= Rota para registrar usuário ===================
app.post("/api/register", (req, res) => {
  const { username, email, password } = req.body;
  const query =
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  db.query(query, [username, email, password], (err, result) => {
    if (err) {
      console.error("Erro ao registrar usuário:", err);
      res.status(500).json({ error: "Erro ao registrar usuário." });
    } else {
      res.status(200).json({ message: "Usuário registrado com sucesso!" });
    }
  });
});

// ========================= Rota para login ================================
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";

  // Verifica as credenciais do usuário no banco de dados
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Erro ao fazer login:", err);
      return res.status(500).json({ error: "Erro ao fazer login." });
    }

    // Se as credenciais forem válidas
    if (results.length > 0) {
      const user = results[0]; // O primeiro usuário encontrado

      // Atualiza o campo last_login para o momento atual
      const updateLoginQuery =
        "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = ?";
      db.query(updateLoginQuery, [email], (err, updateResult) => {
        if (err) {
          console.error("Erro ao atualizar o last_login:", err);
          return res
            .status(500)
            .json({ error: "Erro ao atualizar o último login." });
        }

        // Retorna as informações do usuário, incluindo data de registro e último login
        res.status(200).json({
          message: "Login bem-sucedido!",
          user: {
            username: user.username,
            email: user.email,
            createdAt: user.created_at, // Data de registro
            lastLogin: user.last_login, // Último login
          },
        });
      });
    } else {
      // Se as credenciais forem inválidas
      res.status(401).json({ error: "Credenciais inválidas." });
    }
  });
});

// ===================== Rota para obter o nome do usuário logado ====================
app.get("/api/user/:email", (req, res) => {
  const { email } = req.params;
  const query = "SELECT username, email FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Erro ao buscar dados do usuário:", err);
      res.status(500).json({ error: "Erro ao buscar dados do usuário." });
    } else if (results.length > 0) {
      res.status(200).json({
        username: results[0].username,
        email: results[0].email,
      });
    } else {
      res.status(404).json({ error: "Usuário não encontrado." });
    }
  });
});

// ===================== Rota para atualizar o usuário ====================
app.put("/api/user/:email", (req, res) => {
  const { email } = req.params; // Email atual no parâmetro
  const { username, newEmail, password } = req.body; // Dados enviados pelo cliente

  // Validar se pelo menos um campo foi enviado
  if (!username && !newEmail && !password) {
    return res.status(400).json({
      error: "Pelo menos um campo deve ser fornecido para atualização.",
    });
  }

  // Verifica se o novo email é igual ao atual
  if (newEmail && newEmail.trim() === email) {
    return res
      .status(400)
      .json({ error: "O novo email não pode ser o mesmo que o atual." });
  }

  // Verifica duplicidade de email se newEmail for fornecido
  if (newEmail) {
    const checkEmailQuery =
      "SELECT COUNT(*) AS count FROM users WHERE email = ?";
    db.query(checkEmailQuery, [newEmail], (err, result) => {
      if (err) {
        console.error("Erro ao verificar o email no banco:", err);
        return res
          .status(500)
          .json({ error: "Erro ao verificar o email no banco." });
      }

      if (result[0] && result[0].count > 0) {
        return res.status(400).json({ error: "Este email já está em uso." });
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

  const updateQuery = `UPDATE users SET ${updates.join(", ")} WHERE email = ?`;
  db.query(updateQuery, values, (err, results) => {
    if (err) {
      console.error("Erro ao atualizar o usuário:", err);
      return res
        .status(500)
        .json({ error: "Erro ao atualizar o usuário no banco de dados." });
    }

    if (results.affectedRows > 0) {
      console.log("Usuário atualizado com sucesso:", fieldsToUpdate);
      return res
        .status(200)
        .json({ message: "Usuário atualizado com sucesso." });
    } else {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
  });
}

// CHANGE USERNAME
// ========================= Rota para alterar o nome de usuário ================================
app.post("/api/change-username", (req, res) => {
  const { email, password, newUsername } = req.body;

  // Verifica se o email e senha correspondem ao usuário
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Erro ao verificar as credenciais:", err);
      return res
        .status(500)
        .json({ error: "Erro ao verificar as credenciais." });
    }

    if (results.length > 0) {
      // Atualiza o nome de usuário no banco de dados
      const updateQuery = "UPDATE users SET username = ? WHERE email = ?";
      db.query(updateQuery, [newUsername, email], (err, updateResult) => {
        if (err) {
          console.error("Erro ao atualizar o nome de usuário:", err);
          return res
            .status(500)
            .json({ error: "Erro ao atualizar o nome de usuário." });
        }

        res
          .status(200)
          .json({ message: "Nome de usuário alterado com sucesso!" });
      });
    } else {
      res.status(401).json({ error: "Credenciais inválidas." });
    }
  });
});

// CHANGE EMAIL
app.post("/api/change-email", (req, res) => {
  const { email, password, newEmail } = req.body;

  // Verifica se o email e senha correspondem ao usuário
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Erro ao verificar as credenciais:", err);
      return res
        .status(500)
        .json({ error: "Erro ao verificar as credenciais." });
    }

    if (results.length > 0) {
      // Atualiza o email no banco de dados
      const updateQuery = "UPDATE users SET email = ? WHERE email = ?";
      db.query(updateQuery, [newEmail, email], (err, updateResult) => {
        if (err) {
          console.error("Erro ao atualizar o email:", err);
          return res.status(500).json({ error: "Erro ao atualizar o email." });
        }

        res.status(200).json({ message: "Email alterado com sucesso!" });
      });
    } else {
      res.status(401).json({ error: "Credenciais inválidas." });
    }
  });
});

// CHANGE PASSWORD
app.put("/api/change-password", (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  const query = "SELECT password FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Erro ao buscar senha:", err);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }

    if (results.length === 0 || results[0].password !== currentPassword) {
      return res.status(401).json({ error: "Senha atual incorreta." });
    }

    const updateQuery = "UPDATE users SET password = ? WHERE email = ?";
    db.query(updateQuery, [newPassword, email], (err) => {
      if (err) {
        console.error("Erro ao atualizar senha:", err);
        return res.status(500).json({ error: "Erro ao atualizar a senha." });
      }

      res.status(200).json({ message: "Senha alterada com sucesso!" });
    });
  });
});

app.post("/api/lists", (req, res) => {
  const { name, description, games, user_email } = req.body;

  if (!user_email) {
    return res.status(400).json({ error: "Usuário não autenticado." });
  }

  // Recuperar o user_id com base no email
  const getUserIdQuery = "SELECT id FROM users WHERE email = ?";
  db.query(getUserIdQuery, [user_email], (err, result) => {
    if (err || result.length === 0) {
      return res.status(400).json({ error: "Usuário não encontrado." });
    }

    const userId = result[0].id; // Recupera o ID do usuário a partir do email

    // Inserir a lista no banco de dados
    const insertListQuery =
      "INSERT INTO lists (name, description, user_id) VALUES (?, ?, ?)";
    db.query(insertListQuery, [name, description, userId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao salvar lista." });
      }

      const listId = result.insertId;
      const gameValues = games.map((game) => [
        listId,
        game.id,
        game.name,
        game.background_image,
      ]);

      const insertGamesQuery =
        "INSERT INTO list_games (list_id, game_id, game_name, background_image) VALUES ?";
      db.query(insertGamesQuery, [gameValues], (err) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Erro ao salvar jogos da lista." });
        }

        res.status(200).json({ message: "Lista criada com sucesso!" });
      });
    });
  });
});

app.get("/api/lists", (req, res) => {
  const userEmail = req.query.user_email; // Obtendo o email do usuário da query

  if (!userEmail) {
    return res.status(400).send("Email do usuário não fornecido");
  }

  // Aqui, você precisa buscar o user_id a partir do email
  const queryUserId = "SELECT id FROM users WHERE email = ?";

  connection.query(queryUserId, [userEmail], (error, results) => {
    if (error) {
      console.error("Erro ao buscar o user_id:", error);
      return res.status(500).send("Erro ao buscar o user_id");
    }

    if (results.length === 0) {
      return res.status(404).send("Usuário não encontrado");
    }

    const userId = results[0].id; // Pegando o user_id do resultado

    // Agora você pode usar o user_id para buscar as listas
    const queryLists = "SELECT * FROM lists WHERE user_id = ?";

    connection.query(queryLists, [userId], (error, lists) => {
      if (error) {
        console.error("Erro ao buscar listas:", error);
        return res.status(500).send("Erro ao buscar listas");
      }

      res.json(lists); // Retorna as listas do usuário
    });
  });
});

// Requisição para buscar listas com base no user_id
app.get("/api/lists", (req, res) => {
  const userEmail = req.query.user_email; // Obtendo o email do usuário da query

  if (!userEmail) {
    return res.status(400).send("Email do usuário não fornecido");
  }

  // Aqui, você precisa buscar o user_id a partir do email
  const queryUserId = "SELECT id FROM users WHERE email = ?";

  connection.query(queryUserId, [userEmail], (error, results) => {
    if (error) {
      console.error("Erro ao buscar o user_id:", error);
      return res.status(500).send("Erro ao buscar o user_id");
    }

    if (results.length === 0) {
      return res.status(404).send("Usuário não encontrado");
    }

    const userId = results[0].id; // Pegando o user_id do resultado

    // Agora você pode usar o user_id para buscar as listas
    const queryLists = "SELECT * FROM lists WHERE user_id = ?";

    connection.query(queryLists, [userId], (error, lists) => {
      if (error) {
        console.error("Erro ao buscar listas:", error);
        return res.status(500).send("Erro ao buscar listas");
      }

      res.json(lists); // Retorna as listas do usuário
    });
  });
});

// Exemplo de código no seu backend, por exemplo, em server.js
app.get("/api/list-details/:listId", (req, res) => {
  const listId = req.params.listId;

  // Primeira consulta: obter os detalhes da lista
  const query = "SELECT name, description FROM lists WHERE id = ?";
  connection.query(query, [listId], (err, result) => {
    if (err) {
      console.error("Erro ao buscar lista:", err);
      return res.status(500).send("Erro ao buscar lista");
    }

    // Se a lista for encontrada, buscar os jogos associados
    const list = result[0];

    const queryGames =
      "SELECT game_id, game_name, background_image FROM list_games WHERE list_id = ?";
    connection.query(queryGames, [listId], (err, games) => {
      if (err) {
        console.error("Erro ao buscar jogos:", err);
        return res.status(500).send("Erro ao buscar jogos");
      }

      // Retornar os detalhes da lista junto com os jogos
      res.json({
        name: list.name,
        description: list.description,
        games: games,
      });
    });
  });
});

app.put("/api/lists/update-list/:id", (req, res) => {
  const listId = req.params.id;
  const { name, description, games } = req.body;

  // Query para atualizar a lista
  const query = "UPDATE lists SET name = ?, description = ? WHERE id = ?";

  db.query(query, [name, description, listId], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar a lista:", err);
      return res.status(500).json({ error: "Erro ao atualizar a lista" });
    }

    // Confirma se houve uma atualização
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Lista não encontrada" });
    }

    res.json({ message: "Lista atualizada com sucesso!" });
  });
});

// Rota para adicionar um jogo à lista
app.post("/api/lists/add-game-to-list", (req, res) => {
  const { listId, gameId, gameName, backgroundImage } = req.body;

  // Verifica se todos os parâmetros estão presentes
  if (!listId || !gameId || !gameName || !backgroundImage) {
    return res.status(400).json({ message: "Todos os dados são necessários!" });
  }

  // Insere a associação entre a lista e o jogo na tabela list_games
  const query = `INSERT INTO list_games (list_id, game_id, game_name, background_image) 
                   VALUES (?, ?, ?, ?)`;

  db.query(
    query,
    [listId, gameId, gameName, backgroundImage],
    (err, result) => {
      if (err) {
        console.error("Erro ao adicionar jogo à lista:", err);
        return res
          .status(500)
          .json({ message: "Erro ao adicionar jogo à lista!" });
      }

      res.status(200).json({ message: "Jogo adicionado à lista!" });
    }
  );
});

// Rota para remover um jogo da lista
app.delete("/api/lists/remove-game/:listId/:gameId", (req, res) => {
  const { listId, gameId } = req.params;

  // Verifica se o listId e gameId estão presentes
  if (!listId || !gameId) {
    return res.status(400).json({ message: "Parâmetros inválidos!" });
  }

  // Deleta a associação entre a lista e o jogo na tabela list_games
  const query = `DELETE FROM list_games WHERE list_id = ? AND game_id = ?`;

  db.query(query, [listId, gameId], (err, result) => {
    if (err) {
      console.error("Erro ao remover jogo da lista:", err);
      return res
        .status(500)
        .json({ message: "Erro ao remover jogo da lista!" });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Jogo removido da lista!" });
    } else {
      return res.status(404).json({ message: "Jogo não encontrado na lista!" });
    }
  });
});

app.get("/api/lists/search-games", (req, res) => {
  const query = req.query.query; // Parâmetro de busca do frontend

  if (!query) {
    return res.status(400).send("Parâmetro de busca não fornecido");
  }

  // Consulta SQL para buscar os jogos baseados no nome
  const sql = "SELECT * FROM list_games WHERE game_name LIKE ?";
  const searchParam = `%${query}%`; // Monta o parâmetro com % para busca parcial

  db.query(sql, [searchParam], (err, results) => {
    if (err) {
      console.error("Erro ao executar consulta SQL:", err);
      return res.status(500).send("Erro ao buscar jogos no banco de dados");
    }
    res.json(results); // Retorna os resultados encontrados
  });
});

// Inicialização do servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}.`);
});
