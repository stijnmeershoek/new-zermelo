/* @refresh reload */
if(import.meta.env.DEV) import('solid-devtools')
import { lazy, Suspense } from 'solid-js';
import { render } from 'solid-js/web';
import { AppProvider } from './context';

const App = lazy(() => import('./pages/Dashboard/App'));
import './index.css';

render(() => <AppProvider children={<Suspense fallback={<div class="loader-div"><span class='loader'></span></div>}><App /></Suspense>} />, document.body);

document.body.querySelector('.loader-div')?.remove();
