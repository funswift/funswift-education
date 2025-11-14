import React from 'react';
import { cn } from '@/components/utils';
import { VariantProps, cva } from 'class-variance-authority';

export const buttonVariants = cva(
  `flex h-10 items-center justify-center gap-2 rounded-full px-4 text-textL_medium transition disabled:opacity-50 disabled:pointer-events-none transition`,
  {
    variants: {
      variant: {
        primary: `bg-[var(--green)] text-[var(--text)] hover:opacity-75`,
        outline: `bg-white text-[var(--green)] border border-[var(--green)] hover:opacity-75`,
        icon: `bg-transparent hover:bg-bg-gray rounded-full p-2 h-fit`,
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, children, disabled, type = 'button', ...props },
    ref
  ) => {
    return (
      <button
        type={type}
        className={cn(buttonVariants({ variant, className }))}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
