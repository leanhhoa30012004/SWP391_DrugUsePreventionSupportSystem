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
  Timer
} from 'lucide-react';
import {useNavigate} from 'react-router-dom'

const SurveySelectionPage = () => {
  // Thông tin chi tiết về từng bài khảo sát
  const [lstSurvey, setLstSurvey] = useState([])
  const [expandedCard, setExpandedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate()

  // Survey details mapping
  const surveyDetails = {
    1: {
      title: "ASSIST - Alcohol, Smoking and Substance Involvement Screening Test",
      description: "A comprehensive screening tool developed by the World Health Organization to detect psychoactive substance use and related problems.",
      duration: "5-10 minutes",
      questions: "8 questions",
      difficulty: "Easy",
      targetGroup: "Adults 18+ years",
      purpose: "Early intervention for substance use",
      features: [
        "WHO-validated screening tool",
        "Covers alcohol, tobacco, and illicit drugs",
        "Risk level classification",
        "Intervention recommendations"
      ],
      riskLevels: ["Low Risk", "Moderate Risk", "High Risk"],
      languages: ["English", "Vietnamese", "Spanish"]
    },
    2: {
      title: "CRAFFT - Substance Abuse Screening Tool for Teens",
      description: "A behavioral health screening tool designed specifically for adolescents to identify high-risk alcohol and drug use behaviors.",
      duration: "3-5 minutes",
      questions: "6 questions",
      difficulty: "Easy",
      targetGroup: "Adolescents 12-21 years",
      purpose: "Youth substance abuse screening",
      features: [
        "Adolescent-specific screening",
        "Brief and easy to complete",
        "Evidence-based assessment",
        "Quick risk identification"
      ],
      riskLevels: ["Low Risk", "High Risk"],
      languages: ["English", "Vietnamese"]
    }
  };

  useEffect(() => {
    // Lấy dữ liệu câu hỏi từ API
    async function fetchSurveyData() {
      fetch("http://localhost:3000/api/survey/viewSurvey", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log("Survey API response:", data);
          // Giả sử dữ liệu trả về là một mảng các câu hỏi
          if (Array.isArray(data) && data.length > 0) {
            setLstSurvey(data);
          } else {
            console.error("Invalid survey data format:", data);
            alert("Không có dữ liệu khảo sát hoặc định dạng không hợp lệ.");
          }
        })
        .catch(err => {
          console.error("Survey API error:", err);
          alert("Có lỗi xảy ra khi tải dữ liệu khảo sát.");
        });
    }
    fetchSurveyData();
  }, []);

  const handleSurveySelection = (id) => {
    navigate(`/survey/${id}`)
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 bg-green-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'Hard':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
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
                Khảo Sát Sàng Lọc Nguy Cơ Ma Túy
              </h1>
              <p className="text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
                Chọn bài khảo sát phù hợp để đánh giá mức độ nguy cơ sử dụng chất gây nghiện 
                và nhận được các khuyến nghị can thiệp phù hợp
              </p>
              
              <div className="mt-8 flex items-center justify-center space-x-8 text-white/80">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <span className="text-lg">Bảo Mật</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-6 h-6 mr-2" />
                  <span className="text-lg">Đánh Giá Nhanh</span>
                </div>
                <div className="flex items-center">
                  <Target className="w-6 h-6 mr-2" />
                  <span className="text-lg">Hỗ Trợ Chuyên Nghiệp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Survey Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {lstSurvey.map((survey) => {
            const details = surveyDetails[survey.survey_id];
            const isExpanded = expandedCard === survey.survey_id;
            const isHovered = hoveredCard === survey.survey_id;
            
            return (
              <div 
                key={survey.survey_id} 
                className={`bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden transition-all duration-300 ${
                  isHovered ? 'shadow-2xl scale-105' : 'hover:shadow-xl'
                }`}
                onMouseEnter={() => setHoveredCard(survey.survey_id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="p-8">
                  {/* Survey Header */}
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
                    
                    <button
                      onClick={() => toggleCardExpansion(survey.survey_id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Info className="w-5 h-5 text-red-500" />
                    </button>
                  </div>

                  {/* Quick Info */}
                  {details && (
                    <div className="mb-6">
                      <h3 className="font-bold text-gray-800 text-lg mb-2">
                        {details.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {details.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full text-sm">
                          <Timer className="w-4 h-4 mr-1 text-gray-500" />
                          {details.duration}
                        </div>
                        <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full text-sm">
                          <FileText className="w-4 h-4 mr-1 text-gray-500" />
                          {details.questions}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(details.difficulty)}`}>
                          {details.difficulty}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Expanded Details */}
                  {isExpanded && details && (
                    <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100">
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Nhóm Đối Tượng</h4>
                          <p className="text-sm text-gray-600">{details.targetGroup}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Mục Đích</h4>
                          <p className="text-sm text-gray-600">{details.purpose}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Tính Năng Chính</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {details.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Mức Độ Nguy Cơ</h4>
                          <div className="flex flex-wrap gap-1">
                            {details.riskLevels.map((level, index) => (
                              <span key={index} className="bg-white px-2 py-1 rounded text-xs border border-red-200">
                                {level}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Ngôn Ngữ</h4>
                          <div className="flex flex-wrap gap-1">
                            {details.languages.map((lang, index) => (
                              <span key={index} className="bg-white px-2 py-1 rounded text-xs border border-red-200">
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button 
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center group"
                      onClick={(e) => { e.preventDefault(); handleSurveySelection(survey.survey_id)}}
                    >
                      <span>Bắt Đầu Khảo Sát</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                    
                    <button
                      onClick={() => toggleCardExpansion(survey.survey_id)}
                      className="px-4 py-4 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 flex items-center justify-center"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-xl shadow-lg border border-red-100">
          <div className="bg-gradient-to-r from-red-50 to-white p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-xl mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Tại Sao Nên Thực Hiện Khảo Sát?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white rounded-lg border border-red-100 shadow-md">
                <CheckCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-semibold text-red-700 mb-2 text-lg">Phát Hiện Sớm</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Nhận biết sớm các dấu hiệu nguy cơ để có biện pháp can thiệp kịp thời
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg border border-red-100 shadow-md">
                <Target className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-semibold text-red-700 mb-2 text-lg">Định Hướng Rõ Ràng</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Nhận được các khuyến nghị cụ thể và phù hợp với tình trạng cá nhân
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg border border-red-100 shadow-md">
                <Users className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-semibold text-red-700 mb-2 text-lg">Hỗ Trợ Chuyên Nghiệp</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Được kết nối với các chuyên viên tư vấn và dịch vụ hỗ trợ phù hợp
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-red-50">
            <h3 className="font-semibold text-gray-800 mb-6 text-xl text-center">Lưu Ý Quan Trọng:</h3>
            <div className="space-y-4">
              <div className="flex items-start bg-white p-4 rounded-lg border border-red-100">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 text-sm">
                  Kết quả khảo sát chỉ mang tính chất tham khảo, không thay thế cho chẩn đoán y khoa chuyên nghiệp
                </p>
              </div>
              <div className="flex items-start bg-white p-4 rounded-lg border border-red-100">
                <Shield className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 text-sm">
                  Thông tin cá nhân của bạn được bảo mật tuyệt đối và chỉ sử dụng cho mục đích hỗ trợ
                </p>
              </div>
              <div className="flex items-start bg-white p-4 rounded-lg border border-red-100">
                <Users className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 text-sm">
                  Luôn có đội ngũ chuyên viên sẵn sàng hỗ trợ và tư vấn khi bạn cần
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveySelectionPage;