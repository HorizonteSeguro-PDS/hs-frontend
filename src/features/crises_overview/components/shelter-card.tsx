import { MapPin, Users, AlertTriangle, Shield } from 'lucide-preact';
import type { Shelter } from '../api';

export type ShelterStatus = 'URGENTE' | 'NECESSÁRIO' | 'SUFICIENTE';

const STATUS_STYLES: Record<ShelterStatus, {
  cardBorder: string;
  badgeBg: string;
  badgeText: string;
  dot: string;
}> = {
  URGENTE:    { cardBorder: 'border border-l-4 border-[#e7000b]',  badgeBg: 'bg-[#fef2f2]', badgeText: 'text-[#e7000b]', dot: 'bg-[#e7000b]' },
  NECESSÁRIO: { cardBorder: 'border border-l-4 border-[#f68b5e]',  badgeBg: 'bg-[#fff7ed]', badgeText: 'text-[#f54900]', dot: 'bg-[#ff6900]' },
  SUFICIENTE: { cardBorder: 'border border-l-4 border-[#1fa6a0]',  badgeBg: 'bg-[#ecfdf5]', badgeText: 'text-[#009966]', dot: 'bg-[#00bc7d]' },
};

export function getShelterStatus(severity: number): ShelterStatus {
  if (severity >= 7) return 'URGENTE';
  if (severity >= 4) return 'NECESSÁRIO';
  return 'SUFICIENTE';
}

interface ShelterCardProps extends Shelter {
  onDetails?: (id: string) => void;
}

export const ShelterCard = ({
  id,
  name,
  address,
  city,
  state,
  capacity,
  current_occupancy,
  urgent_needs,
  severity,
  onDetails,
}: ShelterCardProps) => {
  const status = getShelterStatus(severity);
  const styles = STATUS_STYLES[status];
  const occupancyRate = capacity > 0 ? Math.round((current_occupancy / capacity) * 100) : 0;
  const location = [address, `${city} - ${state}`].filter(Boolean).join(', ');

  return (
    <div className={`bg-white rounded-[14px] ${styles.cardBorder} flex flex-col overflow-hidden shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)]`}>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[#0a0a0a] font-semibold text-[18px] leading-snug">{name}</h3>
          <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg ${styles.badgeBg} ${styles.badgeText}`}>
            {status}
          </span>
        </div>

        <div className="flex items-start gap-2">
          <MapPin size={14} className="text-[#717182] shrink-0 mt-0.5" />
          <span className="text-sm text-[#717182]">{location}</span>
        </div>

        <div className="flex items-start gap-2">
          <Users size={14} className="text-[#717182] shrink-0 mt-0.5" />
          <span className="text-sm text-[#717182]">
            {current_occupancy}/{capacity} pessoas ({occupancyRate}% ocupado)
          </span>
        </div>

        {urgent_needs.length > 0 && (
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="text-[#717182] shrink-0 mt-0.5" />
            <span className="text-sm text-[#717182]">
              {urgent_needs.slice(0, 3).join(', ')}
              {urgent_needs.length > 3 && ` +${urgent_needs.length - 3}`}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-[rgba(0,0,0,0.1)] pt-2 mt-1">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-[#717182] shrink-0" />
            <span className="text-sm text-[#717182]">Severidade:</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`size-2 rounded-full shrink-0 ${styles.dot}`} />
            <span className="text-sm font-semibold text-[#0a0a0a]">{severity.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        <button
          onClick={() => onDetails?.(id)}
          className="w-full py-2 rounded-lg bg-[#030213] text-white text-sm font-medium hover:bg-[#1a1a2e] transition-colors cursor-pointer"
        >
          Ver detalhes
        </button>
      </div>
    </div>
  );
};
