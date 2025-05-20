CREATE DATABASE IF NOT EXISTS db_auth;

-- Check user admin
SELECT COUNT(*) INTO @user_exists FROM mysql.user WHERE user = 'admin' AND host = '%';
SET @create_user = IF(@user_exists = 0, 'CREATE USER \'admin\'@\'%\' IDENTIFIED BY \'admin123\';', 'SELECT 1;');
PREPARE stmt FROM @create_user;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add user admin to all databases
GRANT ALL PRIVILEGES ON db_auth.* TO 'admin'@'%';
FLUSH PRIVILEGES;
