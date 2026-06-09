import { useState, useMemo } from 'preact/hooks';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-preact';
import {
  ResourcesTableRow,
  type Movimentacao,
} from './shared/components/resources-table-row';
import { SortModal, type SortConfig } from './shared/components/sort-modal';
import { FilterModal, type FilterConfig } from './shared/components/filter-modal';
import EntryResourceButton from '../components/resources/EntryResourceButton';
import EntryResourceModal from '../components/resources/EntryResourceModal';
import ExitResourceButton from '../components/resources/ExitResourceButton';
import ExitResourceModal from '../components/resources/ExitResourceModal';

const MOCK_MOVIMENTACOES: Movimentacao[] = [
  {
    id: '1',
    data: '02/06/2026',
    hora: '14:30',
    tipo: 'entrada',
    categoria: 'Alimentos',
    recurso: 'Arroz',
    quantidade: 50,
    unidade: 'kg',
    responsavel: 'Maria Silva',
  },
  {
    id: '2',
    data: '02/06/2026',
    hora: '13:15',
    tipo: 'saida',
    categoria: 'Medicamentos',
    recurso: 'Dipirona',
    quantidade: 100,
    unidade: 'unidades',
    responsavel: 'João Santos',
    abrigoDestino: 'Escola Estadual Ponta Verde',
  },
  {
    id: '3',
    data: '02/06/2026',
    hora: '11:45',
    tipo: 'entrada',
    categoria: 'Higiene',
    recurso: 'Sabonete',
    quantidade: 200,
    unidade: 'unidades',
    responsavel: 'Ana Costa',
  },
  {
    id: '4',
    data: '01/06/2026',
    hora: '16:20',
    tipo: 'entrada',
    categoria: 'Vestuário',
    recurso: 'Cobertores',
    quantidade: 30,
    unidade: 'unidades',
    responsavel: 'Pedro Lima',
  },
  {
    id: '5',
    data: '01/06/2026',
    hora: '15:00',
    tipo: 'saida',
    categoria: 'Alimentos',
    recurso: 'Água Mineral',
    quantidade: 120,
    unidade: 'litros',
    responsavel: 'Maria Silva',
    abrigoDestino: 'Quadra Poliesportiva Tabuleiro',
  },
  {
    id: '6',
    data: '01/06/2026',
    hora: '10:30',
    tipo: 'entrada',
    categoria: 'Medicamentos',
    recurso: 'Antiinflamatório',
    quantidade: 150,
    unidade: 'unidades',
    responsavel: 'Carlos Ferreira',
  },
  {
    id: '7',
    data: '31/05/2026',
    hora: '14:00',
    tipo: 'saida',
    categoria: 'Higiene',
    recurso: 'Papel Higiênico',
    quantidade: 80,
    unidade: 'rolos',
    responsavel: 'Ana Costa',
    abrigoDestino: 'Comunidade Benedito Bentes',
  },
  {
    id: '8',
    data: '31/05/2026',
    hora: '09:15',
    tipo: 'entrada',
    categoria: 'Alimentos',
    recurso: 'Feijão',
    quantidade: 40,
    unidade: 'kg',
    responsavel: 'João Santos',
  },
];

const CATEGORIAS = [...new Set(MOCK_MOVIMENTACOES.map((m) => m.categoria))];

function parseDatetime(data: string, hora: string): number {
  const [day, month, year] = data.split('/');
  return new Date(`${year}-${month}-${day}T${hora}`).getTime();
}

interface RecursosProps {
  shelterName?: string;
}

export const Recursos = ({ shelterName = 'Abrigo' }: RecursosProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'data',
    direction: 'desc',
  });
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    tipo: 'todos',
    categoria: 'todos',
  });
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [isExitOpen, setIsExitOpen] = useState(false);

  const sortLabel = sortConfig.field === 'data' ? 'Data' : 'Quantidade';

  const processedRows = useMemo(() => {
    const filtered = MOCK_MOVIMENTACOES.filter((m) => {
      const matchesTipo =
        filterConfig.tipo === 'todos' || m.tipo === filterConfig.tipo;
      const matchesCategoria =
        filterConfig.categoria === 'todos' || m.categoria === filterConfig.categoria;
      return matchesTipo && matchesCategoria;
    });

    return [...filtered].sort((a, b) => {
      const mult = sortConfig.direction === 'asc' ? 1 : -1;
      if (sortConfig.field === 'data') {
        return mult * (parseDatetime(a.data, a.hora) - parseDatetime(b.data, b.hora));
      }
      return mult * (a.quantidade - b.quantidade);
    });
  }, [sortConfig, filterConfig]);

  const hasActiveFilter =
    filterConfig.tipo !== 'todos' || filterConfig.categoria !== 'todos';

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto">
      <div className="px-4 sm:px-6 pt-4 pb-8 flex flex-col gap-6">
        {/* Cabeçalho */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-[#0a0a0a] text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
              Gestão de Recursos —{' '}
              <span className="font-semibold">{shelterName}</span>
            </h1>
            <p className="text-[#717182] text-sm lg:text-base">
              Acompanhe as movimentações de entrada e saída de recursos
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 lg:shrink-0">
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`flex items-center gap-2 rounded-lg h-9 px-3.5 text-sm font-medium transition-colors cursor-pointer ${
                hasActiveFilter
                  ? 'bg-[#eff6ff] text-[#2f7dbb] border border-[#2f7dbb]'
                  : 'bg-[#eceef2] text-[#030213] hover:bg-[#e0e2e8]'
              }`}
            >
              <SlidersHorizontal size={16} />
              Filtrar
              {hasActiveFilter && (
                <span className="size-2 rounded-full bg-[#2f7dbb]" />
              )}
            </button>

            <EntryResourceButton onClick={() => setIsEntryOpen(true)} />
            <ExitResourceButton onClick={() => setIsExitOpen(true)} />
          </div>
        </div>

        {/* Tabela de Movimentações */}
        <div className="bg-white border border-black/10 rounded-2xl shadow-sm overflow-hidden">
          {/* Cabeçalho da tabela */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-black/5">
            <h2 className="text-sm font-bold text-[#0a0a0a]">Movimentações</h2>
            <button
              onClick={() => setIsSortOpen(true)}
              className="flex items-center gap-2 bg-[#eceef2] rounded-lg h-8 px-3 text-[#030213] text-xs font-medium hover:bg-[#e0e2e8] transition-colors cursor-pointer"
            >
              <ArrowUpDown size={14} />
              Ordenar por {sortLabel}
            </button>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-black/10">
                  {[
                    'Data/Hora',
                    'Tipo',
                    'Categoria',
                    'Recurso',
                    'Quantidade',
                    'Unidade',
                    'Responsável',
                    'Abrigo Destino',
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-[#0a0a0a] whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {processedRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-sm text-[#717182]"
                    >
                      Nenhuma movimentação encontrada.
                    </td>
                  </tr>
                ) : (
                  processedRows.map((m) => (
                    <ResourcesTableRow key={m.id} movimentacao={m} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <SortModal
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        currentConfig={sortConfig}
        onApply={setSortConfig}
      />

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        currentConfig={filterConfig}
        categorias={CATEGORIAS}
        onApply={setFilterConfig}
      />

      <EntryResourceModal
        open={isEntryOpen}
        onClose={() => setIsEntryOpen(false)}
        onSubmit={(data) => {
          console.log('Entrada de recurso:', data);
          setIsEntryOpen(false);
        }}
      />

      <ExitResourceModal
        open={isExitOpen}
        onClose={() => setIsExitOpen(false)}
        onSubmit={(data) => {
          console.log('Saída de recurso:', data);
          setIsExitOpen(false);
        }}
      />
    </div>
  );
};
