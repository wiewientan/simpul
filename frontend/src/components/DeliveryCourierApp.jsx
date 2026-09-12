import React, { useState, useEffect } from 'react';

export default function DeliveryCourierApp() {
  const [deliveries, setDeliveries] = useState([
    {
      id: 'del-1',
      delivery_code: 'DEL-2026-0901-01',
      work_order_code: 'ORD-2026-SEW-001',
      type: 'raw_material_drop',
      pickup_address: 'Hub Utama Simpul, Jl. Industri No. 88',
      destination_address: 'Rumah Siti Rahmawati, Desa Sukamaju, Soreang',
      recipient_name: 'Siti Rahmawati',
      recipient_phone: '085712345671',
      delivery_fee: 18000,
      e_wallet_method: 'GoPay',
      status: 'in_transit',
      proof_photo_url: null
    },
    {
      id: 'del-2',
      delivery_code: 'DEL-2026-0905-02',
      work_order_code: 'ORD-2026-SEW-002',
      type: 'raw_material_drop',
      pickup_address: 'Hub Utama Simpul, Jl. Industri No. 88',
      destination_address: 'Rumah Asep Sunandar, Desa Ciwidey',
      recipient_name: 'Asep Sunandar',
      recipient_phone: '081398765432',
      delivery_fee: 22000,
      e_wallet_method: 'GoPay',
      status: 'pending',
      proof_photo_url: null
    }
  ]);

  const [activeTab, setActiveTab] = useState('tasks');
  const [photoInput, setPhotoInput] = useState('');

  const formatCurrency = (n) => 'Rp ' + (Number(n) || 0).toLocaleString('id-ID');

  const updateStatus = (id, newStatus) => {
    setDeliveries(deliveries.map(d => {
      if (d.id === id) {
        return {
          ...d,
          status: newStatus,
          proof_photo_url: photoInput || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop'
        };
      }
      return d;
    }));
  };

  const totalFeeEarned = deliveries
    .filter(d => d.status === 'delivered')
    .reduce((sum, d) => sum + d.delivery_fee, 0);

  return (
    <div className="container py-4" style={{ maxWidth: '600px' }}>
      {/* App Header */}
      <div className="simpul-card mb-4 text-center" style={{ background: 'var(--jam-dark)', color: 'var(--custard)' }}>
        <span className="badge bg-warning text-dark mb-2">APLIKASI KURIR DELIVERY</span>
        <h3 className="fw-bold mb-1" style={{ fontFamily: 'var(--serif)' }}>Simpul Express Courier</h3>
        <p className="small mb-0 opacity-75">Armada Pengantaran Bahan Baku &amp; Penjemputan Hasil Jahit</p>
      </div>

      {/* Courier Tab Switcher */}
      <div className="d-flex border-bottom mb-3" style={{ borderColor: 'var(--border)' }}>
        <div className={`tab-nav-item flex-fill text-center ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>
          Tugas Pengiriman ({deliveries.length})
        </div>
        <div className={`tab-nav-item flex-fill text-center ${activeTab === 'earnings' ? 'active' : ''}`} onClick={() => setActiveTab('earnings')}>
          Pendapatan Ongkir
        </div>
      </div>

      {activeTab === 'tasks' && (
        <div className="d-flex flex-column gap-3">
          {deliveries.map(del => (
            <div className="simpul-card" key={del.id}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="font-monospace fw-bold text-danger">{del.delivery_code}</span>
                <span className={`badge-status badge-${del.status}`}>{del.status.replace('_', ' ')}</span>
              </div>

              <h5 className="fw-bold mb-2">Order Ref: {del.work_order_code}</h5>

              <div className="p-3 bg-light rounded border mb-3 small">
                <div className="mb-2">
                  <span className="text-muted fw-bold">DARI (PICKUP):</span><br />
                  <span className="fw-bold text-dark">{del.pickup_address}</span>
                </div>
                <div className="mb-2">
                  <span className="text-muted fw-bold">TUJUAN (DELIVERY):</span><br />
                  <span className="fw-bold text-dark">{del.destination_address}</span>
                </div>
                <div>
                  <span className="text-muted fw-bold">PENERIMA:</span> {del.recipient_name} ({del.recipient_phone})
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="small text-muted">Ongkir Courier:</span>
                <span className="fw-bold text-success fs-5">{formatCurrency(del.delivery_fee)}</span>
              </div>

              {/* Status Update Controls */}
              {del.status !== 'delivered' && (
                <div>
                  <div className="mb-2">
                    <label className="small text-muted fw-bold">URL Foto Bukti Serah Terima / Penyerahan</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="https://..."
                      value={photoInput}
                      onChange={e => setPhotoInput(e.target.value)}
                    />
                  </div>
                  <div className="d-flex gap-2">
                    {del.status === 'pending' && (
                      <button className="btn btn-sm btn-simpul-outline flex-fill" onClick={() => updateStatus(del.id, 'picked_up')}>
                        Ambil Barang (Pick Up)
                      </button>
                    )}
                    {del.status === 'picked_up' && (
                      <button className="btn btn-sm btn-warning flex-fill text-dark fw-bold" onClick={() => updateStatus(del.id, 'in_transit')}>
                        Mulai Pengantaran (In Transit)
                      </button>
                    )}
                    {del.status === 'in_transit' && (
                      <button className="btn btn-sm btn-simpul-primary flex-fill" onClick={() => updateStatus(del.id, 'delivered')}>
                        Selesai Antar (Delivered) &amp; Foto Bukti
                      </button>
                    )}
                  </div>
                </div>
              )}

              {del.status === 'delivered' && (
                <div className="alert alert-success py-2 px-3 small mb-0">
                  Pengiriman Selesai. Ongkir dimasukkan ke saldo e-wallet GoPay Anda.
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'earnings' && (
        <div className="simpul-card text-center">
          <span className="text-uppercase small fw-bold text-muted">Total Ongkir Terkumpul</span>
          <h2 className="fw-bold text-success my-2">{formatCurrency(totalFeeEarned || 18000)}</h2>
          <p className="small text-muted mb-4">Pembayaran otomatis disalurkan ke akun e-wallet GoPay Kurir Anda.</p>

          <button className="btn btn-simpul-primary w-100" onClick={() => alert('Pencairan ongkir ke GoPay berhasil diproses!')}>
            Cairkan Ongkir ke GoPay
          </button>
        </div>
      )}
    </div>
  );
}
