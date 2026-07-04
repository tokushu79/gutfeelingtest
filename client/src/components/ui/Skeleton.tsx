import clsx from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("skeleton", className)} />;
}

export function SubjectCardSkeleton() {
  return (
    <div className="glass-panel rounded-2xl p-6">
      <Skeleton className="mb-4 h-10 w-10 rounded-xl" />
      <Skeleton className="mb-2 h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="mt-1 h-4 w-4/5" />
    </div>
  );
}

export function QuestionSkeleton() {
  return (
    <div className="glass-panel rounded-2xl p-8">
      <Skeleton className="mb-6 h-6 w-3/4" />
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="grid gap-4 border-b border-white/5 px-4 py-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}
