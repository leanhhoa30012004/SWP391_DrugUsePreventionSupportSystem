import { useState, useEffect } from 'react';
import { ChevronLeft, Clock, CheckCircle, Award, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useParams } from 'react-router-dom';

const CourseHistory = () => {
    const [learningHistory, setLearningHistory] = useState(null);
    const [expandedMoocs, setExpandedMoocs] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const course_id = useParams().course_id;

    // Keep your original API fetch logic
    useEffect(() => {
        async function fetchLearningHistory() {
            try {
                setLoading(true);
                const uid = JSON.parse(localStorage.getItem('user')).user_id;
                console.log(`Fetching learning history for user ${uid} and course ${course_id}`);
                const response = await fetch(`http://localhost:3000/api/course/get-learning-process-by-course-id-and-member-id/${uid}/${course_id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) throw new Error('Network error');
                const data = await response.json();
                console.log("Learning History Data: ", data);
                // Normalize details to always be an array
                if (data && data.learning_process) {
                    data.learning_process.forEach(mooc => {
                        if (mooc.details && !Array.isArray(mooc.details)) {
                            mooc.details = Object.values(mooc.details);
                        }
                    });
                }
                setLearningHistory(data);
                // Auto-expand first MOOC by default
                if (data && data.learning_process && data.learning_process.length > 0) {
                    setExpandedMoocs({ 0: true });
                }
            } catch (err) {
                setError(err.message);
                setLearningHistory(null);
                console.error('Fetch history error:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchLearningHistory();
    }, []);

    const toggleMoocExpansion = (moocIdx) => {
        setExpandedMoocs(prev => ({
            ...prev,
            [moocIdx]: !prev[moocIdx]
        }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        date.setHours(date.getHours());
        const dd = String(date.getDate()).padStart(2, '0');
        const MM = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();

        return `${dd}/${MM}/${yyyy}`;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-100';
            case 'in_progress': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading learning history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center text-red-600">
                    <p className="text-xl font-semibold mb-2">An error occurred</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!learningHistory) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-600 mb-2">No learning history</p>
                    <p className="text-gray-500">You haven't completed this course yet</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-300 via-red-400 to-red-500 shadow-2xl">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-start justify-between w-full">
                            <button
                                onClick={() => window.history.back()}
                                className="flex items-center text-red-100 hover:text-white transition-all duration-300 group bg-gray-300/30 hover:bg-gray-400/100 px-4 py-2 rounded-xl backdrop-blur-sm border border-red-400/80"
                            >
                                <ChevronLeft className="h-5 w-5 mr-3 group-hover:-translate-x-1 transition-transform duration-300" />
                                <span className="font-semibold">Back</span>
                            </button>
                            <div className="text-center flex-1">
                                <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                                    Learning History
                                </h1>
                                <div className="flex items-center justify-center space-x-3">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 border border-white/30">
                                        <p className="text-red-100 font-medium">Course ID: {learningHistory.course_id}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold backdrop-blur-sm border shadow-lg transition-all duration-300 hover:scale-105 ${learningHistory.status === 'completed'
                                ? 'text-green-700 bg-green-100/90 border-green-200/50'
                                : 'text-white bg-white/20 border-white/30'
                                }`}>
                                <CheckCircle className="h-5 w-5 mr-2" />
                                {learningHistory.status === 'completed' ? 'Completed' : 'In Progress'}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Decorative wave bottom */}
                <div className="relative">
                    <svg className="w-full h-6 text-red-600" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,60 C400,0 800,120 1200,60 L1200,120 L0,120 Z" fill="currentColor" />
                    </svg>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Course Statistics */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Course Overview</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-xl">
                            <div className="p-3 bg-red-100 rounded-lg">
                                <Clock className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Completion Date</p>
                                <p className="text-lg font-bold text-gray-900">{formatDate(learningHistory.date)}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-xl">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <Award className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Total Score</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {Array.isArray(learningHistory.learning_process)
                                        ? learningHistory.learning_process.reduce((total, mooc) => total + mooc.totalScore, 0)
                                        : 0} points
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <BookOpen className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 font-medium">Moocs</p>
                                <p className="text-lg font-bold text-gray-900">{Array.isArray(learningHistory.learning_process) ? learningHistory.learning_process.length : 0} moocs</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lessons List */}
                <div className="space-y-6">
                    {learningHistory.learning_process.map((mooc, idx) => (
                        <div key={mooc.mooc_id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-red-100 rounded-xl">
                                            <BookOpen className="h-6 w-6 text-red-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                Mooc {mooc.mooc_id}
                                            </h3>
                                            <p className="text-gray-600 mt-1">
                                                {mooc.details.length} questions • {mooc.totalScore} points
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleMoocExpansion(idx)}
                                        className="flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        {expandedMoocs[idx] ? (
                                            <>
                                                <ChevronUp className="h-4 w-4 mr-2" />
                                                Hide Details
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="h-4 w-4 mr-2" />
                                                Show Details
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Question Summary */}
                                <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-6">
                                    {Array.isArray(mooc.details)
                                        ? mooc.details.map((question, qIdx) => (
                                            <div key={qIdx} className="text-center">
                                                <div className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center text-sm font-bold shadow-sm transition-all duration-200 hover:scale-105 ${question.isCorrect
                                                    ? 'bg-green-100 text-green-700 border-2 border-green-200'
                                                    : 'bg-red-100 text-red-700 border-2 border-red-200'
                                                    }`}>
                                                    {qIdx + 1}
                                                </div>
                                                <p className="text-xs text-gray-600 font-medium">{question.score} pts</p>
                                            </div>
                                        ))
                                        : <div className="text-gray-500 col-span-full text-center py-4">No question details available</div>
                                    }
                                </div>

                                {/* Detailed Questions (Expandable) */}
                                {expandedMoocs[idx] && Array.isArray(mooc.details) && (
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Question Details</h4>
                                        <div className="space-y-6">
                                            {mooc.details.map((question, qIdx) => (
                                                <div key={qIdx} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                                    <div className="flex items-start space-x-4">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${question.isCorrect
                                                            ? 'bg-green-100 text-green-700 border-2 border-green-300'
                                                            : 'bg-red-100 text-red-700 border-2 border-red-300'
                                                            }`}>
                                                            {qIdx + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h5 className="text-lg font-semibold text-gray-900 mb-4">
                                                                {question.question}
                                                            </h5>

                                                            <div className="space-y-3">
                                                                {question.options.map((option, optIdx) => {
                                                                    const isCorrect = option.text === question.answer;
                                                                    const isUserAnswer = option.text === question.answer; // Assuming user's answer is stored in question.answer

                                                                    return (
                                                                        <div
                                                                            key={optIdx}
                                                                            className={`flex items-center p-4 rounded-xl border-2 transition-all duration-200 ${isCorrect
                                                                                ? 'bg-green-50 border-green-300 shadow-sm'
                                                                                : 'bg-white border-gray-200'
                                                                                }`}
                                                                        >
                                                                            <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${isCorrect
                                                                                ? 'border-green-500 bg-green-500'
                                                                                : 'border-gray-300'
                                                                                }`}>
                                                                                {isCorrect && (
                                                                                    <div className="w-2 h-2 rounded-full bg-white"></div>
                                                                                )}
                                                                            </div>
                                                                            <span className={`flex-1 ${isCorrect ? 'text-green-900 font-medium' : 'text-gray-700'}`}>
                                                                                {option.text}
                                                                            </span>
                                                                            {isCorrect && (
                                                                                <span className="ml-auto text-green-600 text-sm font-bold bg-green-100 px-3 py-1 rounded-full">
                                                                                    Correct Answer
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>

                                                            <div className="mt-4 text-right">
                                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${question.isCorrect
                                                                    ? 'text-green-700 bg-green-100'
                                                                    : 'text-red-700 bg-red-100'
                                                                    }`}>
                                                                    Score: {question.score}/{question.options.find(opt => opt.score > 0)?.score || 2} points
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CourseHistory;