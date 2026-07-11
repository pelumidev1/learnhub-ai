export function Divider({ label = "or" }: { label?: string }) {
  return (
    <div className="my-5 flex items-center gap-3 text-xs font-medium text-muted-2">
      <span className="h-px flex-1 bg-silver" />
      {label}
      <span className="h-px flex-1 bg-silver" />
    </div>
  );
}
