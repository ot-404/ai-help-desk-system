export default function EmptyState({ icon: Icon, title, body }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line py-16 text-center">
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-surface2 text-faint">
          <Icon size={24} />
        </div>
      )}
      <p className="text-sm font-medium text-ink">{title}</p>
      {body && <p className="mt-1 max-w-xs text-sm text-muted">{body}</p>}
    </div>
  );
}
