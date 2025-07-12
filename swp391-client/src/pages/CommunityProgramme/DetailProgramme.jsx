import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navbar from '../../components/Navbar/Navbar';

function ProgramDetail() {
    const { program_id } = useParams();
    const navigate = useNavigate();
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [surveyAnswers, setSurveyAnswers] = useState({});
    const [submittingSurvey, setSubmittingSurvey] = useState(false);
    const uid = JSON.parse(localStorage.getItem('user'))?.user_id;

    // Fetch program details
    useEffect(() => {
        const fetchProgramDetail = async () => {
            try {
                setLoading(true);
                // Get all programs first, then find the specific one
                const response = await axios.get(`http://localhost:3000/api/program/get-all-program`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                // Find the program with matching ID
                const foundProgram = response.data.find(p => p.program_id === parseInt(program_id));
                if (foundProgram) {
                    setProgram(foundProgram);
                } else {
                    throw new Error('Program not found');
                }
                
            } catch (err) {
                console.error("Program detail API error:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error Loading Program',
                    text: 'Program not found or an error occurred.',
                    confirmButtonColor: '#dc2626'
                }).then(() => {
                    navigate('/programs');
                });
            } finally {
                setLoading(false);
            }
        };

        if (program_id) {
            fetchProgramDetail();
        }
    }, [program_id]);

    // Handle program join
    const handleJoin = async () => {
        try {
            setJoining(true);
            const response = await axios.get(
                `http://localhost:3000/api/program/registered-program/${program_id}/${uid}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            console.log(`**Rese: ** ${response.data}`)
            if (response.data === 'Registered successfully!') {
                setIsJoined(true);
                
                // Show success message and redirect to survey page
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful!',
                    text: 'You have successfully registered for this program. You will now be redirected to complete the survey.',
                    confirmButtonColor: '#dc2626',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                
                setTimeout(() => {
                    navigate(`/surveyprogram/${program_id}`);
                }, 2000);
                
            } else {
                throw new Error(response.data);
            }
        } catch (err) {
            console.error("Join program error:", err);
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: err.response?.data?.error || err.message || 'An error occurred during registration.',
                confirmButtonColor: '#dc2626'
            });
        } finally {
            setJoining(false);
        }
    };

    // Handle survey submission
    const handleSurveySubmit = async (surveyType) => {
        try {
            setSubmittingSurvey(true);
            
            const surveyQuestions = surveyType === 'pre' 
                ? program.survey_question?.['pre-survey'] || []
                : program.survey_question?.['post-survey'] || [];
            
            const answers = [];
            for (let i = 0; i < surveyQuestions.length; i++) {
                const answer = surveyAnswers[`${surveyType}_${i}`];
                if (!answer) {
                    throw new Error(`Please answer all questions before submitting.`);
                }
                answers.push(answer);
            }

            const response = await axios.post(
                `http://localhost:3000/api/program/submit-program-survey/${program_id}`,
                {
                    type: surveyType,
                    answer: answers
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.data === 'Submit successful!') {
                Swal.fire({
                    icon: 'success',
                    title: 'Survey Submitted!',
                    text: `${surveyType === 'pre' ? 'Pre-program' : 'Post-program'} survey submitted successfully.`,
                    confirmButtonColor: '#dc2626'
                });
                // Clear survey answers
                setSurveyAnswers(prev => {
                    const newAnswers = { ...prev };
                    surveyQuestions.forEach((_, index) => {
                        delete newAnswers[`${surveyType}_${index}`];
                    });
                    return newAnswers;
                });
            } else {
                throw new Error(response.data);
            }
        } catch (err) {
            console.error("Survey submission error:", err);
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: err.response?.data?.error || err.message || 'An error occurred during submission.',
                confirmButtonColor: '#dc2626'
            });
        } finally {
            setSubmittingSurvey(false);
        }
    };

    // Handle survey answer change
    const handleAnswerChange = (questionKey, value) => {
        setSurveyAnswers(prev => ({
            ...prev,
            [questionKey]: value
        }));
    };

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'on going':
                return 'bg-green-100 text-green-800';
            case 'upcoming':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="bg-white min-h-screen py-12">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                            <span className="ml-3 text-gray-600">Đang tải chi tiết chương trình...</span>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (!program) {
        return (
            <>
                <Navbar />
                <div className="bg-white min-h-screen py-12">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-2xl font-bold text-gray-600 mb-4">Program Not Found</h2>
                        <button
                            onClick={() => navigate('/programs')}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                        >
                            Back to Programs
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="bg-white min-h-screen">
                {/* Hero Section */}
                <div className="relative text-white py-16" style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://i.pinimg.com/1200x/25/36/e9/2536e9a9859bbea835f3f8ff7d3162b1.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}>
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="flex flex-col lg:flex-row gap-8 items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                                            {program.age_group || 'All Ages'}
                                        </span>
                                        <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(program.status)}`}>
                                            {program.status || 'Active'}
                                        </span>
                                    </div>
                                    <h1 className="text-4xl font-bold mb-4">
                                        {program.title}
                                    </h1>
                                    <p className="text-red-100 text-lg mb-6 leading-relaxed">
                                        {program.description?.detail || 'Join our comprehensive drug prevention program designed to educate and empower participants with essential knowledge and skills.'}
                                    </p>
                                    <div className="flex flex-wrap gap-6 text-sm">
                                        <div className="flex items-center">
                                            <span className="mr-2">👨‍⚕️</span>
                                            <span>Host: {program.description?.host || 'Professional Team'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="mr-2">📅</span>
                                            <span>Start: {formatDate(program.start_date)}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="mr-2">⏰</span>
                                            <span>End: {formatDate(program.end_date)}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="mr-2">👥</span>
                                            <span>Target: {program.age_group}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Program Card */}
                                <div className="w-full lg:w-80 bg-white rounded-xl shadow-2xl overflow-hidden">
                                    <div className="h-48 bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                                        <div className="text-center text-white">
                                            <div className="text-6xl mb-2">🎯</div>
                                            <h3 className="text-lg font-semibold">Prevention Program</h3>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="text-center mb-6">
                                            <span className="text-3xl font-bold text-red-600">
                                                Free Registration
                                            </span>
                                        </div>

                                        {program.status === 'completed' ? (
                                            <button
                                                className="w-full bg-gray-400 text-white py-3 rounded-lg font-semibold cursor-not-allowed"
                                                disabled
                                            >
                                                Program Completed
                                            </button>
                                        ) : isJoined ? (
                                            <button
                                                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold cursor-not-allowed"
                                                disabled
                                            >
                                                Already Registered
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleJoin()}
                                                disabled={joining}
                                                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-red-400 transition-colors duration-200 flex items-center justify-center"
                                            >
                                                {joining ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                        Registering...
                                                    </>
                                                ) : (
                                                    'Register Now'
                                                )}
                                            </button>
                                        )}

                                        <div className="mt-4 text-sm text-gray-600 space-y-2">
                                            <div className="flex items-center">
                                                <span>📍 Location access included</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span>📋 Pre & Post surveys</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span>🏆 Certificate of participation</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span>💬 Expert guidance</span>
                                            </div>
                                        </div>

                                        {program.location && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <a
                                                    href={program.location}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-red-600 hover:text-red-700"
                                                >
                                                    <span className="mr-2">📍</span>
                                                    View Location
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-200 mb-8">
                            {[
                                { id: 'overview', label: 'Overview', icon: '📋' },
                                { id: 'content', label: 'Program Content', icon: '📚' },
                                { id: 'survey', label: 'Surveys', icon: '📊' },
                                { id: 'schedule', label: 'Schedule', icon: '⏰' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center px-6 py-3 font-medium transition-colors duration-200 ${activeTab === tab.id
                                        ? 'text-red-600 border-b-2 border-red-600'
                                        : 'text-gray-600 hover:text-red-600'
                                        }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white">
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Program</h2>
                                        <div className="prose prose-lg text-gray-600 leading-relaxed">
                                            <p>
                                                {program.description?.detail || 'This comprehensive drug prevention program is designed to educate participants about the dangers of substance abuse and provide them with the knowledge and skills needed to make informed decisions. Through interactive workshops, expert guidance, and community support, participants will learn evidence-based prevention strategies.'}
                                            </p>
                                            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Program Objectives</h3>
                                            <ul className="list-disc list-inside space-y-2 text-gray-600">
                                                <li>Increase awareness about the risks and consequences of drug use</li>
                                                <li>Develop critical thinking skills to resist peer pressure</li>
                                                <li>Learn healthy coping mechanisms and stress management</li>
                                                <li>Build strong support networks within the community</li>
                                                <li>Understand available resources and support services</li>
                                                <li>Promote positive lifestyle choices and decision-making</li>
                                            </ul>
                                            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Target Audience</h3>
                                            <p>This program is specifically designed for {program.age_group?.toLowerCase()} and focuses on age-appropriate content and delivery methods.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Content Tab */}
                            {activeTab === 'content' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Program Content</h2>
                                    <div className="space-y-6">
                                        {program.detail && program.detail.map((item, index) => (
                                            <div key={index} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors duration-200">
                                                {item.text && (
                                                    <div className="mb-4">
                                                        <div className="flex items-center mb-3">
                                                            <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                                                                {index + 1}
                                                            </div>
                                                            <span className="text-sm text-gray-500">📖 Content Section</span>
                                                        </div>
                                                        <p className="text-gray-700 leading-relaxed">{item.text}</p>
                                                    </div>
                                                )}
                                                {item.img && (
                                                    <div className="mb-4">
                                                        <div className="flex items-center mb-3">
                                                            <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                                                                {index + 1}
                                                            </div>
                                                            <span className="text-sm text-gray-500">🖼️ Visual Content</span>
                                                        </div>
                                                        <img
                                                            src={item.img}
                                                            alt={`Program content ${index + 1}`}
                                                            className="w-full max-w-md h-48 object-cover rounded-lg"
                                                            onError={(e) => {
                                                                e.target.src = `https://source.unsplash.com/400x250/?education,prevention`;
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Survey Tab */}
                            {activeTab === 'survey' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Program Surveys</h2>
                                    <div className="space-y-8">
                                        {/* Pre-Survey */}
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                                <span className="mr-2">📝</span>
                                                Pre-Program Survey
                                            </h3>
                                            <p className="text-gray-600 mb-4">Complete this survey before starting the program to help us understand your baseline knowledge and expectations.</p>
                                            {program.survey_question?.['pre-survey'] && (
                                                <div className="space-y-4">
                                                    {program.survey_question['pre-survey'].map((question, index) => (
                                                        <div key={index} className="bg-white p-4 rounded-lg border">
                                                            <p className="font-medium text-gray-800 mb-3">{index + 1}. {question}</p>
                                                            <div className="space-y-2">
                                                                {['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'].map((option) => (
                                                                    <label key={option} className="flex items-center">
                                                                        <input
                                                                            type="radio"
                                                                            name={`pre_${index}`}
                                                                            value={option}
                                                                            checked={surveyAnswers[`pre_${index}`] === option}
                                                                            onChange={(e) => handleAnswerChange(`pre_${index}`, e.target.value)}
                                                                            className="mr-2 text-red-600"
                                                                        />
                                                                        <span className="text-gray-700">{option}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={() => handleSurveySubmit('pre')}
                                                        disabled={submittingSurvey}
                                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 flex items-center"
                                                    >
                                                        {submittingSurvey ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                                Submitting...
                                                            </>
                                                        ) : (
                                                            'Submit Pre-Survey'
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Post-Survey */}
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                                <span className="mr-2">✅</span>
                                                Post-Program Survey
                                            </h3>
                                            <p className="text-gray-600 mb-4">Complete this survey after finishing the program to help us evaluate its effectiveness and your learning progress.</p>
                                            {program.survey_question?.['post-survey'] && (
                                                <div className="space-y-4">
                                                    {program.survey_question['post-survey'].map((question, index) => (
                                                        <div key={index} className="bg-white p-4 rounded-lg border">
                                                            <p className="font-medium text-gray-800 mb-3">{index + 1}. {question}</p>
                                                            <div className="space-y-2">
                                                                {['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'].map((option) => (
                                                                    <label key={option} className="flex items-center">
                                                                        <input
                                                                            type="radio"
                                                                            name={`post_${index}`}
                                                                            value={option}
                                                                            checked={surveyAnswers[`post_${index}`] === option}
                                                                            onChange={(e) => handleAnswerChange(`post_${index}`, e.target.value)}
                                                                            className="mr-2 text-red-600"
                                                                        />
                                                                        <span className="text-gray-700">{option}</span>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button
                                                        onClick={() => handleSurveySubmit('post')}
                                                        disabled={submittingSurvey}
                                                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-green-400 flex items-center"
                                                    >
                                                        {submittingSurvey ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                                Submitting...
                                                            </>
                                                        ) : (
                                                            'Submit Post-Survey'
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Schedule Tab */}
                            {activeTab === 'schedule' && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Program Schedule</h2>
                                    <div className="space-y-6">
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                                        <span className="mr-2">🚀</span>
                                                        Program Start
                                                    </h3>
                                                    <p className="text-gray-600 text-lg">{formatDate(program.start_date)}</p>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                                        <span className="mr-2">🏁</span>
                                                        Program End
                                                    </h3>
                                                    <p className="text-gray-600 text-lg">{formatDate(program.end_date)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                                <span className="mr-2">⚠️</span>
                                                Important Notes
                                            </h3>
                                            <ul className="text-gray-600 space-y-2">
                                                <li>• Please arrive 15 minutes early for registration</li>
                                                <li>• Bring a valid ID and any required documents</li>
                                                <li>• Complete the pre-program survey before attending</li>
                                                <li>• Participation in all sessions is required for certification</li>
                                                <li>• Contact support if you need to reschedule</li>
                                            </ul>
                                        </div>

                                        {program.location && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                                    <span className="mr-2">📍</span>
                                                    Location
                                                </h3>
                                                <a
                                                    href={program.location}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
                                                >
                                                    <span className="mr-2">🗺️</span>
                                                    View on Maps
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProgramDetail;