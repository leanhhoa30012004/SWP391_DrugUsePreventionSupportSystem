import React, { useState, useEffect, useRef } from 'react';
import {
    CheckCircle,
    AlertTriangle,
    Play,
    Pause,
    FileText,
    Award,
    ArrowRight,
    BookOpen,
    Clock,
    CheckSquare,
    ChevronRight,
    Video,
    RefreshCw,
    Heart,
    Shield,
    Users,
    Target,
    Info
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Swal from 'sweetalert2';

const CourseLearning = () => {
    const uid = JSON.parse(localStorage.getItem('user')).user_id;
    const { course_id } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [videoCompleted, setVideoCompleted] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizScore, setQuizScore] = useState(0);
    const videoRef = useRef(null);
    const navigate = useNavigate();

    // Fetch course data
    useEffect(() => {
        async function fetchCourseData() {
            setLoading(true);
            try {
                // Call API to get course information that the member is learning
                const response = await fetch(`http://localhost:3000/api/course/continues-learn-course-by-id/${uid}/${course_id}`);
                console.log('response:', response)
                // Check if response is not successful
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // Parse JSON data from response
                const data = await response.json();

                // Update state with received data
                setCourseData(data);
            } catch (err) {
                console.error("Error fetching course data:", err);
                alert("An error occurred while loading course data.");
            } finally {
                setLoading(false);
            }
        }

        // Only call API when both memberId and courseId are available
        if (uid && course_id) {
            fetchCourseData();
        }
    }, [uid, course_id]);

    // Handle video completion
    const handleVideoEnd = () => {
        setVideoCompleted(true);
    };

    // Start quiz
    const handleStartQuiz = () => {
        setShowQuiz(true);
    };

    // Handle answer selection
    const handleAnswerSelect = (questionIndex, optionIndex) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionIndex]: optionIndex
        });
    };

    // Navigate to next question
    const handleNextQuestion = () => {
        if (selectedAnswers[currentQuestionIndex] === undefined) {
            Swal.fire({
                icon: 'warning',
                title: 'No answer selected!',
                text: 'Please select an answer before proceeding to the next question.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });
            return;
        }
        if (currentQuestionIndex < courseData.quiz.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    // Navigate to previous question
    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    // Submit quiz
    const handleSubmitQuiz = async () => {
        try {
            // Build the answer payload
            const payload = buildAnswerPayload();
            console.log("Submitting payload (raw):", payload);
            console.log("JSON payload:", JSON.stringify(payload));
                
            const response = await fetch('http://localhost:3000/api/course/submit-mooc-course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.warn(`❌ Quiz submission failed: ${errorText}`);
                navigate('/course-completed', { notice: errorText });
            }
            
    
            const result = await response.json();
            const score = result.score || 0;
            setQuizScore(score);
            if (score >= 8) {
                // Navigate to completed page or show completed UI
                navigate('/course-completed', { state: { score, courseId: course_id } });
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Not enough points to pass!',
                    text: 'You did not achieve the minimum score to pass this quiz. Please review the lesson and try again.',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            navigate('/course-completed',{notice: error.message})
        }
    };
    

    const buildAnswerPayload = () => {
        const answers = {};
        Object.keys(selectedAnswers).forEach((questionIndex) => {
            // Get selected answer text
            const answerText = courseData.quiz[questionIndex].options[selectedAnswers[questionIndex]].text;
            // Key is question number (starting from 1)
            answers[(parseInt(questionIndex) + 1).toString()] = answerText;
        });

        // Create object in correct format
        const payload = {
            member_id: uid,
            course_id: parseInt(course_id),
            member_answer: {
                mooc_id: courseData.mooc_id || 1, // or get appropriate id
                answers: answers
            },
            version: courseData.version || 1.0
        };

        // Convert to JSON string
        return payload;
        
    };

    // Retry quiz
    const handleRetryQuiz = () => {
        setSelectedAnswers({});
        setCurrentQuestionIndex(0);
        setQuizSubmitted(false);
    };

    // Return to course list
    const handleReturnToCourses = () => {
        navigate('/courses');
    };

    // Extract YouTube video ID from URL
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return '';
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11)
            ? `https://www.youtube.com/embed/${match[2]}`
            : '';
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                {/* Course Header */}
                <div className="relative overflow-hidden shadow-lg">
                    <img
                        src="https://i.pinimg.com/736x/e9/14/89/e91489c136aabd067406f1c55bce389b.jpg"
                        alt="Course background"
                        className="w-full h-96 object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>

                    {/* Header Content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="max-w-7xl mx-auto px-4 py-8">
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-6">
                                    <BookOpen className="w-12 h-12 text-white mr-4" />
                                    <div className="w-1 h-12 bg-white/30 mr-4"></div>
                                    <Video className="w-10 h-10 text-blue-300 mr-3" />
                                </div>

                                <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">
                                    {courseData.title}
                                </h1>
                                <p className="text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
                                    {courseData.description}
                                </p>

                                <div className="mt-8 flex items-center justify-center space-x-8 text-white/80">
                                    <div className="flex items-center">
                                        <Clock className="w-6 h-6 mr-2" />
                                        <span className="text-lg">{courseData.duration}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FileText className="w-6 h-6 mr-2" />
                                        <span className="text-lg">{courseData.quiz?.length ?? 0} questions</span>

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
                    {!showQuiz ? (
                        /* Video Learning Section */
                        <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden mb-8">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg">
                                            <Play className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg font-semibold text-sm">
                                                ID: {course_id}
                                            </div>
                                            <div className="text-blue-600 font-bold text-lg mt-1">
                                                Lesson Video
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        {videoCompleted ? (
                                            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-lg flex items-center">
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                <span className="text-sm font-medium">Completed</span>
                                            </div>
                                        ) : (
                                            <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-lg flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                <span className="text-sm font-medium">Watching...</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="aspect-w-16 aspect-h-9 mb-6">
                                    <iframe
                                        ref={videoRef}
                                        className="w-full h-[500px] rounded-lg"
                                        src={`${getYouTubeEmbedUrl(courseData.video)}?enablejsapi=1`}
                                        title="Course Video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        onEnded={handleVideoEnd}
                                    ></iframe>
                                </div>

                                <button
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center group w-full"
                                    onClick={handleStartQuiz}
                                >
                                    <span>Take Quiz</span>
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Quiz Section */
                        <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden mb-8">
                            {!quizSubmitted ? (
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg">
                                                <FileText className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg font-semibold text-sm">
                                                    Question {currentQuestionIndex + 1}/{courseData.quiz.length}
                                                </div>
                                                <div className="text-blue-600 font-bold text-lg mt-1">
                                                    Knowledge Assessment
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 p-6 rounded-lg mb-6">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                            {courseData.quiz[currentQuestionIndex].question}
                                        </h3>

                                        <div className="space-y-3">
                                            {courseData.quiz[currentQuestionIndex].options.map((option, optionIndex) => (
                                                <div
                                                    key={optionIndex}
                                                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${selectedAnswers[currentQuestionIndex] === optionIndex
                                                        ? 'bg-blue-100 border-blue-300'
                                                        : 'bg-white border-gray-200 hover:border-blue-200'
                                                        }`}
                                                    onClick={() => handleAnswerSelect(currentQuestionIndex, optionIndex)}
                                                >
                                                    <div className="flex items-center">
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${selectedAnswers[currentQuestionIndex] === optionIndex
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-100 text-gray-400'
                                                            }`}>
                                                            {String.fromCharCode(65 + optionIndex)}
                                                        </div>
                                                        <span className="text-gray-700">{option.text}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-between">
                                        <button
                                            className={`px-4 py-2 rounded-lg ${currentQuestionIndex > 0
                                                ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                                }`}
                                            onClick={handlePreviousQuestion}
                                            disabled={currentQuestionIndex === 0}
                                        >
                                            Previous
                                        </button>

                                        {currentQuestionIndex < courseData.quiz.length - 1 ? (
                                            <button
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                                                onClick={handleNextQuestion}
                                            >
                                                Next
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </button>
                                        ) : (
                                            <button
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-lg flex items-center group"
                                                onClick={handleSubmitQuiz}
                                            >
                                                Submit
                                                <CheckSquare className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform duration-300" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* Quiz Results */
                                <div className="p-8">
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mb-4">
                                            <Award className="w-8 h-8 text-white" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                            Quiz Results
                                        </h2>
                                        <p className="text-gray-600">
                                            You have completed the quiz!
                                        </p>
                                    </div>

                                    <div className="bg-blue-50 p-6 rounded-lg mb-8 text-center">
                                        <div className="text-5xl font-bold text-blue-600 mb-2">
                                            {quizScore}/{courseData.quiz.length * 2}
                                        </div>
                                        <p className="text-gray-700">
                                            {quizScore >= courseData.quiz.length ? "Excellent! You've mastered the content." : "Review the lesson to improve your understanding."}
                                        </p>
                                    </div>

                                    <div className="flex justify-center space-x-4">
                                        <button
                                            className="bg-white border border-blue-300 hover:bg-blue-50 text-blue-600 font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center"
                                            onClick={handleRetryQuiz}
                                        >
                                            <RefreshCw className="w-5 h-5 mr-2" />
                                            Retry
                                        </button>

                                        <button
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center group"
                                            onClick={handleReturnToCourses}
                                        >
                                            <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                                            Return to Course List
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Course Information */}
                    <div className="bg-white rounded-xl shadow-lg border border-blue-100">
                        <div className="bg-gradient-to-r from-blue-50 to-white p-8">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mb-4">
                                    <BookOpen className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                                    Course Information
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="text-center p-6 bg-white rounded-lg border border-blue-100 shadow-md">
                                    <Clock className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                                    <h3 className="font-semibold text-blue-700 mb-2 text-lg">Duration</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {courseData.duration} of focused learning
                                    </p>
                                </div>

                                <div className="text-center p-6 bg-white rounded-lg border border-blue-100 shadow-md">
                                    <CheckSquare className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                                    <h3 className="font-semibold text-blue-700 mb-2 text-lg">Assessment</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {courseData.quiz.length} knowledge check questions
                                    </p>
                                </div>

                                <div className="text-center p-6 bg-white rounded-lg border border-blue-100 shadow-md">
                                    <Award className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                                    <h3 className="font-semibold text-blue-700 mb-2 text-lg">Certificate</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Receive a completion certificate after achieving minimum score
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-blue-50">
                            <h3 className="font-semibold text-gray-800 mb-6 text-xl text-center">Important Notes:</h3>
                            <div className="space-y-4">
                                <div className="flex items-start bg-white p-4 rounded-lg border border-blue-100">
                                    <AlertTriangle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <p className="text-gray-700 text-sm">
                                        Watch the entire lesson video before taking the quiz for best results
                                    </p>
                                </div>
                                <div className="flex items-start bg-white p-4 rounded-lg border border-blue-100">
                                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <p className="text-gray-700 text-sm">
                                        You can retake the quiz multiple times to reinforce your knowledge
                                    </p>
                                </div>
                                <div className="flex items-start bg-white p-4 rounded-lg border border-blue-100">
                                    <BookOpen className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                    <p className="text-gray-700 text-sm">
                                        Additional materials can be found in the course resources section
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

export default CourseLearning;