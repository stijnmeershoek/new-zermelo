/* @refresh reload */
if(import.meta.env.DEV) import('solid-devtools')
import { render } from 'solid-js/web';
import { AppProvider } from './context';

import './index.css';
import {App} from './pages/Dashboard'

render(() => <AppProvider children={<App />} />, document.body);

document.body.querySelector('.loader-div')?.remove();
