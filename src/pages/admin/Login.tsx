import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-gold-500">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                        <Lock />
                    </div>
                    <h1 className="text-2xl font-heading font-bold text-primary-900">Admin Access</h1>
                    <p className="text-gray-500 text-sm">Sign in to manage content</p>
                </div>
                {error && <p className="text-red-500 text-center mb-4 text-sm bg-red-50 p-2 rounded">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gold-500 outline-none"
                    />
                    <button type="submit" className="w-full bg-primary-900 text-white py-3 rounded-lg font-bold hover:bg-primary-800 transition-all">Sign In</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
