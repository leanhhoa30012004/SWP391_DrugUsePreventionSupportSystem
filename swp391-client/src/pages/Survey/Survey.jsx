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
  Loader
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';

const SurveyPage = () => {
  const { sid } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [memberInfo, setMemberInfo] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(null);
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
        setSurveyInfo(data); // Save survey information
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

  const handleChange = (qid, value) => {
    setAnswers(prev => ({
      ...prev,
      [qid]: value
    }));
  };

  const handleMultiChange = (qid, option) => {
    setAnswers(prev => {
      const arr = prev[qid] || [];
      if (arr.includes(option)) {
        return { ...prev, [qid]: arr.filter(o => o !== option) };
      } else {
        return { ...prev, [qid]: [...arr, option] };
      }
    });
  };

  const handleSubmit = () => {
    // Check if all questions have been answered
    const unansweredQuestions = questions.filter(q => !answers[q.id]);
    if (unansweredQuestions.length > 0) {
      alert(`Please answer all questions before submitting.`);
      return;
    }
    
    // Get user ID from memberInfo object or from localStorage
    let memberId = '';
    
    if (memberInfo && memberInfo.id) {
      memberId = memberInfo.id;
    } else {
      try {
        const userString = localStorage.getItem('user');
        if (userString) {
          const userObject = JSON.parse(userString);
          memberId = userObject.user_id;
        }
      } catch (error) {
        console.error("Error getting user ID:", error);
      }
    }
    
    // Create data object according to backend requirements
    const submitData = {
      survey_id: sid,
      answers: answers,
      member_id: memberId,
      enroll_version: "1.0" // Or get from survey data if available
    };
    
    console.log("Data to submit:", submitData);
    setLoading(true);
    
    fetch("http://localhost:3000/api/survey/submit-survey", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
      },
      body: JSON.stringify(submitData)
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Error submitting survey");
        }
        return res.json();
      })
      .then(data => {
        console.log("Result:", data);
        setScore(data.totalScore); // Save score from backend
        setIsSubmitted(true); // Mark as submitted
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        alert("Survey submission failed!");
        setLoading(false);
      });
  };

  // Component to display results
  const ResultDisplay = () => {
    // Determine risk level based on score
    const getRiskLevel = () => {
      if (score <= 10) return { level: "Low", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
      if (score <= 20) return { level: "Medium", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" };
      return { level: "High", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
    };
    
    const risk = getRiskLevel();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-white text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Survey Completed!</h2>
              <p className="text-white/80">
                Thank you for completing the screening assessment
              </p>
            </div>
            
            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Assessment Results</h3>
                
                <div className={`p-6 rounded-lg ${risk.bg} border ${risk.border} mb-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-600 font-medium">Your score</p>
                      <p className={`text-4xl font-bold ${risk.color}`}>{score}</p>
                    </div>
                    <div className={`p-3 rounded-full ${risk.bg} border ${risk.border}`}>
                      <Award className={`w-10 h-10 ${risk.color}`} />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <p className="font-medium text-gray-700">Risk level:</p>
                    <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${risk.color} ${risk.bg}`}>
                      {risk.level}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-red-500" />
                    Recommendations
                  </h4>
                  <ul className="space-y-3">
                    {risk.level === "Low" && (
                      <>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Continue maintaining a healthy lifestyle</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Participate in community activities on drug prevention</span>
                        </li>
                      </>
                    )}
                    
                    {risk.level === "Medium" && (
                      <>
                        <li className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Consult with a professional advisor</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Monitor and reassess after 3 months</span>
                        </li>
                      </>
                    )}
                    
                    {risk.level === "High" && (
                      <>
                        <li className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Need to see a healthcare professional immediately</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Consider in-depth intervention methods</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/survey')}
                  className="bg-white border border-red-500 text-red-600 hover:bg-red-50 font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  <span>Back to List</span>
                </button>
                
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  <span>Retake Survey</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Processing...</p>
          </div>
        </div>
      </>
    );
  }

  if (isSubmitted) {
    return (
      <>
        <Navbar />
        <ResultDisplay />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-8 px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Survey {surveyInfo?.survey_type || `#${sid}`}</h1>
                <p className="text-white/80">Please answer all questions below</p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center space-x-6 text-white/80">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span className="text-sm">About 5-10 minutes</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                <span className="text-sm">Screening assessment</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Survey Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden">
            <div className="p-8">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                {Array.isArray(questions) && questions.length > 0 ? (
                  <div className="space-y-8">
                    {questions.map((q, index) => (
                      <div key={q.id} className={`pb-8 ${index < questions.length - 1 ? "border-b border-gray-200" : ""}`}>
                        <div className="flex items-start mb-4">
                          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
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
                              // Check if options is object or string
                              const optionText = typeof opt === 'object' ? opt.text : opt;
                              const isChecked = answers[q.id]?.includes(optionText) || false;
                              
                              return (
                                <label 
                                  key={index} 
                                  className={`flex items-center space-x-3 py-3 px-4 rounded-lg border transition-all duration-200 ${
                                    isChecked 
                                      ? "border-red-300 bg-red-50" 
                                      : "border-gray-200 hover:border-red-200 hover:bg-red-50/30"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    className="form-checkbox h-5 w-5 text-red-600 rounded focus:ring-red-500"
                                    checked={isChecked}
                                    onChange={() => handleMultiChange(q.id, optionText)}
                                  />
                                  <span className="text-gray-700">{optionText}</span>
                                </label>
                              );
                            })
                          ) : (
                            // Handle single choice questions
                            Array.isArray(q.options) && q.options.map((opt, index) => {
                              // Check if options is object or string
                              const optionText = typeof opt === 'object' ? opt.text : opt;
                              const isChecked = answers[q.id] === optionText;
                              
                              return (
                                <label 
                                  key={index} 
                                  className={`flex items-center space-x-3 py-3 px-4 rounded-lg border transition-all duration-200 ${
                                    isChecked 
                                      ? "border-red-300 bg-red-50" 
                                      : "border-gray-200 hover:border-red-200 hover:bg-red-50/30"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    className="form-radio h-5 w-5 text-red-600 focus:ring-red-500"
                                    name={`q${q.id}`}
                                    value={optionText}
                                    checked={isChecked}
                                    onChange={() => handleChange(q.id, optionText)}
                                  />
                                  <span className="text-gray-700">{optionText}</span>
                                </label>
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
                    type="button"
                    onClick={() => navigate('/survey')}
                    className="bg-white border border-red-500 text-red-600 hover:bg-red-50 font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    <span>Go Back</span>
                  </button>
                  
                  <button 
                    type="submit" 
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center group"
                  >
                    <span>Submit Survey</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Additional information */}
          <div className="mt-8 bg-white rounded-xl shadow-lg border border-red-100 p-6">
            <div className="flex items-center text-gray-800 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="font-semibold">Important Notes</h3>
            </div>
            
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 mr-2"></div>
                <span>Survey results are for reference only and do not replace professional medical diagnosis</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 mr-2"></div>
                <span>Your personal information is strictly confidential</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 mr-2"></div>
                <span>Please answer honestly for the most accurate assessment results</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SurveyPage;