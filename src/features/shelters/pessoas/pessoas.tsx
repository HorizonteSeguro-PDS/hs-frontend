import { useState, useMemo } from 'preact/hooks';
import { useAuth } from '@/shared/contexts/useAuthContext';
import { SlidersHorizontal, ArrowUpDown, UserPlus, Search } from 'lucide-preact';
import { PersonCard, type Person } from './shared/components/person-card';
import RegisterPersonModal from '../components/people/RegisterPersonModal';
import ConfirmPersonExitModal from '../components/people/ConfirmPersonExitModal';
import type { ApiPerson } from '../api';

function toPerson(p: ApiPerson, index: number): Person {
  return { id: p.cpf || String(index), name: p.name, age: p.age };
}

interface PessoasProps {
  shelterName?: string;
  shelterId?: string;
  people?: ApiPerson[];
}

const ALLOWED_ROLES = ['shelter_manager', 'crisis_manager', 'dev']

export const Pessoas = ({ shelterName = 'Abrigo', shelterId = '', people = [] }: PessoasProps) => {
  const { user } = useAuth()
  const canManage = user.value?.role?.some((r) => ALLOWED_ROLES.includes(r)) ?? false
  const [search, setSearch] = useState('');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [exitTarget, setExitTarget] = useState<Person | null>(null);

  const allPeople = useMemo(() => people.map(toPerson), [people]);

  const filtered = allPeople.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full h-full px-4 sm:px-6 pt-4 pb-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-[#0a0a0a] text-base sm:text-lg font-bold leading-6 shrink-0">
          Pessoas no Abrigo "{shelterName}"
        </h1>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex items-center gap-2 border border-black/10 rounded-lg px-2.5 py-1.5 bg-white">
            <Search size={13} className="text-[#717182] shrink-0" />
            <input
              type="text"
              placeholder="Buscar pessoa..."
              value={search}
              onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
              className="flex-1 text-xs bg-transparent outline-none text-[#0a0a0a] placeholder:text-[#717182]"
            />
          </div>
          <button className="flex items-center gap-1.5 bg-white border border-black/10 rounded-lg h-8 px-2.5 text-[#030213] text-xs font-medium hover:bg-[#f3f4f6] transition-colors cursor-pointer">
            <SlidersHorizontal size={14} />
            Filtrar
          </button>
          <button className="flex items-center gap-1.5 bg-white border border-black/10 rounded-lg h-8 px-2.5 text-[#030213] text-xs font-medium hover:bg-[#f3f4f6] transition-colors cursor-pointer">
            <ArrowUpDown size={14} />
            Ordenar
          </button>
          {canManage && (
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="flex items-center gap-1.5 bg-[#030213] rounded-lg h-8 px-2.5 text-white text-xs font-medium hover:bg-[#1a1a2e] transition-colors cursor-pointer"
            >
              <UserPlus size={14} />
              Registrar Entrada
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 mt-5">
        {filtered.length === 0 ? (
          <p className="text-sm text-[#717182] col-span-full">Nenhuma pessoa encontrada.</p>
        ) : (
          filtered.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              onRegisterExit={canManage ? (id) => {
                const target = allPeople.find((p) => p.id === id) ?? null;
                setExitTarget(target);
              } : undefined}
            />
          ))
        )}
      </div>

      <RegisterPersonModal
        open={isRegisterOpen}
        shelterId={shelterId}
        onClose={() => setIsRegisterOpen(false)}
      />

      <ConfirmPersonExitModal
        open={exitTarget !== null}
        shelterId={shelterId}
        personName={exitTarget?.name ?? ''}
        personCpf={exitTarget?.id ?? ''}
        onClose={() => setExitTarget(null)}
      />
    </div>
  );
};
