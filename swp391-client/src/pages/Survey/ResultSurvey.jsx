import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  AlertTriangle,
  FileText,
  ArrowRight,
  Heart,
  Clock,
  ChevronLeft,
  Award,
  Target,
  Loader,
  Eye,
  AlertCircle
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';

const ResultSurvey = () => {
  const { sid } = useParams();

  console.log("Survey Enrollment ID:", sid);

  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [surveyInfo, setSurveyInfo] = useState(null);
  const [error, setError] = useState(null);
  const [surveyData, setSurveyData] = useState(null); // Store full survey data

  useEffect(() => {
    // Get user information from localStorage
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userID = user?.user_id;
      console.log("user:", userID)
      // if (userString) {
      //   const userObject = JSON.parse(userString);

      //   setMemberInfo(userObject);
      // }
    } catch (error) {
      console.error("Error parsing user data:", error);
      setError("Error loading user information");
    }
  }, []);

  useEffect(() => {
    if (sid) {
      fetchSurveyResults();
    }
  }, [sid]);

  const fetchSurveyResults = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching survey results for enrollment ID:", sid);

      const response = await fetch(`http://localhost:3000/api/survey/survey-history-by-survey-enrollment-id/${sid}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token') || ''}`,
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Survey results data:", data);

        // Store full survey data for navigation
        setSurveyData(data);

        // Set survey questions from survey_content
        if (data.survey_content && Array.isArray(data.survey_content)) {
          setQuestions(data.survey_content);
          setSurveyInfo({
            survey_type: data.survey_type || "Survey Results",
            survey_id: data.survey_id,
            description: data.description,
            member_name: data.member_name,
            date: data.date,
            score: data.score
          });
        } else {
          console.warn("No survey content found in response");
          setError("Survey content not found");
        }

        // Set user answers from member_answers
        if (data.member_answers) {
          console.log("User answers:", data.member_answers);

          // Handle different answer formats
          let parsedAnswers = {};
          if (typeof data.member_answers === 'string') {
            try {
              parsedAnswers = JSON.parse(data.member_answers);
            } catch (parseError) {
              console.error("Error parsing member answers:", parseError);
              parsedAnswers = {};
            }
          } else if (typeof data.member_answers === 'object') {
            parsedAnswers = data.member_answers;
          }

          setUserAnswers(parsedAnswers);
        } else {
          console.warn("No member answers found in response");
          setUserAnswers({});
        }

      } else {
        console.error("Failed to fetch survey results, status:", response.status);
        const errorData = await response.text();
        console.error("Error details:", errorData);
        setError(`Unable to retrieve survey results (Status: ${response.status})`);
      }
    } catch (error) {
      console.error("Error fetching survey results:", error);
      setError("Network error while loading survey results");
    } finally {
      setLoading(false);
    }
  };

  const handleRetakeSurvey = () => {
    if (surveyData && surveyData.survey_id) {
      navigate(`/survey/${surveyData.survey_id}`);
    } else {
      // Fallback: navigate to survey list
      navigate('/survey');
    }
  };

  const handleBackToHistory = () => {
    if (member_id) {
      navigate(`/survey-history/${member_id}`);
    } else {
      navigate('/survey');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading survey results...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white py-8 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Results</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={fetchSurveyResults}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300"
              >
                Try Again
              </button>
              <button k
                onClick={() => navigate('/survey')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-300"
              >
                Back to Survey List
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Eye className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">
                  {surveyInfo?.survey_type || "Survey Results"}
                </h1>
                <p className="text-white/80">
                  {surveyInfo?.member_name ? `${surveyInfo.member_name}'s responses` : "Your submitted answers and responses"}
                </p>
              </div>
              {surveyInfo?.score !== undefined && (
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <div className="text-sm text-white/80">Score</div>
                  <div className="text-xl font-bold">{surveyInfo.score}</div>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center space-x-6 text-white/80">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span className="text-sm">
                  {surveyInfo?.date ? new Date(surveyInfo.date).toLocaleDateString() : "View your responses"}
                </span>
              </div>
              <div className="flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                <span className="text-sm">Assessment review</span>
              </div>
            </div>
          </div>
        </div>

        {/* Survey Results Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
            <div className="p-8">
              {Array.isArray(questions) && questions.length > 0 ? (
                <div className="space-y-8">
                  {questions.map((q, index) => (
                    <div key={q.id || index} className={`pb-8 ${index < questions.length - 1 ? "border-b border-gray-200" : ""}`}>
                      <div className="flex items-start mb-4">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                          {q.id || (index + 1)}
                        </div>
                        <div className="font-medium text-lg text-gray-800">
                          {q.question}
                        </div>
                      </div>

                      <div className="space-y-2 pl-11">
                        {Array.isArray(q.options) && q.options.map((opt, optIndex) => {
                          const optionText = typeof opt === 'object' ? opt.text : opt;

                          // Check if this option is selected
                          let isSelected = false;
                          const userAnswer = userAnswers[q.id || (index + 1)];

                          if (q.type === "multiple_choice") {
                            // For multiple choice, check if answer is an array and includes this option
                            isSelected = Array.isArray(userAnswer) && userAnswer.includes(optionText);
                          } else {
                            // For single choice, check direct equality
                            isSelected = userAnswer === optionText;
                          }

                          return (
                            <div
                              key={optIndex}
                              className={`flex items-center space-x-3 py-3 px-4 rounded-lg border transition-all duration-200 ${isSelected
                                  ? "border-green-300 bg-green-50"
                                  : "border-gray-200 bg-gray-50"
                                }`}
                            >
                              <div className={`h-5 w-5 flex items-center justify-center ${q.type === "multiple_choice" ? "rounded" : "rounded-full"
                                } ${isSelected
                                  ? "bg-green-500 text-white"
                                  : "bg-gray-300"
                                }`}>
                                {isSelected && (
                                  q.type === "multiple_choice"
                                    ? <CheckCircle className="w-4 h-4" />
                                    : <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                              <span className={`flex-1 ${isSelected ? "text-green-700 font-medium" : "text-gray-500"}`}>
                                {optionText}
                              </span>
                              {isSelected && (
                                <span className="text-green-600 text-sm font-medium">
                                  ✓ Selected
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-gray-500">
                  <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p>No survey data available</p>
                  <p className="text-sm mt-2">The survey content could not be loaded.</p>
                </div>
              )}

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleBackToHistory}
                  className="bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  <span>Back to History</span>
                </button>

                <button
                  onClick={handleRetakeSurvey}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center group"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  <span>{surveyData?.survey_id ? "Retake Survey" : "View Surveys"}</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Additional information */}
          <div className="mt-8 bg-white rounded-xl shadow-lg border border-blue-100 p-6">
            <div className="flex items-center text-gray-800 mb-4">
              <AlertTriangle className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="font-semibold">Survey Review Notes</h3>
            </div>

            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2"></div>
                <span>This is a read-only view of your submitted survey responses</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2"></div>
                <span>Your answers are highlighted in green to show your selections</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2"></div>
                <span>You can retake the survey or view your history from the buttons above</span>
              </li>
              {surveyInfo?.score !== undefined && (
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2"></div>
                  <span>Your survey score: <strong>{surveyInfo.score}</strong></span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultSurvey;