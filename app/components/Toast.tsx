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
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`small fixed right-5 bottom-5 z-50 w-auto rounded-lg px-5 py-4 shadow-md transition-opacity ${
        type === 'success' ? 'bg-radial-gradient' : 'bg-gradient-orange'
      }`}
    >
      {message}
    </div>
  );
};

export default ToastNotification;
