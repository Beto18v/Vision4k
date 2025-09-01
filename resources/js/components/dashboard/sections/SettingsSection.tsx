import { Lock, Save, Trash2, User } from 'lucide-react';
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
    onProfileSubmit: (data: { name: string; email: string }, callbacks?: { onSuccess?: () => void; onError?: (error?: string) => void }) => void;
    onPasswordSubmit: (
        data: { current_password: string; password: string; password_confirmation: string },
        callbacks?: { onSuccess?: () => void; onError?: (error?: string) => void },
    ) => void;
    onDeleteAccount: (password: string, callbacks?: { onSuccess?: () => void; onError?: (error?: string) => void }) => void;
}

export default function SettingsSection({ auth, onProfileSubmit, onPasswordSubmit, onDeleteAccount }: SettingsSectionProps) {
    const [settingsTab, setSettingsTab] = useState<'profile' | 'password' | 'account'>('profile');

    // Profile form state
    const [profileData, setProfileData] = useState({
        name: auth.user.name,
        email: auth.user.email,
    });
    const [profileProcessing, setProfileProcessing] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);

    // Password form state
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });
    const [passwordProcessing, setPasswordProcessing] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    // Delete account form state
    const [deleteData, setDeleteData] = useState({
        password: '',
    });
    const [deleteProcessing, setDeleteProcessing] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // Handlers para formularios de configuración
    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProfileProcessing(true);
        setProfileError(null);

        const data = {
            name: profileData.name,
            email: profileData.email,
        };

        onProfileSubmit(data, {
            onSuccess: () => {
                setProfileProcessing(false);
                setProfileSuccess(true);
                setTimeout(() => setProfileSuccess(false), 3000);
            },
            onError: (error?: string) => {
                setProfileProcessing(false);
                setProfileError(error || 'Error al actualizar el perfil');
                setTimeout(() => setProfileError(null), 5000);
            },
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordProcessing(true);
        setPasswordError(null); // Limpiar errores previos

        onPasswordSubmit(passwordData, {
            onSuccess: () => {
                setPasswordProcessing(false);
                setPasswordSuccess(true);
                setTimeout(() => setPasswordSuccess(false), 3000);
                setPasswordData({
                    current_password: '',
                    password: '',
                    password_confirmation: '',
                });
            },
            onError: (error?: string) => {
                setPasswordProcessing(false);
                setPasswordError(error || 'Error al cambiar la contraseña');
                setTimeout(() => setPasswordError(null), 5000);
            },
        });
    };

    const handleDeleteAccount = (e: React.FormEvent) => {
        e.preventDefault();
        setDeleteError(null); // Limpiar errores previos

        if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
            setDeleteProcessing(true);

            onDeleteAccount(deleteData.password, {
                onSuccess: () => {
                    setDeleteProcessing(false);
                },
                onError: (error?: string) => {
                    setDeleteProcessing(false);
                    setDeleteError(error || 'Error al eliminar la cuenta. Verifica tu contraseña.');
                    setTimeout(() => setDeleteError(null), 5000);
                },
            });
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

                        {profileSuccess && (
                            <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-400">
                                <p className="text-sm">✅ Perfil actualizado correctamente</p>
                            </div>
                        )}

                        {profileError && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
                                <p className="text-sm">❌ {profileError}</p>
                            </div>
                        )}
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

                        {passwordSuccess && (
                            <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-green-400">
                                <p className="text-sm">✅ Contraseña actualizada correctamente</p>
                            </div>
                        )}

                        {passwordError && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
                                <p className="text-sm">❌ {passwordError}</p>
                            </div>
                        )}
                    </form>
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

                            {deleteError && (
                                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">
                                    <p className="text-sm">❌ {deleteError}</p>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
