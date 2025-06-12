CREATE TABLE `Course` (
  `course_id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` INT NOT NULL,
  `video` TEXT,
  `quiz` TEXT,
  `edited_by` INT,
  `edited_at` DATETIME,
  `is_active` BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (`created_by`) REFERENCES `Users`(`user_id`),
  FOREIGN KEY (`edited_by`) REFERENCES `Users`(`user_id`)
); 