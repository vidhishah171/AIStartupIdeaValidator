export function Footer() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex w-full max-w-none flex-col items-start justify-between gap-4 px-6 md:flex-row md:items-center">
        <div>
          <p className="text-base font-medium">
            AI Startup Idea Validator
          </p>
          <p className="text-sm text-muted-foreground">
            Validate faster. Build smarter.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Built for founders who move fast.
        </p>
      </div>
    </footer>
  );
}
