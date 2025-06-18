import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import logoWeHope from '../../assets/logo-WeHope.png';

const ConfirmationCode = () => {
    const [confirmationCode, setConfirmationCode] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
    const navigate = useNavigate();
    const location = useLocation();
    const userEmail = location.state?.email || '';

    // Countdown timer
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/verify-confirmation-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userEmail,
                    confirmationCode
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Code verified successfully! Redirecting to reset password...');
                setTimeout(() => {
                    navigate('/reset-password', {
                        state: {
                            email: userEmail,
                            token: data.resetToken
                        }
                    });
                }, 2000);
            } else {
                setMessage(data.message || 'Invalid confirmation code. Please try again.');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/resend-confirmation-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail }),
            });

            if (response.ok) {
                setMessage('New confirmation code sent to your email!');
                setTimeLeft(300); // Reset timer
                setConfirmationCode(''); // Clear input
            } else {
                setMessage('Failed to resend code. Please try again.');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 bg-white rounded-lg shadow-lg p-8">
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
                    <h2 className="text-2xl font-semibold text-red-500 mb-4">
                        Enter The Confirmation Code
                    </h2>
                    <p className="text-sm text-gray-600">
                        We've sent a 6-digit confirmation code to:
                    </p>
                    <p className="text-sm font-medium text-gray-800 mt-1">
                        {userEmail}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            placeholder="Confirmation Code"
                            value={confirmationCode}
                            onChange={(e) => {
                                // Only allow numbers and limit to 6 digits
                                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setConfirmationCode(value);
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 text-center text-lg tracking-[0.5em] font-mono"
                            required
                            maxLength="6"
                            autoComplete="off"
                        />
                    </div>

                    {/* Timer */}
                    {timeLeft > 0 && (
                        <div className="text-center text-sm text-gray-600">
                            Code expires in:
                            <span className="font-medium text-red-500 ml-1">
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    )}

                    {/* Expired Code Message */}
                    {timeLeft === 0 && (
                        <div className="text-center text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                            Confirmation code has expired. Please request a new one.
                        </div>
                    )}

                    {/* Message */}
                    {message && (
                        <div className={`text-center text-sm p-3 rounded-lg ${message.includes('successfully') || message.includes('sent')
                            ? 'text-green-700 bg-green-50 border border-green-200'
                            : 'text-red-700 bg-red-50 border border-red-200'
                            }`}>
                            {message}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading || !confirmationCode || confirmationCode.length !== 6 || timeLeft === 0}
                        className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Verifying...
                            </span>
                        ) : (
                            'RECOVER ACCOUNT'
                        )}
                    </button>

                    {/* Resend Code */}
                    <div className="text-center pt-4">
                        <span className="text-sm text-gray-600">
                            Didn't receive Confirmation Code?{' '}
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={timeLeft > 240 || isLoading} // Allow resend after 1 minute
                                className="text-red-500 hover:text-red-600 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed underline"
                            >
                                Resend Now
                            </button>
                        </span>
                    </div>

                    {/* Test Button - Remove in production */}
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => navigate('/reset-password', {
                                state: {
                                    email: userEmail || 'test@example.com',
                                    token: 'test-token'
                                }
                            })}
                            className="text-sm text-blue-500 hover:text-blue-700 underline"
                        >
                            Test Reset Password (Skip Code)
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConfirmationCode;