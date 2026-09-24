import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
    const { logout } = useAuth();
    return (
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link to="/products" className="font-semibold text-slate-900 hover:text-blue-600 transition">
                        🛍️ Product Admin
                    </Link>
                    <Link to="/products/new" className="text-sm text-slate-600 hover:text-blue-600 transition">
                        + Add Product
                    </Link>
                </div>
                <button
                    onClick={logout}
                    className="text-sm px-3 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition font-medium"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}