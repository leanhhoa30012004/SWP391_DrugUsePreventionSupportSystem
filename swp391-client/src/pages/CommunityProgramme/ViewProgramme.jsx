import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
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


    const [checkedPrograms, setCheckedPrograms] = useState(new Set());
    const [previousStatuses, setPreviousStatuses] = useState(new Map());
    const [checkInReminders, setCheckInReminders] = useState(new Set());
    const intervalRef = useRef(null);
    const checkInIntervalRef = useRef(null);


    useEffect(() => {

        if (Notification.permission === 'default') {
            Swal.fire({
                icon: 'question',
                title: 'Enable Notifications',
                text: 'Would you like to receive check-in reminders for your programs?',
                showCancelButton: true,
                confirmButtonText: 'Yes, Enable',
                cancelButtonText: 'Maybe Later',
                confirmButtonColor: '#16a34a',
                cancelButtonColor: '#6b7280'
            }).then((result) => {
                if (result.isConfirmed) {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            Swal.fire({
                                icon: 'success',
                                title: 'Notifications Enabled!',
                                text: 'You will now receive check-in reminders for your programs.',
                                confirmButtonColor: '#dc2626',
                                timer: 2000,
                                timerProgressBar: true
                            });
                        }
                    });
                }
            });
        }
    }, []);

    // NEW: Show notification settings
    const showNotificationSettings = () => {
        Swal.fire({
            icon: 'info',
            title: 'Notification Settings',
            html: `
                <div class="text-left">
                    <p class="mb-4"><strong>Current Status:</strong> ${Notification.permission === 'granted' ? '✅ Enabled' : '❌ Disabled'}</p>
                    <p class="mb-4"><strong>What you'll receive:</strong></p>
                    <ul class="text-left mb-4">
                        <li>• Check-in reminders when programs start</li>
                        <li>• Program start notifications</li>
                        <li>• Program end reminders</li>
                    </ul>
                    <p class="text-sm text-gray-600">You can change notification settings in your browser settings.</p>
                </div>
            `,
            confirmButtonText: 'Got it!',
            confirmButtonColor: '#dc2626'
        });
    };

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

    // NEW: Auto-detection system
    useEffect(() => {
        if (programsData.length > 0) {
            // Initial check
            checkProgramStatusChanges();
            checkForCheckInReminders();

            // Set up interval for checking every 30 seconds
            intervalRef.current = setInterval(() => {
                checkProgramStatusChanges();
            }, 30000);

            // Set up interval for check-in reminders every minute
            checkInIntervalRef.current = setInterval(() => {
                checkForCheckInReminders();
            }, 60000);
        }

        // Cleanup interval on unmount
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (checkInIntervalRef.current) {
                clearInterval(checkInIntervalRef.current);
            }
        };
    }, [programsData]);

    // NEW: Check for program status changes
    const checkProgramStatusChanges = () => {
        programsData.forEach(program => {
            const currentStatus = checkProgramStatus(program.start_date, program.end_date);
            const previousStatus = previousStatuses.get(program.program_id);
            const programKey = `${program.program_id}-${currentStatus}`;

            // Check if status changed and we haven't shown popup for this status yet
            if (previousStatus && previousStatus !== currentStatus && !checkedPrograms.has(programKey)) {
                // Program started (not started -> in_progress)
                if (previousStatus === 'not started' && currentStatus === 'on going') {
                    showStartPopup(program);
                }
                // Program ended (in_progress -> ended)
                else if (previousStatus === 'on going' && currentStatus === 'closed') {
                    showEndPopup(program);
                }
            }

            // Update previous status
            setPreviousStatuses(prev => new Map(prev.set(program.program_id, currentStatus)));
        });
    };

    // NEW: Show popup when program starts
    const showStartPopup = (program) => {
        const programKey = `${program.program_id}-in_progress`;

        let timerInterval;
        const timeLeft = 10;

        Swal.fire({
            icon: 'info',
            title: '🎉 Program Started!',
            html: `
                <div class="text-center">
                    <p class="text-lg font-semibold text-green-600 mb-2">"${program.title}"</p>
                    <p class="text-gray-600 mb-4">The program has just started! Would you like to check in now?</p>
                    <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div class="bg-green-600 h-2 rounded-full transition-all duration-1000" style="width: 100%" id="timer-bar"></div>
                    </div>
                    <p class="text-sm text-gray-500">Auto-closing in <span id="timer-text">${timeLeft}</span> seconds</p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Check In Now',
            cancelButtonText: 'Maybe Later',
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#6b7280',
            timer: timeLeft * 1000,
            timerProgressBar: false,
            allowOutsideClick: false,
            didOpen: () => {
                const timerBar = document.getElementById('timer-bar');
                const timerText = document.getElementById('timer-text');
                let currentTime = timeLeft;

                timerInterval = setInterval(() => {
                    currentTime--;
                    const percentage = (currentTime / timeLeft) * 100;
                    if (timerBar) timerBar.style.width = percentage + '%';
                    if (timerText) timerText.textContent = currentTime;

                    if (currentTime <= 0) {
                        clearInterval(timerInterval);
                    }
                }, 1000);
            },
            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            if (result.isConfirmed) {
                handleCheckIn(program);
            }
        });

        // Mark as checked
        setCheckedPrograms(prev => new Set(prev.add(programKey)));
    };

    // NEW: Show popup when program ends
    const showEndPopup = (program) => {
        const programKey = `${program.program_id}-ended`;

        let timerInterval;
        const timeLeft = 15;

        Swal.fire({
            icon: 'success',
            title: '🏁 Program Completed!',
            html: `
                <div class="text-center">
                    <p class="text-lg font-semibold text-blue-600 mb-2">"${program.title}"</p>
                    <p class="text-gray-600 mb-4">The program has ended. Would you like to take the post-program survey?</p>
                    <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div class="bg-blue-600 h-2 rounded-full transition-all duration-1000" style="width: 100%" id="timer-bar-end"></div>
                    </div>
                    <p class="text-sm text-gray-500">Auto-closing in <span id="timer-text-end">${timeLeft}</span> seconds</p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Take Survey',
            cancelButtonText: 'Skip',
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#6b7280',
            timer: timeLeft * 1000,
            timerProgressBar: false,
            allowOutsideClick: false,
            didOpen: () => {
                const timerBar = document.getElementById('timer-bar-end');
                const timerText = document.getElementById('timer-text-end');
                let currentTime = timeLeft;

                timerInterval = setInterval(() => {
                    currentTime--;
                    const percentage = (currentTime / timeLeft) * 100;
                    if (timerBar) timerBar.style.width = percentage + '%';
                    if (timerText) timerText.textContent = currentTime;

                    if (currentTime <= 0) {
                        clearInterval(timerInterval);
                    }
                }, 1000);
            },
            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(`/surveyprogram/${program.program_id}`);
            }
        });

        // Mark as checked
        setCheckedPrograms(prev => new Set(prev.add(programKey)));
    };

    // NEW: Handle check-in with camera functionality
    const handleCheckIn = async (program) => {
        try {
            // Call the mark-participant API
            const response = await axios.get(
                `http://localhost:3000/api/program/mark-participant/${program.program_id}/${userId}`
            );

            console.log('Check-in API response:', response.data);

            // Show success message
            await Swal.fire({
                icon: 'success',
                title: 'Checked In Successfully!',
                text: `Welcome to "${program.title}". Your attendance has been recorded. Opening camera for verification...`,
                confirmButtonColor: '#dc2626',
                timer: 2000,
                timerProgressBar: true
            });

            // Update the program status in local state to "presented"
            setProgramsData(prevPrograms =>
                prevPrograms.map(p =>
                    p.program_id === program.program_id
                        ? { ...p, status: 'presented' }
                        : p
                )
            );

            // Navigate to camera page or open camera modal
            // You can implement camera functionality here
            openCameraForCheckIn(program);

        } catch (error) {
            console.error('Check-in error:', error);

            // Check if it's a specific error (e.g., already checked in)
            let errorMessage = 'An error occurred during check-in. Please try again.';

            if (error.response?.status === 409) {
                errorMessage = 'You have already checked in for this program.';
            } else if (error.response?.status === 404) {
                errorMessage = 'Program or participant not found.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            Swal.fire({
                icon: 'error',
                title: 'Check-in Failed',
                text: errorMessage,
                confirmButtonColor: '#dc2626'
            });
        }
    };

    // NEW: Open camera for check-in verification
    const openCameraForCheckIn = (program) => {
        // This is where you would implement camera functionality
        // For now, we'll show a placeholder
        Swal.fire({
            icon: 'info',
            title: 'Camera Access',
            html: `
                <div class="text-center">
                    <p class="mb-4">Camera functionality would be implemented here</p>
                    <div class="w-64 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <span class="text-gray-500">📷 Camera View</span>
                    </div>
                    <p class="text-sm text-gray-600">Take a photo to verify your attendance at "${program.title}"</p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Take Photo',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#dc2626'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    title: 'Photo Captured!',
                    text: 'Your attendance has been recorded successfully.',
                    confirmButtonColor: '#dc2626'
                });
            }
        });
    };

    // NEW: Check for check-in reminders
    const checkForCheckInReminders = () => {
        const now = new Date();

        programsData.forEach(program => {
            const startDate = new Date(program.start_date);
            const endDate = new Date(program.end_date);
            const programKey = `checkin-${program.program_id}`;

            // Check if program is currently in progress and we haven't shown reminder yet
            if (now >= startDate && now <= endDate && !checkInReminders.has(programKey)) {
                // Check if it's within the first 30 minutes of the program start
                const timeSinceStart = now - startDate;
                const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds

                if (timeSinceStart <= thirtyMinutes) {
                    showCheckInReminder(program);
                    setCheckInReminders(prev => new Set(prev.add(programKey)));
                }
            }
        });
    };

    // NEW: Show check-in reminder
    const showCheckInReminder = (program) => {
        // Request browser notification permission
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // Show browser notification if permitted
        if (Notification.permission === 'granted') {
            new Notification('Check-in Reminder', {
                body: `It's time to check in for "${program.title}"!`,
                icon: '/favicon.ico',
                tag: `checkin-${program.program_id}`,
                requireInteraction: true
            });
        }

        // Show popup reminder
        let timerInterval;
        const timeLeft = 30;

        Swal.fire({
            icon: 'info',
            title: '⏰ Check-in Time!',
            html: `
                <div class="text-center">
                    <p class="text-lg font-semibold text-blue-600 mb-2">"${program.title}"</p>
                    <p class="text-gray-600 mb-4">The program has started! Don't forget to check in to record your attendance.</p>
                    <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div class="bg-blue-600 h-2 rounded-full transition-all duration-1000" style="width: 100%" id="checkin-timer-bar"></div>
                    </div>
                    <p class="text-sm text-gray-500">Reminder will close in <span id="checkin-timer-text">${timeLeft}</span> seconds</p>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Check In Now',
            cancelButtonText: 'Remind Me Later',
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#6b7280',
            timer: timeLeft * 1000,
            timerProgressBar: false,
            allowOutsideClick: false,
            didOpen: () => {
                const timerBar = document.getElementById('checkin-timer-bar');
                const timerText = document.getElementById('checkin-timer-text');
                let currentTime = timeLeft;

                timerInterval = setInterval(() => {
                    currentTime--;
                    const percentage = (currentTime / timeLeft) * 100;
                    if (timerBar) timerBar.style.width = percentage + '%';
                    if (timerText) timerText.textContent = currentTime;

                    if (currentTime <= 0) {
                        clearInterval(timerInterval);
                    }
                }, 1000);
            },
            willClose: () => {
                clearInterval(timerInterval);
            }
        }).then((result) => {
            if (result.isConfirmed) {
                handleCheckIn(program);
            } else if (result.dismiss === Swal.DismissReason.timer) {
                // Show a smaller reminder after timer expires
                Swal.fire({
                    icon: 'info',
                    title: 'Check-in Reminder',
                    text: `Don't forget to check in for "${program.title}" when you're ready!`,
                    confirmButtonColor: '#dc2626',
                    timer: 5000,
                    timerProgressBar: true
                });
            }
        });
    };

    const searchProgramsByName = async (programName) => {
        if (!programName.trim()) {
            setFilteredPrograms(programsData);
            return;
        }

        try {
            const filtered = programsData.filter(program =>
                program.title.toLowerCase().includes(programName.toLowerCase()) ||
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

    const checkProgramStatus = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (now < start) {
            return 'not started';
        } else if (now >= start && now <= end) {
            return 'on going';
        } else {
            return 'closed';
        }
    };

    const handleCheckInOut = async (program) => {
        // Check if user has already checked in
        if (program.status === 'presented') {
            await Swal.fire({
                icon: 'info',
                title: 'Already Checked In',
                text: `You have already checked in for "${program.title}".`,
                confirmButtonColor: '#dc2626'
            });
            return;
        }

        const status = checkProgramStatus(program.start_date, program.end_date);

        if (status === 'not started') {
            const startTime = formatDateTime(program.start_date);
            await Swal.fire({
                icon: 'info',
                title: 'Program Not Started',
                text: `This program will start at ${startTime}. Please come back later.`,
                confirmButtonColor: '#dc2626'
            });
        } else if (status === 'on going') {
            const result = await Swal.fire({
                icon: 'question',
                title: 'Check In',
                text: `The program "${program.title}" is currently in progress. Do you want to check in?`,
                showCancelButton: true,
                confirmButtonText: 'Check In',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#dc2626'
            });

            if (result.isConfirmed) {
                await handleCheckIn(program);
            }
        } else if (status === 'closed') {
            const endTime = formatDateTime(program.end_date);
            const result = await Swal.fire({
                icon: 'info',
                title: 'Program Ended',
                text: `The program "${program.title}" ended at ${endTime}. Would you like to complete the post-program survey?`,
                showCancelButton: true,
                confirmButtonText: 'Take Survey',
                cancelButtonText: 'Maybe Later',
                confirmButtonColor: '#dc2626'
            });

            if (result.isConfirmed) {
                navigate(`/surveyprogram/${program.program_id}`);
            }
        }
    };

    const getButtonText = (program) => {
        // Check if user has already checked in (status is "presented")
        if (program.status === 'presented') {
            return 'Already Checked In';
        }

        const status = checkProgramStatus(program.start_date, program.end_date);
        switch (status) {
            case 'not started':
                return 'Program Not Started';
            case 'on going':
                return 'Check In';
            case 'closed':
                return 'Check Out';
            default:
                return 'Take Survey';
        }
    };

    const getButtonColor = (program) => {
        // Check if user has already checked in (status is "presented")
        if (program.status === 'presented') {
            return 'text-green-600 border-green-600 bg-green-50 cursor-not-allowed';
        }

        const status = checkProgramStatus(program.start_date, program.end_date);
        switch (status) {
            case 'not started':
                return 'text-gray-600 border-gray-400 hover:bg-gray-50 cursor-not-allowed';
            case 'on going':
                return 'text-green-600 border-green-600 hover:bg-green-50';
            case 'closed':
                return 'text-blue-600 border-blue-600 hover:bg-blue-50';
            default:
                return 'text-red-600 border-red-600 hover:bg-red-50';
        }
    };

    const handleViewProgram = (program_id) => {
        if (!program_id) return;
        navigate(`/programs/${program_id}`);
    };

    function formatDateTime(isoString) {
        const date = new Date(isoString);
        date.setHours(date.getHours());

        const hh = String(date.getHours()).padStart(2, '0');
        const mm = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');

        const dd = String(date.getDate()).padStart(2, '0');
        const MM = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();

        return `${hh}:${mm}:${ss} ${dd}/${MM}/${yyyy}`;
    }

    if (loading) {
        return (
            <>

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

            <div className="bg-white min-h-screen py-12">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="flex justify-between items-center mb-4">
                            <div></div> {/* Empty div for spacing */}
                            <button
                                onClick={showNotificationSettings}
                                className="flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                            >
                                <span>🔔</span>
                                <span className="text-sm font-medium">Notifications</span>
                            </button>
                        </div>
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
                                                        src={program.program_img || `https://tse4.mm.bing.net/th/id/OIP.D-45kvpMODaav4dvuYF25QHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3`}
                                                        alt={program.title}
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
                                                        {program.title}
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
                                                            <a href={program.location} style={{ color: "blue" }}>{program.location}</a>
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
                                                        <button
                                                            onClick={() => handleViewProgram(program.program_id)}
                                                            className="text-sm text-green-600 border border-green-600 hover:bg-green-50 px-3 py-2 rounded-lg transition-colors duration-200 font-medium flex-1"
                                                        >
                                                            Register
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