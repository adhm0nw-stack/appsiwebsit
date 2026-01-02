import React, { createContext, useState, useContext, useEffect } from 'react';
import clsx from 'clsx';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-24 left-4 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={clsx(
                            "pointer-events-auto transform transition-all duration-300 ease-in-out px-6 py-3 rounded-lg shadow-xl text-white font-bold flex items-center gap-3 min-w-[300px] animate-fadeIn",
                            toast.type === 'success' && "bg-green-600",
                            toast.type === 'error' && "bg-red-600",
                            toast.type === 'info' && "bg-blue-600"
                        )}
                        onClick={() => removeToast(toast.id)}
                    >
                        <i className={clsx(
                            "fas text-xl",
                            toast.type === 'success' && "fa-check-circle",
                            toast.type === 'error' && "fa-exclamation-circle",
                            toast.type === 'info' && "fa-info-circle"
                        )}></i>
                        <span>{toast.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
