import { useState, useMemo } from 'preact/hooks';
import { Search, SlidersHorizontal, ArrowUpDown, List, Map, Building2 } from 'lucide-preact';
import type { RouteComponentProps } from 'wouter-preact';
import { useShelters } from './hooks';
import { ShelterCard, getShelterStatus } from './components/shelter-card';
import { ShelterFilterModal, type ShelterFilterConfig } from './components/shelter-filter-modal';
import { ShelterSortModal, type ShelterSortConfig } from './components/shelter-sort-modal';
import CrisisMap from './mapas/CrisisMap';
import { Navbar } from '@/shared/components/navbar/navbar';
import { CrisisSidebar } from './components/crisis-sidebar';
import RegisterShelterModal from './components/RegisterShelterModal';

type TabId = 'lista' | 'mapa';

const SORT_LABELS: Record<ShelterSortConfig['field'], string> = {
  severity:  'Severidade',
  occupancy: 'Ocupação',
  name:      'Nome',
};

export function CrisisOverview({ params }: RouteComponentProps<{ id: string }>) {
  const crisisId = params.id;
  const { data, isPending, isError } = useShelters(crisisId);

  const [search, setSearch]             = useState('');
  const [activeTab, setActiveTab]       = useState<TabId>('lista');
  const [isFilterOpen, setIsFilterOpen]       = useState(false);
  const [isSortOpen, setIsSortOpen]           = useState(false);
  const [isRegisterOpen, setIsRegisterOpen]   = useState(false);
  const [filterConfig, setFilterConfig] = useState<ShelterFilterConfig>({ status: 'todos' });
  const [sortConfig, setSortConfig]     = useState<ShelterSortConfig>({ field: 'severity', direction: 'desc' });

  const processedShelters = useMemo(() => {
    if (!data?.shelters) return [];

    const filtered = data.shelters.filter((shelter) => {
      const query = search.toLowerCase();
      const matchesSearch =
        shelter.name.toLowerCase().includes(query) ||
        shelter.address.toLowerCase().includes(query) ||
        shelter.city.toLowerCase().includes(query);
      const shelterStatus = getShelterStatus(shelter.severity);
      const matchesFilter =
        filterConfig.status === 'todos' || shelterStatus === filterConfig.status;
      return matchesSearch && matchesFilter;
    });

    return [...filtered].sort((a, b) => {
      const mult = sortConfig.direction === 'asc' ? 1 : -1;
      if (sortConfig.field === 'name')
        return mult * a.name.localeCompare(b.name, 'pt-BR');
      if (sortConfig.field === 'occupancy') {
        const rateA = a.capacity > 0 ? a.current_occupancy / a.capacity : 0;
        const rateB = b.capacity > 0 ? b.current_occupancy / b.capacity : 0;
        return mult * (rateA - rateB);
      }
      return mult * (a.severity - b.severity);
    });
  }, [data, search, filterConfig, sortConfig]);

  const hasActiveFilter = filterConfig.status !== 'todos';

  const peopleCount = useMemo(
    () => (data?.shelters ?? []).reduce((sum, s) => sum + s.current_occupancy, 0),
    [data?.shelters],
  );

  if (isPending) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center">
        <span className="loading loading-spinner text-primary" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center rounded-xl bg-red-50 text-red-500 border border-red-200">
        Erro ao carregar os abrigos.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <Navbar />
      <main className="flex flex-1 gap-6 p-4 sm:p-6 items-start">

        <CrisisSidebar crisis={data} people_count={peopleCount} />

        <div className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-[#0a0a0a] text-2xl font-bold leading-tight">Abrigos</h1>
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="flex items-center gap-2 h-9 px-4 rounded-[10px] text-sm font-medium text-white shrink-0 cursor-pointer transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(3deg, #1FA6A0 0%, #2F7DBB 58%, #3555A3 99%)' }}
            >
              <Building2 size={16} />
              Cadastrar
            </button>
          </div>

          {/* Barra de pesquisa + botões de filtro/ordenação */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 border border-[#d1d5dc] rounded-[10px] px-3 py-2.5 bg-white shadow-sm">
              <Search size={16} className="text-[#717182] shrink-0" />
              <input
                type="text"
                placeholder="Buscar abrigos..."
                value={search}
                onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
                className="flex-1 text-sm text-[#0a0a0a] placeholder-[rgba(10,10,10,0.4)] outline-none bg-transparent"
              />
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setIsFilterOpen(true)}
                className={`flex items-center gap-2 rounded-lg h-10 px-3.5 text-sm font-medium transition-colors cursor-pointer ${
                  hasActiveFilter
                    ? 'bg-[#ecfdf5] text-[#1fa6a0] border border-[#1fa6a0]'
                    : 'bg-[#ececf0] text-[#030213] hover:bg-[#e0e2e8]'
                }`}
              >
                <SlidersHorizontal size={16} />
                Filtrar
                {hasActiveFilter && <span className="size-2 rounded-full bg-[#1fa6a0]" />}
              </button>

              <button
                onClick={() => setIsSortOpen(true)}
                className="flex items-center gap-2 bg-[#ececf0] rounded-lg h-10 px-3.5 text-[#030213] text-sm font-medium hover:bg-[#e0e2e8] transition-colors cursor-pointer"
              >
                <ArrowUpDown size={16} />
                {SORT_LABELS[sortConfig.field]}
              </button>
            </div>
          </div>

          {/* Menu de abas Lista / Mapa */}
          <div className="flex items-center gap-1 bg-[#ececf0] rounded-xl p-1 w-fit">
            {([
              { id: 'lista' as const, label: 'Lista', Icon: List },
              { id: 'mapa'  as const, label: 'Mapa',  Icon: Map  },
            ]).map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === id
                    ? 'bg-white text-[#0a0a0a] shadow-sm'
                    : 'text-[#717182] hover:text-[#0a0a0a]'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* Corpo */}
          {activeTab === 'lista' ? (
            processedShelters.length === 0 ? (
              <p className="text-[#717182] text-sm py-12 text-center">
                Nenhum abrigo encontrado.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {processedShelters.map((shelter) => (
                  <ShelterCard
                    key={shelter.id}
                    {...shelter}
                    onDetails={(id) => console.log('Ver detalhes:', id)}
                  />
                ))}
              </div>
            )
          ) : (
            <CrisisMap crisisId={crisisId} />
          )}
        </div>
      </main>

      <RegisterShelterModal
        open={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSubmit={(data) => console.log('Cadastro de abrigo:', data)}
      />

      <ShelterFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        currentConfig={filterConfig}
        onApply={setFilterConfig}
      />

      <ShelterSortModal
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        currentConfig={sortConfig}
        onApply={setSortConfig}
      />
    </div>
  );
}
