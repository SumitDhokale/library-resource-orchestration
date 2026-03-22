import { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  className,
  fullWidth = false,
}: ButtonProps) {
  const baseStyles = cn(
    'inline-flex items-center justify-center gap-2 font-medium rounded-xl',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed'
  );

  const variants = {
    primary: cn(
      'bg-gradient-to-r from-indigo-500 to-purple-600 text-white',
      'hover:from-indigo-600 hover:to-purple-700',
      'focus:ring-indigo-500',
      'shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40'
    ),
    secondary: cn(
      'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white',
      'hover:bg-gray-200 dark:hover:bg-gray-700',
      'focus:ring-gray-500'
    ),
    danger: cn(
      'bg-gradient-to-r from-red-500 to-rose-600 text-white',
      'hover:from-red-600 hover:to-rose-700',
      'focus:ring-red-500',
      'shadow-lg shadow-red-500/30'
    ),
    ghost: cn(
      'text-gray-600 dark:text-gray-400',
      'hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
      'focus:ring-gray-500'
    ),
    outline: cn(
      'border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300',
      'hover:bg-gray-50 dark:hover:bg-gray-800',
      'focus:ring-gray-500'
    ),
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 14 : 18} className="animate-spin" />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
}
