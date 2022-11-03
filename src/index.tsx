import React from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
import { AppProvider } from './context'
import './index.css'
import 'virtual:fonts.css'

const root = document.getElementById('root');

createRoot(root!).render(
    <React.StrictMode>
      <AppProvider>
        <App/>
      </AppProvider>
    </React.StrictMode>
);
