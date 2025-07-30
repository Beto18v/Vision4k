interface ViewModeToggleProps {
    viewMode: 'grid' | 'masonry';
    onViewModeChange: (mode: 'grid' | 'masonry') => void;
}

export default function ViewModeToggle({ viewMode, onViewModeChange }: ViewModeToggleProps) {
    return (
        <div className="flex items-center rounded-xl bg-white/10 p-1">
            <button
                onClick={() => onViewModeChange('grid')}
                className={`rounded-lg p-2 transition-all ${viewMode === 'grid' ? 'bg-yellow-600 text-black' : 'text-gray-300 hover:bg-white/10'}`}
            >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                </svg>
            </button>
            <button
                onClick={() => onViewModeChange('masonry')}
                className={`rounded-lg p-2 transition-all ${viewMode === 'masonry' ? 'bg-yellow-600 text-black' : 'text-gray-300 hover:bg-white/10'}`}
            >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
            </button>
        </div>
    );
}
