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

// ================================
// 2. UI COMPONENT - MOOC PROGRESS BAR
// ================================

const MoocProgressBar = ({ currentMoocData, completedMoocs, totalMoocs, isTransitioning }) => {
    // Lấy mooc_id hiện tại từ API
    const currentMoocId = currentMoocData?.mooc_id || currentMoocData?.id || 1;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-blue-100 mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-white p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Course Progress</h3>
                    <div className="text-sm text-gray-600">
                        MOOC ID: {currentMoocId} | Progress: {completedMoocs.length}/{totalMoocs}
                    </div>
                </div>

                {/* Progress Bar với MOOC ID */}
                <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                        {Array.from({ length: totalMoocs }, (_, index) => {
                            const moocNumber = index + 1;
                            const isCompleted = completedMoocs.includes(moocNumber);
                            const isCurrent = currentMoocId === moocNumber;

                            return (
                                <div key={index} className="flex items-center">
                                    {/* MOOC Circle */}
                                    <div className={`
                                        relative w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-sm
                                        transition-all duration-500 ease-in-out
                                        ${isCompleted
                                            ? 'bg-green-500 border-green-500 text-white shadow-lg'
                                            : isCurrent
                                                ? `bg-blue-500 border-blue-500 text-white shadow-lg ${isTransitioning ? 'animate-pulse' : ''}`
                                                : 'bg-gray-100 border-gray-300 text-gray-500'
                                        }
                                    `}>
                                        {isCompleted ? (
                                            <CheckCircle className="w-6 h-6" />
                                        ) : (
                                            moocNumber
                                        )}

                                        {/* Transition Animation */}
                                        {isTransitioning && isCurrent && (
                                            <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
                                        )}
                                    </div>

                                    {/* Connection Line */}
                                    {index < totalMoocs - 1 && (
                                        <div className={`
                                            h-1 w-20 mx-2 transition-all duration-700 ease-in-out
                                            ${isCompleted
                                                ? 'bg-green-500'
                                                : 'bg-gray-300'
                                            }
                                        `}></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* MOOC Labels với ID */}
                    <div className="flex justify-between mt-3">
                        {Array.from({ length: totalMoocs }, (_, index) => {
                            const moocNumber = index + 1;
                            const isCompleted = completedMoocs.includes(moocNumber);
                            const isCurrent = currentMoocId === moocNumber;

                            return (
                                <div key={index} className="text-center" style={{ width: '80px' }}>
                                    <div className={`
                                        text-xs font-medium transition-colors duration-300
                                        ${isCompleted
                                            ? 'text-green-600'
                                            : isCurrent
                                                ? 'text-blue-600'
                                                : 'text-gray-500'
                                        }
                                    `}>
                                        MOOC {moocNumber}
                                    </div>
                                    <div className={`
                                        text-xs mt-1 transition-colors duration-300
                                        ${isCompleted
                                            ? 'text-green-500'
                                            : isCurrent
                                                ? 'text-blue-500'
                                                : 'text-gray-400'
                                        }
                                    `}>
                                        {isCompleted
                                            ? 'Completed'
                                            : isCurrent
                                                ? 'In Progress'
                                                : 'Pending'
                                        }
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Current MOOC Info với MOOC ID */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                        <div className="bg-blue-500 text-white p-2 rounded-lg mr-3">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-800">
                                Currently Learning: MOOC ID {currentMoocId}
                                {currentMoocData?.title && ` - ${currentMoocData.title}`}
                            </div>
                            <div className="text-sm text-gray-600">
                                {isTransitioning ? 'Processing completion...' : 'Watch video and complete quiz to advance'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

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
    const [courseVersion, setCourseVersion] = useState(1.0); // Mặc định là 1.0, có thể thay đổi nếu cần
    const videoRef = useRef(null);
    const navigate = useNavigate();
    const [num_moocs, setNumMoocs] = useState(0)
    // ================================
    // 1. LOGIC XỬ LÝ TIẾN TRÌNH MOOC
    // ================================
    const [currentMoocData, setCurrentMoocData] = useState(null);
    const [completedMoocs, setCompletedMoocs] = useState([]);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Fetch course data và current MOOC
    useEffect(() => {
        if (completedMoocs && completedMoocs.length && completedMoocs[completedMoocs.length - 1] == num_moocs) navigate('/course-completed')
        async function fetchCourseData() {
            setLoading(true);
            try {
                console.log(`🔄 Fetching course data for member ${uid}, course ${course_id}`);

                // Call API to get current MOOC that the member is learning
                const response = await fetch(`http://localhost:3000/api/course/continues-learn-course-by-id/${uid}/${course_id}`);
                console.log('📡 API Response:', response);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const parseData = await response.json()
                console.log("Parse Data: ", parseData)
                if (parseData.message && parseData.message == 'You have completed all the content of this course') navigate('/course-completed')
                const data = parseData.data;

                setCourseVersion(parseData.version.toFixed(1)); // Lấy version từ API response
                setNumMoocs(parseData.quantity)
                //console.log('📋 Course Data from API:', data);

                // Cập nhật courseData
                setCourseData(data);

                // ✅ Xử lý MOOC hiện tại từ API response
                if (data && (data.mooc_id || data.id)) {
                    const currentMoocId = data.mooc_id || data.id;
                    console.log(`📚 Current MOOC ID from API: ${currentMoocId}`);
                    const completed = [];
                    for (let i = 1; i < currentMoocId; i++) completed.push(i);
                    setCompletedMoocs(completed)
                    // Set current MOOC data
                    setCurrentMoocData({
                        ...data,
                        mooc_id: currentMoocId
                    });

                    // Log thông tin chi tiết về MOOC hiện tại
                    console.log('📖 Current MOOC Details:', {
                        mooc_id: currentMoocId,
                        title: data.title,
                        description: data.description,
                        video: data.video,
                        quiz_count: data.quiz?.length || 0
                    });

                } else {
                    console.warn('⚠️ No MOOC ID found in API response');
                    // Fallback nếu không có mooc_id
                    setCurrentMoocData(data);
                }

                // Xử lý trường hợp hoàn thành toàn bộ khóa học
                if (data && data.message && data.message.includes('completed all the content')) {
                    console.log('🎉 Course completed!');
                    Swal.fire({
                        icon: 'success',
                        title: 'Course Completed!',
                        text: 'Congratulations! You have completed all the content of this course.',
                        timer: 3000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    }).then(() => {
                        navigate('/course-completed');
                    });
                    return;
                }

            } catch (err) {
                console.error("❌ Error fetching course data:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error Loading Course',
                    text: 'An error occurred while loading course data. Please try again.',
                    confirmButtonColor: '#3085d6',
                });
            } finally {
                setLoading(false);
            }
        }

        if (uid && course_id) {
            fetchCourseData();
        }
    }, [uid, course_id, navigate]);

    // Handle video completion
    const handleVideoEnd = () => {
        console.log('📹 Video completed');
        setVideoCompleted(true);
    };

    // Start quiz
    const handleStartQuiz = () => {
        console.log(`🎯 Starting quiz for MOOC ID: ${currentMoocData?.mooc_id}`);
        setShowQuiz(true);
    };

    // Handle answer selection
    const handleAnswerSelect = (questionIndex, optionIndex) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionIndex]: optionIndex
        });
        console.log(`📝 Answer selected for question ${questionIndex + 1}: option ${optionIndex + 1}`);
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
        if (currentQuestionIndex < (currentMoocData?.quiz || []).length - 1) {
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

            const payload = buildAnswerPayload();
            //console.log("📦 FINAL PAYLOAD TO SERVER:", JSON.stringify(payload, null, 2));
            const response = await fetch('http://localhost:3000/api/course/submit-mooc-course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            console.log('🔄 SERVER RESPONSE:', JSON.stringify(result, null, 2));

            // // Tính tổng điểm
            // const calculateTotalScore = (moocResults) => {
            //     let total = 0;
            //     console.log("📊 CALCULATING SCORE FROM RESPONSE:", response.score);

            //     if (Array.isArray(moocResults)) {
            //         moocResults.forEach((mooc, moocIndex) => {
            //             console.log(`MOOC ${moocIndex + 1} (ID: ${mooc.mooc_id}):`);
            //             console.log(`- Total Score: ${mooc.totalScore}`);

            //             Object.entries(mooc.details).forEach(([questionNum, questionData]) => {
            //                 console.log(`  Question ${questionNum}: ${questionData.answer} (Score: ${questionData.score})`);
            //                 total += questionData.score || 0;
            //             });
            //         });
            //     } else if (moocResults && typeof moocResults === 'object') {
            //         console.log("Single MOOC result:", moocResults);
            //         if (moocResults.details) {
            //             Object.entries(moocResults.details).forEach(([questionNum, questionData]) => {
            //                 console.log(`Question ${questionNum}: ${questionData.answer} (Score: ${questionData.score})`);
            //                 total += questionData.score || 0;
            //             });
            //         }
            //     }

            //     console.log(`🎯 TOTAL CALCULATED SCORE: ${total}`);
            //     return total;
            // };

            // const totalScore = calculateTotalScore(result);
            const totalScore = result.score;
            console.log("Result", result)
            setQuizScore(totalScore);
            console.log("total", totalScore)

            // Kiểm tra kết quả
            if (totalScore < 8) {
                console.log(`❌ FAILED: Score ${totalScore} < 8`);
                Swal.fire({
                    icon: 'error',
                    title: 'Quiz Failed',
                    text: `You scored ${totalScore} points. You need at least 8 to pass. Please try again!`,
                    confirmButtonColor: '#3085d6',
                });
                setQuizSubmitted(true);
                return;
            }

            // Nếu pass - Xử lý tiến trình
            console.log(`✅ PASSED: Score ${totalScore} >= 8 for MOOC ID ${currentMoocData?.mooc_id}`);
            setIsTransitioning(true);

            // Cập nhật MOOC đã hoàn thành
            const currentMoocId = currentMoocData?.mooc_id || currentMoocData?.id;
            const newCompletedMoocs = completedMoocs && completedMoocs.length > 0 ? [...completedMoocs, currentMoocId] : [currentMoocId];
            setCompletedMoocs(newCompletedMoocs);
            console.log(`📈 COMPLETED MOOCs: [${newCompletedMoocs.join(', ')}]`);

            Swal.fire({
                icon: 'success',
                title: 'MOOC Completed!',
                html: `
                    <div class="text-center">
                        <div class="text-2xl font-bold text-blue-600 mb-2">MOOC ID: ${currentMoocId}</div>
                        <div class="text-lg">Score: ${totalScore} points</div>
                        <div class="text-sm text-gray-600 mt-2">Great job! Moving to next MOOC...</div>
                    </div>
                `,
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
            }).then(() => {
                // Reload trang để lấy MOOC tiếp theo từ API
                if (currentMoocId == num_moocs) navigate('/course-completed')
                window.location.reload();
            });

        } catch (error) {
            console.error('❌ QUIZ SUBMISSION ERROR:', error);
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: error.message || 'Unable to connect to the server. Please try again later.',
                confirmButtonColor: '#3085d6',
            });
            setIsTransitioning(false);
        }
    };

    const buildAnswerPayload = () => {
        const answers = {};
        const answerDetails = {};

        const currentQuiz = currentMoocData?.quiz || [];

        Object.keys(selectedAnswers).forEach((questionIndex) => {
            const questionNum = (parseInt(questionIndex) + 1).toString();
            const selectedOptionIndex = selectedAnswers[questionIndex];
            const selectedOption = currentQuiz[questionIndex].options[selectedOptionIndex];
            const answerText = selectedOption.text;

            answers[questionNum] = answerText;

            answerDetails[questionNum] = {
                question: currentQuiz[questionIndex].question,
                selectedAnswer: answerText,
                selectedScore: selectedOption.score || 0,
                isCorrect: (selectedOption.score || 0) > 0,
            };
        });

        const realMoocId = currentMoocData?.mooc_id || currentMoocData?.id || 1;

        const payload = {
            member_id: uid,
            course_id: parseInt(course_id),
            member_answer: {
                mooc_id: realMoocId,
                answers: answers
            },
            version: courseVersion == 1.0 ? 1 : courseVersion,
        };

        // Log chi tiết
        console.log("📋 DETAILED ANSWER BREAKDOWN:");
        console.log("Real MOOC ID from API:", realMoocId);
        console.log("MOOC Title:", currentMoocData?.title);

        return payload;
    };

    // Retry quiz
    const handleRetryQuiz = () => {
        setSelectedAnswers({});
        setCurrentQuestionIndex(0);
        setQuizSubmitted(false);
        setQuizScore(0);
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
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <div className="text-gray-600">Loading course content...</div>
                    </div>
                </div>
            </>
        );
    }

    if (!currentMoocData) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex justify-center items-center">
                    <div className="text-center">
                        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No MOOC Data Found</h2>
                        <p className="text-gray-600">Unable to load MOOC content. Please try again.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                {/* Course Header với MOOC ID */}
                <div className="relative overflow-hidden shadow-lg">
                    <img
                        src="https://i.pinimg.com/736x/e9/14/89/e91489c136aabd067406f1c55bce389b.jpg"
                        alt="Course background"
                        className="w-full h-96 object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="max-w-7xl mx-auto px-4 py-8">
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-6">
                                    <BookOpen className="w-12 h-12 text-white mr-4" />
                                    <div className="w-1 h-12 bg-white/30 mr-4"></div>
                                    <Video className="w-10 h-10 text-blue-300 mr-3" />
                                </div>

                                {/* Hiển thị MOOC ID prominently */}
                                <div className="bg-blue-600/20 backdrop-blur-sm rounded-lg px-6 py-2 mb-4 inline-block">
                                    <div className="text-blue-200 text-lg font-semibold">
                                        MOOC ID: {currentMoocData?.mooc_id || currentMoocData?.id || 'Unknown'}
                                    </div>
                                </div>

                                <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-lg">
                                    {courseData?.course_name || 'Course Title'}
                                    {currentMoocData?.title && (
                                        <div className="text-3xl text-blue-200 mt-2 font-normal">
                                            {currentMoocData.title}
                                        </div>
                                    )}
                                </h1>

                                <p className="text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
                                    {courseData?.description || currentMoocData?.description || 'Course description'}
                                </p>

                                <div className="mt-8 flex items-center justify-center space-x-8 text-white/80">
                                    <div className="flex items-center">
                                        <Clock className="w-6 h-6 mr-2" />
                                        <span className="text-lg">{courseData?.duration || 'Duration not specified'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FileText className="w-6 h-6 mr-2" />
                                        <span className="text-lg">{currentMoocData?.quiz?.length || 0} questions</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Target className="w-6 h-6 mr-2" />
                                        <span className="text-lg">ID: {currentMoocData?.mooc_id || currentMoocData?.id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* MOOC Progress Bar với MOOC ID */}
                    <MoocProgressBar
                        currentMoocData={currentMoocData}
                        completedMoocs={completedMoocs}
                        totalMoocs={courseData?.total_moocs || num_moocs} // Có thể điều chỉnh
                        isTransitioning={isTransitioning}
                    />

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
                                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg font-semibold text-sm mb-1">
                                                MOOC ID: {currentMoocData?.mooc_id || currentMoocData?.id}
                                            </div>
                                            <div className="text-blue-600 font-bold text-lg">
                                                {currentMoocData?.title || 'Lesson Video'}
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
                                        src={`${getYouTubeEmbedUrl(currentMoocData?.video)}?enablejsapi=1`}
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
                                    <span>Take Quiz for MOOC ID {currentMoocData?.mooc_id || currentMoocData?.id}</span>
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
                                                    MOOC {currentMoocData?.mooc_id} - {currentMoocData?.title || `Question ${currentQuestionIndex + 1}`} ({currentQuestionIndex + 1}/{currentMoocData?.quiz?.length || courseData.quiz?.length || 0})
                                                </div>
                                                <div className="text-blue-600 font-bold text-lg mt-1">
                                                    Knowledge Assessment
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 p-6 rounded-lg mb-6">
                                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                            {(currentMoocData?.quiz || courseData.quiz)[currentQuestionIndex].question}
                                        </h3>

                                        <div className="space-y-3">
                                            {(currentMoocData?.quiz || courseData.quiz)[currentQuestionIndex].options.map((option, optionIndex) => (
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

                                        {currentQuestionIndex < (currentMoocData?.quiz || courseData.quiz).length - 1 ? (
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
                                            {quizScore}/{((currentMoocData?.quiz || courseData.quiz).length || 0) * 2}
                                        </div>
                                        <p className="text-gray-700">
                                            {quizScore >= ((currentMoocData?.quiz || courseData.quiz).length || 0) ? "Excellent! You've mastered the content." : "Review the lesson to improve your understanding."}
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
                                        {(currentMoocData?.quiz || courseData.quiz)?.length || 0} knowledge check questions
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