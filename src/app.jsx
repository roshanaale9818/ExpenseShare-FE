import { QueryClientProvider } from '@tanstack/react-query';
import 'src/global.css';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import { Provider } from 'react-redux';

import { queryClient } from './utils/http';
import store from './store';
import { AppProvider } from './providers/AppReducer';
import CustomAlertDialog from './components/customSnackbar/customSnackBar';
import { useInterceptor } from './providers/IntercepProvider';
import { useRouter } from './routes/hooks';

// ----------------------------------------------------------------------

export default function App() {
  const router = useRouter();
  const { setError } = useInterceptor();
  useScrollToTop();
  const onConfirmHandler = () => {
    localStorage.clear();
    router.push('/home');
    setError(false);
  };

  return (
    <ThemeProvider>
      <AppProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <CustomAlertDialog onConfirm={onConfirmHandler} />
            <Router />
          </QueryClientProvider>
        </Provider>
      </AppProvider>
    </ThemeProvider>
  );
}
