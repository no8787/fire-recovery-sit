export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
      <p className="text-sm text-slate-400">불러오는 중...</p>
    </div>
  );
}
