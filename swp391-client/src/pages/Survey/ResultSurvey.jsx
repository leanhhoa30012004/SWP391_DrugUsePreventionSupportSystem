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
  Eye
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';

const ResultSurvey = () => {
  const { sid } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [memberInfo, setMemberInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [surveyInfo, setSurveyInfo] = useState(null);

  useEffect(() => {
    // Get survey information
    setLoading(true);
    fetch(`http://localhost:3000/api/survey/survey-by-id/${sid}`)
      .then(res => res.json())
      .then(data => {
        console.log("Survey data:", data);
        setQuestions(data.content);
        setSurveyInfo(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching survey:", err);
        alert("Unable to retrieve survey data");
        setLoading(false);
      });
    
    // Get user information from localStorage
    try {
      const userString = localStorage.getItem('user');
      if (userString) {
        const userObject = JSON.parse(userString);
        setMemberInfo(userObject);
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }, [sid]);

  // Fetch user's submitted answers
  useEffect(() => {
    if (memberInfo && sid) {
      fetchUserAnswers();
    }
  }, [memberInfo, sid]);

  const fetchUserAnswers = async () => {
    try {
      const memberId = memberInfo.user_id || memberInfo.id;
      console.log("Fetching answers for member:", memberId, "survey:", sid);
      
      const response = await fetch(`http://localhost:3000/api/survey/get-all-survey-follow-survey-enrollment-by-member-id/${memberId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Survey enrollment data:", data);
        
        // Tìm survey có survey_id trùng với sid hiện tại
        const currentSurvey = data.find(item => item.survey_id == sid);
        if (currentSurvey) {
          console.log("Found survey:", currentSurvey);
          
          if (currentSurvey.response) {
            try {
              // Parse response từ string thành object
              const answers = JSON.parse(currentSurvey.response);
              console.log("Parsed user answers:", answers);
              setUserAnswers(answers);
            } catch (parseError) {
              console.error("Error parsing response:", parseError);
              console.log("Raw response:", currentSurvey.response);
            }
          } else {
            console.log("No response field in survey data. Available fields:", Object.keys(currentSurvey));
            console.log("This API might not return detailed answers. Need different endpoint.");
          }
        } else {
          console.log("No answers found for survey ID:", sid);
          console.log("Available surveys:", data.map(item => item.survey_id));
          console.log("Current survey data:", currentSurvey);
        }
      } else {
        console.log("Failed to fetch survey enrollment, status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user answers:", error);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading survey results...</p>
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
    <div>
                <h1 className="text-2xl font-bold">Survey Results {surveyInfo?.survey_type || `#${sid}`}</h1>
                <p className="text-white/80">Your submitted answers and responses</p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center space-x-6 text-white/80">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span className="text-sm">View your responses</span>
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
                    <div key={q.id} className={`pb-8 ${index < questions.length - 1 ? "border-b border-gray-200" : ""}`}>
                      <div className="flex items-start mb-4">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                          {q.id}
                        </div>
                        <div className="font-medium text-lg text-gray-800">
                          {q.question}
                        </div>
                      </div>
                      
                      <div className="space-y-2 pl-11">
                        {q.type === "multiple_choice" ? (
                          // Handle multiple choice questions
                          Array.isArray(q.options) && q.options.map((opt, index) => {
                            const optionText = typeof opt === 'object' ? opt.text : opt;
                            const isSelected = userAnswers[q.id]?.includes(optionText) || false;
                            
                            return (
                              <div 
                                key={index} 
                                className={`flex items-center space-x-3 py-3 px-4 rounded-lg border transition-all duration-200 ${
                                  isSelected 
                                    ? "border-green-300 bg-green-50" 
                                    : "border-gray-200 bg-gray-50"
                                }`}
                              >
                                <div className={`h-5 w-5 rounded flex items-center justify-center ${
                                  isSelected 
                                    ? "bg-green-500 text-white" 
                                    : "bg-gray-300"
                                }`}>
                                  {isSelected && <CheckCircle className="w-4 h-4" />}
                                </div>
                                <span className={`${isSelected ? "text-green-700 font-medium" : "text-gray-500"}`}>
                                  {optionText}
                                </span>
                                {isSelected && (
                                  <span className="ml-auto text-green-600 text-sm font-medium">
                                    ✓ Selected
                                  </span>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          // Handle single choice questions
                          Array.isArray(q.options) && q.options.map((opt, index) => {
                            const optionText = typeof opt === 'object' ? opt.text : opt;
                            const isSelected = userAnswers[q.id] === optionText;
                            
                            return (
                              <div 
                                key={index} 
                                className={`flex items-center space-x-3 py-3 px-4 rounded-lg border transition-all duration-200 ${
                                  isSelected 
                                    ? "border-green-300 bg-green-50" 
                                    : "border-gray-200 bg-gray-50"
                                }`}
                              >
                                <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                                  isSelected 
                                    ? "bg-green-500 text-white" 
                                    : "bg-gray-300"
                                }`}>
                                  {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                                <span className={`${isSelected ? "text-green-700 font-medium" : "text-gray-500"}`}>
                                  {optionText}
                                </span>
                                {isSelected && (
                                  <span className="ml-auto text-green-600 text-sm font-medium">
                                    ✓ Selected
                                  </span>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-gray-500">
                  <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p>No survey data available or loading...</p>
                </div>
              )}
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/survey')}
                  className="bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  <span>Back to Survey List</span>
                </button>
                
                <button 
                  onClick={() => navigate(`/survey/${sid}`)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center group"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  <span>Take Survey Again</span>
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
                <span>You can retake the survey if you want to update your responses</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultSurvey;
