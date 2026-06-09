import { useState } from 'preact/hooks';
import { X } from 'lucide-preact';
import type { ShelterStatus } from './shelter-card';

export interface ShelterFilterConfig {
  status: ShelterStatus | 'todos';
}

interface ShelterFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: ShelterFilterConfig;
  onApply: (config: ShelterFilterConfig) => void;
}

const STATUS_OPTIONS: { value: ShelterFilterConfig['status']; label: string }[] = [
  { value: 'todos',      label: 'Todos'      },
  { value: 'URGENTE',    label: 'Urgente'    },
  { value: 'NECESSÁRIO', label: 'Necessário' },
  { value: 'SUFICIENTE', label: 'Suficiente' },
];

export const ShelterFilterModal = ({
  isOpen,
  onClose,
  currentConfig,
  onApply,
}: ShelterFilterModalProps) => {
  const [status, setStatus] = useState<ShelterFilterConfig['status']>(currentConfig.status);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({ status });
    onClose();
  };

  const handleReset = () => setStatus('todos');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-[420px] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#0a0a0a]">Filtrar Abrigos</h2>
          <button
            onClick={onClose}
            className="text-[#717182] hover:text-[#0a0a0a] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#0a0a0a] mb-2">Status</p>
          <div className="flex gap-2 flex-wrap">
            {STATUS_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setStatus(value)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                  status === value
                    ? 'border-[#2f7dbb] bg-[#eff6ff] text-[#2f7dbb]'
                    : 'border-black/10 text-[#0a0a0a] hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
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
