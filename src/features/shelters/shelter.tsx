import { useState } from 'preact/hooks';
import { Navbar } from '@/shared/components/navbar';
import { ShelterSidebar, type ShelterItem } from './shared/components/shelter-sidebar';
import { TabMenu } from './shared/components/tab-menu';
import { Overview } from './overview/overview';
import { Recursos } from './recursos/recursos';
import { Pessoas } from './pessoas/pessoas';

const MOCK_CRISIS = 'Enchente - Maceió';

const MOCK_SHELTERS: ShelterItem[] = [
  { id: '1', name: 'Escola Estadual Ponta Verde', status: 'NECESSÁRIO' },
  { id: '2', name: 'Comunidade Benedito Bentes', status: 'SUFICIENTE' },
  { id: '3', name: 'Centro Comunitário Jacintinho', status: 'URGENTE' },
  { id: '4', name: 'Quadra Poliesportiva Tabuleiro', status: 'NECESSÁRIO' },
];

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'recursos', label: 'Gestão de Recursos' },
  { id: 'pessoas', label: 'Gestão de Pessoas' },
];

export function ShelterPage() {
  const [selectedShelterId, setSelectedShelterId] = useState(MOCK_SHELTERS[0].id);
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const selectedShelter = MOCK_SHELTERS.find((s) => s.id === selectedShelterId);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <Navbar />
      <main className="flex-1 flex flex-col p-6">
        <div className="flex gap-6 pl-3 pr-[60px] flex-1">
          <ShelterSidebar
            crisisName={MOCK_CRISIS}
            shelters={MOCK_SHELTERS}
            selectedShelterId={selectedShelterId}
            onShelterSelect={setSelectedShelterId}
          />
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex justify-end">
              <TabMenu tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <div className="flex-1">
              {activeTab === 'overview' && <Overview />}
              {activeTab === 'recursos' && <Recursos />}
              {activeTab === 'pessoas' && <Pessoas shelterName={selectedShelter?.name} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ShelterPage;
