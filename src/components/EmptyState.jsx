export default function EmptyState({ message = 'Nothing found' }) {
    return (
        <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-2xl">
            <div className="text-4xl mb-3">🔎</div>
            <p className="text-slate-600 font-medium">{message}</p>
            <p className="text-sm text-slate-400 mt-1">Try changing the filters or search term</p>
        </div>
    );
}