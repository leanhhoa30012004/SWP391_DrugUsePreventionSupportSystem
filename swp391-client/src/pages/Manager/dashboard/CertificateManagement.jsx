import React, { useEffect, useState } from 'react';
import { FaCertificate, FaSearch } from 'react-icons/fa';

const statusColor = {
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  pending: 'bg-yellow-100 text-yellow-700',
};

const CertificateManagement = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingCertId, setRejectingCertId] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [consultants, setConsultants] = useState([]);
  
  const user = JSON.parse(localStorage.getItem('user'));
  const manager_id = user?.user_id;
  console.log("Manager ID:", manager_id);

  // Fetch consultants data
  const fetchConsultants = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch('http://localhost:3000/api/manager/users', { headers });
      const data = await response.json();

      // Extract users array from response
      let users = [];
      if (Array.isArray(data)) {
        users = data;
      } else if (Array.isArray(data.users)) {
        users = data.users;
      } else if (Array.isArray(data.data)) {
        users = data.data;
      }

      // Filter consultants only
      const consultantUsers = users.filter(user => user.role === 'consultant');
      console.log("Consultants fetched:", consultantUsers);
      setConsultants(consultantUsers);
      return consultantUsers;
    } catch (error) {
      console.error('Error fetching consultants:', error);
      alert('Error fetching consultants');
      return [];
    }
  };

  // Fetch certificates for all consultants (Manager view)
  const fetchCertificates = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      
      // First fetch consultants
      const consultantsList = await fetchConsultants();
      
      // Then fetch certificates for all consultants
      const allCertificates = [];
      
      for (const consultant of consultantsList) {
        try {
          const response = await fetch(`http://localhost:3000/api/consultation/get-certificate-by-consultant-id/${consultant.user_id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });

          if (response.ok) {
            const data = await response.json();
            const certificates = Array.isArray(data) ? data : [];
            
            // Add consultant info to each certificate
            const certificatesWithConsultantInfo = certificates.map(cert => ({
              ...cert,
              consultant_info: {
                user_id: consultant.user_id,
                fullname: consultant.fullname || consultant.name || `Consultant ${consultant.user_id}`,
                email: consultant.email,
                phone: consultant.phone
              }
            }));
            
            allCertificates.push(...certificatesWithConsultantInfo);
          }
        } catch (err) {
          console.error(`Error fetching certificates for consultant ${consultant.user_id}:`, err);
        }
      }
      
      console.log("All certificates fetched:", allCertificates);
      setCertificates(allCertificates);
    } catch (err) {
      console.error('Error in fetchCertificates:', err);
      setError('Failed to fetch certificates.');
    } finally {
      setLoading(false);
    }
  };

  // Alternative approach: Fetch all certificates from a manager endpoint
  const fetchAllCertificatesForManager = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      
      // If there's a manager endpoint to get all certificates
      const response = await fetch(`http://localhost:3000/api/manager/certificates`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched all certificates:", data);
        setCertificates(Array.isArray(data) ? data : []);
      } else {
        // Fallback to individual consultant fetching
        await fetchCertificates();
      }
    } catch (err) {
      console.error('Error fetching all certificates:', err);
      // Fallback to individual consultant fetching
      await fetchCertificates();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Try to fetch all certificates for manager first, fallback to individual fetching
    fetchAllCertificatesForManager();
  }, []);

  const handleApprove = async (certificate_id) => {
    if (!manager_id) {
      alert('Manager ID not found!');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/consultation/approve-certificate-request/${certificate_id}`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ manager_id: manager_id })
      });
      
      if (response.ok) {
        alert('Certificate approved successfully!');
        fetchAllCertificatesForManager(); // Refresh the data
      } else {
        throw new Error('Approval failed');
      }
    } catch (err) {
      console.error('Approval error:', err);
      alert('Approval failed!');
    }
  };

  const handleReject = async (certificate_id, reason) => {
    if (!manager_id) {
      alert('Manager ID not found!');
      return;
    }
    if (!reason || !reason.trim()) {
      alert('Please enter a reject reason!');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/consultation/reject-certificate-request/${certificate_id}`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          reject_reason: reason,
          manager_id: manager_id 
        })
      });
      
      if (response.ok) {
        alert('Certificate rejected successfully!');
        setRejectingCertId(null);
        setRejectReason('');
        fetchAllCertificatesForManager(); // Refresh the data
      } else {
        throw new Error('Reject failed');
      }
    } catch (err) {
      console.error('Reject error:', err);
      alert('Reject failed!');
    }
  };

  // Filter certificates based on search and filters
  const filteredCertificates = certificates.filter(cert => {
    const consultantName = cert.consultant_info?.fullname || cert.fullname || '';
    const certificateName = cert.certificate_name || '';
    const consultantId = cert.consultant_info?.user_id || cert.consultant_id || '';
    
    const matchesSearch = search === '' || 
      certificateName.toLowerCase().includes(search.toLowerCase()) ||
      consultantName.toLowerCase().includes(search.toLowerCase()) ||
      consultantId.toString().includes(search);
    
    const matchesStatus = statusFilter === 'All' || cert.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return dateString.slice(0, 19).replace('T', ' ');
  };

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-br from-[#faf5ff] via-[#f3e8ff] to-[#f8fafc] p-0 rounded-2xl shadow-lg">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-8 bg-white rounded-t-3xl shadow border-b border-[#e11d48]/20">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-full p-4 shadow border-2 border-[#e11d48]/30">
            <FaCertificate className="text-4xl text-[#e11d48]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#e11d48] mb-1 drop-shadow">Certificate Management</h1>
            <p className="text-black text-sm md:text-base max-w-xl font-medium">
              Review, approve, and manage consultant certificates for your organization.
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-3 bg-white border-b border-[#e11d48]/10">
        <div className="flex items-center gap-2 bg-[#fff1f2] rounded-xl px-3 py-2 shadow w-full md:w-1/3 border border-[#e11d48]/10">
          <FaSearch className="text-[#e11d48]" />
          <input
            type="text"
            placeholder="Search certificates, consultants, or certificate names..."
            className="outline-none border-none flex-1 bg-transparent text-black"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="rounded-lg border border-[#e11d48]/20 px-3 py-2 text-sm text-black focus:ring-[#e11d48] focus:border-[#e11d48]"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Certificate Table */}
      <div className="overflow-auto rounded-b-2xl shadow bg-white mt-0 flex-1 border border-[#e11d48]/10">
        {error && <div className="text-red-500 mb-4 px-4">{error}</div>}
        {loading ? (
          <div className="p-4 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#e11d48]"></div>
            <p className="mt-2 text-gray-600">Loading certificates...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-[#fff1f2] text-[#e11d48] border-b border-[#e11d48]/20">
                <tr>
                  <th className="px-4 py-3 font-bold">Consultant Info</th>
                  <th className="px-4 py-3 font-bold">Certificate Name</th>
                  <th className="px-4 py-3 font-bold">Certificate Image</th>
                  <th className="px-4 py-3 font-bold">Expired Date</th>
                  <th className="px-4 py-3 font-bold">Submit Date</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Reject Reason</th>
                  <th className="px-4 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCertificates.map(cert => (
                  <tr key={cert.certificate_id} className="border-b last:border-b-0 hover:bg-[#fff1f2] transition">
                    <td className="px-4 py-3 max-w-xs whitespace-normal break-words">
                      <div className="font-bold text-[#e11d48] whitespace-normal break-words text-sm">
                        {cert.consultant_info?.fullname || cert.fullname || 'Unknown Consultant'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ID: {cert.consultant_info?.user_id || cert.consultant_id || 'N/A'}
                      </div>
                      {cert.consultant_info?.email && (
                        <div className="text-xs text-gray-500">
                          {cert.consultant_info.email}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-sm whitespace-normal break-words text-sm font-medium">
                      {cert.certificate_name || 'No name'}
                    </td>
                    <td className="px-4 py-3">
                      {cert.url ? (
                        <button onClick={() => setModalImage(cert.url)} className="focus:outline-none">
                          <img 
                            src={cert.url} 
                            alt="certificate" 
                            className="w-16 h-16 object-cover rounded shadow hover:scale-110 transition-transform duration-200" 
                          />
                        </button>
                      ) : (
                        <span className="text-gray-400 italic text-sm">No image</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm">
                      {cert.expired ? new Date(cert.expired).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm">
                      {formatDate(cert.date_submit)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[cert.status] || 'bg-gray-100 text-gray-500'}`}>
                        {cert.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm max-w-xs whitespace-normal break-words">
                      {cert.reject_reason || '-'}
                    </td>
                    <td className="px-4 py-3 text-center align-middle">
                      {(!cert.status || cert.status === 'pending') && (
                        <div className="flex flex-col items-center gap-2">
                          <button 
                            onClick={() => handleApprove(cert.certificate_id)} 
                            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold p-2 rounded-lg shadow w-24"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setRejectingCertId(cert.certificate_id);
                              setRejectReason('');
                            }}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold p-2 rounded-lg shadow w-24"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {rejectingCertId === cert.certificate_id && (
                        <div className="flex flex-col gap-2 mt-2 items-center">
                          <input
                            type="text"
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            placeholder="Enter reject reason..."
                            className="border px-2 py-1 rounded w-full text-sm"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleReject(cert.certificate_id, rejectReason)}
                              className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold p-2 rounded-lg shadow"
                              disabled={!rejectReason.trim()}
                            >
                              Confirm Reject
                            </button>
                            <button
                              onClick={() => setRejectingCertId(null)}
                              className="bg-gray-500 hover:bg-gray-600 text-white text-sm font-semibold p-2 rounded-lg shadow"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCertificates.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                No certificates found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal xem ảnh lớn */}
      {modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setModalImage(null)}>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-0 right-0 m-2 text-white text-2xl font-bold bg-black bg-opacity-40 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition"
              onClick={() => setModalImage(null)}
              title="Close"
            >
              ×
            </button>
            <img
              src={modalImage}
              alt="certificate large"
              className="rounded-xl shadow-xl max-w-[90vw] max-h-[80vh] object-contain bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateManagement;