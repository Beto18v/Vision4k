import { X } from 'lucide-react';
import React, { useState } from 'react';

interface CreateCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
    onSuccess?: () => void;
}

export default function CreateCategoryModal({ isOpen, onClose, onSubmit, onSuccess }: CreateCategoryModalProps) {
    const [categoryData, setCategoryData] = useState({
        name: '',
        image: null as File | null,
    });
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('name', categoryData.name);
        if (categoryData.image) {
            formData.append('image', categoryData.image);
        }

        onSubmit(formData);
        // No llamar onSuccess aquí - se hará desde el componente padre cuando sea exitoso
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">Crear Nueva Categoría</h3>
                    <button onClick={onClose} className="rounded-lg p-1 text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-2 block font-medium text-white">Nombre</label>
                        <input
                            type="text"
                            value={categoryData.name}
                            onChange={(e) => setCategoryData((prev) => ({ ...prev, name: e.target.value }))}
                            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                            placeholder="Nombre de la categoría"
                            required
                        />
                    </div>
                    <div className="flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-white/20 bg-white/10 py-3 font-medium text-white transition-colors hover:bg-white/20"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-medium text-white transition-colors hover:from-purple-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? 'Creando...' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
