// ========== CHAMANDO O MYSQL ==========
const mysql = require("mysql");

// ========== CRIANDO CONEXÃO A PARTIR DOS DADOS DO DB ==========
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "gamecritic",
});

// ========== CONECTANDO DIRETAMENTE AO DB ==========
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log("Conectado ao banco de dados MySQL.");
});

// ========== EXPORTANDO A CONSTANTE DB PARA SER PÊGA NO SERVER.JS ==========
module.exports = db;
