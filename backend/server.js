// ======================================================================================================================================
// EXPRESS: CRIAR E GERENCIAR O SERVIDOR HTTP E AS ROTAS
const express = require("express");

// CORS: COMPARTILHAR RECURSOS ENTRE DOMÍNIOS. PERMITE ACESSO EM VÁRIAS FONTES
const cors = require("cors");

// BODYPARSER: LEITURA DOS "BODIES" DAS REQUISIÇÕES HTTP (JSON OU FORMS)
const bodyParser = require("body-parser");

// DB: IMPORTAR AS CONFIGURAÇÕES E INFORMAÇÕES DO DB QUE ESTÃO NO DB.JS
const db = require("./db");

// AXIOS: FAZER REQUISIÇÕES HTTP, COMUNICAR COM API'S EXTERNOS, ENVIAR E RECEBER DADOS ENTRE O SERVIDOR
const axios = require("axios");

// MULTER: LIDAR COM UPLOADS DE ARQUIVOS NO HTML (ENVIO DE IMAGENS OU DOCUMENTOS ATRAVÉS DE REQUISIÇÕES HTTP)
const multer = require("multer");

// PATH: MANIPULA CAMINHOS DE ARQUIVOS DE FORMA INDEPENDENTE DO SISTEMA OPERACIONAL.
const path = require("path");

// STORAGE: ARMAZENAMENTO DE ARQUIVOS CONFIGURADO USANDO MULTER
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // "./uploads": PASTA ONDE AS IMAGENS DE PERFIL SERÃO SALVAS
    cb(null, "./uploads/");},
  // NOME DO ARQUIVO COM TIMESTAMP
  filename: (req, file, cb) => {cb(null, Date.now() + path.extname(file.originalname));},
});

// CONFIGURA O MULTER COM O ARMAZENAMENTO DEFINIDO ACIMA
const upload = multer({ storage: storage });

// CRIA UMA INSTÂNCIA DO EXPRESS
const app = express();
// ======================================================================================================================================



// ======================================================================================================================================
// HABILITA O CORS PARA ACEITAR REQUISIÇÕES DE OUTROS DOMÍNIOS
app.use(cors());

// HABILITA O BODY PARSER PARA LER O BODY DAS REQUISIÇÕES EM JSON
app.use(bodyParser.json());

// HABILITA O EXPRESS PARA LER REQUISIÇÕES EM FORMATO JSON
app.use(express.json());

// SERVIR ARQUIVOS ESTÁTICOS (FOTOS DE PERFIL) DA PASTA "/uploads"
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// ======================================================================================================================================



// ======================================================================================================================================
// ==================== ROTA PARA PERMITIR REGISTRO DOS USUÁRIOS ====================
app.post("/api/register", (req, res) => {
  const { username, email, password } = req.body;
  const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

  db.query(query, [username, email, password], (err, result) => {
    if (err) {
      console.error("Erro ao registrar usuário:", err);
      res.status(500).json({ error: "Erro ao registrar usuário." });
    }
    else {
      res.status(200).json({ message: "Usuário registrado com sucesso!" });
    }
  });
});

// ==================== ROTA PARA PERMITIR QUE OS USUÁRIOS FAÇAM LOGIN ====================
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Erro ao fazer login:", err);
      return res.status(500).json({ error: "Erro ao fazer login." });
    }

    // SE AS CREDENCIAIS FOREM VÁLIDAS...........
    if (results.length > 0) {
      // PARA O PRIMEIRO USUÁRIO ENCONTRADO.....
      const user = results[0];
      // ATUALIZA O CAMPO LAST_LOGIN PARA O MOMENTO ATUAL (QUE FOI FEITO)
      const updateLoginQuery = "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE email = ?";
      
      db.query(updateLoginQuery, [email], (err, updateResult) => {
        if (err) {
          console.error("Erro ao atualizar o last_login:", err);
          return res.status(500).json({ error: "Erro ao atualizar o último login." });
        }

        res.status(200).json({
          message: "Login bem-sucedido!",
          user: {
            username: user.username,
            email: user.email,
            lastLogin: user.last_login,
          },
        });
      });
    }
    else {
      res.status(401).json({ error: "Credenciais inválidas." });
    }
  });
});


// ==================== ROTA PARA PEGAR A IMAGEM DE PERFIL DO USUÁRIO ====================
app.get("/api/user/:email", (req, res) => {
  const { email } = req.params;
  const query = "SELECT username, email, profile_image FROM users WHERE email = ?";

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Erro ao buscar dados do usuário:", err);
      res.status(500).json({ error: "Erro ao buscar dados do usuário." });
    } else if (results.length > 0) {
      const profileImage = results[0].profile_image;
      // URL DA IMAGEM
      const imageUrl = profileImage? `http://localhost:3000/uploads/${profileImage}`: null;

      res.status(200).json({
        username: results[0].username,
        email: results[0].email,
        profile_image: imageUrl,
      });
    }
    else {
      res.status(404).json({ error: "Usuário não encontrado." });
    }
  });
});


// ==================== ROTA PARA ATUALIZAR AS INFORMAÇÕES DO USUÁRIO ====================
app.put("/api/user/:email", (req, res) => {
  const { email } = req.params;
  const { username, newEmail, password } = req.body;

  // VALIDAR SE PELO MENOS UM CAMPO FOI ALTERADO
  if (!username && !newEmail && !password) {
    return res.status(400).json({
      error: "Pelo menos um campo deve ser fornecido para atualização.",
    });
  }

  // VERIFICAR SE O EMAIL COLOCADO É IGUAL AO ATUAL
  if (newEmail && newEmail.trim() === email) {
    return res.status(400).json({ error: "O novo email não pode ser o mesmo que o atual." });
  }

  // VERIFICAR SE O NOVO EMAIL FORNECIDO JÁ TEM REGISTRO NO BANCO DE DADOS
  if (newEmail) {
    const checkEmailQuery = "SELECT COUNT(*) AS count FROM users WHERE email = ?";

    db.query(checkEmailQuery, [newEmail], (err, result) => {
      if (err) {
        console.error("Erro ao verificar o email no banco:", err);
        return res.status(500).json({ error: "Erro ao verificar o email no banco." });
      }

      if (result[0] && result[0].count > 0) {
        return res.status(400).json({ error: "Este email já está em uso." });
      }

      // CASO NÃO SEJA DUPLICADO, A ATUALIZAÇÃO PROSSEGUE
      updateUser(email, { username, newEmail, password }, res);
    });
  }
  else {
    // ATUALIZA DIRETAMENTE CASO O NOVO EMAIL NÃO SEJA INFORMADO
    updateUser(email, { username, password }, res);
  }
});


// PARA ATUALIZAR DINAMICAMENTE O USUÁRIO
function updateUser(email, fieldsToUpdate, res) {
  // ARRAYS PARA ARMAZENAR AS ATUALIZAÇÕES E OS VALORES
  const updates = [];
  const values = [];

  // ITERAÇÃO SOBRE OS CAMPOS A SEREM ATUALIZADOS E PREPARA A QUERY
  for (const [key, value] of Object.entries(fieldsToUpdate)) {
    if (value) {
      // ADICIONA O CAMPO E O VALOR À LISTA DE ATUALIZAÇÕES
      updates.push(`${key} = ?`);
      values.push(value);
    }
  }
  // ADICIONA O EMAIL PARA A CLÁUSULA WHERE PARA FILTRAR O USUÁRIO PELAS INFORMAÇÕES DE EMAIL)
  values.push(email);

  const updateQuery = `UPDATE users SET ${updates.join(", ")} WHERE email = ?`;

  db.query(updateQuery, values, (err, results) => {
    if (err) {
      console.error("Erro ao atualizar o usuário:", err);
      return res.status(500).json({ error: "Erro ao atualizar o usuário no banco de dados." });
    }

    if (results.affectedRows > 0) {
      console.log("Usuário atualizado com sucesso:", fieldsToUpdate);
      return res.status(200).json({ message: "Usuário atualizado com sucesso." });
    }
    else {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
  });
}


// ==================== ROTA PARA ALTERAR O USERNAME DO USUÁRIO ====================
app.post("/api/change-username", (req, res) => {
  const { email, password, newUsername } = req.body;
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Erro ao verificar as credenciais:", err);
      return res.status(500).json({ error: "Erro ao verificar as credenciais." });
    }

    if (results.length > 0) {
      const updateQuery = "UPDATE users SET username = ? WHERE email = ?";

      db.query(updateQuery, [newUsername, email], (err, updateResult) => {
        if (err) {
          console.error("Erro ao atualizar o nome de usuário:", err);
          return res.status(500).json({ error: "Erro ao atualizar o nome de usuário." });
        }
        res.status(200).json({ message: "Nome de usuário alterado com sucesso!" });
      });
    }
    else {
      res.status(401).json({ error: "Credenciais inválidas." });
    }
  });
});


// ==================== ROTA PARA ALTERAR O EMAIL DO USUÁRIO ====================
app.post("/api/change-email", (req, res) => {
  const { email, password, newEmail } = req.body;
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Erro ao verificar as credenciais:", err);
      return res.status(500).json({ error: "Erro ao verificar as credenciais." });
    }

    if (results.length > 0) {
      const updateQuery = "UPDATE users SET email = ? WHERE email = ?";

      db.query(updateQuery, [newEmail, email], (err, updateResult) => {
        if (err) {
          console.error("Erro ao atualizar o email:", err);
          return res.status(500).json({ error: "Erro ao atualizar o email." });
        }

        if (updateResult.affectedRows > 0) {
          console.log("Email alterado com sucesso!");
          res.status(200).json({ message: "Email alterado com sucesso!" });
        }
        else {
          console.error("Erro ao atualizar o email: Nenhuma linha afetada.");
          res.status(500).json({ error: "Erro ao atualizar o email." });
        }
      });
    }
    else {
      res.status(401).json({ error: "Credenciais inválidas." });
    }
  });
});


// ==================== ROTA PARA ALTERAR A SENHA DO USUÁRIO ====================
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


// ==================== ROTA PARA OS USUÁRIOS PODEREM CRIAR SUAS LISTAS ====================
app.post("/api/lists", (req, res) => {
  const { name, description, games, user_email } = req.body;

  if (!user_email) {
    return res.status(400).json({ error: "Usuário não autenticado." });
  }

  // O USER ID É COM BASE NO EMAIL DEVIDO ALGUNS ERROS DURANTE A PRODUÇÃO DO CÓDIGO
  const getUserIdQuery = "SELECT id FROM users WHERE email = ?";

  db.query(getUserIdQuery, [user_email], (err, result) => {
    if (err || result.length === 0) {
      return res.status(400).json({ error: "Usuário não encontrado." });
    }

    // O USER ID É COM BASE NO EMAIL DEVIDO ALGUNS ERROS DURANTE A PRODUÇÃO DO CÓDIGO
    const userId = result[0].id;
    // INSERE A LISTA NO DB
    const insertListQuery = "INSERT INTO lists (name, description, user_id) VALUES (?, ?, ?)";

    db.query(insertListQuery, [name, description, userId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao salvar lista." });
      }

      const listId = result.insertId;
      // PEGA QUAIS JOGOS QUE FORAM INSERIDOS NA LISTA
      const gameValues = games.map((game) => [listId, game.id, game.name, game.background_image,]);
      // INSERE OS JOGOS NA TABELA LIST_GAMES, PARA POSTERIORMENTE SEREM RELACIONADOS À TABELA DE LISTAS
      const insertGamesQuery = "INSERT INTO list_games (list_id, game_id, game_name, background_image) VALUES ?";

      db.query(insertGamesQuery, [gameValues], (err) => {
        if (err) {
          return res.status(500).json({ error: "Erro ao salvar jogos da lista." });
        }

        res.status(200).json({ message: "Lista criada com sucesso!" });
      });
    });
  });
});


// ==================== ROTA PARA AS LISTAS SEREM RENDERIZADAS NO PERFIL DO USUÁRIO ====================
app.get("/api/lists", (req, res) => {
  const userEmail = req.query.user_email;

  if (!userEmail) {
    return res.status(400).send("Email do usuário não fornecido");
  }

  const queryUserId = "SELECT id FROM users WHERE email = ?";

  db.query(queryUserId, [userEmail], (error, results) => {
    if (error) {
      console.error("Erro ao buscar o user_id:", error);
      return res.status(500).send("Erro ao buscar o user_id");
    }

    if (results.length === 0) {
      return res.status(404).send("Usuário não encontrado");
    }

    const userId = results[0].id;
    const queryLists = "SELECT * FROM lists WHERE user_id = ?";

    db.query(queryLists, [userId], (error, lists) => {
      if (error) {
        console.error("Erro ao buscar listas:", error);
        return res.status(500).send("Erro ao buscar listas");
      }

      // RETORNA A LISTA DOS USUÁRIOS EM JSON
      res.json(lists);
    });
  });
});


// ==================== ROTA PARA OS USUÁRIOS VEREM OS DETALHES DAS SUAS LISTAS AO CLICAR NELAS ====================
app.get("/api/list-details/:listId", (req, res) => {
  const listId = req.params.listId;
  // OBTÉM OS DETALHES DA LISTA (NOME E DESCRIÇÃO)
  const query = "SELECT name, description FROM lists WHERE id = ?";

  db.query(query, [listId], (err, result) => {
    if (err) {
      console.error("Erro ao buscar lista:", err);
      return res.status(500).send("Erro ao buscar lista");
    }

    // SE A LISTA EXISTIR, OS JOGOS SERÃO BUSCADOS
    const list = result[0];
    const queryGames = "SELECT game_id, game_name, background_image FROM list_games WHERE list_id = ?";

    db.query(queryGames, [listId], (err, games) => {
      if (err) {
        console.error("Erro ao buscar jogos:", err);
        return res.status(500).send("Erro ao buscar jogos");
      }

      // RETORNAR TANTO OS DETALHES DA LISTA COMO OS JOGOS ADICIONADOS À ELA
      res.json({ name: list.name, description: list.description, games: games, });
    });
  });
});


// ==================== ROTA PARA OS USUÁRIOS PODEREM ATUALIZAR SUAS LISTAS ====================
app.put("/api/lists/update-list/:id", (req, res) => {
  const listId = req.params.id;
  const { name, description } = req.body;
  const query = "UPDATE lists SET name = ?, description = ? WHERE id = ?";

  db.query(query, [name, description, listId], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar a lista:", err);
      return res.status(500).json({ error: "Erro ao atualizar a lista" });
    }

    // CONFIRMA SE HOUVE MESMO UMA ATUALIZAÇÃO
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Lista não encontrada" });
    }

    res.json({ message: "Lista atualizada com sucesso!" });
  });
});


// ==================== ROTA PARA OS USUÁRIOS ADICIONAREM JOGOS À SUAS LISTAS ====================
app.post("/api/lists/add-game-to-list", (req, res) => {
  const { listId, gameId, gameName, backgroundImage } = req.body;

  // VERIFICA SE TODOS OS PARAMÊTROS ESTÃO PRESENTES
  if (!listId || !gameId || !gameName || !backgroundImage) {
    return res.status(400).json({ message: "Todos os dados são necessários!" });
  }

  // FAZ UMA ASSOCIAÇÃO A LISTA E O JOGO PRESENTE NA TABELA LIST_GAMES
  const query = `INSERT INTO list_games (list_id, game_id, game_name, background_image) VALUES (?, ?, ?, ?)`;

  db.query(query, [listId, gameId, gameName, backgroundImage], (err, result) => {
      if (err) {
        console.error("Erro ao adicionar jogo à lista:", err);
        return res.status(500).json({ message: "Erro ao adicionar jogo à lista!" });
      }

      res.status(200).json({ message: "Jogo adicionado à lista!" });
    }
  );
});


// ==================== ROTA PARA OS USUÁRIOS REMOVEREM UM JOGO DA SUA LISTA ====================
app.delete("/api/lists/remove-game/:listId/:gameId", (req, res) => {
  const { listId, gameId } = req.params;

  // VERIFICA SE TODOS OS PARAMÊTROS ESTÃO PRESENTES
  if (!listId || !gameId) {
    return res.status(400).json({ message: "Parâmetros inválidos!" });
  }

  // APAGA A ASSOCIAÇÃO DA LISTA E DO JOGO DA TABELA LIST_GAMES
  const query = `DELETE FROM list_games WHERE list_id = ? AND game_id = ?`;

  db.query(query, [listId, gameId], (err, result) => {
    if (err) {
      console.error("Erro ao remover jogo da lista:", err);
      return res.status(500).json({ message: "Erro ao remover jogo da lista!" });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Jogo removido da lista!" });
    } else {
      return res.status(404).json({ message: "Jogo não encontrado na lista!" });
    }
  });
});


// ==================== ROTA PARA OS USUÁRIOS CONSEGUIREM PESQUISAR OS JOGOS ATRAVÉS DA API DO RAWG ====================
app.get("/api/lists/search-games", async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).send("Parâmetro de busca não fornecido");
  }

  try {
    // FAZ UMA CHAMADA À API DO RAWG ATRAVÉS DO AXIOS PARA OS JOGOS PODEREM SER RENDERIZADOS
    const response = await axios.get("https://api.rawg.io/api/games", {
      // CHAVE DA API OBTIDA POR NÓS
      params: {search: query, key: "b07a5bb97c484fcba2b68d5d6e04b9ea",
      },
    });

    res.json(response.data.results);
  }
  catch (err) {
    console.error("Erro ao buscar jogos na API RAWG:", err);
    return res.status(500).send("Erro ao buscar jogos na API RAWG");
  }
});


// ==================== ROTA PARA O USUÁRIO PODER FAZER UPLOAD DE SUA FOTO DE PERFIL ====================
app.post("/api/upload-profile-image", upload.single("profile_image"), (req, res) => {
    if (!req.file) {
      return res.status(400).send({ message: "Nenhum arquivo enviado" });
    }

    // SALVA O CAMINHO DA IMAGEM NO DB OU ENTÃO ENVIA A URL DE FORMA DIRETA
    // NOME DO ARQUIVO SALVO NA PASTA "UPLOADS"
    const profileImageUrl = req.file.filename;
    res.status(200).json({ profile_image: profileImageUrl });
  }
);


// ==================== ROTA PARA O USUÁRIO PODER ADICIONAR COMENTÁRIOS NOS JOGOS ====================
app.post("/api/comments", (req, res) => {
  const { game_id, user_email, title, comment, rating } = req.body;
  const query = `INSERT INTO comments (game_id, user_email, title, comment, rating) VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [game_id, user_email, title, comment, rating], (err, result) => {
      if (err) {
        console.error("Erro ao adicionar comentário:", err);
        return res.status(500).json({ error: "Erro ao adicionar comentário" });
      }
      
      res.status(201).json({ message: "Comentário adicionado com sucesso!" });
    }
  );
});


// ==================== ROTA PARA MOSTRAR OS COMENTÁRIOS DE UM JOGO ====================
app.get("/api/comments/:game_id", (req, res) => {
  const { game_id } = req.params;

  const query = `
    SELECT c.title, c.comment, c.rating, c.created_at, u.username, u.profile_image
    FROM comments c
    JOIN users u ON c.user_email = u.email
    WHERE c.game_id = ?
    ORDER BY c.created_at DESC
  `;
  db.query(query, [game_id], (err, results) => {
    if (err) {
      console.error("Erro ao buscar comentários:", err);
      return res.status(500).json({ error: "Erro ao buscar comentários" });
    }
    res.status(200).json(results);
  });
});

// POR FIM, O SERVIDOR É INICIALIZADO
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}.`);
});