if(import.meta.env.DEV) import('preact/devtools')
import { render } from 'preact';
import App from './App'
import { AppProvider } from './context'
import './index.css'

render((<AppProvider children={<App />} />), document.body)