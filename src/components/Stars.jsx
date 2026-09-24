export default function Stars({ value = 0, size = 'md', showNumber = false }) {
    const rating = Math.max(0, Math.min(5, Number(value) || 0));
    const rounded = Math.round(rating * 2) / 2;
    const full = Math.floor(rounded);
    const hasHalf = rounded - full >= 0.5;
    const empty = 5 - full - (hasHalf ? 1 : 0);

    const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-base';

    return (
        <span className={`inline-flex items-center gap-1 ${sizeClass} leading-none`} aria-label={`${rating} out of 5 stars`}>
            <span className="inline-flex tracking-tight">
                {Array.from({ length: 5 }).map((_, i) => {
                    const pos = i + 1;
                    if (pos <= full) return <span key={i} className="text-amber-400">★</span>;
                    if (pos === full + 1 && hasHalf) {
                        return (
                            <span key={i} className="relative inline-block text-slate-300">
                                ★
                                <span className="absolute inset-0 overflow-hidden text-amber-400" style={{ width: '50%' }}>★</span>
                            </span>
                        );
                    }
                    return <span key={i} className="text-slate-300">★</span>;
                })}
            </span>
            {showNumber && <span className="text-xs text-slate-500 font-medium">{rating.toFixed(1)}</span>}
        </span>
    );
}   