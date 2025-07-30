interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchBar({ searchTerm, onSearchChange, placeholder = 'Buscar wallpapers...' }: SearchBarProps) {
    return (
        <div className="relative mx-auto mb-8 max-w-2xl">
            <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-2xl border border-yellow-500/20 bg-white/10 px-6 py-4 text-lg text-white placeholder-gray-300 backdrop-blur-md focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none"
            />
            <svg className="absolute top-1/2 right-6 h-6 w-6 -translate-y-1/2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
    );
}
