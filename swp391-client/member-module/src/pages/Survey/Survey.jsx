import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Calendar, User, FileText } from 'lucide-react';
import {useParams} from 'react-router-dom'
const Survey = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [title, setTitle] = useState("");
  const { sid } = useParams(); // Lấy sid từ URL
    const [questions, setQues] = useState([]);
  useEffect(() => {
    
    // Lấy dữ liệu câu hỏi từ API
    async function fetchSurveyData() {
      fetch(`http://localhost:3000/api/survey/surveyById/${sid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log("Survey API response:", data);
          // Giả sử dữ liệu trả về là một mảng các câu hỏi
            setQues(typeof data.content === 'string' ? JSON.parse(data.content) : data.content);
            setTitle(data?.survey_type || "ASSIST")
        })
        .catch(err => {
          console.error("Survey API error:", err);
          alert("Có lỗi xảy ra khi tải dữ liệu khảo sát.");
        }
      );
    }
    fetchSurveyData();
  }, []);

  // Câu hỏi khảo sát ASSIST


  // useEffect(() => {
  //   fetch("http://localhost:3000/api/survey/viewSurvey")
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log("Survey API response:", data);
  //       setQues(data.content || []);
  //     })
  //     .catch(err => {
  //       console.error("Survey API error:", err);
  //     });
  // }, []);




  const handleAnswer = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);

    } else {
      calculateScore()
    //   const surveyData = {
    //     survey_id: 1, // ID của khảo sát ASSIST
    //     member_id: 1, // ID của người dùng hiện tại
    //     score: totalScore,
    //     date: new Date(),
    //     answers: JSON.stringify(answers)
    //   };
    //   try {
    //     const response = await fetch('http://localhost:3000/api/survey/submitSurvey',{
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify(surveyData)
    //     });
    //     if (response.ok) {
    //       alert('Kết quả khảo sát đã được lưu thành công!');
    //     } else {
    //       const err = await response.json();
    //       alert('Có lỗi xảy ra khi lưu kết quả khảo sát: ' + (err.message || 'Unknown error'));
    //     }
    //   } catch (error) {
    //     console.error('Error submitting survey:', error);
    //     alert('Có lỗi xảy ra khi lưu kết quả khảo sát.');
    //   }
     }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    
    // Tính điểm cho các câu hỏi (bỏ qua câu 1 vì không có điểm)
    for (let i = 1; i < questions.length; i++) {
      const answer = answers[i];
      if (answer && typeof answer === 'object' && answer.score !== undefined) {
        score += answer.score;
      }
    }
    
    setTotalScore(score);
    setShowResult(true);
  };

  const getRiskLevel = (score) => {
    if (score >= 0 && score <= 3) {
      return {
        level: "Thấp",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: <CheckCircle className="w-6 h-6 text-green-600" />,
        description: "Giáo dục và phòng ngừa",
        recommendation: "Tham gia các khóa học giáo dục về tác hại của ma túy và cách phòng tránh."
      };
    } else if (score >= 4 && score <= 26) {
      return {
        level: "Trung bình",
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
        description: "Tư vấn ngắn và can thiệp sớm",
        recommendation: "Được khuyến nghị tham gia tư vấn cá nhân với chuyên viên để được hỗ trợ và hướng dẫn cụ thể."
      };
    } else {
      return {
        level: "Cao",
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: <XCircle className="w-6 h-6 text-red-600" />,
        description: "Đánh giá chuyên sâu, giới thiệu điều trị nghiện chuyên biệt",
        recommendation: "Cần được đánh giá và điều trị chuyên sâu bởi các chuyên gia về nghiện chất. Khuyến nghị liên hệ ngay với các cơ sở y tế chuyên khoa."
      };
    }
  };

  const handleSubmitSurvey = async () => {
    // Lấy member_id từ localStorage nếu có
    let member_id = 1;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.id) member_id = user.id;
    } catch (e) {
      // Không làm gì nếu lỗi parse user
    }
    console.log('API Called')
    const surveyData = {
      survey_id: 3, // ID của khảo sát ASSIST
      member_id: member_id, // ID của người dùng hiện tại
      score: totalScore,
      date: new Date(),
      answers: answers
    };
    try {
      const response = await fetch('http://localhost:3000/api/survey/submitSurvey',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData)
      });
      if (response.ok) {
        alert('Kết quả khảo sát đã được lưu thành công!');
      } else {
        const err = await response.json();
        alert('Có lỗi xảy ra khi lưu kết quả khảo sát: ' + (err.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Có lỗi xảy ra khi lưu kết quả khảo sát.');
    }
  };
  // useEffect(() => {
  //     window.location.reload();
  // }, [questions]);
  const currentQuestionData = questions[currentQuestion];
  const riskLevel = getRiskLevel(totalScore);

  useEffect(() => {
    fetch("http://localhost:3000/api/survey/viewSurvey") // Đổi port/path nếu cần
      .then(res => res.json())
      .then(data => {
        console.log("Survey API response:", data);
      })
      .catch(err => {
        console.error("Survey API error:", err);
      });
  }, []);

  if (showResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Kết Quả Khảo Sát {title}</h1>
              <p className="text-gray-600">Đánh giá mức độ nguy cơ sử dụng chất gây nghiện</p>
            </div>

            <div className={`${riskLevel.bgColor} ${riskLevel.borderColor} border-2 rounded-lg p-8 mb-8`}>
              <div className="flex items-center justify-center mb-6">
                {riskLevel.icon}
                <h2 className={`text-2xl font-bold ml-3 ${riskLevel.color}`}>
                  Mức độ nguy cơ: {riskLevel.level}
                </h2>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-800 mb-2">{totalScore} điểm</div>
                <p className="text-lg text-gray-600">{riskLevel.description}</p>
              </div>

              <div className="bg-white rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Đề xuất hành động:</h3>
                <p className="text-gray-700">{riskLevel.recommendation}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-green-800 mb-2">Mức độ Thấp</h3>
                <p className="text-sm text-green-700">0 - 3 điểm</p>
                <p className="text-xs text-green-600 mt-2">Giáo dục và phòng ngừa</p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                <h3 className="font-semibold text-yellow-800 mb-2">Mức độ Trung bình</h3>
                <p className="text-sm text-yellow-700">4 - 26 điểm</p>
                <p className="text-xs text-yellow-600 mt-2">Tư vấn ngắn và can thiệp sớm</p>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <XCircle className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <h3 className="font-semibold text-red-800 mb-2">Mức độ Cao</h3>
                <p className="text-sm text-red-700">≥ 27 điểm</p>
                <p className="text-xs text-red-600 mt-2">Đánh giá chuyên sâu, điều trị nghiện</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleSubmitSurvey()}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 flex items-center justify-center"
              >
                <FileText className="w-5 h-5 mr-2" />
                Lưu Kết Quả
              </button>
              
              <button
                onClick={() => {
                  setCurrentQuestion(0);
                  setAnswers({});
                  setShowResult(false);
                  setTotalScore(0);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
              >
                Làm Lại Khảo Sát
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return currentQuestionData ? (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-800">Khảo Sát {title}</h1>
              <div className="text-sm text-gray-500">
                Câu {currentQuestion + 1} / {questions.length}
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {currentQuestionData.question}
            </h2>

            <div className="space-y-3">
              {currentQuestionData.type === "multiple_choice" ? (
                currentQuestionData.options.map((option, index) => (
                  <label key={index} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                      checked={Array.isArray(answers[currentQuestion]) && answers[currentQuestion].includes(option)}
                      onChange={(e) => {
                        const currentAnswers = Array.isArray(answers[currentQuestion]) ? answers[currentQuestion] : [];
                        if (e.target.checked) {
                          handleAnswer([...currentAnswers, option]);
                        } else {
                          handleAnswer(currentAnswers.filter(item => item !== option));
                        }
                      }}
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))
              ) : (
                currentQuestionData.options.map((option, index) => (
                  <label key={index} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${currentQuestion}`}
                      className="w-4 h-4 text-red-600 focus:ring-red-500"
                      checked={answers[currentQuestion]?.text === option.text}
                      onChange={() => handleAnswer(option)}
                    />
                    <span className="ml-3 text-gray-700">{option.text}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Trước
            </button>

            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion] || (Array.isArray(answers[currentQuestion]) && answers[currentQuestion].length === 0)}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              {currentQuestion === questions.length - 1 ? 'Hoàn Thành' : 'Tiếp'}
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông Tin Về Khảo Sát ASSIST</h3>
          <div className="text-gray-600 space-y-2">
            <p>• <strong>ASSIST</strong> (Alcohol, Smoking and Substance Involvement Screening Test) là công cụ sàng lọc được WHO phát triển</p>
            <p>• Đánh giá mức độ nguy cơ sử dụng các chất gây nghiện</p>
            <p>• Kết quả giúp đưa ra các khuyến nghị can thiệp phù hợp</p>
            <p>• Thời gian hoàn thành: 5-10 phút</p>
          </div>
        </div>
      </div>
    </div>
  ):<div>404 Not Found</div>;
};

export default Survey;