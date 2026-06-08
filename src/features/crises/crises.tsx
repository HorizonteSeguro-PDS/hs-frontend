import { useCrises } from './hooks';
import { Navbar} from '@/shared/components/navbar/navbar';
import { useState } from 'preact/hooks'
import RegisterCrisisModal from './components/RegisterCrisisModal'
import RegisterCrisisButton from './components/RegisterCrisisButton'
import CrisisFilterButton from './components/CrisisFilterButton'
import CrisisFilterSortModal from './components/CrisisFilterSortModal'

export default function Crises() {
    const { data: crises } = useCrises();
    const [crisisModalOpen, setCrisisModalOpen] = useState(false)
    const [filterOpen, setFilterOpen] = useState(false)

    return (
        <div>
            <Navbar />
            <h1>Crises</h1>
            <div className="mt-4 flex gap-3">
                <RegisterCrisisButton onClick={() => setCrisisModalOpen(true)} />
                <div className="relative">
                    <CrisisFilterButton onClick={() => setFilterOpen((prev) => !prev)} />
                    <CrisisFilterSortModal
                        open={filterOpen}
                        onClose={() => setFilterOpen(false)}
                        onSelect={(criterion) => console.log('Critério selecionado:', criterion)}
                    />
                </div>
            </div>
            <RegisterCrisisModal
                open={crisisModalOpen}
                onClose={() => setCrisisModalOpen(false)}
                onSubmit={(data) => console.log('Cadastro de crise:', data)}
            />
        </div>
    );
};
