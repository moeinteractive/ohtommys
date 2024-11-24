'use client';

interface CelticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const CelticButton = ({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: CelticButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`celtic-button ${className}`}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
