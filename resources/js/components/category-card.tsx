// Definimos los tipos para las props del componente
interface CategoryCardProps {
    category: {
        id: number;
        name: string;
        image: string;
    };
}

export default function CategoryCard({ category }: CategoryCardProps) {
    return (
        <div className="group relative h-32 cursor-pointer overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:scale-110 hover:shadow-2xl">
            {/* Background Image with Parallax Effect */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-125"
                style={{
                    backgroundImage: `url(${category.image})`,
                }}
            />

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center p-4">
                <h3 className="text-center text-lg font-bold text-white transition-transform duration-300 group-hover:scale-110">{category.name}</h3>

                {/* Animated Icon */}
                <div className="mt-2 translate-y-2 transform opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </div>
            </div>

            {/* Floating Particles */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-2 right-3 h-1 w-1 animate-pulse rounded-full bg-white/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="absolute bottom-3 left-2 h-2 w-2 animate-bounce rounded-full bg-purple-400/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                <div className="absolute top-1/2 right-2 h-1 w-1 animate-ping rounded-full bg-pink-400/40 opacity-0 transition-opacity duration-700 group-hover:opacity-100"></div>
            </div>

            {/* Border Glow Effect */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent transition-all duration-300 group-hover:border-purple-400/50"></div>
        </div>
    );
}
