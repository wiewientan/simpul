import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './CompanyAdminDashboard.css';

// Minimalist Clean SVG Icons
const IconOverview = () => (
  <svg className="nav-icon-svg" viewBox="0 0 24 24" stroke="currentColor" fill="none">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

const IconWorkOrders = () => (
  <svg className="nav-icon-svg" viewBox="0 0 24 24" stroke="currentColor" fill="none">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const IconProducts = () => (
  <svg className="nav-icon-svg" viewBox="0 0 24 24" stroke="currentColor" fill="none">
    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const IconMaterials = () => (
  <svg className="nav-icon-svg" viewBox="0 0 24 24" stroke="currentColor" fill="none">
    <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const IconWorkers = () => (
  <svg className="nav-icon-svg" viewBox="0 0 24 24" stroke="currentColor" fill="none">
    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const IconFinance = () => (
  <svg className="nav-icon-svg" viewBox="0 0 24 24" stroke="currentColor" fill="none">
    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconSettings = () => (
  <svg className="nav-icon-svg" viewBox="0 0 24 24" stroke="currentColor" fill="none">
    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconSalesOrder = () => (
  <svg className="nav-icon-svg" viewBox="0 0 24 24" stroke="currentColor" fill="none">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const IconDisputes = () => (
  <svg className="nav-icon-svg" viewBox="0 0 24 24" stroke="currentColor" fill="none">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IconWhatsApp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

const IconQC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
  </svg>
);

const IconDoc = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const IconLogout = () => (
  <svg style={{ width: '14px', height: '14px' }} viewBox="0 0 24 24" stroke="currentColor" fill="none">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const IconEmpty = () => (
  <svg style={{ width: '28px', height: '28px', strokeWidth: '1.25' }} viewBox="0 0 24 24" stroke="currentColor" fill="none">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);

const TabIconHelper = ({ type }) => {
  switch (type) {
    case 'overview':
      return <IconOverview />;
    case 'salesorders':
      return <IconSalesOrder />;
    case 'workorders':
      return <IconWorkOrders />;
    case 'products':
      return <IconProducts />;
    case 'materials':
      return <IconMaterials />;
    case 'workers':
      return <IconWorkers />;
    case 'finance':
      return <IconFinance />;
    case 'disputes':
      return <IconDisputes />;
    case 'settings-profile':
      return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case 'settings-operations':
      return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>;
    case 'settings-payment':
      return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
    case 'settings-team':
      return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
    case 'settings-notifications':
      return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>;
    default:
      return <IconOverview />;
  }
};

export default function CompanyAdminDashboard({ companyName, companyId, registeredCompany, onLogout }) {
  // Multi-Tab State (Google Chrome Workspace model)
  const [openTabs, setOpenTabs] = useState([
    { id: 'overview', title: 'Ringkasan', iconType: 'overview', closable: false }
  ]);
  const [activeTabId, setActiveTabId] = useState('overview');
  
  // Settings Accordion/Dropdown state in sidebar
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [chartViewMode, setChartViewMode] = useState('revenue');
  
  // Real SME Garment / Convection SOP Profile & Configuration State
  const [companySettings, setCompanySettings] = useState({
    companyName: registeredCompany?.name || companyName || 'PT Simpul Fashion',
    brandName: registeredCompany?.brandName || 'Simpul Apparel',
    businessType: registeredCompany?.businessType || 'CV (Persekutuan Komanditer)',
    businessSector: registeredCompany?.businessSector || 'Konveksi & Pakaian Jadi',
    nib: registeredCompany?.nib || '',
    businessDescription: registeredCompany?.businessDescription || '',
    yearEstablished: registeredCompany?.yearEstablished || '2023',
    businessSize: registeredCompany?.businessSize || 'Usaha Kecil (5 - 19 Penjahit)',
    picName: registeredCompany?.picName || '',
    picRole: registeredCompany?.picRole || 'Pemilik Usaha',
    workEmail: registeredCompany?.workEmail || '',
    phone: registeredCompany?.phone || '',
    city: registeredCompany?.city || 'Batam',
    address: registeredCompany?.address || '',
    
    productionModel: registeredCompany?.operations?.productionModel || 'Make-to-Order (Sesuai Pesanan Masuk)',
    productionScheme: registeredCompany?.operations?.productionScheme || 'CMT (Cut-Make-Trim / Upah Jahit Saja)',
    workersStructure: registeredCompany?.operations?.workersStructure || 'Mitra Penjahit Rumahan (Borongan)',
    spkPrefix: registeredCompany?.operations?.spkPrefix || 'SPK',
    standardLeadTimeDays: registeredCompany?.operations?.standardLeadTimeDays || '5',
    qcTolerancePct: registeredCompany?.operations?.qcTolerancePct || '3',
    productionLocations: registeredCompany?.operations?.productionLocations || 'Beberapa Kluster Penjahit Rumahan',
    suppliersStructure: registeredCompany?.operations?.suppliersStructure || 'Toko Grosir Kain Lokal',
    courierModel: registeredCompany?.operations?.courierModel || 'Kurir Antar-Jemput Simpul',
    orderVolume: registeredCompany?.operations?.orderVolume || '500 - 2.500 pcs/bulan',

    paymentSchedule: registeredCompany?.config?.paymentSchedule || 'Otomatis per SPK Selesai (Lolos QC)',
    paymentPref: registeredCompany?.config?.paymentPref || 'Transfer Bank Otomatis ke Dompet Penjahit',
    bankName: registeredCompany?.config?.bankName || 'BCA (Bank Central Asia)',
    bankAccountNumber: registeredCompany?.config?.bankAccountNumber || '',
    bankAccountHolder: registeredCompany?.config?.bankAccountHolder || '',
    defectPolicy: registeredCompany?.config?.defectPolicy || 'Koreksi Ulang oleh Penjahit (No Charge)',
    inventoryPref: registeredCompany?.config?.inventoryPref || 'Catat Stok Kain & Barang Jadi',
    financialSettings: registeredCompany?.config?.financialSettings || 'Kalkulasi Otomatis HPP per Potong',
    
    notificationPref: registeredCompany?.config?.notificationPref || 'Notifikasi WhatsApp & Aplikasi',
    notifyOnNewSPK: true,
    notifyOnDeadline: true,
    notifyOnWageReady: true,
    notifyOnLowStock: true,
    customSector: ''
  });

  const [saveSuccessToast, setSaveSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Pengaturan berhasil diperbarui.');

  // Comprehensive Enterprise SME Mock Data
  const [financeData, setFinanceData] = useState({ 
    summary: { grossSales: 148500000, totalExpenses: 89200000, netProfit: 59300000, totalPieceworkPay: 34250000 }, 
    monthlyChartData: [
      { month: 'Apr', revenue: 92000000, expenses: 58000000, profit: 34000000 },
      { month: 'Mei', revenue: 108000000, expenses: 64000000, profit: 44000000 },
      { month: 'Jun', revenue: 125000000, expenses: 76000000, profit: 49000000 },
      { month: 'Jul', revenue: 118000000, expenses: 71000000, profit: 47000000 },
      { month: 'Agu', revenue: 139000000, expenses: 84000000, profit: 55000000 },
      { month: 'Sep', revenue: 148500000, expenses: 89200000, profit: 59300000 }
    ]
  });

  const [materials, setMaterials] = useState([
    { id: 'MAT-001', sku: 'MAT-KATUN-01', name: 'Kain Katun Rayon Twill', category: 'Kain Utama', current_stock: 420, unit: 'yard', unit_cost: 28000, min_stock_alert: 100, supplier_name: 'PT Gajah Tekstil Bandung' },
    { id: 'MAT-002', sku: 'MAT-COMBED-02', name: 'Kain Cotton Combed 30s', category: 'Kain Utama', current_stock: 18, unit: 'kg', unit_cost: 95000, min_stock_alert: 30, supplier_name: 'Knitting Jaya Solo' },
    { id: 'MAT-003', sku: 'MAT-CRINKLE-03', name: 'Kain Crinkle Airflow Premium', category: 'Kain Utama', current_stock: 350, unit: 'meter', unit_cost: 32000, min_stock_alert: 80, supplier_name: 'Surabaya Tekstil Hub' },
    { id: 'MAT-004', sku: 'MAT-KANCING-04', name: 'Kancing Kemeja 18L Putih', category: 'Aksesoris & Trims', current_stock: 14, unit: 'gross', unit_cost: 18000, min_stock_alert: 5, supplier_name: 'Toko Kancing Glodok' },
    { id: 'MAT-005', sku: 'MAT-BENANG-05', name: 'Benang Jahit Astra 40/2', category: 'Benang & Jarum', current_stock: 65, unit: 'roll', unit_cost: 14000, min_stock_alert: 20, supplier_name: 'Benang Indah Sentosa' }
  ]);

  const [products, setProducts] = useState([
    { 
      id: 'PRD-001', 
      sku: 'SKU-KMJ-01', 
      name: 'Kemeja Katun Rayon Pria Casual', 
      category: 'Kemeja & Blouse', 
      photo: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Navy Blue', 'Broken White', 'Sage Green'],
      piece_rate_pay: 25000, 
      selling_price: 135000, 
      unit_cost: 65000,
      stock_quantity: 54,
      min_stock_alert: 20,
      estimated_mins_per_piece: 45,
      bom: [
        { materialId: 'MAT-001', materialName: 'Kain Katun Rayon Twill', usagePerPiece: 1.8, unit: 'yard' },
        { materialId: 'MAT-004', materialName: 'Kancing Kemeja 18L Putih', usagePerPiece: 7, unit: 'pcs' }
      ],
      active: true,
      description: 'Kemeja kasual pria bahan katun rayon premium, adem dan jatuh di badan.'
    },
    { 
      id: 'PRD-002', 
      sku: 'SKU-KOS-02', 
      name: 'Kaos Cotton Combed 30s Polos', 
      category: 'Kaos & Polo', 
      photo: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
      sizes: ['M', 'L', 'XL'],
      colors: ['Jet Black', 'Misty Grey', 'Burgundy'],
      piece_rate_pay: 12000, 
      selling_price: 75000, 
      unit_cost: 35000,
      stock_quantity: 12,
      min_stock_alert: 25,
      estimated_mins_per_piece: 25,
      bom: [
        { materialId: 'MAT-002', materialName: 'Kain Cotton Combed 30s', usagePerPiece: 0.35, unit: 'kg' }
      ],
      active: true,
      description: 'Kaos oblong standar distro dengan jahitan rantai rapi.'
    },
    { 
      id: 'PRD-003', 
      sku: 'SKU-GMS-03', 
      name: 'Gamis Crinkle Airflow Premium', 
      category: 'Gamis & Abaya', 
      photo: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80',
      sizes: ['All Size Fit to XL'],
      colors: ['Dusty Pink', 'Mocca', 'Black Onyx'],
      piece_rate_pay: 38000, 
      selling_price: 185000, 
      unit_cost: 88000,
      stock_quantity: 80,
      min_stock_alert: 15,
      estimated_mins_per_piece: 75,
      bom: [
        { materialId: 'MAT-003', materialName: 'Kain Crinkle Airflow Premium', usagePerPiece: 2.8, unit: 'meter' }
      ],
      active: true,
      description: 'Gamis wanita muslimah dengan tekstur airflow tidak perlu disetrika.'
    }
  ]);

  const [workers, setWorkers] = useState([
    {
      id: 'WRK-001',
      worker_code: 'JHT-0001',
      name: 'Ibu Siti Aminah',
      phone: '6281277665544',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      village: 'Kluster Bengkong Kolam, Batam',
      skills: ['Kemeja & Blouse', 'Gamis & Abaya', 'Jahit Halus & Obras'],
      custom_rate_override: 26000,
      bank_name: 'BCA (Bank Central Asia)',
      bank_account: '8220194821',
      account_holder: 'Siti Aminah',
      status: 'Aktif',
      completed_spk_count: 28,
      qc_pass_rate: 98.6,
      rating: 4.9,
      app_login: { username: 'siti.aminah', temp_pin: '884210' }
    },
    {
      id: 'WRK-002',
      worker_code: 'JHT-0002',
      name: 'Pak Budi Santoso',
      phone: '6281399887766',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      village: 'Kluster Sagulung Mandiri, Batam',
      skills: ['Kaos & Polo', 'Celana Chino & Formal', 'Jahit Rantai'],
      custom_rate_override: 0,
      bank_name: 'Mandiri / GoPay',
      bank_account: '1090018829910',
      account_holder: 'Budi Santoso',
      status: 'Aktif',
      completed_spk_count: 42,
      qc_pass_rate: 97.4,
      rating: 4.8,
      app_login: { username: 'budi.santoso', temp_pin: '339102' }
    },
    {
      id: 'WRK-003',
      worker_code: 'JHT-0003',
      name: 'Ibu Ratna Dewi',
      phone: '6285211223344',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      village: 'Kluster Batu Aji Indah, Batam',
      skills: ['Gamis & Abaya', 'Kemeja & Blouse', 'Bordir & Aksesoris'],
      custom_rate_override: 40000,
      bank_name: 'BRI (Bank Rakyat Indonesia)',
      bank_account: '034101000982501',
      account_holder: 'Ratna Dewi',
      status: 'Aktif',
      completed_spk_count: 19,
      qc_pass_rate: 99.1,
      rating: 5.0,
      app_login: { username: 'ratna.dewi', temp_pin: '551980' }
    }
  ]);

  const [salesOrders, setSalesOrders] = useState([
    { 
      id: 'SO-2026-001', 
      customerName: 'Distro Batam Urban', 
      product: 'Kemeja Katun Rayon Pria Casual', 
      productId: 'PRD-001', 
      quantity: 150, 
      unitPrice: 135000, 
      totalAmount: 20250000, 
      dpAmount: 10000000, 
      paymentStatus: 'DP 50% Diterima', 
      deadline: '2026-09-20', 
      spkIssued: true, 
      spkNumber: 'SPK-2026-001', 
      status: 'Dalam Produksi' 
    },
    { 
      id: 'SO-2026-002', 
      customerName: 'Boutique Hijab Nafisa', 
      product: 'Gamis Crinkle Airflow Premium', 
      productId: 'PRD-003', 
      quantity: 200, 
      unitPrice: 185000, 
      totalAmount: 37000000, 
      dpAmount: 37000000, 
      paymentStatus: 'Lunas 100%', 
      deadline: '2026-09-25', 
      spkIssued: false, 
      status: 'Siap Terbit SPK' 
    },
    { 
      id: 'SO-2026-003', 
      customerName: 'Komunitas Gowes Kepri', 
      product: 'Kaos Cotton Combed 30s Polos', 
      productId: 'PRD-002', 
      quantity: 100, 
      unitPrice: 75000, 
      totalAmount: 7500000, 
      dpAmount: 3750000, 
      paymentStatus: 'DP 50% Diterima', 
      deadline: '2026-09-28', 
      spkIssued: false, 
      status: 'Draft Pesanan' 
    }
  ]);

  const [workOrders, setWorkOrders] = useState([
    {
      id: 'wo-001',
      spk_number: 'SPK-2026-001',
      product_name: 'Kemeja Katun Rayon Pria Casual',
      product_id: 'PRD-001',
      worker_name: 'Ibu Siti Aminah',
      worker_id: 'WRK-001',
      quantity: 100,
      target_date: '2026-09-18',
      status: 'Produksi',
      priority: 'Prioritas Tinggi',
      delivery_type: 'Kurir Antar-Jemput Simpul',
      piece_rate_pay: 26000,
      qc_notes: 'Jahitan stik balik rapi, kancing kuat, tidak ada sisa benang.',
      qc_inspected: true,
      qc_result: { passed: 98, rejected: 2, passRate: 98.0, reasons: '1x Jahitan Ketiak Meleset, 1x Kancing Kendur', inspector: 'QC Rian', date: '11 Sep 2026' },
      wage_paid: false
    },
    {
      id: 'wo-002',
      spk_number: 'SPK-2026-002',
      product_name: 'Gamis Crinkle Airflow Premium',
      product_id: 'PRD-003',
      worker_name: 'Ibu Ratna Dewi',
      worker_id: 'WRK-003',
      quantity: 80,
      target_date: '2026-09-22',
      status: 'Selesai',
      priority: 'Reguler (Standar)',
      delivery_type: 'Kurir Antar-Jemput Simpul',
      piece_rate_pay: 40000,
      qc_notes: 'Obras rangkap 4, retsleting jepang rapi tanpa macet.',
      qc_inspected: true,
      qc_result: { passed: 80, rejected: 0, passRate: 100.0, reasons: 'Nihil cacat mutu (Lolos Sempurna)', inspector: 'QC Rian', date: '10 Sep 2026' },
      wage_paid: true
    }
  ]);

  const [disputes, setDisputes] = useState([
    { 
      id: 'DSP-001', 
      date: '08 Sep 2026', 
      workerName: 'Pak Budi Santoso', 
      spkNumber: 'SPK-2026-002', 
      category: 'Koreksi Jumlah Pcs', 
      description: 'Tercatat 48 pcs di form penerimaan, penjahit mengerjakan 50 pcs (2 pcs tester sample).', 
      status: 'Terselesaikan', 
      resolution: 'Disetujui kompensasi tambahan 2 pcs Rp 24.000 via transfer dompet digital.' 
    },
    { 
      id: 'DSP-002', 
      date: '02 Sep 2026', 
      workerName: 'Ibu Siti Aminah', 
      spkNumber: 'SPK-2026-001', 
      category: 'Kualitas Bahan Baku', 
      description: 'Serat kain lot B sedikit kusut, meminta penambahan lead time 1 hari.', 
      status: 'Terselesaikan', 
      resolution: 'Toleransi lead time diperpanjang 24 jam tanpa penalti keterlambatan.' 
    }
  ]);

  const [productAuditLogs, setProductAuditLogs] = useState([
    { id: 1, timestamp: '12 Sep 2026, 11:20', user: 'Admin Sarah', action: 'Update Harga', details: 'Mengubah harga jual SKU-KMJ-01 menjadi Rp 135.000' },
    { id: 2, timestamp: '11 Sep 2026, 16:45', user: 'Owner Hendra', action: 'Tambah Produk', details: 'Menambahkan produk baru Gamis Crinkle Airflow (SKU-GMS-03)' },
    { id: 3, timestamp: '10 Sep 2026, 09:15', user: 'Admin Sarah', action: 'Link BOM Bahan', details: 'Menghubungkan SKU-KMJ-01 ke Kain Katun Rayon 1.8 yard' }
  ]);

  const [teamMembers, setTeamMembers] = useState([
    { name: 'Hendra Wijaya', email: 'hendra@simpulapparel.com', role: 'Super Admin (Owner)', permissions: 'Akses Penuh: Keuangan, SPK, Penjahit, Pengaturan' },
    { name: 'Sarah Amanda', email: 'sarah.ops@simpulapparel.com', role: 'Staff Operasional & SPK', permissions: 'Input SPK, Manajemen Stok Bahan, Dispatch Kurir' },
    { name: 'Rian Pratama', email: 'rian.qc@simpulapparel.com', role: 'Staff Quality Control (QC)', permissions: 'Inspeksi QC, Reject Record, Rekap Upah Borongan' }
  ]);

  // Modal State Controllers
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
  const [showCreateWOModal, setShowCreateWOModal] = useState(false);
  const [showCreateSOModal, setShowCreateSOModal] = useState(false);
  const [showQCModal, setShowQCModal] = useState(false);
  const [showWageSlipModal, setShowWageSlipModal] = useState(false);
  const [showCredibilityModal, setShowCredibilityModal] = useState(false);
  const [showAuditLogModal, setShowAuditLogModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showWorkerLoginModal, setShowWorkerLoginModal] = useState(false);

  // Selected state for single-record modals
  const [selectedWO, setSelectedWO] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states with rich enterprise fields
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    sku: '', 
    category: 'Kemeja & Blouse', 
    photo: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: 'Navy, Broken White, Sage',
    piece_rate_pay: '25000', 
    selling_price: '135000', 
    unit_cost: '65000',
    stock_quantity: '50',
    min_stock_alert: '20',
    estimated_mins_per_piece: '45',
    bomMaterialId: 'MAT-001',
    bomUsage: '1.8',
    description: ''
  });

  const [newMaterial, setNewMaterial] = useState({ 
    name: '', 
    sku: '', 
    category: 'Kain Utama', 
    current_stock: '100', 
    unit: 'yard', 
    unit_cost: '28000',
    min_stock_alert: '30',
    supplier_name: 'Distributor Tekstil Utama'
  });

  const [newWorker, setNewWorker] = useState({ 
    name: '', 
    phone: '', 
    skills: ['Kemeja & Blouse', 'Jahit Halus & Obras'], 
    village: 'Kluster Bengkong Kolam, Batam',
    custom_rate_override: '0',
    bank_name: 'BCA (Bank Central Asia)',
    bank_account: '',
    account_holder: ''
  });

  const [newWO, setNewWO] = useState({ 
    product_id: '', 
    worker_id: '', 
    quantity: '50', 
    target_date: '',
    priority: 'Reguler (Standar)',
    delivery_type: 'Kurir Antar-Jemput Simpul',
    qc_notes: 'Jahitan stik rapi standar ekspor, obras rangkap, label terpasang rapi.',
    sales_order_ref: ''
  });

  const [newSO, setNewSO] = useState({
    customerName: '',
    productId: '',
    quantity: '100',
    unitPrice: '',
    dpAmount: '',
    paymentStatus: 'DP 50% Diterima',
    deadline: ''
  });

  const [qcForm, setQcForm] = useState({
    inspectorName: 'QC Staff - Rian',
    passedQty: '',
    rejectedQty: '0',
    reasons: ['Jahitan Loncat'],
    actionTaken: 'Rework Perbaikan Cepat oleh Penjahit (No Charge)'
  });

  const [disputeForm, setDisputeForm] = useState({
    workerName: 'Ibu Siti Aminah',
    spkNumber: 'SPK-2026-001',
    category: 'Koreksi Jumlah Pcs',
    description: '',
    resolution: ''
  });

  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {
    fetchDashboardData();
  }, [companyId]);

  const fetchDashboardData = async () => {
    const cid = companyId || 'comp-demo';
    try {
      const [fRes, mRes, pRes, woRes, wRes, dRes] = await Promise.all([
        fetch(`${API_BASE}/finance/dashboard?company_id=${cid}`).then(r => r.json()).catch(() => ({})),
        fetch(`${API_BASE}/inventory/materials?company_id=${cid}`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/inventory/products?company_id=${cid}`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/workorders?company_id=${cid}`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/workers?company_id=${cid}`).then(r => r.json()).catch(() => []),
        fetch(`${API_BASE}/deliveries?company_id=${cid}`).then(r => r.json()).catch(() => [])
      ]);

      if (fRes && fRes.summary) setFinanceData(fRes);
      if (Array.isArray(mRes) && mRes.length) setMaterials(mRes);
      if (Array.isArray(pRes) && pRes.length) setProducts(pRes);
      if (Array.isArray(woRes) && woRes.length) setWorkOrders(woRes);
      if (Array.isArray(wRes) && wRes.length) setWorkers(wRes);
      if (Array.isArray(dRes) && dRes.length) setDeliveries(dRes);
    } catch (err) {
      console.warn('Backend API connection offline:', err);
    }
  };

  // Browser Tab Actions
  const openTab = (id, title, iconType) => {
    setOpenTabs(prev => {
      const exists = prev.find(t => t.id === id);
      if (exists) return prev;
      return [...prev, { id, title, iconType, closable: id !== 'overview' }];
    });
    setActiveTabId(id);
  };

  const closeTab = (id, e) => {
    if (e) e.stopPropagation();
    if (openTabs.length <= 1) return;
    
    const tabIndex = openTabs.findIndex(t => t.id === id);
    const newTabs = openTabs.filter(t => t.id !== id);
    setOpenTabs(newTabs);

    if (activeTabId === id) {
      const fallbackTab = newTabs[Math.max(0, tabIndex - 1)] || newTabs[0];
      setActiveTabId(fallbackTab.id);
    }
  };

  const handleSaveSettings = (e) => {
    if (e) e.preventDefault();
    setToastMessage('Pengaturan SOP Usaha berhasil disimpan.');
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3500);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const linkedMat = materials.find(m => m.id === newProduct.bomMaterialId);
    const created = {
      id: `PRD-${String(products.length + 1).padStart(3, '0')}`,
      sku: newProduct.sku || `SKU-${String(products.length + 1).padStart(3, '0')}`,
      name: newProduct.name,
      category: newProduct.category,
      photo: newProduct.photo || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
      sizes: Array.isArray(newProduct.sizes) ? newProduct.sizes : ['S', 'M', 'L', 'XL'],
      colors: typeof newProduct.colors === 'string' ? newProduct.colors.split(',').map(c => c.trim()) : newProduct.colors,
      piece_rate_pay: Number(newProduct.piece_rate_pay) || 20000,
      selling_price: Number(newProduct.selling_price) || 120000,
      unit_cost: Number(newProduct.unit_cost) || 60000,
      stock_quantity: Number(newProduct.stock_quantity) || 0,
      min_stock_alert: Number(newProduct.min_stock_alert) || 20,
      estimated_mins_per_piece: Number(newProduct.estimated_mins_per_piece) || 40,
      bom: linkedMat ? [{ materialId: linkedMat.id, materialName: linkedMat.name, usagePerPiece: Number(newProduct.bomUsage) || 1.5, unit: linkedMat.unit }] : [],
      active: true,
      description: newProduct.description || 'Pakaian kualitas standar garmen.'
    };
    setProducts([created, ...products]);
    setProductAuditLogs([
      { id: Date.now(), timestamp: 'Baru Saja', user: 'Admin Sarah', action: 'Tambah Produk', details: `Menambahkan produk baru ${created.name} (${created.sku})` },
      ...productAuditLogs
    ]);
    setNewProduct({ name: '', sku: '', category: 'Kemeja & Blouse', photo: '', sizes: ['S', 'M', 'L', 'XL'], colors: 'Navy, Broken White, Sage', piece_rate_pay: '25000', selling_price: '135000', unit_cost: '65000', stock_quantity: '50', min_stock_alert: '20', estimated_mins_per_piece: '45', bomMaterialId: 'MAT-001', bomUsage: '1.8', description: '' });
    setShowAddProductModal(false);
    setToastMessage(`Produk ${created.name} berhasil ditambahkan.`);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3500);
  };

  const handleEditProductSave = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    setProductAuditLogs([
      { id: Date.now(), timestamp: 'Baru Saja', user: 'Admin Sarah', action: 'Update Produk', details: `Memperbarui harga/stok ${editingProduct.name} (${editingProduct.sku})` },
      ...productAuditLogs
    ]);
    setShowEditProductModal(false);
    setEditingProduct(null);
    setToastMessage(`Perubahan produk berhasil disimpan.`);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3500);
  };

  const handleDeleteProduct = (prodId) => {
    const target = products.find(p => p.id === prodId);
    if (!target) return;
    setProducts(products.filter(p => p.id !== prodId));
    setProductAuditLogs([
      { id: Date.now(), timestamp: 'Baru Saja', user: 'Owner Hendra', action: 'Hapus Produk', details: `Menghapus produk ${target.name} (${target.sku})` },
      ...productAuditLogs
    ]);
    setToastMessage(`Produk ${target.name} telah dihapus.`);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3500);
  };

  const handleAddMaterial = (e) => {
    e.preventDefault();
    const created = {
      id: `MAT-${String(materials.length + 1).padStart(3, '0')}`,
      sku: newMaterial.sku || `MAT-${String(materials.length + 1).padStart(3, '0')}`,
      name: newMaterial.name,
      category: newMaterial.category,
      current_stock: Number(newMaterial.current_stock) || 0,
      unit: newMaterial.unit || 'yard',
      unit_cost: Number(newMaterial.unit_cost) || 0,
      min_stock_alert: Number(newMaterial.min_stock_alert) || 30,
      supplier_name: newMaterial.supplier_name || 'Distributor Tekstil'
    };
    setMaterials([created, ...materials]);
    setNewMaterial({ name: '', sku: '', category: 'Kain Utama', current_stock: '100', unit: 'yard', unit_cost: '28000', min_stock_alert: '30', supplier_name: 'Distributor Tekstil Utama' });
    setShowAddMaterialModal(false);
    setToastMessage(`Bahan baku ${created.name} berhasil ditambahkan ke inventori.`);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3500);
  };

  const handleAddWorker = (e) => {
    e.preventDefault();
    const code = `JHT-${String(workers.length + 1).padStart(4, '0')}`;
    const cleanSkills = Array.isArray(newWorker.skills) && newWorker.skills.length > 0 
      ? newWorker.skills 
      : ['Kemeja & Blouse', 'Jahit Halus & Obras'];
    
    const created = {
      id: `WRK-${String(workers.length + 1).padStart(3, '0')}`,
      worker_code: code,
      name: newWorker.name,
      phone: newWorker.phone.replace(/[^0-9]/g, ''),
      avatar: `https://images.unsplash.com/photo-${1544005313 + workers.length}?auto=format&fit=crop&w=200&q=80`,
      village: newWorker.village || 'Batam',
      skills: cleanSkills,
      custom_rate_override: Number(newWorker.custom_rate_override) || 0,
      bank_name: newWorker.bank_name || 'BCA (Bank Central Asia)',
      bank_account: newWorker.bank_account || '8839102812',
      account_holder: newWorker.account_holder || newWorker.name,
      status: 'Aktif',
      completed_spk_count: 0,
      qc_pass_rate: 100.0,
      rating: 5.0,
      app_login: {
        username: newWorker.name.toLowerCase().replace(/[^a-z0-9]/g, '.') + '.' + Math.floor(100 + Math.random() * 900),
        temp_pin: String(Math.floor(100000 + Math.random() * 900000))
      }
    };
    setWorkers([created, ...workers]);
    setNewWorker({ name: '', phone: '', skills: ['Kemeja & Blouse', 'Jahit Halus & Obras'], village: 'Kluster Bengkong Kolam, Batam', custom_rate_override: '0', bank_name: 'BCA (Bank Central Asia)', bank_account: '', account_holder: '' });
    setShowAddWorkerModal(false);
    setToastMessage(`Mitra penjahit ${created.name} berhasil didaftarkan.`);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3500);
  };

  const handleAddSalesOrder = (e) => {
    e.preventDefault();
    const prod = products.find(p => p.id === newSO.productId) || products[0];
    const qty = Number(newSO.quantity) || 100;
    const uPrice = Number(newSO.unitPrice) || (prod ? prod.selling_price : 125000);
    const tot = qty * uPrice;
    const dp = Number(newSO.dpAmount) || (tot * 0.5);

    const created = {
      id: `SO-2026-${String(salesOrders.length + 1).padStart(3, '0')}`,
      customerName: newSO.customerName || 'Pelanggan Baru',
      product: prod ? prod.name : 'Pakaian Pesanan',
      productId: prod ? prod.id : '',
      quantity: qty,
      unitPrice: uPrice,
      totalAmount: tot,
      dpAmount: dp,
      paymentStatus: newSO.paymentStatus || 'DP 50% Diterima',
      deadline: newSO.deadline || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      spkIssued: false,
      status: 'Siap Terbit SPK'
    };
    setSalesOrders([created, ...salesOrders]);
    setNewSO({ customerName: '', productId: '', quantity: '100', unitPrice: '', dpAmount: '', paymentStatus: 'DP 50% Diterima', deadline: '' });
    setShowCreateSOModal(false);
    setToastMessage(`Pesanan masuk ${created.id} dari ${created.customerName} berhasil dicatat.`);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 3500);
  };

  const handleIssueSPKFromSO = (so) => {
    const matchedProd = products.find(p => p.id === so.productId) || products[0];
    // Find matching tailor
    const matchingWorker = workers.find(w => w.skills && w.skills.some(s => matchedProd.category.includes(s.split(' ')[0])));
    
    // Auto lead time in days
    const estLeadDays = matchedProd ? Math.max(2, Math.ceil((so.quantity * (matchedProd.estimated_mins_per_piece || 45)) / 480)) : 5;
    const targetDate = so.deadline || new Date(Date.now() + estLeadDays * 86400000).toISOString().split('T')[0];

    setNewWO({
      product_id: matchedProd ? matchedProd.id : '',
      worker_id: matchingWorker ? matchingWorker.id : (workers[0] ? workers[0].id : ''),
      quantity: String(so.quantity),
      target_date: targetDate,
      priority: 'Prioritas Tinggi',
      delivery_type: 'Kurir Antar-Jemput Simpul',
      qc_notes: `Berdasarkan Pesanan ${so.id} untuk ${so.customerName}. Standar ekspor, bersih sisa benang.`,
      sales_order_ref: so.id
    });
    setShowCreateWOModal(true);
  };

  const formatCurrency = (val) => 'Rp ' + (Number(val) || 0).toLocaleString('id-ID');

  const getSubdomain = () => {
    const name = companySettings.companyName || companyName || 'portal';
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + '.simpul.id';
  };

  // Dynamic calculations for WO modal preview
  const selectedProdObj = useMemo(() => {
    return products.find(p => p.id === newWO.product_id) || null;
  }, [products, newWO.product_id]);

  const selectedWorkerObj = useMemo(() => {
    return workers.find(w => w.id === newWO.worker_id) || null;
  }, [workers, newWO.worker_id]);

  const woCalculations = useMemo(() => {
    const qty = Number(newWO.quantity) || 0;
    const unitPay = selectedWorkerObj && selectedWorkerObj.custom_rate_override && Number(selectedWorkerObj.custom_rate_override) > 0
      ? Number(selectedWorkerObj.custom_rate_override)
      : (selectedProdObj ? (selectedProdObj.piece_rate_pay || 0) : 25000);
    const sellPrice = selectedProdObj ? (selectedProdObj.selling_price || 0) : 135000;
    const totalWage = qty * unitPay;
    const totalGross = qty * sellPrice;
    const estMargin = totalGross - totalWage;
    return { qty, unitPay, totalWage, totalGross, estMargin };
  }, [newWO.quantity, selectedProdObj, selectedWorkerObj]);

  // Dynamic Chart Data
  const dynamicChartData = useMemo(() => {
    const months = ['Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt'];
    const currentSales = financeData.summary.grossSales || 148500000;
    const currentWages = financeData.summary.totalPieceworkPay || 34250000;
    const totalPcs = workOrders.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);

    return months.map((month, idx) => {
      const multiplier = (idx + 1) / months.length;
      return {
        month,
        omset: Math.round(currentSales * multiplier),
        upah: Math.round(currentWages * multiplier),
        volume: Math.round(totalPcs * multiplier)
      };
    });
  }, [financeData, workOrders]);

  const totalVolumePcs = useMemo(() => {
    return workOrders.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
  }, [workOrders]);

  const grossSalesVal = financeData.summary.grossSales || 148500000;
  const totalPiecePayVal = financeData.summary.totalPieceworkPay || 34250000;
  const wageRatio = grossSalesVal > 0 ? Math.round((totalPiecePayVal / grossSalesVal) * 100) : 23;
  const marginRatio = grossSalesVal > 0 ? Math.max(0, 100 - wageRatio) : 77;
  const onTimeRate = 98.4;

  // Derive page titles
  const getTabTitle = (id) => {
    switch (id) {
      case 'overview': return 'Ringkasan';
      case 'salesorders': return 'Pesanan Masuk (Sales Orders)';
      case 'workorders': return 'Perintah Kerja (SPK)';
      case 'products': return 'Katalog Produk';
      case 'materials': return 'Stok Bahan Baku';
      case 'workers': return 'Mitra Penjahit';
      case 'finance': return 'Biaya & HPP';
      case 'disputes': return 'Log Sengketa & Rework';
      case 'settings-profile': return 'Identitas Usaha';
      case 'settings-operations': return 'SOP Produksi';
      case 'settings-payment': return 'Pembayaran Upah';
      case 'settings-team': return 'Tim & Akses';
      case 'settings-notifications': return 'Notifikasi';
      default: return 'Halaman';
    }
  };

  return (
    <div className="portal-root">
      
      {/* ── SIDEBAR NAVIGATION ── */}
      <aside className="portal-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand-row">
            <div className="sidebar-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <div className="company-title">SIMPUL ERP</div>
              <div className="sidebar-tagline">Where Business Finds Its Way Forward.</div>
            </div>
          </div>
          <div className="company-badge-pill">
            <span className="badge-dot"></span>
            <span>{companySettings.companyName || companyName || 'PT Simpul Fashion'}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Utama</div>
          <button 
            type="button" 
            className={`nav-item-btn ${activeTabId === 'overview' ? 'active' : ''}`}
            onClick={() => openTab('overview', 'Ringkasan', 'overview')}
          >
            <div className="nav-item-left">
              <IconOverview />
              <span>Ringkasan</span>
            </div>
          </button>

          <div className="nav-section-label">Order &amp; Produksi</div>
          <button 
            type="button" 
            className={`nav-item-btn ${activeTabId === 'salesorders' ? 'active' : ''}`}
            onClick={() => openTab('salesorders', 'Pesanan Masuk', 'salesorders')}
          >
            <div className="nav-item-left">
              <IconSalesOrder />
              <span>Pesanan Masuk</span>
            </div>
            <span className="nav-count-badge">{salesOrders.length}</span>
          </button>

          <button 
            type="button" 
            className={`nav-item-btn ${activeTabId === 'workorders' ? 'active' : ''}`}
            onClick={() => openTab('workorders', 'Perintah Kerja', 'workorders')}
          >
            <div className="nav-item-left">
              <IconWorkOrders />
              <span>Perintah Kerja (SPK)</span>
            </div>
            <span className="nav-count-badge">{workOrders.length}</span>
          </button>

          <button 
            type="button" 
            className={`nav-item-btn ${activeTabId === 'products' ? 'active' : ''}`}
            onClick={() => openTab('products', 'Katalog Produk', 'products')}
          >
            <div className="nav-item-left">
              <IconProducts />
              <span>Katalog Produk</span>
            </div>
            <span className="nav-count-badge">{products.length}</span>
          </button>

          <button 
            type="button" 
            className={`nav-item-btn ${activeTabId === 'materials' ? 'active' : ''}`}
            onClick={() => openTab('materials', 'Stok Bahan', 'materials')}
          >
            <div className="nav-item-left">
              <IconMaterials />
              <span>Gudang Bahan</span>
            </div>
            <span className="nav-count-badge">{materials.length}</span>
          </button>

          <div className="nav-section-label">SDM, Keuangan &amp; QC</div>
          <button 
            type="button" 
            className={`nav-item-btn ${activeTabId === 'workers' ? 'active' : ''}`}
            onClick={() => openTab('workers', 'Mitra Penjahit', 'workers')}
          >
            <div className="nav-item-left">
              <IconWorkers />
              <span>Mitra Penjahit</span>
            </div>
            <span className="nav-count-badge">{workers.length}</span>
          </button>

          <button 
            type="button" 
            className={`nav-item-btn ${activeTabId === 'finance' ? 'active' : ''}`}
            onClick={() => openTab('finance', 'Biaya & HPP', 'finance')}
          >
            <div className="nav-item-left">
              <IconFinance />
              <span>Biaya &amp; HPP</span>
            </div>
          </button>

          <button 
            type="button" 
            className={`nav-item-btn ${activeTabId === 'disputes' ? 'active' : ''}`}
            onClick={() => openTab('disputes', 'Log Sengketa', 'disputes')}
          >
            <div className="nav-item-left">
              <IconDisputes />
              <span>Log Sengketa &amp; Rework</span>
            </div>
            <span className="nav-count-badge">{disputes.length}</span>
          </button>

          <div className="nav-section-label">Sistem &amp; Kredibilitas</div>
          <button 
            type="button" 
            className="nav-item-btn credit-nav-btn"
            onClick={() => setShowCredibilityModal(true)}
          >
            <div className="nav-item-left">
              <IconDoc />
              <span>Laporan Bank / Investor</span>
            </div>
            <span className="badge-verified-sm">PDF</span>
          </button>

          <div className="nav-section-label">Sistem</div>
          
          {/* Settings Parent Accordion Item */}
          <div className="settings-nav-group">
            <button 
              type="button" 
              className={`nav-item-btn settings-parent-btn ${activeTabId.startsWith('settings-') ? 'active' : ''}`}
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              <div className="nav-item-left">
                <IconSettings />
                <span>Pengaturan</span>
              </div>
              <svg 
                className={`settings-chevron ${isSettingsOpen ? 'open' : ''}`} 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Expandable Sub-items for Settings */}
            {isSettingsOpen && (
              <div className="settings-submenu">
                <button 
                  type="button"
                  className={`settings-sub-item ${activeTabId === 'settings-profile' ? 'active' : ''}`}
                  onClick={() => openTab('settings-profile', 'Identitas Usaha', 'settings-profile')}
                >
                  Identitas Usaha
                </button>
                <button 
                  type="button"
                  className={`settings-sub-item ${activeTabId === 'settings-operations' ? 'active' : ''}`}
                  onClick={() => openTab('settings-operations', 'SOP Produksi', 'settings-operations')}
                >
                  SOP Produksi
                </button>
                <button 
                  type="button"
                  className={`settings-sub-item ${activeTabId === 'settings-payment' ? 'active' : ''}`}
                  onClick={() => openTab('settings-payment', 'Pembayaran Upah', 'settings-payment')}
                >
                  Pembayaran Upah
                </button>
                <button 
                  type="button"
                  className={`settings-sub-item ${activeTabId === 'settings-team' ? 'active' : ''}`}
                  onClick={() => openTab('settings-team', 'Tim & Akses', 'settings-team')}
                >
                  Tim &amp; Akses
                </button>
                <button 
                  type="button"
                  className={`settings-sub-item ${activeTabId === 'settings-notifications' ? 'active' : ''}`}
                  onClick={() => openTab('settings-notifications', 'Notifikasi', 'settings-notifications')}
                >
                  Notifikasi
                </button>
              </div>
            )}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-row">
            <div>
              <div className="user-profile-name">{companySettings.picName || 'Admin Perusahaan'}</div>
              <div className="user-profile-email">{companySettings.workEmail || 'admin@simpul.id'}</div>
            </div>
          </div>
          {onLogout && (
            <button type="button" className="btn-sidebar-logout" onClick={onLogout}>
              <IconLogout />
              <span>Keluar Portal</span>
            </button>
          )}
        </div>
      </aside>

      {/* ── MAIN PORTAL CONTENT AREA ── */}
      <main className="portal-main">
        
        {/* ── GOOGLE CHROME STYLE BROWSER TAB BAR ── */}
        <div className="browser-chrome-tabbar">
          <div className="browser-tabs-container">
            {openTabs.map((tab) => {
              const isActive = activeTabId === tab.id;
              return (
                <div 
                  key={tab.id}
                  className={`browser-tab ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTabId(tab.id)}
                  title={tab.title}
                >
                  <span className="browser-tab-icon">
                    <TabIconHelper type={tab.iconType || tab.id} />
                  </span>
                  <span className="browser-tab-title">{tab.title}</span>
                  {tab.closable && (
                    <button 
                      type="button" 
                      className="browser-tab-close"
                      title="Tutup Tab"
                      onClick={(e) => closeTab(tab.id, e)}
                    >
                      &times;
                    </button>
                  )}
                </div>
              );
            })}
            
            {/* New Tab '+' Button */}
            <button 
              type="button" 
              className="browser-new-tab-btn" 
              title="Buka Tab Ringkasan Baru"
              onClick={() => openTab('overview', 'Ringkasan', 'overview')}
            >
              +
            </button>
          </div>
        </div>

        {/* ── SUB-HEADER / ACTION BAR ── */}
        <div className="portal-header-bar">
          <div className="header-title-group">
            <h2>
              {activeTabId.startsWith('settings-') ? (
                <>
                  <span className="header-parent-title">Pengaturan</span>
                  <span className="header-sep">›</span>
                  <span className="header-current-title">{getTabTitle(activeTabId)}</span>
                </>
              ) : (
                getTabTitle(activeTabId)
              )}
            </h2>
          </div>

          <div className="header-actions-group">
            {activeTabId === 'workorders' && (
              <button className="btn-portal-primary" onClick={() => setShowCreateWOModal(true)}>
                + Buat SPK
              </button>
            )}
            {activeTabId === 'products' && (
              <button className="btn-portal-primary" onClick={() => setShowAddProductModal(true)}>
                + Tambah Produk
              </button>
            )}
            {activeTabId === 'materials' && (
              <button className="btn-portal-primary" onClick={() => setShowAddMaterialModal(true)}>
                + Tambah Bahan
              </button>
            )}
            {activeTabId === 'workers' && (
              <button className="btn-portal-primary" onClick={() => setShowAddWorkerModal(true)}>
                + Tambah Penjahit
              </button>
            )}
          </div>
        </div>

        {/* ── METRICS STRIP (Only on Overview Tab) ── */}
        {activeTabId === 'overview' && (
          <div className="metrics-strip">
            <div className="metric-cell">
              <div className="metric-cell-label">Estimasi Nilai Produksi</div>
              <div className="metric-cell-value">
                {grossSalesVal > 0 ? formatCurrency(grossSalesVal) : <span className="metric-empty-val">—</span>}
              </div>
              <div className="metric-cell-sub">
                {grossSalesVal > 0 ? 'Dari SPK yang diterbitkan' : 'Belum ada data'}
              </div>
            </div>

            <div className="metric-cell">
              <div className="metric-cell-label">Total Upah Borongan</div>
              <div className="metric-cell-value">
                {totalPiecePayVal > 0 ? formatCurrency(totalPiecePayVal) : <span className="metric-empty-val">—</span>}
              </div>
              <div className="metric-cell-sub">
                {totalPiecePayVal > 0 ? 'Kewajiban upah siap bayar' : 'Belum ada data'}
              </div>
            </div>

            <div className="metric-cell">
              <div className="metric-cell-label">Volume Produksi</div>
              <div className="metric-cell-value">
                {totalVolumePcs > 0 ? `${totalVolumePcs} pcs` : <span className="metric-empty-val">—</span>}
              </div>
              <div className="metric-cell-sub">
                {workOrders.length > 0 ? `${workOrders.length} SPK aktif` : 'Belum ada data'}
              </div>
            </div>

            <div className="metric-cell">
              <div className="metric-cell-label">Mitra Penjahit Aktif</div>
              <div className="metric-cell-value">
                {workers.length > 0 ? `${workers.length} Orang` : <span className="metric-empty-val">—</span>}
              </div>
              <div className="metric-cell-sub">
                {workers.length > 0 ? 'Dalam jaringan jahit' : 'Belum ada data'}
              </div>
            </div>
          </div>
        )}

        {/* ── 1. OVERVIEW VIEW ── */}
        {activeTabId === 'overview' && (
          <div className="fade-in-up">
            <div className="analytics-grid">
              
              {/* Chart Card */}
              <div className="clean-panel" style={{ margin: 0 }}>
                <div className="chart-panel-header">
                  <div>
                    <h5 className="clean-panel-title">Tren Produksi &amp; Upah</h5>
                  </div>
                  <div className="chart-controls">
                    <button 
                      type="button" 
                      className={`chart-filter-btn ${chartViewMode === 'revenue' ? 'active' : ''}`}
                      onClick={() => setChartViewMode('revenue')}
                    >
                      Nilai Omset
                    </button>
                    <button 
                      type="button" 
                      className={`chart-filter-btn ${chartViewMode === 'wages' ? 'active' : ''}`}
                      onClick={() => setChartViewMode('wages')}
                    >
                      Upah Borongan
                    </button>
                    <button 
                      type="button" 
                      className={`chart-filter-btn ${chartViewMode === 'volume' ? 'active' : ''}`}
                      onClick={() => setChartViewMode('volume')}
                    >
                      Volume Pcs
                    </button>
                  </div>
                </div>

                <div style={{ width: '100%', height: 280, marginTop: '8px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dynamicChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorOmset" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#222226" stopOpacity={0.12}/>
                          <stop offset="95%" stopColor="#222226" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="colorUpah" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#645F5B" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#645F5B" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.18}/>
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(24,24,27,0.04)" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9B948E', fontSize: 12, fontFamily: 'Plus Jakarta Sans' }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9B948E', fontSize: 11, fontFamily: 'Plus Jakarta Sans' }} 
                        tickFormatter={(v) => chartViewMode === 'volume' ? `${v} pcs` : `Rp${(v/1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 253, 249, 0.95)', 
                          backdropFilter: 'blur(16px)',
                          border: 'none', 
                          borderRadius: '12px', 
                          fontSize: '0.8rem',
                          fontFamily: 'Plus Jakarta Sans',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                        }} 
                        formatter={(val) => [
                          chartViewMode === 'volume' ? `${val} pcs` : formatCurrency(val),
                          chartViewMode === 'revenue' ? 'Omset Produksi' : chartViewMode === 'wages' ? 'Upah Penjahit' : 'Volume Output'
                        ]}
                      />
                      {chartViewMode === 'revenue' && (
                        <Area type="monotone" dataKey="omset" stroke="#18181B" strokeWidth={2} fillOpacity={1} fill="url(#colorOmset)" />
                      )}
                      {chartViewMode === 'wages' && (
                        <Area type="monotone" dataKey="upah" stroke="#645F5B" strokeWidth={2} fillOpacity={1} fill="url(#colorUpah)" />
                      )}
                      {chartViewMode === 'volume' && (
                        <Area type="monotone" dataKey="volume" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorVol)" />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Operational Ratios */}
              <div className="clean-panel" style={{ margin: 0 }}>
                <div className="clean-panel-header">
                  <h5 className="clean-panel-title">Rasio Keuangan &amp; Operasional</h5>
                </div>
                <div className="clean-panel-body">
                  <div className="kpi-metric-row">
                    <div className="kpi-metric-label">Beban Upah Jahit</div>
                    <div className="kpi-metric-val">{wageRatio}%</div>
                  </div>
                  <div className="kpi-progress-bg">
                    <div className="kpi-progress-bar" style={{ width: `${Math.min(100, wageRatio)}%`, backgroundColor: '#645F5B' }} />
                  </div>

                  <div className="kpi-metric-row" style={{ marginTop: '18px' }}>
                    <div className="kpi-metric-label">Estimasi Margin Usaha</div>
                    <div className="kpi-metric-val">{marginRatio}%</div>
                  </div>
                  <div className="kpi-progress-bg">
                    <div className="kpi-progress-bar" style={{ width: `${Math.min(100, marginRatio)}%`, backgroundColor: '#10B981' }} />
                  </div>

                  <div className="kpi-metric-row" style={{ marginTop: '18px' }}>
                    <div className="kpi-metric-label">Ketepatan Deadline SPK</div>
                    <div className="kpi-metric-val">{onTimeRate}%</div>
                  </div>
                  <div className="kpi-progress-bg">
                    <div className="kpi-progress-bar" style={{ width: `${onTimeRate}%`, backgroundColor: '#3B82F6' }} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── 2. SALES ORDERS VIEW (Pesanan Masuk) ── */}
        {activeTabId === 'salesorders' && (
          <div className="fade-in-up">
            <div className="clean-panel">
              <div className="clean-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 className="clean-panel-title">Daftar Pesanan Masuk (Sales Orders)</h5>
                  <p className="clean-panel-sub" style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)' }}>Catat pesanan dari customer/distro sebelum diterbitkan menjadi Surat Perintah Kerja (SPK)</p>
                </div>
                <button 
                  type="button" 
                  className="btn-portal-primary"
                  onClick={() => setShowCreateSOModal(true)}
                >
                  + Tambah Pesanan Masuk
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>No. Order</th>
                      <th>Pelanggan</th>
                      <th>Produk Pesanan</th>
                      <th>Jumlah</th>
                      <th>Total Nilai</th>
                      <th>Status Pembayaran</th>
                      <th>Deadline</th>
                      <th>Status Alur</th>
                      <th>Aksi Produksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesOrders.map(so => (
                      <tr key={so.id}>
                        <td><span className="code-cell">{so.id}</span></td>
                        <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{so.customerName}</td>
                        <td style={{ fontWeight: 600 }}>{so.product}</td>
                        <td><span className="badge-qty">{so.quantity} pcs</span></td>
                        <td style={{ fontWeight: 700 }}>{formatCurrency(so.totalAmount)}</td>
                        <td>
                          <span className={`status-pill ${so.paymentStatus.includes('Lunas') ? 'status-active' : 'status-assigned'}`}>
                            {so.paymentStatus}
                          </span>
                        </td>
                        <td style={{ color: '#4B5563', fontSize: '0.78rem' }}>{so.deadline}</td>
                        <td>
                          {so.spkIssued ? (
                            <span className="badge-spk-linked">✓ SPK: {so.spkNumber}</span>
                          ) : (
                            <span className="badge-spk-pending">Menunggu SPK</span>
                          )}
                        </td>
                        <td>
                          {!so.spkIssued ? (
                            <button 
                              type="button" 
                              className="btn-action-spk-auto"
                              onClick={() => handleIssueSPKFromSO(so)}
                            >
                              ⚡ Terbitkan SPK
                            </button>
                          ) : (
                            <button 
                              type="button" 
                              className="btn-action-ghost"
                              onClick={() => openTab('workorders', 'Perintah Kerja', 'workorders')}
                            >
                              Lihat SPK
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 3. WORK ORDERS VIEW (SPK Studio) ── */}
        {activeTabId === 'workorders' && (
          <div className="clean-panel fade-in-up">
            <div className="clean-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h5 className="clean-panel-title">Surat Perintah Kerja (SPK Produksi)</h5>
                <p className="clean-panel-sub" style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)' }}>Monitoring pengerjaan jahitan mitra borongan, inspeksi mutu QC, dan pencairan upah</p>
              </div>
              <button 
                type="button" 
                className="btn-portal-primary"
                onClick={() => setShowCreateWOModal(true)}
              >
                + Terbitkan SPK Baru
              </button>
            </div>

            {workOrders.length === 0 ? (
              <div className="empty-state-box">
                <div className="empty-state-icon-box">
                  <IconEmpty />
                </div>
                <div className="empty-state-title">Belum ada surat perintah kerja aktif</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>No. SPK</th>
                      <th>Produk &amp; Batch</th>
                      <th>Mitra Penjahit</th>
                      <th>Jumlah Pcs</th>
                      <th>Rate Upah</th>
                      <th>Total Upah</th>
                      <th>Hasil QC Actual</th>
                      <th>Status SPK</th>
                      <th>Aksi Terpadu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workOrders.map(wo => (
                      <tr key={wo.id}>
                        <td><span className="code-cell">{wo.spk_number || wo.code}</span></td>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{wo.product_name}</div>
                          <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>Target: {wo.target_date || '-'} • {wo.priority || 'Reguler'}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{wo.worker_name}</div>
                          <div style={{ fontSize: '0.70rem', color: '#059669' }}>{wo.delivery_type || 'Kurir Simpul'}</div>
                        </td>
                        <td><span className="badge-qty">{wo.quantity} pcs</span></td>
                        <td style={{ color: '#4B5563', fontWeight: 600 }}>{formatCurrency(wo.piece_rate_pay || wo.unit_pay || 0)}</td>
                        <td style={{ fontWeight: 700, color: '#047857' }}>{formatCurrency(wo.total_piece_pay)}</td>
                        <td>
                          {wo.qc_inspected && wo.qc_result ? (
                            <span className={`badge-qc-pass ${wo.qc_result.passRate >= 95 ? 'perfect' : 'warning'}`}>
                              ✓ {wo.qc_result.passRate}% ({wo.qc_result.passed} Lolos / {wo.qc_result.rejected} Cacat)
                            </span>
                          ) : (
                            <span className="badge-qc-pending">Belum Diinspeksi</span>
                          )}
                        </td>
                        <td>
                          <span className={`status-pill ${wo.status === 'Selesai' ? 'status-active' : 'status-assigned'}`}>
                            {wo.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <button 
                              type="button" 
                              className="btn-table-action-sm"
                              title="Input Inspeksi QC Actual"
                              onClick={() => {
                                setSelectedWO(wo);
                                setQcForm({
                                  inspectorName: 'QC Staff - Rian',
                                  passedQty: String(wo.quantity),
                                  rejectedQty: '0',
                                  reasons: ['Jahitan Loncat'],
                                  actionTaken: 'Rework Perbaikan Cepat oleh Penjahit (No Charge)'
                                });
                                setShowQCModal(true);
                              }}
                            >
                              🔍 QC
                            </button>

                            <button 
                              type="button" 
                              className="btn-table-action-sm"
                              title="Lihat Slip Upah Digital"
                              onClick={() => {
                                setSelectedWO(wo);
                                setShowWageSlipModal(true);
                              }}
                            >
                              🧾 Slip
                            </button>

                            <a 
                              href={`https://wa.me/6281277665544?text=${encodeURIComponent(`Halo, update penugasan ${wo.spk_number || wo.code} untuk produk ${wo.product_name} sebanyak ${wo.quantity} pcs. Mohon konfirmasi penerimaan batch kain via aplikasi Simpul.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-table-action-wa"
                              title="Kirim SPK via WhatsApp"
                            >
                              <IconWhatsApp />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── 4. PRODUCTS VIEW (Katalog & BOM) ── */}
        {activeTabId === 'products' && (
          <div className="fade-in-up">
            <div className="clean-panel">
              <div className="clean-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 className="clean-panel-title">Katalog Produk &amp; Bill of Materials (BOM)</h5>
                  <p className="clean-panel-sub" style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)' }}>Kelola spesifikasi pakaian, varian, koneksi pemakaian bahan baku otomatis, dan harga jahit borongan</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    type="button" 
                    className="btn-portal-secondary"
                    onClick={() => setShowAuditLogModal(true)}
                  >
                    📜 Riwayat Perubahan
                  </button>
                  <button 
                    type="button" 
                    className="btn-portal-primary"
                    onClick={() => setShowAddProductModal(true)}
                  >
                    + Tambah Produk Baru
                  </button>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>Produk &amp; Foto</th>
                      <th>SKU &amp; Kategori</th>
                      <th>Varian (Ukuran &amp; Warna)</th>
                      <th>Upah Jahit Borongan</th>
                      <th>Estimasi Waktu</th>
                      <th>Stok Barang Jadi</th>
                      <th>Koneksi Bahan (BOM)</th>
                      <th>Harga Jual &amp; Margin</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => {
                      const isLowStock = (p.stock_quantity || 0) <= (p.min_stock_alert || 20);
                      const margin = (p.selling_price || 0) - (p.piece_rate_pay || 0) - (p.unit_cost ? (p.unit_cost * 0.4) : 25000);
                      return (
                        <tr key={p.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img 
                                src={p.photo || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80'} 
                                alt={p.name}
                                className="product-thumbnail-img"
                              />
                              <div>
                                <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{p.name}</div>
                                <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>{p.description || 'Pakaian berkualitas tinggi'}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div><span className="code-cell">{p.sku}</span></div>
                            <span className="tag-neutral" style={{ marginTop: '4px', display: 'inline-block' }}>{p.category}</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', maxWidth: '140px' }}>
                              {Array.isArray(p.sizes) ? p.sizes.map((s, idx) => (
                                <span key={idx} className="badge-variant-size">{s}</span>
                              )) : <span className="badge-variant-size">S-XL</span>}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                              {Array.isArray(p.colors) ? p.colors.join(', ') : (p.colors || 'Multi Warna')}
                            </div>
                          </td>
                          <td style={{ fontWeight: 700, color: '#047857' }}>{formatCurrency(p.piece_rate_pay)} / pcs</td>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: '0.78rem' }}>⏱️ {p.estimated_mins_per_piece || 45} Menit</div>
                            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Estimasi Lead SPK</div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 700 }}>{p.stock_quantity || 0} pcs</div>
                            {isLowStock && (
                              <span className="badge-low-stock">⚠️ Stok Menipis (&lt;{p.min_stock_alert})</span>
                            )}
                          </td>
                          <td>
                            {p.bom && p.bom.length > 0 ? (
                              <div style={{ fontSize: '0.72rem' }}>
                                {p.bom.map((b, bIdx) => (
                                  <div key={bIdx} style={{ color: '#374151', fontWeight: 600 }}>
                                    • {b.materialName}: <span style={{ color: '#BE185D' }}>{b.usagePerPiece} {b.unit}/pcs</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>- Belum di-link -</span>
                            )}
                          </td>
                          <td>
                            <div style={{ fontWeight: 700 }}>{formatCurrency(p.selling_price)}</div>
                            <div style={{ fontSize: '0.70rem', color: '#059669', fontWeight: 600 }}>Est. Margin: {formatCurrency(margin)}</div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button 
                                type="button" 
                                className="btn-table-action-sm"
                                onClick={() => {
                                  setEditingProduct(p);
                                  setShowEditProductModal(true);
                                }}
                              >
                                ✏️ Edit
                              </button>
                              <button 
                                type="button" 
                                className="btn-table-action-danger-sm"
                                onClick={() => handleDeleteProduct(p.id)}
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 5. MATERIALS VIEW (Gudang Bahan Baku) ── */}
        {activeTabId === 'materials' && (
          <div className="clean-panel fade-in-up">
            <div className="clean-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h5 className="clean-panel-title">Gudang Bahan Baku &amp; Trims</h5>
                <p className="clean-panel-sub" style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)' }}>Stok otomatis terpotong saat SPK diterbitkan berdasarkan Bill of Materials (BOM)</p>
              </div>
              <button 
                type="button" 
                className="btn-portal-primary"
                onClick={() => setShowAddMaterialModal(true)}
              >
                + Tambah Bahan Baku
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="clean-table">
                <thead>
                  <tr>
                    <th>Kode SKU</th>
                    <th>Nama Bahan Baku</th>
                    <th>Kategori</th>
                    <th>Sisa Stok Fisik</th>
                    <th>Harga Beli Satuan</th>
                    <th>Valuasi Stok</th>
                    <th>Supplier / Pemasok</th>
                    <th>Status Stok</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map(m => {
                    const totalVal = (Number(m.current_stock) || 0) * (Number(m.unit_cost) || 0);
                    const isLow = (Number(m.current_stock) || 0) <= (Number(m.min_stock_alert) || 30);
                    return (
                      <tr key={m.id}>
                        <td><span className="code-cell">{m.sku}</span></td>
                        <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{m.name}</td>
                        <td><span className="tag-neutral">{m.category}</span></td>
                        <td>
                          <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{m.current_stock} {m.unit}</span>
                        </td>
                        <td>{formatCurrency(m.unit_cost)} / {m.unit}</td>
                        <td style={{ fontWeight: 700, color: '#047857' }}>{formatCurrency(totalVal)}</td>
                        <td style={{ fontSize: '0.78rem', color: '#4B5563' }}>{m.supplier_name || 'Distributor Tekstil'}</td>
                        <td>
                          {isLow ? (
                            <span className="badge-low-stock">⚠️ Stok Kritis (&lt;{m.min_stock_alert} {m.unit})</span>
                          ) : (
                            <span className="badge-qc-pass">✓ Stok Aman</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── 6. WORKERS VIEW (Mitra Penjahit Studio) ── */}
        {activeTabId === 'workers' && (
          <div className="fade-in-up">
            <div className="clean-panel">
              <div className="clean-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 className="clean-panel-title">Jaringan Mitra Penjahit Rumahan &amp; Kluster</h5>
                  <p className="clean-panel-sub" style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)' }}>Kelola multi-keahlian spesialisasi produk, custom rate borongan, nomor WhatsApp, dan akun login aplikasi</p>
                </div>
                <button 
                  type="button" 
                  className="btn-portal-primary"
                  onClick={() => setShowAddWorkerModal(true)}
                >
                  + Daftarkan Penjahit Baru
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>Penjahit &amp; ID</th>
                      <th>Spesialisasi Keahlian (Multi-Skill)</th>
                      <th>Kluster / Wilayah</th>
                      <th>Rate Upah Borongan</th>
                      <th>Rekening Bank / E-Wallet</th>
                      <th>Riwayat Performa</th>
                      <th>Status</th>
                      <th>Aksi Mitra</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workers.map(w => (
                      <tr key={w.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={w.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'} alt={w.name} className="worker-avatar-img" />
                            <div>
                              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{w.name}</div>
                              <span className="code-cell">{w.worker_code || w.id}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '220px' }}>
                            {Array.isArray(w.skills) ? w.skills.map((sk, sIdx) => (
                              <span key={sIdx} className="badge-skill-tag">{sk}</span>
                            )) : <span className="badge-skill-tag">{w.skills}</span>}
                          </div>
                        </td>
                        <td style={{ fontSize: '0.78rem', color: '#4B5563' }}>{w.village || 'Batam'}</td>
                        <td>
                          {w.custom_rate_override && Number(w.custom_rate_override) > 0 ? (
                            <div>
                              <div style={{ fontWeight: 700, color: '#BE185D' }}>{formatCurrency(w.custom_rate_override)} / pcs</div>
                              <div style={{ fontSize: '0.66rem', color: '#9D174D', fontWeight: 600 }}>⭐ Custom Senior Rate</div>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Ikuti Rate Standar Produk</span>
                          )}
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: '0.78rem' }}>{w.bank_name || 'BCA'}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{w.bank_account || '-'} a.n {w.account_holder || w.name}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>{w.completed_spk_count || 0} SPK Selesai</div>
                          <div style={{ fontSize: '0.70rem', color: '#059669', fontWeight: 600 }}>QC Pass: {w.qc_pass_rate || 98.5}% (⭐ {w.rating || 4.9})</div>
                        </td>
                        <td>
                          <span className="status-pill status-active">{w.status || 'Aktif'}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <a 
                              href={`https://wa.me/${w.phone || '6281277665544'}?text=${encodeURIComponent(`Halo ${w.name}, berikut informasi penugasan produksi dari PT Simpul Fashion.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-table-action-wa"
                              title="Kirim Pesan WhatsApp"
                            >
                              <IconWhatsApp />
                            </a>
                            <button 
                              type="button" 
                              className="btn-table-action-sm"
                              title="Lihat Akun Login Pekerja"
                              onClick={() => {
                                setSelectedWorker(w);
                                setShowWorkerLoginModal(true);
                              }}
                            >
                              🔑 Login
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 7. DISPUTE & REWORK LOG (Social Impact Rubric) ── */}
        {activeTabId === 'disputes' && (
          <div className="fade-in-up">
            <div className="clean-panel">
              <div className="clean-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 className="clean-panel-title">Log Rekonsiliasi, Sengketa Upah &amp; Rework</h5>
                  <p className="clean-panel-sub" style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)' }}>Pencatatan formal klarifikasi upah borongan dan revisi jahit guna mencegah sengketa informal tanpa rekaman</p>
                </div>
                <button 
                  type="button" 
                  className="btn-portal-primary"
                  onClick={() => setShowDisputeModal(true)}
                >
                  + Catat Klarifikasi / Sengketa Baru
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="clean-table">
                  <thead>
                    <tr>
                      <th>ID Kasus</th>
                      <th>Tanggal</th>
                      <th>Mitra Penjahit</th>
                      <th>No. SPK Terkait</th>
                      <th>Kategori Masalah</th>
                      <th>Deskripsi Sengketa</th>
                      <th>Solusi &amp; Rekonsiliasi</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {disputes.map(d => (
                      <tr key={d.id}>
                        <td><span className="code-cell">{d.id}</span></td>
                        <td style={{ fontSize: '0.78rem', color: '#4B5563' }}>{d.date}</td>
                        <td style={{ fontWeight: 700 }}>{d.workerName}</td>
                        <td><span className="code-cell">{d.spkNumber}</span></td>
                        <td><span className="tag-neutral">{d.category}</span></td>
                        <td style={{ fontSize: '0.78rem', maxWidth: '240px' }}>{d.description}</td>
                        <td style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 600, maxWidth: '240px' }}>{d.resolution}</td>
                        <td><span className="badge-qc-pass">✓ {d.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 8. FINANCE & HPP VIEW ── */}
        {activeTabId === 'finance' && (
          <div className="fade-in-up">
            <div className="clean-panel">
              <div className="clean-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 className="clean-panel-title">Kalkulator HPP &amp; Beban Finansial Produksi</h5>
                  <p className="clean-panel-sub" style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-muted)' }}>Struktur transparansi beban upah jahit borongan, biaya bahan baku, dan margin keuntungan bersih</p>
                </div>
                <button 
                  type="button" 
                  className="btn-portal-primary"
                  onClick={() => setShowCredibilityModal(true)}
                >
                  📄 Export Laporan Kredibilitas Bank (PDF)
                </button>
              </div>
              <div className="clean-panel-body">
                <div className="finance-kpi-grid">
                  <div className="finance-kpi-card">
                    <div className="finance-kpi-label">Nilai Omset SPK Terbit</div>
                    <div className="finance-kpi-val">{formatCurrency(grossSalesVal)}</div>
                  </div>
                  <div className="finance-kpi-card">
                    <div className="finance-kpi-label">Total Upah Jahit Borongan</div>
                    <div className="finance-kpi-val" style={{ color: '#BE185D' }}>{formatCurrency(totalPiecePayVal)}</div>
                  </div>
                  <div className="finance-kpi-card">
                    <div className="finance-kpi-label">Estimasi Margin Kotor Usaha</div>
                    <div className="finance-kpi-val" style={{ color: '#10B981' }}>{formatCurrency((grossSalesVal || 0) - (totalPiecePayVal || 0))}</div>
                  </div>
                </div>

                <div className="finance-formula-box">
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Formula Standar HPP Industri Konveksi:</div>
                  <code>HPP per Pcs = (Biaya Kain/Bahan per Pcs) + (Upah Jahit Borongan Standar) + (Trims/Packaging) + (Logistik Antar-Jemput)</code>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 9. SETTINGS — IDENTITAS USAHA ── */}
        {activeTabId === 'settings-profile' && (
          <div className="settings-page fade-in-up">
            {saveSuccessToast && (
              <div className="toast-banner-success">
                <span>{toastMessage}</span>
                <span className="toast-tag-success">TERSIMPAN</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="settings-tab-content">
              <div className="clean-panel">
                <div className="clean-panel-header">
                  <h5 className="clean-panel-title">Profil Bisnis &amp; Legalitas Usaha</h5>
                </div>
                <div className="clean-panel-body">
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Nama Perusahaan / Konveksi <span className="req-star">*</span></label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        required
                        value={companySettings.companyName}
                        onChange={e => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                        placeholder="PT Simpul Fashion Indonesia" 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nama Brand Apparel</label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        value={companySettings.brandName}
                        onChange={e => setCompanySettings({ ...companySettings, brandName: e.target.value })}
                        placeholder="Contoh: Simpul Apparel" 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Bentuk Badan Usaha</label>
                      <select 
                        className="form-control-select" 
                        value={companySettings.businessType}
                        onChange={e => setCompanySettings({ ...companySettings, businessType: e.target.value })}
                      >
                        <option value="Perseorangan / UD">Perseorangan / UD (Usaha Dagang)</option>
                        <option value="CV (Persekutuan Komanditer)">CV (Persekutuan Komanditer)</option>
                        <option value="PT (Perseroan Terbatas)">PT (Perseroan Terbatas)</option>
                        <option value="Koperasi / Kelompok Pengrajin">Koperasi / Kelompok Pengrajin</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Sektor / Bidang Usaha</label>
                      <select 
                        className="form-control-select" 
                        value={companySettings.businessSector}
                        onChange={e => setCompanySettings({ ...companySettings, businessSector: e.target.value })}
                      >
                        <option value="Konveksi & Pakaian Jadi">Konveksi &amp; Pakaian Jadi</option>
                        <option value="Garmen Skala Menengah">Garmen Skala Menengah</option>
                        <option value="Sablon & Bordir Komputer">Sablon &amp; Bordir Komputer</option>
                        <option value="Fashion Boutique & Hijab">Fashion Boutique &amp; Hijab</option>
                        <option value="Lainnya (Others)">Lainnya (Others)</option>
                      </select>

                      {/* Dynamic Custom Sektor Field when 'Lainnya' selected */}
                      {companySettings.businessSector === 'Lainnya (Others)' && (
                        <input 
                          type="text" 
                          className="form-control-input" 
                          style={{ marginTop: '8px' }}
                          required
                          value={companySettings.customSector}
                          onChange={e => setCompanySettings({ ...companySettings, customSector: e.target.value })}
                          placeholder="Ketikkan spesifik sektor usaha kamu..." 
                        />
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">NIB / NPWP Usaha</label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        value={companySettings.nib}
                        onChange={e => setCompanySettings({ ...companySettings, nib: e.target.value })}
                        placeholder="1234567890123 (Opsional)" 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Skala Usaha</label>
                      <select 
                        className="form-control-select" 
                        value={companySettings.businessSize}
                        onChange={e => setCompanySettings({ ...companySettings, businessSize: e.target.value })}
                      >
                        <option value="Usaha Mikro (1 - 4 Penjahit)">Usaha Mikro (1–4 Penjahit)</option>
                        <option value="Usaha Kecil (5 - 19 Penjahit)">Usaha Kecil (5–19 Penjahit)</option>
                        <option value="Usaha Menengah (20 - 99 Penjahit)">Usaha Menengah (20–99 Penjahit)</option>
                        <option value="Usaha Besar (100+ Penjahit / Pabrik)">Usaha Besar (100+ Penjahit)</option>
                      </select>
                    </div>

                    <div className="form-group-full">
                      <label className="form-label">Deskripsi Usaha</label>
                      <textarea 
                        rows={2} 
                        className="form-control-textarea"
                        value={companySettings.businessDescription}
                        onChange={e => setCompanySettings({ ...companySettings, businessDescription: e.target.value })}
                        placeholder="Deskripsi singkat usaha konveksi kamu..." 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="clean-panel">
                <div className="clean-panel-header">
                  <h5 className="clean-panel-title">Kontak &amp; Alamat Workshop</h5>
                </div>
                <div className="clean-panel-body">
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Penanggung Jawab (PIC) <span className="req-star">*</span></label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        required
                        value={companySettings.picName}
                        onChange={e => setCompanySettings({ ...companySettings, picName: e.target.value })}
                        placeholder="Nama PIC" 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Jabatan</label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        value={companySettings.picRole}
                        onChange={e => setCompanySettings({ ...companySettings, picRole: e.target.value })}
                        placeholder="Owner / Manajer Produksi" 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nomor WhatsApp <span className="req-star">*</span></label>
                      <input 
                        type="tel" 
                        className="form-control-input" 
                        required
                        value={companySettings.phone}
                        onChange={e => setCompanySettings({ ...companySettings, phone: e.target.value })}
                        placeholder="0812xxxxxxxx" 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Resmi <span className="req-star">*</span></label>
                      <input 
                        type="email" 
                        className="form-control-input" 
                        required
                        value={companySettings.workEmail}
                        onChange={e => setCompanySettings({ ...companySettings, workEmail: e.target.value })}
                        placeholder="admin@simpul.id" 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Kota <span className="req-star">*</span></label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        required
                        value={companySettings.city}
                        onChange={e => setCompanySettings({ ...companySettings, city: e.target.value })}
                        placeholder="Batam" 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Alamat Workshop <span className="req-star">*</span></label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        required
                        value={companySettings.address}
                        onChange={e => setCompanySettings({ ...companySettings, address: e.target.value })}
                        placeholder="Jl. Hang Nadim No. 45, Batam Centre" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="settings-bottom-bar">
                <button type="submit" className="btn-portal-primary">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── 8. SETTINGS — SOP PRODUKSI ── */}
        {activeTabId === 'settings-operations' && (
          <div className="settings-page fade-in-up">
            {saveSuccessToast && (
              <div className="toast-banner-success">
                <span>Perubahan SOP berhasil disimpan.</span>
                <span className="toast-tag-success">TERSIMPAN</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="settings-tab-content">
              <div className="clean-panel">
                <div className="clean-panel-header">
                  <h5 className="clean-panel-title">Alur &amp; Standar Pengerjaan</h5>
                </div>
                <div className="clean-panel-body">
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Skema Produksi</label>
                      <select 
                        className="form-control-select" 
                        value={companySettings.productionScheme}
                        onChange={e => setCompanySettings({ ...companySettings, productionScheme: e.target.value })}
                      >
                        <option value="CMT (Cut-Make-Trim / Upah Jahit Saja)">CMT (Cut-Make-Trim) — Ongkos Jahit Saja</option>
                        <option value="FOB (Full Order / Termasuk Penyediaan Bahan)">FOB (Full Order) — Bahan Disediakan Usaha</option>
                        <option value="Maklon Penuh ke Pengrajin">Maklon Penuh ke Mitra</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Sistem Produksi</label>
                      <select 
                        className="form-control-select" 
                        value={companySettings.productionModel}
                        onChange={e => setCompanySettings({ ...companySettings, productionModel: e.target.value })}
                      >
                        <option value="Make-to-Stock (Produksi Stok Rutin)">Make-to-Stock — Produksi Stok Rutin</option>
                        <option value="Make-to-Order (Sesuai Pesanan Masuk)">Make-to-Order — Sesuai Order Masuk</option>
                        <option value="Batch Production (Jadwal Rilis Tertentu)">Batch Production — Jadwal Tertentu</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Prefix Nomor SPK</label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        value={companySettings.spkPrefix}
                        onChange={e => setCompanySettings({ ...companySettings, spkPrefix: e.target.value })}
                        placeholder="SPK" 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Lead Time Standar (Hari)</label>
                      <input 
                        type="number" 
                        className="form-control-input" 
                        value={companySettings.standardLeadTimeDays}
                        onChange={e => setCompanySettings({ ...companySettings, standardLeadTimeDays: e.target.value })}
                        placeholder="5" 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Toleransi Cacat Mutu QC (%)</label>
                      <input 
                        type="number" 
                        className="form-control-input" 
                        value={companySettings.qcTolerancePct}
                        onChange={e => setCompanySettings({ ...companySettings, qcTolerancePct: e.target.value })}
                        placeholder="3" 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Logistik Antar-Jemput</label>
                      <select 
                        className="form-control-select" 
                        value={companySettings.courierModel}
                        onChange={e => setCompanySettings({ ...companySettings, courierModel: e.target.value })}
                      >
                        <option value="Kurir Antar-Jemput Simpul">Kurir Antar-Jemput Simpul</option>
                        <option value="Armada Kurir Sendiri">Armada Kurir Sendiri</option>
                        <option value="Penjahit Ambil & Antar Sendiri">Mitra Ambil &amp; Antar Sendiri</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="settings-bottom-bar">
                <button type="submit" className="btn-portal-primary">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── 9. SETTINGS — PEMBAYARAN UPAH ── */}
        {activeTabId === 'settings-payment' && (
          <div className="settings-page fade-in-up">
            {saveSuccessToast && (
              <div className="toast-banner-success">
                <span>Perubahan rekening pembayaran berhasil disimpan.</span>
                <span className="toast-tag-success">TERSIMPAN</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="settings-tab-content">
              <div className="clean-panel">
                <div className="clean-panel-header">
                  <h5 className="clean-panel-title">Pembayaran &amp; Rekening</h5>
                </div>
                <div className="clean-panel-body">
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Jadwal Pencairan Upah</label>
                      <select 
                        className="form-control-select" 
                        value={companySettings.paymentSchedule}
                        onChange={e => setCompanySettings({ ...companySettings, paymentSchedule: e.target.value })}
                      >
                        <option value="Otomatis per SPK Selesai (Lolos QC)">Otomatis per SPK Selesai &amp; Lolos QC</option>
                        <option value="Rekap Mingguan (Setiap Hari Jumat)">Rekap Mingguan (Setiap Hari Jumat)</option>
                        <option value="Rekap Dua Mingguan">Rekap Dua Mingguan</option>
                        <option value="Rekap Bulanan">Rekap Bulanan</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Kebijakan Reject</label>
                      <select 
                        className="form-control-select" 
                        value={companySettings.defectPolicy}
                        onChange={e => setCompanySettings({ ...companySettings, defectPolicy: e.target.value })}
                      >
                        <option value="Koreksi Ulang oleh Penjahit (No Charge)">Koreksi Ulang oleh Penjahit</option>
                        <option value="Potong Upah per Potong Rusak">Potong Upah per Pcs Rusak</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Bank Usaha</label>
                      <select 
                        className="form-control-select" 
                        value={companySettings.bankName}
                        onChange={e => setCompanySettings({ ...companySettings, bankName: e.target.value })}
                      >
                        <option value="BCA (Bank Central Asia)">BCA</option>
                        <option value="Bank Mandiri">Mandiri</option>
                        <option value="BRI (Bank Rakyat Indonesia)">BRI</option>
                        <option value="BNI (Bank Negara Indonesia)">BNI</option>
                        <option value="BSI (Bank Syariah Indonesia)">BSI</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nomor Rekening</label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        value={companySettings.bankAccountNumber}
                        onChange={e => setCompanySettings({ ...companySettings, bankAccountNumber: e.target.value })}
                        placeholder="Nomor Rekening Bank" 
                      />
                    </div>

                    <div className="form-group-full">
                      <label className="form-label">Nama Pemilik Rekening</label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        value={companySettings.bankAccountHolder}
                        onChange={e => setCompanySettings({ ...companySettings, bankAccountHolder: e.target.value })}
                        placeholder="Nama Sesuai Buku Tabungan" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="settings-bottom-bar">
                <button type="submit" className="btn-portal-primary">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── 10. SETTINGS — TIM & AKSES ── */}
        {activeTabId === 'settings-team' && (
          <div className="settings-page fade-in-up">
            <div className="clean-panel">
              <div className="clean-panel-header">
                <h5 className="clean-panel-title">Pengelola Akun</h5>
              </div>
              <div className="clean-panel-body">
                <div className="team-member-list">
                  <div className="team-member-row">
                    <div className="team-member-avatar">
                      {(companySettings.picName || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div className="team-member-info">
                      <div className="team-member-name">{companySettings.picName || 'Admin Utama'} (Pemilik)</div>
                      <div className="team-member-email">{companySettings.workEmail || 'admin@simpul.id'}</div>
                    </div>
                    <span className="status-pill status-active">Super Admin</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 11. SETTINGS — NOTIFIKASI ── */}
        {activeTabId === 'settings-notifications' && (
          <div className="settings-page fade-in-up">
            {saveSuccessToast && (
              <div className="toast-banner-success">
                <span>Pengaturan notifikasi berhasil diperbarui.</span>
                <span className="toast-tag-success">TERSIMPAN</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="settings-tab-content">
              <div className="clean-panel">
                <div className="clean-panel-header">
                  <h5 className="clean-panel-title">Notifikasi Otomatis</h5>
                </div>
                <div className="clean-panel-body">
                  <div className="notif-toggle-container">
                    {[
                      { label: 'SPK Baru Diterbitkan', desc: 'Kirim rincian order via WhatsApp ke nomor penjahit' },
                      { label: 'Pengingat Deadline SPK', desc: 'Peringatan otomatis saat mendekati tanggal target selesai' },
                      { label: 'Lolos QC & Upah Cair', desc: 'Notifikasi saat barang lolos periksa dan upah cair' },
                      { label: 'Stok Kain Menipis', desc: 'Alert saat sisa stok bahan di bawah batas aman' },
                    ].map((item, idx) => (
                      <div key={idx} className="notif-toggle-row">
                        <div>
                          <div className="notif-toggle-label">{item.label}</div>
                          <div className="notif-toggle-desc">{item.desc}</div>
                        </div>
                        <div className="toggle-switch on">
                          <div className="toggle-thumb" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="settings-bottom-bar">
                <button type="submit" className="btn-portal-primary">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* ══════════════════════════════════════════════════════════════════
          ENTERPRISE INDUSTRIAL MODALS (STRUCTURED STUDIO SUITE)
          ══════════════════════════════════════════════════════════════════ */}

      {/* ══════════════════════════════════════════════════════════════════
          ENTERPRISE INDUSTRIAL MODALS (STRUCTURED STUDIO SUITE)
          ══════════════════════════════════════════════════════════════════ */}

      {/* ── 1. MODAL EXPERT: PENERBITAN SPK (SURAT PERINTAH KERJA) ── */}
      {showCreateWOModal && (
        <div className="modal-backdrop-custom" onClick={() => setShowCreateWOModal(false)}>
          <div className="modal-sheet modal-sheet-wide" onClick={e => e.stopPropagation()}>
            <div className="modal-sheet-header">
              <div>
                <h5 className="modal-sheet-title">Penerbitan Surat Perintah Kerja (SPK)</h5>
                <div className="modal-sheet-subtitle">Instruksi Produksi Resmi, Pemotongan Otomatis Bahan (BOM), &amp; Penugasan Penjahit</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="status-pill status-assigned">Draf Baru</span>
                <button type="button" className="modal-close-btn" onClick={() => setShowCreateWOModal(false)}>&times;</button>
              </div>
            </div>
            
            <form onSubmit={handleCreateWO}>
              <div className="modal-sheet-body">
                
                {/* Section 1: Produk & Volume */}
                <div className="modal-form-section">
                  <div className="modal-section-heading">1. Rincian Batch &amp; Spesifikasi Produk</div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Pilih Produk Konveksi <span className="req-star">*</span></label>
                      <select 
                        className="form-control-select" 
                        required 
                        value={newWO.product_id} 
                        onChange={e => {
                          const pid = e.target.value;
                          const prd = products.find(p => p.id === pid);
                          const leadDays = prd ? Math.max(2, Math.ceil((Number(newWO.quantity || 50) * (prd.estimated_mins_per_piece || 45)) / 480)) : 5;
                          const autoDate = new Date(Date.now() + leadDays * 86400000).toISOString().split('T')[0];
                          setNewWO({ ...newWO, product_id: pid, target_date: autoDate });
                        }}
                      >
                        <option value="">-- Pilih Katalog Produk --</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.sku}) • Upah: {formatCurrency(p.piece_rate_pay)}/pcs • Est: {p.estimated_mins_per_piece || 45} mnt/pcs
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Jumlah Target Potong (Pcs) <span className="req-star">*</span></label>
                      <input 
                        type="number" 
                        min="1"
                        className="form-control-input" 
                        required 
                        placeholder="50" 
                        value={newWO.quantity} 
                        onChange={e => setNewWO({ ...newWO, quantity: e.target.value })} 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Target Tanggal Selesai (Deadline Otomatis) <span className="req-star">*</span></label>
                      <input 
                        type="date" 
                        required
                        className="form-control-input" 
                        value={newWO.target_date} 
                        onChange={e => setNewWO({ ...newWO, target_date: e.target.value })} 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tingkat Prioritas Pengerjaan</label>
                      <select 
                        className="form-control-select" 
                        value={newWO.priority} 
                        onChange={e => setNewWO({ ...newWO, priority: e.target.value })}
                      >
                        <option value="Reguler (Standar)">Reguler (Standar Sesuai Lead Time)</option>
                        <option value="Prioritas Tinggi (Rush Order)">Prioritas Tinggi (Rush / Kilat)</option>
                        <option value="Batch Produksi Bertahap">Batch Produksi Bertahap</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Penugasan Penjahit & Alur Logistik */}
                <div className="modal-form-section">
                  <div className="modal-section-heading">2. Penugasan Mitra Penjahit (Smart Matching)</div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Pilih Mitra Penjahit <span className="req-star">*</span></label>
                      <select 
                        className="form-control-select" 
                        required 
                        value={newWO.worker_id} 
                        onChange={e => setNewWO({ ...newWO, worker_id: e.target.value })}
                      >
                        <option value="">-- Pilih Penjahit --</option>
                        {workers.map(w => {
                          const isSkillMatch = selectedProdObj && w.skills && w.skills.some(s => selectedProdObj.category.includes(s.split(' ')[0]));
                          return (
                            <option key={w.id} value={w.id}>
                              {isSkillMatch ? '⭐ [Cocok] ' : ''}{w.name} • {Array.isArray(w.skills) ? w.skills.join(', ') : w.skills} ({w.village || 'Batam'}) {w.custom_rate_override && Number(w.custom_rate_override) > 0 ? `(Rate: ${formatCurrency(w.custom_rate_override)})` : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Metode Logistik Bahan</label>
                      <select 
                        className="form-control-select" 
                        value={newWO.delivery_type} 
                        onChange={e => setNewWO({ ...newWO, delivery_type: e.target.value })}
                      >
                        <option value="Kurir Antar-Jemput Simpul">Kurir Antar-Jemput Simpul</option>
                        <option value="Mitra Ambil Mandiri di Workshop">Mitra Ambil Mandiri di Workshop</option>
                        <option value="Armada Kurir Internal Usaha">Armada Kurir Internal Usaha</option>
                      </select>
                    </div>

                    <div className="form-group-full">
                      <label className="form-label">Instruksi Khusus &amp; Catatan Standar QC</label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        value={newWO.qc_notes} 
                        onChange={e => setNewWO({ ...newWO, qc_notes: e.target.value })}
                        placeholder="Contoh: Jahit obras rangkap, benang katun putih, label di kerah dalam..." 
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Live BOM Deduction Preview */}
                {selectedProdObj && selectedProdObj.bom && selectedProdObj.bom.length > 0 && (
                  <div className="modal-form-section" style={{ background: '#FFFBEB', border: '1px solid #FEF3C7' }}>
                    <div className="modal-section-heading" style={{ color: '#B45309' }}>
                      📦 Pemotongan Otomatis Stok Bahan Baku (BOM)
                    </div>
                    <div style={{ fontSize: '0.76rem', color: '#92400E' }}>
                      {selectedProdObj.bom.map((b, bIdx) => {
                        const totalReq = (Number(b.usagePerPiece) * (Number(newWO.quantity) || 0));
                        return (
                          <div key={bIdx} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                            <span>• {b.materialName} ({b.usagePerPiece} {b.unit}/pcs):</span>
                            <strong>Akan dipotong: {Math.round(totalReq * 10) / 10} {b.unit}</strong>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Section 4: Live Calculation Card */}
                <div className="modal-calc-card">
                  <div className="calc-card-grid">
                    <div className="calc-item">
                      <span className="calc-label">Ongkos Jahit / Pcs</span>
                      <span className="calc-value">{formatCurrency(woCalculations.unitPay)}</span>
                    </div>
                    <div className="calc-item">
                      <span className="calc-label">Total Upah Borongan</span>
                      <span className="calc-value" style={{ color: '#047857' }}>{formatCurrency(woCalculations.totalWage)}</span>
                    </div>
                    <div className="calc-item">
                      <span className="calc-label">Estimasi Nilai Omset</span>
                      <span className="calc-value">{formatCurrency(woCalculations.totalGross)}</span>
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-sheet-footer">
                <div className="modal-footer-summary">
                  {woCalculations.qty} Pcs • {formatCurrency(woCalculations.totalWage)} Kewajiban Upah
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" className="btn-portal-secondary" onClick={() => setShowCreateWOModal(false)}>Batal</button>
                  <button type="submit" className="btn-portal-primary">Terbitkan &amp; Potong Bahan</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 2. MODAL EXPERT: TAMBAH & EDIT PRODUK (KATALOG & BOM) ── */}
      {(showAddProductModal || showEditProductModal) && (
        <div className="modal-backdrop-custom" onClick={() => { setShowAddProductModal(false); setShowEditProductModal(false); }}>
          <div className="modal-sheet modal-sheet-wide" onClick={e => e.stopPropagation()}>
            <div className="modal-sheet-header">
              <div>
                <h5 className="modal-sheet-title">{showEditProductModal ? 'Edit Master Produk' : 'Pendaftaran Master Produk & BOM'}</h5>
                <div className="modal-sheet-subtitle">Katalog SKU, Varian Ukuran/Warna, Koneksi Bahan Baku, dan Ongkos Jahit</div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => { setShowAddProductModal(false); setShowEditProductModal(false); }}>&times;</button>
            </div>
            
            <form onSubmit={showEditProductModal ? handleEditProductSave : handleAddProduct}>
              <div className="modal-sheet-body">
                
                <div className="modal-form-section">
                  <div className="modal-section-heading">1. Identitas, Foto &amp; Klasifikasi Produk</div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Nama Model / Produk <span className="req-star">*</span></label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        required 
                        placeholder="Contoh: Kemeja Linen Casual Pria" 
                        value={showEditProductModal ? (editingProduct?.name || '') : newProduct.name} 
                        onChange={e => {
                          if (showEditProductModal) setEditingProduct({ ...editingProduct, name: e.target.value });
                          else setNewProduct({ ...newProduct, name: e.target.value });
                        }} 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Kode SKU / Master Code</label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        placeholder="Contoh: SKU-KMJ-01" 
                        value={showEditProductModal ? (editingProduct?.sku || '') : newProduct.sku} 
                        onChange={e => {
                          if (showEditProductModal) setEditingProduct({ ...editingProduct, sku: e.target.value });
                          else setNewProduct({ ...newProduct, sku: e.target.value });
                        }} 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Kategori Produk</label>
                      <select 
                        className="form-control-select" 
                        value={showEditProductModal ? (editingProduct?.category || 'Kemeja & Blouse') : newProduct.category} 
                        onChange={e => {
                          if (showEditProductModal) setEditingProduct({ ...editingProduct, category: e.target.value });
                          else setNewProduct({ ...newProduct, category: e.target.value });
                        }}
                      >
                        <option value="Kemeja & Blouse">Kemeja &amp; Blouse</option>
                        <option value="Kaos & Polo">Kaos &amp; Polo Distro</option>
                        <option value="Gamis & Abaya">Gamis &amp; Abaya Syar'i</option>
                        <option value="Celana Chino & Formal">Celana Chino &amp; Formal</option>
                        <option value="Jaket & Outer">Jaket &amp; Outerwear</option>
                        <option value="Uniform & Seragam">Uniform &amp; Seragam</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">URL Foto Produk</label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        placeholder="https://images.unsplash.com/..." 
                        value={showEditProductModal ? (editingProduct?.photo || '') : newProduct.photo} 
                        onChange={e => {
                          if (showEditProductModal) setEditingProduct({ ...editingProduct, photo: e.target.value });
                          else setNewProduct({ ...newProduct, photo: e.target.value });
                        }} 
                      />
                    </div>

                    <div className="form-group-full">
                      <label className="form-label">Deskripsi Singkat Produk</label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        placeholder="Deskripsi bahan, fitting, dan keunggulan produk..." 
                        value={showEditProductModal ? (editingProduct?.description || '') : newProduct.description} 
                        onChange={e => {
                          if (showEditProductModal) setEditingProduct({ ...editingProduct, description: e.target.value });
                          else setNewProduct({ ...newProduct, description: e.target.value });
                        }} 
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-form-section">
                  <div className="modal-section-heading">2. Varian Ukuran, Warna &amp; Waktu Produksi</div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Varian Warna (Pisahkan dengan Koma)</label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        placeholder="Navy, Broken White, Sage Green" 
                        value={showEditProductModal ? (Array.isArray(editingProduct?.colors) ? editingProduct.colors.join(', ') : (editingProduct?.colors || '')) : newProduct.colors} 
                        onChange={e => {
                          if (showEditProductModal) setEditingProduct({ ...editingProduct, colors: e.target.value.split(',').map(s => s.trim()) });
                          else setNewProduct({ ...newProduct, colors: e.target.value });
                        }} 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Estimasi Waktu Produksi / Pcs (Menit) <span className="req-star">*</span></label>
                      <input 
                        type="number" 
                        className="form-control-input" 
                        required
                        placeholder="45" 
                        value={showEditProductModal ? (editingProduct?.estimated_mins_per_piece || 45) : newProduct.estimated_mins_per_piece} 
                        onChange={e => {
                          if (showEditProductModal) setEditingProduct({ ...editingProduct, estimated_mins_per_piece: e.target.value });
                          else setNewProduct({ ...newProduct, estimated_mins_per_piece: e.target.value });
                        }} 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Stok Barang Jadi Saat Ini (Pcs)</label>
                      <input 
                        type="number" 
                        className="form-control-input" 
                        placeholder="50" 
                        value={showEditProductModal ? (editingProduct?.stock_quantity || 0) : newProduct.stock_quantity} 
                        onChange={e => {
                          if (showEditProductModal) setEditingProduct({ ...editingProduct, stock_quantity: e.target.value });
                          else setNewProduct({ ...newProduct, stock_quantity: e.target.value });
                        }} 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Batas Minimum Alert Stok Menipis (Pcs)</label>
                      <input 
                        type="number" 
                        className="form-control-input" 
                        placeholder="20" 
                        value={showEditProductModal ? (editingProduct?.min_stock_alert || 20) : newProduct.min_stock_alert} 
                        onChange={e => {
                          if (showEditProductModal) setEditingProduct({ ...editingProduct, min_stock_alert: e.target.value });
                          else setNewProduct({ ...newProduct, min_stock_alert: e.target.value });
                        }} 
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-form-section">
                  <div className="modal-section-heading">3. Koneksi Bahan Baku (BOM) &amp; Skema Finansial</div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Hubungkan Kain Utama (BOM)</label>
                      <select 
                        className="form-control-select" 
                        value={newProduct.bomMaterialId} 
                        onChange={e => setNewProduct({ ...newProduct, bomMaterialId: e.target.value })}
                      >
                        <option value="">-- Pilih Bahan di Gudang --</option>
                        {materials.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.name} (Stok: {m.current_stock} {m.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Pemakaian Bahan / Pcs (Satuan Ukur)</label>
                      <input 
                        type="number" 
                        step="0.05"
                        className="form-control-input" 
                        placeholder="1.8" 
                        value={newProduct.bomUsage} 
                        onChange={e => setNewProduct({ ...newProduct, bomUsage: e.target.value })} 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Upah Jahit Borongan Standar / Pcs (Rp) <span className="req-star">*</span></label>
                      <input 
                        type="number" 
                        className="form-control-input" 
                        required 
                        placeholder="25000" 
                        value={showEditProductModal ? (editingProduct?.piece_rate_pay || '') : newProduct.piece_rate_pay} 
                        onChange={e => {
                          if (showEditProductModal) setEditingProduct({ ...editingProduct, piece_rate_pay: e.target.value });
                          else setNewProduct({ ...newProduct, piece_rate_pay: e.target.value });
                        }} 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Harga Jual Konsumen / Pcs (Rp) <span className="req-star">*</span></label>
                      <input 
                        type="number" 
                        className="form-control-input" 
                        required 
                        placeholder="135000" 
                        value={showEditProductModal ? (editingProduct?.selling_price || '') : newProduct.selling_price} 
                        onChange={e => {
                          if (showEditProductModal) setEditingProduct({ ...editingProduct, selling_price: e.target.value });
                          else setNewProduct({ ...newProduct, selling_price: e.target.value });
                        }} 
                      />
                    </div>
                  </div>

                  {(() => {
                    const pieceRate = Number(showEditProductModal ? editingProduct?.piece_rate_pay : newProduct.piece_rate_pay) || 0;
                    const sellingPrice = Number(showEditProductModal ? editingProduct?.selling_price : newProduct.selling_price) || 0;
                    const grossMargin = sellingPrice - pieceRate;
                    const marginPct = sellingPrice > 0 ? Math.round((grossMargin / sellingPrice) * 100) : 0;
                    return (
                      <div style={{
                        marginTop: '16px',
                        padding: '14px 16px',
                        background: 'rgba(255, 255, 255, 0.75)',
                        borderRadius: '12px',
                        border: '1px solid rgba(226, 232, 240, 0.9)',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '12px',
                        backdropFilter: 'blur(8px)'
                      }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Upah Jahit / Pcs</div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginTop: '2px' }}>
                            Rp {pieceRate.toLocaleString('id-ID')}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Harga Jual / Pcs</div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginTop: '2px' }}>
                            Rp {sellingPrice.toLocaleString('id-ID')}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Estimasi Margin Kasar</div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: grossMargin >= 0 ? '#059669' : '#dc2626', marginTop: '2px' }}>
                            Rp {grossMargin.toLocaleString('id-ID')} {sellingPrice > 0 ? `(${marginPct}%)` : ''}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

              </div>
              <div className="modal-sheet-footer">
                <button type="button" className="btn-portal-secondary" onClick={() => { setShowAddProductModal(false); setShowEditProductModal(false); }}>Batal</button>
                <button type="submit" className="btn-portal-primary">{showEditProductModal ? 'Simpan Perubahan' : 'Simpan Master Produk & BOM'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 3. MODAL EXPERT: REGISTRASI MITRA PENJAHIT (MULTI-SKILL) ── */}
      {showAddWorkerModal && (
        <div className="modal-backdrop-custom" onClick={() => setShowAddWorkerModal(false)}>
          <div className="modal-sheet modal-sheet-wide" onClick={e => e.stopPropagation()}>
            <div className="modal-sheet-header">
              <div>
                <h5 className="modal-sheet-title">Registrasi Mitra Penjahit Rumahan</h5>
                <div className="modal-sheet-subtitle">Data Mitra, Multi-Spesialisasi Keahlian, Override Rate Senior, dan Rekening Upah</div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setShowAddWorkerModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddWorker}>
              <div className="modal-sheet-body">
                
                <div className="modal-form-section">
                  <div className="modal-section-heading">1. Identitas &amp; Kontak WhatsApp Mitra</div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Nama Lengkap Penjahit <span className="req-star">*</span></label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        required 
                        placeholder="Contoh: Ibu Siti Aminah" 
                        value={newWorker.name} 
                        onChange={e => setNewWorker({ ...newWorker, name: e.target.value })} 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nomor WhatsApp Aktif <span className="req-star">*</span></label>
                      <input 
                        type="tel" 
                        className="form-control-input" 
                        required 
                        placeholder="081277665544 (Untuk kirim info SPK)" 
                        value={newWorker.phone} 
                        onChange={e => setNewWorker({ ...newWorker, phone: e.target.value })} 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Kluster / Lokasi Domisili</label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        placeholder="Kluster Bengkong Kolam, Batam" 
                        value={newWorker.village} 
                        onChange={e => setNewWorker({ ...newWorker, village: e.target.value })} 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Custom Rate Override / Pcs (Opsional)</label>
                      <input 
                        type="number" 
                        className="form-control-input" 
                        placeholder="0 (Kosongkan jika ikuti standar produk)" 
                        value={newWorker.custom_rate_override} 
                        onChange={e => setNewWorker({ ...newWorker, custom_rate_override: e.target.value })} 
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-form-section">
                  <div className="modal-section-heading">2. Multi-Spesialisasi Keahlian (Bisa Pilih Lebih dari 1)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {[
                      'Kemeja & Blouse',
                      'Kaos & Polo',
                      'Gamis & Abaya',
                      'Celana Chino & Formal',
                      'Jaket & Outer',
                      'Bordir & Aksesoris',
                      'Jahit Halus & Obras',
                      'Jahit Rantai Distro'
                    ].map((skill, skIdx) => {
                      const isChecked = Array.isArray(newWorker.skills) && newWorker.skills.includes(skill);
                      return (
                        <label key={skIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.80rem', padding: '6px 10px', background: isChecked ? '#FDF2F8' : '#FFFFFF', border: `1px solid ${isChecked ? '#F472B6' : '#E5E7EB'}`, borderRadius: '6px', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={isChecked}
                            onChange={e => {
                              if (e.target.checked) {
                                setNewWorker({ ...newWorker, skills: [...(newWorker.skills || []), skill] });
                              } else {
                                setNewWorker({ ...newWorker, skills: (newWorker.skills || []).filter(s => s !== skill) });
                              }
                            }}
                          />
                          <span style={{ fontWeight: isChecked ? 700 : 500, color: isChecked ? '#BE185D' : '#374151' }}>{skill}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="modal-form-section">
                  <div className="modal-section-heading">3. Rekening Penyaluran Upah Borongan</div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Pilihan Bank / E-Wallet</label>
                      <select 
                        className="form-control-select" 
                        value={newWorker.bank_name} 
                        onChange={e => setNewWorker({ ...newWorker, bank_name: e.target.value })}
                      >
                        <option value="BCA (Bank Central Asia)">BCA (Bank Central Asia)</option>
                        <option value="Bank Mandiri">Bank Mandiri</option>
                        <option value="BRI (Bank Rakyat Indonesia)">BRI</option>
                        <option value="BNI (Bank Negara Indonesia)">BNI</option>
                        <option value="GoPay / OVO / DANA">GoPay / OVO / DANA</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nomor Rekening / E-Wallet</label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        placeholder="Contoh: 8220194821" 
                        value={newWorker.bank_account} 
                        onChange={e => setNewWorker({ ...newWorker, bank_account: e.target.value })} 
                      />
                    </div>

                    <div className="form-group-full">
                      <label className="form-label">Nama Pemilik Rekening</label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        placeholder="Nama sesuai buku tabungan / e-wallet" 
                        value={newWorker.account_holder} 
                        onChange={e => setNewWorker({ ...newWorker, account_holder: e.target.value })} 
                      />
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-sheet-footer">
                <button type="button" className="btn-portal-secondary" onClick={() => setShowAddWorkerModal(false)}>Batal</button>
                <button type="submit" className="btn-portal-primary">Daftarkan Mitra Penjahit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 4. MODAL EXPERT: TAMBAH SALES ORDER (PESANAN MASUK) ── */}
      {showCreateSOModal && (
        <div className="modal-backdrop-custom" onClick={() => setShowCreateSOModal(false)}>
          <div className="modal-sheet modal-sheet-wide" onClick={e => e.stopPropagation()}>
            <div className="modal-sheet-header">
              <div>
                <h5 className="modal-sheet-title">Pencatatan Pesanan Masuk (Sales Order)</h5>
                <div className="modal-sheet-subtitle">Merekam PO Pelanggan Sebelum Diterbitkan Menjadi SPK Produksi</div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setShowCreateSOModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddSalesOrder}>
              <div className="modal-sheet-body">
                
                <div className="modal-form-section">
                  <div className="modal-section-heading">1. Identitas Pelanggan &amp; Produk Pesanan</div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Nama Pelanggan / Distro / Brand <span className="req-star">*</span></label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        required 
                        placeholder="Contoh: Distro Urban Batam" 
                        value={newSO.customerName} 
                        onChange={e => setNewSO({ ...newSO, customerName: e.target.value })} 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Pilih Produk Pesanan <span className="req-star">*</span></label>
                      <select 
                        className="form-control-select" 
                        required
                        value={newSO.productId} 
                        onChange={e => {
                          const p = products.find(x => x.id === e.target.value);
                          setNewSO({ ...newSO, productId: e.target.value, unitPrice: p ? String(p.selling_price) : '' });
                        }}
                      >
                        <option value="">-- Pilih Produk --</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name} ({formatCurrency(p.selling_price)})</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Kuantitas Pesanan (Pcs) <span className="req-star">*</span></label>
                      <input 
                        type="number" 
                        className="form-control-input" 
                        required 
                        placeholder="100" 
                        value={newSO.quantity} 
                        onChange={e => setNewSO({ ...newSO, quantity: e.target.value })} 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Harga Satuan ke Pelanggan (Rp)</label>
                      <input 
                        type="number" 
                        className="form-control-input" 
                        placeholder="135000" 
                        value={newSO.unitPrice} 
                        onChange={e => setNewSO({ ...newSO, unitPrice: e.target.value })} 
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-form-section">
                  <div className="modal-section-heading">2. Status Pembayaran &amp; Deadline Pengiriman</div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Status Pembayaran</label>
                      <select 
                        className="form-control-select" 
                        value={newSO.paymentStatus} 
                        onChange={e => setNewSO({ ...newSO, paymentStatus: e.target.value })}
                      >
                        <option value="DP 50% Diterima">DP 50% Diterima (Produksi Dimulai)</option>
                        <option value="Lunas 100%">Lunas 100% di Muka</option>
                        <option value="Tempo 14 Hari (B2B)">Tempo 14 Hari (Invoice)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Target Deadline Pengiriman <span className="req-star">*</span></label>
                      <input 
                        type="date" 
                        required 
                        className="form-control-input" 
                        value={newSO.deadline} 
                        onChange={e => setNewSO({ ...newSO, deadline: e.target.value })} 
                      />
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-sheet-footer">
                <button type="button" className="btn-portal-secondary" onClick={() => setShowCreateSOModal(false)}>Batal</button>
                <button type="submit" className="btn-portal-primary">Simpan Pesanan Masuk</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 5. MODAL EXPERT: INPUT INSPEKSI QC ACTUAL ── */}
      {showQCModal && selectedWO && (
        <div className="modal-backdrop-custom" onClick={() => setShowQCModal(false)}>
          <div className="modal-sheet modal-sheet-wide" onClick={e => e.stopPropagation()}>
            <div className="modal-sheet-header">
              <div>
                <h5 className="modal-sheet-title">Inspeksi Mutu Quality Control (QC) Actual</h5>
                <div className="modal-sheet-subtitle">{selectedWO.spk_number || selectedWO.code} • {selectedWO.product_name} ({selectedWO.quantity} pcs)</div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setShowQCModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleRecordQC}>
              <div className="modal-sheet-body">
                
                <div className="modal-form-section">
                  <div className="modal-section-heading">1. Hasil Uji Sampling Fisik</div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Nama Petugas QC</label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        value={qcForm.inspectorName} 
                        onChange={e => setQcForm({ ...qcForm, inspectorName: e.target.value })} 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Jumlah Lolos QC Sempurna (Pcs) <span className="req-star">*</span></label>
                      <input 
                        type="number" 
                        max={selectedWO.quantity}
                        className="form-control-input" 
                        required 
                        value={qcForm.passedQty} 
                        onChange={e => {
                          const passed = Number(e.target.value) || 0;
                          const rej = Math.max(0, Number(selectedWO.quantity) - passed);
                          setQcForm({ ...qcForm, passedQty: e.target.value, rejectedQty: String(rej) });
                        }} 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Jumlah Cacat / Reject (Pcs)</label>
                      <input 
                        type="number" 
                        className="form-control-input" 
                        value={qcForm.rejectedQty} 
                        onChange={e => {
                          const rej = Number(e.target.value) || 0;
                          const passed = Math.max(0, Number(selectedWO.quantity) - rej);
                          setQcForm({ ...qcForm, rejectedQty: e.target.value, passedQty: String(passed) });
                        }} 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tindakan Sesuai Kebijakan Reject</label>
                      <select 
                        className="form-control-select" 
                        value={qcForm.actionTaken} 
                        onChange={e => setQcForm({ ...qcForm, actionTaken: e.target.value })}
                      >
                        <option value="Rework Perbaikan Cepat oleh Penjahit (No Charge)">Rework Perbaikan Cepat oleh Penjahit (Bebas Biaya)</option>
                        <option value="Potong Upah Proporsional">Potong Upah Proporsional Sesuai Jumlah Reject</option>
                        <option value="Lolos Bersyarat (Grade B)">Lolos Bersyarat (Grade B)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-form-section">
                  <div className="modal-section-heading">2. Catatan Alasan Defect / Cacat</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    {[
                      'Jahitan Loncat / Putus',
                      'Noda Minyak / Kain',
                      'Ukuran Melenceng dari Pola',
                      'Obras Terlepas / Kurang Rapat',
                      'Kancing / Resleting Macet',
                      'Label / Hangtag Terbalik'
                    ].map((reason, rIdx) => {
                      const isSel = Array.isArray(qcForm.reasons) && qcForm.reasons.includes(reason);
                      return (
                        <label key={rIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', padding: '6px 8px', background: isSel ? '#FEE2E2' : '#FFFFFF', border: `1px solid ${isSel ? '#EF4444' : '#E5E7EB'}`, borderRadius: '6px', cursor: 'pointer' }}>
                          <input 
                            type="checkbox" 
                            checked={isSel}
                            onChange={e => {
                              if (e.target.checked) setQcForm({ ...qcForm, reasons: [...(qcForm.reasons || []), reason] });
                              else setQcForm({ ...qcForm, reasons: (qcForm.reasons || []).filter(r => r !== reason) });
                            }}
                          />
                          <span style={{ fontWeight: isSel ? 700 : 500, color: isSel ? '#991B1B' : '#374151' }}>{reason}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

              </div>
              <div className="modal-sheet-footer">
                <button type="button" className="btn-portal-secondary" onClick={() => setShowQCModal(false)}>Batal</button>
                <button type="submit" className="btn-portal-primary">Simpan Hasil QC</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 6. MODAL EXPERT: LAPORAN KREDIBILITAS UMKM (BANK FINANCING DOSSIER) ── */}
      {showCredibilityModal && (
        <div className="modal-backdrop-custom" onClick={() => setShowCredibilityModal(false)}>
          <div className="modal-sheet modal-sheet-wide" onClick={e => e.stopPropagation()}>
            <div className="modal-sheet-header">
              <div>
                <h5 className="modal-sheet-title">Laporan Kredibilitas Produksi &amp; Kesiapan Kredit UMKM</h5>
                <div className="modal-sheet-subtitle">Verifikasi Resmi Rekam Jejak Produksi untuk Pengajuan Pinjaman Bank (KUR/Komersial) &amp; Investor</div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setShowCredibilityModal(false)}>&times;</button>
            </div>
            
            <div className="modal-sheet-body">
              <div className="credit-dossier-card">
                <div className="credit-dossier-header">
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#18181B' }}>{companySettings.companyName || 'PT Simpul Fashion'}</div>
                    <div style={{ fontSize: '0.74rem', color: '#6B7280' }}>NIB: {companySettings.nib || '1234567890123'} • Sektor: {companySettings.businessSector} • Wilayah: {companySettings.city || 'Batam'}</div>
                  </div>
                  <div className="badge-verified-seal">
                    ✓ TERVERIFIKASI SIMPUL ERP
                  </div>
                </div>

                <div className="credit-metrics-grid">
                  <div className="credit-metric-box">
                    <div className="credit-metric-label">Total Volume Produksi Terverifikasi</div>
                    <div className="credit-metric-val">4.280 Pcs</div>
                    <div className="credit-metric-sub">Berdasarkan SPK digital tervalidasi</div>
                  </div>

                  <div className="credit-metric-box">
                    <div className="credit-metric-label">Ketepatan Waktu Pengiriman (On-Time)</div>
                    <div className="credit-metric-val" style={{ color: '#047857' }}>98.4%</div>
                    <div className="credit-metric-sub">Sesuai SLA pesanan pelanggan</div>
                  </div>

                  <div className="credit-metric-box">
                    <div className="credit-metric-label">Rata-rata Omset Bulanan</div>
                    <div className="credit-metric-val">{formatCurrency(148500000)}</div>
                    <div className="credit-metric-sub">Arus kas stabil &amp; terlacak</div>
                  </div>

                  <div className="credit-metric-box">
                    <div className="credit-metric-label">Tingkat Mutu QC Pass Rate</div>
                    <div className="credit-metric-val" style={{ color: '#047857' }}>98.1%</div>
                    <div className="credit-metric-sub">Standar cacat mutu rendah</div>
                  </div>
                </div>

                <div style={{ marginTop: '16px', padding: '12px 14px', background: '#FFFFFF', borderRadius: '8px', border: '1px dashed #D1D5DB' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.78rem', color: '#18181B', marginBottom: '4px' }}>
                    Pernyataan Kredibilitas Transparansi Upah Informal:
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#4B5563', margin: 0, lineHeight: 1.5 }}>
                    Seluruh pembayaran upah borongan kepada mitra penjahit disalurkan 100% melalui transfer bank/e-wallet formal dengan slip digital, tanpa ada sengketa pembayaran yang tertunda. Data ini dapat diverifikasi langsung oleh pihak Analis Kredit Bank Mandiri, BCA, BRI, maupun Lembaga Pembiayaan UMKM.
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-sheet-footer">
              <button type="button" className="btn-portal-secondary" onClick={() => setShowCredibilityModal(false)}>Tutup</button>
              <button 
                type="button" 
                className="btn-portal-primary"
                onClick={() => {
                  window.print();
                }}
              >
                🖨️ Cetak / Unduh Dokumen PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. MODAL EXPERT: SLIP GAJI / UPAH DIGITAL PER PENJAHIT ── */}
      {showWageSlipModal && selectedWO && (
        <div className="modal-backdrop-custom" onClick={() => setShowWageSlipModal(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-sheet-header">
              <div>
                <h5 className="modal-sheet-title">Slip Upah Kerja Digital Resmi</h5>
                <div className="modal-sheet-subtitle">Bukti Pembayaran Upah Formal untuk Mitra Penjahit</div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setShowWageSlipModal(false)}>&times;</button>
            </div>
            
            <div className="modal-sheet-body">
              <div className="wage-slip-paper">
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '10px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#18181B' }}>{companySettings.companyName || 'PT Simpul Fashion'}</div>
                    <div style={{ fontSize: '0.70rem', color: '#6B7280' }}>Bukti Pembayaran Borongan SPK</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="code-cell">{selectedWO.spk_number || selectedWO.code}</span>
                    <div style={{ fontSize: '0.68rem', color: '#6B7280', marginTop: '2px' }}>Tgl: {new Date().toLocaleDateString('id-ID')}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.78rem' }}>
                  <span style={{ color: '#6B7280' }}>Nama Penjahit:</span>
                  <strong>{selectedWO.worker_name}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.78rem' }}>
                  <span style={{ color: '#6B7280' }}>Produk:</span>
                  <span>{selectedWO.product_name}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.78rem' }}>
                  <span style={{ color: '#6B7280' }}>Volume Selesai &amp; Lolos QC:</span>
                  <strong>{selectedWO.quantity} pcs</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.78rem' }}>
                  <span style={{ color: '#6B7280' }}>Rate Upah Satuan:</span>
                  <span>{formatCurrency(selectedWO.piece_rate_pay || selectedWO.unit_pay || 25000)} / pcs</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px dashed #D1D5DB', marginTop: '10px', fontSize: '0.90rem' }}>
                  <strong>Total Bersih Dicairkan:</strong>
                  <strong style={{ color: '#047857', fontSize: '1.05rem' }}>{formatCurrency(selectedWO.total_piece_pay)}</strong>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: '#F9FAFB', borderRadius: '6px', fontSize: '0.68rem', color: '#6B7280' }}>
                  <div style={{ width: '28px', height: '28px', background: '#18181B', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontWeight: 800 }}>QR</div>
                  <div>Dokumen ini sah dan diterbitkan secara digital oleh Simpul ERP Enterprise.</div>
                </div>
              </div>
            </div>

            <div className="modal-sheet-footer">
              <button type="button" className="btn-portal-secondary" onClick={() => setShowWageSlipModal(false)}>Tutup</button>
              <button 
                type="button" 
                className="btn-portal-primary"
                onClick={() => window.print()}
              >
                🖨️ Cetak Slip Upah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 8. MODAL EXPERT: AUDIT LOG PERUBAHAN PRODUK ── */}
      {showAuditLogModal && (
        <div className="modal-backdrop-custom" onClick={() => setShowAuditLogModal(false)}>
          <div className="modal-sheet modal-sheet-wide" onClick={e => e.stopPropagation()}>
            <div className="modal-sheet-header">
              <div>
                <h5 className="modal-sheet-title">Riwayat Perubahan &amp; Audit Trail</h5>
                <div className="modal-sheet-subtitle">Rekam Jejak Penambahan, Update Harga, dan Penghapusan Data oleh Tim</div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setShowAuditLogModal(false)}>&times;</button>
            </div>
            
            <div className="modal-sheet-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {productAuditLogs.map(log => (
                  <div key={log.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#F9FAFB', borderRadius: '6px', border: '1px solid #F3F4F6' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>{log.details}</div>
                      <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>Oleh: <strong>{log.user}</strong> • {log.timestamp}</div>
                    </div>
                    <span className="tag-neutral">{log.action}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-sheet-footer">
              <button type="button" className="btn-portal-primary" onClick={() => setShowAuditLogModal(false)}>Selesai</button>
            </div>
          </div>
        </div>
      )}

      {/* ── 9. MODAL EXPERT: INFO LOGIN PEKERJA ── */}
      {showWorkerLoginModal && selectedWorker && (
        <div className="modal-backdrop-custom" onClick={() => setShowWorkerLoginModal(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-sheet-header">
              <div>
                <h5 className="modal-sheet-title">Kredensial Akses Aplikasi Pekerja</h5>
                <div className="modal-sheet-subtitle">{selectedWorker.name} ({selectedWorker.worker_code || selectedWorker.id})</div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setShowWorkerLoginModal(false)}>&times;</button>
            </div>
            
            <div className="modal-sheet-body">
              <div style={{ padding: '16px', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Username Aplikasi</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-sans)' }}>{selectedWorker.app_login?.username || 'penjahit.siti'}</div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.70rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>PIN Masuk Sementara</div>
                  <div style={{ fontSize: '1.30rem', fontWeight: 800, color: '#BE185D', letterSpacing: '4px' }}>{selectedWorker.app_login?.temp_pin || '884210'}</div>
                </div>

                <p style={{ fontSize: '0.72rem', color: '#6B7280', margin: 0 }}>
                  Bagikan informasi login ini kepada mitra penjahit untuk membuka tugas pengerjaan SPK dan melacak saldo upah di aplikasi pekerja.
                </p>
              </div>
            </div>

            <div className="modal-sheet-footer">
              <button type="button" className="btn-portal-primary" onClick={() => setShowWorkerLoginModal(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* ── 10. MODAL EXPERT: CATAT SENGKETA / DISPUTE ── */}
      {showDisputeModal && (
        <div className="modal-backdrop-custom" onClick={() => setShowDisputeModal(false)}>
          <div className="modal-sheet modal-sheet-wide" onClick={e => e.stopPropagation()}>
            <div className="modal-sheet-header">
              <div>
                <h5 className="modal-sheet-title">Pencatatan Sengketa &amp; Rekonsiliasi Upah</h5>
                <div className="modal-sheet-subtitle">Merekam Klarifikasi Perhitungan Pcs, Revisi Jahit, atau Penyesuaian Upah</div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setShowDisputeModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddDispute}>
              <div className="modal-sheet-body">
                
                <div className="modal-form-section">
                  <div className="modal-section-heading">1. Rincian Kasus Sengketa</div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Nama Mitra Penjahit</label>
                      <select 
                        className="form-control-select" 
                        value={disputeForm.workerName} 
                        onChange={e => setDisputeForm({ ...disputeForm, workerName: e.target.value })}
                      >
                        {workers.map(w => (
                          <option key={w.id} value={w.name}>{w.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">No. SPK Terkait</label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        placeholder="SPK-2026-001" 
                        value={disputeForm.spkNumber} 
                        onChange={e => setDisputeForm({ ...disputeForm, spkNumber: e.target.value })} 
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Kategori Masalah</label>
                      <select 
                        className="form-control-select" 
                        value={disputeForm.category} 
                        onChange={e => setDisputeForm({ ...disputeForm, category: e.target.value })}
                      >
                        <option value="Koreksi Jumlah Pcs">Koreksi Jumlah Pcs Selesai</option>
                        <option value="Kualitas Bahan Baku">Kualitas Bahan Baku Cacat</option>
                        <option value="Selisih Rate Upah">Selisih Rate Upah Senior</option>
                        <option value="Permintaan Revisi Lead Time">Permintaan Revisi Lead Time</option>
                      </select>
                    </div>

                    <div className="form-group-full">
                      <label className="form-label">Deskripsi Masalah</label>
                      <textarea 
                        rows={2} 
                        className="form-control-textarea" 
                        placeholder="Jelaskan kronologi komplain penjahit..." 
                        value={disputeForm.description} 
                        onChange={e => setDisputeForm({ ...disputeForm, description: e.target.value })} 
                      />
                    </div>

                    <div className="form-group-full">
                      <label className="form-label">Kesepakatan Solusi &amp; Kompensasi</label>
                      <input 
                        type="text" 
                        className="form-control-input" 
                        placeholder="Contoh: Disepakati kompensasi tambahan 2 pcs Rp 24.000 via transfer dompet digital." 
                        value={disputeForm.resolution} 
                        onChange={e => setDisputeForm({ ...disputeForm, resolution: e.target.value })} 
                      />
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-sheet-footer">
                <button type="button" className="btn-portal-secondary" onClick={() => setShowDisputeModal(false)}>Batal</button>
                <button type="submit" className="btn-portal-primary">Simpan Rekonsiliasi</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
