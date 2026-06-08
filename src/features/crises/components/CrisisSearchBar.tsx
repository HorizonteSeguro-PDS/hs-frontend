interface CrisisSearchBarProps {
  value: string
  onInput: (value: string) => void
}

export default function CrisisSearchBar({ value, onInput }: CrisisSearchBarProps) {
  return (
    <div className="flex items-center gap-2 flex-1 min-w-[180px] border border-black/10 rounded-lg px-3 h-10 bg-white">
      <SearchIcon />
      <input
        type="text"
        placeholder="Buscar crise..."
        value={value}
        onInput={(e) => onInput((e.target as HTMLInputElement).value)}
        className="flex-1 text-sm bg-transparent outline-none text-[#0a0a0a] placeholder:text-[#717182]"
      />
    </div>
  )
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#717182" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="shrink-0">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
