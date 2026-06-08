import './app.css'
import Crises from '../features/crises/crises.tsx'
import { Route, Switch, Redirect } from 'wouter-preact'
import Home from '../features/shelters/home.tsx'

export function App() {

  return (
    <>
      <Switch>
        <Route path="/home">
          <Home/>
        </Route>
        <Route path="/crises">
          <Crises/>
        </Route>
        <Route path="/">
          <Redirect to="/home"/>
        </Route>        
      </Switch>
    </>
  )
}
