import './app.css'
import Crises from '../features/crises/crises.tsx'
import { Route, Switch, Redirect } from 'wouter-preact'
import Home from '../features/home/home.tsx'
import { Suspense } from 'preact/compat'
import { routes } from './routes.ts'
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
              <Route path="/home" component={Home} />
              <Route path="/crises/all" component={Crises} />
              <Route path="/crises/:id" component={Crises} />
              <Route path="/crises/:id/abrigos" component={Crises} />
              <Route path="/">
                <Redirect to="/home"/>
              </Route>
            </Switch>
          </QueryClientProvider>
        </AuthProvider>
      </Suspense>
    </>
  )
}
