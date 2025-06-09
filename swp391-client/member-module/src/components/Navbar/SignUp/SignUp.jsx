import React from 'react';
import logo from '../../assets/logo-WeHope.png';
import signupImg from '../../assets/logo_signup.svg';

const SignUp = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="flex w-full max-w-5xl shadow-lg rounded-lg overflow-hidden">
                {/* Left Side - Image */}
                <div className="w-1/2 bg-gray-100 flex items-center justify-center p-8">
                    <img src={signupImg} alt="Sign up visual" className="object-cover rounded-lg max-h-[500px]" />
                </div>
                {/* Right Side - Form */}
                <div className="w-1/2 p-10 flex flex-col justify-center">
                    <img src={logo} alt="WeHope Logo" className="w-40 mb-4 mx-auto" />
                    <h2 className="text-xl font-semibold text-center mb-2">Create Account</h2>
                    <form className="space-y-3">
                        <div className="flex gap-2">
                            <input type="text" placeholder="First Name" className="border rounded px-3 py-2 w-1/2" />
                            <input type="text" placeholder="Last Name" className="border rounded px-3 py-2 w-1/2" />
                        </div>
                        <div className="flex gap-2">
                            <input type="email" placeholder="Email Address" className="border rounded px-3 py-2 w-1/2" />
                            <input type="text" placeholder="Phone Number" className="border rounded px-3 py-2 w-1/2" />
                        </div>
                        <div className="flex gap-2">
                            <input type="password" placeholder="Password" className="border rounded px-3 py-2 w-1/2" />
                            <input type="password" placeholder="Confirm Password" className="border rounded px-3 py-2 w-1/2" />
                        </div>
                        <button type="submit" className="w-full bg-red-500 text-white py-2 rounded font-semibold mt-2">Create Account</button>
                        <p className="text-xs text-center mt-2">Already have an account? <a href="#" className="text-blue-500">Log in</a></p>
                    </form>
                    <div className="flex items-center my-4">
                        <div className="flex-grow h-px bg-gray-300" />
                        <span className="mx-2 text-gray-400 text-sm">OR</span>
                        <div className="flex-grow h-px bg-gray-300" />
                    </div>
                    <div className="flex gap-4 justify-center">
                        <button className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-100">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            <span className="text-sm">Sign up with Google</span>
                        </button>
                        <button className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-100">
                            <img src="https://img.icons8.com/color/48/000000/gmail.png" alt="Gmail" className="w-5 h-5" />
                            <span className="text-sm">Sign up with Email</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp; 