import { Link } from 'react-router-dom';

const FALLBACK = 'https://dummyjson.com/icon.png';

export default function ProductCards({ products, onDelete }) {
    return (
        <div className="md:hidden grid grid-cols-1 gap-4">
            {products.map((p) => (
                <div key={p.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
                    <img
                        src={p.thumbnail || FALLBACK}
                        alt={p.title}
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK; }}
                        className="w-full h-40 object-cover rounded-xl mb-3 bg-slate-50"
                    />
                    <h3 className="font-semibold text-slate-900">
                        <Link to={`/products/${p.id}`} className="hover:text-blue-600 transition">{p.title}</Link>
                    </h3>
                    <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 capitalize">{p.category}</span>
                    <div className="flex items-center justify-between mt-3 text-sm">
                        <span className="font-semibold text-slate-800">₹{p.price}</span>
                        <span className="text-slate-600">⭐ {p.rating}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.stock > 20 ? 'bg-green-50 text-green-700' : p.stock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                            }`}>{p.stock} in stock</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Link to={`/products/${p.id}/edit`} className="flex-1 text-center text-sm font-medium py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-700 transition">Edit</Link>
                        <button onClick={() => onDelete(p)} className="flex-1 text-sm font-medium py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition">Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
}