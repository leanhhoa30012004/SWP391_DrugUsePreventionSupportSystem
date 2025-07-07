import React, { useState } from 'react';
import { FaSearch, FaPlus, FaEye, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaUserMd, FaPhone, FaEnvelope, FaUserTie, FaStar, FaClock, FaCalendarAlt, FaMapMarkerAlt, FaGraduationCap, FaAward, FaComments } from 'react-icons/fa';

// Enhanced fake consultant data for demo
const fakeConsultants = [
  {
    id: 1,
    name: 'Dr. Nguyen Van Cục Cức',
    email: 'nguyenb@wehope.org',
    phone: '0901234567',
    specialty: 'Psychology',
    sessions: 120,
    status: 'Active',
    rating: 4.8,
    experience: 8,
    education: 'PhD in Clinical Psychology',
    location: 'Ho Chi Minh City',
    availability: 'Mon-Fri, 9AM-5PM',
    languages: ['Vietnamese', 'English'],
    certifications: ['Licensed Clinical Psychologist', 'Drug Prevention Specialist'],
    description: 'Expert in youth psychology and drug prevention counseling with 8 years of experience helping adolescents overcome addiction challenges.',
    achievements: ['Best Counselor Award 2023', 'Published 15 research papers'],
    lastActive: '2024-01-15'
  },
  {
    id: 2,
    name: 'Ms. Tran Thi C',
    email: 'tranc@wehope.org',
    phone: '0912345678',
    specialty: 'Community Health',
    sessions: 85,
    status: 'Inactive',
    rating: 4.5,
    experience: 5,
    education: 'Master in Public Health',
    location: 'Hanoi',
    availability: 'Mon-Sat, 8AM-6PM',
    languages: ['Vietnamese'],
    certifications: ['Community Health Specialist', 'Health Education Coordinator'],
    description: 'Specialist in community health and anti-drug campaigns with expertise in organizing prevention programs.',
    achievements: ['Community Outreach Excellence Award', 'Led 20+ prevention workshops'],
    lastActive: '2024-01-10'
  },
  {
    id: 3,
    name: 'Mr. Le Van D',
    email: 'led@wehope.org',
    phone: '0987654321',
    specialty: 'Addiction Recovery',
    sessions: 200,
    status: 'Active',
    rating: 4.9,
    experience: 12,
    education: 'Master in Social Work',
    location: 'Da Nang',
    availability: 'Mon-Sun, 24/7 Emergency',
    languages: ['Vietnamese', 'English', 'French'],
    certifications: ['Certified Addiction Counselor', 'Crisis Intervention Specialist'],
    description: 'Experienced in addiction recovery and family support with specialized training in crisis intervention.',
    achievements: ['Recovery Success Rate: 85%', 'Emergency Response Team Leader'],
    lastActive: '2024-01-20'
  },
  {
    id: 4,
    name: 'Dr. Pham Thi E',
    email: 'phame@wehope.org',
    phone: '0976543210',
    specialty: 'Family Therapy',
    sessions: 95,
    status: 'Active',
    rating: 4.7,
    experience: 6,
    education: 'PhD in Family Psychology',
    location: 'Can Tho',
    availability: 'Mon-Fri, 10AM-7PM',
    languages: ['Vietnamese', 'English'],
    certifications: ['Family Therapist', 'Child Psychology Specialist'],
    description: 'Specialized in family therapy and helping families affected by drug addiction rebuild relationships.',
    achievements: ['Family Reunification Success: 90%', 'Parenting Skills Trainer'],
    lastActive: '2024-01-18'
  }
];

const consultantSpecialties = ['All', 'Psychology', 'Community Health', 'Addiction Recovery', 'Family Therapy'];
const consultantStatuses = ['All', 'Active', 'Inactive'];

const ConsultantManagement = () => {
  const [search, setSearch] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewConsultant, setViewConsultant] = useState(null);
  const [editConsultant, setEditConsultant] = useState(null);
  const [deleteConsultant, setDeleteConsultant] = useState(null);

  const filteredConsultants = fakeConsultants.filter(consultant => {
    const matchesSearch = consultant.name.toLowerCase().includes(search.toLowerCase()) || consultant.email.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'All' || consultant.specialty === specialtyFilter;
    const matchesStatus = statusFilter === 'All' || consultant.status === statusFilter;
    return matchesSearch && matchesSpecialty && matchesStatus;
  });

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i <= rating ? 'text-[#e11d48]' : 'text-gray-300'}
        />
      );
    }
    return stars;
  };

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-[#fff1f2] via-[#fef2f2] to-[#f8fafc] p-0 rounded-2xl shadow-lg">
      {/* Header with red background and large consultant icon */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-8 bg-white rounded-t-3xl shadow border-b border-[#e11d48]/20">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-full p-4 shadow border-2 border-[#e11d48]/30">
            <FaUserMd className="text-4xl text-[#e11d48]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#e11d48] mb-1 drop-shadow">Consultant Management</h1>
            <p className="text-[#be123c] text-sm md:text-base max-w-xl font-medium">
              Support and empower your consultant team. Manage, add, and analyze consultants for the best prevention support.
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-[#e11d48] hover:bg-[#be123c] text-white font-bold px-7 py-3 rounded-2xl shadow transition-all duration-200 text-base">
          <FaPlus /> Add Consultant
        </button>
      </div>
      {/* Toolbar: Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-4 bg-white rounded-b-2xl shadow-md -mt-4 z-10 relative">
        <div className="flex items-center gap-2 bg-[#fef2f2] rounded-xl px-3 py-2 shadow w-full md:w-1/3">
          <FaSearch className="text-[#e11d48]" />
          <input
            type="text"
            placeholder="Search consultants..."
            className="outline-none border-none flex-1 bg-transparent text-black"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-black focus:ring-[#e11d48] focus:border-[#e11d48]"
            value={specialtyFilter}
            onChange={e => setSpecialtyFilter(e.target.value)}
          >
            {consultantSpecialties.map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
          <select
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-black focus:ring-[#e11d48] focus:border-[#e11d48]"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            {consultantStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Consultant Table with enhanced details */}
      <div className="overflow-auto rounded-b-3xl shadow bg-white mt-0 flex-1 border border-[#e11d48]/10">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#fff1f2] text-[#e11d48] border-b border-[#e11d48]/20">
            <tr>
              <th className="px-4 py-3 font-bold">Consultant</th>
              <th className="px-4 py-3 font-bold">Contact</th>
              <th className="px-4 py-3 font-bold">Specialty</th>
              <th className="px-4 py-3 font-bold">Rating</th>
              <th className="px-4 py-3 font-bold">Experience</th>
              <th className="px-4 py-3 font-bold">Sessions</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredConsultants.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-400">No consultants found.</td>
              </tr>
            ) : (
              filteredConsultants.map(consultant => (
                <tr key={consultant.id} className="border-b last:border-b-0 hover:bg-[#fff1f2] transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#e11d48] to-[#fbbf24] flex items-center justify-center text-white font-bold">
                        <FaUserTie />
                      </div>
                      <div>
                        <div className="font-semibold text-black">{consultant.name}</div>
                        <div className="text-xs text-gray-500">{consultant.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-black">
                      <div className="flex items-center gap-1 text-xs">
                        <FaEnvelope className="text-[#e11d48]" /> {consultant.email}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <FaPhone className="text-[#e11d48]" /> {consultant.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-4 py-2 rounded-full bg-[#e11d48]/20 text-[#e11d48] font-bold text-sm border border-[#e11d48]/30">{consultant.specialty}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="flex">{renderStars(consultant.rating)}</div>
                      <span className="text-black font-bold text-xs">{consultant.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-black font-bold">{consultant.experience} years</td>
                  <td className="px-4 py-3 text-black font-bold">{consultant.sessions}</td>
                  <td className="px-4 py-3">
                    {consultant.status === 'Active' ? (
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
                      className="p-2 rounded-lg bg-[#e11d48] hover:bg-[#be123c] text-white"
                      title="View Details"
                      onClick={() => setViewConsultant(consultant)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="p-2 rounded-lg bg-[#e11d48] hover:bg-[#be123c] text-white"
                      title="Edit"
                      onClick={() => setEditConsultant(consultant)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="p-2 rounded-lg bg-gray-200 hover:bg-red-200 text-[#e11d48]"
                      title="Delete"
                      onClick={() => setDeleteConsultant(consultant)}
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
      {/* Enhanced View Consultant Modal */}
      {viewConsultant && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-[#e11d48] text-xl" onClick={() => setViewConsultant(null)}>&times;</button>

            {/* Header with avatar and basic info */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6 pb-6 border-b">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#e11d48] to-[#fbbf24] flex items-center justify-center text-white text-5xl shadow-lg">
                <FaUserMd />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-[#e11d48] mb-2">{viewConsultant.name}</h2>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <div className="flex">{renderStars(viewConsultant.rating)}</div>
                  <span className="text-black font-bold">{viewConsultant.rating}/5</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-black">
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-[#e11d48]" /> {viewConsultant.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock className="text-[#e11d48]" /> {viewConsultant.experience} years
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed information grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-[#e11d48] mb-3 flex items-center gap-2">
                  <FaEnvelope /> Contact Information
                </h3>
                <div className="space-y-2 text-black">
                  <div><b>Email:</b> {viewConsultant.email}</div>
                  <div><b>Phone:</b> {viewConsultant.phone}</div>
                  <div><b>Location:</b> {viewConsultant.location}</div>
                  <div><b>Availability:</b> {viewConsultant.availability}</div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-[#e11d48] mb-3 flex items-center gap-2">
                  <FaGraduationCap /> Professional Details
                </h3>
                <div className="space-y-2 text-black">
                  <div><b>Specialty:</b> <span className="inline-block px-2 py-1 rounded-full bg-[#e11d48]/20 text-[#e11d48] font-bold text-sm border border-[#e11d48]/30">{viewConsultant.specialty}</span></div>
                  <div><b>Education:</b> {viewConsultant.education}</div>
                  <div><b>Experience:</b> {viewConsultant.experience} years</div>
                  <div><b>Total Sessions:</b> {viewConsultant.sessions}</div>
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-[#e11d48] mb-3 flex items-center gap-2">
                  <FaAward /> Certifications
                </h3>
                <div className="space-y-1">
                  {viewConsultant.certifications.map((cert, index) => (
                    <div key={index} className="text-black text-sm">• {cert}</div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-[#e11d48] mb-3 flex items-center gap-2">
                  <FaComments /> Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {viewConsultant.languages.map((lang, index) => (
                    <span key={index} className="px-2 py-1 bg-[#e11d48] text-white rounded-full text-xs">{lang}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Description and Achievements */}
            <div className="mt-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-[#e11d48] mb-2">Description</h3>
                <p className="text-black">{viewConsultant.description}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-[#e11d48] mb-2">Achievements</h3>
                <div className="space-y-1">
                  {viewConsultant.achievements.map((achievement, index) => (
                    <div key={index} className="text-black text-sm">• {achievement}</div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold text-[#e11d48] mb-2">Status Information</h3>
                <div className="grid grid-cols-2 gap-4 text-black">
                  <div><b>Current Status:</b>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${viewConsultant.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                      }`}>
                      {viewConsultant.status}
                    </span>
                  </div>
                  <div><b>Last Active:</b> {viewConsultant.lastActive}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Consultant Modal */}
      {deleteConsultant && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-[#e11d48] text-xl" onClick={() => setDeleteConsultant(null)}>&times;</button>
            <h2 className="text-xl font-bold text-[#e11d48] mb-4">Delete Consultant</h2>
            <p className="mb-4 text-black">Are you sure you want to delete <b>{deleteConsultant.name}</b>?</p>
            <div className="flex gap-3 justify-end">
              <button className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-black" onClick={() => setDeleteConsultant(null)}>Cancel</button>
              <button className="px-4 py-2 rounded-lg bg-[#e11d48] hover:bg-[#be123c] text-white" onClick={() => { setDeleteConsultant(null); }}>Delete</button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Consultant Modal (Demo only, not functional) */}
      {editConsultant && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-[#e11d48] text-xl" onClick={() => setEditConsultant(null)}>&times;</button>
            <h2 className="text-xl font-bold text-[#e11d48] mb-4">Edit Consultant (Demo)</h2>
            <p className="text-gray-500">This is a demo modal. You can implement the edit form here.</p>
            <div className="flex gap-3 justify-end mt-6">
              <button className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-black" onClick={() => setEditConsultant(null)}>Cancel</button>
              <button className="px-4 py-2 rounded-lg bg-[#e11d48] hover:bg-[#be123c] text-white" onClick={() => setEditConsultant(null)}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultantManagement; 