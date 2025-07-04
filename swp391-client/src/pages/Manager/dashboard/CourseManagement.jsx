import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaBookOpen } from 'react-icons/fa';
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
              { text: '', score: 2 },
              { text: '', score: 0 }
            ]
          }
        ]
      }
    ]
  });

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

      await axios.post(`${API_BASE}/create`, {
        course_name: form.name,
        age_group: form.age_group,
        course_img: form.course_img,
        content: form.content
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      
      alert('Course created successfully!');
      setShowCreate(false);
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
                  { text: '', score: 2 },
                  { text: '', score: 0 }
                ]
              }
            ]
          }
        ]
      });
      fetchCourses();
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

      await axios.post(`${API_BASE}/update`, {
        course_id: showEdit.id,
        course_name: form.name,
        content: form.content,
        course_img: form.course_img,
        age_group: form.age_group
      }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      
      alert('Course updated successfully!');
      setShowEdit(null);
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
                  { text: '', score: 2 },
                  { text: '', score: 0 }
                ]
              }
            ]
          }
        ]
      });
      fetchCourses();
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
                { text: 'A substance that affects the nervous system and causes dependence', score: 2 },
                { text: 'A nutritional supplement', score: 0 }
              ]
            },
            {
              question: 'Which of the following is NOT considered a drug?',
              type: 'single_choice',
              options: [
                { text: 'Heroin', score: 0 },
                { text: 'Cannabis', score: 0 },
                { text: 'Vitamin C', score: 2 },
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
                { text: 'Learning refusal and self-protection skills', score: 2 },
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
          onClick={() => setShowCreate(true)}
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
                                    { text: '', score: 2 },
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
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
            <h2 className="text-lg font-bold mb-4 flex justify-between items-center">
              Create Course
              <button
                type="button"
                className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                onClick={loadSampleData}
              >
                Load Sample Data
              </button>
            </h2>
            
            {/* Basic Course Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                className="border p-2 rounded"
                placeholder="Course Name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
              <select
                className="border p-2 rounded"
                value={form.age_group}
                onChange={e => setForm(f => ({ ...f, age_group: e.target.value }))}
              >
                <option value="">Select Age Group</option>
                <option value="Teenagers">Teenagers</option>
                <option value="Young Adult">Young Adult</option>
                <option value="Adult">Adult</option>
              </select>
            </div>
            
            <input
              className="border p-2 mb-4 w-full rounded"
              placeholder="Course Image URL"
              value={form.course_img}
              onChange={e => setForm(f => ({ ...f, course_img: e.target.value }))}
            />
            
            <textarea
              className="border p-2 mb-4 w-full rounded"
              placeholder="Course Description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
            />
            
            {/* Content Sections */}
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-3">Course Content</h3>
              {form.content.map((lesson, lessonIndex) => (
                <div key={lesson.id} className="border rounded-lg p-4 mb-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Lesson {lesson.id}</h4>
                    {form.content.length > 1 && (
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          const newContent = form.content.filter((_, i) => i !== lessonIndex);
                          setForm(f => ({ ...f, content: newContent }));
                        }}
                      >
                        Delete Lesson
                      </button>
                    )}
                  </div>
                  
                  <input
                    className="border p-2 mb-3 w-full rounded"
                    placeholder="YouTube Video URL"
                    value={lesson.video}
                    onChange={e => {
                      const newContent = [...form.content];
                      newContent[lessonIndex].video = e.target.value;
                      setForm(f => ({ ...f, content: newContent }));
                    }}
                  />
                  
                  {/* Quiz Questions */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium">Quiz Questions</h5>
                      <button
                        className="text-blue-500 hover:text-blue-700 text-sm"
                        onClick={() => {
                          const newContent = [...form.content];
                          newContent[lessonIndex].quiz.push({
                            question: '',
                            type: 'single_choice',
                            options: [
                              { text: '', score: 0 },
                              { text: '', score: 0 },
                              { text: '', score: 2 },
                              { text: '', score: 0 }
                            ]
                          });
                          setForm(f => ({ ...f, content: newContent }));
                        }}
                      >
                        + Add Question
                      </button>
                    </div>
                    
                    {lesson.quiz.map((question, qIndex) => (
                      <div key={qIndex} className="border rounded p-3 mb-3 bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <input
                            className="border p-1 flex-1 rounded mr-2"
                            placeholder="Question"
                            value={question.question}
                            onChange={e => {
                              const newContent = [...form.content];
                              newContent[lessonIndex].quiz[qIndex].question = e.target.value;
                              setForm(f => ({ ...f, content: newContent }));
                            }}
                          />
                          {lesson.quiz.length > 1 && (
                            <button
                              className="text-red-500 hover:text-red-700 text-sm"
                              onClick={() => {
                                const newContent = [...form.content];
                                newContent[lessonIndex].quiz.splice(qIndex, 1);
                                setForm(f => ({ ...f, content: newContent }));
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex gap-2 mb-2">
                            <input
                              className="border p-1 flex-1 rounded"
                              placeholder={`Option ${oIndex + 1}`}
                              value={option.text}
                              onChange={e => {
                                const newContent = [...form.content];
                                newContent[lessonIndex].quiz[qIndex].options[oIndex].text = e.target.value;
                                setForm(f => ({ ...f, content: newContent }));
                              }}
                            />
                            <input
                              className="border p-1 w-16 rounded"
                              type="number"
                              placeholder="Score"
                              value={option.score}
                              onChange={e => {
                                const newContent = [...form.content];
                                newContent[lessonIndex].quiz[qIndex].options[oIndex].score = parseInt(e.target.value) || 0;
                                setForm(f => ({ ...f, content: newContent }));
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <button
                className="w-full border-2 border-dashed border-gray-300 p-4 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-400"
                onClick={() => {
                  const newLesson = {
                    id: form.content.length + 1,
                    video: '',
                    quiz: [
                      {
                        question: '',
                        type: 'single_choice',
                        options: [
                          { text: '', score: 0 },
                          { text: '', score: 0 },
                          { text: '', score: 2 },
                          { text: '', score: 0 }
                        ]
                      }
                    ]
                  };
                  setForm(f => ({ ...f, content: [...f.content, newLesson] }));
                }}
              >
                + Add New Lesson
              </button>
            </div>
            
            <div className="flex gap-2 justify-end">
              <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded font-semibold" onClick={handleCreate}>Create</button>
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
            <h2 className="text-lg font-bold mb-4">Edit Course</h2>
            
            {/* Basic Course Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <input
                className="border p-2 rounded"
                placeholder="Course Name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
              <select
                className="border p-2 rounded"
                value={form.age_group}
                onChange={e => setForm(f => ({ ...f, age_group: e.target.value }))}
              >
                <option value="">Select Age Group</option>
                <option value="Teenagers">Teenagers</option>
                <option value="Young Adult">Young Adult</option>
                <option value="Adult">Adult</option>
              </select>
            </div>
            
            <input
              className="border p-2 mb-4 w-full rounded"
              placeholder="Course Image URL"
              value={form.course_img}
              onChange={e => setForm(f => ({ ...f, course_img: e.target.value }))}
            />
            
            <textarea
              className="border p-2 mb-4 w-full rounded"
              placeholder="Course Description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
            />
            
            {/* Content Sections */}
            <div className="mb-6">
              <h3 className="text-md font-semibold mb-3">Course Content</h3>
              {form.content.map((lesson, lessonIndex) => (
                <div key={lesson.id} className="border rounded-lg p-4 mb-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Lesson {lesson.id}</h4>
                    {form.content.length > 1 && (
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          const newContent = form.content.filter((_, i) => i !== lessonIndex);
                          setForm(f => ({ ...f, content: newContent }));
                        }}
                      >
                        Delete Lesson
                      </button>
                    )}
                  </div>
                  
                  <input
                    className="border p-2 mb-3 w-full rounded"
                    placeholder="YouTube Video URL"
                    value={lesson.video}
                    onChange={e => {
                      const newContent = [...form.content];
                      newContent[lessonIndex].video = e.target.value;
                      setForm(f => ({ ...f, content: newContent }));
                    }}
                  />
                  
                  {/* Quiz Questions */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium">Quiz Questions</h5>
                      <button
                        className="text-blue-500 hover:text-blue-700 text-sm"
                        onClick={() => {
                          const newContent = [...form.content];
                          newContent[lessonIndex].quiz.push({
                            question: '',
                            type: 'single_choice',
                            options: [
                              { text: '', score: 0 },
                              { text: '', score: 0 },
                              { text: '', score: 2 },
                              { text: '', score: 0 }
                            ]
                          });
                          setForm(f => ({ ...f, content: newContent }));
                        }}
                      >
                        + Add Question
                      </button>
                    </div>
                    
                    {lesson.quiz.map((question, qIndex) => (
                      <div key={qIndex} className="border rounded p-3 mb-3 bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <input
                            className="border p-1 flex-1 rounded mr-2"
                            placeholder="Question"
                            value={question.question}
                            onChange={e => {
                              const newContent = [...form.content];
                              newContent[lessonIndex].quiz[qIndex].question = e.target.value;
                              setForm(f => ({ ...f, content: newContent }));
                            }}
                          />
                          {lesson.quiz.length > 1 && (
                            <button
                              className="text-red-500 hover:text-red-700 text-sm"
                              onClick={() => {
                                const newContent = [...form.content];
                                newContent[lessonIndex].quiz.splice(qIndex, 1);
                                setForm(f => ({ ...f, content: newContent }));
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                        
                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex gap-2 mb-2">
                            <input
                              className="border p-1 flex-1 rounded"
                              placeholder={`Option ${oIndex + 1}`}
                              value={option.text}
                              onChange={e => {
                                const newContent = [...form.content];
                                newContent[lessonIndex].quiz[qIndex].options[oIndex].text = e.target.value;
                                setForm(f => ({ ...f, content: newContent }));
                              }}
                            />
                            <input
                              className="border p-1 w-16 rounded"
                              type="number"
                              placeholder="Score"
                              value={option.score}
                              onChange={e => {
                                const newContent = [...form.content];
                                newContent[lessonIndex].quiz[qIndex].options[oIndex].score = parseInt(e.target.value) || 0;
                                setForm(f => ({ ...f, content: newContent }));
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <button
                className="w-full border-2 border-dashed border-gray-300 p-4 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-400"
                onClick={() => {
                  const newLesson = {
                    id: form.content.length + 1,
                    video: '',
                    quiz: [
                      {
                        question: '',
                        type: 'single_choice',
                        options: [
                          { text: '', score: 0 },
                          { text: '', score: 0 },
                          { text: '', score: 2 },
                          { text: '', score: 0 }
                        ]
                      }
                    ]
                  };
                  setForm(f => ({ ...f, content: [...f.content, newLesson] }));
                }}
              >
                + Add New Lesson
              </button>
            </div>
            
            <div className="flex gap-2 justify-end">
              <button className="px-4 py-2 bg-green-500 text-white rounded font-semibold" onClick={handleUpdate}>Save</button>
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowEdit(null)}>Cancel</button>
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