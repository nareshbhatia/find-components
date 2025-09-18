import React from 'react';

interface ButtonDeprecatedProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'reset' | 'submit';
}

export const ButtonDeprecated: React.FC<ButtonDeprecatedProps> = ({
  children,
  onClick,
  className = '',
  type = 'button',
}) => {
  const baseClasses = 'px-3 py-1 border border-gray-400 rounded-sm text-sm';

  return (
    <button
      type={type}
      className={`${baseClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
