export default function TaskCardSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 animate-pulse">
      <div className="flex justify-between items-start gap-2">
        <div className="h-4 bg-slate-800 rounded w-2/3" />
        <div className="h-5 bg-slate-800 rounded-full w-16" />
      </div>
      <div className="h-3 bg-slate-800 rounded w-full" />
      <div className="h-3 bg-slate-800 rounded w-1/2" />
      <div className="flex justify-between mt-2 pt-2 border-t border-slate-800">
        <div className="h-3 bg-slate-800 rounded w-16" />
        <div className="h-3 bg-slate-800 rounded w-16" />
      </div>
    </div>
  );
}
