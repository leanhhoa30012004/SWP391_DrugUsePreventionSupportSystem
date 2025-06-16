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
  UserCheck
} from 'lucide-react';
import {useNavigate} from 'react-router-dom'

const SurveySelectionPage = () => {

  // Thông tin chi tiết về từng bài khảo sát
  const [lstSurvey, setLstSurvey]  = useState([])
  const navigate = useNavigate()

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Khảo Sát Sàng Lọc Nguy Cơ Ma Túy
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Chọn bài khảo sát phù hợp để đánh giá mức độ nguy cơ sử dụng chất gây nghiện 
              và nhận được các khuyến nghị can thiệp phù hợp
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Survey Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {lstSurvey.map((survey) => (
                <>
                <button style={{border: "2px #000 solid", cursor: "pointer"}}  onClick = {(e) => { e.preventDefault(); handleSurveySelection(survey.survey_id)}}>
                    {survey.survey_id}
                </button>
                <div>{survey.survey_type}</div>
                </>
                
              )
            )     
            }

                        
                    
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Tại Sao Nên Thực Hiện Khảo Sát?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-green-800 mb-2">Phát Hiện Sớm</h3>
              <p className="text-green-700 text-sm">
                Nhận biết sớm các dấu hiệu nguy cơ để có biện pháp can thiệp kịp thời
              </p>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
              <Target className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-blue-800 mb-2">Định Hướng Rõ Ràng</h3>
              <p className="text-blue-700 text-sm">
                Nhận được các khuyến nghị cụ thể và phù hợp với tình trạng cá nhân
              </p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
              <Heart className="w-10 h-10 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-purple-800 mb-2">Hỗ Trợ Chuyên Nghiệp</h3>
              <p className="text-purple-700 text-sm">
                Được kết nối với các chuyên viên tư vấn và dịch vụ hỗ trợ phù hợp
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Lưu Ý Quan Trọng:</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                Kết quả khảo sát chỉ mang tính chất tham khảo, không thay thế cho chẩn đoán y khoa chuyên nghiệp
              </li>
              <li className="flex items-start">
                <Shield className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                Thông tin cá nhân của bạn được bảo mật tuyệt đối và chỉ sử dụng cho mục đích hỗ trợ
              </li>
              <li className="flex items-start">
                <Users className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                Luôn có đội ngũ chuyên viên sẵn sàng hỗ trợ và tư vấn khi bạn cần
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveySelectionPage;