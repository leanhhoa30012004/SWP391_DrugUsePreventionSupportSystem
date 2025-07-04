import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaBookOpen, FaCheck } from 'react-icons/fa';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api/manager/course';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [showDelete, setShowDelete] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    age_group: '',
    course_img: '',
    content: [
      {
        id: 1,
        video: '',
        quiz: [
          {
            question: '',
            type: 'single_choice',
            options: [
              { text: '', score: 0 },
              { text: '', score: 0 },
              { text: '', score: 0 },
              { text: '', score: 0 }
            ]
          }
        ]
      }
    ]
  });

  // Tính điểm tự động dựa trên số câu hỏi (tổng điểm tối đa = 10)
  const calculateScorePerQuestion = (totalQuestions) => {
    if (totalQuestions === 0) return 0;
    return Math.round((10 / totalQuestions) * 100) / 100; // Làm tròn đến 2 chữ số thập phân
  };

  // Cập nhật điểm cho tất cả câu hỏi trong một lesson
  const updateAllScores = (lessonIndex) => {
    const newContent = [...form.content];
    const totalQuestions = newContent[lessonIndex].quiz.length;
    const scorePerQuestion = calculateScorePerQuestion(totalQuestions);

    newContent[lessonIndex].quiz.forEach(question => {
      question.options.forEach(option => {
        option.score = 0; // Reset tất cả về 0
      });
    });

    setForm(f => ({ ...f, content: newContent }));
  };

  // Tự động chọn đáp án đúng cho tất cả các câu hỏi trong lesson
  const autoSetAllCorrectAnswers = (lessonIndex) => {
    const newContent = [...form.content];
    const totalQuestions = newContent[lessonIndex].quiz.length;
    const scorePerQuestion = calculateScorePerQuestion(totalQuestions);

    // Reset tất cả điểm trong lesson về 0
    newContent[lessonIndex].quiz.forEach(question => {
      question.options.forEach(option => {
        option.score = 0;
      });
    });

    // Tự động chọn đáp án đúng cho mỗi câu hỏi
    newContent[lessonIndex].quiz.forEach((question, qIndex) => {
      // Tìm câu trả lời đúng hiện tại (nếu có)
      let correctOptionIndex = question.options.findIndex(option => option.score > 0);

      if (correctOptionIndex === -1) {
        // Nếu chưa có đáp án đúng, tự động chọn đáp án đầu tiên có text
        const firstFilledOptionIndex = question.options.findIndex(option => option.text.trim() !== '');
        if (firstFilledOptionIndex !== -1) {
          correctOptionIndex = firstFilledOptionIndex;
        } else {
          // Nếu không có đáp án nào có text, chọn đáp án đầu tiên
          correctOptionIndex = 0;
        }
      }

      // Đặt điểm cho đáp án đúng
      question.options[correctOptionIndex].score = scorePerQuestion;
    });

    setForm(f => ({ ...f, content: newContent }));
  };

  // Đặt câu trả lời đúng và tự động phân bổ điểm
  const setCorrectAnswer = (lessonIndex, questionIndex, optionIndex) => {
    const newContent = [...form.content];
    const totalQuestions = newContent[lessonIndex].quiz.length;
    const scorePerQuestion = calculateScorePerQuestion(totalQuestions);

    // Reset tất cả điểm trong lesson về 0
    newContent[lessonIndex].quiz.forEach(question => {
      question.options.forEach(option => {
        option.score = 0;
      });
    });

    // Đặt điểm cho câu trả lời đúng của câu hỏi hiện tại
    newContent[lessonIndex].quiz[questionIndex].options[optionIndex].score = scorePerQuestion;

    // Tự động tính toán và phân bổ điểm cho tất cả các câu hỏi khác
    newContent[lessonIndex].quiz.forEach((question, qIndex) => {
      if (qIndex !== questionIndex) {
        // Tìm câu trả lời đúng hiện tại (nếu có)
        const correctOptionIndex = question.options.findIndex(option => option.score > 0);
        if (correctOptionIndex === -1) {
          // Nếu chưa có đáp án đúng, tự động chọn đáp án đầu tiên có text làm đáp án đúng
          const firstFilledOptionIndex = question.options.findIndex(option => option.text.trim() !== '');
          if (firstFilledOptionIndex !== -1) {
            question.options[firstFilledOptionIndex].score = scorePerQuestion;
          } else {
            // Nếu không có đáp án nào có text, chọn đáp án đầu tiên
            question.options[0].score = scorePerQuestion;
          }
        } else {
          // Nếu đã có đáp án đúng, cập nhật điểm
          question.options[correctOptionIndex].score = scorePerQuestion;
        }
      }
    });

    setForm(f => ({ ...f, content: newContent }));
  };

  // Tính tổng điểm hiện tại của một lesson
  const calculateCurrentTotalScore = (lessonIndex) => {
    const lesson = form.content[lessonIndex];
    let totalScore = 0;
    lesson.quiz.forEach(question => {
      question.options.forEach(option => {
        totalScore += option.score;
      });
    });
    return Math.round(totalScore * 100) / 100;
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_BASE}/get-all-course-full-info`);
      setCourses(res.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  };

  // Create course
  const handleCreate = async () => {
    try {
      // Validate required fields
      if (!form.name || !form.age_group || form.content.length === 0) {
        alert('Please fill in course name, age group, and at least one lesson');
        return;
      }

      // Validate that each lesson has at least one question
      for (let i = 0; i < form.content.length; i++) {
        const lesson = form.content[i];
        if (!lesson.quiz || lesson.quiz.length === 0) {
          alert(`Lesson ${i + 1} must have at least one question`);
          return;
        }

        // Validate that each question has text
        for (let j = 0; j < lesson.quiz.length; j++) {
          const question = lesson.quiz[j];
          if (!question.question || question.question.trim() === '') {
            alert(`Question ${j + 1} in Lesson ${i + 1} cannot be empty`);
            return;
          }
        }
      }

      // Create a clean copy of content with sequential lesson IDs to avoid conflicts
      const cleanContent = form.content.map((lesson, index) => ({
        ...lesson,
        id: index + 1, // Ensure sequential IDs starting from 1
        video: lesson.video || '',
        quiz: lesson.quiz.map(question => ({
          ...question,
          question: question.question.trim(),
          type: question.type || 'single_choice',
          options: question.options.map(option => ({
            text: option.text.trim(),
            score: Number(option.score) || 0
          }))
        }))
      }));

      await axios.post(`${API_BASE}/create`, {
        course_name: form.name.trim(),
        age_group: form.age_group,
        course_img: form.course_img.trim(),
        content: cleanContent
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

      alert('Course created successfully!');
      setShowCreate(false);

      // Reset form to initial state
      setForm({
        name: '',
        description: '',
        age_group: '',
        course_img: '',
        content: [
          {
            id: 1,
            video: '',
            quiz: [
              {
                question: '',
                type: 'single_choice',
                options: [
                  { text: '', score: 0 },
                  { text: '', score: 0 },
                  { text: '', score: 0 },
                  { text: '', score: 0 }
                ]
              }
            ]
          }
        ]
      });

      // Refresh the courses list
      await fetchCourses();
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error creating course: ' + (error.response?.data?.message || error.message));
    }
  };

  // Update course
  const handleUpdate = async () => {
    try {
      // Validate required fields
      if (!form.name || form.content.length === 0) {
        alert('Please fill in course name and at least one lesson');
        return;
      }

      // Validate that each lesson has at least one question
      for (let i = 0; i < form.content.length; i++) {
        const lesson = form.content[i];
        if (!lesson.quiz || lesson.quiz.length === 0) {
          alert(`Lesson ${i + 1} must have at least one question`);
          return;
        }

        // Validate that each question has text
        for (let j = 0; j < lesson.quiz.length; j++) {
          const question = lesson.quiz[j];
          if (!question.question || question.question.trim() === '') {
            alert(`Question ${j + 1} in Lesson ${i + 1} cannot be empty`);
            return;
          }
        }
      }

      // Create a clean copy of content with sequential lesson IDs
      const cleanContent = form.content.map((lesson, index) => ({
        ...lesson,
        id: index + 1, // Ensure sequential IDs starting from 1
        video: lesson.video || '',
        quiz: lesson.quiz.map(question => ({
          ...question,
          question: question.question.trim(),
          type: question.type || 'single_choice',
          options: question.options.map(option => ({
            text: option.text.trim(),
            score: Number(option.score) || 0
          }))
        }))
      }));

      await axios.post(`${API_BASE}/update`, {
        course_id: showEdit.id,
        course_name: form.name.trim(),
        content: cleanContent,
        course_img: form.course_img.trim(),
        age_group: form.age_group
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

      alert('Course updated successfully!');
      setShowEdit(null);

      // Reset form to initial state
      setForm({
        name: '',
        description: '',
        age_group: '',
        course_img: '',
        content: [
          {
            id: 1,
            video: '',
            quiz: [
              {
                question: '',
                type: 'single_choice',
                options: [
                  { text: '', score: 0 },
                  { text: '', score: 0 },
                  { text: '', score: 0 },
                  { text: '', score: 0 }
                ]
              }
            ]
          }
        ]
      });

      // Refresh the courses list
      await fetchCourses();
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Error updating course: ' + (error.response?.data?.message || error.message));
    }
  };

  // Delete course
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/delete/${showDelete.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Course deleted successfully!');
      setShowDelete(null);
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Error deleting course: ' + (error.response?.data?.message || error.message));
    }
  };

  // Load sample course data
  const loadSampleData = () => {
    setForm({
      name: 'Drug Prevention Course - Sample',
      description: 'A comprehensive course about drug prevention and awareness',
      age_group: 'Adult',
      course_img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsY-zXClnpSWg_5Rk5yNpDDJGLjqLVAtwL5w&s',
      content: [
        {
          id: 1,
          video: 'https://www.youtube.com/watch?v=wQl_4kcE5nw',
          quiz: [
            {
              question: 'What is a drug?',
              type: 'single_choice',
              options: [
                { text: 'A brain booster', score: 0 },
                { text: 'A healing herb', score: 0 },
                { text: 'A substance that affects the nervous system and causes dependence', score: 5 },
                { text: 'A nutritional supplement', score: 0 }
              ]
            },
            {
              question: 'Which of the following is NOT considered a drug?',
              type: 'single_choice',
              options: [
                { text: 'Heroin', score: 0 },
                { text: 'Cannabis', score: 0 },
                { text: 'Vitamin C', score: 5 },
                { text: 'Methamphetamine', score: 0 }
              ]
            }
          ]
        },
        {
          id: 2,
          video: 'https://www.youtube.com/watch?v=wQl_4kcE5nw',
          quiz: [
            {
              question: 'Which of the following helps prevent drug addiction?',
              type: 'single_choice',
              options: [
                { text: 'Learning refusal and self-protection skills', score: 10 },
                { text: 'Avoiding all social interaction', score: 0 },
                { text: 'Staying home and skipping school', score: 0 },
                { text: 'Ignoring civic education', score: 0 }
              ]
            }
          ]
        }
      ]
    });
  };

  // Filtered courses
  const filteredCourses = courses.filter(course =>
    (course.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-[#e0e7ff] via-[#fef6fb] to-[#f8fafc] p-0 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-8 bg-gradient-to-r from-[#6366f1] via-[#22c55e] to-[#fbbf24] rounded-t-2xl shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-full p-4 shadow-lg">
            <FaBookOpen className="text-4xl text-[#6366f1]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1">Course Management</h1>
            <p className="text-white text-sm md:text-base max-w-xl">Create, edit and manage drug prevention courses.</p>
          </div>
        </div>
        <button
          className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#22c55e] text-white font-semibold px-6 py-3 rounded-xl shadow transition-all duration-200 text-base"
          onClick={() => {
            // Reset form to initial empty state when creating new course
            setForm({
              name: '',
              description: '',
              age_group: '',
              course_img: '',
              content: [
                {
                  id: 1,
                  video: '',
                  quiz: [
                    {
                      question: '',
                      type: 'single_choice',
                      options: [
                        { text: '', score: 0 },
                        { text: '', score: 0 },
                        { text: '', score: 0 },
                        { text: '', score: 0 }
                      ]
                    }
                  ]
                }
              ]
            });
            setShowCreate(true);
          }}
        >
          <FaPlus /> Create Course
        </button>
      </div>
      {/* Toolbar: Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-4 bg-white rounded-b-2xl shadow-md -mt-4 z-10 relative">
        <div className="flex items-center gap-2 bg-[#f1f5f9] rounded-xl px-3 py-2 shadow w-full md:w-1/3">
          <FaSearch className="text-[#6366f1]" />
          <input
            type="text"
            placeholder="Search courses..."
            className="outline-none border-none flex-1 bg-transparent text-black"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      {/* Table */}
      <div className="overflow-auto rounded-b-2xl shadow bg-white mt-0 flex-1">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-[#6366f1] via-[#22c55e] to-[#fbbf24] text-white">
            <tr>
              <th className="px-4 py-3 font-bold">No.</th>
              <th className="px-4 py-3 font-bold">Name</th>
              <th className="px-4 py-3 font-bold">Age Group</th>
              <th className="px-4 py-3 font-bold">Created By</th>
              <th className="px-4 py-3 font-bold">Created Date</th>
              <th className="px-4 py-3 font-bold">Last Updated</th>
              <th className="px-4 py-3 font-bold">Enrolled</th>
              <th className="px-4 py-3 font-bold">Completed</th>
              <th className="px-4 py-3 font-bold">Description</th>
              <th className="px-4 py-3 font-bold">Version</th>
              <th className="px-4 py-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-8 text-gray-400">No courses available.</td>
              </tr>
            ) : (
              filteredCourses.map((c, index) => (
                <tr key={c.id} className="border-b last:border-b-0 hover:bg-[#e0e7ff] transition">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.age_group}</td>
                  <td className="px-4 py-3">{c.created_by}</td>
                  <td className="px-4 py-3">{new Date(c.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">{new Date(c.lastUpdated).toLocaleString()}</td>
                  <td className="px-4 py-3">{c.enrolled}</td>
                  <td className="px-4 py-3">{c.completed}</td>
                  <td className="px-4 py-3">{c.description}</td>
                  <td className="px-4 py-3">{Number(c.version).toFixed(1)}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      className="p-2 rounded-lg bg-[#fbbf24] hover:bg-[#eab308] text-white"
                      title="Edit"
                      onClick={() => {
                        setShowEdit(c);
                        setForm({
                          name: c.name || c.course_name || '',
                          description: c.description || '',
                          age_group: c.age_group || '',
                          course_img: c.course_img || '',
                          content: Array.isArray(c.content) && c.content.length > 0 ? c.content : [
                            {
                              id: 1,
                              video: '',
                              quiz: [
                                {
                                  question: '',
                                  type: 'single_choice',
                                  options: [
                                    { text: '', score: 0 },
                                    { text: '', score: 0 },
                                    { text: '', score: 0 },
                                    { text: '', score: 0 }
                                  ]
                                }
                              ]
                            }
                          ]
                        });
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="p-2 rounded-lg bg-gray-200 hover:bg-red-200 text-[#e11d48]"
                      title="Delete"
                      onClick={() => setShowDelete(c)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-0 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden animate-fade-in border border-gray-100">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">✨ Create New Course</h2>
                  <p className="text-indigo-100">Build an engaging drug prevention course</p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm"
                    onClick={loadSampleData}
                  >
                    🎯 Load Sample Data
                  </button>
                  <button
                    className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
                    onClick={() => {
                      // Reset form when closing create modal
                      setForm({
                        name: '',
                        description: '',
                        age_group: '',
                        course_img: '',
                        content: [
                          {
                            id: 1,
                            video: '',
                            quiz: [
                              {
                                question: '',
                                type: 'single_choice',
                                options: [
                                  { text: '', score: 0 },
                                  { text: '', score: 0 },
                                  { text: '', score: 0 },
                                  { text: '', score: 0 }
                                ]
                              }
                            ]
                          }
                        ]
                      });
                      setShowCreate(false);
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="overflow-y-auto max-h-[calc(95vh-100px)] p-8 bg-gradient-to-br from-gray-50 to-indigo-50">
              {/* Basic Course Info */}
              <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  📚 Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Course Name *</label>
                    <input
                      className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="Enter course name..."
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Target Age Group *</label>
                    <select
                      className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      value={form.age_group}
                      onChange={e => setForm(f => ({ ...f, age_group: e.target.value }))}
                    >
                      <option value="">Select age group...</option>
                      <option value="Teenagers">Teenagers (13-19)</option>
                      <option value="Young Adult">Young Adult (20-30)</option>
                      <option value="Adult">Adult (30+)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Course Image URL</label>
                  <input
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="https://example.com/image.jpg"
                    value={form.course_img}
                    onChange={e => setForm(f => ({ ...f, course_img: e.target.value }))}
                  />
                </div>

                <div className="mt-6 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Course Description</label>
                  <textarea
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                    placeholder="Describe what students will learn in this course..."
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              {/* Course Content */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  🎓 Course Content & Lessons
                </h3>

                {form.content.map((lesson, lessonIndex) => (
                  <div key={lesson.id} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6 border border-indigo-100">
                    {/* Lesson Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                          {lesson.id}
                        </div>
                        <h4 className="font-semibold text-gray-800">Lesson {lesson.id}</h4>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-wrap">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm"
                          onClick={() => autoSetAllCorrectAnswers(lessonIndex)}
                        >
                          🎯 Auto Set All ({lesson.quiz.length} Q = {calculateScorePerQuestion(lesson.quiz.length)} pts each)
                        </button>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm"
                          onClick={() => updateAllScores(lessonIndex)}
                        >
                          🔄 Reset Scores
                        </button>
                        <div className="bg-purple-500 text-white text-xs px-3 py-2 rounded-lg font-medium shadow-sm">
                          📊 Total: {calculateCurrentTotalScore(lessonIndex)}/10
                        </div>
                        {form.content.length > 1 && (
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm"
                            onClick={() => {
                              const newContent = form.content.filter((_, i) => i !== lessonIndex);
                              setForm(f => ({ ...f, content: newContent }));
                            }}
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Video URL */}
                    <div className="mb-6 space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        🎥 Video URL
                      </label>
                      <input
                        className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={lesson.video}
                        onChange={e => {
                          const newContent = [...form.content];
                          newContent[lessonIndex].video = e.target.value;
                          setForm(f => ({ ...f, content: newContent }));
                        }}
                      />
                    </div>

                    {/* Quiz Questions */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          ❓ Quiz Questions
                        </label>
                        <button
                          className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm"
                          onClick={() => {
                            const newContent = [...form.content];
                            newContent[lessonIndex].quiz.push({
                              question: '',
                              type: 'single_choice',
                              options: [
                                { text: '', score: 0 },
                                { text: '', score: 0 },
                                { text: '', score: 0 },
                                { text: '', score: 0 }
                              ]
                            });
                            setForm(f => ({ ...f, content: newContent }));
                          }}
                        >
                          ➕ Add Question
                        </button>
                      </div>

                      {lesson.quiz.map((question, qIndex) => (
                        <div key={qIndex} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="bg-gray-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                                {qIndex + 1}
                              </div>
                              <input
                                className="flex-1 border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter your question..."
                                value={question.question}
                                onChange={e => {
                                  const newContent = [...form.content];
                                  newContent[lessonIndex].quiz[qIndex].question = e.target.value;
                                  setForm(f => ({ ...f, content: newContent }));
                                }}
                              />
                            </div>
                            {lesson.quiz.length > 1 && (
                              <button
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 ml-2"
                                onClick={() => {
                                  const newContent = [...form.content];
                                  newContent[lessonIndex].quiz.splice(qIndex, 1);
                                  setForm(f => ({ ...f, content: newContent }));
                                }}
                              >
                                🗑️
                              </button>
                            )}
                          </div>

                          <div className="space-y-3 ml-9">
                            {question.options.map((option, oIndex) => (
                              <div key={oIndex} className="flex gap-3 items-center group">
                                <div className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                                  {String.fromCharCode(65 + oIndex)}
                                </div>
                                <input
                                  className="flex-1 border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                  placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                  value={option.text}
                                  onChange={e => {
                                    const newContent = [...form.content];
                                    newContent[lessonIndex].quiz[qIndex].options[oIndex].text = e.target.value;
                                    setForm(f => ({ ...f, content: newContent }));
                                  }}
                                />
                                <input
                                  className="w-20 border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-center"
                                  type="number"
                                  step="0.01"
                                  placeholder="Score"
                                  value={option.score}
                                  onChange={e => {
                                    const newContent = [...form.content];
                                    newContent[lessonIndex].quiz[qIndex].options[oIndex].score = parseFloat(e.target.value) || 0;
                                    setForm(f => ({ ...f, content: newContent }));
                                  }}
                                />
                                <button
                                  className={`w-10 h-10 rounded-lg transition-all duration-200 shadow-sm ${option.score > 0
                                    ? 'bg-green-500 text-white shadow-green-200'
                                    : 'bg-gray-200 text-gray-500 hover:bg-green-100'
                                    }`}
                                  title="Set as correct answer"
                                  onClick={() => setCorrectAnswer(lessonIndex, qIndex, oIndex)}
                                >
                                  <FaCheck className="mx-auto" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Add New Lesson Button */}
                <button
                  className="w-full border-2 border-dashed border-indigo-300 bg-indigo-50 hover:bg-indigo-100 p-6 rounded-2xl text-indigo-600 hover:text-indigo-700 font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={() => {
                    // Find the next available ID to avoid conflicts
                    const maxId = Math.max(...form.content.map(lesson => lesson.id));
                    const newLesson = {
                      id: maxId + 1,
                      video: '',
                      quiz: [
                        {
                          question: '',
                          type: 'single_choice',
                          options: [
                            { text: '', score: 0 },
                            { text: '', score: 0 },
                            { text: '', score: 0 },
                            { text: '', score: 0 }
                          ]
                        }
                      ]
                    };
                    setForm(f => ({ ...f, content: [...f.content, newLesson] }));
                  }}
                >
                  ➕ Add New Lesson
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end pt-6">
                <button
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-all duration-200"
                  onClick={() => {
                    // Reset form when canceling create
                    setForm({
                      name: '',
                      description: '',
                      age_group: '',
                      course_img: '',
                      content: [
                        {
                          id: 1,
                          video: '',
                          quiz: [
                            {
                              question: '',
                              type: 'single_choice',
                              options: [
                                { text: '', score: 0 },
                                { text: '', score: 0 },
                                { text: '', score: 0 },
                                { text: '', score: 0 }
                              ]
                            }
                          ]
                        }
                      ]
                    });
                    setShowCreate(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={handleCreate}
                >
                  Create Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-0 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden animate-fade-in border border-gray-100">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 px-8 py-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">✏️ Edit Course</h2>
                  <p className="text-orange-100">Update your drug prevention course</p>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm"
                    onClick={loadSampleData}
                  >
                    🎯 Load Sample Data
                  </button>
                  <button
                    className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
                    onClick={() => setShowEdit(null)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="overflow-y-auto max-h-[calc(95vh-100px)] p-8 bg-gradient-to-br from-gray-50 to-orange-50">
              {/* Basic Course Info */}
              <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  📚 Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Course Name *</label>
                    <input
                      className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="Enter course name..."
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Target Age Group *</label>
                    <select
                      className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      value={form.age_group}
                      onChange={e => setForm(f => ({ ...f, age_group: e.target.value }))}
                    >
                      <option value="">Select age group...</option>
                      <option value="Teenagers">Teenagers (13-19)</option>
                      <option value="Young Adult">Young Adult (20-30)</option>
                      <option value="Adult">Adult (30+)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Course Image URL</label>
                  <input
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="https://example.com/image.jpg"
                    value={form.course_img}
                    onChange={e => setForm(f => ({ ...f, course_img: e.target.value }))}
                  />
                </div>

                <div className="mt-6 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Course Description</label>
                  <textarea
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                    placeholder="Describe what students will learn in this course..."
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              {/* Course Content */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  🎓 Course Content & Lessons
                </h3>

                {form.content.map((lesson, lessonIndex) => (
                  <div key={lesson.id} className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-6 border border-orange-100">
                    {/* Lesson Header */}
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                          {lesson.id}
                        </div>
                        <h4 className="font-semibold text-gray-800">Lesson {lesson.id}</h4>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-wrap">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm"
                          onClick={() => autoSetAllCorrectAnswers(lessonIndex)}
                        >
                          🎯 Auto Set All ({lesson.quiz.length} Q = {calculateScorePerQuestion(lesson.quiz.length)} pts each)
                        </button>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm"
                          onClick={() => updateAllScores(lessonIndex)}
                        >
                          🔄 Reset Scores
                        </button>
                        <div className="bg-purple-500 text-white text-xs px-3 py-2 rounded-lg font-medium shadow-sm">
                          📊 Total: {calculateCurrentTotalScore(lessonIndex)}/10
                        </div>
                        {form.content.length > 1 && (
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm"
                            onClick={() => {
                              const newContent = form.content.filter((_, i) => i !== lessonIndex);
                              setForm(f => ({ ...f, content: newContent }));
                            }}
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Video URL */}
                    <div className="mb-6 space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        🎥 Video URL
                      </label>
                      <input
                        className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={lesson.video}
                        onChange={e => {
                          const newContent = [...form.content];
                          newContent[lessonIndex].video = e.target.value;
                          setForm(f => ({ ...f, content: newContent }));
                        }}
                      />
                    </div>

                    {/* Quiz Questions */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          ❓ Quiz Questions
                        </label>
                        <button
                          className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm"
                          onClick={() => {
                            const newContent = [...form.content];
                            newContent[lessonIndex].quiz.push({
                              question: '',
                              type: 'single_choice',
                              options: [
                                { text: '', score: 0 },
                                { text: '', score: 0 },
                                { text: '', score: 0 },
                                { text: '', score: 0 }
                              ]
                            });
                            setForm(f => ({ ...f, content: newContent }));
                          }}
                        >
                          ➕ Add Question
                        </button>
                      </div>

                      {lesson.quiz.map((question, qIndex) => (
                        <div key={qIndex} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="bg-gray-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                                {qIndex + 1}
                              </div>
                              <input
                                className="flex-1 border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                                placeholder="Enter your question..."
                                value={question.question}
                                onChange={e => {
                                  const newContent = [...form.content];
                                  newContent[lessonIndex].quiz[qIndex].question = e.target.value;
                                  setForm(f => ({ ...f, content: newContent }));
                                }}
                              />
                            </div>
                            {lesson.quiz.length > 1 && (
                              <button
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 ml-2"
                                onClick={() => {
                                  const newContent = [...form.content];
                                  newContent[lessonIndex].quiz.splice(qIndex, 1);
                                  setForm(f => ({ ...f, content: newContent }));
                                }}
                              >
                                🗑️
                              </button>
                            )}
                          </div>

                          <div className="space-y-3 ml-9">
                            {question.options.map((option, oIndex) => (
                              <div key={oIndex} className="flex gap-3 items-center group">
                                <div className="bg-gray-100 text-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
                                  {String.fromCharCode(65 + oIndex)}
                                </div>
                                <input
                                  className="flex-1 border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                                  placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                  value={option.text}
                                  onChange={e => {
                                    const newContent = [...form.content];
                                    newContent[lessonIndex].quiz[qIndex].options[oIndex].text = e.target.value;
                                    setForm(f => ({ ...f, content: newContent }));
                                  }}
                                />
                                <input
                                  className="w-20 border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-center"
                                  type="number"
                                  step="0.01"
                                  placeholder="Score"
                                  value={option.score}
                                  onChange={e => {
                                    const newContent = [...form.content];
                                    newContent[lessonIndex].quiz[qIndex].options[oIndex].score = parseFloat(e.target.value) || 0;
                                    setForm(f => ({ ...f, content: newContent }));
                                  }}
                                />
                                <button
                                  className={`w-10 h-10 rounded-lg transition-all duration-200 shadow-sm ${option.score > 0
                                    ? 'bg-green-500 text-white shadow-green-200'
                                    : 'bg-gray-200 text-gray-500 hover:bg-green-100'
                                    }`}
                                  title="Set as correct answer"
                                  onClick={() => setCorrectAnswer(lessonIndex, qIndex, oIndex)}
                                >
                                  <FaCheck className="mx-auto" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Add New Lesson Button */}
                <button
                  className="w-full border-2 border-dashed border-orange-300 bg-orange-50 hover:bg-orange-100 p-6 rounded-2xl text-orange-600 hover:text-orange-700 font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={() => {
                    // Find the next available ID to avoid conflicts
                    const maxId = Math.max(...form.content.map(lesson => lesson.id));
                    const newLesson = {
                      id: maxId + 1,
                      video: '',
                      quiz: [
                        {
                          question: '',
                          type: 'single_choice',
                          options: [
                            { text: '', score: 0 },
                            { text: '', score: 0 },
                            { text: '', score: 0 },
                            { text: '', score: 0 }
                          ]
                        }
                      ]
                    };
                    setForm(f => ({ ...f, content: [...f.content, newLesson] }));
                  }}
                >
                  ➕ Add New Lesson
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end pt-6">
                <button
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-all duration-200"
                  onClick={() => setShowEdit(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={handleUpdate}
                >
                  💾 Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl min-w-[340px] animate-fade-in">
            <h2 className="text-lg font-bold mb-4">Delete Course</h2>
            <p className="mb-4">Are you sure you want to delete <b>{showDelete.name}</b>?</p>
            <div className="flex gap-2 justify-end">
              <button className="px-4 py-2 bg-red-500 text-white rounded font-semibold" onClick={handleDelete}>Delete</button>
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;