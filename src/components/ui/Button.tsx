import { clsx } from 'clsx';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = 'primary', size = 'md', disabled, children, ...props }, ref) => {
		return (
			<button
				ref={ref}
				disabled={disabled}
				className={clsx(
					'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
					{
						'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500': variant === 'primary',
						'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500': variant === 'secondary',
						'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': variant === 'danger',
						'text-gray-600 hover:bg-gray-100 focus:ring-gray-500': variant === 'ghost',
					},
					{
						'px-3 py-2 text-sm min-h-[40px]': size === 'sm',
						'px-4 py-2.5 text-sm min-h-[44px]': size === 'md',
						'px-6 py-3 text-base min-h-[48px]': size === 'lg',
					},
					className
				)}
				{...props}>
				{children}
			</button>
		);
	}
);

Button.displayName = 'Button';

export default Button;
