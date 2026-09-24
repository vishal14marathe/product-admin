import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthGuard from '../components/AuthGuard.jsx';
import Navbar from '../components/Navbar.jsx';
import ProductForm from '../components/ProductForm.jsx';
import Loader from '../components/Loader.jsx';
import { getProductById } from '../services/productService.js';
import { getMergedProduct, editProduct } from '../store/productOverlay.js';

export default function ProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!id || isNaN(Number(id))) { navigate('/404', { replace: true }); return; }
        getProductById(id)
            .then((data) => {
                const merged = getMergedProduct(data);
                if (!merged) navigate('/404', { replace: true });
                else setProduct(merged);
            })
            .catch(() => navigate('/404', { replace: true }))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    const handleSubmit = async (data) => {
        if (saving) return;
        setSaving(true);
        await new Promise((r) => setTimeout(r, 300));
        editProduct(product.id, data);
        setSaving(false);
        navigate(`/products/${product.id}`);
    };

    if (loading) return <AuthGuard><Navbar /><Loader center /></AuthGuard>;
    if (!product) return null;

    return (
        <AuthGuard>
            <Navbar />
            <main className="p-4 md:p-6 max-w-3xl mx-auto w-full">
                <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
                <ProductForm
                    initialValues={{
                        title: product.title,
                        price: product.price,
                        category: product.category,
                        stock: product.stock,
                        rating: product.rating,
                        description: product.description,
                        thumbnail: product.thumbnail,
                    }}
                    onSubmit={handleSubmit}
                    submitting={saving}
                    submitLabel="Update"
                />
            </main>
        </AuthGuard>
    );
}