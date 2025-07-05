import React, { useEffect, useState } from 'react';

interface LoadingToastProps {
  message: string;
  isVisible: boolean;
  onClose?: () => void;
}

const LoadingToast: React.FC<LoadingToastProps> = ({ message, isVisible, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div 
        className={`bg-blue-600 text-white px-6 py-4 shadow-lg rounded-lg transform transition-all duration-300 ease-in-out ${
          isAnimating ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span className="font-medium">{message}</span>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors ml-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingToast; 