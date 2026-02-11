import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useTestStore from './store/testStore';
import StartPage from './pages/StartPage';
import TestPage from './pages/TestPage';
import ResultPage from './pages/ResultPage';
import BrowserEnforcer from './components/BrowserEnforcer';
import ViolationCounter from './components/ViolationCounter';
import FullscreenWarning from './components/FullscreenWarning';

// Protected Route Wrapper
const ProtectedTestRoute = ({ children }) => {
  const { isTestActive, isSubmitted } = useTestStore();
  
  if (isSubmitted) return <Navigate to="/result" replace />;
  if (!isTestActive) return <Navigate to="/" replace />;
  
  return children;
};

const App = () => {
  const { isTestActive, isSubmitted } = useTestStore();
  const showSecurityUI = isTestActive && !isSubmitted;

  return (
    <BrowserRouter>
      {/* Global Security Components */}
      {showSecurityUI && (
        <>
          <BrowserEnforcer />
          <ViolationCounter />
          <FullscreenWarning />
        </>
      )}
      
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<StartPage />} />
        
        <Route 
          path="/test" 
          element={
            <ProtectedTestRoute>
              <TestPage />
            </ProtectedTestRoute>
          } 
        />
        
        <Route path="/result" element={<ResultPage />} />
        
        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;