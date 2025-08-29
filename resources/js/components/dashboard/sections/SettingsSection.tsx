import { Lock, Monitor, Moon, Save, Settings, Sun, Trash2, User } from 'lucide-react';
import React, { useState } from 'react';

interface SettingsSectionProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
        role: string;
        is_admin: boolean;
    };
    onProfileSubmit: (formData: FormData) => void;
    onPasswordSubmit: (data: { current_password: string; password: string; password_confirmation: string }) => void;
    onDeleteAccount: (password: string) => void;
}

export default function SettingsSection({ auth, onProfileSubmit, onPasswordSubmit, onDeleteAccount }: SettingsSectionProps) {
    const [settingsTab, setSettingsTab] = useState<'profile' | 'password' | 'appearance' | 'account'>('profile');
    const [appearance, setAppearance] = useState<'light' | 'dark' | 'system'>('system');

    // Profile form state
    const [profileData, setProfileData] = useState({
        name: auth.user.name,
        email: auth.user.email,
        avatar: null as File | null,
    });
    const [profileProcessing, setProfileProcessing] = useState(false);

    // Password form state
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [passwordProcessing, setPasswordProcessing] = useState(false);

    // Delete account form state
    const [deleteData, setDeleteData] = useState({
        password: '',
    });
    const [deleteProcessing, setDeleteProcessing] = useState(false);

    // Handlers para formularios de configuración
    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProfileProcessing(true);

        const formData = new FormData();
        formData.append('name', profileData.name);
        formData.append('email', profileData.email);
        if (profileData.avatar) {
            formData.append('avatar', profileData.avatar);
        }

        onProfileSubmit(formData);
        setProfileProcessing(false);
        setProfileData((prev) => ({ ...prev, avatar: null }));
        // Limpiar input de archivo
        const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordProcessing(true);

        onPasswordSubmit(passwordData);
        setPasswordProcessing(false);
        setPasswordData({
            current_password: '',
            password: '',
            password_confirmation: '',
        });
    };

    const handleDeleteAccount = (e: React.FormEvent) => {
        e.preventDefault();

        if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
            setDeleteProcessing(true);
            onDeleteAccount(deleteData.password);
            setDeleteProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Settings Navigation - Integrated */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setSettingsTab('profile')}
                    className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        settingsTab === 'profile' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                >
                    <User className="h-4 w-4" />
                    <span>Perfil</span>
                </button>
                <button
                    onClick={() => setSettingsTab('password')}
                    className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        settingsTab === 'password' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                >
                    <Lock className="h-4 w-4" />
                    <span>Contraseña</span>
                </button>
                <button
                    onClick={() => setSettingsTab('appearance')}
                    className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        settingsTab === 'appearance' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                >
                    <Settings className="h-4 w-4" />
                    <span>Apariencia</span>
                </button>
                <button
                    onClick={() => setSettingsTab('account')}
                    className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        settingsTab === 'account' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                    }`}
                >
                    <Trash2 className="h-4 w-4" />
                    <span>Cuenta</span>
                </button>
            </div>

            {/* Profile Settings */}
            {settingsTab === 'profile' && (
                <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                    <div className="mb-6 flex items-center space-x-3">
                        <User className="h-5 w-5 text-purple-400" />
                        <h3 className="text-lg font-semibold text-white">Información del Perfil</h3>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-white">Nombre</label>
                                <input
                                    type="text"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                    placeholder="Tu nombre completo"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-white">Correo electrónico</label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                    placeholder="tu@email.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={profileProcessing}
                            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white transition-all hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            <span>{profileProcessing ? 'Guardando...' : 'Guardar Cambios'}</span>
                        </button>
                    </form>
                </div>
            )}

            {/* Password Settings */}
            {settingsTab === 'password' && (
                <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                    <div className="mb-6 flex items-center space-x-3">
                        <Lock className="h-5 w-5 text-purple-400" />
                        <h3 className="text-lg font-semibold text-white">Cambiar Contraseña</h3>
                    </div>

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">Contraseña Actual</label>
                            <input
                                type="password"
                                value={passwordData.current_password}
                                onChange={(e) => setPasswordData((prev) => ({ ...prev, current_password: e.target.value }))}
                                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                placeholder="Ingresa tu contraseña actual"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-white">Nueva Contraseña</label>
                                <input
                                    type="password"
                                    value={passwordData.password}
                                    onChange={(e) => setPasswordData((prev) => ({ ...prev, password: e.target.value }))}
                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                    placeholder="Nueva contraseña"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-white">Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    value={passwordData.password_confirmation}
                                    onChange={(e) => setPasswordData((prev) => ({ ...prev, password_confirmation: e.target.value }))}
                                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                                    placeholder="Confirma la nueva contraseña"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={passwordProcessing}
                            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white transition-all hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            <span>{passwordProcessing ? 'Actualizando...' : 'Actualizar Contraseña'}</span>
                        </button>
                    </form>
                </div>
            )}

            {/* Appearance Settings */}
            {settingsTab === 'appearance' && (
                <div className="rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                    <div className="mb-6 flex items-center space-x-3">
                        <Settings className="h-5 w-5 text-purple-400" />
                        <h3 className="text-lg font-semibold text-white">Apariencia</h3>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                        <p className="mb-4 text-sm text-gray-400">
                            Elige cómo quieres que se vea la aplicación. Puedes elegir entre modo claro, oscuro o seguir la configuración de tu
                            sistema.
                        </p>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setAppearance('light')}
                                className={`flex items-center space-x-2 rounded-lg border px-4 py-2 transition-colors ${
                                    appearance === 'light'
                                        ? 'border-purple-500 bg-purple-500/20 text-white'
                                        : 'border-white/20 bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                            >
                                <Sun className="h-4 w-4" />
                                <span>Claro</span>
                            </button>

                            <button
                                onClick={() => setAppearance('dark')}
                                className={`flex items-center space-x-2 rounded-lg border px-4 py-2 transition-colors ${
                                    appearance === 'dark'
                                        ? 'border-purple-500 bg-purple-500/20 text-white'
                                        : 'border-white/20 bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                            >
                                <Moon className="h-4 w-4" />
                                <span>Oscuro</span>
                            </button>

                            <button
                                onClick={() => setAppearance('system')}
                                className={`flex items-center space-x-2 rounded-lg border px-4 py-2 transition-colors ${
                                    appearance === 'system'
                                        ? 'border-purple-500 bg-purple-500/20 text-white'
                                        : 'border-white/20 bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                            >
                                <Monitor className="h-4 w-4" />
                                <span>Sistema</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Account Settings */}
            {settingsTab === 'account' && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 backdrop-blur-sm">
                    <div className="mb-6 flex items-center space-x-3">
                        <Trash2 className="h-5 w-5 text-red-400" />
                        <h3 className="text-lg font-semibold text-white">Eliminar Cuenta</h3>
                    </div>

                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
                        <div className="mb-4">
                            <h4 className="mb-2 text-lg font-medium text-white">¿Estás seguro?</h4>
                            <p className="text-sm text-gray-400">
                                Una vez que elimines tu cuenta, todos tus recursos y datos serán eliminados permanentemente. Por favor ingresa tu
                                contraseña para confirmar que deseas eliminar tu cuenta.
                            </p>
                        </div>

                        <form onSubmit={handleDeleteAccount} className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-white">Contraseña</label>
                                <input
                                    type="password"
                                    value={deleteData.password}
                                    onChange={(e) => setDeleteData({ password: e.target.value })}
                                    className="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500/50 focus:outline-none"
                                    placeholder="Ingresa tu contraseña para confirmar"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={deleteProcessing}
                                className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 px-6 py-3 font-medium text-white transition-all hover:from-red-700 hover:to-pink-700 disabled:opacity-50"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span>{deleteProcessing ? 'Eliminando...' : 'Eliminar Cuenta'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
