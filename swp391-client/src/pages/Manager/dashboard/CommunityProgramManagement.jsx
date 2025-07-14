import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaClipboardList } from 'react-icons/fa';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { MdEditSquare, MdClose } from 'react-icons/md';
// Xóa import uuid
// Khi tạo câu hỏi mới, id là pre{index+1} hoặc post{index+1}
// Khi map response, dùng id này thay cho uuid

const API_BASE = '/api/program';

// Helper chuyển đổi ngày về format datetime-local
function toDatetimeLocal(str) {
  if (!str) return '';
  // Hỗ trợ cả dạng ISO và dạng 'YYYY-MM-DD HH:mm:ss'
  if (str.includes('T')) return str.slice(0,16);
  const [date, time] = str.split(' ');
  return date + 'T' + (time ? time.slice(0,5) : '00:00');
}

// Thêm helper ở đầu file
function formatUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return 'https://' + url;
}
function isUrl(str) {
  return /\./.test(str) && !/\s/.test(str);
}

// Xóa các hàm formatUrl, isValidUrl

// Helper để capitalize mỗi từ
function capitalizeWords(str) {
  return str.replace(/\b\w/g, c => c.toUpperCase());
}

const CommunityProgramManagement = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({
    program_id: '',
    title: '',
    host: '',
    detailShort: '',
    date: '',
    end_date: '',
    location: '',
    age_group: '',
    detail: [],
    preSurvey: [], // Changed to array of objects
    postSurvey: [] // Changed to array of objects
  });
  const [originalLocation, setOriginalLocation] = useState('');
  const [participantCounts, setParticipantCounts] = useState({});
  const [viewData, setViewData] = useState(null);
  const [viewMembers, setViewMembers] = useState([]);
  const [showView, setShowView] = useState(false);

  useEffect(() => {
    fetchPrograms();
    fetchParticipantCounts();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/get-all-program`);
      setPrograms(res.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch programs');
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipantCounts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/number-participant-program`);
      // res.data: [{ program_id, participant_count }]
      const map = {};
      (res.data || []).forEach(item => {
        map[item.program_id] = item.participant_count;
      });
      setParticipantCounts(map);
    } catch (err) {
      setParticipantCounts({});
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this program?')) return;
    try {
      await axios.get(`${API_BASE}/delete-program/${id}`);
      fetchPrograms();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleEdit = (program) => {
    // Convert dữ liệu cũ sang dạng mới nếu cần
    function convertSurveyAndResponse(surveyArr, responseArr, prefix) {
      if (Array.isArray(surveyArr) && typeof surveyArr[0] === 'string') {
        const surveyWithId = surveyArr.map((text, idx) => ({ id: `${prefix}${idx + 1}`, text }));
        const responseById = {};
        surveyWithId.forEach((q, idx) => {
          responseById[q.id] = Array.isArray(responseArr) ? responseArr[idx] : [];
        });
        return { surveyWithId, responseById };
      }
      if (Array.isArray(surveyArr) && typeof surveyArr[0] === 'object' && surveyArr[0].id) {
        // Nếu đã đúng dạng mới, giữ nguyên
        // Nếu response là mảng, convert sang object theo id
        let responseById = responseArr;
        if (Array.isArray(responseArr)) {
          responseById = {};
          surveyArr.forEach((q, idx) => {
            responseById[q.id] = responseArr[idx] || [];
          });
        }
        return { surveyWithId: surveyArr, responseById };
      }
      return { surveyWithId: [], responseById: {} };
    }
    const { surveyWithId: preSurveyWithId, responseById: preResponseById } = convertSurveyAndResponse(
      program.survey_question?.['pre-survey'] || [],
      program.response?.pre_response || [],
      'pre'
    );
    const { surveyWithId: postSurveyWithId, responseById: postResponseById } = convertSurveyAndResponse(
      program.survey_question?.['post-survey'] || [],
      program.response?.post_response || [],
      'post'
    );
    setEditData({
      ...program,
      survey_question: {
        'pre-survey': preSurveyWithId,
        'post-survey': postSurveyWithId
      },
      response: {
        pre_response: preResponseById,
        post_response: postResponseById
      }
    });
    setForm({
      program_id: program.program_id,
      title: program.title || '',
      host: program.description?.host || '',
      detailShort: program.description?.detail || '',
      date: toDatetimeLocal(program.start_date),
      end_date: toDatetimeLocal(program.end_date),
      location: program.location,
      age_group: program.age_group,
      detail: Array.isArray(program.detail) ? program.detail : [],
      preSurvey: preSurveyWithId,
      postSurvey: postSurveyWithId
    });
    setOriginalLocation(program.location || '');
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditData(null);
    setForm({ program_id: '', title: '', host: '', detailShort: '', date: '', end_date: '', location: '', age_group: '', detail: [], preSurvey: [], postSurvey: [] });
    setOriginalLocation('');
    setShowForm(true);
  };

  // Sửa handleSurveyChange để chỉ update text, giữ nguyên id
  const handleSurveyChange = (type, idx, value) => {
    setForm((prev) => {
      const arr = [...prev[type]];
      arr[idx] = { ...arr[idx], text: value }; // chỉ đổi text, giữ nguyên id
      return { ...prev, [type]: arr };
    });
  };
  // Sửa handleAddSurvey để tạo id mới cho câu hỏi mới
  const handleAddSurvey = (type) => {
    setForm((prev) => ({
      ...prev,
      [type]: [
        ...prev[type],
        { id: `${type}${prev[type].length + 1}`, text: '' }
      ]
    }));
  };
  // Sửa handleRemoveSurvey để chỉ xóa object khỏi mảng, không ảnh hưởng id các câu còn lại
  const handleRemoveSurvey = (type, idx) => {
    setForm((prev) => {
      const arr = [...prev[type]];
      arr.splice(idx, 1);
      return { ...prev, [type]: arr };
    });
  };

  const handleDetailChange = (idx, key, value) => {
    setForm((prev) => {
      const arr = [...prev.detail];
      arr[idx] = { ...arr[idx], [key]: value };
      // Nếu đổi sang text thì xóa img, ngược lại
      if (key === 'text') delete arr[idx].img;
      if (key === 'img') delete arr[idx].text;
      return { ...prev, detail: arr };
    });
  };
  const handleAddDetail = (type) => {
    setForm((prev) => ({ ...prev, detail: [...prev.detail, type === 'text' ? { text: '' } : { img: '' }] }));
  };
  const handleRemoveDetail = (idx) => {
    setForm((prev) => {
      const arr = [...prev.detail];
      arr.splice(idx, 1);
      return { ...prev, detail: arr };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Lấy danh sách câu hỏi mới
      const preSurveyQuestions = form.preSurvey.filter(q => q.text.trim());
      const postSurveyQuestions = form.postSurvey.filter(q => q.text.trim());

      // Lấy response cũ
      let newResponse = { pre_response: {}, post_response: {} };
      if (editData && editData.response) {
        // Giữ lại response cũ cho các id còn tồn tại
        newResponse.pre_response = {};
        preSurveyQuestions.forEach(q => {
          newResponse.pre_response[q.id] = editData.response.pre_response?.[q.id] || [];
        });
        newResponse.post_response = {};
        postSurveyQuestions.forEach(q => {
          newResponse.post_response[q.id] = editData.response.post_response?.[q.id] || [];
        });
      } else {
        newResponse = {
          pre_response: Object.fromEntries(preSurveyQuestions.map(q => [q.id, []])),
          post_response: Object.fromEntries(postSurveyQuestions.map(q => [q.id, []]))
        };
      }

      const submitData = {
        program_id: form.program_id,
        title: form.title,
        description: { host: form.host, detail: form.detailShort },
        start_date: form.date,
        end_date: form.end_date,
        location: form.location,
        age_group: form.age_group,
        detail: form.detail,
        survey_question: {
          'pre-survey': preSurveyQuestions.map(q => ({ id: q.id, text: q.text })),
          'post-survey': postSurveyQuestions.map(q => ({ id: q.id, text: q.text }))
        },
        response: newResponse,
        status: 'Not started'
      };
      await axios.post(`${API_BASE}/update-program`, submitData);
      setShowForm(false);
      fetchPrograms();
    } catch (err) {
      alert('Save failed');
    }
  };

  const handleView = async (program) => {
    // Lấy lại dữ liệu mới nhất cho program từ backend
    try {
      const res = await axios.get(`${API_BASE}/get-program/${program.program_id}`);
      setViewData(res.data || program);
    } catch {
      setViewData(program);
    }
    setShowView(true);
    try {
      const res = await axios.get(`${API_BASE}/get-all-member-by-program-id/${program.program_id}`);
      setViewMembers(res.data || []);
    } catch {
      setViewMembers([]);
    }
  };

  // Thêm hàm convertSurveyAndResponse trong component (trước return)
  function convertSurveyAndResponse(surveyArr, responseArr, prefix) {
    if (Array.isArray(surveyArr) && typeof surveyArr[0] === 'string') {
      const surveyWithId = surveyArr.map((text, idx) => ({ id: `${prefix}${idx + 1}`, text }));
      const responseById = {};
      surveyWithId.forEach((q, idx) => {
        responseById[q.id] = Array.isArray(responseArr) ? responseArr[idx] : [];
      });
      return { surveyWithId, responseById };
    }
    if (Array.isArray(surveyArr) && typeof surveyArr[0] === 'object' && surveyArr[0].id) {
      let responseById = responseArr;
      if (Array.isArray(responseArr)) {
        responseById = {};
        surveyArr.forEach((q, idx) => {
          responseById[q.id] = responseArr[idx] || [];
        });
      }
      return { surveyWithId: surveyArr, responseById };
    }
    return { surveyWithId: [], responseById: {} };
  }

  const { surveyWithId: preSurveyWithId, responseById: preResponseById } = convertSurveyAndResponse(
    viewData?.survey_question?.['pre-survey'] || [],
    viewData?.response?.pre_response || [],
    'pre'
  );
  const { surveyWithId: postSurveyWithId, responseById: postResponseById } = convertSurveyAndResponse(
    viewData?.survey_question?.['post-survey'] || [],
    viewData?.response?.post_response || [],
    'post'
  );

  return (
    <div>
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e11d48]/10 flex items-center gap-4 mb-8">
        <div className="bg-[#e11d48]/10 rounded-full p-4 text-4xl text-[#e11d48]">
          <FaUsers />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[#e11d48]">Community Program Management</h1>
          <p className="text-gray-500 text-base">View, create, edit and analyze community programs for your organization. All in one place.</p>
        </div>
        <button onClick={handleAdd} className="bg-[#e11d48] text-white px-6 py-3 rounded-2xl font-semibold shadow hover:bg-[#be123c] text-lg flex items-center gap-2">
          + Create New Program
        </button>
      </div>
      {/* Table Section */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#e11d48]/10">
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="mt-0 overflow-x-auto">
            <table className="w-full text-left border rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-[#e11d48]/10">
                  <th className="p-3">Program Details</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Participant</th>
                  <th className="p-3">Target</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((p) => (
                  <tr key={p.program_id} className="border-b hover:bg-[#e11d48]/5 transition">
                    {/* Program Details */}
                    <td className="p-3 flex items-center gap-3">
                      <div className="bg-[#e11d48]/20 rounded-full p-2 text-2xl text-[#e11d48]">
                        <FaUsers />
                      </div>
                      <div>
                        <div className="font-bold text-base">{p.title}</div>
                        <div className="font-semibold text-xs text-[#e11d48]">{typeof p.description === 'object' ? `Host: ${p.description.host}` : ''}</div>
                        {/* Xóa dòng detail bị trùng */}
                      </div>
                    </td>
                    {/* Description */}
                    <td className="p-3 max-w-xs whitespace-pre-line">{typeof p.description === 'object' ? p.description.detail : p.description}</td>
                    {/* Date */}
                    <td className="p-3">
                      <div className="flex items-center gap-1 text-sm">
                        <FaCalendarAlt className="text-[#e11d48]" />
                        {p.start_date ? new Date(p.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        <span className="ml-2">{p.start_date ? new Date(p.start_date).toLocaleDateString() : ''}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm mt-1">
                        <FaCalendarAlt className="text-[#e11d48] opacity-60" />
                        {p.end_date ? new Date(p.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        <span className="ml-2">{p.end_date ? new Date(p.end_date).toLocaleDateString() : ''}</span>
                      </div>
                    </td>
                    {/* Location */}
                    <td className="p-3">
                      {p.location ? (
                        isUrl(p.location) ? (
                          <a href={formatUrl(p.location)} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-blue-800">{p.location}</a>
                        ) : (
                          <span>{p.location}</span>
                        )
                      ) : (
                        <span className="text-gray-400 text-sm">No location</span>
                      )}
                    </td>
                    {/* Participant */}
                    <td className="p-3">
                      <span className="bg-[#fce7ef] text-[#e11d48] px-3 py-1 rounded-full text-xs font-semibold">
                        {participantCounts[p.program_id] || 0} participants
                      </span>
                    </td>
                    {/* Target */}
                    <td className="p-3">
                      <span className="inline-block bg-[#e11d48]/10 text-[#e11d48] px-3 py-1 rounded-full text-xs font-semibold">{p.age_group}</span>
                    </td>
                    {/* Status */}
                    <td className="p-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${p.status === 'Not started' ? 'bg-gray-200 text-gray-700' : p.status === 'On going' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.status}</span>
                    </td>
                    {/* Actions */}
                    <td className="p-3 flex gap-2">
                      <button title="View" onClick={() => handleView(p)} className="bg-[#fce7ef] hover:bg-[#fbcfe8] text-[#e11d48] rounded-xl p-2 shadow flex items-center justify-center transition"><FiEye size={20} /></button>
                      <button onClick={() => handleEdit(p)} title="Edit" className="bg-[#e11d48] hover:bg-[#be123c] text-white rounded-xl p-2 shadow flex items-center justify-center transition"><MdEditSquare size={20} /></button>
                      <button onClick={() => handleDelete(p.program_id)} title="Delete" className="bg-[#fce7ef] hover:bg-[#fbcfe8] text-black rounded-xl p-2 shadow flex items-center justify-center transition"><FiTrash2 size={20} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Form add/edit */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative animate-fadeIn max-h-screen overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between bg-[#e11d48] rounded-t-2xl p-5">
                <div className="flex items-center gap-2 text-white text-2xl font-bold">
                  <MdEditSquare />
                  {editData ? 'Edit Program' : 'Add Program'}
                </div>
                <button onClick={() => setShowForm(false)} className="text-white text-2xl hover:text-gray-200"><MdClose /></button>
              </div>
              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Program Title</label>
                  <input type="text" placeholder="Program Title" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#e11d48]" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Host</label>
                  <input type="text" placeholder="Host" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#e11d48]" value={form.host} onChange={e => setForm({ ...form, host: e.target.value })} required />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Description</label>
                  <textarea placeholder="Short description" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#e11d48]" value={form.detailShort} onChange={e => setForm({ ...form, detailShort: e.target.value })} required />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Detail Content</label>
                  {form.detail.map((item, idx) => (
                    <div key={idx} className="flex gap-2 mb-2 items-center">
                      <select value={item.text !== undefined ? 'text' : 'img'} onChange={e => handleDetailChange(idx, e.target.value, '')} className="p-2 border rounded">
                        <option value="text">Text</option>
                        <option value="img">Image</option>
                      </select>
                      {item.text !== undefined ? (
                        <input type="text" className="flex-1 p-2 border rounded" placeholder="Text content" value={item.text} onChange={e => handleDetailChange(idx, 'text', e.target.value)} />
                      ) : (
                        <input type="text" className="flex-1 p-2 border rounded" placeholder="Image URL" value={item.img} onChange={e => handleDetailChange(idx, 'img', e.target.value)} />
                      )}
                      <button type="button" onClick={() => handleRemoveDetail(idx)} className="bg-gray-200 px-2 rounded hover:bg-gray-300">-</button>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <button type="button" onClick={() => handleAddDetail('text')} className="bg-[#e11d48] text-white px-3 py-1 rounded font-semibold">+ Text</button>
                    <button type="button" onClick={() => handleAddDetail('img')} className="bg-[#e11d48] text-white px-3 py-1 rounded font-semibold">+ Image</button>
                  </div>
                </div>
                <div className="mb-4 flex gap-4">
                  <div className="flex-1">
                    <label className="block font-semibold mb-1">Start Date</label>
                    <input type="datetime-local" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#e11d48]" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required placeholder="Select start date and time" onFocus={e => e.target.showPicker && e.target.showPicker()} />
                  </div>
                  <div className="flex-1">
                    <label className="block font-semibold mb-1">End Date</label>
                    <input type="datetime-local" className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#e11d48]" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} required placeholder="Select end date and time" onFocus={e => e.target.showPicker && e.target.showPicker()} />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Location Link</label>
                  <input 
                    type="text" 
                    placeholder="Location (address or link)" 
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#e11d48]"
                    value={form.location} 
                    onChange={e => setForm({ ...form, location: e.target.value })} 
                  />
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Target Age Group</label>
                  <select className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#e11d48]" value={form.age_group || ''} onChange={e => setForm({ ...form, age_group: e.target.value })} required>
                    <option value="">Select age group</option>
                    <option value="Teenagers">Teenagers</option>
                    <option value="Young Adult (20-30)">Young Adult (20-30)</option>
                    <option value="Adult (30+)">Adult (30+)</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Pre-survey Questions</label>
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="text-sm text-gray-600 mb-2">These questions will be asked before the program starts</div>
                    {form.preSurvey.map((q, idx) => (
                      <div key={q.id} className="flex gap-2 mb-2 items-center">
                        <div className="flex-shrink-0 w-6 h-6 bg-[#e11d48] text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <input 
                          type="text" 
                          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#e11d48]" 
                          placeholder={`Question ${idx + 1} (e.g., Have you ever used drugs?)`}
                          value={q.text} 
                          onChange={e => handleSurveyChange('preSurvey', idx, e.target.value)} 
                          required 
                        />
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSurvey('preSurvey', idx)} 
                          className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 font-semibold text-sm"
                          disabled={form.preSurvey.length === 1}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => handleAddSurvey('preSurvey')} 
                      className="bg-[#e11d48] text-white px-4 py-2 rounded font-semibold hover:bg-[#be123c] text-sm"
                    >
                      + Add Pre-survey Question
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Post-survey Questions</label>
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <div className="text-sm text-gray-600 mb-2">These questions will be asked after the program ends</div>
                    {form.postSurvey.map((q, idx) => (
                      <div key={q.id} className="flex gap-2 mb-2 items-center">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <input 
                          type="text" 
                          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#e11d48]" 
                          placeholder={`Question ${idx + 1} (e.g., Did this program help you?)`}
                          value={q.text} 
                          onChange={e => handleSurveyChange('postSurvey', idx, e.target.value)} 
                          required 
                        />
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSurvey('postSurvey', idx)} 
                          className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 font-semibold text-sm"
                          disabled={form.postSurvey.length === 1}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => handleAddSurvey('postSurvey')} 
                      className="bg-[#e11d48] text-white px-4 py-2 rounded font-semibold hover:bg-[#be123c] text-sm"
                    >
                      + Add Post-survey Question
                    </button>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 bg-gray-200 rounded font-semibold hover:bg-gray-300">Cancel</button>
                  <button type="submit" className="px-5 py-2 bg-[#e11d48] text-white rounded font-semibold hover:bg-[#be123c]">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showView && viewData && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative animate-fadeIn p-0 max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-3 p-8 pb-2">
                <div className="bg-[#e11d48]/10 rounded-full p-4 text-3xl text-[#e11d48]">
                  <FaUsers />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb+1">Community Program</div>
                  <div className="flex flex-col items-start">
                    <h2 className="text-2xl font-bold text-[#e11d48]">{viewData.title || 'No Title'}</h2>
                    <div className="text-gray-500 text-sm -mt-4 pl-1">Host: {typeof viewData.description === 'object' ? viewData.description.host : ''}</div>
                  </div>
                </div>
                <button onClick={() => setShowView(false)} className="absolute top-2 right-4 text-5xl text-gray-400 hover:text-[#e11d48] font-bold cursor-pointer z-10 p-2">×</button>
              </div>
              {/* Info + Content */}
              <div className="overflow-y-auto px-8 pb-8" style={{maxHeight: 'calc(90vh - 80px)'}}>
                {/* Info */}
                <div className="mb-4">
                  <div className="font-semibold">Description:</div>
                  <div className="mb-2">{typeof viewData.description === 'object' ? viewData.description.detail : viewData.description}</div>
                  <div className="flex gap-6 text-sm mb-2">
                    <div><b>Start:</b> {viewData.start_date ? new Date(viewData.start_date).toLocaleString() : ''}</div>
                    <div><b>End:</b> {viewData.end_date ? new Date(viewData.end_date).toLocaleString() : ''}</div>
                  </div>
                  <div className="flex gap-6 text-sm mb-2">
                    <div>
                      <b>Location:</b>{' '}
                      {viewData.location ? (
                        isUrl(viewData.location) ? (
                          <a href={formatUrl(viewData.location)} target="_blank" rel="noopener noreferrer" className="underline text-blue-600 hover:text-blue-800">{viewData.location}</a>
                        ) : (
                          <span>{viewData.location}</span>
                        )
                      ) : (
                        <span className="text-gray-400 ml-1">No location</span>
                      )}
                    </div>
                    <div><b>Target:</b> {viewData.age_group}</div>
                    <div><b>Status:</b> <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${viewData.status === 'Not started' ? 'bg-gray-200 text-gray-700' : viewData.status === 'On going' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{viewData.status}</span></div>
                  </div>
                </div>
                {/* Members */}
                <div className="mb-4">
                  <div className="font-semibold mb-1">Participants ({viewMembers.length}):</div>
                  <ul className="max-h-32 overflow-y-auto text-sm pl-4 list-disc">
                    {viewMembers.length === 0 ? <li>No members.</li> : viewMembers.map((m, i) => <li key={i}>{m.fullname} ({m.status})</li>)}
                  </ul>
                </div>
                {/* Survey Questions */}
                <div className="mb-4">
                  <div className="font-semibold mb-2 text-[#e11d48]">Survey Responses:</div>
                  
                  {/* Pre-survey Responses */}
                  <div className="mb-4">
                    <div className="font-medium mb-2 text-sm text-gray-600">Pre-survey Responses:</div>
                    <table className="w-full mb-4 border rounded-xl overflow-hidden">
                      <thead className="bg-[#fce7ef]">
                        <tr>
                          <th className="p-2 text-left text-sm w-1/2">Question</th>
                          <th className="p-2 text-left text-sm">Responses</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Trước khi render bảng, chuyển đổi dữ liệu cũ sang mới */}
                        {/* Thêm hàm convertSurveyAndResponse trong component (trước return) */}
                        {preSurveyWithId.map((q, i) => (
                          <tr key={q.id} className="border-b align-top">
                            <td className="p-2 font-medium text-sm">{q.text}</td>
                            <td className="p-2">
                              {preResponseById[q.id]?.length > 0 ? (
                                <ul className="space-y-1">
                                  {preResponseById[q.id].map((ans, idx) => (
                                    <li key={idx} className="inline-block bg-[#e11d48]/10 text-[#e11d48] px-3 py-1 rounded-lg text-xs font-semibold mb-1 mr-2">
                                      {ans}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-gray-400 text-xs italic">No responses yet</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Post-survey Responses */}
                  <div className="mb-4">
                    <div className="font-medium mb-2 text-sm text-gray-600">Post-survey Responses:</div>
                    <table className="w-full border rounded-xl overflow-hidden">
                      <thead className="bg-[#fce7ef]">
                        <tr>
                          <th className="p-2 text-left text-sm w-1/2">Question</th>
                          <th className="p-2 text-left text-sm">Responses</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Trước khi render bảng, chuyển đổi dữ liệu cũ sang mới */}
                        {postSurveyWithId.map((q, i) => (
                          <tr key={q.id} className="border-b align-top">
                            <td className="p-2 font-medium text-sm">{q.text}</td>
                            <td className="p-2">
                              {postResponseById[q.id]?.length > 0 ? (
                                <ul className="space-y-1">
                                  {postResponseById[q.id].map((ans, idx) => (
                                    <li key={idx} className="inline-block bg-[#e11d48]/10 text-[#e11d48] px-3 py-1 rounded-lg text-xs font-semibold mb-1 mr-2">
                                      {ans}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-gray-400 text-xs italic">No responses yet</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityProgramManagement; 