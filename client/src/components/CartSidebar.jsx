import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export default function CartSidebar() {
    const { cart, removeFromCart, cartTotal, isCartOpen, toggleCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleCheckout = () => {
        if (cart.length === 0) return;
        toggleCart();
        if (user) {
            navigate('/checkout');
        } else {
            navigate('/login');
        }
    };

    return (
        <>
            <div onClick={toggleCart} className={clsx("fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm transition-opacity", isCartOpen ? "opacity-100 block" : "opacity-0 hidden pointer-events-none")}></div>
            <div className={clsx("fixed top-0 z-50 h-full w-96 bg-white dark:bg-secondary transform transition-transform duration-300 shadow-2xl flex flex-col dark:text-white left-0",
                isCartOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-5 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800">
                    <h2 className="font-bold text-xl flex items-center gap-2"><i className="fas fa-shopping-bag text-primary"></i> سلة المشتريات</h2>
                    <button onClick={toggleCart} className="text-gray-400 hover:text-red-500 text-xl transition"><i className="fas fa-times"></i></button>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {cart.length === 0 ? (
                        <div className="text-center text-gray-400 mt-20 flex flex-col items-center">
                            <i className="fas fa-shopping-basket text-6xl mb-4 opacity-20"></i>
                            <p>السلة فارغة</p>
                            <button onClick={toggleCart} className="mt-4 text-primary text-sm hover:underline">ابدأ التسوق</button>
                        </div>
                    ) : (
                        cart.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border dark:border-gray-600 animate-fadeIn">
                                <img src={item.img} className="w-12 h-16 object-cover rounded" alt={item.title} />
                                <div className="flex-1">
                                    <p className="font-bold text-sm dark:text-white line-clamp-1">{item.title}</p>
                                    <p className="text-primary text-sm font-bold">{item.price} ر.س</p>
                                </div>
                                <button onClick={() => removeFromCart(idx)} className="text-gray-400 hover:text-red-500 w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition"><i className="fas fa-trash-alt"></i></button>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-5 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between mb-4 font-bold text-xl">
                        <span>المجموع:</span>
                        <span className="text-primary">{cartTotal} ر.س</span>
                    </div>
                    <button onClick={handleCheckout} className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-opacity-90 transition mb-2 shadow">إتمام الشراء</button>
                    <button onClick={toggleCart} className="w-full text-center text-gray-500 hover:text-gray-700 text-sm mt-2">متابعة التسوق</button>
                </div>
            </div>
        </>
    );
}
