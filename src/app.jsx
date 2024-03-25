
import { QueryClientProvider } from '@tanstack/react-query';
import 'src/global.css';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import { Provider } from 'react-redux';
import { queryClient } from './utils/http';
import store from './store';
import { AppProvider } from './providers/AppReducer';


// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <AppProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Router />
        </QueryClientProvider>
      </Provider>
      </AppProvider>
    </ThemeProvider>
  );
}
