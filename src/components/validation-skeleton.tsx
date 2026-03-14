export function ValidationSkeleton() {
  return (
    <div className="grid gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="animate-pulse rounded-3xl border border-border bg-card p-6"
        >
          <div className="h-4 w-40 rounded-full bg-muted" />
          <div className="mt-4 space-y-2">
            <div className="h-3 w-full rounded-full bg-muted" />
            <div className="h-3 w-5/6 rounded-full bg-muted" />
            <div className="h-3 w-2/3 rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
