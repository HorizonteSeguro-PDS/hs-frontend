import { useState } from 'preact/hooks'
import RegisterShelterModal from './components/RegisterShelterModal'
import RegisterShelterButton from './components/RegisterShelterButton'
import ShelterFilterButton from './components/ShelterFilterButton'
import ShelterFilterSortModal from './components/ShelterFilterSortModal'
import EntryResourceButton from './components/resources/EntryResourceButton'
import ExitResourceButton from './components/resources/ExitResourceButton'
import RegisterResourceButton from './components/resources/RegisterResourceButton'
import RegisterResourceModal from './components/resources/RegisterResourceModal'
import EntryResourceModal from './components/resources/EntryResourceModal'
import ExitResourceModal from './components/resources/ExitResourceModal'
import RegisterPersonModal from './components/people/RegisterPersonModal'
import ConfirmPersonExitModal from './components/people/ConfirmPersonExitModal'

export default function Home() {
    const [shelterModalOpen, setShelterModalOpen] = useState(false)
    const [filterOpen, setFilterOpen] = useState(false)
    const [resourceModalOpen, setResourceModalOpen] = useState(false)
    const [entryModalOpen, setEntryModalOpen] = useState(false)
    const [exitModalOpen, setExitModalOpen] = useState(false)
    const [personModalOpen, setPersonModalOpen] = useState(false)
    const [confirmExitOpen, setConfirmExitOpen] = useState(false)

    return (
        <div>
            <h1>Home</h1>
            <div className="mt-4 flex gap-3">
                <RegisterShelterButton onClick={() => setShelterModalOpen(true)} />
                <div className="relative">
                    <ShelterFilterButton onClick={() => setFilterOpen((prev) => !prev)} />
                    <ShelterFilterSortModal
                        open={filterOpen}
                        onClose={() => setFilterOpen(false)}
                        onSelect={(criterion) => console.log('Critério selecionado:', criterion)}
                    />
                </div>
            </div>
            <div className="mt-4 flex gap-3">
                <EntryResourceButton onClick={() => setEntryModalOpen(true)} />
                <ExitResourceButton onClick={() => setExitModalOpen(true)} />
                <RegisterResourceButton onClick={() => setResourceModalOpen(true)} />
            </div>
            <div className="mt-4 flex gap-3">
                <button type="button" onClick={() => setPersonModalOpen(true)} className="btn">
                    Cadastro/Entrada de Pessoa
                </button>
                <button type="button" onClick={() => setConfirmExitOpen(true)} className="btn">
                    Confirmar Saída de Pessoa
                </button>
            </div>
            <RegisterShelterModal
                open={shelterModalOpen}
                onClose={() => setShelterModalOpen(false)}
                onSubmit={(data) => console.log('Cadastro de abrigo:', data)}
            />
            <RegisterResourceModal
                open={resourceModalOpen}
                onClose={() => setResourceModalOpen(false)}
                onSubmit={(data) => console.log('Cadastro de recurso:', data)}
            />
            <EntryResourceModal
                open={entryModalOpen}
                onClose={() => setEntryModalOpen(false)}
                onSubmit={(data) => console.log('Entrada de recurso:', data)}
            />
            <ExitResourceModal
                open={exitModalOpen}
                onClose={() => setExitModalOpen(false)}
                onSubmit={(data) => console.log('Saída de recurso:', data)}
            />
            <RegisterPersonModal
                open={personModalOpen}
                onClose={() => setPersonModalOpen(false)}
                onSubmit={(data) => console.log('Cadastro de pessoa:', data)}
            />
            <ConfirmPersonExitModal
                open={confirmExitOpen}
                personName="Maria Silva"
                onClose={() => setConfirmExitOpen(false)}
                onConfirm={() => {
                    console.log('Saída confirmada para Maria Silva')
                    setConfirmExitOpen(false)
                }}
            />
        </div>
    );
};
