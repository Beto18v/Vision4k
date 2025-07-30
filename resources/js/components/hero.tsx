import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Hero() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const backgroundImages = [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
        'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative h-[80vh] overflow-hidden">
            {/* Background Images with Parallax Effect */}
            <div className="absolute inset-0">
                {backgroundImages.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-2000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            backgroundImage: `url(${image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundAttachment: 'fixed',
                        }}
                    />
                ))}
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

                {/* Animated Particles */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-20 h-2 w-2 animate-pulse rounded-full bg-white/20"></div>
                    <div className="absolute top-40 right-32 h-1 w-1 animate-bounce rounded-full bg-purple-400/30"></div>
                    <div className="absolute bottom-32 left-16 h-3 w-3 animate-ping rounded-full bg-blue-400/20"></div>
                    <div className="absolute top-60 left-1/3 h-1 w-1 animate-pulse rounded-full bg-white/30 delay-1000"></div>
                    <div className="absolute right-20 bottom-20 h-2 w-2 animate-bounce rounded-full bg-purple-300/20 delay-500"></div>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex h-full items-center justify-center px-4">
                <div className="mx-auto max-w-4xl text-center">
                    {/* Main Title with Animation */}
                    <div className="overflow-hidden">
                        <h1 className="mb-6 translate-y-0 transform animate-[fadeInUp_1s_ease-out] text-6xl leading-none font-black text-white md:text-8xl">
                            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">Vision4K</span>
                        </h1>
                    </div>

                    {/* Subtitle with Typewriter Effect */}
                    <div className="overflow-hidden">
                        <p className="mx-auto mb-8 max-w-2xl translate-y-0 transform animate-[fadeInUp_1s_ease-out_0.3s_both] text-xl text-gray-200 md:text-2xl">
                            Descubre la colección más increíble de{' '}
                            <span className="font-semibold text-purple-300">wallpapers en ultra alta definición</span> que transformarán tu
                            experiencia visual
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="mb-8 flex translate-y-0 transform animate-[fadeInUp_1s_ease-out_0.6s_both] justify-center space-x-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">4K+</div>
                            <div className="text-sm text-gray-300">Resolución</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">1000+</div>
                            <div className="text-sm text-gray-300">Wallpapers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">50+</div>
                            <div className="text-sm text-gray-300">Categorías</div>
                        </div>
                    </div>

                    {/* Call to Action Buttons */}
                    <div className="flex translate-y-0 transform animate-[fadeInUp_1s_ease-out_0.9s_both] flex-col justify-center gap-4 sm:flex-row">
                        <button
                            onClick={() => {
                                const wallpapersSection = document.getElementById('wallpapers-section');
                                wallpapersSection?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
                        >
                            <span className="relative z-10">Explorar Wallpapers</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        </button>
                        <Link
                            href={route('wallpapers.trending')}
                            className="rounded-full border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/10"
                        >
                            Ver Trending
                        </Link>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
                        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/30">
                            <div className="mt-2 h-3 w-1 animate-pulse rounded-full bg-white"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Indicators */}
            <div className="absolute right-6 bottom-6 z-20 flex space-x-2">
                {backgroundImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-3 w-3 rounded-full transition-all duration-300 ${
                            index === currentImageIndex ? 'scale-125 bg-white' : 'bg-white/40 hover:bg-white/60'
                        }`}
                    />
                ))}
            </div>
        </section>
    );
}
