# noinspection SqlNoDataSourceInspectionForFile

# database
CREATE DATABASE `ww-game` DEFAULT CHARACTER SET utf8;

CREATE USER 'ww-user'@'%' IDENTIFIED BY 'ww-password';
GRANT ALL ON `ww-game`.* TO 'ww-user'@'%';
FLUSH PRIVILEGES;

USE `ww-game`;
SET NAMES UTF8;

CREATE TABLE IF NOT EXISTS users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     username VARCHAR(255) NOT NULL,
     pwd VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)  ENGINE=INNODB;
