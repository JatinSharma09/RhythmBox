import React, { createContext, useState, useContext, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MdCheckCircle, MdError, MdInfo, MdClose } from 'react-icons/md';
import { AnimatePresence, motion } from 'framer-motion';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type, duration }]);

        if (duration) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {createPortal(
                <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                    <AnimatePresence>
                        {toasts.map((toast) => (
                            <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                        ))}
                    </AnimatePresence>
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
};

const ToastItem = ({ toast, onClose }) => {
    const icons = {
        success: <MdCheckCircle size={20} className="text-green-500" />,
        error: <MdError size={20} className="text-red-500" />,
        info: <MdInfo size={20} className="text-blue-500" />,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
            layout
            className="pointer-events-auto bg-[#1e1e1e] border border-white/10 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] backdrop-blur-md bg-opacity-90"
        >
            {icons[toast.type] || icons.info}
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <MdClose size={18} />
            </button>
        </motion.div>
    );
};
