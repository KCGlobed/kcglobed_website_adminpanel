// components/GlassButton.tsx
import React from 'react';

export interface GlassButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  color: 'green' | 'red' | 'blue' | 'gray';
  title?: string;
  disabled?: boolean;
}

const colorMap = {
  green: {
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-300/30',
    hover: 'hover:bg-green-100/20 dark:hover:bg-green-200/10',
  },
  red: {
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-300/30',
    hover: 'hover:bg-red-100/20 dark:hover:bg-red-200/10',
  },
  blue: {
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-300/30',
    hover: 'hover:bg-blue-100/20 dark:hover:bg-blue-200/10',
  },
  gray: {
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-300/30',
    hover: 'hover:bg-gray-100/20 dark:hover:bg-gray-200/10',
  },
};

const GlassButton: React.FC<GlassButtonProps> = ({ onClick, icon, color, title, disabled = false }) => {
  const classes = colorMap[color];

  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`p-1.5 rounded-xl transition
                 ${disabled 
                   ? 'cursor-not-allowed opacity-50 bg-gray-100/50 text-gray-400 border-gray-200/30' 
                   : `cursor-pointer ${classes.text} ${classes.border} ${classes.hover} bg-white/10 backdrop-blur-md shadow-md`
                 }`}
    >
      {icon}
    </button>
  );
};

export default GlassButton;
