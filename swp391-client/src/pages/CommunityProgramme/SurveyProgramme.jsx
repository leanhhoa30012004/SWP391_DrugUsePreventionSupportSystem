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
  Users,
  MapPin,
  Calendar,
  MessageSquare,
  Send
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios';
import Swal from 'sweetalert2';

const ProgramSurveyPage = () => {
  const { program_id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [memberInfo, setMemberInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [programInfo, setProgramInfo] = useState(null);
  const [surveyType, setSurveyType] = useState('pre-survey');
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState('survey'); // 'survey' or 'responses'

  useEffect(() => {
    // Debug: Check if program_id exists
    console.log("🔍 Program ID from params:", program_id);
    console.log("🔍 Type of program_id:", typeof program_id);
    
    // Validate program_id
    if (!program_id) {
      console.error("❌ Program ID is missing from URL");
      Swal.fire({
        icon: 'error',
        title: 'Invalid URL',
        text: 'Program ID is missing from the URL. Please check the link.',
        confirmButtonColor: '#dc2626'
      }).then(() => {
        navigate('/programs');
      });
      return;
    }

    // Get program information
    setLoading(true);
    console.log("🔍 Fetching program with ID:", program_id);
    
    axios.get(`http://localhost:3000/api/program/get-all-program`)
      .then(response => {
        console.log("📊 All programs data:", response.data);
        
        // Convert program_id to number for comparison
        const programIdNumber = parseInt(program_id, 10);
        console.log("🔢 Program ID as number:", programIdNumber);
        
        // Find the specific program by ID
        const program = response.data.find(p => {
          console.log("🔍 Comparing:", p.program_id, "with", programIdNumber);
          return p.program_id === programIdNumber;
        });
        console.log("🎯 Found program:", program);
        
        if (program) {
          setProgramInfo(program);
          console.log("✅ Program info set:", program);
          
          // Always use pre-survey for now
          const currentSurveyType = 'pre-survey';
          setSurveyType(currentSurveyType);
          console.log("📝 Survey type set to:", currentSurveyType);
          
          // Log survey_question structure for debugging
          console.log("📋 Survey question object:", program.survey_question);
          console.log("📋 Survey question type:", typeof program.survey_question);
          
          // Get pre-survey questions from survey_question object
          let surveyQuestions = [];
          
          if (program.survey_question) {
            if (typeof program.survey_question === 'string') {
              // If it's a string, try to parse it
              try {
                const parsedSurveyQuestion = JSON.parse(program.survey_question);
                surveyQuestions = parsedSurveyQuestion['pre-survey'] || [];
              } catch (error) {
                console.error("❌ Error parsing survey_question string:", error);
                surveyQuestions = [];
              }
            } else if (typeof program.survey_question === 'object') {
              // If it's already an object, access directly
              surveyQuestions = program.survey_question['pre-survey'] || [];
            }
          }
          
          console.log("❓ Pre-survey questions:", surveyQuestions);
          
          // Get pre-survey responses (these are the answer choices)
          let surveyResponseChoices = [];
          if (program.response && program.response.pre_response) {
            surveyResponseChoices = program.response.pre_response;
            console.log("💬 Pre-survey response choices:", surveyResponseChoices);
          }
          
          if (!Array.isArray(surveyQuestions) || surveyQuestions.length === 0) {
            console.warn("⚠️ No pre-survey questions found!");
            Swal.fire({
              icon: 'warning',
              title: 'No Survey Questions',
              text: 'This program does not have pre-survey questions available.',
              confirmButtonColor: '#dc2626'
            });
            setQuestions([]);
            setResponses([]);
          } else {
            // Format questions with their corresponding answer choices
            const formattedQuestions = surveyQuestions.map((question, index) => ({
              id: index + 1,
              question: question,
              type: "multiple_choice",
              options: surveyResponseChoices[index] || [] // Get answer choices for this question
            }));
            
            console.log("✨ Formatted questions:", formattedQuestions);
            
            setQuestions(formattedQuestions);
            setResponses(surveyResponseChoices);
          }
        } else {
          console.error("❌ Program not found with ID:", program_id);
          console.error("❌ Available programs:", response.data.map(p => ({ id: p.program_id, title: p.title })));
          Swal.fire({
            icon: 'error',
            title: 'Program Not Found',
            text: `The program with ID ${program_id} could not be found.`,
            confirmButtonColor: '#dc2626'
          }).then(() => {
            navigate('/programs');
          });
        }
        
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ Error fetching program:", err);
        console.error("❌ Error details:", err.response?.data);
        Swal.fire({
          icon: 'error',
          title: 'Loading Error',
          text: 'Unable to retrieve program data. Please try again.',
          confirmButtonColor: '#dc2626'
        });
        setLoading(false);
      });
    
    // Get user information from localStorage
    try {
      const userString = localStorage.getItem('user');
      console.log("👤 User string from localStorage:", userString);
      
      if (userString) {
        const userObject = JSON.parse(userString);
        console.log("👤 Parsed user object:", userObject);
        setMemberInfo(userObject);
      } else {
        console.warn("⚠️ No user data found in localStorage");
      }
    } catch (error) {
      console.error("❌ Error parsing user data:", error);
    }
  }, [program_id, navigate]);

  // Handle answer change
  const handleAnswerChange = (questionId, value) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Submit survey
  const handleSubmitSurvey = async () => {
    // Validate all questions are answered
    const unansweredQuestions = questions.filter(q => !userAnswers[q.id]);
    
    if (unansweredQuestions.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Survey',
        text: `Please answer all questions before submitting. ${unansweredQuestions.length} question(s) remaining.`,
        confirmButtonColor: '#dc2626'
      });
      return;
    }

    // Confirm submission
    const result = await Swal.fire({
      title: 'Submit Survey?',
      text: 'Are you sure you want to submit your survey responses?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Submit',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    setIsSubmitting(true);

    try {
      // Prepare submission data
      const submissionData = {
        survey_type: surveyType,
        responses: questions.map(question => ({
          question_id: question.id,
          question: question.question,
          answer: userAnswers[question.id]
        })),
        member_info: memberInfo,
        submitted_at: new Date().toISOString()
      };

      console.log("📤 Submitting survey data:", submissionData);

      // Submit to API
      const response = await axios.post(
        `http://localhost:3000/api/program/submit-program-survey/${program_id}`, 
        submissionData
      );

      console.log("✅ Survey submitted successfully:", response.data);

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Survey Submitted!',
        text: 'Thank you for your feedback. Your responses have been recorded.',
        confirmButtonColor: '#dc2626'
      }).then(() => {
        navigate('/programs');
      });

    } catch (error) {
      console.error("❌ Error submitting survey:", error);
      
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'Unable to submit your survey. Please try again.',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Survey Form Component
  const SurveyForm = () => {
    return (
      <div className="space-y-8">
        {questions.map((question, questionIndex) => (
          <div key={question.id} className={`pb-8 ${questionIndex < questions.length - 1 ? "border-b border-red-200" : ""}`}>
            <div className="flex items-start mb-6">
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                {question.id}
              </div>
              <div className="font-medium text-lg text-gray-800 flex-1">
                {question.question}
                <span className="text-red-500 ml-1">*</span>
              </div>
            </div>
            
            <div className="pl-11">
              {question.type === "multiple_choice" && question.options.length > 0 ? (
                <div className="space-y-3">
                  {question.options.map((option, optionIndex) => (
                    <label key={optionIndex} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name={`question_${question.id}`}
                        value={option}
                        checked={userAnswers[question.id] === option}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500 focus:ring-2"
                      />
                      <span className="ml-3 text-gray-700 group-hover:text-red-600 transition-colors duration-200">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  value={userAnswers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="Enter your answer here..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows="4"
                />
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-center pt-8">
          <button
            onClick={handleSubmitSurvey}
            disabled={isSubmitting}
            className={`
              bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
              text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 
              flex items-center justify-center min-w-[160px] shadow-lg hover:shadow-xl
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                <span>Submit Survey</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  // Component to display survey responses
  const ResponseDisplay = () => {
    return (
      <div className="space-y-8">
        {questions.map((question, questionIndex) => (
          <div key={question.id} className={`pb-8 ${questionIndex < questions.length - 1 ? "border-b border-red-200" : ""}`}>
            <div className="flex items-start mb-6">
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                {question.id}
              </div>
              <div className="font-medium text-lg text-gray-800">
                {question.question}
              </div>
            </div>
            
            <div className="pl-11">
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center text-gray-700 mb-3">
                  <MessageSquare className="w-4 h-4 mr-2 text-red-500" />
                  <span className="font-medium text-sm">
                    Available Options ({question.options?.length || 0})
                  </span>
                </div>
                
                {question.options && question.options.length > 0 ? (
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="bg-white p-4 rounded-lg border border-red-200 shadow-sm">
                        <div className="flex items-start">
                          <div className="bg-red-100 text-red-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-3 text-sm font-medium">
                            {optionIndex + 1}
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {option}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm italic text-center py-4">
                    No options available for this question
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-8 px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{programInfo?.title}</h1>
                <p className="text-white/80">Pre-Program Survey</p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center space-x-6 text-white/80">
              <div className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                <span className="text-sm">Survey Form</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                <span className="text-sm">Program Evaluation</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span className="text-sm">{programInfo?.age_group}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex bg-white rounded-lg shadow-sm border border-red-200 p-1">
            <button
              onClick={() => setViewMode('survey')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'survey'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-red-50'
              }`}
            >
              Fill Survey
            </button>
            <button
              onClick={() => setViewMode('responses')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'responses'
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-red-50'
              }`}
            >
              View Options
            </button>
          </div>
        </div>
        
        {/* Survey Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden">
            <div className="p-8">
              {Array.isArray(questions) && questions.length > 0 ? (
                viewMode === 'survey' ? <SurveyForm /> : <ResponseDisplay />
              ) : (
                <div className="py-12 text-center text-gray-500">
                  <FileText className="w-16 h-16 mx-auto text-red-300 mb-4" />
                  <p>No survey questions available</p>
                </div>
              )}
              
              {viewMode === 'responses' && (
                <div className="mt-10 flex justify-center">
                  <button 
                    onClick={() => navigate('/programs')}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    <span>Back to Programs</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Program Information */}
          <div className="mt-8 bg-white rounded-xl shadow-lg border border-red-100 p-6">
            <div className="flex items-center text-gray-800 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <h3 className="font-semibold">Program Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-red-500" />
                <span>
                  {programInfo?.start_date && new Date(programInfo.start_date).toLocaleDateString()} - 
                  {programInfo?.end_date && new Date(programInfo.end_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-red-500" />
                <span>Check program location</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2 text-red-500" />
                <span>Target: {programInfo?.age_group}</span>
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-2 text-red-500" />
                <span>Status: {programInfo?.status}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-red-200">
              <h4 className="font-medium text-gray-800 mb-2">About this program:</h4>
              <p className="text-sm text-gray-600">{programInfo?.description?.detail}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgramSurveyPage;