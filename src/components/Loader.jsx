export default function Loader({ label = 'Loading…', center = false }) {
    const wrapper = center
        ? 'min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center gap-2 text-slate-500'
        : 'flex flex-col items-center justify-center gap-2 py-16 text-slate-500';

    return (
        <div className={wrapper}>
            <span className="inline-block w-7 h-7 border-[3px] border-slate-200 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-xs font-medium tracking-wide uppercase text-slate-400">{label}</span>
        </div>
    );
}