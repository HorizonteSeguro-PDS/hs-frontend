import { useState } from 'preact/hooks';
import { SlidersHorizontal, ArrowUpDown, UserPlus, Search } from 'lucide-preact';
import { PersonCard, type Person } from './shared/components/person-card';

const MOCK_PEOPLE: Person[] = [
  { id: '1', name: 'Ana Silva', age: 28 },
  { id: '2', name: 'Carlos Santos', age: 35 },
  { id: '3', name: 'João Pedro', age: 31 },
  { id: '4', name: 'Maria Oliveira', age: 42 },
  { id: '5', name: 'Marcos Santos', age: 42 },
  { id: '6', name: 'Maria Paula', age: 42 },
  { id: '7', name: 'João Oliveira', age: 42 },
  { id: '8', name: 'Clauderlan Batista', age: 42 },
];

interface PessoasProps {
  shelterName?: string;
}

export const Pessoas = ({ shelterName = 'Abrigo' }: PessoasProps) => {
  const [search, setSearch] = useState('');

  const filtered = MOCK_PEOPLE.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center gap-4">
        <h1 className="text-[#0a0a0a] text-3xl font-bold leading-9 shrink-0">
          Pessoas no Abrigo "{shelterName}"
        </h1>
        <div className="flex items-center gap-2 border border-black/10 rounded-lg px-3 py-2 bg-white flex-1">
          <Search size={14} className="text-[#717182] shrink-0" />
          <input
            type="text"
            placeholder="Buscar pessoa..."
            value={search}
            onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
            className="flex-1 text-sm bg-transparent outline-none text-[#0a0a0a] placeholder:text-[#717182]"
          />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-2 bg-[#eceef2] rounded-lg h-9 px-3 text-[#030213] text-sm font-medium hover:bg-[#e0e2e8] transition-colors cursor-pointer">
            <SlidersHorizontal size={16} />
            Filtrar
          </button>
          <button className="flex items-center gap-2 bg-[#eceef2] rounded-lg h-9 px-3 text-[#030213] text-sm font-medium hover:bg-[#e0e2e8] transition-colors cursor-pointer">
            <ArrowUpDown size={16} />
            Ordenar
          </button>
          <button className="flex items-center gap-2 bg-[#030213] rounded-lg h-9 px-3 text-white text-sm font-medium hover:bg-[#1a1a2e] transition-colors cursor-pointer">
            <UserPlus size={16} />
            Registrar Entrada
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mt-6">
        {filtered.length === 0 ? (
          <p className="text-sm text-[#717182]">Nenhuma pessoa encontrada.</p>
        ) : (
          filtered.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              onRegisterExit={(id) => console.log('Registrar saída:', id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
