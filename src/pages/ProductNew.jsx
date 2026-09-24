import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthGuard from '../components/AuthGuard.jsx';
import Navbar from '../components/Navbar.jsx';
import ProductForm from '../components/ProductForm.jsx';
import { addProduct } from '../store/productOverlay.js';

export default function ProductNew() {
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (data) => {
        if (saving) return;
        setSaving(true);
        await new Promise((r) => setTimeout(r, 300));
        addProduct({
            ...data,
            thumbnail: data.thumbnail || 'https://dummyjson.com/icon.png',
            images: data.thumbnail ? [data.thumbnail] : [],
        });
        setSaving(false);
        navigate('/products');
    };

    return (
        <AuthGuard>
            <Navbar />
            <main className="p-4 md:p-6 max-w-3xl mx-auto w-full">
                <h1 className="text-2xl font-bold mb-6">Add Product</h1>
                <ProductForm onSubmit={handleSubmit} submitting={saving} submitLabel="Create" />
            </main>
        </AuthGuard>
    );
}