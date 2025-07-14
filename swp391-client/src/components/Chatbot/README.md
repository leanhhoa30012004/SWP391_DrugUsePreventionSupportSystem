# WeHope AI Chatbot

## 🚀 Tính năng mới

Chatbot đã được nâng cấp từ fake responses sang **AI thực thụ** sử dụng Hugging Face Inference API.

## 🤖 AI Implementation

### **Model được sử dụng:**
- **Hugging Face Model**: `facebook/blenderbot-400M-distill`
- **Miễn phí**: Không cần API key
- **Chất lượng**: Tốt cho conversation

### **Tính năng AI:**
- ✅ **Real-time AI responses** - Trả lời thông minh thực thụ
- ✅ **Context awareness** - Hiểu context cuộc hội thoại
- ✅ **Multilingual support** - Hỗ trợ tiếng Anh và tiếng Việt
- ✅ **Drug prevention focus** - Chuyên về phòng chống ma túy
- ✅ **Fallback system** - Tự động chuyển sang responses dự phòng nếu AI lỗi

## 🔧 Cách hoạt động

### **1. AI Processing:**
```javascript
// Gọi Hugging Face API
const response = await fetch('https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    inputs: fullPrompt,
    parameters: {
      max_length: 100,
      temperature: 0.8,
      do_sample: true,
      top_p: 0.9,
      repetition_penalty: 1.1
    }
  })
});
```

### **2. Context Building:**
- Lưu trữ 3 tin nhắn gần nhất để tạo context
- System prompt chuyên về drug prevention
- Hỗ trợ đa ngôn ngữ

### **3. Response Processing:**
- Làm sạch response từ AI
- Loại bỏ ký tự đặc biệt
- Fallback nếu AI không hoạt động

## 🛡️ Error Handling

### **Fallback System:**
1. **AI Error**: Nếu Hugging Face API lỗi
2. **Invalid Response**: Nếu AI trả về response không hợp lệ
3. **Network Error**: Nếu không kết nối được

### **Fallback Responses:**
- Sử dụng predefined responses về drug prevention
- Phân loại theo chủ đề: greetings, drug_info, support, prevention
- Hỗ trợ cả tiếng Anh và tiếng Việt

## 🎯 Drug Prevention Focus

### **System Prompts:**
```javascript
// English
"You are WeHope AI Assistant, a helpful AI specializing in drug prevention education and support..."

// Vietnamese  
"Bạn là WeHope AI Assistant, một trợ lý AI chuyên về giáo dục phòng chống ma túy..."
```

### **Topics Covered:**
- Drug education and awareness
- Prevention strategies
- Support and resources
- Health and wellness
- Recovery information

## 🔄 Language Support

### **Automatic Language Detection:**
- Dựa trên `language` state
- System prompt thay đổi theo ngôn ngữ
- Responses phù hợp với ngôn ngữ

### **Language Toggle:**
- Nút chuyển đổi EN/VI
- Clear messages khi đổi ngôn ngữ
- Context được reset

## 📱 UI/UX Features

### **Real-time Indicators:**
- Typing indicator khi AI đang xử lý
- Loading states
- Error messages thân thiện

### **Responsive Design:**
- Hoạt động trên mọi device
- Smooth animations
- Accessible design

## 🚀 Performance

### **Optimizations:**
- Conversation history giới hạn (3 messages)
- Response length giới hạn (100 words)
- Efficient error handling
- Minimal API calls

### **Caching:**
- Fallback responses được cache
- Không cần gọi API cho responses dự phòng

## 🔧 Maintenance

### **Monitoring:**
- Console logs cho AI errors
- Error tracking
- Performance monitoring

### **Updates:**
- Dễ dàng thay đổi AI model
- Có thể thêm API keys nếu cần
- Flexible system prompts

## 🎉 Benefits

1. **Real AI**: Không còn fake responses
2. **Free**: Sử dụng Hugging Face miễn phí
3. **Reliable**: Fallback system đảm bảo luôn hoạt động
4. **Focused**: Chuyên về drug prevention
5. **Multilingual**: Hỗ trợ đa ngôn ngữ
6. **Context-aware**: Hiểu cuộc hội thoại

---

**Note**: Chatbot này sử dụng Hugging Face Inference API miễn phí. Nếu cần performance cao hơn, có thể upgrade lên paid plans hoặc sử dụng OpenAI API. 