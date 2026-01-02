import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


import { useToast } from '../context/ToastContext';

export default function Admin() {
    const { user, logout } = useContext(AuthContext);
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [messages, setMessages] = useState([]);
    const [stats, setStats] = useState({ revenue: 0, ordersCount: 0, msgCount: 0 });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [ordersRes, msgsRes] = await Promise.all([
                axios.get('http://localhost:3000/api/orders'),
                axios.get('http://localhost:3000/api/messages')
            ]);
            setOrders(ordersRes.data);
            setMessages(msgsRes.data);

            const revenue = ordersRes.data.reduce((sum, order) => sum + (order.status === 'مكتمل' ? order.total : 0), 0);
            setStats({
                revenue,
                ordersCount: ordersRes.data.length,
                msgCount: msgsRes.data.length
            });
        } catch (err) {
            console.error(err);
        }
    };

    const confirmOrder = async (orderId) => {
        try {
            await axios.put(`http://localhost:3000/api/orders/${orderId}`, { status: 'مكتمل' });
            fetchData();
            addToast('تم تأكيد الطلب بنجاح', 'success');
        } catch (err) {
            addToast('فشل في تحديث الطلب', 'error');
        }
    };

    return (
        <div className="py-10 min-h-screen">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8 bg-white dark:bg-secondary p-4 rounded-lg shadow">
                    <h2 className="text-2xl font-bold text-secondary dark:text-white flex items-center gap-2">
                        <i className="fas fa-tachometer-alt text-primary"></i> لوحة تحكم المدير
                    </h2>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 hidden md:inline">مرحباً، {user?.name}</span>
                        <button onClick={logout} className="text-red-500 hover:bg-red-50 p-2 rounded"><i className="fas fa-sign-out-alt"></i></button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white dark:bg-secondary p-6 rounded-lg shadow border-b-4 border-blue-500 flex items-center justify-between">
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold">إجمالي الطلبات</h3>
                            <p className="text-3xl font-bold dark:text-white mt-1">{stats.ordersCount}</p>
                        </div>
                        <i className="fas fa-shopping-bag text-3xl text-blue-100 dark:text-blue-900"></i>
                    </div>
                    <div className="bg-white dark:bg-secondary p-6 rounded-lg shadow border-b-4 border-green-500 flex items-center justify-between">
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold">الإيرادات</h3>
                            <p className="text-3xl font-bold dark:text-white mt-1">{stats.revenue} ر.س</p>
                        </div>
                        <i className="fas fa-coins text-3xl text-green-100 dark:text-green-900"></i>
                    </div>
                    <div className="bg-white dark:bg-secondary p-6 rounded-lg shadow border-b-4 border-yellow-500 flex items-center justify-between">
                        <div>
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-bold">رسائل جديدة</h3>
                            <p className="text-3xl font-bold dark:text-white mt-1">{stats.msgCount}</p>
                        </div>
                        <i className="fas fa-envelope text-3xl text-yellow-100 dark:text-yellow-900"></i>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Orders Table */}
                    <div className="lg:col-span-2 bg-white dark:bg-secondary rounded-lg shadow overflow-hidden">
                        <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <h3 className="font-bold text-lg dark:text-white">أحدث الطلبات الواردة</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-right">
                                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                    <tr>
                                        <th className="p-4">#ID</th>
                                        <th className="p-4">العميل</th>
                                        <th className="p-4">المبلغ</th>
                                        <th className="p-4">الحالة</th>
                                        <th className="p-4">الإجراء</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y dark:divide-gray-700 dark:text-gray-300">
                                    {orders.map(order => (
                                        <tr key={order.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                                            <td className="p-4">#{order.id}</td>
                                            <td className="p-4 font-bold">{order.customer_name}</td>
                                            <td className="p-4 font-bold text-primary">{order.total} ر.س</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'مكتمل' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {order.status !== 'مكتمل' ? (
                                                    <button onClick={() => confirmOrder(order.id)} className="bg-green-100 text-green-600 hover:bg-green-200 px-3 py-1 rounded text-xs transition border border-green-200">تأكيد</button>
                                                ) : <i className="fas fa-check-circle text-green-500"></i>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Messages List */}
                    <div className="bg-white dark:bg-secondary rounded-lg shadow h-fit">
                        <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <h3 className="font-bold text-lg dark:text-white">صندوق الوارد</h3>
                        </div>
                        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                            {messages.length === 0 ? <p className="text-gray-500 text-center">لا توجد رسائل</p> : messages.map(msg => (
                                <div key={msg.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border-r-4 border-primary shadow-sm hover:shadow transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-sm dark:text-white flex items-center gap-2">
                                            <i className="fas fa-user-circle text-gray-400"></i> {msg.name}
                                        </h4>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed bg-white dark:bg-gray-900 p-2 rounded border dark:border-gray-700">{msg.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
