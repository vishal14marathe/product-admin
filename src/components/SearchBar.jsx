import { useEffect, useState } from 'react';
import useDebounce from '../hooks/useDebounce.js';

export default function SearchBar({ value, onChange }) {
    const [local, setLocal] = useState(value || '');
    const debounced = useDebounce(local, 500);

    useEffect(() => setLocal(value || ''), [value]);

    useEffect(() => {
        if (debounced !== value) onChange(debounced);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced]);

    const clear = () => {
        setLocal('');
        onChange('');
    };

    return (
        <div className="relative w-full md:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </span>
            <input
                type="text"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-9 pr-9 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none"
            />
            {local && (
                <button
                    type="button"
                    onClick={clear}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 flex items-center justify-center transition"
                >
                    ✕
                </button>
            )}
        </div>
    );
}