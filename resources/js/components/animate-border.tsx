import React from 'react';

interface AnimatedBorderProps {
    children: React.ReactNode;
}

export default function AnimatedBorder({ children }: AnimatedBorderProps) {
    return (
        <div className="relative rounded-lg bg-gradient-to-r from-teal-400 to-blue-500 p-1">
            <div className="rounded-lg bg-gray-800 p-8">{children}</div>
        </div>
    );
}
