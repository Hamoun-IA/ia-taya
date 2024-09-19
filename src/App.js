import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import './App.css';

const MainMenu = lazy(() => import('./components/MainMenu'));
const EnigmePage = lazy(() => import('./components/EnigmePage'));
const CestQuoi = lazy(() => import('./components/CestQuoi')); // Ceci importera le composant mémorisé par défaut

// Créez une instance de QueryClient
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Router>
          <div className="App">
            <Suspense fallback={<div>Chargement...</div>}>
              <Routes>
                <Route path="/" element={<MainMenu />} />
                <Route path="/enigme" element={<EnigmePage />} />
                <Route path="/cest-quoi" element={<CestQuoi />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
