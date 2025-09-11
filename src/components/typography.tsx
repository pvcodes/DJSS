import { cn } from '@/lib/utils';
import { HTMLAttributes, ReactNode } from 'react';
interface TypographyH3Props extends HTMLAttributes<HTMLHeadingElement> {
    children: ReactNode;
}


export function TypographyH2({ children, className, ...props }: TypographyH3Props) {
    return (
        <h2 className={cn(className, "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0")} {...props}>
            {children}
        </h2>
    )
}


export function TypographyH3({ children, className, ...props }: TypographyH3Props) {
    return (
        <h3 className={cn(className, "scroll-m-20 text-2xl font-semibold tracking-tight")} {...props}>
            {children}
        </h3>
    );
}

export function TypographyH4({ children, className, ...props }: TypographyH3Props) {
    return (
        <h4 className={cn(className, "scroll-m-20 text-xl font-semibold tracking-tight")} {...props}>
            {children}
        </h4>
    )
}


export function TypographyP({ children, className, ...props }: TypographyH3Props) {
    return (
        <p className={cn(className, "leading-7 [&:not(:first-child)]:mt-6")} {...props}>
            {children}
        </p>
    )
}
