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
    Eye
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
const SurveyHistoryPage = () => {
    const { memberId, id } = useParams();

    console.log("Member ID:", memberId);
    console.log("Survey ID:", id);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [historyData, setHistoryData] = useState([]);
    const [surveyInfo, setSurveyInfo] = useState(null);
    const [expandedResult, setExpandedResult] = useState(null);

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

    const toggleResultExpansion = (resultId) => {
        setExpandedResult(expandedResult === resultId ? null : resultId);
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
        // Adjust these thresholds based on your scoring system
        if (score < 8) return "bg-green-50 text-green-700";
        if (score < 15) return "bg-yellow-50 text-yellow-700";
        if (score < 20) return "bg-orange-50 text-orange-700";
        return "bg-red-50 text-red-700";
    };

    const getSeverityText = (score) => {
        // Adjust these thresholds based on your scoring system
        if (score < 8) return "Low Risk";
        if (score < 15) return "Moderate Risk";
        if (score < 20) return "High Risk";
        return "Very High Risk";
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
                                        <div key={result.id || index} className="p-6">
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
                                                        onClick={() => toggleResultExpansion(result.id || index)}
                                                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                                    >
                                                        {expandedResult === (result.id || index) ?
                                                            <ChevronUp className="w-5 h-5" /> :
                                                            <ChevronDown className="w-5 h-5" />
                                                        }
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Expanded content */}
                                            {expandedResult === (result.id || index) && (
                                                <div className="mt-6 pt-4 border-t border-gray-100">
                                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                                        <h4 className="font-medium text-gray-800 mb-2">Result Summary</h4>
                                                        <p className="text-gray-600 mb-3">
                                                            Based on your responses, you scored {result.score} points,
                                                            indicating a {getSeverityText(result.score).toLowerCase()} level.
                                                        </p>

                                                        {/* This would be populated with actual recommendation data */}
                                                        <div className="bg-white p-3 rounded border border-gray-200">
                                                            <h5 className="text-sm font-medium text-gray-700 mb-1">Recommendations:</h5>
                                                            <p className="text-sm text-gray-600">
                                                                {result.recommendation || "Recommendations not available for this attempt."}
                                                            </p>
                                                        </div>
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
                                                        <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm">
                                                            <Share2 className="w-4 h-4 mr-1" />
                                                            <span>Share with Provider</span>
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