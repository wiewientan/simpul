import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { id: 'top', tab: 'home', label: 'Home' },
  { id: 'about', tab: 'about', label: 'About' },
  { id: 'streams', tab: 'streams', label: 'Streams' },
  { id: 'nexus', tab: 'nexus', label: 'Ecosystem' },
  { id: 'impact', tab: 'impact', label: 'Impact' },
];

export default function Navbar({ companyName, onStartUsingSimpul }) {
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const scrollPos = window.scrollY + 250;
      const aboutEl = document.getElementById('about');
      const streamsEl = document.getElementById('streams');
      const nexusEl = document.getElementById('nexus');
      const impactEl = document.getElementById('impact');

      if (impactEl && scrollPos >= impactEl.offsetTop) {
        setActiveTab('impact');
      } else if (nexusEl && scrollPos >= nexusEl.offsetTop) {
        setActiveTab('nexus');
      } else if (streamsEl && scrollPos >= streamsEl.offsetTop) {
        setActiveTab('streams');
      } else if (aboutEl && scrollPos >= aboutEl.offsetTop) {
        setActiveTab('about');
      } else {
        setActiveTab('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id, tabName) => {
    setActiveTab(tabName);
    setMobileMenuOpen(false);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`floating-topbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="topbar-inner-wrap">
        
        {/* Left Side: Brand Logo & Wordmark */}
        <div className="topbar-brand-col">
          <motion.button 
            className="brand-link-btn"
            onClick={() => scrollTo('top', 'home')}
            title="Simpul Home"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <div className="navbar-simpul-brandmark">
              <svg className="navbar-knot-s" viewBox="0 0 110 130" fill="none">
                <path 
                  d="M 82 32 C 82 14, 62 8, 44 8 C 22 8, 12 22, 12 38 C 12 56, 32 66, 56 73 C 80 80, 98 90, 98 106 C 98 122, 80 130, 54 130 C 28 130, 14 118, 14 100" 
                  stroke="currentColor" 
                  strokeWidth="16" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M 44 26 C 60 26, 70 36, 60 50 C 48 64, 28 72, 28 88 C 28 100, 42 106, 56 106" 
                  stroke="#C42B34" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                />
                <circle cx="56" cy="73" r="6" fill="#C42B34" />
              </svg>
              <span className="navbar-brand-letters">IMPUL</span>
            </div>
          </motion.button>
        </div>

        {/* Center: Floating Capsule Dock with Smooth Sliding Active Pill */}
        <div className="topbar-center-col">
          <nav className="capsule-nav-dock">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.tab;
              return (
                <button 
                  key={item.tab}
                  className={`dock-tab ${isActive ? 'is-active' : ''}`} 
                  onClick={() => scrollTo(item.id, item.tab)}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-nav-indicator"
                      className="dock-active-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="dock-tab-label">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Primary CTA */}
        <div className="topbar-cta-col">
          {companyName ? (
            <span className="dock-company-badge">{companyName}</span>
          ) : (
            <motion.button 
              className="topbar-cta-btn" 
              onClick={onStartUsingSimpul}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <span>Start Using Simpul</span>
              <span className="cta-arr">&rarr;</span>
            </motion.button>
          )}

          {/* Mobile Menu Toggle Button */}
          <motion.button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            whileTap={{ scale: 0.9 }}
          >
            <span className={`toggle-line ${mobileMenuOpen ? 'open-1' : ''}`} />
            <span className={`toggle-line ${mobileMenuOpen ? 'open-2' : ''}`} />
          </motion.button>
        </div>

      </div>

      {/* Mobile Dropdown Menu with Framer Motion AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="mobile-dropdown-menu"
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          >
            {NAV_ITEMS.map((item) => (
              <button 
                key={item.tab}
                className={`mobile-nav-item ${activeTab === item.tab ? 'is-active' : ''}`} 
                onClick={() => scrollTo(item.id, item.tab)}
              >
                {item.label}
              </button>
            ))}
            <button 
              className="mobile-nav-cta" 
              onClick={() => { setMobileMenuOpen(false); onStartUsingSimpul(); }}
            >
              Start Using Simpul &rarr;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
