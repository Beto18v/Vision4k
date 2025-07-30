import { ChangeEvent, FormEvent, useState } from 'react';

export default function AdminPanel() {
    const [title, setTitle] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Lógica para manejar el envío del formulario a tu API de Laravel
        console.log({ title, category, file });
        // Aquí usarías axios para enviar los datos a una ruta de API
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4 text-white">
            <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-xl">
                <h2 className="mb-6 text-center text-3xl font-bold text-cyan-400">Subir Wallpaper</h2>
                <div className="mb-4">
                    <label htmlFor="title" className="mb-2 block text-sm font-medium">
                        Título
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                        className="w-full rounded border border-gray-600 bg-gray-700 p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="category" className="mb-2 block text-sm font-medium">
                        Categoría
                    </label>
                    <input
                        type="text"
                        id="category"
                        value={category}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)}
                        className="w-full rounded border border-gray-600 bg-gray-700 p-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="file" className="mb-2 block text-sm font-medium">
                        Archivo
                    </label>
                    <input
                        type="file"
                        id="file"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-400 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cyan-700 hover:file:bg-cyan-100"
                    />
                </div>
                <button type="submit" className="w-full rounded bg-cyan-600 px-4 py-2 font-bold text-white transition-colors hover:bg-cyan-700">
                    Subir
                </button>
            </form>
        </div>
    );
}
