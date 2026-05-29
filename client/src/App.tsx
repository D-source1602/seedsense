import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import BotpressChatbot from './components/BotpressChatbot';
import CalculatorWidget from './components/CalculatorWidget';
import ClimateRiskFab from './components/ClimateRiskFab';
import LanguageBar from './components/LanguageBar';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Recommendations from './pages/Recommendations';

/* page transition wrapper */
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PageTransition>
              <Dashboard />
            </PageTransition>
          }
        />
        <Route
          path="/recommendations"
          element={
            <PageTransition>
              <Recommendations />
            </PageTransition>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* top language bar — pushes content down 50px */}
      <LanguageBar />
      {/* spacer for the fixed bar */}
      <div style={{ height: 42 }} aria-hidden />

      <AnimatedRoutes />

      {/* Always-on widgets (matches the legacy global script tags) */}
      <ClimateRiskFab />
      <CalculatorWidget />
      <BotpressChatbot />
    </BrowserRouter>
  );
}
