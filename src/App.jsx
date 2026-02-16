import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';
import SetupPage from './pages/SetupPage';
import SessionPage from './pages/SessionPage';
import SummaryPage from './pages/SummaryPage';

function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <div className="w-full h-full">
          <Routes>
            <Route path="/" element={<SetupPage />} />
            <Route path="/session" element={<SessionPage />} />
            <Route path="/summary" element={<SummaryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </SessionProvider>
  );
}

export default App;
