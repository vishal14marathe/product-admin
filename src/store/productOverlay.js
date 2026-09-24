const KEY = 'product_overlay_v1';

function read() {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : { added: [], edited: {}, deleted: [] };
    } catch {
        return { added: [], edited: {}, deleted: [] };
    }
}

function write(data) {
    try {
        localStorage.setItem(KEY, JSON.stringify(data));
    } catch (err) {
        console.warn('[overlay] storage write failed, trimming:', err?.message);
        data.added = (data.added || []).slice(0, 5);
        try {
            localStorage.setItem(KEY, JSON.stringify(data));
        } catch {
            // give up silently
        }
    }
}

export function getOverlay() {
    return read();
}

export function applyOverlay(products) {
    const { added, edited, deleted } = read();
    const deletedSet = new Set(deleted);

    const merged = products
        .filter((p) => !deletedSet.has(p.id))
        .map((p) => (edited[p.id] ? { ...p, ...edited[p.id] } : p));

    return [...added.filter((p) => !deletedSet.has(p.id)), ...merged];
}

export function addProduct(product) {
    const data = read();
    data.added.unshift({ ...product, id: Date.now() });
    write(data);
}

export function editProduct(id, updates) {
    const data = read();
    const addedIndex = data.added.findIndex((p) => p.id === id);
    if (addedIndex >= 0) {
        data.added[addedIndex] = { ...data.added[addedIndex], ...updates };
    } else {
        data.edited[id] = { ...(data.edited[id] || {}), ...updates };
    }
    write(data);
}

export function deleteProduct(id) {
    const data = read();
    data.added = data.added.filter((p) => p.id !== id);
    if (!data.deleted.includes(id)) data.deleted.push(id);
    write(data);
}

export function getMergedProduct(apiProduct) {
    const { edited, deleted } = read();
    if (deleted.includes(apiProduct.id)) return null;
    if (edited[apiProduct.id]) return { ...apiProduct, ...edited[apiProduct.id] };
    return apiProduct;
}