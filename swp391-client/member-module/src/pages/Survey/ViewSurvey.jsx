import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Users,
  Clock,
  FileText,
  Target,
  ArrowRight,
  Heart,
  Shield,
  BookOpen,
  UserCheck,
  Info,
  ChevronDown,
  ChevronUp,
  Star,
  Award,
  Timer,
  History,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar';

const SurveySelectionPage = () => {
  // Detailed information about each survey
  const [lstSurvey, setLstSurvey] = useState([]);
  const [surveyHistory, setSurveyHistory] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get user ID from localStorage
  const [memberId, setMemberId] = useState(null);

  useEffect(() => {
    // Get user ID from localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userObject = JSON.parse(userString);
        setMemberId(userObject.user_id);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Only fetch data if we have a valid memberId
    if (!memberId) return;

    // Fetch question data from API
    async function fetchData() {
      setLoading(true);

      try {
        // Fetch survey list
        const surveyResponse = await fetch("http://localhost:3000/api/survey/view-survey", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const surveyData = await surveyResponse.json();

        if (Array.isArray(surveyData) && surveyData.length > 0) {
          setLstSurvey(surveyData);
        } else {
          console.error("Invalid survey data format:", surveyData);
          alert("No survey data available or invalid format.");
        }

        // Fetch survey history
        const historyResponse = await fetch(`http://localhost:3000/api/survey/survey-history/${memberId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const historyData = await historyResponse.json();

        // Process history data into a more usable format
        // Group by survey_id for easy access
        const historyMap = {};

        // Check if historyData has the expected structure
        if (historyData && historyData.consultHistorySurvey && Array.isArray(historyData.consultHistorySurvey)) {
          historyData.consultHistorySurvey.forEach(record => {
            if (!historyMap[record.survey_id]) {
              historyMap[record.survey_id] = [];
            }
            historyMap[record.survey_id].push({
              ...record,
              completion_date: record.date // Map date to completion_date for consistency
            });
          });
        }

        setSurveyHistory(historyMap);
      } catch (err) {
        console.error("API error:", err);
        alert("An error occurred while loading data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [memberId]);

  const handleSurveySelection = (id) => {
    navigate(`/survey/${id}`);
  };

  const handleViewHistory = (id) => {
    navigate(`/survey/history/${memberId}/${id}`);
  };

  const handleViewLatestResult = (id) => {
    // For this data structure, we'll navigate to the history page
    // since we don't have a specific result_id
    navigate(`/survey-history/${memberId}/${id}`);
  };

  const toggleCardExpansion = (surveyId) => {
    setExpandedCard(expandedCard === surveyId ? null : surveyId);
  };

  const getSurveyIcon = (surveyType) => {
    switch (surveyType) {
      case 'ASSIST':
        return <UserCheck className="w-8 h-8" />;
      case 'CRAFFT':
        return <BookOpen className="w-8 h-8" />;
      default:
        return <FileText className="w-8 h-8" />;
    }
  };

  const getSurveyStatus = (surveyId) => {
    const history = surveyHistory[surveyId] || [];

    if (history.length === 0) {
      return {
        completed: false,
        attemptCount: 0,
        lastScore: null,
        lastDate: null
      };
    }

    // Sort by date to get the most recent attempt
    const sortedHistory = [...history].sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );

    return {
      completed: true,
      attemptCount: history.length,
      lastScore: sortedHistory[0].score,
      lastDate: new Date(sortedHistory[0].date).toLocaleDateString('en-US')
    };
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Header with Background Image */}
        <div className="relative overflow-hidden shadow-lg">
          <img
            src="https://i.pinimg.com/736x/e9/14/89/e91489c136aabd067406f1c55bce389b.jpg"
            alt="Community support background"
            className="w-full h-96 object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>

          {/* Header Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 py-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                  <Shield className="w-12 h-12 text-white mr-4" />
                  <div className="w-1 h-12 bg-white/30 mr-4"></div>
                  <Heart className="w-10 h-10 text-red-400 mr-3" />
                  <Users className="w-10 h-10 text-white" />
                </div>

                <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">
                  Drug Risk Screening Surveys
                </h1>
                <p className="text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
                  Choose an appropriate survey to assess your risk level for substance use
                  and receive tailored intervention recommendations
                </p>

                <div className="mt-8 flex items-center justify-center space-x-8 text-white/80">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 mr-2" />
                    <span className="text-lg">Confidential</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-6 h-6 mr-2" />
                    <span className="text-lg">Quick Assessment</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="w-6 h-6 mr-2" />
                    <span className="text-lg">Professional Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Survey Cards */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {loading ? (
              <div className="col-span-2 flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
              </div>
            ) : (
              lstSurvey.map((survey) => {
                const status = getSurveyStatus(survey.survey_id);

                return (
                  <div
                    key={survey.survey_id}
                    className="bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden transition-all duration-300"
                  >
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-3 rounded-lg">
                            {getSurveyIcon(survey.survey_type)}
                          </div>
                          <div>
                            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-lg font-semibold text-sm">
                              ID: {survey.survey_id}
                            </div>
                            <div className="text-red-600 font-bold text-lg mt-1">
                              {survey.survey_type}
                            </div>
                          </div>
                        </div>

                        {/* Survey Status Badge */}
                        {status.completed ? (
                          <div className="bg-green-50 text-green-700 px-3 py-1 rounded-lg flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">Completed</span>
                          </div>
                        ) : (
                          <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-lg flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">Not Started</span>
                          </div>
                        )}
                      </div>

                      {/* Survey History Information */}
                      {status.completed && (
                        <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Attempts:</span> {status.attemptCount}
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Last attempt:</span> {status.lastDate}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Latest score:</span> {status.lastScore}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center group"
                          onClick={() => handleSurveySelection(survey.survey_id)}
                        >
                          <span>{status.completed ? 'Retake Survey' : 'Start Survey'}</span>
                          {status.completed ? (
                            <RefreshCw className="w-5 h-5 ml-2 group-hover:rotate-90 transition-transform duration-300" />
                          ) : (
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                          )}
                        </button>

                        {status.completed && (
                          <>
                            <button
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                              onClick={() => handleViewLatestResult(survey.survey_id)}
                            >
                              <Eye className="w-5 h-5 mr-2" />
                              <span>View Results</span>
                            </button>

                            <button
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                              onClick={() => handleViewHistory(survey.survey_id)}
                            >
                              <History className="w-5 h-5 mr-2" />
                              <span>History</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl shadow-lg border border-red-100">
            <div className="bg-gradient-to-r from-red-50 to-white p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-xl mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Why Take These Surveys?
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white rounded-lg border border-red-100 shadow-md">
                  <CheckCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-red-700 mb-2 text-lg">Early Detection</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Identify risk factors early to enable timely intervention
                  </p>
                </div>

                <div className="text-center p-6 bg-white rounded-lg border border-red-100 shadow-md">
                  <Target className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-red-700 mb-2 text-lg">Clear Guidance</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Receive specific recommendations tailored to your individual situation
                  </p>
                </div>

                <div className="text-center p-6 bg-white rounded-lg border border-red-100 shadow-md">
                  <Users className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-red-700 mb-2 text-lg">Professional Support</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Connect with counselors and appropriate support services
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-red-50">
              <h3 className="font-semibold text-gray-800 mb-6 text-xl text-center">Important Notes:</h3>
              <div className="space-y-4">
                <div className="flex items-start bg-white p-4 rounded-lg border border-red-100">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 text-sm">
                    Survey results are for reference only and do not replace professional medical diagnosis
                  </p>
                </div>
                <div className="flex items-start bg-white p-4 rounded-lg border border-red-100">
                  <Shield className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 text-sm">
                    Your personal information is strictly confidential and used only for support purposes
                  </p>
                </div>
                <div className="flex items-start bg-white p-4 rounded-lg border border-red-100">
                  <Users className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 text-sm">
                    A team of specialists is always ready to provide support and counseling when needed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SurveySelectionPage;