import { HTMLAttributes, ReactNode } from 'react';
interface TypographyH3Props extends HTMLAttributes<HTMLHeadingElement> {
    children: ReactNode;
}


export function TypographyH2({ children, ...props }: TypographyH3Props) {
    return (
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0" {...props}>
            {children}
        </h2>
    )
}


export function TypographyH3({ children, ...props }: TypographyH3Props) {
    return (
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight" {...props}>
            {children}
        </h3>
    );
}

