'use client';

import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
}

export function Card({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}: CardProps) {
  const variants = {
    default: 'card',
    hover: 'card card-hover',
    bordered: 'card border border-sand-brown',
  };

  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'card-lg',
  };

  return (
    <div className={cn(variants[variant], sizes[size], className)} {...props}>
      {children}
    </div>
  );
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function CardTitle({ className, as: Component = 'h3', children, ...props }: CardTitleProps) {
  return (
    <Component className={cn('text-h3 font-semibold text-deep-navy', className)} {...props}>
      {children}
    </Component>
  );
}

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({ className, children, ...props }: CardDescriptionProps) {
  return (
    <p className={cn('text-body text-warm-gray mt-1', className)} {...props}>
      {children}
    </p>
  );
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-sand-brown/30', className)} {...props}>
      {children}
    </div>
  );
}
