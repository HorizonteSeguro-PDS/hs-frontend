import { MapPin, Calendar, Building2, Users, Info } from 'lucide-preact';
import type { Crisis } from '@/features/crises/types';

const SEVERITY_LABELS: Record<number, string> = {
  1: 'MUITO BAIXA',
  2: 'BAIXA',
  3: 'MÉDIA',
  4: 'ALTA',
  5: 'CRÍTICA',
};

const SEVERITY_STYLES: Record<number, { badgeBg: string; badgeText: string }> = {
  1: { badgeBg: 'bg-[#ecfdf5]', badgeText: 'text-[#009966]' },
  2: { badgeBg: 'bg-[#ecfdf5]', badgeText: 'text-[#009966]' },
  3: { badgeBg: 'bg-[#fff7ed]', badgeText: 'text-[#f54900]' },
  4: { badgeBg: 'bg-[#fef2f2]', badgeText: 'text-[#e7000b]' },
  5: { badgeBg: 'bg-[#fef2f2]', badgeText: 'text-[#e7000b]' },
};

interface CrisisSidebarProps {
  crisis: Crisis;
  people_count: number;
}

export function CrisisSidebar({ crisis, people_count }: CrisisSidebarProps) {
  const severityLabel = SEVERITY_LABELS[crisis.severity] ?? 'MÉDIA';
  const severityStyle = SEVERITY_STYLES[crisis.severity] ?? SEVERITY_STYLES[3];

  const formattedDate = crisis.start_date
    ? new Date(crisis.start_date).toLocaleDateString('pt-BR')
    : 'Data não informada';

  return (
    <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[14px] p-5 flex flex-col gap-5 w-[270px] shrink-0 self-start">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-[#0a0a0a] font-bold text-lg leading-tight">{crisis.crisis_name}</h2>
        <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-lg ${severityStyle.badgeBg} ${severityStyle.badgeText}`}>
          {severityLabel}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-[#717182] shrink-0" />
          <span className="text-sm text-[#717182]">{crisis.city}, {crisis.state}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#717182] shrink-0" />
          <span className="text-sm text-[#717182]">Iniciada em {formattedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 size={16} className="text-[#717182] shrink-0" />
          <span className="text-sm text-[#717182]">{crisis.shelters_count} abrigos cadastrados</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={16} className="text-[#717182] shrink-0" />
          <span className="text-sm text-[#717182]">{people_count} pessoas abrigadas</span>
        </div>
      </div>

      <div className="h-px bg-[rgba(0,0,0,0.1)]" />

      <div className="flex items-center gap-2">
        <span className={`size-2 rounded-full shrink-0 ${crisis.active ? 'bg-[#00bc7d]' : 'bg-[#717182]'}`} />
        <span className="text-sm font-medium text-[#0a0a0a]">{crisis.active ? 'Ativa' : 'Inativa'}</span>
      </div>

      <div className="h-px bg-[rgba(0,0,0,0.1)]" />

      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg w-fit ${severityStyle.badgeBg} ${severityStyle.badgeText}`}>
        PRIORIDADE {severityLabel}
      </span>

      <div className="h-px bg-[rgba(0,0,0,0.1)]" />

      <div className="bg-[#eff6ff] border border-[#bedbff] rounded-[10px] p-3 flex gap-2 items-start">
        <Info size={16} className="text-[#1c398e] shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-[#1c398e]">Resumo da Situação</p>
          <p className="text-xs text-[#1447e6] leading-relaxed">
            Monitoramento ativo de {crisis.shelters_count} abrigos com total de {people_count} pessoas abrigadas.
          </p>
        </div>
      </div>
    </div>
  );
}
