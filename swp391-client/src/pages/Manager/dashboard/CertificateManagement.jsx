import React, { useEffect, useState } from 'react';
import { FaCertificate, FaSearch, FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

const statusColor = {
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  waiting: 'bg-yellow-100 text-yellow-700',
};

const CertificateManagement = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectModal, setRejectModal] = useState({ isOpen: false, certificateId: null, certificateName: '', consultantName: '' });
  const [rejectReason, setRejectReason] = useState('');
  const [rejectReasonError, setRejectReasonError] = useState('');
  const [modalImage, setModalImage] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [consultants, setConsultants] = useState([]);
  const [actionLoading, setActionLoading] = useState({ approving: null, rejecting: null });
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const manager_id = user?.user_id;

  // Common reject reasons for quick selection
  const commonRejectReasons = [
    "Certificate image is not clear or readable",
    "Certificate has expired",
    "Certificate information does not match consultant profile",
    "Invalid or fake certificate detected",
    "Missing required information on certificate",
    "Certificate issued by non-recognized institution",
    "Other (please specify)"
  ];

  console.log("Manager ID:", manager_id);

  // Fetch consultants data
  const fetchConsultants = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch('http://localhost:3000/api/manager/users', { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
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
      setError('Error fetching consultants: ' + error.message);
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
      setError('Failed to fetch certificates: ' + err.message);
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
        console.log("Manager endpoint not available, falling back to individual fetching");
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
    if (!manager_id) {
      setError('Manager ID not found in user data');
      setLoading(false);
      return;
    }
    fetchAllCertificatesForManager();
  }, [manager_id]);

  const handleApprove = async (certificate_id) => {

    console.log("Certificate ID received:", certificate_id, typeof certificate_id);
  
  if (!certificate_id || certificate_id === 'undefined') {
    alert('Certificate ID is missing!');
    return;
  }
    
    setActionLoading(prev => ({ ...prev, approving: certificate_id }));
    
    try {
      const token = localStorage.getItem('token');
      
      // Debug: Log the request details
      console.log('Approving certificate:', {
        
        consultant_id: certificate_id,
        token: token ? 'present' : 'missing'
      });
      
      const response = await fetch(`http://localhost:3000/api/consultation/approve-certificate-request/${certificate_id}`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ manager_id: manager_id })
      });
      
      // Debug: Log response details
      console.log('Approve response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Approve response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('Approve success:', responseData);
      
      alert('Certificate approved successfully!');
      fetchAllCertificatesForManager(); 
    } catch (err) {
      console.error('Approval error:', err);
      alert(`Approval failed: ${err.message}`);
    } finally {
      setActionLoading(prev => ({ ...prev, approving: null }));
    }
  };

  const openRejectModal = (certificate_id, certificate_name, consultant_name) => {
    console.log("Opening reject modal for certificate:>>>>>>>>>>>>>>>", certificate_id, certificate_name, consultant_name);
    setRejectModal({
      isOpen: true,
      certificateId: certificate_id,
      certificateName: certificate_name,
      consultantName: consultant_name
    });
    setRejectReason('');
    setRejectReasonError('');
  };

  const closeRejectModal = () => {
    setRejectModal({ isOpen: false, certificateId: null, certificateName: '', consultantName: '' });
    setRejectReason('');
    setRejectReasonError('');
  };

  const handleReject = async () => {
    if (!manager_id) {
      alert('Manager ID not found!');
      return;
    }
    
    if (!rejectReason || !rejectReason.trim()) {
      setRejectReasonError('Please enter a reject reason!');
      return;
    }
    
    if (rejectReason.trim().length < 10) {
      setRejectReasonError('Reject reason must be at least 10 characters long');
      return;
    }
    
    setActionLoading(prev => ({ ...prev, rejecting: rejectModal.certificateId }));
    console.log("Rejecting certificate:", rejectModal.certificateId, rejectReason.trim(), manager_id);
    
    try {
      const token = localStorage.getItem('token');
      
      // Debug: Log the request details
      console.log('Rejecting certificate:', {
        certificate_id: rejectModal.certificateId,
        manager_id,
        reject_reason: rejectReason.trim(),
        token: token ? 'present' : 'missing'
      });
      
      const response = await fetch(`http://localhost:3000/api/consultation/reject-certificate-request/${rejectModal.certificateId}`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          reject_reason: rejectReason.trim(),
          manager_id: manager_id 
        })
      });
      
      // Debug: Log response details
      console.log('Reject response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Reject response error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const responseData = await response.json();
      console.log('Reject success:', responseData);
      
      alert('Certificate rejected successfully!');
      closeRejectModal();
      fetchAllCertificatesForManager();
    } catch (err) {
      console.error('Reject error:', err);
      alert(`Reject failed: ${err.message}`);
    } finally {
      setActionLoading(prev => ({ ...prev, rejecting: null }));
    }
  };

  // Filter certificates based on search and filters
  const filteredCertificates = certificates.filter(cert => {
    const consultantName = cert.consultant_info?.fullname || cert.fullname || '';
    const certificateName = cert.certificate_name || '';
    const consultantId = cert.consultant_info?.user_id || cert.consultant_id || '';
    const certificateId = cert.certificate_id ? cert.certificate_id.toString() : '';
    const matchesSearch = search === '' || 
      certificateName.toLowerCase().includes(search.toLowerCase()) ||
      consultantName.toLowerCase().includes(search.toLowerCase()) ||
      consultantId.toString().includes(search) ||
      certificateId.includes(search);
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
            <option value="waiting">Waiting</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Certificate Table */}
      <div className="overflow-auto rounded-b-2xl shadow bg-white mt-0 flex-1 border border-[#e11d48]/10">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded m-4">
            <div className="flex items-center">
              <FaExclamationTriangle className="mr-2" />
              {error}
            </div>
          </div>
        )}
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
                      {console.log("Consultant Info:", JSON.stringify(cert))}
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
                        {cert.status || 'waiting'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm max-w-xs whitespace-normal break-words">
                      {cert.reject_reason || '-'}
                    </td>
                    <td className="px-4 py-3 text-center align-middle">
                      {(!cert.status || cert.status === 'waiting') && (
                        <div className="flex flex-col items-center gap-2">
                          <button 
                            onClick={() => {handleApprove(cert.certificate_id); console.log("Ceart"+cert.certificate_id); }} 
                            disabled={actionLoading.approving === cert.certificate_id}
                            className={`${
                              actionLoading.approving === cert.certificate_id 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700'
                            } text-white text-sm font-semibold p-2 rounded-lg shadow w-24 flex items-center justify-center`}
                          >
                            {actionLoading.approving === cert.certificateId ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <FaCheck className="mr-1" />
                                Approve
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => openRejectModal(
                              cert.certificate_id, 
                              cert.certificate_name || 'Certificate', 
                              cert.consultant_info?.fullname || 'Unknown Consultant'
                            )}
                            disabled={actionLoading.rejecting === cert.certificate_id}
                            className={`${
                              actionLoading.rejecting === cert.certificate_id 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-red-600 hover:bg-red-700'
                            } text-white text-sm font-semibold p-2 rounded-lg shadow w-24 flex items-center justify-center`}
                          >
                            {actionLoading.rejecting === cert.certificateId ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <FaTimes className="mr-1" />
                                Reject
                              </>
                            )}
                          </button>
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

      {/* Reject Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-70 backdrop-blur-md">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-red-50 px-6 py-4 border-b border-red-200 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <FaExclamationTriangle className="text-red-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-800">Reject Certificate</h3>
                    <p className="text-red-600 text-sm">Please provide a detailed reason for rejection</p>
                  </div>
                </div>
                <button
                  onClick={closeRejectModal}
                  className="text-red-400 hover:text-red-600 text-2xl"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Certificate Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">Certificate Details:</h4>
                <div className="text-sm text-gray-600">
                  <p><span className="font-medium">Consultant:</span> {rejectModal.consultantName}</p>
                  <p><span className="font-medium">Certificate:</span> {rejectModal.certificateName}</p>
                </div>
              </div>

              {/* Common Reasons */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Common Reject Reasons:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {commonRejectReasons.map((reason, index) => (
                    <button
                      key={index}
                      onClick={() => setRejectReason(reason === "Other (please specify)" ? "" : reason)}
                      className={`text-left p-3 rounded-lg border transition-all ${
                        rejectReason === reason
                          ? 'bg-red-50 border-red-300 text-red-800'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Reason Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Reject Reason *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => {
                    setRejectReason(e.target.value);
                    setRejectReasonError('');
                  }}
                  placeholder="Please provide a detailed reason for rejecting this certificate..."
                  className={`w-full p-3 border rounded-lg resize-none h-32 ${
                    rejectReasonError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                      : 'border-gray-300 focus:border-red-500 focus:ring-red-200'
                  } focus:ring-2 focus:outline-none`}
                />
                {rejectReasonError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <FaExclamationTriangle className="mr-1" />
                    {rejectReasonError}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Minimum 10 characters required. Current: {rejectReason.length}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={closeRejectModal}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || rejectReason.trim().length < 10 || actionLoading.rejecting}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center ${
                  !rejectReason.trim() || rejectReason.trim().length < 10 || actionLoading.rejecting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {actionLoading.rejecting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Rejecting...
                  </>
                ) : (
                  <>
                    <FaTimes className="mr-2" />
                    Confirm Reject
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
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