import React, { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaClipboardList, FaChartBar, FaUsers, FaClock, FaPercentage, FaQuestionCircle, FaListAlt, FaDatabase, FaSave, FaVideo, FaCog } from 'react-icons/fa';
import axios from 'axios';

const surveyTypes = ['All', 'ASSIST', 'CRAFFT', 'Education', 'Feedback', 'Assessment'];
const surveyStatuses = ['All', 'Active', 'Inactive'];

const SurveyManagement = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewSurvey, setViewSurvey] = useState(null);
  const [editSurvey, setEditSurvey] = useState(null);
  const [deleteSurvey, setDeleteSurvey] = useState(null);
  const [createSurveyModal, setCreateSurveyModal] = useState(false);
  
  // State for existing surveys
  const [existingSurveys, setExistingSurveys] = useState([]);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [errorExisting, setErrorExisting] = useState(null);
  
  // State for managed surveys (CRUD operations)
  const [managedSurveys, setManagedSurveys] = useState([]);
  const [loadingManaged, setLoadingManaged] = useState(false);
  
  // Tab state
  const [activeTab, setActiveTab] = useState('existing'); // 'existing' or 'managed'

  // Create survey form data
  const [newSurvey, setNewSurvey] = useState({
    survey_type: '',
    content: []
  });

  // Edit survey form data  
  const [editSurveyData, setEditSurveyData] = useState({
    survey_id: '',
    content: []
  });

  // Survey Content Management
  const [contentData, setContentData] = useState([]);
  const [showContentEditor, setShowContentEditor] = useState(false);

  // Thêm state để biết đang edit item nào
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Fetch existing surveys from database
  const fetchExistingSurveys = async () => {
    try {
      setLoadingExisting(true);
      setErrorExisting(null);
      
      const response = await fetch('http://localhost:3000/api/survey/view-survey', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Existing surveys data:', data);
      
      // Transform data to match our display format
      const transformedData = Array.isArray(data) ? data.map(survey => ({
        ...survey,
        // Map backend fields to display fields
        name: survey.survey_type,
        type: survey.survey_type,
        status: 'Active',
        participants: survey.total_participants || 0,
        totalQuestions: survey.total_questions || 0,
        completionRate: survey.completion_rate || 0,
        avgTime: survey.avg_time || 'N/A',
        responses: survey.responses || 0,
        targetAudience: survey.target_audience || 'General',
        description: survey.description || `Survey for ${survey.survey_type} assessment`,
        duration: survey.duration || '30 days',
        lastResponse: survey.last_response || 'N/A'
      })) : [];
      
      setExistingSurveys(transformedData);
    } catch (err) {
      console.error('Error fetching existing surveys:', err);
      setErrorExisting('Failed to fetch existing surveys');
      setExistingSurveys([]);
    } finally {
      setLoadingExisting(false);
    }
  };

  // Create survey API call
  const handleCreateSurvey = async (e) => {
    e.preventDefault();
    if (!newSurvey.survey_type || !Array.isArray(newSurvey.content) || newSurvey.content.length === 0) {
      alert('Vui lòng nhập loại survey và ít nhất 1 câu hỏi/nội dung!');
      return;
    }
    try {
      await axios.post('http://localhost:3000/api/manager/survey/create', {
        survey_type: newSurvey.survey_type.trim(),
        content: newSurvey.content
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Survey created successfully!');
      setCreateSurveyModal(false);
      setNewSurvey({
        survey_type: '',
        content: []
      });
      // ...update managedSurveys nếu cần...
    } catch (err) {
      alert('Error creating survey: ' + (err.response?.data?.message || err.message));
    }
  };

  // Update survey API call
  const handleUpdateSurvey = async (e) => {
    e.preventDefault();
    if (!editSurveyData.survey_id || !Array.isArray(editSurveyData.content) || editSurveyData.content.length === 0) {
      alert('Vui lòng chọn survey và nhập ít nhất 1 câu hỏi/nội dung!');
      return;
    }
    try {
      await axios.post('http://localhost:3000/api/manager/survey/update', {
        survey_id: editSurveyData.survey_id,
        content: editSurveyData.content
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Survey updated successfully!');
      setEditSurvey(null);
      setEditSurveyData({
        survey_id: '',
        content: []
      });
      // Fetch lại danh sách survey để cập nhật UI
      fetchExistingSurveys();
    } catch (err) {
      alert('Error updating survey: ' + (err.response?.data?.message || err.message));
    }
  };

  // Delete survey API call
  const handleDeleteSurvey = async () => {
    try {
      await fetch(`http://localhost:3000/api/manager/survey/delete/${deleteSurvey.survey_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      alert('Survey deleted successfully!');
      setDeleteSurvey(null);
      
      // Remove from managed surveys list
      setManagedSurveys(prev => prev.filter(survey => survey.survey_id !== deleteSurvey.survey_id));
      
    } catch (err) {
      console.error('Error deleting survey:', err);
      alert(`Error deleting survey: ${err.message}`);
    }
  };

  // Helper function to safely parse survey content
  const parseSurveyContent = (content) => {
    if (!content) return [];
    
    try {
      if (typeof content === 'string') {
        return JSON.parse(content);
      }
      if (Array.isArray(content)) {
        return content;
      }
      return [];
    } catch (error) {
      console.error('Error parsing survey content:', error);
      return [];
    }
  };

  // Survey Content Management Functions
  const openContentEditor = (survey) => {
    setEditSurvey(survey);
    
    // Parse content safely
    const parsedContent = parseSurveyContent(survey.content);
    
    setContentData(parsedContent);
    setEditSurveyData({
      survey_id: survey.survey_id || survey.id,
      content: parsedContent
    });
    setShowContentEditor(true);
  };

  // Add new question to content
  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: "",
      type: "single_choice",
      options: [
        { text: "", score: 0 }
      ]
    };
    
    const updatedContent = [...contentData, newQuestion];
    setContentData(updatedContent);
    setEditSurveyData(prev => ({
      ...prev,
      content: updatedContent
    }));
  };

  // Add video section
  const addVideoSection = () => {
    const newVideoSection = {
      id: Date.now(),
      video: "",
      quiz: []
    };
    
    const updatedContent = [...contentData, newVideoSection];
    setContentData(updatedContent);
    setEditSurveyData(prev => ({
      ...prev,
      content: updatedContent
    }));
  };

  // Delete question/section
  const deleteContentItem = (index) => {
    const updatedContent = contentData.filter((_, i) => i !== index);
    setContentData(updatedContent);
    setEditSurveyData(prev => ({
      ...prev,
      content: updatedContent
    }));
  };

  // Update question
  const updateQuestion = (index, field, value) => {
    const updatedContent = [...contentData];
    updatedContent[index] = {
      ...updatedContent[index],
      [field]: value
    };
    setContentData(updatedContent);
    setEditSurveyData(prev => ({
      ...prev,
      content: updatedContent
    }));
  };

  // Add option to question
  const addOption = (questionIndex) => {
    const updatedContent = [...contentData];
    if (!updatedContent[questionIndex].options) {
      updatedContent[questionIndex].options = [];
    }
    updatedContent[questionIndex].options.push({ text: "", score: 0 });
    setContentData(updatedContent);
    setEditSurveyData(prev => ({
      ...prev,
      content: updatedContent
    }));
  };

  // Update option
  const updateOption = (questionIndex, optionIndex, field, value) => {
    const updatedContent = [...contentData];
    updatedContent[questionIndex].options[optionIndex] = {
      ...updatedContent[questionIndex].options[optionIndex],
      [field]: field === 'score' ? parseInt(value) || 0 : value
    };
    setContentData(updatedContent);
    setEditSurveyData(prev => ({
      ...prev,
      content: updatedContent
    }));
  };

  // Delete option
  const deleteOption = (questionIndex, optionIndex) => {
    const updatedContent = [...contentData];
    updatedContent[questionIndex].options = updatedContent[questionIndex].options.filter((_, i) => i !== optionIndex);
    setContentData(updatedContent);
    setEditSurveyData(prev => ({
      ...prev,
      content: updatedContent
    }));
  };

  // Add quiz question to video section
  const addQuizQuestion = (sectionIndex) => {
    const updatedContent = [...contentData];
    if (!updatedContent[sectionIndex].quiz) {
      updatedContent[sectionIndex].quiz = [];
    }
    updatedContent[sectionIndex].quiz.push({
      question: "",
      options: [{ text: "", score: 0 }]
    });
    setContentData(updatedContent);
    setEditSurveyData(prev => ({
      ...prev,
      content: updatedContent
    }));
  };

  // Save content changes
  const saveContentChanges = async () => {
    try {
      await fetch('http://localhost:3000/api/manager/survey/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editSurveyData)
      });

      alert('Survey content updated successfully!');
      setShowContentEditor(false);
      
      // Update managed surveys list
      setManagedSurveys(prev => prev.map(survey => 
        survey.survey_id === editSurveyData.survey_id 
          ? {
              ...survey,
              content: editSurveyData.content,
              totalQuestions: editSurveyData.content.length
            }
          : survey
      ));
      
    } catch (err) {
      console.error('Error updating survey content:', err);
      alert(`Error updating survey content: ${err.message}`);
    }
  };

  // Load surveys on component mount
  useEffect(() => {
    fetchExistingSurveys().then(data => console.log('Fetched surveys:', data));
    // Initially, managed surveys will be empty until user creates them
    // They get added to managedSurveys state when created via handleCreateSurvey
  }, []);

  // Get current surveys based on active tab
  const getCurrentSurveys = () => {
    return activeTab === 'existing' ? existingSurveys : managedSurveys;
  };

  // Update filtered surveys to use current data
  const filteredSurveys = getCurrentSurveys().filter(survey => {
    const matchesSearch = survey.name?.toLowerCase().includes(search.toLowerCase()) || 
                         survey.survey_type?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || survey.type === typeFilter || survey.survey_type === typeFilter;
    const matchesStatus = statusFilter === 'All' || survey.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Handle edit survey modal open
  const openEditModal = (survey) => {
    setEditSurvey(survey);
    setEditSurveyData({
      survey_id: survey.survey_id,
      content: survey.content || []
    });
  };

  const getCompletionColor = (rate) => {
    if (rate >= 90) return 'bg-green-500';
    if (rate >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const isLoading = activeTab === 'existing' ? loadingExisting : loadingManaged;
  const error = activeTab === 'existing' ? errorExisting : null;

  // Hàm mở form edit cho 1 item (câu hỏi hoặc video section)
  const openEditItem = (item, idx) => {
    setEditingIndex(idx);
    // Normalize options: nếu là mảng string thì chuyển thành object
    let normalizedOptions = Array.isArray(item.options)
      ? item.options.map(opt => typeof opt === 'string' ? { text: opt, score: 0 } : opt)
      : [];
    setEditingItem({ ...item, options: normalizedOptions });
  };

  // Hàm lưu thay đổi cho item đang edit
  const saveEditItem = () => {
    if (editingIndex === null) return;
    const updated = [...contentData];
    updated[editingIndex] = editingItem;
    setContentData(updated);
    setEditSurveyData(prev => ({ ...prev, content: updated }));
    setEditingIndex(null);
    setEditingItem(null);
  };

  // Hàm hủy edit
  const cancelEditItem = () => {
    setEditingIndex(null);
    setEditingItem(null);
  };

  // Hàm thêm option cho câu hỏi đang edit
  const addEditingOption = () => {
    if (!editingItem.options) editingItem.options = [];
    editingItem.options.push({ text: '', score: 0 });
    setEditingItem({ ...editingItem });
  };

  // Hàm xóa option cho câu hỏi đang edit
  const deleteEditingOption = (optIdx) => {
    editingItem.options = editingItem.options.filter((_, i) => i !== optIdx);
    setEditingItem({ ...editingItem });
  };

  // Hàm cập nhật option cho câu hỏi đang edit
  const updateEditingOption = (optIdx, field, value) => {
    editingItem.options[optIdx][field] = field === 'score' ? parseInt(value) || 0 : value;
    setEditingItem({ ...editingItem });
  };

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-[#faf5ff] via-[#f3e8ff] to-[#f8fafc] p-0 rounded-2xl shadow-lg">
      {/* Header with purple gradient and large clipboard icon */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-8 bg-white rounded-t-3xl shadow border-b border-[#e11d48]/20">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-full p-4 shadow border-2 border-[#e11d48]/30">
            <FaClipboardList className="text-4xl text-[#e11d48]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#e11d48] mb-1 drop-shadow">Survey Management</h1>
            <p className="text-[#be123c] text-sm md:text-base max-w-xl font-medium">
              View, create, edit and analyze surveys for your community. All in one place.
            </p>
          </div>
        </div>
        <button 
          className="flex items-center gap-2 bg-[#e11d48] hover:bg-[#be123c] text-white font-bold px-7 py-3 rounded-2xl shadow transition-all duration-200 text-base"
          onClick={() => setCreateSurveyModal(true)}
        >
          <FaPlus /> Create New Survey
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-[#fff] border-b-4 border-[#e11d48] px-8 mt-0 z-10 relative">
        <button
          className={`flex items-center gap-2 px-6 pb-4 pt-3 font-semibold transition-all duration-200
            ${activeTab === 'existing'
              ? 'text-[#e11d48] bg-[#fff1f2] font-extrabold z-10'
              : 'text-gray-500 hover:text-[#e11d48] hover:bg-[#fff1f2]'}
          `}
          onClick={() => setActiveTab('existing')}
        >
          <FaDatabase className="text-lg" />
          Existing Surveys ({existingSurveys.length})
        </button>
        <button
          className={`flex items-center gap-2 px-6 pb-4 pt-3 font-semibold transition-all duration-200
            ${activeTab === 'managed'
              ? 'text-[#e11d48] bg-[#fff1f2] font-extrabold z-10'
              : 'text-gray-500 hover:text-[#e11d48] hover:bg-[#fff1f2]'}
          `}
          onClick={() => setActiveTab('managed')}
        >
          <FaListAlt className="text-lg" />
          Managed Surveys ({managedSurveys.length})
        </button>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-4 bg-white border-b border-[#e11d48]/10">
        <div className="flex items-center gap-2 bg-[#fff1f2] rounded-xl px-3 py-2 shadow w-full md:w-1/3 border border-[#e11d48]/10">
          <FaSearch className="text-[#e11d48]" />
          <input
            type="text"
            placeholder="Search surveys..."
            className="outline-none border-none flex-1 bg-transparent text-black"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="rounded-lg border border-[#e11d48]/20 px-3 py-2 text-sm text-black focus:ring-[#e11d48] focus:border-[#e11d48]"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            {surveyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            className="rounded-lg border border-[#e11d48]/20 px-3 py-2 text-sm text-black focus:ring-[#e11d48] focus:border-[#e11d48]"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            {surveyStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {activeTab === 'existing' && (
            <button
              onClick={fetchExistingSurveys}
              className="px-4 py-2 bg-[#e11d48] text-white rounded-lg hover:bg-[#be123c] transition-colors flex items-center gap-2 font-bold shadow"
            >
              <FaDatabase className="text-sm" />
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* Survey Table */}
      <div className="overflow-auto rounded-b-3xl shadow bg-white mt-0 flex-1 border border-[#e11d48]/10">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#fff1f2] text-[#e11d48] border-b border-[#e11d48]/20">
            <tr>
              <th className="px-4 py-3 font-bold">Survey Details</th>
              <th className="px-4 py-3 font-bold">Progress</th>
              <th className="px-4 py-3 font-bold">Statistics</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">Version</th>
              <th className="px-4 py-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8b5cf6] mx-auto"></div>
                  <p className="mt-2 text-gray-500">
                    {activeTab === 'existing' ? 'Loading existing surveys...' : 'Loading managed surveys...'}
                  </p>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="text-center py-8">
                  <p className="text-red-500">{error}</p>
                  {activeTab === 'existing' && (
                    <button 
                      onClick={fetchExistingSurveys}
                      className="mt-2 px-4 py-2 bg-[#8b5cf6] text-white rounded-lg hover:bg-[#a855f7]"
                    >
                      Retry
                    </button>
                  )}
                </td>
              </tr>
            ) : filteredSurveys.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  {activeTab === 'existing' 
                    ? 'No existing surveys found in database.' 
                    : 'No managed surveys found. Create your first survey!'
                  }
                </td>
              </tr>
            ) : (
              filteredSurveys.map(survey => (
                <tr key={survey.survey_id} className="border-b last:border-b-0 hover:bg-[#fff1f2] transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#e11d48] to-[#be123c] flex items-center justify-center text-white font-bold">
                        <FaClipboardList />
                      </div>
                      <div>
                        <div className="font-semibold text-black">
                          {survey.name || survey.survey_type}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <span className="inline-block px-2 py-1 rounded-full bg-[#e11d48]/20 text-[#e11d48] font-bold text-xs border border-[#e11d48]/30">
                            {survey.type || survey.survey_type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-black">
                        <span>Completion</span>
                        <span className="font-bold">{survey.completionRate || survey.completion_rate || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getCompletionColor(survey.completionRate || survey.completion_rate || 0)}`}
                          style={{ width: `${survey.completionRate || survey.completion_rate || 0}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {survey.responses || 0}/{survey.participants || survey.total_participants || 0} responses
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1 text-black">
                      <div className="flex items-center gap-1 text-xs">
                        <FaQuestionCircle className="text-[#e11d48]" /> 
                        {survey.totalQuestions || survey.total_questions || 0} questions
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <FaClock className="text-[#e11d48]" /> 
                        {survey.avgTime || survey.avg_time || 'N/A'} avg
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <FaUsers className="text-[#e11d48]" /> 
                        {survey.targetAudience || survey.target_audience || 'General'}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                      <FaCheckCircle className="text-green-500" /> Active
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-[#e11d48]">
                    {survey.version ? Number(survey.version).toFixed(1) : ''}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      className="p-2 rounded-xl bg-[#fff1f2] hover:bg-[#e11d48]/10 text-[#e11d48] border border-[#e11d48]/20 shadow transition-colors duration-150"
                      title="View Details"
                      onClick={() => setViewSurvey(survey)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="p-2 rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white border border-[#e11d48]/20 shadow transition-colors duration-150"
                      title="Edit Survey Content"
                      onClick={() => openContentEditor(survey)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="p-2 rounded-xl bg-white hover:bg-[#fff1f2] text-[#e11d48] border border-[#e11d48]/20 shadow transition-colors duration-150"
                      title="Delete Survey"
                      onClick={() => setDeleteSurvey(survey)}
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

      {/* Create Survey Modal */}
      {createSurveyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-0 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden animate-fade-in border border-gray-100">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">✨ Create New Survey</h2>
                <p className="text-indigo-100">Build an engaging survey for assessment or education</p>
              </div>
              <button
                type="button"
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm"
                onClick={() => setNewSurvey({
                  survey_type: 'ASSIST',
                  description: 'Sample survey for drug use assessment',
                  content: [
                    {
                      id: 1,
                      question: 'In your lifetime, have you ever used any of the following substances?',
                      type: 'multiple_choice',
                      options: [
                        { text: 'Cannabis' },
                        { text: 'Heroin, opium' },
                        { text: 'Methamphetamine (crystal meth)' },
                        { text: 'Ecstasy (MDMA)' },
                        { text: 'Sedatives (benzodiazepines, diazepam, etc.)' },
                        { text: 'Inhalants (glue, paint, gases)' },
                        { text: 'Other' }
                      ]
                    },
                    {
                      id: 2,
                      question: 'In the past 3 months, have you used any of these substances?',
                      type: 'single_choice',
                      options: [
                        { text: 'No', score: 0 },
                        { text: 'Yes', score: 3 }
                      ]
                    }
                  ]
                })}
              >
                🎯 Load Sample Data
              </button>
              <button
                className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200 ml-2"
                onClick={() => setCreateSurveyModal(false)}
              >
                ✕
              </button>
            </div>
            {/* Content Section */}
            <div className="overflow-y-auto max-h-[calc(95vh-100px)] p-8 bg-gradient-to-br from-gray-50 to-indigo-50">
              {/* Basic Survey Info */}
              <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  📝 Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Survey Type *</label>
                    <input
                      className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="Enter survey type..."
                      value={newSurvey.survey_type}
                      onChange={e => setNewSurvey(s => ({ ...s, survey_type: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <input
                      className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      placeholder="Describe this survey..."
                      value={newSurvey.description || ''}
                      onChange={e => setNewSurvey(s => ({ ...s, description: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              {/* Survey Content */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  📋 Survey Content
                </h3>
                {newSurvey.content.map((q, qIdx) => (
                  <div key={q.id} className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-6 border border-indigo-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                          {qIdx + 1}
                        </div>
                        <input
                          className="flex-1 border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter question..."
                          value={q.question}
                          onChange={e => {
                            const updated = [...newSurvey.content];
                            updated[qIdx].question = e.target.value;
                            setNewSurvey(s => ({ ...s, content: updated }));
                          }}
                        />
                      </div>
                      {newSurvey.content.length > 1 && (
                        <button
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 ml-2"
                          onClick={() => {
                            const updated = newSurvey.content.filter((_, i) => i !== qIdx);
                            setNewSurvey(s => ({ ...s, content: updated }));
                          }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                    <div className="flex gap-4 mb-4">
                      <label className="text-sm font-medium text-gray-700">Type</label>
                      <select
                        className="border border-gray-200 p-2 rounded-lg"
                        value={q.type}
                        onChange={e => {
                          const updated = [...newSurvey.content];
                          updated[qIdx].type = e.target.value;
                          // Reset options nếu đổi loại
                          if (e.target.value === 'multiple_choice') {
                            updated[qIdx].options = [{ text: '' }];
                          } else {
                            updated[qIdx].options = [{ text: '', score: 0 }];
                          }
                          setNewSurvey(s => ({ ...s, content: updated }));
                        }}
                      >
                        <option value="single_choice">Single Choice</option>
                        <option value="multiple_choice">Multiple Choice</option>
                      </select>
                    </div>
                    <div className="space-y-2 ml-8">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex gap-2 mb-1 items-center">
                          <input
                            className="flex-1 border border-gray-200 p-2 rounded-lg"
                            placeholder="Option text"
                            value={opt.text}
                            onChange={e => {
                              const updated = [...newSurvey.content];
                              updated[qIdx].options[oIdx].text = e.target.value;
                              setNewSurvey(s => ({ ...s, content: updated }));
                            }}
                          />
                          {q.type === 'single_choice' && (
                            <input
                              type="number"
                              className="w-20 border border-gray-200 p-2 rounded-lg"
                              placeholder="Score"
                              value={opt.score}
                              onChange={e => {
                                const updated = [...newSurvey.content];
                                updated[qIdx].options[oIdx].score = parseInt(e.target.value) || 0;
                                setNewSurvey(s => ({ ...s, content: updated }));
                              }}
                            />
                          )}
                          {q.options.length > 1 && (
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => {
                                const updated = [...newSurvey.content];
                                updated[qIdx].options = updated[qIdx].options.filter((_, i) => i !== oIdx);
                                setNewSurvey(s => ({ ...s, content: updated }));
                              }}
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 mt-1"
                        onClick={() => {
                          const updated = [...newSurvey.content];
                          if (q.type === 'multiple_choice') {
                            updated[qIdx].options.push({ text: '' });
                          } else {
                            updated[qIdx].options.push({ text: '', score: 0 });
                          }
                          setNewSurvey(s => ({ ...s, content: updated }));
                        }}
                      >
                        + Add Option
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="w-full border-2 border-dashed border-indigo-300 bg-indigo-50 hover:bg-indigo-100 p-6 rounded-2xl text-indigo-600 hover:text-indigo-700 font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={() => {
                    const maxId = Math.max(0, ...newSurvey.content.map(q => q.id || 0));
                    setNewSurvey(s => ({
                      ...s,
                      content: [
                        ...s.content,
                        {
                          id: maxId + 1,
                          question: '',
                          type: 'single_choice',
                          options: [{ text: '', score: 0 }]
                        }
                      ]
                    }));
                  }}
                >
                  ➕ Add Question
                </button>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-4 justify-end pt-6">
                <button
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-all duration-200"
                  onClick={() => setCreateSurveyModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={handleCreateSurvey}
                >
                  Create Survey
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced View Survey Modal */}
      {viewSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-[#8b5cf6] text-xl" onClick={() => setViewSurvey(null)}>&times;</button>
            
            {/* Header with icon and basic info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 pb-6 border-b">
              <div className="flex flex-col items-center md:items-start col-span-1">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#8b5cf6] to-[#c084fc] flex items-center justify-center text-white text-3xl shadow-lg mb-2">
                  <FaClipboardList />
                </div>
                <h2 className="text-xl font-bold text-[#8b5cf6] mb-1 text-center md:text-left">{viewSurvey.name || viewSurvey.survey_type}</h2>
                <span className="text-xs text-gray-500">{viewSurvey.createdAt || viewSurvey.created_at}</span>
              </div>
              <div className="col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium">Status</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold w-fit">
                    <FaCheckCircle className="text-green-500" /> Active
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium">Version</span>
                  <span className="text-xs font-bold text-[#e11d48]">{viewSurvey.version ? Number(viewSurvey.version).toFixed(1) : ''}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium">Type</span>
                  <span className="inline-block px-2 py-1 rounded-full bg-[#c084fc] text-white font-bold text-xs">{viewSurvey.type || viewSurvey.survey_type}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium">Audience</span>
                  <span className="text-xs text-black">{viewSurvey.targetAudience || viewSurvey.target_audience}</span>
                </div>
                <div className="flex flex-col gap-1 col-span-2 md:col-span-3">
                  <span className="text-xs text-gray-500 font-medium">Description</span>
                  <span className="text-xs text-black">{viewSurvey.description}</span>
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#faf5ff] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#8b5cf6]">{viewSurvey.participants || viewSurvey.total_participants || 0}</div>
                <div className="text-xs text-black">Participants</div>
              </div>
              <div className="bg-[#faf5ff] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#a855f7]">{viewSurvey.responses || 0}</div>
                <div className="text-xs text-black">Responses</div>
              </div>
              <div className="bg-[#faf5ff] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#c084fc]">{viewSurvey.completionRate || viewSurvey.completion_rate || 0}%</div>
                <div className="text-xs text-black">Completion</div>
              </div>
              <div className="bg-[#faf5ff] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#8b5cf6]">{viewSurvey.totalQuestions || viewSurvey.total_questions || 0}</div>
                <div className="text-xs text-black">Questions</div>
              </div>
            </div>

            {/* Detailed information grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Survey Details */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-[#8b5cf6] mb-3 flex items-center gap-2">
                  <FaClipboardList /> Survey Details
                </h3>
                <div className="space-y-2 text-black">
                  <div><b>Type:</b> <span className="inline-block px-2 py-1 rounded-full bg-[#c084fc] text-white font-bold text-xs">{viewSurvey.type || viewSurvey.survey_type}</span></div>
                  <div><b>Target Audience:</b> {viewSurvey.targetAudience || viewSurvey.target_audience}</div>
                </div>
              </div>

              {/* Progress Information */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-[#8b5cf6] mb-3 flex items-center gap-2">
                  <FaChartBar /> Progress Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-black text-sm mb-1">
                      <span>Completion Rate</span>
                      <span className="font-bold">{viewSurvey.completionRate || viewSurvey.completion_rate || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getCompletionColor(viewSurvey.completionRate || viewSurvey.completion_rate || 0)}`}
                        style={{ width: `${viewSurvey.completionRate || viewSurvey.completion_rate || 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-black text-sm">
                    <div><b>Responses:</b> {viewSurvey.responses || 0}/{viewSurvey.participants || viewSurvey.total_participants || 0}</div>
                    <div><b>Last Response:</b> {viewSurvey.lastResponse || viewSurvey.last_response}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Survey Content Display */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-bold text-[#8b5cf6] mb-4 flex items-center gap-2">
                <FaQuestionCircle /> Survey Content
              </h3>
              
              {(() => {
                const parsedContent = parseSurveyContent(viewSurvey.content);
                
                if (parsedContent.length === 0) {
                  return (
                    <div className="text-center py-8 text-gray-500">
                      <FaQuestionCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>No content available for this survey</p>
                      <p className="text-sm">The survey content may not be loaded or doesn't exist.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {parsedContent.map((item, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                        {/* Video Section */}
                        {item.video && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">Video</span>
                            </div>
                            <a 
                              href={String(item.video)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm break-all"
                            >
                              {String(item.video)}
                            </a>
                          </div>
                        )}

                        {/* Direct Question (for Assessment type) */}
                        {item.question && (
                          <div className="mb-4">
                            <div className="font-semibold text-gray-800 mb-2">
                              Q{index + 1}: {String(item.question)}
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              Type: {String(item.type) === 'single_choice' ? 'Single Choice' : 'Multiple Choice'}
                            </div>
                            <div className="space-y-1">
                              {item.options?.map((option, optIndex) => (
                                <div key={optIndex} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                  <span className="text-sm">{typeof option === 'string' ? String(option) : String(option.text || '')}</span>
                                  {typeof option === 'object' && option.score !== undefined && (
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                                      Score: {option.score}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Quiz Section (for Education type) */}
                        {item.quiz && Array.isArray(item.quiz) && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">Quiz</span>
                              <span className="text-sm text-gray-600">{item.quiz.length} questions</span>
                            </div>
                            <div className="space-y-3">
                              {item.quiz.map((question, qIndex) => (
                                <div key={qIndex} className="bg-gray-50 p-3 rounded">
                                  <div className="font-medium text-gray-800 mb-2">
                                    {qIndex + 1}. {String(question.question || '')}
                                  </div>
                                  <div className="space-y-1">
                                    {question.options?.map((option, oIndex) => (
                                      <div key={oIndex} className="flex justify-between items-center bg-white p-2 rounded text-sm">
                                        <span>{String(option.text || '')}</span>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                          (option.score || 0) > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                          Score: {option.score || 0}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Delete Survey Modal */}
      {deleteSurvey && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-[#8b5cf6] text-xl" onClick={() => setDeleteSurvey(null)}>&times;</button>
            <h2 className="text-xl font-bold text-[#8b5cf6] mb-4">Delete Survey</h2>
            <p className="mb-4 text-black">Are you sure you want to delete <b>{deleteSurvey.name || deleteSurvey.survey_type}</b>?</p>
            <div className="flex gap-3 justify-end">
              <button className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-black" onClick={() => setDeleteSurvey(null)}>Cancel</button>
              <button className="px-4 py-2 rounded-lg bg-[#8b5cf6] hover:bg-[#a855f7] text-white" onClick={handleDeleteSurvey}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Survey Content Editor Modal */}
      {showContentEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl relative flex flex-col p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#8b5cf6]">Survey Content Management</h2>
              <button 
                className="text-gray-400 hover:text-[#8b5cf6] text-2xl font-bold" 
                onClick={() => setShowContentEditor(false)}
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[65vh] pr-1">
              {contentData.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FaQuestionCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No content items yet</p>
                  <p className="text-sm">Add questions or video sections to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contentData.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-[#8b5cf6] transition-colors bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-[#8b5cf6]">
                          {item.video ? 'Video Section' : 'Question'} #{index + 1}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditItem(item, index)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => deleteContentItem(index)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      {editingIndex === index ? (
                        <div className="bg-white p-3 rounded mb-2 border border-[#e9d5ff]">
                          {item.video ? (
                            <>
                              <label className="block text-xs font-bold mb-1">Video URL</label>
                              <input
                                className="w-full border rounded px-2 py-1 mb-2"
                                value={editingItem.video}
                                onChange={e => setEditingItem({ ...editingItem, video: e.target.value })}
                              />
                            </>
                          ) : (
                            <>
                              <label className="block text-xs font-bold mb-1">Question</label>
                              <input
                                className="w-full border rounded px-2 py-1 mb-2"
                                value={editingItem.question}
                                onChange={e => setEditingItem({ ...editingItem, question: e.target.value })}
                              />
                              <label className="block text-xs font-bold mb-1">Type</label>
                              <select
                                className="w-full border rounded px-2 py-1 mb-2"
                                value={editingItem.type}
                                onChange={e => setEditingItem({ ...editingItem, type: e.target.value })}
                              >
                                <option value="single_choice">Single Choice</option>
                                <option value="multiple_choice">Multiple Choice</option>
                              </select>
                              <label className="block text-xs font-bold mb-1">Options</label>
                              {editingItem.options && editingItem.options.map((opt, optIdx) => (
                                <div key={optIdx} className="flex gap-2 mb-1">
                                  <input
                                    className="flex-1 border rounded px-2 py-1"
                                    value={opt.text}
                                    onChange={e => updateEditingOption(optIdx, 'text', e.target.value)}
                                    placeholder="Option text"
                                  />
                                  <input
                                    type="number"
                                    className="w-20 border rounded px-2 py-1"
                                    value={opt.score}
                                    onChange={e => updateEditingOption(optIdx, 'score', e.target.value)}
                                    placeholder="Score"
                                  />
                                  <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => deleteEditingOption(optIdx)}
                                    title="Delete Option"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 mt-1"
                                onClick={addEditingOption}
                              >
                                + Add Option
                              </button>
                            </>
                          )}
                          <div className="flex gap-2 mt-2 justify-end">
                            <button
                              type="button"
                              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                              onClick={saveEditItem}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="px-3 py-1 bg-gray-200 text-black rounded hover:bg-gray-300 text-xs"
                              onClick={cancelEditItem}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        item.video ? (
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Video: {String(item.video).substring(0, 50)}...</p>
                            <p className="text-xs text-gray-500">{item.quiz?.length || 0} quiz questions</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-gray-800 mb-1">{String(item.question || 'Untitled Question')}</p>
                            <p className="text-xs text-gray-500">{item.options?.length || 0} options • {String(item.type || 'single_choice')}</p>
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-end pt-4 border-t mt-4 bg-white sticky bottom-0 z-10">
              <button 
                type="button"
                className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-black" 
                onClick={() => setShowContentEditor(false)}
              >
                Cancel
              </button>
              <button 
                onClick={saveContentChanges}
                className="px-6 py-2 rounded-lg bg-[#8b5cf6] hover:bg-[#a855f7] text-white flex items-center gap-2"
              >
                <FaSave /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyManagement; 