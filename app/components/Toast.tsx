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
      className={`text-center small fixed bottom-7 left-1/2 z-1000 w-auto -translate-x-1/2 transform rounded-lg px-4 py-4 shadow-md transition-opacity ${
        type === 'success' ? 'bg-radial-gradient' : 'bg-gradient-orange'
      }`}
    >
      {message}
    </div>
  );
};

export default ToastNotification;