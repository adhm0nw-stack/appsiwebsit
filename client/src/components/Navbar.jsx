import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import clsx from 'clsx';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const { cart, toggleCart } = useContext(CartContext);

    // Check initial preference
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    const toggleTheme = () => {
        if (darkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setDarkMode(true);
        }
    };

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <nav className="bg-white dark:bg-secondary shadow-md sticky top-0 z-50 transition-colors duration-300">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-2xl md:text-3xl font-serif font-bold text-secondary dark:text-white flex items-center gap-2">
                        <i className="fas fa-book-open text-primary"></i>
                        مكتبتي
                    </Link>

                    <div className="hidden md:flex items-center gap-6 font-semibold text-sm md:text-base">
                        <Link to="/" className="hover:text-primary transition dark:text-gray-300">الرئيسية</Link>
                        <a href="/#categories" className="hover:text-primary transition dark:text-gray-300">الكل</a>
                        {user && user.role === 'admin' && (
                            <Link to="/admin" className="text-red-500 hover:text-red-600 transition font-bold">
                                <i className="fas fa-user-shield"></i> الإدارة
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-4">


                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                            <i className={clsx("fas text-xl text-gray-600 dark:text-yellow-400", darkMode ? "fa-sun" : "fa-moon")}></i>
                        </button>

                        <button className="relative hover:text-primary transition" onClick={toggleCart}>
                            <i className="fas fa-shopping-cart text-xl dark:text-white"></i>
                            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cart.length}</span>
                        </button>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} className="w-8 h-8 rounded-full" alt="avatar" />
                                    <span className="hidden md:inline font-bold text-sm dark:text-white">{user.name}</span>
                                </div>
                                <button onClick={logout} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded transition" title="تسجيل الخروج">
                                    <i className="fas fa-sign-out-alt transform rotate-180"></i>
                                </button>
                            </div>
                        ) : (
                            <div id="auth-buttons">
                                <Link to="/login" className="bg-secondary dark:bg-primary text-white px-4 py-1.5 rounded-full text-sm hover:opacity-90 transition">دخول</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
