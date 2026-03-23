import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-navy text-white hover:bg-navy/90',
  secondary: 'border border-gold text-gold hover:bg-gold/10',
  danger: 'bg-danger text-white hover:bg-danger/90',
  ghost: 'text-text-muted hover:bg-surface-muted',
};

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
