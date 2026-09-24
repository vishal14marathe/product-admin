import { useEffect, useState } from 'react';
import { getCategories } from '../services/productService.js';

const EMPTY = { title: '', price: '', category: '', description: '', stock: '', rating: '', thumbnail: '' };

const inputClass = 'w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none disabled:bg-slate-100 disabled:text-slate-400';
const labelClass = 'block text-sm font-medium text-slate-700 mb-1';
const errorClass = 'text-red-600 text-xs mt-1';

export default function ProductForm({ initialValues, onSubmit, submitting, submitLabel = 'Save' }) {
    const [form, setForm] = useState({ ...EMPTY, ...initialValues });
    const [errors, setErrors] = useState({});
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [imageError, setImageError] = useState('');

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch(() => setCategories([]))
            .finally(() => setLoadingCategories(false));
    }, []);

    const validate = () => {
        const errs = {};
        if (!form.title.trim()) errs.title = 'Title is required';
        if (!form.price || Number(form.price) <= 0) errs.price = 'Price must be greater than 0';
        if (!form.category) errs.category = 'Category is required';
        if (form.stock && Number(form.stock) < 0) errs.stock = 'Stock cannot be negative';
        setErrors(errs);
        return Object.keys(errs).length === 0 && !imageError;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageError('');
        if (!file.type.startsWith('image/')) {
            setImageError('Please select an image file');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setImageError('Image must be smaller than 2 MB');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => setForm((f) => ({ ...f, thumbnail: reader.result }));
        reader.onerror = () => setImageError('Failed to read the image');
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setForm((f) => ({ ...f, thumbnail: '' }));
        setImageError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        if (!validate()) return;
        await onSubmit({
            ...form,
            price: Number(form.price),
            stock: Number(form.stock) || 0,
            rating: Number(form.rating) || 0,
        });
    };

    const categoryOptions = form.category && !categories.includes(form.category)
        ? [form.category, ...categories]
        : categories;

    return (
        <form onSubmit={handleSubmit} className="space-y-5 max-w-xl bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div>
                <label className={labelClass}>Product Image</label>
                {form.thumbnail ? (
                    <div className="relative inline-block">
                        <img src={form.thumbnail} alt="Preview" className="w-40 h-40 object-cover rounded-xl border border-slate-200" />
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-700 transition"
                            aria-label="Remove image"
                        >✕</button>
                    </div>
                ) : (
                    <label htmlFor="product-image" className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition text-slate-500">
                        <span className="text-3xl mb-1">📷</span>
                        <span className="text-xs font-medium">Upload image</span>
                        <span className="text-[10px] text-slate-400">PNG, JPG · max 2MB</span>
                        <input id="product-image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                )}
                {imageError && <p className={errorClass}>{imageError}</p>}
            </div>

            <div>
                <label className={labelClass}>Title</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Essence Mascara" className={inputClass} />
                {errors.title && <p className={errorClass}>{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Price</label>
                    <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="0.00" className={inputClass} />
                    {errors.price && <p className={errorClass}>{errors.price}</p>}
                </div>
                <div>
                    <label className={labelClass}>Stock</label>
                    <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="0" className={inputClass} />
                    {errors.stock && <p className={errorClass}>{errors.stock}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Category</label>
                    <select name="category" value={form.category} onChange={handleChange} disabled={loadingCategories} className={inputClass}>
                        <option value="">{loadingCategories ? 'Loading categories…' : 'Select a category'}</option>
                        {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    {errors.category && <p className={errorClass}>{errors.category}</p>}
                </div>
                <div>
                    <label className={labelClass}>Rating (0–5)</label>
                    <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} placeholder="4.5" className={inputClass} />
                </div>
            </div>

            <div>
                <label className={labelClass}>Description</label>
                <textarea name="description" rows="4" value={form.description} onChange={handleChange} placeholder="Describe the product…" className={`${inputClass} resize-y`} />
            </div>

            <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? 'Saving…' : submitLabel}
            </button>
        </form>
    );
}