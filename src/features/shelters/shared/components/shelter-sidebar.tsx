import { useState } from 'preact/hooks';
import { Link } from 'wouter-preact';
import { ChevronLeft, Search } from 'lucide-preact';

export type ShelterStatus = 'NECESSÁRIO' | 'SUFICIENTE' | 'URGENTE';

export interface ShelterItem {
  id: string;
  name: string;
  status: ShelterStatus;
}

interface ShelterSidebarProps {
  crisisName: string;
  shelters: ShelterItem[];
  selectedShelterId?: string;
  onShelterSelect: (id: string) => void;
}

const statusStyles: Record<ShelterStatus, { bg: string; text: string }> = {
  NECESSÁRIO: { bg: 'bg-[#fff7ed]', text: 'text-[#f54900]' },
  SUFICIENTE: { bg: 'bg-[#ecfdf5]', text: 'text-[#009966]' },
  URGENTE: { bg: 'bg-[#fef2f2]', text: 'text-[#e7000b]' },
};

export const ShelterSidebar = ({
  crisisName,
  shelters,
  selectedShelterId,
  onShelterSelect,
}: ShelterSidebarProps) => {
  const [search, setSearch] = useState('');

  const filtered = shelters.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="bg-white border border-black/10 rounded-2xl shadow-sm w-[324px] shrink-0 flex flex-col">
      <div className="border-b border-black/10 px-5 py-5">
        <Link
          href="/crises"
          className="flex items-center gap-1 text-xs text-[#717182] hover:text-[#0a0a0a] transition-colors mb-2 w-fit"
        >
          <ChevronLeft size={14} />
          Voltar para crises
        </Link>
        <p className="text-sm text-[#717182]">
          {'Crise: '}
          <strong className="font-bold">{crisisName}</strong>
        </p>
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="border-b border-black/10 px-5 py-3">
          <p className="text-sm font-semibold text-[#0a0a0a] mb-3">Abrigos</p>
          <div className="flex items-center gap-2 border border-black/10 rounded-lg px-3 py-2 bg-[#fafafa]">
            <Search size={14} className="text-[#717182] shrink-0" />
            <input
              type="text"
              placeholder="Buscar abrigo..."
              value={search}
              onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
              className="flex-1 text-sm bg-transparent outline-none text-[#0a0a0a] placeholder:text-[#717182]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pl-1.75">
          {filtered.length === 0 ? (
            <p className="text-sm text-[#717182] px-5 py-4">Nenhum abrigo encontrado.</p>
          ) : (
            filtered.map((shelter) => {
              const isSelected = shelter.id === selectedShelterId;
              const { bg, text } = statusStyles[shelter.status];
              return (
                <button
                  key={shelter.id}
                  onClick={() => onShelterSelect(shelter.id)}
                  className={`w-full flex items-start gap-2 px-5 py-3 border-b border-black/5 text-left transition-colors ${isSelected ? 'bg-gray-200' : 'hover:bg-gray-50 cursor-pointer'}`}
                >
                  <span
                    className={`flex-1 text-sm leading-[17.5px] text-[#0a0a0a] ${isSelected ? 'font-bold' : 'font-normal'}`}
                  >
                    {shelter.name}
                  </span>
                  <span
                    className={`rounded-[10px] px-2 py-0.5 text-xs font-semibold shrink-0 ${bg} ${text}`}
                  >
                    {shelter.status}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
};
