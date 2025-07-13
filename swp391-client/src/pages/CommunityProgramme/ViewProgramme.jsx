import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/footer';

function Programs() {
    const userId = JSON.parse(localStorage.getItem('user'))?.user_id;
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        location: '',
        searchQuery: ''
    });
    const [programsData, setProgramsData] = useState([]);
    const [filteredPrograms, setFilteredPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const programsPerPage = 6;

    // Fetch all programs
    useEffect(() => {
        const fetchAllPrograms = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3000/api/program/get-all-program`, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                console.log(response.data);
                setProgramsData(response.data);
                setError('');
            } catch (err) {
                console.error("Program API error:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error Loading Programs',
                    text: 'An error occurred while loading program data.',
                    confirmButtonColor: '#dc2626'
                });
            } finally {
                setLoading(false);
            }
        };
        fetchAllPrograms();
    }, []);

    // Filter programs when filters change
    useEffect(() => {
        filterPrograms();
    }, [programsData, filters]);

    const searchProgramsByName = async (programName) => {
        if (!programName.trim()) {
            setFilteredPrograms(programsData);
            return;
        }

        try {
            // Filter programs by name from existing data
            const filtered = programsData.filter(program => 
                program.program_name.toLowerCase().includes(programName.toLowerCase()) ||
                program.description.toLowerCase().includes(programName.toLowerCase())
            );
            setFilteredPrograms(filtered);
        } catch (err) {
            console.error("Search error:", err);
            Swal.fire({
                icon: 'warning',
                title: 'Search Error',
                text: 'An error occurred while searching for programs.',
                confirmButtonColor: '#dc2626'
            });
        }
    };

    const filterPrograms = () => {
        let filtered = programsData;

        // Filter by location
        if (filters.location) {
            filtered = filtered.filter(program =>
                program.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }
        setFilteredPrograms(filtered);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (filters.searchQuery.trim()) {
            searchProgramsByName(filters.searchQuery);
        } else {
            filterPrograms();
        }
        setCurrentPage(1);
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({
            location: '',
            searchQuery: ''
        });
        setCurrentPage(1);
    };

    // Pagination
    const indexOfLastProgram = currentPage * programsPerPage;
    const indexOfFirstProgram = indexOfLastProgram - programsPerPage;
    const currentPrograms = filteredPrograms.slice(indexOfFirstProgram, indexOfLastProgram);
    const totalPages = Math.ceil(filteredPrograms.length / programsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleViewProgram = (program_id) => {
        if (!program_id) return;
        navigate(`/programs/${program_id}`);
    };

   

    function formatDateTime(isoString) {
        console.log(isoString)
        console.log(typeof isoString)
        const date = new Date(isoString);
      
        // Cộng thêm 7 giờ nếu muốn về giờ Việt Nam (UTC+7)
        date.setHours(date.getHours());
      
        const hh = String(date.getHours()).padStart(2, '0');
        const mm = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');
      
        const dd = String(date.getDate()).padStart(2, '0');
        const MM = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
      
        return `${hh}:${mm}:${ss} ${dd}/${MM}/${yyyy}`;
      }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="bg-white min-h-screen py-12">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                            <span className="ml-3 text-gray-600">Đang tải chương trình...</span>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="bg-white min-h-screen py-12">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-red-600 mb-4">Community Anti-Drug Programs</h1>
                        <p className="text-gray-600 text-lg">Join our community programs to make a difference</p>
                        <div className="mt-6 max-w-md mx-auto">
                            <form onSubmit={handleSearchSubmit} className="flex">
                                <input
                                    type="text"
                                    placeholder="Search programs..."
                                    className="flex-1 px-4 py-2 border border-red-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    value={filters.searchQuery}
                                    onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-red-600 text-white rounded-r-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    Search
                                </button>
                            </form>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Filters */}
                        <div className="w-full lg:w-1/4 bg-red-50 border border-red-200 p-6 rounded-lg shadow-md h-fit">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-red-700">Filters</h2>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-red-600 hover:text-red-800 underline"
                                >
                                    Clear filters
                                </button>
                            </div>

                            {/* Location Filter */}
                            <div className="mb-6">
                                <h3 className="text-red-600 font-medium mb-3">Location</h3>
                                <input
                                    type="text"
                                    placeholder="Enter location..."
                                    className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                />
                            </div>

                            {/* Program Stats */}
                            <div className="bg-white p-4 rounded-lg border border-red-100">
                                <h4 className="font-medium text-red-700 mb-2">Statistics</h4>
                                <p className="text-sm text-gray-600">
                                    Total programs: <span className="font-semibold">{programsData.length}</span>
                                </p>
                                <p className="text-sm text-gray-600">
                                    Showing: <span className="font-semibold">{filteredPrograms.length}</span>
                                </p>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="w-full lg:flex-1">
                            {currentPrograms.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 text-6xl mb-4">🏛️</div>
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                        No programs found
                                    </h3>
                                    <p className="text-gray-500">
                                        Try changing your filters or search keywords
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {currentPrograms.map(program => (
                                            <div key={program.program_id} className="bg-white border border-red-100 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                                <div className="relative">
                                                    <img
                                                        src={program.program_img || `https://source.unsplash.com/400x300/?community,program`}
                                                        alt={program.program_name}
                                                        className="h-48 w-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = `https://source.unsplash.com/400x300/?community,program`;
                                                        }}
                                                    />
                                                    <div className="absolute top-3 right-3">
                                                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                                                            {program.program_type || 'Community'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-5">
                                                    <h3 className="text-lg font-semibold text-red-700 mb-3 line-clamp-2">
                                                        {program.program_name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                        Seminar hosted by {program.description.host} about {program.description.detail}
                                                    </p>
                                                    <div className="text-sm text-gray-600 mb-4 space-y-1">
                                                        <div className="flex items-center">
                                                            <span>⏰</span>
                                                            <span className="ml-1">{formatDateTime(program.start_date)} - {formatDateTime(program.end_date)}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <span>📍</span>
                                                            <a href={program.location} style={{color: "blue"}}>{program.location}</a>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <span>👥</span>
                                                            <span className="ml-1">Max: {program.max_participants}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-center gap-2">
                                                        <button
                                                            onClick={() => handleViewProgram(program.program_id)}
                                                            className="text-sm text-red-600 border border-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors duration-200 font-medium flex-1"
                                                        >
                                                            View Details
                                                        </button>
                                                       
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="mt-12 flex justify-center">
                                            <div className="flex items-center gap-2">
                                                {/* Previous button */}
                                                <button
                                                    onClick={() => paginate(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className={`px-3 py-2 rounded-lg ${currentPage === 1
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                                                        }`}
                                                >
                                                    ← Previous
                                                </button>

                                                {/* Page numbers */}
                                                {[...Array(totalPages)].map((_, index) => {
                                                    const pageNumber = index + 1;
                                                    if (
                                                        pageNumber === 1 ||
                                                        pageNumber === totalPages ||
                                                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                                    ) {
                                                        return (
                                                            <button
                                                                key={pageNumber}
                                                                onClick={() => paginate(pageNumber)}
                                                                className={`w-10 h-10 rounded-lg ${currentPage === pageNumber
                                                                    ? 'bg-red-600 text-white'
                                                                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                                                                    }`}
                                                            >
                                                                {pageNumber}
                                                            </button>
                                                        );
                                                    } else if (
                                                        pageNumber === currentPage - 2 ||
                                                        pageNumber === currentPage + 2
                                                    ) {
                                                        return <span key={pageNumber} className="px-2 text-gray-400">...</span>;
                                                    }
                                                    return null;
                                                })}

                                                {/* Next button */}
                                                <button
                                                    onClick={() => paginate(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className={`px-3 py-2 rounded-lg ${currentPage === totalPages
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                                                        }`}
                                                >
                                                    Next →
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Programs;