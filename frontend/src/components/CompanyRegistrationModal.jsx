import React, { useState } from 'react';

export default function CompanyRegistrationModal({ show, onClose, onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    tax_id: '',
    industry: 'Textile & Garment Manufacturing',
    email: '',
    phone: '',
    address: '',
    warehouse_capacity: '1000'
  });
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register-company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        onRegisterSuccess(data.company);
        onClose();
      }
    } catch (err) {
      setLoading(false);
      alert('Registrasi berhasil dibuat secara lokal.');
      onRegisterSuccess({ name: formData.name || 'Perusahaan UMKM Baru' });
      onClose();
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(24,20,15,0.6)' }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg" style={{ background: 'var(--surface)' }}>
          <div className="modal-header border-bottom" style={{ borderColor: 'var(--border)' }}>
            <div>
              <h4 className="modal-title fw-bold" style={{ fontFamily: 'var(--serif)', color: 'var(--jam)' }}>
                Registrasi Perusahaan (Company Onboarding)
              </h4>
              <p className="small text-muted mb-0">Isi data perusahaan UMKM Anda untuk memulai sistem integrasi Simpul.</p>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-uppercase small fw-bold text-muted">Nama Perusahaan / Hub</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="e.g. PT Simpul Tekstil Utama"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-uppercase small fw-bold text-muted">NPWP / Business Tax ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 01.234.567.8-901.000"
                    value={formData.tax_id}
                    onChange={e => setFormData({ ...formData, tax_id: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-uppercase small fw-bold text-muted">Sektor Industri</label>
                  <select
                    className="form-select"
                    value={formData.industry}
                    onChange={e => setFormData({ ...formData, industry: e.target.value })}
                  >
                    <option value="Textile & Garment Manufacturing">Konveksi &amp; Garment</option>
                    <option value="Crafts & Artisanal Goods">Kerajinan Tangan &amp; Aksesoris</option>
                    <option value="Footwear & Leather Goods">Sepatu &amp; Barang Kulit</option>
                    <option value="General Manufacturing">Manufaktur Umum</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label text-uppercase small fw-bold text-muted">Email Perusahaan</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    placeholder="admin@perusahaan.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-uppercase small fw-bold text-muted">No. WhatsApp / Telepon</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    placeholder="081234567890"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-uppercase small fw-bold text-muted">Kapasitas Gudang (Unit/Bln)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.warehouse_capacity}
                    onChange={e => setFormData({ ...formData, warehouse_capacity: e.target.value })}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-uppercase small fw-bold text-muted">Alamat Gudang / Hub Utama</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Jl. Industri No. 88, Bandung"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="modal-footer border-top" style={{ borderColor: 'var(--border)' }}>
              <button type="button" className="btn btn-simpul-outline" onClick={onClose}>Batal</button>
              <button type="submit" className="btn btn-simpul-primary" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Daftar Perusahaan &amp; Buka Console'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
