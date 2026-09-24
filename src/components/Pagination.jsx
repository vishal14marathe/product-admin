export default function Pagination({ total, page, limit, onPageChange, onLimitChange }) {
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = total === 0 ? 0 : (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    const pageNumbers = [];
    const maxButtons = 7;
    let from = Math.max(1, page - 3);
    let to = Math.min(totalPages, from + maxButtons - 1);
    from = Math.max(1, to - maxButtons + 1);
    for (let i = from; i <= to; i++) pageNumbers.push(i);

    const btn = 'min-w-[38px] h-9 px-3 text-sm font-medium rounded-lg border transition disabled:opacity-40 disabled:cursor-not-allowed';
    const ghost = `${btn} bg-white border-slate-200 text-slate-700 hover:bg-slate-50`;
    const active = `${btn} bg-blue-600 border-blue-600 text-white shadow-sm hover:bg-blue-700`;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6">
            <span className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-700">{start}–{end}</span> of{' '}
                <span className="font-semibold text-slate-700">{total}</span>
            </span>

            <div className="flex items-center gap-1.5 flex-wrap">
                <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className={ghost}>← Prev</button>

                {from > 1 && (
                    <>
                        <button onClick={() => onPageChange(1)} className={page === 1 ? active : ghost}>1</button>
                        {from > 2 && <span className="px-1 text-slate-400 select-none">…</span>}
                    </>
                )}

                {pageNumbers.map((n) => (
                    <button key={n} onClick={() => onPageChange(n)} className={n === page ? active : ghost}>{n}</button>
                ))}

                {to < totalPages && (
                    <>
                        {to < totalPages - 1 && <span className="px-1 text-slate-400 select-none">…</span>}
                        <button onClick={() => onPageChange(totalPages)} className={page === totalPages ? active : ghost}>
                            {totalPages}
                        </button>
                    </>
                )}

                <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className={ghost}>Next →</button>
            </div>

            <select
                value={limit}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-700 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
            >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
            </select>
        </div>
    );
}