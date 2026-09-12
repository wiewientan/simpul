import React, { useState } from 'react';

export default function OnboardingWizard({ show, onClose, onCompleteOnboarding }) {
  const [step, setStep] = useState('account'); // 'account', 1, 2, 3, 4, 5, 'provisioning'
  
  // Account state
  const [accountData, setAccountData] = useState({ email: '', password: '', confirmPassword: '' });

  // Step 1: Company Info
  const [companyInfo, setCompanyInfo] = useState({
    name: 'PT Example Indonesia',
    business_type: 'Garment & Apparel',
    email: 'company@example.com',
    phone: '+62 81234567890',
    address: 'Jl. Industri Utama No. 12',
    city: 'Batam'
  });

  // Step 2: Products
  const [products, setProducts] = useState([
    {
      name: 'Basic T-Shirt',
      category: 'Apparel',
      piece_rate_pay: 5000,
      selling_price: 65000,
      stock_quantity: 120,
      image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop',
      materials: [
        { name: 'Cotton', quantity: '0.5 kg' },
        { name: 'Thread', quantity: '1 unit' }
      ]
    }
  ]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [tempProduct, setTempProduct] = useState({
    name: '', category: 'Apparel', piece_rate_pay: '5000', selling_price: '65000', stock_quantity: '100', image_url: '', description: '',
    materials: [{ name: 'Cotton', quantity: '0.5 kg' }]
  });

  // Step 3: Workers
  const [hasWorkers, setHasWorkers] = useState('yes');
  const [workers, setWorkers] = useState([
    {
      name: 'Siti Rahmawati',
      phone: '+62 85712345671',
      email: 'siti@worker.com',
      category: 'Penjahit Kaos',
      address: 'Sukamaju, Batam',
      worker_id: 'SIM-00001'
    }
  ]);
  const [tempWorker, setTempWorker] = useState({ name: '', phone: '', email: '', category: 'Penjahit', address: '' });

  // Step 4: Delivery Preferences
  const [deliveryPref, setDeliveryPref] = useState({
    pickup: true,
    simpul_delivery: true,
    payment_method: 'E-Wallet',
    enable_tracking: true
  });

  // Step 5: Financial Setup
  const [financeSetup, setFinanceSetup] = useState({
    calc_type: 'Per Item',
    currency: 'IDR - Indonesian Rupiah',
    track_income: true,
    track_expenses: true,
    track_worker_payments: true,
    track_delivery_expenses: true
  });

  // Provisioning Animation Checklist Progress
  const [provisionProgress, setProvisionProgress] = useState(0);

  if (!show) return null;

  const handleAccountSubmit = (e) => {
    e.preventDefault();
    if (accountData.password !== accountData.confirmPassword) {
      alert('Password dan Konfirmasi Password tidak cocok!');
      return;
    }
    setStep(1);
  };

  const handleAddMaterialToTemp = () => {
    setTempProduct({
      ...tempProduct,
      materials: [...tempProduct.materials, { name: '', quantity: '' }]
    });
  };

  const handleSaveProductModal = (e) => {
    e.preventDefault();
    setProducts([...products, { ...tempProduct }]);
    setShowProductModal(false);
    setTempProduct({
      name: '', category: 'Apparel', piece_rate_pay: '5000', selling_price: '65000', stock_quantity: '100', image_url: '', description: '',
      materials: [{ name: 'Cotton', quantity: '0.5 kg' }]
    });
  };

  const handleAddWorker = (e) => {
    e.preventDefault();
    const nextCode = `SIM-${String(workers.length + 1).padStart(5, '0')}`;
    setWorkers([...workers, { ...tempWorker, worker_id: nextCode }]);
    setTempWorker({ name: '', phone: '', email: '', category: 'Penjahit', address: '' });
  };

  const handleStartProvisioning = () => {
    setStep('provisioning');
    setProvisionProgress(0);

    const interval = setInterval(() => {
      setProvisionProgress((prev) => {
        if (prev >= 6) {
          clearInterval(interval);
          return 6;
        }
        return prev + 1;
      });
    }, 600);
  };

  const handleFinalEnterWorkspace = async () => {
    const payload = {
      account: accountData,
      company: companyInfo,
      products,
      workers,
      delivery: deliveryPref,
      finance: financeSetup
    };

    try {
      const res = await fetch('http://localhost:5000/api/auth/register-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      onCompleteOnboarding(data.company || { id: 'comp-new', name: companyInfo.name });
    } catch (err) {
      onCompleteOnboarding({ id: 'comp-new', name: companyInfo.name });
    }
    onClose();
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(24,20,15,0.7)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg" style={{ background: 'var(--surface)' }}>
          
          {/* Header */}
          <div className="modal-header border-bottom px-4 py-3" style={{ borderColor: 'var(--border)' }}>
            <div>
              <span className="badge px-2 py-1 text-uppercase font-monospace mb-1" style={{ background: 'var(--custard)', color: 'var(--jam-dark)' }}>
                SIMPUL SAAS ONBOARDING
              </span>
              <h4 className="modal-title fw-bold mb-0" style={{ fontFamily: 'var(--serif)', color: 'var(--jam)' }}>
                {step === 'account' && 'Create Your Simpul Account'}
                {typeof step === 'number' && `Set Up Your Business Workspace`}
                {step === 'provisioning' && 'Generating Your Simpul Workspace...'}
              </h4>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4">

            {/* ACCOUNT CREATION */}
            {step === 'account' && (
              <form onSubmit={handleAccountSubmit}>
                <div className="text-center mb-4">
                  <h5 className="fw-bold">Start Using Simpul</h5>
                  <p className="text-muted small">Enter your login credentials to initialize your business account.</p>
                </div>
                <div className="mb-3">
                  <label className="small text-uppercase fw-bold text-muted">Company Email</label>
                  <input type="email" className="form-control" required placeholder="admin@company.com" value={accountData.email} onChange={e => setAccountData({ ...accountData, email: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="small text-uppercase fw-bold text-muted">Password</label>
                  <input type="password" className="form-control" required placeholder="••••••••" value={accountData.password} onChange={e => setAccountData({ ...accountData, password: e.target.value })} />
                </div>
                <div className="mb-4">
                  <label className="small text-uppercase fw-bold text-muted">Confirm Password</label>
                  <input type="password" className="form-control" required placeholder="••••••••" value={accountData.confirmPassword} onChange={e => setAccountData({ ...accountData, confirmPassword: e.target.value })} />
                </div>
                <button type="submit" className="btn-simpul-jam w-100 py-2 fs-6">
                  Create Account &amp; Start Business Setup →
                </button>
              </form>
            )}

            {/* STEP 1: COMPANY INFO */}
            {step === 1 && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <span className="fw-bold text-dark fs-6">Step 1 — Tell us about your company</span>
                  <span className="badge bg-light text-dark border font-monospace">Progress: 1 of 5</span>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="small fw-bold text-muted">Company Name</label>
                    <input type="text" className="form-control" value={companyInfo.name} onChange={e => setCompanyInfo({ ...companyInfo, name: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="small fw-bold text-muted">Business Type</label>
                    <select className="form-select" value={companyInfo.business_type} onChange={e => setCompanyInfo({ ...companyInfo, business_type: e.target.value })}>
                      <option value="Garment & Apparel">Garment &amp; Apparel</option>
                      <option value="Footwear & Leather">Sepatu &amp; Barang Kulit</option>
                      <option value="Handicrafts & Artisanal">Kerajinan Tangan</option>
                      <option value="General Manufacturing">Manufaktur Umum</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="small fw-bold text-muted">Company Email</label>
                    <input type="email" className="form-control" value={companyInfo.email} onChange={e => setCompanyInfo({ ...companyInfo, email: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="small fw-bold text-muted">Phone Number</label>
                    <input type="text" className="form-control" value={companyInfo.phone} onChange={e => setCompanyInfo({ ...companyInfo, phone: e.target.value })} />
                  </div>
                  <div className="col-md-8">
                    <label className="small fw-bold text-muted">Business Address</label>
                    <input type="text" className="form-control" value={companyInfo.address} onChange={e => setCompanyInfo({ ...companyInfo, address: e.target.value })} />
                  </div>
                  <div className="col-md-4">
                    <label className="small fw-bold text-muted">City</label>
                    <select className="form-select" value={companyInfo.city} onChange={e => setCompanyInfo({ ...companyInfo, city: e.target.value })}>
                      <option value="Batam">Batam</option>
                      <option value="Bandung">Bandung</option>
                      <option value="Jakarta">Jakarta</option>
                      <option value="Surabaya">Surabaya</option>
                      <option value="Solo">Solo</option>
                    </select>
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                  <button className="btn-simpul-outline-brand" onClick={() => setStep('account')}>Back</button>
                  <button className="btn-simpul-jam" onClick={() => setStep(2)}>Continue →</button>
                </div>
              </div>
            )}

            {/* STEP 2: PRODUCTS */}
            {step === 2 && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <span className="fw-bold text-dark fs-6">Step 2 — What does your business produce?</span>
                  <span className="badge bg-light text-dark border font-monospace">Progress: 2 of 5</span>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <p className="small text-muted mb-0">Add initial products to seed your catalog.</p>
                  <button className="btn btn-sm btn-simpul-jam" onClick={() => setShowProductModal(true)}>+ Add Product</button>
                </div>

                <div className="row g-3 mb-3">
                  {products.map((p, idx) => (
                    <div className="col-md-6" key={idx}>
                      <div className="simpul-card p-3 d-flex gap-3 align-items-center">
                        <img src={p.image_url || 'https://via.placeholder.com/60'} alt={p.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                        <div>
                          <h6 className="fw-bold mb-1">{p.name}</h6>
                          <div className="small text-muted">Category: {p.category}</div>
                          <div className="small text-danger fw-bold">Rate: Rp {Number(p.piece_rate_pay).toLocaleString('id-ID')}/item</div>
                          <div className="small text-muted">Stock: {p.stock_quantity} pcs</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                  <button className="btn-simpul-outline-brand" onClick={() => setStep(1)}>Back</button>
                  <button className="btn-simpul-jam" onClick={() => setStep(3)}>Continue →</button>
                </div>
              </div>
            )}

            {/* STEP 3: WORKFORCE */}
            {step === 3 && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <span className="fw-bold text-dark fs-6">Step 3 — Add your workers</span>
                  <span className="badge bg-light text-dark border font-monospace">Progress: 3 of 5</span>
                </div>

                <div className="mb-3">
                  <label className="fw-bold mb-2">Do you already have workers?</label>
                  <div className="d-flex gap-3">
                    <button className={`btn ${hasWorkers === 'yes' ? 'btn-simpul-jam' : 'btn-simpul-outline-brand'}`} onClick={() => setHasWorkers('yes')}>
                      Yes, I'll add workers
                    </button>
                    <button className={`btn ${hasWorkers === 'later' ? 'btn-simpul-jam' : 'btn-simpul-outline-brand'}`} onClick={() => setHasWorkers('later')}>
                      I'll do this later
                    </button>
                  </div>
                </div>

                {hasWorkers === 'yes' && (
                  <div>
                    <form onSubmit={handleAddWorker} className="p-3 bg-light rounded border mb-3">
                      <div className="row g-2">
                        <div className="col-md-6">
                          <input type="text" className="form-control form-control-sm" placeholder="Worker Name" required value={tempWorker.name} onChange={e => setTempWorker({ ...tempWorker, name: e.target.value })} />
                        </div>
                        <div className="col-md-6">
                          <input type="text" className="form-control form-control-sm" placeholder="Phone Number" required value={tempWorker.phone} onChange={e => setTempWorker({ ...tempWorker, phone: e.target.value })} />
                        </div>
                        <div className="col-md-6">
                          <input type="text" className="form-control form-control-sm" placeholder="Production Skill (e.g. Sewing)" value={tempWorker.category} onChange={e => setTempWorker({ ...tempWorker, category: e.target.value })} />
                        </div>
                        <div className="col-md-6">
                          <input type="text" className="form-control form-control-sm" placeholder="Village / Address" value={tempWorker.address} onChange={e => setTempWorker({ ...tempWorker, address: e.target.value })} />
                        </div>
                        <div className="col-12 text-end">
                          <button type="submit" className="btn btn-sm btn-simpul-jam">+ Add Worker</button>
                        </div>
                      </div>
                    </form>

                    <div className="table-responsive">
                      <table className="table table-hover align-middle small">
                        <thead>
                          <tr className="text-muted">
                            <th>Worker ID</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Access</th>
                          </tr>
                        </thead>
                        <tbody>
                          {workers.map((w, idx) => (
                            <tr key={idx}>
                              <td><code className="fw-bold">{w.worker_id}</code></td>
                              <td className="fw-bold">{w.name}</td>
                              <td>{w.phone}</td>
                              <td><span className="badge bg-warning text-dark">Pending Activation</span></td>
                              <td><span className="badge bg-success">Generated</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                  <button className="btn-simpul-outline-brand" onClick={() => setStep(2)}>Back</button>
                  <button className="btn-simpul-jam" onClick={() => setStep(4)}>Continue →</button>
                </div>
              </div>
            )}

            {/* STEP 4: DELIVERIES */}
            {step === 4 && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <span className="fw-bold text-dark fs-6">Step 4 — How do you handle deliveries?</span>
                  <span className="badge bg-light text-dark border font-monospace">Progress: 4 of 5</span>
                </div>

                <label className="fw-bold mb-2">How should materials reach your workers?</label>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div
                      className={`p-3 rounded border cursor-pointer ${deliveryPref.pickup ? 'border-danger bg-light' : ''}`}
                      onClick={() => setDeliveryPref({ ...deliveryPref, pickup: !deliveryPref.pickup })}
                    >
                      <h6 className="fw-bold mb-1">Company Pickup</h6>
                      <p className="small text-muted mb-0">Workers collect materials directly from the company hub.</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div
                      className={`p-3 rounded border cursor-pointer ${deliveryPref.simpul_delivery ? 'border-danger bg-light' : ''}`}
                      onClick={() => setDeliveryPref({ ...deliveryPref, simpul_delivery: !deliveryPref.simpul_delivery })}
                    >
                      <h6 className="fw-bold mb-1">Simpul Delivery</h6>
                      <p className="small text-muted mb-0">Simpul coordinates delivery from your company to workers.</p>
                    </div>
                  </div>
                </div>

                {deliveryPref.simpul_delivery && (
                  <div className="p-3 border rounded bg-white">
                    <div className="mb-2">
                      <label className="small fw-bold text-muted">Preferred Delivery Payment</label>
                      <select className="form-select form-select-sm" value={deliveryPref.payment_method} onChange={e => setDeliveryPref({ ...deliveryPref, payment_method: e.target.value })}>
                        <option value="E-Wallet">E-Wallet (GoPay, OVO)</option>
                        <option value="Company Balance">Company Balance</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-check mt-2">
                      <input className="form-check-input" type="checkbox" checked={deliveryPref.enable_tracking} onChange={e => setDeliveryPref({ ...deliveryPref, enable_tracking: e.target.checked })} />
                      <label className="form-check-label small fw-bold">Enable delivery tracking for couriers</label>
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                  <button className="btn-simpul-outline-brand" onClick={() => setStep(3)}>Back</button>
                  <button className="btn-simpul-jam" onClick={() => setStep(5)}>Continue →</button>
                </div>
              </div>
            )}

            {/* STEP 5: FINANCIAL SETUP */}
            {step === 5 && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <span className="fw-bold text-dark fs-6">Step 5 — Financial setup</span>
                  <span className="badge bg-light text-dark border font-monospace">Progress: 5 of 5</span>
                </div>

                <div className="mb-3">
                  <label className="small fw-bold text-muted">How do you calculate worker payments?</label>
                  <div className="row g-2 mt-1">
                    {['Per Item', 'Per Task', 'Fixed Rate', 'Mixed'].map(type => (
                      <div className="col-6" key={type}>
                        <button
                          type="button"
                          className={`btn btn-sm w-100 ${financeSetup.calc_type === type ? 'btn-simpul-jam' : 'btn-simpul-outline-brand'}`}
                          onClick={() => setFinanceSetup({ ...financeSetup, calc_type: type })}
                        >
                          {type}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="small fw-bold text-muted">Default Currency</label>
                  <input type="text" className="form-control form-control-sm" readOnly value={financeSetup.currency} />
                </div>

                <div className="p-3 border rounded bg-light">
                  <div className="small fw-bold text-muted mb-2">FINANCIAL TRACKING PREFERENCES</div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={financeSetup.track_income} onChange={e => setFinanceSetup({ ...financeSetup, track_income: e.target.checked })} />
                    <label className="form-check-label small">Track business income</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={financeSetup.track_expenses} onChange={e => setFinanceSetup({ ...financeSetup, track_expenses: e.target.checked })} />
                    <label className="form-check-label small">Track business expenses</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={financeSetup.track_worker_payments} onChange={e => setFinanceSetup({ ...financeSetup, track_worker_payments: e.target.checked })} />
                    <label className="form-check-label small">Track worker payments</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={financeSetup.track_delivery_expenses} onChange={e => setFinanceSetup({ ...financeSetup, track_delivery_expenses: e.target.checked })} />
                    <label className="form-check-label small">Track delivery expenses</label>
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-4 pt-3 border-top">
                  <button className="btn-simpul-outline-brand" onClick={() => setStep(4)}>Back</button>
                  <button className="btn-simpul-jam" onClick={handleStartProvisioning}>
                    Create My Workspace →
                  </button>
                </div>
              </div>
            )}

            {/* STEP: PROVISIONING SCREEN */}
            {step === 'provisioning' && (
              <div className="text-center py-4">
                <div className="mb-3">
                  <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
                <h4 className="fw-bold mb-1 font-serif text-dark">Your Simpul workspace is being prepared.</h4>
                <p className="text-muted small mb-4">We're organizing your business information and setting up your workspace.</p>

                <div className="p-4 border rounded bg-light text-start mx-auto font-monospace text-sm" style={{ maxWidth: '480px' }}>
                  <div className={`mb-2 ${provisionProgress >= 1 ? 'text-success fw-bold' : 'text-muted'}`}>
                    {provisionProgress >= 1 ? '✓' : '○'} Company profile created
                  </div>
                  <div className={`mb-2 ${provisionProgress >= 2 ? 'text-success fw-bold' : 'text-muted'}`}>
                    {provisionProgress >= 2 ? '✓' : '○'} Product catalog initialized
                  </div>
                  <div className={`mb-2 ${provisionProgress >= 3 ? 'text-success fw-bold' : 'text-muted'}`}>
                    {provisionProgress >= 3 ? '✓' : '○'} Production settings configured
                  </div>
                  <div className={`mb-2 ${provisionProgress >= 4 ? 'text-success fw-bold' : 'text-muted'}`}>
                    {provisionProgress >= 4 ? '✓' : '○'} Workforce workspace prepared
                  </div>
                  <div className={`mb-2 ${provisionProgress >= 5 ? 'text-success fw-bold' : 'text-muted'}`}>
                    {provisionProgress >= 5 ? '✓' : '○'} Delivery settings configured
                  </div>
                  <div className={`mb-2 ${provisionProgress >= 6 ? 'text-success fw-bold' : 'text-muted'}`}>
                    {provisionProgress >= 6 ? '✓' : '○'} Financial tracking initialized
                  </div>
                </div>

                {provisionProgress >= 6 && (
                  <button className="btn-simpul-jam btn-lg mt-4 shadow-sm" onClick={handleFinalEnterWorkspace}>
                    Enter My Workspace →
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Product Modal Popup */}
      {showProductModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Add Product</h5>
                <button type="button" className="btn-close" onClick={() => setShowProductModal(false)}></button>
              </div>
              <form onSubmit={handleSaveProductModal}>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="small fw-bold text-muted">Product Name</label>
                    <input type="text" className="form-control form-control-sm" required placeholder="Basic T-Shirt" value={tempProduct.name} onChange={e => setTempProduct({ ...tempProduct, name: e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <label className="small fw-bold text-muted">Category</label>
                    <select className="form-select form-select-sm" value={tempProduct.category} onChange={e => setTempProduct({ ...tempProduct, category: e.target.value })}>
                      <option value="Apparel">Apparel</option>
                      <option value="Footwear">Footwear</option>
                      <option value="Crafts">Crafts</option>
                    </select>
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <label className="small fw-bold text-muted">Production Rate/Item</label>
                      <input type="number" className="form-control form-control-sm" required placeholder="5000" value={tempProduct.piece_rate_pay} onChange={e => setTempProduct({ ...tempProduct, piece_rate_pay: e.target.value })} />
                    </div>
                    <div className="col-6">
                      <label className="small fw-bold text-muted">Current Stock</label>
                      <input type="number" className="form-control form-control-sm" placeholder="120" value={tempProduct.stock_quantity} onChange={e => setTempProduct({ ...tempProduct, stock_quantity: e.target.value })} />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="small fw-bold text-muted">Image URL</label>
                    <input type="text" className="form-control form-control-sm" placeholder="https://..." value={tempProduct.image_url} onChange={e => setTempProduct({ ...tempProduct, image_url: e.target.value })} />
                  </div>

                  <div className="border-top pt-2 mt-2">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small fw-bold text-muted">Materials Required</span>
                      <button type="button" className="btn btn-sm btn-link text-danger p-0" onClick={handleAddMaterialToTemp}>+ Add Material</button>
                    </div>
                    {tempProduct.materials.map((m, mIdx) => (
                      <div className="row g-1 mb-1" key={mIdx}>
                        <div className="col-7">
                          <input type="text" className="form-control form-control-sm" placeholder="Material Name" value={m.name} onChange={e => {
                            const newMats = [...tempProduct.materials];
                            newMats[mIdx].name = e.target.value;
                            setTempProduct({ ...tempProduct, materials: newMats });
                          }} />
                        </div>
                        <div className="col-5">
                          <input type="text" className="form-control form-control-sm" placeholder="Qty / Item" value={m.quantity} onChange={e => {
                            const newMats = [...tempProduct.materials];
                            newMats[mIdx].quantity = e.target.value;
                            setTempProduct({ ...tempProduct, materials: newMats });
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setShowProductModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-sm btn-simpul-jam">Save Product</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
