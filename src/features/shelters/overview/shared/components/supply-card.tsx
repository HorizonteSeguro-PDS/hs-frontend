export type SupplyLevel = 'critico' | 'atencao' | 'suficiente';

interface SupplyCardProps {
  name: string;
  quantity: string;
  percentage: number;
  level: SupplyLevel;
}

const LEVEL_COLORS: Record<SupplyLevel, string> = {
  critico: '#ef4444',
  atencao: '#f59e0b',
  suficiente: '#10b981',
};

export const SupplyCard = ({ name, quantity, percentage, level }: SupplyCardProps) => {
  const barColor = LEVEL_COLORS[level];
  const clampedPct = Math.min(100, Math.max(0, percentage));

  return (
    <div className="bg-white border border-black/10 rounded-[10px] shadow-sm flex flex-col p-4 w-full">
      <p className="text-[#0a0a0a] text-sm font-semibold leading-snug">{name}</p>
      <p className="text-[#717182] text-xs font-normal mt-1.5">{quantity}</p>
      <div className="mt-3 bg-[#f3f4f6] rounded-full h-2 overflow-hidden w-full">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${clampedPct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
};
