import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logoWeHope from '../../assets/logo-WeHope.png';
import { authService } from '../../services/authService';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const { token } = useParams(); // Lấy token từ URL params

    useEffect(() => {
        if (!token) {
            setMessage('Invalid reset link. Please request a new password reset.');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            setMessage('Invalid reset link. Please request a new password reset.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setMessage('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            // Gọi API thông qua authService với token từ URL
            await authService.resetPassword(token, newPassword);
            setMessage('Password reset successfully! Redirecting to login...');

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            setMessage(error.message || 'Failed to reset password. The link may be expired.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left side - Image */}
            <div className="hidden lg:flex lg:w-1/2 relative p-8">
                <div className="w-full h-full bg-white rounded-3xl shadow-lg flex items-center justify-center overflow-hidden">
                    <img
                        src="https://media.istockphoto.com/id/1500914761/vector/fitness-health-gym-trendy-icons-on-circles.jpg?s=612x612&w=0&k=20&c=MaSBJ-edgZ2Nm7utjZgYupCWAzhrcIek0Udz48L_JME="
                        alt="Reset password illustration"
                        className="w-3/4 h-3/4 object-contain"
                    />
                </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
                <div className="max-w-md w-full space-y-8">
                    {/* Logo */}
                    <div className="text-center">
                        <img
                            src={logoWeHope}
                            alt="WeHope Logo"
                            className="mx-auto h-70 w-auto"
                        />
                    </div>

                    {/* Form Title */}
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-red-500 mb-4">Reset Password</h2>
                        <p className="text-sm text-gray-600">
                            Enter your new password below
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            {/* New Password */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                                    required
                                    minLength="6"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Confirm Password */}
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                                    required
                                    minLength="6"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="text-xs text-gray-500">
                            <p>Password must be at least 6 characters long</p>
                        </div>

                        {/* Message */}
                        {message && (
                            <div className={`text-center text-sm p-3 rounded-lg ${message.includes('successfully')
                                ? 'text-green-700 bg-green-50 border border-green-200'
                                : 'text-red-700 bg-red-50 border border-red-200'
                                }`}>
                                {message}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !newPassword || !confirmPassword || !token}
                            className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </span>
                            ) : (
                                'Update Password'
                            )}
                        </button>

                        {/* Back to Login */}
                        <div className="text-center pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-sm text-gray-600 hover:text-red-500 transition-colors duration-200"
                            >
                                ← Back to Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;