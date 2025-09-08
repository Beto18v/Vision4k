import { Upload } from 'lucide-react';
import React, { useState } from 'react';

interface UploadSectionProps {
    categories?: Array<{
        id: number;
        name: string;
        slug: string;
        wallpaper_count: number;
        total_downloads: number;
        image_url: string;
    }>;
    onSubmit: (formData: FormData) => void;
}

export default function UploadSection({ categories = [], onSubmit }: UploadSectionProps) {
    const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('');

    const displayCategories = categories || [];

    // Drag and drop handlers1
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setUploadFiles(e.dataTransfer.files);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setUploadFiles(e.target.files);
        }
    };

    // Subir wallpapers
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!uploadFiles || uploadFiles.length === 0) {
            alert('Por favor selecciona al menos un archivo');
            return;
        }

        if (uploadFiles.length > 20) {
            alert('Máximo 20 archivos permitidos');
            return;
        }

        if (!categoryId) {
            alert('Por favor selecciona una categoría');
            return;
        }

        // Validar tipos de archivo
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        const invalidFiles = Array.from(uploadFiles).filter((file) => !allowedTypes.includes(file.type));

        if (invalidFiles.length > 0) {
            alert(`Los siguientes archivos no son válidos: ${invalidFiles.map((f) => f.name).join(', ')}\n\nFormatos permitidos: JPG, PNG, WebP`);
            return;
        }

        // Validar tamaño de archivos (20MB máximo para imágenes 4K)
        const maxSize = 20 * 1024 * 1024; // 20MB en bytes
        const oversizedFiles = Array.from(uploadFiles).filter((file) => file.size > maxSize);

        if (oversizedFiles.length > 0) {
            alert(`Los siguientes archivos son demasiado grandes (máximo 20MB): ${oversizedFiles.map((f) => f.name).join(', ')}`);
            return;
        }

        setIsProcessing(true);

        const formData = new FormData();
        formData.append('title', title || '');
        formData.append('category_id', categoryId);

        // Añadir archivos
        Array.from(uploadFiles).forEach((file) => {
            formData.append('files[]', file);
        });

        onSubmit(formData);

        // Reset form
        setIsProcessing(false);
        setTitle('');
        setCategoryId('');
        setUploadFiles(null);
        // Limpiar input de archivo
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    return (
        <div className="mx-auto max-w-2xl">
            <div className="rounded-xl border border-white/10 bg-black/20 p-8 backdrop-blur-sm">
                <h2 className="mb-6 text-2xl font-bold text-white">Subir Nuevo Wallpaper</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* File Upload Area */}
                    <div
                        className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                            dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-white/20 hover:border-purple-500/50'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                        <p className="mb-2 text-white">Arrastra y suelta tus imágenes aquí</p>
                        <p className="mb-4 text-sm text-gray-400">O haz clic para seleccionar archivos (máx. 20)</p>
                        <input type="file" accept="image/*" multiple className="hidden" id="file-upload" onChange={handleFileSelect} />
                        <label
                            htmlFor="file-upload"
                            className="inline-block cursor-pointer rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white transition-colors hover:from-purple-700 hover:to-pink-700"
                        >
                            Seleccionar Archivos
                        </label>
                        <p className="mt-2 text-xs text-gray-500">Formatos soportados: JPG, PNG, WebP (máx. 20MB cada uno)</p>
                        {uploadFiles && uploadFiles.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm text-green-400">{uploadFiles.length} archivo(s) seleccionado(s)</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {Array.from(uploadFiles).map((file, index) => (
                                        <span key={index} className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white">
                                            {file.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Form Fields */}
                    <div className="flex justify-center md:col-span-2">
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-80 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                        >
                            <option value="" style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
                                Seleccionar categoría
                            </option>
                            {displayCategories.map((category) => (
                                <option key={category.id} value={category.id} style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing || !categoryId}
                        className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white transition-colors hover:from-purple-700 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isProcessing ? 'Subiendo...' : 'Subir Wallpaper(s)'}
                    </button>
                </form>
            </div>
        </div>
    );
}
