import React from "react";
import { cn } from "@/utils/utils";
import { VariantProps, cva } from "class-variance-authority";

export const buttonVariants = cva(
  `flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-textL_medium transition disabled:opacity-50 disabled:pointer-events-none transition`,
  {
    variants: {
      variant: {
        primary: `bg-[var(--darkBlue)] text-[var(--text)] hover:opacity-75`,
        outline: `bg-white text-[var(--darkBlue)] border border-[var(--darkBlue)] hover:opacity-75`,
        icon: `bg-transparent hover:opacity-75 rounded-full p-2 h-fit`,
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, children, disabled, type = "button", ...props },
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

Button.displayName = "Button";

/* -- Example Usage ---
import { Button } from '@/components/ui/button';
import { HiPlus } from 'react-icons/hi2';

export default function HomePage() {
  return (
    <div>
      <div className="m-14 flex w-fit flex-col gap-4">
        // Primary 
        <Button>プライマリーボタン</Button>

        // Secondary 
        <Button variant="outline">セカンダリーボタン</Button>

        // Icon 
        <Button variant="icon" className="h-10 w-10 p-0">
          <HiPlus size={32} />
        </Button>
      </div>
    </div>
  );
}
*/
