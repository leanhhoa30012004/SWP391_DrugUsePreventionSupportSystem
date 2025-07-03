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
  const [form, setForm] = useState({ name: '', description: '', age_group: '' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await axios.get(`${API_BASE}/get-all-course-full-info`);

    const latestByName = {};
    res.data.forEach(course => {
      if (
        !latestByName[course.name] ||
        course.version > latestByName[course.name].version
      ) {
        latestByName[course.name] = course;
      }
    });
    setCourses(Object.values(latestByName));
  };

  // Create course
  const handleCreate = async () => {
    await axios.post(`${API_BASE}/create`, {
      course_name: form.name,
      content: { description: form.description },
      age_group: form.age_group
    }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setShowCreate(false);
    setForm({ name: '', description: '', age_group: '' });
    fetchCourses();
  };

  // Update course
  const handleUpdate = async () => {
    await axios.post(`${API_BASE}/update`, {
      course_id: showEdit.id,
      course_name: form.name,
      content: { description: form.description },
      age_group: form.age_group
    }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    setShowEdit(null);
    setForm({ name: '', description: '', age_group: '' });
    fetchCourses();
  };

  // Delete course
  const handleDelete = async () => {
    await axios.delete(`${API_BASE}/delete`, {
      data: { course_id: showDelete.id },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setShowDelete(null);
    fetchCourses();
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
                          name: c.name,
                          description: c.description,
                          age_group: c.age_group || ''
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
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl min-w-[340px] animate-fade-in">
            <h2 className="text-lg font-bold mb-4">Create Course</h2>
            <input
              className="border p-2 mb-3 w-full rounded"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            <textarea
              className="border p-2 mb-3 w-full rounded"
              placeholder="Description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
            <select
              className="border p-2 mb-3 w-full rounded"
              value={form.age_group}
              onChange={e => setForm(f => ({ ...f, age_group: e.target.value }))}
            >
              <option value="">Select Age Group</option>
              <option value="Teenagers">Teenagers</option>
              <option value="Young Adult">Young Adult</option>
              <option value="Adult">Adult</option>
            </select>
            <div className="flex gap-2 justify-end">
              <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded font-semibold" onClick={handleCreate}>Create</button>
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl min-w-[340px] animate-fade-in">
            <h2 className="text-lg font-bold mb-4">Edit Course</h2>
            <input
              className="border p-2 mb-3 w-full rounded"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            <textarea
              className="border p-2 mb-3 w-full rounded"
              placeholder="Description"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
            <select
              className="border p-2 mb-3 w-full rounded"
              value={form.age_group}
              onChange={e => setForm(f => ({ ...f, age_group: e.target.value }))}
            >
              <option value="">Select Age Group</option>
              <option value="Teenagers">Teenagers</option>
              <option value="Young Adult">Young Adult</option>
              <option value="Adult">Adult</option>
            </select>
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