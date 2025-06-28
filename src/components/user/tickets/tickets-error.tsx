export function TicketsError({ error, onClear }: { error: string | null; onClear: () => void }) {
  if (!error) return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-red-600">{error}</p>
        <button onClick={onClear} className="text-red-400 hover:text-red-600">
          ✕
        </button>
      </div>
    </div>
  );
}
