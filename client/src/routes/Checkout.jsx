import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

export default function Checkout() {
    const { cart, cartTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const subtotal = cartTotal;
    const tax = Math.round(subtotal * 0.15);
    const total = subtotal + tax;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Actual Order API call
            const res = await axios.post('http://localhost:3000/api/orders', {
                customer_name: user?.name || "زائر",
                total: total,
                items: cart
            });

            clearCart();
            addToast('تمت عملية الدفع بنجاح!', 'success');
            navigate('/');
        } catch (error) {
            console.error(error);
            addToast('فشل في معالجة الدفع', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4 dark:text-white">السلة فارغة</h2>
                    <button onClick={() => navigate('/')} className="text-primary hover:underline">العودة للتسوق</button>
                </div>
            </div>
        );
    }

    return (
        <div className="py-10 min-h-screen">
            <div className="container mx-auto px-4 max-w-5xl">
                <button onClick={() => navigate('/')} className="mb-4 text-gray-500 hover:text-primary"><i className="fas fa-arrow-right ml-1"></i> العودة للتسوق</button>
                <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">إتمام الطلب والدفع</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div className="bg-white dark:bg-secondary p-6 rounded-lg shadow h-fit border dark:border-gray-700">
                        <h3 className="text-xl font-bold mb-4 dark:text-white border-b pb-2">ملخص الطلب</h3>
                        <div className="space-y-4 mb-4 max-h-80 overflow-y-auto pr-2">
                            {cart.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm dark:text-gray-300 py-2 border-b dark:border-gray-700 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <img src={item.img} className="w-10 h-14 object-cover rounded border border-gray-200" alt="" />
                                        <span>{item.title}</span>
                                    </div>
                                    <span className="font-bold">{item.price} ر.س</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-4 dark:border-gray-600 mt-4">
                            <div className="flex justify-between text-gray-500 mb-2">
                                <span>المجموع الفرعي:</span>
                                <span>{subtotal} ر.س</span>
                            </div>
                            <div className="flex justify-between text-gray-500 mb-2">
                                <span>الضريبة (15%):</span>
                                <span>{tax} ر.س</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl dark:text-white mt-4">
                                <span>الإجمالي الكلي:</span>
                                <span className="text-primary">{total} ر.س</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="bg-white dark:bg-secondary p-6 rounded-lg shadow border dark:border-gray-700">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">
                                <i className="far fa-credit-card text-primary"></i> بيانات الدفع
                            </h3>

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-500">بيانات الشحن</label>
                                <input type="text" placeholder="الاسم الكامل" value={name} onChange={e => setName(e.target.value)} required className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm" />
                                <input type="text" placeholder="العنوان بالتفصيل" required className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm" />
                                <input type="tel" placeholder="رقم الجوال" required className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm" />
                            </div>

                            <hr className="dark:border-gray-600 my-4" />

                            <div className="space-y-3">
                                <label className="text-sm font-bold text-gray-500">بيانات البطاقة</label>
                                <div className="relative">
                                    <i className="fab fa-cc-visa absolute left-3 top-3 text-2xl text-blue-600"></i>
                                    <input type="text" placeholder="رقم البطاقة (محاكاة)" className="w-full p-3 pl-12 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-left font-mono" dir="ltr" maxLength="19" />
                                </div>
                                <div className="flex gap-3">
                                    <input type="text" placeholder="شهر/سنة" className="w-1/2 p-3 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center font-mono" maxLength="5" />
                                    <input type="text" placeholder="رمز التحقق" className="w-1/2 p-3 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center font-mono" maxLength="3" />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-4 rounded font-bold hover:bg-green-700 transition flex justify-center items-center gap-2 shadow-lg mt-6 disabled:opacity-75 disabled:cursor-not-allowed">
                                {loading ? <><i className="fas fa-circle-notch fa-spin"></i> جاري المعالجة...</> : <><i className="fas fa-lock"></i> دفع آمن الآن</>}
                            </button>
                            <p className="text-xs text-gray-400 text-center mt-2"><i className="fas fa-shield-alt"></i> جميع المعاملات مشفرة وآمنة 100%</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
