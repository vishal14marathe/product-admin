import api from '../lib/axios.js';

export async function getProducts({ limit, skip, search, category }) {
    if (search) {
        const res = await api.get('/products/search', {
            params: { q: search, limit, skip },
        });
        return res.data;
    }
    if (category) {
        const res = await api.get(`/products/category/${encodeURIComponent(category)}`, {
            params: { limit, skip },
        });
        return res.data;
    }
    const res = await api.get('/products', { params: { limit, skip } });
    return res.data;
}

export async function getProductById(id) {
    const res = await api.get(`/products/${id}`);
    return res.data;
}

export async function getCategories() {
    const res = await api.get('/products/categories');
    return res.data.map((c) => (typeof c === 'string' ? c : c.slug || c.name));
}

export function sortProducts(products, sortBy, order) {
    if (!sortBy) return products;
    const sorted = [...products].sort((a, b) => {
        const av = a[sortBy];
        const bv = b[sortBy];
        if (typeof av === 'string') return av.localeCompare(bv);
        return av - bv;
    });
    return order === 'desc' ? sorted.reverse() : sorted;
}