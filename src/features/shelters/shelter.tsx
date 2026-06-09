import { useState } from 'preact/hooks';
import { useSearch } from 'wouter-preact';
import { Navbar } from '@/shared/components/navbar/navbar';
import { ShelterSidebar, type ShelterItem, type ShelterStatus } from './shared/components/shelter-sidebar';
import { TabMenu } from './shared/components/tab-menu';
import { Overview } from './overview/overview';
import { Recursos } from './recursos/recursos';
import { Pessoas } from './pessoas/pessoas';
import { useCrisisOperations } from './hooks';
import type { ApiShelter } from './api';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'recursos', label: 'Gestão de Recursos' },
  { id: 'pessoas', label: 'Gestão de Pessoas' },
];

const SEVERITY_TO_STATUS: Record<string, ShelterStatus> = {
  URGENTE: 'URGENTE',
  NECESSÁRIO: 'NECESSÁRIO',
  SUFICIENTE: 'SUFICIENTE',
  INATIVO: 'SUFICIENTE',
};

function toShelterItem(s: ApiShelter): ShelterItem {
  return {
    id: s.id,
    name: s.name,
    status: SEVERITY_TO_STATUS[s.severity] ?? 'SUFICIENTE',
  };
}

export function ShelterPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const crisis_id = params.get('crisis_id');
  const shelter_id = params.get('shelter_id');

  const { data: crisis, isLoading, isError } = useCrisisOperations(crisis_id);

  const shelters: ShelterItem[] = crisis?.shelters.map(toShelterItem) ?? [];

  const [selectedShelterId, setSelectedShelterId] = useState<string | null>(shelter_id);
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const effectiveId = selectedShelterId ?? shelters[0]?.id ?? null;
  const selectedShelter = crisis?.shelters.find((s) => s.id === effectiveId);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <Navbar />
      <main className="flex-1 flex flex-col p-3 sm:p-4">
        {!crisis_id ? (
          <div className="flex-1 flex items-center justify-center text-sm text-[#717182]">
            Nenhuma crise selecionada.
          </div>
        ) : isLoading ? (
          <div className="flex-1 flex items-center justify-center text-sm text-[#717182]">
            Carregando operações...
          </div>
        ) : isError ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
            <p className="text-sm font-medium text-[#0a0a0a]">Sem conexão</p>
            <p className="text-xs text-[#717182]">Conecte-se à internet para carregar os dados deste abrigo.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-4 flex-1">
            <ShelterSidebar
              crisisId={crisis_id}
              crisisName={crisis?.name ?? ''}
              shelters={shelters}
              selectedShelterId={effectiveId ?? undefined}
              onShelterSelect={setSelectedShelterId}
            />
            <div className="flex-1 flex flex-col gap-6 min-w-0">
              <div className="flex justify-start lg:justify-end overflow-x-auto">
                <TabMenu tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
              </div>
              <div className="flex-1 min-w-0">
                {activeTab === 'overview' && <Overview shelter={selectedShelter} shelterId={selectedShelter?.id} />}
                {activeTab === 'recursos' && (
                  <Recursos
                    shelterName={selectedShelter?.name}
                    shelterId={selectedShelter?.id}
                    resources={selectedShelter?.resources}
                  />
                )}
                {activeTab === 'pessoas' && (
                  <Pessoas
                    shelterName={selectedShelter?.name}
                    shelterId={selectedShelter?.id}
                    people={selectedShelter?.people}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ShelterPage;
