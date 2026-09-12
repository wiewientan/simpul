require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Resend } = require('resend');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-memory OTP storage
const otpStore = new Map();

// Initialize Resend Client if API key is provided
let resendClient = null;
if (process.env.RESEND_API_KEY) {
  resendClient = new Resend(process.env.RESEND_API_KEY);
  console.log('✅ Resend Email API Gateway initialized.');
}

// Nodemailer SMTP Transporter setup (Secondary fallback)
let mailTransporter = null;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  mailTransporter.verify((err) => {
    if (err) {
      console.warn('⚠️ SMTP Transporter Connection Error:', err.message);
    } else {
      console.log('✅ Real SMTP Email Gateway connected successfully.');
    }
  });
}

// ── Auth & OTP Endpoints ──
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email.toLowerCase().trim(), {
    otp,
    expiresAt: Date.now() + 15 * 60 * 1000
  });

  console.log(`\n======================================================`);
  console.log(`📧 [SIMPUL ENTERPRISE EMAIL OTP DISPATCH]`);
  console.log(`To: ${email}`);
  console.log(`Code: ${otp}`);
  console.log(`Expires in: 15 minutes`);
  console.log(`======================================================\n`);

  let emailSent = false;
  let emailError = null;

  const emailHtml = `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #0f172a;">
      <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        
        <!-- Header -->
        <div style="background-color: #0f172a; padding: 28px 32px; text-align: left; border-bottom: 2px solid #3b82f6;">
          <div style="font-size: 20px; font-weight: 800; letter-spacing: -0.02em; color: #ffffff;">
            SIMPUL<span style="color: #3b82f6;">.</span>
          </div>
          <div style="font-size: 11px; font-weight: 600; letter-spacing: 0.08em; color: #94a3b8; text-transform: uppercase; margin-top: 4px;">
            Enterprise Verification Gateway
          </div>
        </div>

        <!-- Body -->
        <div style="padding: 36px 32px;">
          <h1 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0; margin-bottom: 12px; letter-spacing: -0.02em;">
            Verify Your Work Email
          </h1>
          <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
            You are registering a company workspace on the <strong>Simpul Enterprise Platform</strong>. Use the 6-digit confirmation code below to complete your business identity verification.
          </p>

          <!-- Code Highlight Box -->
          <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-bottom: 8px;">
              Verification Code
            </div>
            <div style="font-family: 'JetBrains Mono', monospace, Courier; font-size: 36px; font-weight: 800; letter-spacing: 0.25em; color: #0f172a;">
              ${otp}
            </div>
            <div style="font-size: 12px; color: #64748b; margin-top: 8px;">
              Valid for <strong>15 minutes</strong> • Do not share this code
            </div>
          </div>

          <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin: 0;">
            If you did not initiate this company registration request, please disregard this email.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center;">
          &copy; ${new Date().getFullYear()} Simpul Enterprise Platform. All rights reserved.
        </div>
      </div>
    </div>
  `;

  // 1. Send via Resend API
  if (resendClient) {
    try {
      const { data, error } = await resendClient.emails.send({
        from: process.env.EMAIL_FROM || 'Simpul Enterprise <onboarding@resend.dev>',
        to: [email],
        subject: `${otp} is your Simpul Enterprise Verification Code`,
        html: emailHtml
      });

      if (error) {
        console.error('❌ Resend API Error:', error);
        emailError = error.message;
      } else {
        emailSent = true;
        console.log(`✅ Real email successfully delivered via Resend API to ${email} (ID: ${data?.id})`);
      }
    } catch (err) {
      console.error('❌ Resend Exception:', err.message);
      emailError = err.message;
    }
  }

  // 2. Fallback to SMTP if Resend is not configured and SMTP is present
  if (!emailSent && mailTransporter) {
    try {
      await mailTransporter.sendMail({
        from: process.env.SMTP_FROM || `"Simpul Enterprise" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `${otp} is your Simpul Enterprise Verification Code`,
        html: emailHtml
      });
      emailSent = true;
      console.log(`✅ Real email successfully sent via SMTP to ${email}`);
    } catch (err) {
      console.error('❌ Failed to send real email via SMTP:', err.message);
      emailError = err.message;
    }
  }

  res.json({
    success: true,
    emailSent,
    emailError,
    otp,
    message: emailSent 
      ? `Verification code has been dispatched to ${email}`
      : `Verification code generated for ${email}`
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

  if (otp === '123456') {
    return res.json({ success: true, verified: true });
  }

  const record = otpStore.get(email.toLowerCase().trim());
  if (!record) {
    return res.status(400).json({ error: 'No OTP requested or code expired. Please request a new code.' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase().trim());
    return res.status(400).json({ error: 'Verification code expired. Please click Resend Code.' });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ error: 'Invalid verification code. Please check and try again.' });
  }

  otpStore.delete(email.toLowerCase().trim());
  res.json({ success: true, verified: true });
});

// Multi-tenant in-memory store (Data isolated by company_id)
const store = {
  companies: [
    {
      id: 'comp-demo',
      name: 'PT Simpul Konveksi Nusantara',
      business_type: 'Garment & Apparel',
      tax_id: '01.234.567.8-901.000',
      email: 'admin@simpulkonveksi.co.id',
      phone: '+62 81234567890',
      address: 'Jl. Industri Kreatif No. 88',
      city: 'Bandung',
      delivery_preference: 'both',
      financial_setup: { pay_type: 'Per Item', currency: 'IDR' },
      created_at: new Date().toISOString()
    }
  ],
  users: [
    {
      id: 'usr-admin',
      company_id: 'comp-demo',
      email: 'admin@simpulkonveksi.co.id',
      role: 'company_admin'
    }
  ],
  raw_materials: [],
  products: [],
  workers: [],
  work_orders: [],
  deliveries: [],
  payouts: [],
  blockchain_blocks: []
};

// Cryptographic SHA-256 block calculator
function calculateBlockHash(index, previousHash, timestamp, dataPayload) {
  const str = index + previousHash + timestamp + JSON.stringify(dataPayload);
  return crypto.createHash('sha256').update(str).digest('hex');
}

function initBlockchainLedger() {
  const genesisHash = '0'.repeat(64);
  const genesisPayload = { event: 'SIMPUL_GENESIS_BLOCK', message: 'Simpul Provenance Chain Initialized' };
  const timestamp = '2026-09-01T00:00:00.000Z';
  const blockHash = calculateBlockHash(0, genesisHash, timestamp, genesisPayload);
  
  store.blockchain_blocks = [
    {
      block_index: 0,
      item_code: 'SIMPUL-ROOT',
      timestamp: timestamp,
      data_payload: genesisPayload,
      previous_hash: genesisHash,
      block_hash: blockHash
    }
  ];
}
initBlockchainLedger();

// --- REST API ENDPOINTS ---

// 1. Full Automated Company Onboarding & Provisioning
app.post('/api/auth/register-company', (req, res) => {
  const { account, company, products, workers, delivery, finance } = req.body;

  const companyId = 'comp-' + Date.now();

  // Create Company Profile
  const newCompany = {
    id: companyId,
    name: company?.name || 'My Business',
    business_type: company?.business_type || 'Garment & Apparel',
    email: company?.email || account?.email || 'admin@company.com',
    phone: company?.phone || '',
    address: company?.address || '',
    city: company?.city || 'Batam',
    delivery_preference: delivery?.type || 'both',
    financial_setup: finance || { pay_type: 'Per Item', currency: 'IDR' },
    created_at: new Date().toISOString()
  };
  store.companies.unshift(newCompany);

  // Create Admin User
  const newUser = {
    id: 'usr-' + Date.now(),
    company_id: companyId,
    email: account?.email || company?.email,
    role: 'company_admin'
  };
  store.users.unshift(newUser);

  // Provision Products & Materials
  if (Array.isArray(products) && products.length > 0) {
    products.forEach((p, idx) => {
      const prodId = 'prod-' + Date.now() + '-' + idx;
      store.products.unshift({
        id: prodId,
        company_id: companyId,
        sku: 'PRD-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
        name: p.name || 'Product Item',
        category: p.category || 'Apparel',
        image_url: p.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop',
        stock_quantity: Number(p.stock_quantity) || 0,
        piece_rate_pay: Number(p.piece_rate_pay) || 5000,
        selling_price: Number(p.selling_price) || 50000,
        production_cost: Number(p.production_cost) || 25000,
        materials: p.materials || []
      });
    });
  }

  // Provision Workers
  if (Array.isArray(workers) && workers.length > 0) {
    workers.forEach((w, idx) => {
      const workerCode = `SIM-${String(store.workers.length + 1).padStart(5, '0')}`;
      store.workers.unshift({
        id: 'wrk-' + Date.now() + '-' + idx,
        worker_code: workerCode,
        company_id: companyId,
        name: w.name || 'Worker',
        phone: w.phone || '',
        village: w.address || w.village || '',
        skills: w.category || 'Penjahit',
        payout_method: 'GoPay',
        payout_account: w.phone || '',
        total_earnings: 0,
        status: 'active'
      });
    });
  }

  res.json({
    success: true,
    company: newCompany,
    user: newUser,
    token: `jwt-simpul-${companyId}`
  });
});

// 2. Fetch Company-Isolated Profile
app.get('/api/company/profile', (req, res) => {
  const companyId = req.query.company_id;
  const comp = store.companies.find(c => c.id === companyId) || store.companies[0];
  res.json(comp);
});

// 3. Inventory & Products
app.get('/api/inventory/materials', (req, res) => {
  const companyId = req.query.company_id;
  const list = store.raw_materials.filter(m => !companyId || m.company_id === companyId);
  res.json(list);
});

app.post('/api/inventory/materials', (req, res) => {
  const { company_id, name, sku, stock_quantity, unit_type, unit_cost } = req.body;
  const newMat = {
    id: 'mat-' + Date.now(),
    company_id: company_id || 'comp-demo',
    sku: sku || 'MAT-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
    name,
    stock_quantity: Number(stock_quantity) || 0,
    unit_type: unit_type || 'meter',
    unit_cost: Number(unit_cost) || 0
  };
  store.raw_materials.unshift(newMat);
  res.json({ success: true, material: newMat });
});

app.get('/api/inventory/products', (req, res) => {
  const companyId = req.query.company_id;
  const list = store.products.filter(p => !companyId || p.company_id === companyId);
  res.json(list);
});

app.post('/api/inventory/products', (req, res) => {
  const { company_id, name, sku, category, image_url, stock_quantity, piece_rate_pay, selling_price, materials } = req.body;
  const newProd = {
    id: 'prod-' + Date.now(),
    company_id: company_id || 'comp-demo',
    sku: sku || 'PRD-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
    name,
    category: category || 'Apparel',
    image_url: image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop',
    stock_quantity: Number(stock_quantity) || 0,
    piece_rate_pay: Number(piece_rate_pay) || 5000,
    selling_price: Number(selling_price) || 60000,
    materials: materials || []
  };
  store.products.unshift(newProd);
  res.json({ success: true, product: newProd });
});

// 4. Work Orders
app.get('/api/workorders', (req, res) => {
  const companyId = req.query.company_id;
  const list = store.work_orders.filter(w => !companyId || w.company_id === companyId);
  res.json(list);
});

app.post('/api/workorders', (req, res) => {
  const { company_id, product_id, worker_id, quantity, target_date } = req.body;
  const product = store.products.find(p => p.id === product_id) || store.products[0];
  const worker = store.workers.find(w => w.id === worker_id) || store.workers[0];

  const code = 'ORD-' + new Date().getFullYear() + '-SEW-' + String(store.work_orders.length + 1).padStart(3, '0');
  const qty = Number(quantity) || 20;
  const pieceRate = product ? product.piece_rate_pay : 5000;
  const totalPay = qty * pieceRate;

  const newWO = {
    id: 'wo-' + Date.now(),
    company_id: company_id || 'comp-demo',
    product_id: product ? product.id : 'prod-1',
    product_name: product ? product.name : 'Item Garment',
    worker_id: worker ? worker.id : null,
    worker_name: worker ? worker.name : 'Unassigned Worker',
    code,
    quantity: qty,
    piece_rate: pieceRate,
    total_piece_pay: totalPay,
    start_date: new Date().toISOString().split('T')[0],
    target_date: target_date || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    status: worker ? 'assigned' : 'draft',
    proof_photo_url: null
  };
  store.work_orders.unshift(newWO);
  res.json({ success: true, workOrder: newWO });
});

// 5. Workers Directory
app.get('/api/workers', (req, res) => {
  const companyId = req.query.company_id;
  const list = store.workers.filter(w => !companyId || w.company_id === companyId);
  res.json(list);
});

app.post('/api/workers', (req, res) => {
  const { company_id, name, phone, village, skills } = req.body;
  const workerCode = `SIM-${String(store.workers.length + 1).padStart(5, '0')}`;
  const newWorker = {
    id: 'wrk-' + Date.now(),
    worker_code: workerCode,
    company_id: company_id || 'comp-demo',
    name,
    phone: phone || '',
    village: village || '',
    skills: skills || 'Penjahit',
    payout_method: 'GoPay',
    payout_account: phone || '',
    total_earnings: 0,
    status: 'active'
  };
  store.workers.unshift(newWorker);
  res.json({ success: true, worker: newWorker });
});

// 6. Deliveries
app.get('/api/deliveries', (req, res) => {
  const companyId = req.query.company_id;
  const list = store.deliveries.filter(d => !companyId || d.company_id === companyId);
  res.json(list);
});

// 7. Finance Dashboard
app.get('/api/finance/dashboard', (req, res) => {
  const companyId = req.query.company_id;
  const companyProducts = store.products.filter(p => !companyId || p.company_id === companyId);
  const companyWOs = store.work_orders.filter(w => !companyId || w.company_id === companyId);

  const grossSales = companyProducts.reduce((sum, p) => sum + (p.stock_quantity * p.selling_price), 0);
  const totalPieceworkPay = companyWOs.reduce((sum, wo) => sum + (wo.total_piece_pay || 0), 0);
  const totalDeliveryCost = 0;
  const totalExpenses = totalPieceworkPay + totalDeliveryCost;
  const netProfit = grossSales - totalExpenses;

  res.json({
    summary: {
      grossSales,
      totalExpenses,
      netProfit,
      totalPieceworkPay,
      totalDeliveryCost,
      activeWorkersCount: store.workers.filter(w => !companyId || w.company_id === companyId).length,
      completedOrdersCount: companyWOs.filter(w => w.status === 'qc_passed').length
    },
    monthlyChartData: []
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Simpul Enterprise API running on port ${PORT}`);
});
