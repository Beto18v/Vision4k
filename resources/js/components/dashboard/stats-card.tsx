interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ReactNode;
    iconBgColor: string;
}

export default function StatsCard({ title, value, subtitle, icon, iconBgColor }: StatsCardProps) {
    return (
        <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm transition-colors hover:bg-white/5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                    <p className="mt-1 text-xs text-green-400">{subtitle}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBgColor}`}>{icon}</div>
            </div>
        </div>
    );
}
