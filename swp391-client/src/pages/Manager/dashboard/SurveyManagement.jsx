import React, { useState } from 'react';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaClipboardList, FaChartBar, FaUsers, FaCalendarAlt, FaClock, FaPercentage, FaQuestionCircle } from 'react-icons/fa';

// Enhanced fake survey data for demo
const fakeSurveys = [
  {
    id: 1,
    name: 'Drug Awareness Survey',
    type: 'Education',
    createdAt: '2024-06-01',
    participants: 120,
    totalQuestions: 15,
    completionRate: 85,
    avgTime: '8 min',
    status: 'Active',
    description: 'A comprehensive survey to assess awareness about drug abuse among students and identify knowledge gaps.',
    targetAudience: 'High School Students',
    duration: '30 days',
    responses: 102,
    lastResponse: '2024-01-20'
  },
  {
    id: 2,
    name: 'Community Feedback Survey',
    type: 'Feedback',
    createdAt: '2024-05-20',
    participants: 85,
    totalQuestions: 12,
    completionRate: 92,
    avgTime: '6 min',
    status: 'Inactive',
    description: 'Collecting valuable feedback from the community on anti-drug campaigns and prevention programs.',
    targetAudience: 'General Community',
    duration: '45 days',
    responses: 78,
    lastResponse: '2024-01-15'
  },
  {
    id: 3,
    name: 'Youth Risk Assessment',
    type: 'Assessment',
    createdAt: '2024-04-15',
    participants: 200,
    totalQuestions: 20,
    completionRate: 78,
    avgTime: '12 min',
    status: 'Active',
    description: 'In-depth survey to identify risk factors for drug use among youth and develop targeted interventions.',
    targetAudience: 'College Students',
    duration: '60 days',
    responses: 156,
    lastResponse: '2024-01-22'
  },
  {
    id: 4,
    name: 'Parent Awareness Check',
    type: 'Education',
    createdAt: '2024-03-10',
    participants: 150,
    totalQuestions: 18,
    completionRate: 88,
    avgTime: '10 min',
    status: 'Active',
    description: 'Survey designed to evaluate parents\' knowledge about drug prevention and their role in protecting children.',
    targetAudience: 'Parents',
    duration: '40 days',
    responses: 132,
    lastResponse: '2024-01-19'
  }
];

const surveyTypes = ['All', 'Education', 'Feedback', 'Assessment'];
const surveyStatuses = ['All', 'Active', 'Inactive'];

const SurveyManagement = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewSurvey, setViewSurvey] = useState(null);
  const [editSurvey, setEditSurvey] = useState(null);
  const [deleteSurvey, setDeleteSurvey] = useState(null);

  const filteredSurveys = fakeSurveys.filter(survey => {
    const matchesSearch = survey.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || survey.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || survey.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getCompletionColor = (rate) => {
    if (rate >= 90) return 'bg-green-500';
    if (rate >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-[#faf5ff] via-[#f3e8ff] to-[#f8fafc] p-0 rounded-2xl shadow-lg">
      {/* Header with purple gradient and large clipboard icon */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-8 bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#c084fc] rounded-t-2xl shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-full p-4 shadow-lg">
            <FaClipboardList className="text-4xl text-[#8b5cf6]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1">Survey Management</h1>
            <p className="text-white text-sm md:text-base max-w-xl">Gather insights and measure impact. Create, manage, and analyze surveys to understand community needs and track prevention progress.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-white hover:bg-[#f3e8ff] text-[#8b5cf6] font-semibold px-6 py-3 rounded-xl shadow transition-all duration-200 text-base">
          <FaPlus /> Create Survey
        </button>
      </div>
      {/* Toolbar: Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-4 bg-white rounded-b-2xl shadow-md -mt-4 z-10 relative">
        <div className="flex items-center gap-2 bg-[#faf5ff] rounded-xl px-3 py-2 shadow w-full md:w-1/3">
          <FaSearch className="text-[#8b5cf6]" />
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
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-black focus:ring-[#8b5cf6] focus:border-[#8b5cf6]"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            {surveyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-black focus:ring-[#a855f7] focus:border-[#a855f7]"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            {surveyStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Enhanced Survey Table with progress bars */}
      <div className="overflow-auto rounded-b-2xl shadow bg-white mt-0 flex-1">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#c084fc] text-white">
            <tr>
              <th className="px-4 py-3 font-bold">Survey Details</th>
              <th className="px-4 py-3 font-bold">Progress</th>
              <th className="px-4 py-3 font-bold">Statistics</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSurveys.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">No surveys found.</td>
              </tr>
            ) : (
              filteredSurveys.map(survey => (
                <tr key={survey.id} className="border-b last:border-b-0 hover:bg-[#faf5ff] transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#8b5cf6] to-[#c084fc] flex items-center justify-center text-white font-bold">
                        <FaClipboardList />
                      </div>
                      <div>
                        <div className="font-semibold text-black">{survey.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <FaCalendarAlt className="text-[#8b5cf6]" /> {survey.createdAt}
                          <span className="inline-block px-2 py-1 rounded-full bg-[#c084fc] text-white font-bold text-xs">{survey.type}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-black">
                        <span>Completion</span>
                        <span className="font-bold">{survey.completionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getCompletionColor(survey.completionRate)}`}
                          style={{ width: `${survey.completionRate}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {survey.responses}/{survey.participants} responses
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1 text-black">
                      <div className="flex items-center gap-1 text-xs">
                        <FaQuestionCircle className="text-[#8b5cf6]" /> {survey.totalQuestions} questions
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <FaClock className="text-[#8b5cf6]" /> {survey.avgTime} avg
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <FaUsers className="text-[#8b5cf6]" /> {survey.targetAudience}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {survey.status === 'Active' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                        <FaCheckCircle className="text-green-500" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-bold">
                        <FaTimesCircle className="text-gray-400" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      className="p-2 rounded-lg bg-[#8b5cf6] hover:bg-[#a855f7] text-white"
                      title="View Details"
                      onClick={() => setViewSurvey(survey)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="p-2 rounded-lg bg-[#c084fc] hover:bg-[#a855f7] text-white"
                      title="Edit"
                      onClick={() => setEditSurvey(survey)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="p-2 rounded-lg bg-gray-200 hover:bg-red-200 text-[#e11d48]"
                      title="Delete"
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
      {/* Enhanced View Survey Modal */}
      {viewSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-[#8b5cf6] text-xl" onClick={() => setViewSurvey(null)}>&times;</button>
            
            {/* Header with icon and basic info */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6 pb-6 border-b">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#8b5cf6] to-[#c084fc] flex items-center justify-center text-white text-4xl shadow-lg">
                <FaClipboardList />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-[#8b5cf6] mb-2">{viewSurvey.name}</h2>
                <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-black">
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt className="text-[#8b5cf6]" /> {viewSurvey.createdAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaUsers className="text-[#8b5cf6]" /> {viewSurvey.targetAudience}
                  </span>
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#faf5ff] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#8b5cf6]">{viewSurvey.participants}</div>
                <div className="text-xs text-black">Participants</div>
              </div>
              <div className="bg-[#faf5ff] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#a855f7]">{viewSurvey.responses}</div>
                <div className="text-xs text-black">Responses</div>
              </div>
              <div className="bg-[#faf5ff] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#c084fc]">{viewSurvey.completionRate}%</div>
                <div className="text-xs text-black">Completion</div>
              </div>
              <div className="bg-[#faf5ff] rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#8b5cf6]">{viewSurvey.totalQuestions}</div>
                <div className="text-xs text-black">Questions</div>
              </div>
            </div>

            {/* Detailed information grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Survey Details */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-[#8b5cf6] mb-3 flex items-center gap-2">
                  <FaClipboardList /> Survey Details
                </h3>
                <div className="space-y-2 text-black">
                  <div><b>Type:</b> <span className="inline-block px-2 py-1 rounded-full bg-[#c084fc] text-white font-bold text-xs">{viewSurvey.type}</span></div>
                  <div><b>Target Audience:</b> {viewSurvey.targetAudience}</div>
                  <div><b>Duration:</b> {viewSurvey.duration}</div>
                  <div><b>Average Time:</b> {viewSurvey.avgTime}</div>
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
                      <span className="font-bold">{viewSurvey.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getCompletionColor(viewSurvey.completionRate)}`}
                        style={{ width: `${viewSurvey.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-black text-sm">
                    <div><b>Responses:</b> {viewSurvey.responses}/{viewSurvey.participants}</div>
                    <div><b>Last Response:</b> {viewSurvey.lastResponse}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-[#8b5cf6] mb-2">Description</h3>
                <p className="text-black">{viewSurvey.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Survey Modal */}
      {deleteSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-[#8b5cf6] text-xl" onClick={() => setDeleteSurvey(null)}>&times;</button>
            <h2 className="text-xl font-bold text-[#8b5cf6] mb-4">Delete Survey</h2>
            <p className="mb-4 text-black">Are you sure you want to delete <b>{deleteSurvey.name}</b>?</p>
            <div className="flex gap-3 justify-end">
              <button className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-black" onClick={() => setDeleteSurvey(null)}>Cancel</button>
              <button className="px-4 py-2 rounded-lg bg-[#8b5cf6] hover:bg-[#a855f7] text-white" onClick={() => { setDeleteSurvey(null); }}>Delete</button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Survey Modal (Demo only, not functional) */}
      {editSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-[#8b5cf6] text-xl" onClick={() => setEditSurvey(null)}>&times;</button>
            <h2 className="text-xl font-bold text-[#8b5cf6] mb-4">Edit Survey (Demo)</h2>
            <p className="text-gray-500">This is a demo modal. You can implement the edit form here.</p>
            <div className="flex gap-3 justify-end mt-6">
              <button className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-black" onClick={() => setEditSurvey(null)}>Cancel</button>
              <button className="px-4 py-2 rounded-lg bg-[#8b5cf6] hover:bg-[#a855f7] text-white" onClick={() => setEditSurvey(null)}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyManagement; 