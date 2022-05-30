# noinspection SqlNoDataSourceInspectionForFile

# database
CREATE DATABASE `ww-game` DEFAULT CHARACTER SET utf8;

CREATE USER 'ww-user'@'%' IDENTIFIED BY 'ww-password';
GRANT ALL ON `ww-game`.* TO 'ww-user'@'%';
FLUSH PRIVILEGES;

USE `ww-game`;
SET NAMES UTF8;

CREATE TABLE IF NOT EXISTS wallets (
   id INT AUTO_INCREMENT PRIMARY KEY,
   hard_currency INT NOT NULL,
   soft_currency INT NOT NULL,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)  ENGINE=INNODB;

CREATE TABLE IF NOT EXISTS users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     username VARCHAR(255) NOT NULL UNIQUE,
     pwd VARCHAR(255) NOT NULL,
     wallet_id INT NOT NULL,
     session_id VARCHAR(255),
     session_expiration DATETIME,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (wallet_id) REFERENCES wallets(id)
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS clubs (
     id INT AUTO_INCREMENT PRIMARY KEY,
     manager_id INT NOT NULL,
     club_name VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (manager_id) REFERENCES users(id)
)  ENGINE=INNODB;


CREATE TABLE IF NOT EXISTS club_members (
     club_id INT NOT NULL,
     user_id INT NOT NULL,
     joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id),
     FOREIGN KEY (club_id) REFERENCES clubs(id)
)  ENGINE=INNODB;
