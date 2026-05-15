import { register } from '@/api/auth';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterUser() {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await register({ first_name, last_name, email, password });
            if (response.success) {
                setSuccess('Account created! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="w-full max-w-lg p-8 bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 backdrop-blur-md bg-opacity-50">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 mb-2">Create Account</h1>
                    <p className="text-gray-400">Join our community and start comparing</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    {error && (
                        <div className="p-4 mb-4 text-sm text-red-100 bg-red-900 bg-opacity-20 border border-red-500 rounded-xl">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-4 mb-4 text-sm text-green-100 bg-green-900 bg-opacity-20 border border-green-500 rounded-xl">
                            {success}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="group relative">
                            <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">First Name</label>
                            <input
                                type="text"
                                value={first_name}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-white placeholder-gray-600"
                                placeholder="Your Name"
                                required
                            />
                        </div>
                        <div className="group relative">
                            <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Last Name</label>
                            <input
                                type="text"
                                value={last_name}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-white placeholder-gray-600"
                                placeholder="Your Last Name"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1">
                        <div className="group relative">
                            <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white placeholder-gray-600"
                                placeholder="name@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="group relative">
                        <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white placeholder-gray-600"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="group relative">
                        <label className="block text-sm font-medium text-gray-400 mb-2 ml-1">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white placeholder-gray-600"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white font-bold rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none mt-4"
                    >
                        Register
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-400">
                    <p>Already have an account? <Link to="/login" className="text-green-400 hover:text-green-300 font-medium transition-colors">Login Here</Link></p>
                </div>
            </div>
        </div>
    );
};
