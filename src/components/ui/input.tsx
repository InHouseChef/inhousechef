import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode; // Add an icon prop to accept a React node
    iconPosition?: 'left' | 'right'; // Position the icon on the left or right side of the input
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, icon, iconPosition = 'left', type, ...props }, ref) => {
        // Apply additional styling to adjust padding based on icon presence and position
        const inputClass = cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            {
                'pl-10': icon && iconPosition === 'left',  // Add left padding if icon is on the left
                'pr-10': icon && iconPosition === 'right', // Add right padding if icon is on the right
            },
            className
        );

        return (
            <div className='relative flex items-center'>
                {icon && iconPosition === 'left' && (
                    <div className='absolute left-3 pointer-events-none'>
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    className={inputClass}
                    ref={ref}
                    {...props}
                />
                {icon && iconPosition === 'right' && (
                    <div className='absolute right-3 pointer-events-none'>
                        {icon}
                    </div>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
