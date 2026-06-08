import { useState } from 'preact/hooks';
import { Search } from 'lucide-preact';
import { StatCard } from './shared/components/stat-card';
import { SupplyCard, type SupplyLevel } from './shared/components/supply-card';

const SHELTER_NAME = 'Escola Estadual Ponta Verde';

const STAT_CARDS = [
  { label: 'Ocupação', value: '120/150', valueColor: '#792a2a' },
  { label: 'Ocupação - Relativo', value: '80%', valueColor: '#792a2a' },
  { label: 'Voluntários Ativos', value: '12', valueColor: '#792a2a' },
  { label: 'Severidade / Risco Atual', value: 'NECESSÁRIO', valueColor: '#f54900' },
];

interface Supply {
  id: number;
  name: string;
  quantity: string;
  percentage: number;
  level: SupplyLevel;
}

const MOCK_SUPPLIES: Supply[] = [
  { id: 1, name: 'Água Mineral', quantity: '250 L / 500 L', percentage: 50, level: 'atencao' },
  { id: 2, name: 'Kits de Higiene', quantity: '45 un / 120 un', percentage: 37, level: 'critico' },
  { id: 3, name: 'Cobertores', quantity: '80 un / 150 un', percentage: 53, level: 'atencao' },
  { id: 4, name: 'Arroz', quantity: '180 kg / 200 kg', percentage: 90, level: 'suficiente' },
  { id: 5, name: 'Colchões', quantity: '80 un / 150 un', percentage: 53, level: 'atencao' },
  { id: 6, name: 'Fraldas', quantity: '80 un / 150 un', percentage: 53, level: 'atencao' },
];

type FilterLevel = 'todos' | SupplyLevel;

const FILTER_BUTTONS: { key: FilterLevel; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'critico', label: 'Crítico' },
  { key: 'atencao', label: 'Atenção' },
  { key: 'suficiente', label: 'Suficiente' },
];

export const Overview = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterLevel>('todos');

  const filteredSupplies = MOCK_SUPPLIES.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'todos' || s.level === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto">
      <div className="px-4 sm:px-6 pt-4 pb-8 flex flex-col gap-6">
        {/* Título */}
        <h1 className="text-[#0a0a0a] text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
          Overview -{' '}
          <span className="font-semibold">{SHELTER_NAME}</span>
        </h1>

        {/* Seção 1 — Cards de estatísticas */}
        <div className="flex flex-wrap gap-4">
          {STAT_CARDS.map((card) => (
            <StatCard
              key={card.label}
              label={card.label}
              value={card.value}
              valueColor={card.valueColor}
            />
          ))}
        </div>

        {/* Seção 2 — Status de Suprimentos */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[#0a0a0a] text-lg sm:text-xl font-bold leading-tight">
            Status de Suprimentos Essenciais
          </h2>

          {/* Barra de busca e filtros */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[200px] flex items-center gap-3 border border-black/10 rounded-[10px] px-3 py-2 bg-white">
              <Search size={16} className="text-[#717182] shrink-0" />
              <input
                type="text"
                placeholder="Pesquisar suprimento..."
                value={search}
                onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
                className="flex-1 text-sm text-[#0a0a0a] placeholder-[rgba(10,10,10,0.5)] outline-none bg-transparent"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {FILTER_BUTTONS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`px-4 py-2 rounded-[10px] text-sm font-semibold transition-colors ${
                    activeFilter === key
                      ? 'bg-[#2f7dbb] text-white'
                      : 'bg-white border border-black/10 text-[#717182] hover:bg-[#f3f4f6]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de cards de suprimento */}
          {filteredSupplies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredSupplies.map((supply) => (
                <SupplyCard
                  key={supply.id}
                  name={supply.name}
                  quantity={supply.quantity}
                  percentage={supply.percentage}
                  level={supply.level}
                />
              ))}
            </div>
          ) : (
            <p className="text-[#717182] text-sm py-8 text-center">
              Nenhum suprimento encontrado.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
