import { useState } from 'preact/hooks'
import { Check, X, Search, UserCheck } from 'lucide-preact'
import { Navbar } from '@/shared/components/navbar/navbar'
import { useSolicitacoes, useAprovarSolicitacao, useRejeitarSolicitacao } from '@/features/solicitacoes/hooks'
import type { Solicitacao } from '@/features/solicitacoes/api'

export default function Solicitacoes() {
  const [search, setSearch] = useState('')
  const [confirmAction, setConfirmAction] = useState<{ type: 'aprovar' | 'rejeitar'; solicitacao: Solicitacao } | null>(null)

  const { data: solicitacoes = [], isLoading } = useSolicitacoes()
  const { mutate: aprovar, isPending: isAproving } = useAprovarSolicitacao()
  const { mutate: rejeitar, isPending: isRejecting } = useRejeitarSolicitacao()

  const filtered = solicitacoes.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()),
  )

  function handleConfirm() {
    if (!confirmAction) return
    if (confirmAction.type === 'aprovar') {
      aprovar(confirmAction.solicitacao.id, { onSuccess: () => setConfirmAction(null) })
    } else {
      rejeitar(confirmAction.solicitacao.id, { onSuccess: () => setConfirmAction(null) })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      <Navbar />
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto max-w-[1280px]">

          {/* Cabeçalho */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#0a0a0a]">Solicitações de Cadastro</h1>
              <p className="text-sm text-[#717182] mt-0.5">Gestores de abrigo aguardando aprovação</p>
            </div>
            <div className="flex items-center gap-2 border border-black/10 rounded-lg px-3 py-2 bg-white sm:w-72">
              <Search size={14} className="text-[#717182] shrink-0" />
              <input
                type="text"
                placeholder="Buscar por nome ou e-mail..."
                value={search}
                onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
                className="flex-1 text-sm bg-transparent outline-none text-[#0a0a0a] placeholder:text-[#717182]"
              />
            </div>
          </div>

          {/* Conteúdo */}
          {isLoading ? (
            <div className="flex items-center justify-center py-24 text-[#717182] text-sm">
              Carregando solicitações...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-[#717182]">
              <UserCheck size={40} strokeWidth={1.5} />
              <p className="text-sm">{search ? 'Nenhuma solicitação encontrada.' : 'Nenhuma solicitação pendente.'}</p>
            </div>
          ) : (
            <div className="bg-white border border-black/10 rounded-2xl shadow-sm overflow-hidden">
              {/* Header da tabela */}
              <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_180px] gap-4 px-6 py-3 border-b border-black/5 text-xs font-semibold text-[#0a0a0a]">
                <span>Nome</span>
                <span>E-mail</span>
                <span>Telefone</span>
                <span>Organização</span>
                <span>Data de solicitação</span>
                <span>Ações</span>
              </div>

              {/* Linhas */}
              {filtered.map((s) => (
                <div key={s.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_180px] gap-4 px-6 py-4 border-b border-black/5 last:border-0 items-center hover:bg-gray-50/50 transition-colors">
                  <p className="text-sm font-medium text-[#0a0a0a]">{s.name}</p>
                  <p className="text-sm text-[#717182] truncate">{s.email}</p>
                  <p className="text-sm text-[#717182]">{s.phone ?? '—'}</p>
                  <p className="text-sm text-[#717182] truncate">{s.organization_id ?? '—'}</p>
                  <p className="text-sm text-[#717182]">
                    {new Date(s.created_at).toLocaleDateString('pt-BR')}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setConfirmAction({ type: 'aprovar', solicitacao: s })}
                      className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium bg-[#ecfdf5] text-[#009966] hover:bg-[#d1fae5] transition-colors cursor-pointer"
                    >
                      <Check size={13} />
                      Aprovar
                    </button>
                    <button
                      onClick={() => setConfirmAction({ type: 'rejeitar', solicitacao: s })}
                      className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium bg-[#fef2f2] text-[#e7000b] hover:bg-[#fee2e2] transition-colors cursor-pointer"
                    >
                      <X size={13} />
                      Rejeitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal de confirmação */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-[14px] border-[0.8px] border-[#E5E7EB] bg-white p-6 shadow-xl">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className={`flex h-12 w-12 items-center justify-center rounded-full ${
                confirmAction.type === 'aprovar' ? 'bg-[#ecfdf5] text-[#009966]' : 'bg-[#fef2f2] text-[#e7000b]'
              }`}>
                {confirmAction.type === 'aprovar' ? <Check size={22} /> : <X size={22} />}
              </span>
              <h2 className="text-base font-bold text-black">
                {confirmAction.type === 'aprovar' ? 'Aprovar cadastro' : 'Rejeitar cadastro'}
              </h2>
              <p className="text-sm text-[#0A0A0A80]">
                {confirmAction.type === 'aprovar'
                  ? 'O gestor terá acesso à plataforma após a aprovação.'
                  : 'O cadastro será removido permanentemente.'}
              </p>
              <div className="w-full rounded-xl border border-[#E5E7EB] bg-[#0A0A0A0D] px-4 py-2 text-sm font-semibold text-black">
                {confirmAction.solicitacao.name}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                disabled={isAproving || isRejecting}
                className="btn btn-outline flex-1 border-[#0A0A0A80] text-[#0A0A0A80] hover:bg-[#0A0A0A0D]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isAproving || isRejecting}
                className={`btn flex-1 border-none text-white disabled:opacity-70 ${
                  confirmAction.type === 'aprovar'
                    ? 'bg-[#009966] hover:bg-[#007a52]'
                    : 'bg-[#e7000b] hover:bg-[#c20009]'
                }`}
              >
                {isAproving || isRejecting ? 'Aguarde...' : confirmAction.type === 'aprovar' ? 'Aprovar' : 'Rejeitar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
