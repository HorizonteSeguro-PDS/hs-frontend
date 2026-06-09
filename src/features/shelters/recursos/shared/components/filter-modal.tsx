import { useState } from 'preact/hooks';
import { X } from 'lucide-preact';

export interface FilterConfig {
  tipo: 'todos' | 'entrada' | 'saida';
  categoria: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: FilterConfig;
  categorias: string[];
  onApply: (config: FilterConfig) => void;
}

export const FilterModal = ({
  isOpen,
  onClose,
  currentConfig,
  categorias,
  onApply,
}: FilterModalProps) => {
  const [tipo, setTipo] = useState<FilterConfig['tipo']>(currentConfig.tipo);
  const [categoria, setCategoria] = useState(currentConfig.categoria);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({ tipo, categoria });
    onClose();
  };

  const handleReset = () => {
    setTipo('todos');
    setCategoria('todos');
  };

  const tipoOptions: { value: FilterConfig['tipo']; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'entrada', label: 'Entrada' },
    { value: 'saida', label: 'Saída' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-[420px] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#0a0a0a]">Filtrar Movimentações</h2>
          <button
            onClick={onClose}
            className="text-[#717182] hover:text-[#0a0a0a] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-semibold text-[#0a0a0a] mb-2">Tipo</p>
            <div className="flex gap-2 flex-wrap">
              {tipoOptions.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setTipo(value)}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                    tipo === value
                      ? 'border-[#2f7dbb] bg-[#eff6ff] text-[#2f7dbb]'
                      : 'border-black/10 text-[#0a0a0a] hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#0a0a0a] mb-2">Categoria</p>
            <div className="flex gap-2 flex-wrap">
              {['todos', ...categorias].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoria(cat)}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors cursor-pointer capitalize ${
                    categoria === cat
                      ? 'border-[#2f7dbb] bg-[#eff6ff] text-[#2f7dbb]'
                      : 'border-black/10 text-[#0a0a0a] hover:bg-gray-50'
                  }`}
                >
                  {cat === 'todos' ? 'Todas' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleReset}
            className="px-4 py-3 rounded-xl border border-black/10 text-sm font-medium text-[#717182] hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Limpar
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-black/10 text-sm font-medium text-[#717182] hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-white transition-colors cursor-pointer"
            style={{ background: 'linear-gradient(0.65deg, #1FA6A0 2.66%, #2F7DBB 57.3%, #3555A3 96.87%)' }}
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};
