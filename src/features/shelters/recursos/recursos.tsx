import { useState, useMemo } from 'preact/hooks';
import { SlidersHorizontal, ArrowUpDown, Plus, Minus } from 'lucide-preact';
import {
  ResourcesTableRow,
  type Movimentacao,
} from './shared/components/resources-table-row';
import { SortModal, type SortConfig } from './shared/components/sort-modal';
import { FilterModal, type FilterConfig } from './shared/components/filter-modal';

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
      <div className="px-7 pt-6 pb-10 flex flex-col gap-8">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-[#0a0a0a] text-[40px] font-bold leading-tight">
              Gestão de Recursos —{' '}
              <span className="font-semibold">{shelterName}</span>
            </h1>
            <p className="text-[#717182] text-lg">
              Acompanhe as movimentações de entrada e saída de recursos
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 pt-1">
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`flex items-center gap-2 rounded-lg h-10 px-4 text-sm font-medium transition-colors cursor-pointer ${
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

            <button
              className="flex items-center gap-2 h-10 px-5 rounded-[10px] text-sm font-medium text-white transition-opacity hover:opacity-90 cursor-pointer"
              style={{
                background:
                  'linear-gradient(0.65deg, #1FA6A0 2.66%, #2F7DBB 57.3%, #3555A3 96.87%)',
                boxShadow: '0px 4px 12px rgba(47, 125, 187, 0.35)',
              }}
            >
              <Plus size={18} />
              Entrada de Recurso
            </button>

            <button
              className="flex items-center gap-2 h-10 px-5 rounded-[10px] text-sm font-medium text-white transition-opacity hover:opacity-90 cursor-pointer"
              style={{
                background:
                  'linear-gradient(189.6deg, #F68B5E 37.8%, #F5B84B 90.5%, #E75D5C 143.2%)',
                boxShadow: '0px 4px 12px rgba(245, 73, 0, 0.3)',
              }}
            >
              <Minus size={18} />
              Saída de Recurso
            </button>
          </div>
        </div>

        {/* Tabela de Movimentações */}
        <div className="bg-white border border-black/10 rounded-2xl shadow-sm overflow-hidden">
          {/* Cabeçalho da tabela */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
            <h2 className="text-base font-bold text-[#0a0a0a]">Movimentações</h2>
            <button
              onClick={() => setIsSortOpen(true)}
              className="flex items-center gap-2 bg-[#eceef2] rounded-lg h-9 px-3 text-[#030213] text-sm font-medium hover:bg-[#e0e2e8] transition-colors cursor-pointer"
            >
              <ArrowUpDown size={15} />
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
                      className="px-6 py-4 text-left text-sm font-semibold text-[#0a0a0a] whitespace-nowrap"
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
    </div>
  );
};
