import { login } from '@/api/auth';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user && JSON.parse(user).token) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login({ email, password });
            navigate('/');
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 backdrop-blur-md bg-opacity-50">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Please enter your credentials to login</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="p-4 mb-4 text-sm text-red-400 bg-red-900 bg-opacity-20 border border-red-500 rounded-xl">
                            {error}
                        </div>
                    )}

                    <div className="group relative">
                        <label className="block text-sm font-medium text-gray-400 mb-2 ml-1 transition-all group-focus-within:text-blue-400">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-900 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-600"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div className="group relative">
                        <label className="block text-sm font-medium text-gray-400 mb-2 ml-1 transition-all group-focus-within:text-purple-400">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-900 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-600"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 mt-4"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-400">
                    <p>Don't have an account? <Link to="/register-user" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Create Account</Link></p>
                </div>
            </div>
        </div>
    );
};
