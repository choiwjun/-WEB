'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-hover focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-deep-navy text-white hover:brightness-110 focus:ring-deep-navy',
      secondary:
        'bg-calm-beige text-deep-navy border border-sand-brown hover:bg-sand-brown/20 focus:ring-sand-brown',
      outline:
        'bg-transparent text-deep-navy border-2 border-deep-navy hover:bg-deep-navy hover:text-white focus:ring-deep-navy',
      ghost: 'bg-transparent text-deep-navy hover:bg-deep-navy/10 focus:ring-deep-navy',
      danger: 'bg-error text-white hover:brightness-110 focus:ring-error',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-button',
      md: 'px-6 py-3 rounded-button',
      lg: 'px-8 py-4 text-lg rounded-button',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}
        {children}
        {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
