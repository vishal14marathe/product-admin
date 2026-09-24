export default function ErrorState({ message, onRetry }) {
    return (
        <div className="text-center py-16 bg-red-50 border border-red-200 rounded-2xl">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-red-700 font-medium mb-4">{message || 'Something went wrong'}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                >
                    Retry
                </button>
            )}
        </div>
    );
}