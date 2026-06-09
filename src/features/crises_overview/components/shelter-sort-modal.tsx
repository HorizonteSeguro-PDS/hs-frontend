import { useState } from 'preact/hooks';
import { X, ArrowUp, ArrowDown, AlertTriangle, Users, Type } from 'lucide-preact';

export type ShelterSortField = 'severity' | 'occupancy' | 'name';
export type SortDirection = 'asc' | 'desc';

export interface ShelterSortConfig {
  field: ShelterSortField;
  direction: SortDirection;
}

interface ShelterSortModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: ShelterSortConfig;
  onApply: (config: ShelterSortConfig) => void;
}

const FIELD_OPTIONS: { value: ShelterSortField; label: string; Icon: typeof AlertTriangle }[] = [
  { value: 'severity',  label: 'Severidade', Icon: AlertTriangle },
  { value: 'occupancy', label: 'Ocupação',   Icon: Users         },
  { value: 'name',      label: 'Nome',       Icon: Type          },
];

const DIRECTION_OPTIONS: { value: SortDirection; label: string; Icon: typeof ArrowUp }[] = [
  { value: 'asc',  label: 'Crescente',   Icon: ArrowUp   },
  { value: 'desc', label: 'Decrescente', Icon: ArrowDown },
];

export const ShelterSortModal = ({
  isOpen,
  onClose,
  currentConfig,
  onApply,
}: ShelterSortModalProps) => {
  const [field, setField] = useState<ShelterSortField>(currentConfig.field);
  const [direction, setDirection] = useState<SortDirection>(currentConfig.direction);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({ field, direction });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-[400px] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[#0a0a0a]">Ordenar Abrigos</h2>
          <button
            onClick={onClose}
            className="text-[#717182] hover:text-[#0a0a0a] transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-semibold text-[#0a0a0a] mb-2">Ordenar por</p>
            <div className="flex flex-col gap-2">
              {FIELD_OPTIONS.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  onClick={() => setField(value)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                    field === value
                      ? 'border-[#2f7dbb] bg-[#eff6ff] text-[#2f7dbb]'
                      : 'border-black/10 text-[#0a0a0a] hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-[#0a0a0a] mb-2">Direção</p>
            <div className="flex gap-2">
              {DIRECTION_OPTIONS.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  onClick={() => setDirection(value)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                    direction === value
                      ? 'border-[#2f7dbb] bg-[#eff6ff] text-[#2f7dbb]'
                      : 'border-black/10 text-[#0a0a0a] hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
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
