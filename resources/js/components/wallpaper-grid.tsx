// Definimos la estructura de un Wallpaper
interface Wallpaper {
    id: number;
    url: string;
    description: string;
}

// Definimos las props del componente
interface WallpaperGridProps {
    wallpapers: Wallpaper[];
    onWallpaperClick: (wallpaper: Wallpaper) => void;
}

export default function WallpaperGrid({ wallpapers, onWallpaperClick }: WallpaperGridProps) {
    return (
        <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4 lg:grid-cols-6">
            {wallpapers.map((wallpaper) => (
                <div key={wallpaper.id} className="cursor-pointer" onClick={() => onWallpaperClick(wallpaper)}>
                    <img
                        src={wallpaper.url}
                        alt={wallpaper.description}
                        className="h-auto w-full rounded-lg shadow-md transition-opacity hover:opacity-80"
                    />
                </div>
            ))}
        </div>
    );
}
