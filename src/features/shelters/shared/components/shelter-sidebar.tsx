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
    <aside className="bg-white border border-black/10 rounded-2xl shadow-sm w-full lg:w-[240px] lg:shrink-0 flex flex-col max-h-[70vh] lg:max-h-none">
      <div className="border-b border-black/10 px-4 py-3">
        <Link
          href="/crises"
          className="flex items-center gap-1 text-xs text-[#717182] hover:text-[#0a0a0a] transition-colors mb-1.5 w-fit"
        >
          <ChevronLeft size={14} />
          Voltar para crises
        </Link>
        <p className="text-xs text-[#717182]">
          {'Crise: '}
          <strong className="font-bold">{crisisName}</strong>
        </p>
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="border-b border-black/10 px-4 py-2.5">
          <p className="text-xs font-semibold text-[#0a0a0a] mb-2">Abrigos</p>
          <div className="flex items-center gap-2 border border-black/10 rounded-lg px-2.5 py-1.5 bg-[#fafafa]">
            <Search size={13} className="text-[#717182] shrink-0" />
            <input
              type="text"
              placeholder="Buscar abrigo..."
              value={search}
              onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
              className="flex-1 text-xs bg-transparent outline-none text-[#0a0a0a] placeholder:text-[#717182]"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-xs text-[#717182] px-4 py-3">Nenhum abrigo encontrado.</p>
          ) : (
            filtered.map((shelter) => {
              const isSelected = shelter.id === selectedShelterId;
              const { bg, text } = statusStyles[shelter.status];
              return (
                <button
                  key={shelter.id}
                  onClick={() => onShelterSelect(shelter.id)}
                  className={`w-full flex items-start gap-2 px-4 py-2.5 border-b border-black/5 text-left transition-colors ${isSelected ? 'bg-gray-200' : 'hover:bg-gray-50 cursor-pointer'}`}
                >
                  <span
                    className={`flex-1 text-xs leading-[16px] text-[#0a0a0a] ${isSelected ? 'font-bold' : 'font-normal'}`}
                  >
                    {shelter.name}
                  </span>
                  <span
                    className={`rounded-[10px] px-1.5 py-0.5 text-[10px] font-semibold shrink-0 ${bg} ${text}`}
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
