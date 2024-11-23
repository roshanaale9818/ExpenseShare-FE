import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';
import { InterceptorProvider } from './providers/IntercepProvider';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <InterceptorProvider>
        <Suspense>
          <App />
        </Suspense>
      </InterceptorProvider>
    </BrowserRouter>
  </HelmetProvider>
);
