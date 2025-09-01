import { ReactNode } from 'react';

interface SettingsLayoutProps {
    children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    return <div className="max-w-2xl">{children}</div>;
}
