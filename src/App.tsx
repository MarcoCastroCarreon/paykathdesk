import './App.css';
import DrawerProvider from './context/drawer.context';
import ToastProvider from './context/toast.context';
import { ViewsProvider } from './context/views.context';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div>
      <ViewsProvider>
        <DrawerProvider>
          <ToastProvider>
            <Dashboard />
          </ToastProvider>
        </DrawerProvider>
      </ViewsProvider>
    </div>
  );
}

export default App;
