import { Link } from 'react-router-dom';

const FALLBACK = 'https://dummyjson.com/icon.png';

export default function ProductTable({ products, onDelete }) {
    return (
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider">
                    <tr>
                        <th className="p-4 font-medium">Image</th>
                        <th className="p-4 font-medium">Title</th>
                        <th className="p-4 font-medium">Category</th>
                        <th className="p-4 font-medium">Price</th>
                        <th className="p-4 font-medium">Rating</th>
                        <th className="p-4 font-medium">Stock</th>
                        <th className="p-4 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50 transition">
                            <td className="p-4">
                                <img
                                    src={p.thumbnail || FALLBACK}
                                    alt={p.title}
                                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK; }}
                                    className="w-12 h-12 object-cover rounded-lg border border-slate-200 bg-slate-50"
                                />
                            </td>
                            <td className="p-4">
                                <Link to={`/products/${p.id}`} className="font-medium text-slate-900 hover:text-blue-600 transition">{p.title}</Link>
                            </td>
                            <td className="p-4">
                                <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 capitalize">{p.category}</span>
                            </td>
                            <td className="p-4 font-semibold text-slate-800">₹{p.price}</td>
                            <td className="p-4 text-slate-700">⭐ {p.rating}</td>
                            <td className="p-4">
                                <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${p.stock > 20 ? 'bg-green-50 text-green-700' : p.stock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                                    }`}>{p.stock} in stock</span>
                            </td>
                            <td className="p-4">
                                <div className="flex gap-2">
                                    <Link to={`/products/${p.id}/edit`} className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-700 transition">Edit</Link>
                                    <button onClick={() => onDelete(p)} className="text-xs font-medium px-2.5 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition">Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}