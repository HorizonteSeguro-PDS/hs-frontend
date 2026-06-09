import { render } from 'preact'
import './index.css'
import { App } from './app/app.tsx'
import { initConnectionListener } from '@/shared/services/syncQueue'

initConnectionListener()

render(<App />, document.getElementById('app')!)
