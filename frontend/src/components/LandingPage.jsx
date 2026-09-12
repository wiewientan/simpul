import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import './LandingPage.css';

export default function LandingPage({ onStartUsingSimpul }) {
  const [animKey, setAnimKey] = useState(0);
  const [scrolledNav, setScrolledNav] = useState(false);
  
  // Interactive Filter States across sections
  const [activeFlowIndex, setActiveFlowIndex] = useState(0);
  const [activeProvideIndex, setActiveProvideIndex] = useState(0);
  const [activeHowIndex, setActiveHowIndex] = useState(0);
  const [activeServeIndex, setActiveServeIndex] = useState(0);

  const triggerAnimation = () => {
    setAnimKey(prev => prev + 1);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolledNav(window.scrollY > 160);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Scroll-Linked Parallax Physics ───
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const orbParallax1 = useTransform(smoothProgress, [0, 1], [0, 180]);
  const orbParallax2 = useTransform(smoothProgress, [0, 1], [0, -220]);
  const heroFade = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const heroDrift = useTransform(scrollYProgress, [0, 0.18], [0, 50]);

  // 3D Magnetic Parallax Physics for Hero Wordmark
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 190 };
  const rotateX = useSpring(useTransform(mouseY, [-250, 250], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-250, 250], [-6, 6]), springConfig);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    mouseX.set(e.clientX - (rect.left + centerX));
    mouseY.set(e.clientY - (rect.top + centerY));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const letters = [
    { char: 'S', delay: 0.05 },
    { char: 'I', delay: 0.14 },
    { char: 'M', delay: 0.23 },
    { char: 'P', delay: 0.32 },
    { char: 'U', delay: 0.41 },
    { char: 'L', delay: 0.50 },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const flowSteps = [
    {
      name: 'Materials',
      tag: 'STAGE 01 • INVENTORY & RAW ASSETS',
      desc: 'Raw materials, fabric rolls, trims, and supplier purchases are tracked with live yardage accounting from day one.'
    },
    {
      name: 'Production',
      tag: 'STAGE 02 • MULTI-TIER CRAFT ROUTING',
      desc: 'Work orders automatically route cutting, sewing, finishing, and QC tasks across internal lines and home-worker clusters.'
    },
    {
      name: 'Workforce',
      tag: 'STAGE 03 • DISTRIBUTED ARTISAN NETWORK',
      desc: 'Workers receive organized daily queues with transparent piece-rate records, quality checks, and guaranteed wage payouts.'
    },
    {
      name: 'Logistics',
      tag: 'STAGE 04 • LOCAL ROUTE DISPATCH',
      desc: 'Semi-finished bundles and completed garments move securely between workshops and fulfillment hubs with verified handoffs.'
    },
    {
      name: 'Finance',
      tag: 'STAGE 05 • RECONCILIATION & UNIT COST',
      desc: 'Exact cost of goods sold (HPP), worker settlements, supplier bills, and real margins are calculated automatically in real time.'
    }
  ];

  const provideItems = [
    {
      num: '01',
      title: 'Materials & Stock',
      short: 'Inventory',
      desc: 'Manage raw materials, inventory, suppliers, and material costs with complete precision and zero shrinkage.'
    },
    {
      num: '02',
      title: 'Production Management',
      short: 'Production',
      desc: 'Create work orders, assign production, and monitor progress across every stage without messy messaging groups.'
    },
    {
      num: '03',
      title: 'Workforce Network',
      short: 'Workforce',
      desc: 'Connect with distributed workers, balance capacity dynamically, and manage work allocation smoothly.'
    },
    {
      num: '04',
      title: 'Logistics',
      short: 'Logistics',
      desc: 'Coordinate material movement, product delivery, and local couriers seamlessly with complete chain of custody.'
    },
    {
      num: '05',
      title: 'Financial Management',
      short: 'Finance',
      desc: 'Track production costs, payments, margins, and operational transactions in real time with automated reconciliation.'
    }
  ];

  const howSteps = [
    {
      index: '01',
      title: 'Source',
      action: 'Material Intake',
      icon: '🧵',
      metric: 'BOM Auto-Sync',
      desc: 'Materials enter the system with barcoded batch tracking and supplier invoice matching.'
    },
    {
      index: '02',
      title: 'Produce',
      action: 'Capacity Allocation',
      icon: '✂️',
      metric: 'Skill Matching',
      desc: 'Work orders are distributed to artisan clusters based on skill, location, and turnaround time.'
    },
    {
      index: '03',
      title: 'Track',
      action: 'Live Milestones',
      icon: '🔍',
      metric: 'QC & Piece Pay',
      desc: 'Production progress and quality benchmarks are monitored at every checkpoint in real time.'
    },
    {
      index: '04',
      title: 'Deliver',
      action: 'Network Transit',
      icon: '🛵',
      metric: 'Verified Handoffs',
      desc: 'Finished products move through the verified logistics network straight to warehousing or clients.'
    },
    {
      index: '05',
      title: 'Settle',
      action: 'Instant Ledger',
      icon: '📊',
      metric: 'Bank-Ready HPP',
      desc: 'Accurate unit costs, payroll disbursements, and financial records are finalized without delay.'
    }
  ];

  const serveItems = [
    {
      role: 'Businesses',
      badge: 'FOR BRAND OWNERS & FACTORIES',
      desc: 'Gain total control over production pipelines, unlock scalable workforce capacity, and eliminate blind spots.'
    },
    {
      role: 'Workers',
      badge: 'FOR ARTISANS & HOME CRAFTERS',
      desc: 'Access organized, dignified, and consistent production opportunities with instant proof of work and guaranteed payouts.'
    },
    {
      role: 'Couriers',
      badge: 'FOR LOCAL DELIVERY DRIVERS',
      desc: 'Connect with predictable, optimized recurring transit routes between clusters, suppliers, and fulfillment hubs.'
    },
    {
      role: 'Suppliers',
      badge: 'FOR RAW MATERIAL VENDORS',
      desc: 'Become part of an integrated supply network with transparent repeat demand, predictable orders, and prompt settlements.'
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 35, filter: 'blur(6px)' },
    whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div className="luxury-editorial-wrapper">
      
      {/* ── Top Luxury Scroll Progress Indicator ── */}
      <motion.div 
        className="luxury-scroll-progress-line"
        style={{ scaleX: smoothProgress, transformOrigin: '0% 50%' }}
      />

      {/* ── Fixed Cyan Accent Bar (Left Edge) ── */}
      <div className="minimal-left-accent-line" aria-hidden="true" />

      {/* ── Minimal Floating Liquid Nav ── */}
      <motion.nav 
        className={`floating-editorial-nav ${scrolledNav ? 'nav-visible' : 'nav-hidden'}`}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: scrolledNav ? 0 : -50, opacity: scrolledNav ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="editorial-nav-bar">
          <span className="nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            SIMPUL
          </span>
          <div className="nav-menu-links">
            <button onClick={() => scrollToSection('sec-problem')}>Problem</button>
            <button onClick={() => scrollToSection('sec-solution')}>Solution</button>
            <button onClick={() => scrollToSection('sec-provide')}>Provide</button>
            <button onClick={() => scrollToSection('sec-why')}>Why Simpul</button>
            <button onClick={() => scrollToSection('sec-how')}>How It Works</button>
            <button onClick={() => scrollToSection('sec-serve')}>Serve</button>
            <button onClick={() => scrollToSection('sec-impact')}>Impact</button>
          </div>
        </div>
      </motion.nav>

      {/* ══════════════════════════════════════════════════════════════
          HERO (Quiet Luxury High-Fashion Wordmark)
         ══════════════════════════════════════════════════════════════ */}
      <section className="hero-fullscreen-screen">
        <div className="section-atmosphere atmosphere-hero" aria-hidden="true">
          <div className="ambient-sun-core" />
          <motion.div className="ambient-glow-drift drift-top-right" style={{ y: orbParallax1 }} />
          <motion.div className="ambient-glow-drift drift-bottom-left" style={{ y: orbParallax2 }} />
        </div>

        <motion.div 
          className="hero-center-box"
          style={{ opacity: heroFade, y: heroDrift }}
        >
          
          <motion.div
            ref={cardRef}
            className="brandmark-stage-clean"
            style={{ rotateX, rotateY, transformPerspective: 1200 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={triggerAnimation}
            title="Klik untuk memutar ulang animasi"
          >
            {/* Simpul Knot Icon */}
            <motion.div 
              style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <svg width="48" height="48" viewBox="0 0 110 130" fill="none">
                <path 
                  d="M 82 32 C 82 14, 62 8, 44 8 C 22 8, 12 22, 12 38 C 12 56, 32 66, 56 73 C 80 80, 98 90, 98 106 C 98 122, 80 130, 54 130 C 28 130, 14 118, 14 100" 
                  stroke="#18181B" 
                  strokeWidth="14" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M 44 26 C 60 26, 70 36, 60 50 C 48 64, 28 72, 28 88 C 28 100, 42 106, 56 106" 
                  stroke="#BE185D" 
                  strokeWidth="7" 
                  strokeLinecap="round" 
                />
                <circle cx="56" cy="73" r="5" fill="#BE185D" />
              </svg>
            </motion.div>

            <div className="luxury-wordmark-container" key={animKey}>
              <div className="italiana-characters-row">
                {letters.map((item, idx) => (
                  <motion.span
                    key={idx}
                    className="italiana-animated-letter"
                    initial={{ opacity: 0, y: 30, scale: 0.94, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    transition={{
                      duration: 0.85,
                      delay: item.delay,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {item.char}
                  </motion.span>
                ))}
              </div>

              <motion.div 
                className="typography-shimmer-sweep"
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: '100%', opacity: [0, 0.75, 0] }}
                transition={{ duration: 1.5, delay: 0.65, ease: "easeInOut" }}
              />
            </div>

            {/* Official Tagline */}
            <motion.p
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: '1.05rem',
                fontWeight: 500,
                color: '#4B5563',
                letterSpacing: '0.04em',
                marginTop: '16px',
                textAlign: 'center'
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Where Business Finds Its Way Forward.
            </motion.p>
          </motion.div>

          <motion.div 
            className="hero-action-group"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.button 
              className="btn-liquid-glass-learn-more"
              onClick={() => scrollToSection('sec-problem')}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              aria-label="Learn more about Simpul"
            >
              <span className="btn-glass-text">Learn more</span>
            </motion.button>

            <div className="hero-scroll-prompt" onClick={() => scrollToSection('sec-problem')}>
              <span>Scroll to explore</span>
              <span className="down-arrow">&darr;</span>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          THE PROBLEM
         ══════════════════════════════════════════════════════════════ */}
      <section id="sec-problem" className="manifesto-section sec-theme-problem">
        <div className="section-atmosphere atmosphere-problem" aria-hidden="true" />
        
        <div className="manifesto-container">
          
          <motion.div className="manifesto-header" {...fadeInUp}>
            <h2 className="manifesto-headline">
              <strong>Growing business.</strong><br />
              <strong>Growing complexity.</strong>
            </h2>
            <p className="manifesto-lead">
              As your business grows, operations become harder to control.
            </p>
          </motion.div>

          <div className="manifesto-linear-list">
            {[
              { num: '01', title: 'Scattered Information', desc: 'Orders, updates, and records are spread across chats and spreadsheets.' },
              { num: '02', title: 'Disconnected Production', desc: 'Difficult to track work across different workers and locations.' },
              { num: '03', title: 'Unclear Costs', desc: 'Material, labor, delivery, and operational costs are difficult to monitor together.' },
              { num: '04', title: 'Manual Coordination', desc: 'Too much time is spent checking, updating, and following up on daily operations.' },
            ].map((row, idx) => (
              <motion.div 
                key={row.num} 
                className="manifesto-row"
                initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.65, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="row-num">{row.num}</span>
                <div className="row-body">
                  <h3 className="row-title"><strong>{row.title}</strong></h3>
                  <p className="row-desc">{row.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          THE SOLUTION (Interactive Flow Pipeline)
         ══════════════════════════════════════════════════════════════ */}
      <section id="sec-solution" className="manifesto-section sec-theme-solution">
        <div className="section-atmosphere atmosphere-solution" aria-hidden="true" />

        <div className="manifesto-container">
          
          <motion.div className="manifesto-header" {...fadeInUp}>
            <h2 className="manifesto-headline">
              <strong>One system for the entire operation.</strong>
            </h2>
            <p className="manifesto-lead">
              Simpul connects every moving part of your business into one continuous operational flow.
            </p>
          </motion.div>

          {/* Interactive Liquid Filter Tabs */}
          <motion.div 
            className="fluid-flow-stream-wrap"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="interactive-filter-tabs-row">
              {flowSteps.map((step, idx) => (
                <button
                  key={step.name}
                  className={`liquid-filter-pill ${activeFlowIndex === idx ? 'pill-active' : ''}`}
                  onClick={() => setActiveFlowIndex(idx)}
                >
                  <span className="pill-num">0{idx + 1}</span>
                  <span className="pill-name">{step.name}</span>
                </button>
              ))}
            </div>

            {/* Dynamic Reveal Display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFlowIndex}
                className="interactive-reveal-card"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="reveal-badge">{flowSteps[activeFlowIndex].tag}</span>
                <p className="reveal-body-text">{flowSteps[activeFlowIndex].desc}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          WHAT WE PROVIDE (Interactive Capability Selector)
         ══════════════════════════════════════════════════════════════ */}
      <section id="sec-provide" className="manifesto-section sec-theme-provide">
        <div className="section-atmosphere atmosphere-provide" aria-hidden="true" />

        <div className="manifesto-container">
          
          <motion.div className="manifesto-header" {...fadeInUp}>
            <h2 className="manifesto-headline">
              <strong>Everything your operation needs.</strong>
            </h2>
          </motion.div>

          {/* Interactive Filter Pills */}
          <div className="interactive-filter-tabs-row provide-filter-pills">
            {provideItems.map((item, idx) => (
              <button
                key={item.num}
                className={`liquid-filter-pill ${activeProvideIndex === idx ? 'pill-active' : ''}`}
                onClick={() => setActiveProvideIndex(idx)}
              >
                <span className="pill-num">{item.num}</span>
                <span className="pill-name">{item.title}</span>
              </button>
            ))}
          </div>

          <div className="provide-editorial-stack">
            {provideItems.map((item, idx) => (
              <motion.div 
                key={item.num}
                className={`provide-stack-row ${activeProvideIndex === idx ? 'stack-active' : ''}`}
                onClick={() => setActiveProvideIndex(idx)}
                onMouseEnter={() => setActiveProvideIndex(idx)}
                initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.65, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="stack-num">{item.num}</span>
                <div className="stack-content">
                  <h3 className="stack-title"><strong>{item.title}</strong></h3>
                  <p className="stack-desc">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          WHY SIMPUL
         ══════════════════════════════════════════════════════════════ */}
      <section id="sec-why" className="manifesto-section sec-theme-why">
        <div className="section-atmosphere atmosphere-why" aria-hidden="true" />

        <div className="manifesto-container">
          
          <motion.div className="manifesto-header" {...fadeInUp}>
            <h2 className="manifesto-headline">
              <strong>Built to connect.</strong><br />
              <strong>Designed to grow.</strong>
            </h2>
          </motion.div>

          <div className="why-editorial-grid">
            {[
              { title: 'Connected Operations', desc: 'Bring your entire operation into one system.' },
              { title: 'Clear Visibility', desc: 'Know what is happening across your business.' },
              { title: 'Flexible Production', desc: 'Expand production capacity through a distributed workforce.' },
              { title: 'Financial Clarity', desc: 'Understand your costs and transactions more clearly.' },
              { title: 'Built for Growth', desc: 'Manage increasing operational complexity without unnecessary processes.', wide: true },
            ].map((block, idx) => (
              <motion.div 
                key={block.title}
                className={`why-text-block ${block.wide ? 'why-block-wide' : ''}`}
                initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.65, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="why-title"><strong>{block.title}</strong></h3>
                <p className="why-desc">{block.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          HOW IT WORKS (Interactive Step Journey)
         ══════════════════════════════════════════════════════════════ */}
      <section id="sec-how" className="manifesto-section sec-theme-how">
        <div className="section-atmosphere atmosphere-how" aria-hidden="true" />

        <div className="manifesto-container">
          
          <motion.div className="manifesto-header" {...fadeInUp}>
            <h2 className="manifesto-headline">
              <strong>From material to financial clarity.</strong>
            </h2>
          </motion.div>

          {/* Interactive Step Switcher */}
          <div className="interactive-filter-tabs-row how-filter-pills">
            {howSteps.map((step, idx) => (
              <button
                key={step.index}
                className={`liquid-filter-pill ${activeHowIndex === idx ? 'pill-active' : ''}`}
                onClick={() => setActiveHowIndex(idx)}
              >
                <span className="pill-num">{step.index}</span>
                <span className="pill-name">{step.title}</span>
              </button>
            ))}
          </div>

          <div className="how-sequence-flow">
            {howSteps.map((step, idx) => (
              <motion.div 
                key={step.index}
                className={`how-step-item ${activeHowIndex === idx ? 'step-item-active' : ''}`}
                onClick={() => setActiveHowIndex(idx)}
                initial={{ opacity: 0, y: 22, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="how-step-index">{step.index}</span>
                  <span style={{ fontSize: '1.25rem', background: '#FFF5F8', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #FBCFE8' }}>
                    {step.icon}
                  </span>
                </div>
                <div style={{ display: 'inline-block', fontSize: '0.66rem', fontWeight: 800, color: '#BE185D', background: '#FDF2F8', padding: '2px 8px', borderRadius: '20px', marginBottom: '8px', letterSpacing: '0.04em' }}>
                  {step.metric}
                </div>
                <h3 className="how-step-title"><strong>{step.title}</strong></h3>
                <p className="how-step-desc">{step.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          WHO WE SERVE (Interactive Stakeholder Matrix)
         ══════════════════════════════════════════════════════════════ */}
      <section id="sec-serve" className="manifesto-section sec-theme-serve">
        <div className="section-atmosphere atmosphere-serve" aria-hidden="true" />

        <div className="manifesto-container">
          
          <motion.div className="manifesto-header" {...fadeInUp}>
            <h2 className="manifesto-headline">
              <strong>Connecting everyone behind the business.</strong>
            </h2>
          </motion.div>

          {/* Interactive Persona Filter Pills */}
          <div className="interactive-filter-tabs-row serve-filter-pills">
            {serveItems.map((item, idx) => (
              <button
                key={item.role}
                className={`liquid-filter-pill ${activeServeIndex === idx ? 'pill-active' : ''}`}
                onClick={() => setActiveServeIndex(idx)}
              >
                <span className="pill-name">{item.role}</span>
              </button>
            ))}
          </div>

          <div className="serve-editorial-list">
            {serveItems.map((item, idx) => (
              <motion.div 
                key={item.role} 
                className={`serve-row ${activeServeIndex === idx ? 'serve-row-active' : ''}`}
                onClick={() => setActiveServeIndex(idx)}
                initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.65, delay: idx * 0.09, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="serve-role-group">
                  <h3 className="serve-role"><strong>{item.role}</strong></h3>
                  <span className="serve-tag-chip">{item.badge}</span>
                </div>
                <p className="serve-desc">{item.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          THE IMPACT
         ══════════════════════════════════════════════════════════════ */}
      <section id="sec-impact" className="manifesto-section sec-theme-impact">
        <div className="section-atmosphere atmosphere-impact" aria-hidden="true" />

        <div className="manifesto-container">
          
          <motion.div className="manifesto-header" {...fadeInUp}>
            <h2 className="manifesto-headline">
              <strong>When operations connect,</strong><br />
              <strong>opportunities grow.</strong>
            </h2>
          </motion.div>

          <div className="impact-editorial-grid">
            {[
              { stakeholder: 'For Businesses', statement: 'Greater capacity, visibility, and operational control.' },
              { stakeholder: 'For Workers', statement: 'More accessible and organized work opportunities.' },
              { stakeholder: 'For Couriers', statement: 'More consistent local delivery opportunities.' },
              { stakeholder: 'For Communities', statement: 'More connected local economic activity.' },
            ].map((block, idx) => (
              <motion.div 
                key={block.stakeholder}
                className="impact-block"
                initial={{ opacity: 0, y: 24, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.65, delay: idx * 0.09, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="impact-stakeholder">{block.stakeholder}</span>
                <p className="impact-statement">{block.statement}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FINAL CTA (Golden Hour Bloom)
         ══════════════════════════════════════════════════════════════ */}
      <section className="manifesto-final-cta-section">
        <div className="section-atmosphere atmosphere-cta" aria-hidden="true" />

        <motion.div 
          className="manifesto-container text-center"
          initial={{ opacity: 0, y: 35, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          
          <h2 className="final-hero-title">
            <strong>Your business has moving parts.</strong><br />
            <strong>Simpul brings them together.</strong>
          </h2>
          <p className="final-hero-sub">
            Connect your business, production, people, logistics, and finance in one system.
          </p>

          <div className="final-cta-btn-wrap">
            <motion.button 
              className="btn-liquid-glass-learn-more btn-final-action"
              onClick={onStartUsingSimpul}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="btn-glass-text">Start Using Simpul &rarr;</span>
            </motion.button>
          </div>

        </motion.div>
      </section>

      {/* ── Contact Us & Support Section ── */}
      <section className="manifesto-contact-section" style={{ padding: '40px 24px', background: 'rgba(255, 255, 255, 0.65)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(24, 24, 27, 0.06)', borderBottom: '1px solid rgba(24, 24, 27, 0.06)' }}>
        <div className="manifesto-container" style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.70rem', fontWeight: 800, color: '#BE185D', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Hubungi Tim Simpul</div>
            <div style={{ fontSize: '1.10rem', fontWeight: 800, color: '#18181B', marginTop: '2px', letterSpacing: '-0.02em' }}>Konsultasi &amp; Bantuan Teknis</div>
            <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '4px' }}>Ada pertanyaan atau ingin integrasi custom? Hubungi tim support kami kapan saja.</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#25D366', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.983.54 1.771.815 2.796.815 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.767-5.768-5.767zm3.391 8.188c-.143.403-.715.742-1.002.775-.27.031-.577.108-1.745-.378-1.493-.622-2.457-2.148-2.531-2.247-.074-.099-.607-.807-.607-1.539 0-.732.384-1.093.52-1.242.137-.149.299-.186.399-.186.1 0 .199.002.285.006.091.004.212-.034.331.252.124.298.423 1.032.46 1.107.037.075.062.162.012.261-.05.099-.075.161-.149.248-.075.087-.157.195-.225.262-.075.075-.153.156-.066.305.087.149.387.638.831 1.032.571.508 1.053.666 1.202.741.149.075.236.062.324-.037.087-.099.373-.434.472-.583.099-.149.199-.124.336-.075.137.05.87.41 1.02.485.149.075.249.112.286.174.037.062.037.36-.106.763z"/></svg>
            </div>
            <div>
              <div style={{ fontSize: '0.70rem', color: '#6B7280', fontWeight: 600 }}>WhatsApp Chat</div>
              <a href="https://wa.me/6281277665544" target="_blank" rel="noreferrer" style={{ fontSize: '0.86rem', fontWeight: 700, color: '#18181B', textDecoration: 'none' }}>
                +62 812-7766-5544
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#18181B', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.1rem' }}>
              ✉️
            </div>
            <div>
              <div style={{ fontSize: '0.70rem', color: '#6B7280', fontWeight: 600 }}>Official Email</div>
              <a href="mailto:hello@simpul.id" style={{ fontSize: '0.86rem', fontWeight: 700, color: '#18181B', textDecoration: 'none' }}>
                hello@simpul.id
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="luxury-editorial-footer">
        <div className="manifesto-container footer-flex">
          <span className="footer-logo">SIMPUL</span>
          <span className="footer-copy">&copy; {new Date().getFullYear()} Simpul OS. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
