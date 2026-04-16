export function PreviewTitleBlock({ titles }: { titles: string[] }) {
  return (
    <div className="space-y-1 border border-slate-300 bg-emerald-100 p-3 text-center font-semibold text-slate-800">
      {titles.map((title) => (
        <p key={title}>{title}</p>
      ))}
    </div>
  );
}
