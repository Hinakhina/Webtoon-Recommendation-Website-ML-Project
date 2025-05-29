-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 29 Bulan Mei 2025 pada 09.24
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
  `searched_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `search_history`
--

INSERT INTO `search_history` (`id`, `user_id`, `title`, `searched_at`) VALUES
(1, 4, 'Ghost Teller', '2025-05-28 12:41:20');

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
(1, 'Hina', '$2b$10$9mUzjmGiiNKCIxcPd3zlb..OVckbl5CsmoSmWi2bR2v04XEmVTVZ.', 0),
(2, 'Kila', '$2b$10$tosIb6bUN7f3YdFZ29mtf.OB/.Vjk0Fhdrc7UMlVaETNjYFuFMbF6', 1),
(3, 'Lina', '$2b$10$i3.AULg2Idla22Xn4YWIm.N1GQubEI9FLMT/KxMSbwZScCILIY/vi', 0),
(4, 'Kuni', '$2b$10$0LW6d38NeYJhgNfCvAct6OZ56HKsmjrL1wmAnLzDIYiQx2roVLcLG', 0),
(5, 'Umi', '$2b$10$1aOvM8K9EIvpX8n02Yy0uOd8vRMwDj6GD35CNQAE3g7TZuHCxSPXm', 0);

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
(1, 1, 'Action'),
(2, 1, 'Adventure'),
(3, 1, 'Fantasy'),
(4, 3, 'Romance'),
(5, 3, 'Slice of Life'),
(6, 3, 'Drama'),
(7, 4, 'Thriller'),
(8, 4, 'Informative'),
(9, 4, 'Horror'),
(10, 5, 'Sci-Fi'),
(11, 5, 'Romance'),
(12, 5, 'Sports');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `search_history`
--
ALTER TABLE `search_history`
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `user_genres`
--
ALTER TABLE `user_genres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `user_genres`
--
ALTER TABLE `user_genres`
  ADD CONSTRAINT `user_genres_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
