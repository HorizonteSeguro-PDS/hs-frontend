import { TrendingUp, TrendingDown } from 'lucide-preact';

export interface Movimentacao {
  id: string;
  data: string;
  hora: string;
  tipo: 'entrada' | 'saida';
  categoria: string;
  recurso: string;
  quantidade: number;
  unidade: string;
  responsavel: string;
  abrigoDestino?: string;
}

interface ResourcesTableRowProps {
  movimentacao: Movimentacao;
}

export const ResourcesTableRow = ({ movimentacao }: ResourcesTableRowProps) => {
  const isEntrada = movimentacao.tipo === 'entrada';

  return (
    <tr className="border-b border-black/5 hover:bg-gray-50/50 transition-colors">
      <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-[#0a0a0a]">{movimentacao.data}</span>
          <span className="text-xs text-[#717182]">{movimentacao.hora}</span>
        </div>
      </td>
      <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[10px] text-xs font-semibold ${
            isEntrada ? 'bg-[#ecfdf5] text-[#009966]' : 'bg-[#fef2f2] text-[#e7000b]'
          }`}
        >
          {isEntrada ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {isEntrada ? 'Entrada' : 'Saída'}
        </span>
      </td>
      <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
        <span className="text-sm text-[#0a0a0a]">{movimentacao.categoria}</span>
      </td>
      <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
        <span className="text-sm font-medium text-[#0a0a0a]">{movimentacao.recurso}</span>
      </td>
      <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-right">
        <span className="text-sm text-[#0a0a0a]">{movimentacao.quantidade}</span>
      </td>
      <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
        <span className="text-sm text-[#717182]">{movimentacao.unidade}</span>
      </td>
      <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
        <span className="text-sm text-[#717182]">{movimentacao.responsavel}</span>
      </td>
      <td className="px-4 sm:px-6 py-3">
        <span className="text-sm text-[#717182]">
          {movimentacao.abrigoDestino ?? '—'}
        </span>
      </td>
    </tr>
  );
};
