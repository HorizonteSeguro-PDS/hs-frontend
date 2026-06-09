import { useState, useMemo } from 'preact/hooks';
import { useAuth } from '@/shared/contexts/useAuthContext';
import { SlidersHorizontal, ArrowUpDown, UserPlus, Search, X } from 'lucide-preact';
import { PersonCard, type Person } from './shared/components/person-card';
import RegisterPersonModal from '../components/people/RegisterPersonModal';
import ConfirmPersonExitModal from '../components/people/ConfirmPersonExitModal';
import type { ApiPerson } from '../api';

function toPerson(p: ApiPerson, index: number): Person {
  return { id: p.cpf || String(index), name: p.name, age: p.age, vulnerabilities: p.vulnerabilities };
}

interface PessoasProps {
  shelterName?: string;
  shelterId?: string;
  people?: ApiPerson[];
}

const ALLOWED_ROLES = ['shelter_manager', 'crisis_manager', 'dev']

type SortOption = 'name-asc' | 'name-desc' | 'age-asc' | 'age-desc'

const SORT_LABELS: Record<SortOption, string> = {
  'name-asc': 'Nome (A-Z)',
  'name-desc': 'Nome (Z-A)',
  'age-asc': 'Idade (menor)',
  'age-desc': 'Idade (maior)',
}

const VULNERABILITY_LABELS: Record<string, string> = {
  child: 'Criança',
  elderly: 'Idoso(a)',
  pregnant: 'Gestante',
  disabled: 'Def. física',
  chronic_illness: 'Doença crônica',
  other: 'Outra',
  none: 'Nenhuma',
}

export const Pessoas = ({ shelterName = 'Abrigo', shelterId = '', people = [] }: PessoasProps) => {
  const { user } = useAuth()
  const canManage = user.value?.role?.some((r) => ALLOWED_ROLES.includes(r)) ?? false
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('name-asc');
  const [filterVulnerability, setFilterVulnerability] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [exitTarget, setExitTarget] = useState<Person | null>(null);

  const allPeople = useMemo(() => people.map(toPerson), [people]);

  const vulnerabilityOptions = useMemo(() => {
    const seen = new Set<string>()
    allPeople.forEach((p) => { if (p.vulnerabilities) seen.add(p.vulnerabilities) })
    return Array.from(seen)
  }, [allPeople])

  const filtered = useMemo(() => {
    let result = allPeople.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    if (filterVulnerability) {
      result = result.filter((p) => p.vulnerabilities === filterVulnerability)
    }
    return result.sort((a, b) => {
      if (sort === 'name-asc') return a.name.localeCompare(b.name)
      if (sort === 'name-desc') return b.name.localeCompare(a.name)
      if (sort === 'age-asc') return (a.age ?? 0) - (b.age ?? 0)
      if (sort === 'age-desc') return (b.age ?? 0) - (a.age ?? 0)
      return 0
    })
  }, [allPeople, search, sort, filterVulnerability])

  return (
    <div className="flex flex-col w-full h-full px-4 sm:px-6 pt-4 pb-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-[#0a0a0a] text-base sm:text-lg font-bold leading-6 shrink-0">
          Pessoas no Abrigo "{shelterName}"
        </h1>
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="flex items-center gap-2 border border-black/10 rounded-lg px-2.5 py-1.5 bg-white flex-1 min-w-[140px]">
            <Search size={13} className="text-[#717182] shrink-0" />
            <input
              type="text"
              placeholder="Buscar pessoa..."
              value={search}
              onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
              className="flex-1 min-w-0 text-xs bg-transparent outline-none text-[#0a0a0a] placeholder:text-[#717182]"
            />
          </div>

          {/* Filtrar */}
          <div className="relative">
            <button
              onClick={() => { setShowFilterMenu((v) => !v); setShowSortMenu(false) }}
              className={`flex items-center gap-1.5 border rounded-lg h-8 px-2.5 text-xs font-medium transition-colors cursor-pointer ${
                filterVulnerability
                  ? 'bg-[#e0f2fe] border-[#1FA6A0] text-[#1FA6A0]'
                  : 'bg-white border-black/10 text-[#030213] hover:bg-[#f3f4f6]'
              }`}
            >
              <SlidersHorizontal size={14} />
              Filtrar
              {filterVulnerability && (
                <span
                  role="button"
                  onClick={(e) => { e.stopPropagation(); setFilterVulnerability('') }}
                  className="ml-0.5 hover:text-[#e7000b]"
                >
                  <X size={11} />
                </span>
              )}
            </button>
            {showFilterMenu && (
              <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-black/10 bg-white shadow-lg overflow-hidden max-w-[calc(100vw-2rem)]">
                <p className="px-3 py-2 text-xs font-semibold text-[#717182] uppercase tracking-wide">Vulnerabilidade</p>
                {vulnerabilityOptions.length === 0 ? (
                  <p className="px-3 py-2 text-xs text-[#717182]">Sem dados disponíveis</p>
                ) : (
                  vulnerabilityOptions.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => { setFilterVulnerability(filterVulnerability === v ? '' : v); setShowFilterMenu(false) }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-[#f3f4f6] transition-colors ${filterVulnerability === v ? 'font-semibold text-[#1FA6A0]' : 'text-[#0a0a0a]'}`}
                    >
                      {VULNERABILITY_LABELS[v] ?? v}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Ordenar */}
          <div className="relative">
            <button
              onClick={() => { setShowSortMenu((v) => !v); setShowFilterMenu(false) }}
              className="flex items-center gap-1.5 bg-white border border-black/10 rounded-lg h-8 px-2.5 text-[#030213] text-xs font-medium hover:bg-[#f3f4f6] transition-colors cursor-pointer"
            >
              <ArrowUpDown size={14} />
              {SORT_LABELS[sort]}
            </button>
            {showSortMenu && (
              <div className="absolute right-0 top-10 z-20 w-44 rounded-xl border border-black/10 bg-white shadow-lg overflow-hidden max-w-[calc(100vw-2rem)]">
                {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => { setSort(value); setShowSortMenu(false) }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-[#f3f4f6] transition-colors ${sort === value ? 'font-semibold text-[#1FA6A0]' : 'text-[#0a0a0a]'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {canManage && (
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="flex items-center gap-1.5 bg-[#030213] rounded-lg h-8 px-2.5 text-white text-xs font-medium hover:bg-[#1a1a2e] transition-colors cursor-pointer shrink-0 ml-auto lg:ml-0"
            >
              <UserPlus size={14} />
              Registrar Entrada
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 mt-5">
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
