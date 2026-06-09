import { useMemo, useState } from 'preact/hooks'
import { useAuth } from '@/shared/contexts/useAuthContext'
import { Navbar } from '@/shared/components/navbar/navbar'
import { useCrises } from './hooks'
import type { SortConfig, FilterConfig } from './types'
import RegisterCrisisButton from './components/RegisterCrisisButton'
import RegisterCrisisModal from './components/RegisterCrisisModal'
import CrisisFilterButton from './components/CrisisFilterButton'
import CrisisFilterModal from './components/CrisisFilterSortModal'
import CrisisSortButton from './components/CrisisSortButton'
import CrisisSortModal from './components/CrisisSortModal'
import CrisisSearchBar from './components/CrisisSearchBar'
import CrisisCard from './components/CrisisCard'

export default function Crises() {
  const { isCrisisManager } = useAuth()
  const { data: crises, isLoading, isError } = useCrises()

  const [search, setSearch] = useState('')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'severity', direction: 'desc' })
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({ status: 'all', severities: [], states: [] })
  const [registerOpen, setRegisterOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const availableStates = useMemo(() => {
    if (!crises) return []
    return [...new Set(crises.map((c) => c.state))].sort()
  }, [crises])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filterConfig.status !== 'all') count++
    if (filterConfig.severities.length > 0) count++
    if (filterConfig.states.length > 0) count++
    return count
  }, [filterConfig])

  const processed = useMemo(() => {
    if (!crises) return []
    const filtered = crises.filter((c) => {
      if (!c.crisis_name.toLowerCase().includes(search.toLowerCase())) return false
      if (filterConfig.status === 'active' && !c.active) return false
      if (filterConfig.status === 'inactive' && c.active) return false
      if (filterConfig.severities.length > 0 && !filterConfig.severities.includes(c.severity)) return false
      if (filterConfig.states.length > 0 && !filterConfig.states.includes(c.state)) return false
      return true
    })
    return [...filtered].sort((a, b) => {
      const dir = sortConfig.direction === 'asc' ? 1 : -1
      switch (sortConfig.field) {
        case 'severity':
          return dir * (a.severity - b.severity)
        case 'crisis_name':
          return dir * a.crisis_name.localeCompare(b.crisis_name)
        case 'start_date':
          return dir * (new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
        case 'shelters_count':
          return dir * (a.shelters_count - b.shelters_count)
        case 'active':
          return dir * (Number(a.active) - Number(b.active))
        default:
          return 0
      }
    })
  }, [crises, search, sortConfig, filterConfig])

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8fa]">
      <Navbar />

      <main className="flex-1 px-4 sm:px-6 pt-6 pb-10 flex flex-col gap-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-[#0a0a0a] text-2xl sm:text-3xl font-bold leading-tight">
            Crises
          </h1>
          <p className="text-[#717182] text-sm sm:text-base">
            Visualize e gerencie todas as crises registradas
          </p>
        </div>

        {/* Action bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
          <CrisisSearchBar value={search} onInput={setSearch} />

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative">
              <CrisisFilterButton
                onClick={() => setFilterOpen((prev) => !prev)}
                activeCount={activeFilterCount}
              />
              {filterOpen && (
                <CrisisFilterModal
                  onClose={() => setFilterOpen(false)}
                  filterConfig={filterConfig}
                  onApply={setFilterConfig}
                  availableStates={availableStates}
                />
              )}
            </div>
            <CrisisSortButton onClick={() => setSortOpen(true)} />
            {isCrisisManager() && <RegisterCrisisButton onClick={() => setRegisterOpen(true)} />}
          </div>
        </div>

        {/* Content */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {isError && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <ErrorIcon />
            <p className="font-bold text-[#0a0a0a] text-base">Erro ao carregar crises</p>
            <p className="text-sm text-[#717182]">Verifique sua conexão e tente novamente.</p>
          </div>
        )}

        {!isLoading && !isError && processed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <EmptyIcon />
            <p className="font-bold text-[#0a0a0a] text-base">Nenhuma crise encontrada</p>
            <p className="text-sm text-[#717182] max-w-xs">
              {search || activeFilterCount > 0
                ? 'Nenhuma crise corresponde aos filtros aplicados.'
                : 'Não há crises registradas no momento.'}
            </p>
          </div>
        )}

        {!isLoading && !isError && processed.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {processed.map((crisis, i) => (
              <CrisisCard key={`${crisis.crisis_name}-${i}`} crisis={crisis} />
            ))}
          </div>
        )}
      </main>

      <RegisterCrisisModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
      />

      <CrisisSortModal
        open={sortOpen}
        onClose={() => setSortOpen(false)}
        currentConfig={sortConfig}
        onApply={setSortConfig}
      />

    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-black/10 rounded-2xl p-4 flex flex-col gap-3 animate-pulse">
      <div className="flex items-start justify-between gap-2">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-5 bg-gray-200 rounded-full w-14 shrink-0" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-2/5" />
      </div>
      <div className="h-9 bg-gray-200 rounded-xl mt-auto" />
    </div>
  )
}

function EmptyIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#717182" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m10.29 3.86-8.18 14.14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.89-2.99L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}
