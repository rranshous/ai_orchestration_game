import React, { useEffect } from 'react';
import { Notification } from '../../types/notifications';

interface ToastProps {
  notification: Notification;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({
  notification,
  onClose,
}) => {
  useEffect(() => {
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  // Color based on notification type
  let bgColor = "bg-blue-700";
  let icon = "ℹ️";
  
  switch (notification.type) {
    case "success":
      bgColor = "bg-green-700";
      icon = "✓";
      break;
    case "error":
      bgColor = "bg-red-700";
      icon = "✗";
      break;
    case "info":
    default:
      bgColor = "bg-blue-700";
      icon = "ℹ";
  }
  
  return (
    <div 
      className={`
        toast p-3 rounded-md shadow-lg 
        ${bgColor} max-w-md z-50 
        animate-fade-in-up
      `}
    >
      <div className="flex items-center">
        <div className="mr-2 text-lg">{icon}</div>
        <div className="flex-grow text-sm">{notification.message}</div>
        <button 
          className="ml-2 text-white/70 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;
