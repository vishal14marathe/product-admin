const selectClass =
    'border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition outline-none disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed';

export default function Filters({ categories, category, sortBy, order, search, onChange }) {
    return (
        <div className="flex flex-wrap gap-2 items-center">
            <select
                value={category}
                disabled={!!search}
                onChange={(e) => onChange({ category: e.target.value, page: 1 })}
                className={selectClass}
                title={search ? 'Clear search to filter by category' : 'Filter by category'}
            >
                <option value="">All Categories</option>
                {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>

            <select value={sortBy} onChange={(e) => onChange({ sortBy: e.target.value, page: 1 })} className={selectClass}>
                <option value="">Sort by</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="title">Title</option>
            </select>

            <select value={order} onChange={(e) => onChange({ order: e.target.value, page: 1 })} className={selectClass}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>

            {search && (
                <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full whitespace-nowrap">
                    Clear search to filter by category
                </span>
            )}
        </div>
    );
}