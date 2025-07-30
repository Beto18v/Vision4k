import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface FlashMessage {
    success?: string;
    error?: string;
    info?: string;
    warning?: string;
}

export default function FlashMessages() {
    const { flash } = usePage().props as any;
    const [messages, setMessages] = useState<FlashMessage>({});
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (flash && typeof flash === 'object') {
            setMessages(flash);
            setIsVisible(true);

            // Auto-hide after 5 seconds
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => setMessages({}), 300); // Wait for animation to complete
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!isVisible || Object.keys(messages).length === 0) {
        return null;
    }

    const getMessageType = () => {
        if (messages.success) return 'success';
        if (messages.error) return 'error';
        if (messages.warning) return 'warning';
        if (messages.info) return 'info';
        return 'info';
    };

    const getMessage = () => {
        return messages.success || messages.error || messages.warning || messages.info;
    };

    const getColors = () => {
        const type = getMessageType();
        switch (type) {
            case 'success':
                return 'bg-green-500/10 border-green-500/20 text-green-400';
            case 'error':
                return 'bg-red-500/10 border-red-500/20 text-red-400';
            case 'warning':
                return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
            case 'info':
                return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
            default:
                return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
        }
    };

    const getIcon = () => {
        const type = getMessageType();
        switch (type) {
            case 'success':
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'error':
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                    </svg>
                );
            case 'info':
                return (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
            <div className={`transform transition-all duration-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                <div className={`rounded-lg border p-4 backdrop-blur-sm ${getColors()}`}>
                    <div className="flex items-start">
                        <div className="mt-0.5 mr-3 flex-shrink-0">{getIcon()}</div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">{getMessage()}</p>
                        </div>
                        <button onClick={() => setIsVisible(false)} className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-200">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
