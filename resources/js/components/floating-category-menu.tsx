import { useEffect, useState } from 'react';

interface Category {
    id: number;
    name: string;
    image: string;
    wallpaper_count?: number;
}

interface FloatingCategoryMenuProps {
    categories: Category[];
    selectedCategory: string;
    onCategorySelect: (category: string) => void;
}

export default function FloatingCategoryMenu({ categories, selectedCategory, onCategorySelect }: FloatingCategoryMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const heroHeight = window.innerHeight * 0.4; // Aparece más temprano (40% de la pantalla)

            if (scrollY > heroHeight) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
                setIsOpen(false); // Cerrar menú si volvemos arriba
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div
            className={`fixed top-1/2 left-6 z-30 -translate-y-1/2 transform transition-all duration-700 ease-out ${
                isVisible ? 'translate-x-0 scale-100 opacity-100' : 'pointer-events-none -translate-x-8 scale-75 opacity-0'
            }`}
        >
            {/* Menu Toggle Button */}
            <button
                onClick={toggleMenu}
                className={`group relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600/90 to-pink-600/90 backdrop-blur-md transition-all duration-500 ease-out hover:scale-110 hover:from-purple-500/95 hover:to-pink-500/95 hover:shadow-2xl hover:shadow-purple-500/25 ${
                    isOpen ? 'scale-110 rotate-45' : 'scale-100 rotate-0'
                }`}
            >
                <svg
                    className={`h-6 w-6 text-white transition-all duration-500 ease-out ${isOpen ? 'rotate-90' : 'rotate-0'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>

                {/* Tooltip mejorado */}
                <div className="absolute top-1/2 left-full ml-4 -translate-y-1/2 transform opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                    <div className="rounded-lg border border-white/10 bg-black/90 px-3 py-2 text-sm text-white shadow-xl backdrop-blur-md">
                        Categorías
                        <div className="absolute top-1/2 right-full -translate-y-1/2 transform">
                            <div className="border-4 border-transparent border-r-black/90"></div>
                        </div>
                    </div>
                </div>
            </button>

            {/* Categories Menu */}
            <div
                className={`absolute top-1/2 left-20 -translate-y-1/2 transform transition-all duration-700 ease-out ${
                    isOpen ? 'translate-x-0 scale-100 opacity-100' : 'pointer-events-none -translate-x-8 scale-95 opacity-0'
                }`}
            >
                <div className="rounded-2xl border border-white/10 bg-black/90 p-4 shadow-2xl backdrop-blur-xl">
                    <h3 className="mb-4 text-lg font-bold text-white">Categorías</h3>

                    {/* All Categories Option */}
                    <button
                        onClick={() => {
                            onCategorySelect('all');
                            setIsOpen(false);
                        }}
                        className={`mb-3 flex w-full transform items-center justify-center rounded-xl border p-3 transition-all duration-300 ease-out hover:scale-105 ${
                            selectedCategory === 'all'
                                ? 'scale-105 border-purple-500/50 bg-purple-600/30 shadow-lg shadow-purple-500/25'
                                : 'border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-white/10 hover:shadow-md'
                        }`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                    />
                                </svg>
                            </div>
                            <span className="font-medium text-white">Todas</span>
                        </div>
                    </button>

                    {/* Category Items */}
                    <div className="scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-purple-500/50 hover:scrollbar-thumb-purple-500/70 max-h-80 space-y-2 overflow-y-auto">
                        {categories.map((category, index) => (
                            <button
                                key={category.id}
                                onClick={() => {
                                    onCategorySelect(category.name.toLowerCase());
                                    setIsOpen(false);
                                }}
                                style={{
                                    animationDelay: `${index * 50}ms`,
                                }}
                                className={`flex w-full transform items-center justify-center rounded-xl border p-3 transition-all duration-300 ease-out animate-in fade-in slide-in-from-left hover:scale-105 ${
                                    selectedCategory === category.name.toLowerCase()
                                        ? 'scale-105 border-purple-500/50 bg-purple-600/30 shadow-lg shadow-purple-500/25'
                                        : 'border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-white/10 hover:shadow-md'
                                }`}
                            >
                                <span className="font-medium text-white">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Overlay to close menu when clicking outside */}
            {isOpen && <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)} />}
        </div>
    );
}
