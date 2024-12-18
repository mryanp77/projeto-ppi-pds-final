-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 18/12/2024 às 04:41
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `gamecritic`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `game_id` varchar(255) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `comment` text NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 10),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `comments`
--

INSERT INTO `comments` (`id`, `game_id`, `user_email`, `title`, `comment`, `rating`, `created_at`) VALUES
(4, '3498', 'michaelpaisrg16@gmail.com', 'Um dos melhores jogos que já joguei', 'Jogo perfeito, jogo bonito, jogo formoso 🔥🔥🔥', 10, '2024-12-18 03:31:34'),
(5, '3498', 'michaelpaisrg16@gmail.com', 'DIGO DE NOVO', 'JOGO PERFEITO, JOGO BONITO, JOGO FORMOSO 🔥🔥🔥🔥🔥🔥🔥👹👹👹👹👹👹', 10, '2024-12-18 03:35:17'),
(6, '3498', 'michaelpaisrg16@gmail.com', 'a', 'a', 1, '2024-12-18 03:38:09');

-- --------------------------------------------------------

--
-- Estrutura para tabela `lists`
--

CREATE TABLE `lists` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `lists`
--

INSERT INTO `lists` (`id`, `name`, `description`, `user_id`) VALUES
(7, 'Favoritos 👹🔥', 'Os melhores de todos...', 6);

-- --------------------------------------------------------

--
-- Estrutura para tabela `list_games`
--

CREATE TABLE `list_games` (
  `id` int(11) NOT NULL,
  `list_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `game_name` varchar(255) NOT NULL,
  `background_image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `list_games`
--

INSERT INTO `list_games` (`id`, `list_id`, `game_id`, `game_name`, `background_image`) VALUES
(29, 7, 56184, 'Resident Evil 4 (2005)', 'https://media.rawg.io/media/games/fee/fee0100afd87b52bfbd33e26689fa26c.jpg'),
(30, 7, 795632, 'Resident Evil 4', 'https://media.rawg.io/media/games/51a/51a404b9918a0b19fc704a3ca248c69f.jpg'),
(31, 7, 53478, 'Silent Hill', 'https://media.rawg.io/media/games/15d/15db2360d1130ba8c10573586588b0bd.jpg'),
(32, 7, 868086, 'Silent Hill 2', 'https://media.rawg.io/media/games/09b/09b41c1a2c5761c5b1772a4ae238bb0e.jpg'),
(34, 7, 29642, 'Silent Hill 2 (2001)', 'https://media.rawg.io/media/games/003/0033ae7d21418ff5a7807ab2c7d90247.jpg');

-- --------------------------------------------------------

--
-- Estrutura para tabela `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `last_login`, `profile_image`) VALUES
(6, '7xRyan_', 'michaelpaisrg16@gmail.com', 'maico2024', '2024-12-18 03:30:54', NULL);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_email` (`user_email`);

--
-- Índices de tabela `lists`
--
ALTER TABLE `lists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Índices de tabela `list_games`
--
ALTER TABLE `list_games`
  ADD PRIMARY KEY (`id`),
  ADD KEY `list_id` (`list_id`);

--
-- Índices de tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `lists`
--
ALTER TABLE `lists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `list_games`
--
ALTER TABLE `list_games`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_email`) REFERENCES `users` (`email`) ON DELETE CASCADE;

--
-- Restrições para tabelas `lists`
--
ALTER TABLE `lists`
  ADD CONSTRAINT `lists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Restrições para tabelas `list_games`
--
ALTER TABLE `list_games`
  ADD CONSTRAINT `list_games_ibfk_1` FOREIGN KEY (`list_id`) REFERENCES `lists` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
