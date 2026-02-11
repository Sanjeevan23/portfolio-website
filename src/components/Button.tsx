'use client';
import React from 'react';
import { motion, MotionProps } from 'framer-motion';

type Variant = 'primary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends MotionProps {
    children?: React.ReactNode;
    variant?: Variant;
    size?: Size;
    href?: string;
    target?: string;
    rel?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    ariaLabel?: string;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    href,
    target,
    rel,
    onClick,
    className = '',
    leftIcon,
    rightIcon,
    ariaLabel,
    ...motionProps
}: ButtonProps) {
    const sizes: Record<Size, string> = {
        sm: 'px-3 py-1.5 text-sm rounded-full',
        md: 'px-5 py-2 text-base rounded-full',
        lg: 'px-6 py-3 text-lg rounded-full',
    };

    const base =
        'inline-flex items-center justify-center gap-2 font-semibold shadow-lg ' +
        'cursor-pointer select-none ' +
        'focus:outline-none focus:ring-2 focus:ring-white/30 ' +
        'transition-transform duration-200 ease-out';

    const variantClasses: Record<Variant, string> = {
        primary:
            'bg-gradient-to-r from-[#f6c85a] to-[#c48b28] text-black border-none',
        outline:
            'bg-transparent border border-white/15 text-white/90 backdrop-blur-md',
        ghost: 'bg-white/5 text-white/90',
    };

    const composed = `${base} ${sizes[size]} ${variantClasses[variant]} ${className}`;

    const content = (
        <>
            {leftIcon && <span className="flex items-center justify-center">{leftIcon}</span>}
            <span className="whitespace-nowrap">{children}</span>
            {rightIcon && <span className="flex items-center justify-center">{rightIcon}</span>}
        </>
    );
    const motionDefaults: MotionProps = {
        whileHover: {
            scale: 1.12,
            y: -3,
            // boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.35)',
        },
        whileTap: {
            scale: 0.88,
            y: 2,
        },
        transition: {
            type: 'spring',
            stiffness: 520,
            damping: 16,
            mass: 0.6,
        },
    };

    if (href) {
        return (
            <motion.a
                href={href}
                target={target}
                rel={rel}
                className={composed}
                aria-label={ariaLabel}
                {...motionDefaults}
                {...motionProps}
            >
                {content}
            </motion.a>
        );
    }

    return (
        <motion.button
            type="button"
            onClick={onClick}
            className={composed}
            aria-label={ariaLabel}
            {...motionDefaults}
            {...motionProps}
        >
            {content}
        </motion.button>
    );
}
