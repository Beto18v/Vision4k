import { BarChart3, Image, Settings, Star, Upload } from 'lucide-react';

interface NavigationTab {
    key: 'overview' | 'wallpapers' | 'favorites' | 'upload' | 'settings';
    label: string;
    icon: React.ElementType;
}

interface DashboardNavigationProps {
    activeTab: 'overview' | 'wallpapers' | 'favorites' | 'upload' | 'settings';
    onTabChange: (tab: 'overview' | 'wallpapers' | 'favorites' | 'upload' | 'settings') => void;
}

export default function DashboardNavigation({ activeTab, onTabChange }: DashboardNavigationProps) {
    const tabs: NavigationTab[] = [
        { key: 'overview', label: 'Resumen', icon: BarChart3 },
        { key: 'wallpapers', label: 'Wallpapers', icon: Image },
        { key: 'favorites', label: 'Favoritos', icon: Star },
        { key: 'upload', label: 'Subir', icon: Upload },
        { key: 'settings', label: 'Configuración', icon: Settings },
    ];

    return (
        <div className="mb-8">
            <nav className="flex space-x-1 rounded-xl bg-black/20 p-1 backdrop-blur-sm">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => onTabChange(tab.key)}
                            className={`flex items-center space-x-2 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                                activeTab === tab.key
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <Icon size={18} />
                            <span className="hidden sm:block">{tab.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
