import { useState, useRef } from 'preact/hooks';
import { Search, Phone, Mail, MapPin, FileDown, FileUp, FileSpreadsheet } from 'lucide-preact';
import { useAuth } from '@/shared/contexts/useAuthContext';
import { useShelterDetail } from '../hooks';
import { StatCard } from './shared/components/stat-card';
import { SupplyCard, type SupplyLevel } from './shared/components/supply-card';
import type { ApiShelter, ApiSupply } from '../api';

const API_URL = import.meta.env.VITE_API_URL as string

async function downloadBlob(url: string, filename: string, token: string) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) return
  const blob = await res.blob()
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

type FilterLevel = 'todos' | SupplyLevel;

const FILTER_BUTTONS: { key: FilterLevel; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'critico', label: 'Crítico' },
  { key: 'atencao', label: 'Atenção' },
  { key: 'suficiente', label: 'Suficiente' },
];

const SEVERITY_COLOR: Record<string, string> = {
  URGENTE: '#792a2a',
  NECESSÁRIO: '#f54900',
  SUFICIENTE: '#2a7929',
  INATIVO: '#717182',
};

function supplyLevel(status: ApiSupply['status']): SupplyLevel {
  if (status === 'Critical') return 'critico';
  if (status === 'Sufficient') return 'suficiente';
  return 'atencao';
}

interface OverviewProps {
  shelter?: ApiShelter;
  shelterId?: string;
}

export const Overview = ({ shelter, shelterId }: OverviewProps) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterLevel>('todos');
  const { data: detail } = useShelterDetail(shelterId ?? null);
  const { user } = useAuth()
  const importInputRef = useRef<HTMLInputElement>(null)

  const token = user.value?.token ?? ''

  function handleDownloadTemplate() {
    downloadBlob(`${API_URL}/shelters/spreadsheet/template`, 'template.xlsx', token)
  }

  function handleExport() {
    if (!shelterId) return
    downloadBlob(`${API_URL}/shelters/${shelterId}/spreadsheet/export`, `abrigo-${shelterId}.xlsx`, token)
  }

  async function handleImport(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file || !shelterId) return
    const form = new FormData()
    form.append('file', file)
    await fetch(`${API_URL}/shelters/${shelterId}/spreadsheet/import`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    (e.target as HTMLInputElement).value = ''
  }

  const statCards = shelter
    ? [
        {
          label: 'Ocupação',
          value: `${shelter.current_occupancy}/${shelter.capacity}`,
          valueColor: SEVERITY_COLOR[shelter.severity] ?? '#717182',
        },
        {
          label: 'Ocupação - Relativo',
          value: `${Math.round(shelter.relative_occupation * 100)}%`,
          valueColor: SEVERITY_COLOR[shelter.severity] ?? '#717182',
        },
        {
          label: 'Gestores Ativos',
          value: String(shelter.active_managers),
          valueColor: '#717182',
        },
        {
          label: 'Severidade / Risco Atual',
          value: shelter.severity,
          valueColor: SEVERITY_COLOR[shelter.severity] ?? '#717182',
        },
      ]
    : [];

  const [activeCategory, setActiveCategory] = useState<string>('todos');

  const supplies = (shelter?.supplies ?? []).map((s) => ({
    id: s.name,
    name: s.name,
    quantity: `${s.current_quantity} ${s.unit} / ${s.max_capacity} ${s.unit}`,
    percentage: s.max_capacity > 0 ? (s.current_quantity / s.max_capacity) * 100 : 0,
    level: supplyLevel(s.status),
    lot_category: s.lot_category,
  }));

  const availableCategories = [...new Set(supplies.map((s) => s.lot_category))];

  const filteredSupplies = supplies.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = activeFilter === 'todos' || s.level === activeFilter;
    const matchesCategory = activeCategory === 'todos' || s.lot_category === activeCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto">
      <div className="px-4 sm:px-6 pt-4 pb-8 flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-[#0a0a0a] text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
            Overview —{' '}
            <span className="font-semibold">{shelter?.name ?? '—'}</span>
          </h1>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadTemplate}
              title="Baixar template"
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-black/10 bg-white text-xs font-medium text-[#030213] hover:bg-[#f3f4f6] transition-colors"
            >
              <FileSpreadsheet size={13} className="text-[#717182]" />
              Template
            </button>
            <button
              onClick={handleExport}
              disabled={!shelterId}
              title="Exportar planilha"
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-black/10 bg-white text-xs font-medium text-[#030213] hover:bg-[#f3f4f6] transition-colors disabled:opacity-40"
            >
              <FileDown size={13} className="text-[#717182]" />
              Exportar
            </button>
            <button
              onClick={() => importInputRef.current?.click()}
              disabled={!shelterId}
              title="Importar planilha"
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-black/10 bg-white text-xs font-medium text-[#030213] hover:bg-[#f3f4f6] transition-colors disabled:opacity-40"
            >
              <FileUp size={13} className="text-[#717182]" />
              Importar
            </button>
            <input ref={importInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleImport} />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {statCards.map((card) => (
            <StatCard key={card.label} label={card.label} value={card.value} valueColor={card.valueColor} />
          ))}
        </div>

        {detail && (detail.bio || detail.email || detail.phone || detail.address) && (
          <div className="flex flex-col gap-3 rounded-[14px] border border-black/10 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-[#0a0a0a]">Sobre o Abrigo</h2>
            {detail.bio && (
              <p className="text-sm text-[#717182] leading-relaxed">{detail.bio}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-1">
              {detail.phone && (
                <a href={`tel:${detail.phone}`} className="flex items-center gap-2 text-sm text-[#0a0a0a] hover:text-[#1FA6A0] transition-colors">
                  <Phone size={14} className="text-[#717182] shrink-0" />
                  {detail.phone}
                </a>
              )}
              {detail.email && (
                <a href={`mailto:${detail.email}`} className="flex items-center gap-2 text-sm text-[#0a0a0a] hover:text-[#1FA6A0] transition-colors">
                  <Mail size={14} className="text-[#717182] shrink-0" />
                  {detail.email}
                </a>
              )}
              {(detail.address || detail.neighborhood || detail.city) && (
                <span className="flex items-center gap-2 text-sm text-[#0a0a0a]">
                  <MapPin size={14} className="text-[#717182] shrink-0" />
                  {[detail.address, detail.neighborhood, detail.city, detail.state].filter(Boolean).join(', ')}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <h2 className="text-[#0a0a0a] text-lg sm:text-xl font-bold leading-tight">
            Status de Suprimentos Essenciais
          </h2>

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

          {availableCategories.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveCategory('todos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeCategory === 'todos'
                    ? 'bg-[#0a0a0a] text-white'
                    : 'bg-white border border-black/10 text-[#717182] hover:bg-[#f3f4f6]'
                }`}
              >
                Todas categorias
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    activeCategory === cat
                      ? 'bg-[#0a0a0a] text-white'
                      : 'bg-white border border-black/10 text-[#717182] hover:bg-[#f3f4f6]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

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
              {supplies.length === 0 ? 'Nenhum suprimento registrado.' : 'Nenhum suprimento encontrado.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
