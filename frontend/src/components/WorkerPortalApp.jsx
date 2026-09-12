import React, { useState } from 'react';

export default function WorkerPortalApp() {
  const [workerInfo, setWorkerInfo] = useState({
    name: 'Siti Rahmawati',
    phone: '085712345671',
    village: 'Desa Sukamaju, Soreang',
    skills: 'Penjahit Kaos & Finishing',
    payout_method: 'GoPay',
    payout_account: '085712345671'
  });

  const [tasks, setTasks] = useState([
    {
      id: 'wo-101',
      code: 'ORD-2026-SEW-001',
      product_name: 'Kaos Polos Premium Cotton 30s',
      quantity: 50,
      piece_rate: 8500,
      total_pay: 425000,
      start_date: '2026-09-01',
      target_date: '2026-09-08',
      completed_date: '2026-09-07',
      status: 'qc_passed',
      proof_photo_url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop'
    },
    {
      id: 'wo-102',
      code: 'ORD-2026-SEW-003',
      product_name: 'Kemeja Casual Linen Organic',
      quantity: 25,
      piece_rate: 17500,
      total_pay: 437500,
      start_date: '2026-09-06',
      target_date: '2026-09-13',
      completed_date: null,
      status: 'in_production',
      proof_photo_url: null
    }
  ]);

  const [activeTab, setActiveTab] = useState('tasks');
  const [photoInput, setPhotoInput] = useState('');

  const formatCurrency = (n) => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');

  const handleUploadProof = (taskId) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'qc_passed',
          completed_date: new Date().toISOString().split('T')[0],
          proof_photo_url: photoInput || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop'
        };
      }
      return t;
    }));
    setPhotoInput('');
    alert('Bukti pengerjaan foto berhasil dikirim ke Admin Hub untuk Quality Control!');
  };

  const totalEarned = tasks
    .filter(t => t.status === 'qc_passed' || t.status === 'paid')
    .reduce((sum, t) => sum + t.total_pay, 0);

  return (
    <div className="container py-4" style={{ maxWidth: '600px' }}>
      {/* Worker Header Card */}
      <div className="simpul-card mb-4" style={{ background: 'var(--surface-2)', borderLeft: '5px solid var(--jam)' }}>
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-4"
            style={{ width: 50, height: 50, background: 'var(--jam)' }}
          >
            {workerInfo.name[0]}
          </div>
          <div>
            <h4 className="fw-bold mb-0" style={{ fontFamily: 'var(--serif)' }}>{workerInfo.name}</h4>
            <span className="small text-muted">{workerInfo.village} • {workerInfo.skills}</span>
          </div>
        </div>
      </div>

      {/* Worker Tab Navigation */}
      <div className="d-flex border-bottom mb-3" style={{ borderColor: 'var(--border)' }}>
        <div className={`tab-nav-item flex-fill text-center ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>
          Tugas Produksi ({tasks.length})
        </div>
        <div className={`tab-nav-item flex-fill text-center ${activeTab === 'earnings' ? 'active' : ''}`} onClick={() => setActiveTab('earnings')}>
          Pendapatan Jahit ({formatCurrency(totalEarned)})
        </div>
      </div>

      {/* TASKS VIEW */}
      {activeTab === 'tasks' && (
        <div className="d-flex flex-column gap-3">
          {tasks.map(task => (
            <div className="simpul-card" key={task.id}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="font-monospace fw-bold text-danger fs-6">{task.code}</span>
                <span className={`badge-status badge-${task.status}`}>{task.status.replace('_', ' ')}</span>
              </div>

              <h5 className="fw-bold mb-1">{task.product_name}</h5>

              <div className="row g-2 my-2 py-2 bg-light rounded text-center small border">
                <div className="col-6 border-end">
                  <span className="text-muted">Tanggal Mulai:</span><br />
                  <span className="fw-bold text-dark">{task.start_date}</span>
                </div>
                <div className="col-6">
                  <span className="text-muted">Tanggal Jadi (Target):</span><br />
                  <span className="fw-bold text-danger">{task.target_date}</span>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center my-2">
                <div>
                  <span className="small text-muted">Jumlah Jahit:</span><br />
                  <span className="fw-bold fs-5">{task.quantity} Pcs</span>
                </div>
                <div className="text-end">
                  <span className="small text-muted">Upah per Item:</span><br />
                  <span className="fw-bold text-dark">{formatCurrency(task.piece_rate)}</span>
                </div>
                <div className="text-end">
                  <span className="small text-muted">Total Pendapatan:</span><br />
                  <span className="fw-bold text-success fs-5">{formatCurrency(task.total_pay)}</span>
                </div>
              </div>

              {/* Proof Photo & Completion Form */}
              {task.status !== 'qc_passed' && task.status !== 'paid' ? (
                <div className="mt-3 pt-3 border-top">
                  <label className="small fw-bold text-muted mb-1">Bukti Penerimaan / Hasil Foto Jahit</label>
                  <input
                    type="text"
                    className="form-control form-control-sm mb-2"
                    placeholder="Tempel URL foto hasil kerja (https://...)"
                    value={photoInput}
                    onChange={e => setPhotoInput(e.target.value)}
                  />
                  <button className="btn btn-sm btn-simpul-primary w-100" onClick={() => handleUploadProof(task.id)}>
                    Kirim Foto Hasil Kerja &amp; Ajukan Payout
                  </button>
                </div>
              ) : (
                <div className="mt-2 pt-2 border-top">
                  <span className="small text-muted fw-bold">Foto Bukti Terverifikasi:</span>
                  {task.proof_photo_url && (
                    <img src={task.proof_photo_url} alt="Proof" className="img-fluid rounded mt-2 border" style={{ maxHeight: 150, width: '100%', objectFit: 'cover' }} />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* EARNINGS VIEW */}
      {activeTab === 'earnings' && (
        <div className="simpul-card text-center">
          <span className="text-uppercase small fw-bold text-muted">Total Pendapatan Hasil Jahit</span>
          <h2 className="fw-bold text-success my-2">{formatCurrency(totalEarned)}</h2>
          <p className="small text-muted mb-3">Pendapatan dihitung otomatis berdasarkan jumlah pakaian yang selesai diisi &amp; lulus QC.</p>

          <div className="p-3 bg-light rounded border text-start mb-4">
            <div className="small text-muted mb-1 fw-bold">METODE PENCAIRAN E-WALLET</div>
            <div className="d-flex justify-content-between align-items-center">
              <span className="fw-bold text-dark">{workerInfo.payout_method} ({workerInfo.payout_account})</span>
              <span className="badge bg-success">TERHUBUNG</span>
            </div>
          </div>

          <button className="btn btn-simpul-primary w-100" onClick={() => alert(`Pencairan sebesar ${formatCurrency(totalEarned)} ke ${workerInfo.payout_method} berhasil diproses!`)}>
            Tarik Saldo ke {workerInfo.payout_method}
          </button>
        </div>
      )}
    </div>
  );
}
