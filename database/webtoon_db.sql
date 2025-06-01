-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 01 Jun 2025 pada 16.19
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `webtoon_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `search_history`
--

CREATE TABLE `search_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `searched_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `search_history`
--

INSERT INTO `search_history` (`id`, `user_id`, `title`, `searched_at`) VALUES
(1, 1, 'God of Tower', '2025-05-31 23:41:52'),
(2, 1, 'Tower of God', '2025-05-31 23:42:06'),
(3, 1, 'Ghost teller', '2025-05-31 23:54:56'),
(4, 1, 'Ghost teller', '2025-05-31 23:55:11'),
(5, 1, 'Bastard', '2025-05-31 23:58:13'),
(6, 1, 'Bastard', '2025-05-31 23:58:17'),
(7, 1, 'Bastard', '2025-05-31 23:58:22'),
(8, 1, 'Noblese', '2025-05-31 23:58:31'),
(9, 3, 'Tower of God', '2025-06-01 00:15:12'),
(10, 4, 'Tower of God', '2025-06-01 00:28:18'),
(11, 5, 'Tower of God', '2025-06-01 01:23:55'),
(12, 5, 'Ghost Teller', '2025-06-01 01:24:26'),
(13, 5, 'Roach', '2025-06-01 01:39:23'),
(14, 5, 'Red Hood: Outlaws', '2025-06-01 01:39:43'),
(17, 6, 'Mythic Item Obtained', '2025-06-01 02:27:53'),
(18, 6, 'HIVE', '2025-06-01 02:28:00'),
(19, 6, 'Tower of God', '2025-06-01 02:29:01'),
(20, 7, 'Ghost Teller', '2025-06-01 02:45:49'),
(21, 7, 'Ghost Teller', '2025-06-01 02:47:20'),
(22, 5, 'Roach', '2025-06-01 02:48:40'),
(23, 5, 'Zombie Ship', '2025-06-01 02:49:19'),
(24, 5, 'Noise From Upstairs', '2025-06-01 18:58:34'),
(26, 8, 'Marry My Husband', '2025-06-01 19:47:16'),
(27, 8, 'There Must Be Happy Endings', '2025-06-01 19:47:31'),
(28, 8, 'Our Time', '2025-06-01 19:47:47'),
(29, 8, 'For My Derelict Favorite', '2025-06-01 19:51:54'),
(30, 8, 'For My Derelict Favorite', '2025-06-01 19:52:09'),
(31, 8, 'Rewriting Our Love Story', '2025-06-01 19:55:13'),
(32, 9, 'Marry My Husband', '2025-06-01 20:21:48'),
(33, 9, 'Tower of God', '2025-06-01 20:21:56'),
(34, 9, 'To The Starts and Back', '2025-06-01 20:22:14'),
(35, 9, 'To The Stars and Back', '2025-06-01 20:27:21'),
(36, 9, 'Maybe Meant to Be', '2025-06-01 20:36:17'),
(37, 9, 'Maybe Meant to Be', '2025-06-01 20:48:33'),
(38, 9, 'Maybe Meant to Be', '2025-06-01 20:48:50'),
(39, 9, 'Maybe Meant to Be', '2025-06-01 20:49:14'),
(40, 9, 'Maybe Meant to Be', '2025-06-01 20:49:44'),
(41, 9, 'Maybe Meant to Be', '2025-06-01 20:50:31'),
(42, 9, 'Maybe Meant to Be', '2025-06-01 20:50:43'),
(43, 9, 'Maybe Meant to Be', '2025-06-01 20:50:52'),
(44, 5, 'Mythic Item Obtained', '2025-06-01 20:51:45'),
(45, 5, 'Mythic Item Obtained', '2025-06-01 20:52:27');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_new` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `is_new`) VALUES
(1, 'Test', '$2b$10$L5G6j81r8IZ/0YczU6OmyONzmpZIlXARQP3vbZ/tL0b8ISkPta052', 0),
(3, 'Mina', '$2b$10$cEdpUs3WPbBPKgO.mPfvPOJVsOCpRL6.Ok2lxQRvvg6AMuW5ixQhW', 0),
(4, 'Hina', '$2b$10$z2z2ydSv8vDs5.aR41l8Ju0QpqgPEf.wa24dTYdfVcevrgseg.uWK', 0),
(5, 'Miya', '$2b$10$DCiNxPJCdpVxTjsWhekMPuvOMxNoFV2IJqkE4ENSXbY7pZUAXt79K', 0),
(6, 'Luna', '$2b$10$NA2bj/fusAm1Z2idapPltOZ9G.vZjJtY2Hthgp.actYxvt0If9ame', 0),
(7, 'Mimi', '$2b$10$wdvNba9MbTqAnQXmDC3cn.eWc7nWHNU93qsyiO0Y5yoEuAqQpXW6.', 0),
(8, 'ML', '$2b$10$BdoMUmc4xh89VigRfRop4.1y3oeCMvjEmkQEgUi/W5bKACA7sNWou', 0),
(9, 'test1', '$2b$10$wrwOHteBwGL9EdVvPR9r9u/BzWFbONFNaTsb7htEXZsrnJm9wGnBK', 0);

-- --------------------------------------------------------

--
-- Struktur dari tabel `user_genres`
--

CREATE TABLE `user_genres` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `genre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `user_genres`
--

INSERT INTO `user_genres` (`id`, `user_id`, `genre`) VALUES
(1, 1, 'Slice of Life'),
(2, 1, 'Sports'),
(3, 1, 'Comedy'),
(4, 3, 'Fantasy'),
(5, 3, 'Adventure'),
(6, 3, 'Action'),
(7, 4, 'Heartwarming'),
(8, 4, 'Adventure'),
(9, 4, 'Slice of Life'),
(10, 5, 'TIPTOON'),
(11, 5, 'FANTASY'),
(12, 5, 'HORROR'),
(13, 6, 'FANTASY'),
(14, 6, 'ROMANCE'),
(15, 6, 'THRILLER'),
(16, 7, 'THRILLER'),
(17, 7, 'HORROR'),
(18, 7, 'SUPERNATURAL'),
(19, 8, 'DRAMA'),
(20, 8, 'SF'),
(21, 8, 'ROMANCE'),
(22, 9, 'ROMANCE'),
(23, 9, 'ACTION'),
(24, 9, 'FANTASY');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `search_history`
--
ALTER TABLE `search_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indeks untuk tabel `user_genres`
--
ALTER TABLE `user_genres`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `search_history`
--
ALTER TABLE `search_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `user_genres`
--
ALTER TABLE `user_genres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `search_history`
--
ALTER TABLE `search_history`
  ADD CONSTRAINT `search_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `user_genres`
--
ALTER TABLE `user_genres`
  ADD CONSTRAINT `user_genres_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
