import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from './ToastContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:3000/api/login', { email, password });
            if (res.data.success) {
                setUser(res.data.user);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                addToast(`مرحباً بك، ${res.data.user.name}`, 'success');
                return { success: true };
            }
        } catch (error) {
            addToast(error.response?.data?.message || 'فشل تسجيل الدخول', 'error');
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const signup = async (name, email, password) => {
        try {
            const res = await axios.post('http://localhost:3000/api/signup', { name, email, password });
            if (res.data.success) {
                setUser(res.data.user);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                addToast('تم إنشاء الحساب بنجاح', 'success');
                return { success: true };
            }
        } catch (error) {
            addToast('فشل إنشاء الحساب', 'error');
            return { success: false, message: error.response?.data?.message || 'Signup failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        addToast('تم تسجيل الخروج', 'info');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
