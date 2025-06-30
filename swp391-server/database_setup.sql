-- Tạo bảng UserCourses để lưu thông tin khóa học của user
CREATE TABLE IF NOT EXISTS UserCourses (
    user_course_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    enrolled_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
    progress DECIMAL(5,2) DEFAULT 0.00,
    completed_date TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Course(course_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_course (user_id, course_id)
);

-- Tạo bảng Certificates để lưu chứng chỉ
CREATE TABLE IF NOT EXISTS Certificates (
    certificate_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('course_completion', 'survey_completion', 'achievement') DEFAULT 'course_completion',
    earned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    certificate_url VARCHAR(500),
    course_id INT NULL,
    survey_id INT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES Course(course_id) ON DELETE SET NULL,
    FOREIGN KEY (survey_id) REFERENCES Survey(survey_id) ON DELETE SET NULL
);

-- Tạo bảng SurveyResults để lưu kết quả survey
CREATE TABLE IF NOT EXISTS SurveyResults (
    survey_result_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    survey_id INT NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    risk_level ENUM('low', 'medium', 'high') DEFAULT 'low',
    recommendations TEXT,
    completed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    certificate_eligible BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (survey_id) REFERENCES Survey(survey_id) ON DELETE CASCADE
);

-- Thêm một số dữ liệu mẫu cho UserCourses (nếu có user và course)
INSERT IGNORE INTO UserCourses (user_id, course_id, status, progress) VALUES 
(1, 1, 'in_progress', 65.5),
(1, 2, 'completed', 100.0),
(2, 1, 'not_started', 0.0);

-- Thêm một số dữ liệu mẫu cho Certificates
INSERT IGNORE INTO Certificates (user_id, title, description, type, course_id) VALUES 
(1, 'Drug Prevention Awareness', 'Certificate for completing the basic drug prevention course', 'course_completion', 2),
(2, 'Survey Completion Certificate', 'Certificate for completing the risk assessment survey', 'survey_completion', NULL);

-- Thêm một số dữ liệu mẫu cho SurveyResults
INSERT IGNORE INTO SurveyResults (user_id, survey_id, score, total_questions, risk_level, recommendations, certificate_eligible) VALUES 
(1, 1, 8, 10, 'low', 'Continue with healthy lifestyle choices. Consider joining support groups.', TRUE),
(2, 1, 15, 20, 'medium', 'Recommended to seek counseling and join our prevention programs.', FALSE);
