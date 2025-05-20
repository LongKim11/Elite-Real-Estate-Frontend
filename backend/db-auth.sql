-- db-auth.sql
-- Khởi tạo database và bảng users cho Authentication Service

CREATE DATABASE IF NOT EXISTS db_auth;
USE db_auth;

-- Tạo bảng users
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `user_id` BINARY(16) NOT NULL,
  `account_blance` DOUBLE DEFAULT NULL,
  `created_at` DATETIME(6) NOT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `full_name` VARCHAR(255) DEFAULT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(255) DEFAULT NULL,
  `refresh_token` TEXT,
  `role` TINYINT DEFAULT NULL,
  `status` BIT(1) DEFAULT NULL,
  `user_tier_id` BIGINT DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UK_email` (`email`),
  UNIQUE KEY `UK_phone` (`phone`),
  CONSTRAINT `users_chk_role` CHECK (`role` BETWEEN 0 AND 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Thêm dữ liệu mẫu
INSERT INTO `users` (
  `user_id`, `account_blance`, `created_at`, `email`, `full_name`, `password`,
  `phone`, `refresh_token`, `role`, `status`, `user_tier_id`
) VALUES
(
  UUID_TO_BIN(UUID()), 0.0, NOW(6), NULL, 'Trần Văn An',
  '$2a$10$EMgGZYdo0IVf08.BPw5qk.G6k9B1xqjqRo.PIok4w4vTj2pqrS0l2', 
  '0918291810', NULL, 1, b'0', NULL
),
(
  UUID_TO_BIN(UUID()), 0.0, NOW(6), NULL, 'Lê Thị Bình',
  '$2a$10$EMgGZYdo0IVf08.BPw5qk.G6k9B1xqjqRo.PIok4w4vTj2pqrS0l2',
  '0336836516', NULL, 1, b'0', NULL
),
(
  UUID_TO_BIN(UUID()), 0.0, NOW(6), NULL, 'Nguyễn Hữu Cường',
  '$2a$10$EMgGZYdo0IVf08.BPw5qk.G6k9B1xqjqRo.PIok4w4vTj2pqrS0l2',
  '0915307658', NULL, 0, b'0', NULL
);