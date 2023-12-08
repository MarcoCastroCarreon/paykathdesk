import './App.css';
import DrawerProvider from './context/drawer.context';
import ModalProvider from './context/modal.context';
import ToastProvider from './context/toast.context';
import { ViewsProvider } from './context/views.context';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div>
      <ToastProvider>
        <ViewsProvider>
          <ModalProvider>
            <DrawerProvider>
              <Dashboard />
            </DrawerProvider>
          </ModalProvider>
        </ViewsProvider>
      </ToastProvider>
    </div>
  );
}

export default App;
