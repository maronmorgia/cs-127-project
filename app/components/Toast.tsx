import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const ToastNotification: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`small fixed bottom-5 left-1/2 z-1000 w-auto -translate-x-1/2 transform rounded-lg px-5 py-4 shadow-md transition-opacity ${
        type === 'success' ? 'bg-radial-gradient' : 'bg-gradient-orange'
      }`}
    >
      {message}
    </div>
  );
};

export default ToastNotification;
