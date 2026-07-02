import { memo } from 'react'

function SearchBarComponent({ value, onChange, resultCount }) {
  return (
    <div className="flex flex-col gap-3 rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-1">
        <p className="text-sm font-medium text-[color:var(--heading)]">Search switches</p>
        <p className="text-sm text-[color:var(--muted)]">Find devices by model name or ID.</p>
      </div>

      <div className="flex w-full flex-col gap-3 lg:max-w-2xl lg:flex-row lg:items-center">
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Type model name or switch ID"
          className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--input-bg)] px-4 py-3 text-sm text-[color:var(--heading)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent-border)] focus:ring-4 focus:ring-[color:var(--accent-soft)]"
        />

        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-4 py-3 text-sm text-[color:var(--muted)] lg:min-w-56">
          <span className="font-semibold text-[color:var(--heading)]">{resultCount}</span> visible device{resultCount === 1 ? '' : 's'}
        </div>
      </div>
    </div>
  )
}

export const SearchBar = memo(SearchBarComponent)