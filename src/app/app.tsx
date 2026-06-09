import './app.css'
import Crises from '../features/crises/crises.tsx'
import { Route, Switch} from 'wouter-preact'
import Auth from '../features/auth/auth.tsx'
import Register from '../features/register/register.tsx'
import Solicitacoes from '../features/solicitacoes/solicitacoes.tsx'
import { ShelterPage } from '@/features/shelters/shelter.tsx'
import { Suspense } from 'preact/compat'
import { AuthProvider } from '@/shared/contexts/useAuthContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function App() {

  return (
    <>
      <Suspense fallback={<div className="loading">Carregando...</div>}>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <Switch>
              <Route path="/login" component={Auth} />
              <Route path="/register" component={Register} />
              <Route path="/crises/all" component={Crises} />
              <Route path="/crises/:id" component={Crises} />
              <Route path="/crises/:id/abrigos" component={Crises} />
              <Route path="/abrigo" component={ShelterPage} />
              <Route path="/solicitacoes" component={Solicitacoes} />
            </Switch>
          </QueryClientProvider>
        </AuthProvider>
      </Suspense>
    </>
  )
}
