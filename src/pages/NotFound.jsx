import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
            <h1 className="text-4xl font-bold text-slate-900">404</h1>
            <p className="text-slate-600">The page you're looking for doesn't exist.</p>
            <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition">
                Back to products
            </Link>
        </div>
    );
}