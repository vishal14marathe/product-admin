import { useCallback, useEffect, useRef, useState } from 'react';
import AuthGuard from '../components/AuthGuard.jsx';
import Navbar from '../components/Navbar.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Filters from '../components/Filters.jsx';
import Pagination from '../components/Pagination.jsx';
import ProductTable from '../components/ProductTable.jsx';
import ProductCards from '../components/ProductCards.jsx';
import Loader from '../components/Loader.jsx';
import ErrorState from '../components/ErrorState.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import useUrlState from '../hooks/useUrlState.js';
import { getProducts, getCategories, sortProducts } from '../services/productService.js';
import { applyOverlay, deleteProduct } from '../store/productOverlay.js';

export default function Products() {
    const { searchParams, setParams } = useUrlState();

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limitRaw = parseInt(searchParams.get('limit') || '10', 10);
    const limit = [10, 20, 50].includes(limitRaw) ? limitRaw : 10;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || '';
    const order = searchParams.get('order') || 'asc';

    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [confirm, setConfirm] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const requestIdRef = useRef(0);

    useEffect(() => {
        getCategories().then(setCategories).catch(() => setCategories([]));
    }, []);

    const loadProducts = useCallback(async () => {
        const requestId = ++requestIdRef.current;
        setLoading(true);
        setError('');
        try {
            const skip = (page - 1) * limit;
            const data = await getProducts({ limit, skip, search: search || undefined, category: category || undefined });
            if (requestId !== requestIdRef.current) return;
            const merged = applyOverlay(data.products);
            const sorted = sortProducts(merged, sortBy, order);
            setProducts(sorted);
            setTotal(data.total);
        } catch (err) {
            if (requestId !== requestIdRef.current) return;
            setError(err.message || 'Failed to load products');
        } finally {
            if (requestId === requestIdRef.current) setLoading(false);
        }
    }, [page, limit, search, category, sortBy, order]);

    useEffect(() => { loadProducts(); }, [loadProducts]);

    const handleFilterChange = (updates) => setParams(updates);
    const handlePageChange = (newPage) => setParams({ page: newPage });
    const handleLimitChange = (newLimit) => setParams({ limit: newLimit, page: 1 });
    const handleSearchChange = (q) => setParams({ search: q, page: 1 });

    const handleConfirmDelete = async () => {
        if (!confirm || deleting) return;
        setDeleting(true);
        deleteProduct(confirm.id);
        setConfirm(null);
        setDeleting(false);
        loadProducts();
    };

    return (
        <AuthGuard>
            <Navbar />
            <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-6">Products</h1>

                <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between mb-4">
                    <SearchBar value={search} onChange={handleSearchChange} />
                    <Filters categories={categories} category={category} sortBy={sortBy} order={order} search={search} onChange={handleFilterChange} />
                </div>

                {loading && <Loader center label="Loading products…" />}
                {!loading && error && <ErrorState message={error} onRetry={loadProducts} />}
                {!loading && !error && products.length === 0 && <EmptyState message="No products found" />}

                {!loading && !error && products.length > 0 && (
                    <>
                        <ProductTable products={products} onDelete={setConfirm} />
                        <ProductCards products={products} onDelete={setConfirm} />
                        <Pagination total={total} page={page} limit={limit} onPageChange={handlePageChange} onLimitChange={handleLimitChange} />
                    </>
                )}

                <ConfirmDialog
                    open={!!confirm}
                    title="Delete product"
                    message={`Are you sure you want to delete "${confirm?.title}"?`}
                    onCancel={() => setConfirm(null)}
                    onConfirm={handleConfirmDelete}
                    loading={deleting}
                />
            </main>
        </AuthGuard>
    );
}