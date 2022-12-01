if(import.meta.env.DEV) import('preact/devtools')
import { render } from 'preact';
import { App } from './pages/Dashboard'
import { AppProvider } from './context'
import './index.css'

render((<AppProvider children={<App />} />), document.body)