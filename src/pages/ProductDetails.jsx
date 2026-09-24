import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AuthGuard from '../components/AuthGuard.jsx';
import Navbar from '../components/Navbar.jsx';
import Loader from '../components/Loader.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Stars from '../components/Stars.jsx';
import { getProductById } from '../services/productService.js';
import { getMergedProduct } from '../store/productOverlay.js';

const FALLBACK = 'https://dummyjson.com/icon.png';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id || isNaN(Number(id))) { navigate('/404', { replace: true }); return; }
        setLoading(true);
        getProductById(id)
            .then((data) => {
                const merged = getMergedProduct(data);
                if (!merged) navigate('/404', { replace: true });
                else setProduct(merged);
            })
            .catch(() => setError('Product not found'))
            .finally(() => setLoading(false));
    }, [id, navigate]);

    if (loading) return <AuthGuard><Navbar /><Loader center label="Loading product…" /></AuthGuard>;
    if (error || !product) {
        return (
            <AuthGuard>
                <Navbar />
                <ErrorState message={error} onRetry={() => window.location.reload()} />
            </AuthGuard>
        );
    }

    const images = product.images?.length ? product.images : [product.thumbnail || FALLBACK];

    return (
        <AuthGuard>
            <Navbar />
            <main className="p-4 md:p-8 max-w-5xl mx-auto w-full">
                <Link to="/products" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 transition mb-4">← Back to products</Link>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
                    <div className="flex items-start justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{product.title}</h1>
                            <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 capitalize">{product.category}</span>
                        </div>
                        <Link to={`/products/${product.id}/edit`} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition">Edit</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-wrap gap-3">
                            {images.map((img, i) => (
                                <img key={i} src={img || FALLBACK} alt={product.title}
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK; }}
                                    className="w-40 h-40 object-cover rounded-xl border border-slate-200 bg-slate-50" />
                            ))}
                        </div>

                        <div className="space-y-4">
                            <p className="text-3xl font-bold text-slate-900">₹{product.price}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                                <Stars value={product.rating} size="sm" showNumber />
                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${product.stock > 20 ? 'bg-green-50 text-green-700' : product.stock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                                    }`}>{product.stock} in stock</span>
                            </div>
                            <p className="text-slate-700 leading-relaxed">{product.description}</p>
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-slate-900 mt-10 mb-4">Reviews</h2>
                {product.reviews?.length ? (
                    <div className="space-y-3">
                        {product.reviews.map((r, i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center">
                                            {r.reviewerName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-800">{r.reviewerName}</p>
                                            <p className="text-xs text-slate-400">{new Date(r.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <Stars value={r.rating} size="sm" showNumber />
                                </div>
                                <p className="text-slate-600 text-sm mt-3">{r.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-slate-500">No reviews yet.</p>}
            </main>
        </AuthGuard>
    );
}