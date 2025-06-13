import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoWeHope from '../../assets/logo-WeHope.png';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Call API to send reset password email
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Reset password email sent successfully! Please check your email.');
                // Navigate to confirmation code page after 2 seconds
                setTimeout(() => {
                    navigate('/confirmation-code', {
                        state: { email: email }
                    });
                }, 2000);
            } else {
                setMessage(data.message || 'Email not found. Please check your email address.');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
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
                        src="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1095.jpg"
                        alt="Forgot password illustration"
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
                            className="mx-auto h-80 w-auto"
                        />
                    </div>

                    {/* Form Title */}
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-red-500 mb-8">Forget Password</h2>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            {/* Email Address */}
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                                required
                            />
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
                            disabled={isLoading || !email}
                            className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </span>
                            ) : (
                                'Send Confirmation Code'
                            )}
                        </button>

                        {/* Test Button - Tạm thời để test */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => navigate('/confirmation-code', {
                                    state: {
                                        email: email || 'test@example.com'
                                    }
                                })}
                                className="text-sm text-blue-500 hover:text-blue-700 underline"
                            >
                                Test Confirmation Code (Skip API)
                            </button>
                        </div>

                        {/* Login Link */}
                        <div className="text-center pt-4">
                            <span className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="text-red-500 hover:text-red-600 font-medium transition-colors duration-200">
                                    Login
                                </Link>
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;