import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import CompanyRegistrationPage from './components/CompanyRegistrationPage';
import CompanyAdminDashboard from './components/CompanyAdminDashboard';
import DeliveryCourierApp from './components/DeliveryCourierApp';
import WorkerPortalApp from './components/WorkerPortalApp';

export default function App() {
  // Check if company is already registered / logged in via localStorage
  const [registeredCompany, setRegisteredCompany] = useState(() => {
    try {
      const saved = localStorage.getItem('simpul_active_company');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Default directly to Landing Page 'site' as requested for initial view
  const [activeView, setActiveView] = useState(() => {
    return 'site';
  });

  const handleCompleteOnboarding = (companyData) => {
    setRegisteredCompany(companyData);
    try {
      localStorage.setItem('simpul_active_company', JSON.stringify(companyData));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    setActiveView('admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('simpul_active_company');
    setRegisteredCompany(null);
    setActiveView('site');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)' }}>
      {/* Main Content Router */}
      <main style={{ flex: 1 }}>
        {activeView === 'site' && (
          <LandingPage
            onStartUsingSimpul={() => setActiveView('company-registration')}
            onEnterPortal={() => setActiveView('admin')}
          />
        )}

        {activeView === 'company-registration' && (
          <CompanyRegistrationPage
            onBackToLanding={() => setActiveView('site')}
            onCompleteRegistration={handleCompleteOnboarding}
          />
        )}

        {activeView === 'admin' && (
          <CompanyAdminDashboard
            companyName={registeredCompany ? registeredCompany.name : 'PT Testing Bruh'}
            companyId={registeredCompany ? registeredCompany.id : 'comp-demo'}
            registeredCompany={registeredCompany}
            onLogout={handleLogout}
          />
        )}

        {activeView === 'courier' && (
          <DeliveryCourierApp />
        )}

        {activeView === 'worker' && (
          <WorkerPortalApp />
        )}
      </main>
    </div>
  );
}
