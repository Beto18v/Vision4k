import { Link } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
}

export default function Pagination({ links }: PaginationProps) {
    if (!links || links.length === 0) {
        return null;
    }

    return (
        <div className="mt-12 flex justify-center">
            <div className="flex space-x-2">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        href={link.url || '#'}
                        className={`rounded-lg px-4 py-2 transition-all ${
                            link.active
                                ? 'bg-yellow-600 text-black'
                                : link.url
                                  ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                                  : 'cursor-not-allowed bg-gray-600 text-gray-400'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
}
