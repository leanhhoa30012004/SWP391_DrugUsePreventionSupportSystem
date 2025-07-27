import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Award,
    ChevronDown,
    ChevronUp,
    FileText,
    AlertTriangle,
    Download,
    Printer,
    Share2,
    MessageCircle,
    CheckCircle,
    XCircle
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';

const SurveyHistoryPage = () => {
    const { memberId, id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [surveyInfo, setSurveyInfo] = useState(null);
    const [expandedResult, setExpandedResult] = useState(null);
    const [detailsData, setDetailsData] = useState({}); // Store Q&A details for each enrollment
    const [loadingDetails, setLoadingDetails] = useState({});

    useEffect(() => {
        const fetchHistoryData = async () => {
            setLoading(true);
            try {
                // Fetch survey history for this specific member
                const response = await fetch(`http://localhost:3000/api/survey/survey-history/${memberId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                console.log("Dataa:", data);

                // Filter history for the specific survey
                if (data && data.consultHistorySurvey && Array.isArray(data.consultHistorySurvey)) {
                    const filteredHistory = data.consultHistorySurvey
                        .filter(item => item.survey_id.toString() === id.toString())
                        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first

                    setHistoryData(filteredHistory);

                    // Get survey info if available
                    if (filteredHistory.length > 0) {
                        const surveyResponse = await fetch(`http://localhost:3000/api/survey/view-survey`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        });

                        if (surveyResponse.ok) {
                            const surveyData = await surveyResponse.json();
                            const thisSurvey = surveyData.find(s => s.survey_id.toString() === id.toString());
                            if (thisSurvey) {
                                setSurveyInfo(thisSurvey);
                            }
                        }
                    }
                } else {
                    setHistoryData([]);
                }
            } catch (err) {
                console.error("Error fetching history data:", err);
                setError("Failed to load survey history. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistoryData();
    }, [memberId, id]);

    // Fetch detailed Q&A for a specific survey enrollment
    const fetchSurveyDetails = async (surveyEnrollmentId) => {
        if (detailsData[surveyEnrollmentId]) {
            return; // Already loaded
        }

        setLoadingDetails(prev => ({ ...prev, [surveyEnrollmentId]: true }));

        try {
            const response = await fetch(`http://localhost:3000/api/survey/survey-history-by-survey-enrollment-id/${surveyEnrollmentId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            console.log("Survey details:", data);

            setDetailsData(prev => ({
                ...prev,
                [surveyEnrollmentId]: data
            }));
        } catch (err) {
            console.error("Error fetching survey details:", err);
            setDetailsData(prev => ({
                ...prev,
                [surveyEnrollmentId]: { error: "Failed to load details" }
            }));
        } finally {
            setLoadingDetails(prev => ({ ...prev, [surveyEnrollmentId]: false }));
        }
    };

    const toggleResultExpansion = async (resultId, surveyEnrollmentId) => {
        if (expandedResult === resultId) {
            setExpandedResult(null);
        } else {
            setExpandedResult(resultId);
            // Fetch details when expanding
            await fetchSurveyDetails(surveyEnrollmentId);
        }
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const handleBackToSurveys = () => {
        navigate(-1);
    };

    const getSeverityClass = (score) => {
        if (score < 8) return "bg-green-50 text-green-700";
        if (score < 15) return "bg-yellow-50 text-yellow-700";
        if (score < 20) return "bg-orange-50 text-orange-700";
        return "bg-red-50 text-red-700";
    };

    const getSeverityText = (score) => {
        if (score < 8) return "Low Risk";
        if (score < 15) return "Moderate Risk";
        if (score < 20) return "High Risk";
        return "Very High Risk";
    };

    // Render Q&A details
    const renderQuestionAnswerDetails = (surveyEnrollmentId) => {
        const details = detailsData[surveyEnrollmentId];
        const isLoading = loadingDetails[surveyEnrollmentId];

        if (isLoading) {
            return (
                <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
                </div>
            );
        }

        if (!details) {
            return (
                <div className="text-center py-4 text-gray-500">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>Click to load question details</p>
                </div>
            );
        }

        if (details.error) {
            return (
                <div className="text-center py-4 text-red-500">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                    <p>{details.error}</p>
                </div>
            );
        }

        const { survey_content, member_answers } = details;

        if (!survey_content || !member_answers) {
            return (
                <div className="text-center py-4 text-gray-500">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No question details available</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-red-500" />
                    Questions & Answers
                </h4>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {survey_content.map((question, qIndex) => {
                        // Get user answer using question id or index + 1
                        const answerKey = question.id || (qIndex + 1);
                        const userAnswer = member_answers[answerKey];
                        
                        return (
                            <div key={qIndex} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="mb-3">
                                    <p className="font-medium text-gray-800 mb-2">
                                        Q{qIndex + 1}: {question.question}
                                    </p>
                                    
                                    {/* Handle multiple_choice type */}
                                    {question.type === 'multiple_choice' && question.options && (
                                        <div className="space-y-1 mb-3">
                                            {question.options.map((option, optIndex) => {
                                                // Extract text from option (could be string or object)
                                                const optionText = typeof option === 'string' ? option : option?.text || option;
                                                const optionScore = typeof option === 'object' ? option?.score : null;
                                                
                                                // For multiple choice, userAnswer might be an array
                                                const isSelected = Array.isArray(userAnswer) 
                                                    ? userAnswer.includes(optionText)
                                                    : userAnswer === optionText;
                                                
                                                return (
                                                    <div 
                                                        key={optIndex} 
                                                        className={`flex items-center p-2 rounded text-sm ${
                                                            isSelected 
                                                                ? 'bg-red-100 text-red-700 border border-red-200' 
                                                                : 'bg-white text-gray-600 border border-gray-100'
                                                        }`}
                                                    >
                                                        {isSelected ? (
                                                            <CheckCircle className="w-4 h-4 mr-2 text-red-500" />
                                                        ) : (
                                                            <div className="w-4 h-4 mr-2 border border-gray-300 rounded-full"></div>
                                                        )}
                                                        <span>{optionText}</span>
                                                        {isSelected && optionScore && (
                                                            <span className="ml-auto text-xs font-medium">
                                                                +{optionScore} pts
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Handle single_choice type */}
                                    {question.type === 'single_choice' && question.options && (
                                        <div className="space-y-1 mb-3">
                                            {question.options.map((option, optIndex) => {
                                                // Extract text from option (could be string or object)
                                                const optionText = typeof option === 'string' ? option : option?.text || option;
                                                const optionScore = typeof option === 'object' ? option?.score : null;
                                                
                                                const isSelected = userAnswer === optionText;
                                                
                                                return (
                                                    <div 
                                                        key={optIndex} 
                                                        className={`flex items-center p-2 rounded text-sm ${
                                                            isSelected 
                                                                ? 'bg-red-100 text-red-700 border border-red-200' 
                                                                : 'bg-white text-gray-600 border border-gray-100'
                                                        }`}
                                                    >
                                                        {isSelected ? (
                                                            <CheckCircle className="w-4 h-4 mr-2 text-red-500" />
                                                        ) : (
                                                            <div className="w-4 h-4 mr-2 border border-gray-300 rounded-full"></div>
                                                        )}
                                                        <span>{optionText}</span>
                                                        {/* {isSelected && optionScore && (
                                                            <span className="ml-auto text-xs font-medium">
                                                                +{optionScore} pts
                                                            </span>
                                                        )} */}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Handle text type */}
                                    {question.type === 'text' && userAnswer && (
                                        <div className="bg-white p-3 rounded border border-gray-200">
                                            <p className="text-gray-700 text-sm italic">
                                                "{userAnswer}"
                                            </p>
                                        </div>
                                    )}

                                    {/* Handle rating type */}
                                    {question.type === 'rating' && userAnswer !== undefined && (
                                        <div className="bg-white p-3 rounded border border-gray-200">
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-600 mr-2">Rating:</span>
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`w-4 h-4 mr-1 rounded-full ${
                                                                i < parseInt(userAnswer) 
                                                                    ? 'bg-red-500' 
                                                                    : 'bg-gray-200'
                                                            }`}
                                                        ></div>
                                                    ))}
                                                    <span className="ml-2 text-sm font-medium">
                                                        {userAnswer}/5
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Show "No answer" if no user answer */}
                                    {!userAnswer && (
                                        <div className="bg-gray-100 p-3 rounded border border-gray-200">
                                            <p className="text-gray-500 text-sm italic">No answer provided</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-5xl mx-auto px-4">
                    {/* Back button and header */}
                    <div className="mb-8">
                        <button
                            onClick={handleBackToSurveys}
                            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            <span>Back to Surveys</span>
                        </button>

                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Survey History
                        </h1>

                        {surveyInfo && (
                            <div className="flex items-center">
                                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-medium">
                                    {surveyInfo.survey_type}
                                </span>
                                <span className="mx-2 text-gray-400">•</span>
                                <span className="text-gray-500">
                                    {historyData.length} {historyData.length === 1 ? 'attempt' : 'attempts'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Main content */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading History</h3>
                            <p className="text-red-700">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : historyData.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-800 mb-2">No History Found</h3>
                            <p className="text-gray-600 mb-6">
                                You haven't completed this survey yet or the history is not available.
                            </p>
                            <button
                                onClick={() => navigate(`/survey/${id}`)}
                                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Take Survey Now
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Summary card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary</h2>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center mb-2">
                                            <Calendar className="w-5 h-5 text-red-500 mr-2" />
                                            <span className="text-sm text-gray-600 font-medium">First Attempt</span>
                                        </div>
                                        <p className="text-gray-800">
                                            {formatDate(historyData[historyData.length - 1].date)}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center mb-2">
                                            <Clock className="w-5 h-5 text-red-500 mr-2" />
                                            <span className="text-sm text-gray-600 font-medium">Latest Attempt</span>
                                        </div>
                                        <p className="text-gray-800">
                                            {formatDate(historyData[0].date)}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center mb-2">
                                            <Award className="w-5 h-5 text-red-500 mr-2" />
                                            <span className="text-sm text-gray-600 font-medium">Score Trend</span>
                                        </div>
                                        <p className="text-gray-800">
                                            {historyData[0].score > historyData[historyData.length - 1].score ?
                                                "Increasing" : historyData[0].score < historyData[historyData.length - 1].score ?
                                                    "Decreasing" : "Stable"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* History list */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-800">Detailed History</h2>
                                </div>

                                <div className="divide-y divide-gray-200">
                                    {historyData.map((result, index) => (
                                        <div key={result.survey_enrollment_id || index} className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                                <div className="mb-4 md:mb-0">
                                                    <div className="flex items-center mb-2">
                                                        <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                                                        <span className="text-gray-800 font-medium">
                                                            {formatDate(result.date)}
                                                        </span>
                                                        {index === 0 && (
                                                            <span className="ml-2 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                                                                Latest
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center">
                                                        <span className="text-sm text-gray-500 mr-4">
                                                            Score: <span className="font-semibold">{result.score}</span>
                                                        </span>
                                                        <span className={`text-xs px-2 py-1 rounded ${getSeverityClass(result.score)}`}>
                                                            {getSeverityText(result.score)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => toggleResultExpansion(
                                                            result.survey_enrollment_id || index, 
                                                            result.survey_enrollment_id
                                                        )}
                                                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                                                    >
                                                        <span className="mr-2 text-sm">View Details</span>
                                                        {expandedResult === (result.survey_enrollment_id || index) ?
                                                            <ChevronUp className="w-5 h-5" /> :
                                                            <ChevronDown className="w-5 h-5" />
                                                        }
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Expanded content with Q&A */}
                                            {expandedResult === (result.survey_enrollment_id || index) && (
                                                <div className="mt-6 pt-4 border-t border-gray-100">
                                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                                        <h4 className="font-medium text-gray-800 mb-2">Result Summary</h4>
                                                        <p className="text-gray-600 mb-3">
                                                            Based on your responses, you scored {result.score} points,
                                                            indicating a {getSeverityText(result.score).toLowerCase()} level.
                                                        </p>
                                                    </div>

                                                    {/* Q&A Details Section */}
                                                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                                                        {renderQuestionAnswerDetails(result.survey_enrollment_id)}
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm">
                                                            <Download className="w-4 h-4 mr-1" />
                                                            <span>Download PDF</span>
                                                        </button>
                                                        <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm">
                                                            <Printer className="w-4 h-4 mr-1" />
                                                            <span>Print Results</span>
                                                        </button>
                                                        
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SurveyHistoryPage;