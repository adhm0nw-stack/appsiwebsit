import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-dark-bg p-4">
            <div className="bg-white dark:bg-secondary p-8 rounded-xl shadow-2xl w-full max-w-md border-t-4 border-primary">
                <div className="text-center mb-6">
                    <i className="fas fa-book-reader text-5xl text-primary mb-2"></i>
                    <h2 className="text-2xl font-bold dark:text-white">تسجيل الدخول</h2>
                </div>
                {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className={`block text-sm font-bold mb-2 dark:text-gray-300 text-right`}>البريد الإلكتروني</label>
                        <div className="relative">
                            <i className={`fas fa-envelope absolute left-3 top-3.5 text-gray-400`}></i>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={`w-full p-3 pl-10 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-primary outline-none`} placeholder="admin@bookstore.com" required />
                        </div>
                    </div>
                    <div>
                        <label className={`block text-sm font-bold mb-2 dark:text-gray-300 text-right`}>كلمة المرور</label>
                        <div className="relative">
                            <i className={`fas fa-lock absolute left-3 top-3.5 text-gray-400`}></i>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={`w-full p-3 pl-10 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-primary outline-none`} required />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-opacity-90 transition shadow-lg">دخول</button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-gray-500">ليس لديك حساب؟ <Link to="/signup" className="text-primary font-bold hover:underline">إنشاء حساب جديد</Link></p>
                </div>
                <div className="mt-4 text-center text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">
                    <p className="text-gray-500 font-bold mb-1">بيانات تجريبية:</p>
                    <p className="text-gray-500">المدير: admin@bookstore.com / admin</p>
                </div>
            </div>
        </div>
    );
}
