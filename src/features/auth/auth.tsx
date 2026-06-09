import { useState } from 'preact/hooks'
import { useLocation } from 'wouter-preact'
import HorizonteSeguroLogo from '@/assets/LOGO.svg'
import { useLogin } from '@/features/auth/hooks'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [, setLocation] = useLocation()
  const { mutate: login, isPending } = useLogin()

  function handleSubmit(event: Event) {
    event.preventDefault()
    login(
      { email, password },
      {
        onSuccess: () => setLocation('/crises/all'),
      },
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4">
      <div className="w-full max-w-md rounded-[14px] border-[0.8px] border-[#E5E7EB] bg-white shadow-xl">
        <div className="flex flex-col items-center gap-3 p-8 pb-4">
          <img src={HorizonteSeguroLogo} alt="Logo horizonte seguro" className="h-20 w-auto" />
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-lg font-semibold text-black">Acessar plataforma</h1>
            <p className="text-sm text-[#0A0A0A80]">Entre com suas credenciais para continuar</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 pt-2">
          <Field label="E-mail">
            <input
              type="email"
              required
              placeholder="Digite seu e-mail..."
              value={email}
              onInput={(event) => setEmail((event.target as HTMLInputElement).value)}
              className="input input-bordered w-full rounded-xl bg-white border-[#0A0A0A80] text-[#0A0A0A80] focus:border-[#1FA6A0] focus:outline-none"
            />
          </Field>

          <Field label="Senha">
            <input
              type="password"
              required
              placeholder="Digite sua senha..."
              value={password}
              onInput={(event) => setPassword((event.target as HTMLInputElement).value)}
              className="input input-bordered w-full rounded-xl bg-white border-[#0A0A0A80] text-[#0A0A0A80] focus:border-[#1FA6A0] focus:outline-none"
            />
          </Field>

          <button
            type="submit"
            disabled={isPending}
            className="btn rounded-[10px] border-none bg-[linear-gradient(16deg,#1FA6A0_0.1%,#2F7DBB_57.69%,#3555A3_99.4%)] text-white shadow-[0_10px_15px_-3px_rgba(31,166,160,0.30),0_4px_6px_-4px_rgba(31,166,160,0.30)] disabled:opacity-70"
          >
            {isPending ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="text-center text-sm text-[#0A0A0A80]">
            Não tem uma conta?{' '}
            <button type="button" onClick={() => setLocation('/register')}
              className="font-semibold text-[#2F7DBB] hover:text-[#1FA6A0] transition-colors">
              Solicitar cadastro
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: preact.ComponentChildren }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-bold text-black">{label}</span>
      {children}
    </label>
  )
}
