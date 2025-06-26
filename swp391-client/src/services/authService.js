const API_BASE_URL = 'http://localhost:3000/api';

export const authService = {
    forgotPassword: async (email) => {
        console.log('🚀 Calling API:', `${API_BASE_URL}/auth/forgot-password`); // DEBUG
        console.log('📧 Email:', email); // DEBUG

        try {
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            console.log('✅ Response status:', response.status); // DEBUG
            console.log('✅ Response ok:', response.ok); // DEBUG

            const data = await response.json();
            console.log('📄 Response data:', data); // DEBUG

            if (!response.ok) {
                throw new Error(data.message || 'Email not found');
            }

            return data;
        } catch (error) {
            console.error('❌ API Error:', error); // DEBUG
            throw error;
        }
    },

    resetPassword: async (token, newPassword) => {
        console.log('🚀 Calling reset API:', `${API_BASE_URL}/auth/reset-password/${token}`); // DEBUG

        try {
            const response = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword }),
            });

            console.log('✅ Reset response status:', response.status); // DEBUG

            const data = await response.json();
            console.log('📄 Reset response data:', data); // DEBUG

            if (!response.ok) {
                throw new Error(data.message || 'Token invalid or expired');
            }

            return data;
        } catch (error) {
            console.error('❌ Reset API Error:', error); // DEBUG
            throw error;
        }
    }
};