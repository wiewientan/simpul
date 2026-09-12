import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CompanyRegistrationPage.css';

const LocationPinIcon = ({ className = "sugg-vector-icon" }) => (
  <svg 
    className={className} 
    width="15" 
    height="15" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 21C16 16.5 19 12.8 19 9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9C5 12.8 8 16.5 12 21Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <circle 
      cx="12" 
      cy="9" 
      r="3" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

const GlobeIcon = ({ className = "sugg-vector-icon" }) => (
  <svg 
    className={className} 
    width="15" 
    height="15" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MailEnvelopeIcon = ({ className = "otp-vector-icon" }) => (
  <svg 
    className={className} 
    width="28" 
    height="28" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M22 6L12 13L2 6" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export default function CompanyRegistrationPage({ onBackToLanding, onCompleteRegistration }) {
  const [step, setStep] = useState(1); // 1, 2, 3, 'otp', 'provisioning'
  
  // Step 1: Tell us about your business
  const [businessData, setBusinessData] = useState({
    companyName: '',
    businessSector: '',
    businessDescription: '',
    yearEstablished: '2023',
    businessSize: 'Small Enterprise (5 – 19 Artisans / Workshop)',
    picName: '',
    picRole: '',
    workEmail: '',
    phone: '',
    city: 'Batam',
    address: '',
    latitude: 1.1301,
    longitude: 104.0529,
    formattedLocation: 'Batam, Riau Islands, Indonesia'
  });

  // Real-time Map & Geocoding State
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const STANDARD_SECTORS = [
    'Garment & Apparel Manufacturing',
    'Fashion Label & Ready-to-Wear (RTW)',
    'Haute Couture & Bespoke Tailoring',
    'Footwear, Leather Goods & Accessories',
    'Traditional Batik, Tenun & Textile Crafts',
    'Uniform & Corporate Workwear CMT',
    'Textile & Fabric Manufacturing',
    'Telecommunications',
    'Information Technology & Software Services',
    'Logistics, Supply Chain & Freight',
    'Food & Beverage Processing (F&B)',
    'Cosmetics, Skincare & Personal Care',
    'Furniture, Home Living & Interior Craft',
    'Jewelry, Gems & Precious Metals',
    'Sustainable & Eco-Fabric Studio',
    'Knitwear & Athleisure Apparel'
  ];

  // Levenshtein distance algorithm for fuzzy typo correction
  const levenshteinDistance = (a, b) => {
    const an = a ? a.length : 0;
    const bn = b ? b.length : 0;
    if (an === 0) return bn;
    if (bn === 0) return an;
    const matrix = Array.from({ length: bn + 1 }, () => new Array(an + 1).fill(0));
    for (let i = 0; i <= an; i++) matrix[0][i] = i;
    for (let j = 0; j <= bn; j++) matrix[j][0] = j;
    for (let j = 1; j <= bn; j++) {
      for (let i = 1; i <= an; i++) {
        if (b.charAt(j - 1).toLowerCase() === a.charAt(i - 1).toLowerCase()) {
          matrix[j][i] = matrix[j - 1][i - 1];
        } else {
          matrix[j][i] = Math.min(
            matrix[j - 1][i - 1] + 1,
            matrix[j][i - 1] + 1,
            matrix[j - 1][i] + 1
          );
        }
      }
    }
    return matrix[bn][an];
  };

  const formatSectorName = (text) => {
    if (!text) return '';
    const acronyms = ['RTW', 'CMT', 'HQ', 'QC', 'OEM', 'ODM', 'PT', 'CV', 'UKM', 'UMKM', 'B2B', 'D2C', 'IT', 'AI', 'F&B'];
    return text
      .split(/(\s+|[/-])/)
      .map(token => {
        const trimmed = token.trim();
        if (!trimmed) return token;
        const upper = trimmed.toUpperCase();
        if (acronyms.includes(upper)) return upper;
        if (trimmed.toLowerCase() === '&' || trimmed.toLowerCase() === 'and') return trimmed.toLowerCase() === '&' ? '&' : 'and';
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
      })
      .join('');
  };

  // AI-Powered Sector Refiner & Typo Corrector
  const aiRefineSector = (input) => {
    if (!input || input.trim().length < 2) return input;
    const cleanInput = input.trim().toLowerCase();

    // 1. Direct keywords map for industry synonyms & common typos
    const keywordMap = [
      { keys: ['telecom', 'telekom', 'telecomunicat', 'telecomuniccaton', 'telecomunicaton', 'telco', 'telecommunication', 'komunikasi'], target: 'Telecommunications' },
      { keys: ['garmet', 'garment', 'apparel', 'baju', 'cloth', 'clothing', 'pakaian', 'jahit', 'sewing', 'konveksi'], target: 'Garment & Apparel Manufacturing' },
      { keys: ['fashun', 'fashion', 'rtw', 'ready to wear', 'brand busana', 'label'], target: 'Fashion Label & Ready-to-Wear (RTW)' },
      { keys: ['haute', 'couture', 'coutur', 'cotture', 'bespoke', 'tailor', 'tailoring', 'kebaya', 'jas'], target: 'Haute Couture & Bespoke Tailoring' },
      { keys: ['batik', 'tenun', 'songket', 'tradisional', 'weaving', 'craft', 'kerajinan'], target: 'Traditional Batik, Tenun & Textile Crafts' },
      { keys: ['lether', 'leather', 'kulit', 'sepatu', 'shoe', 'footwear', 'tas', 'bag'], target: 'Footwear, Leather Goods & Accessories' },
      { keys: ['cmt', 'uniform', 'seragam', 'workwear', 'industrial', 'pabrik garmen'], target: 'Uniform & Corporate Workwear CMT' },
      { keys: ['textil', 'textile', 'fabric', 'kain', 'yarn', 'benang', 'spinning'], target: 'Textile & Fabric Manufacturing' },
      { keys: ['it', 'software', 'tech', 'technology', 'teknologi', 'digital', 'saas', 'app', 'komputer'], target: 'Information Technology & Software Services' },
      { keys: ['logistic', 'logistik', 'freight', 'cargo', 'shipping', 'ekspedisi', 'kurir', 'courier'], target: 'Logistics, Supply Chain & Freight' },
      { keys: ['f&b', 'food', 'beverage', 'kuliner', 'makanan', 'minuman', 'catering', 'resto'], target: 'Food & Beverage Processing (F&B)' },
      { keys: ['cosmetic', 'kosmetik', 'skincare', 'beauty', 'kecantikan', 'perawatan'], target: 'Cosmetics, Skincare & Personal Care' },
      { keys: ['furniture', 'mebel', 'interior', 'dekorasi', 'kayu', 'wood', 'home living'], target: 'Furniture, Home Living & Interior Craft' },
      { keys: ['jewel', 'jewelry', 'perhiasan', 'emas', 'silver', 'gemstone', 'aksesoris'], target: 'Jewelry, Gems & Precious Metals' }
    ];

    for (const item of keywordMap) {
      if (item.keys.some(k => cleanInput.includes(k))) {
        return item.target;
      }
    }

    // 2. Fuzzy Levenshtein match across standard sectors
    let bestMatch = null;
    let minScore = Infinity;

    for (const vocab of STANDARD_SECTORS) {
      const vocabClean = vocab.toLowerCase();
      const dist = levenshteinDistance(cleanInput, vocabClean);
      const relativeScore = dist / Math.max(cleanInput.length, vocabClean.length);
      if (relativeScore < minScore) {
        minScore = relativeScore;
        bestMatch = vocab;
      }
    }

    if (minScore <= 0.55 && bestMatch) {
      return bestMatch;
    }

    return formatSectorName(input);
  };

  const handleSectorInputChange = (val) => {
    handleBusinessChange('businessSector', val);
  };

  const handleSectorBlur = () => {
    const raw = businessData.businessSector;
    if (raw && raw.trim().length >= 2) {
      const refined = aiRefineSector(raw);
      if (refined && refined !== raw) {
        handleBusinessChange('businessSector', refined);
      }
    }
    handleBlur('businessSector');
  };

  // City / Operations Hub Autocomplete State
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [onlineCityResults, setOnlineCityResults] = useState([]);
  const [isSearchingCity, setIsSearchingCity] = useState(false);

  const NATIONWIDE_HUBS = [
    { name: 'Batam', region: 'Kepulauan Riau', lat: 1.1301, lon: 104.0529 },
    { name: 'Bandung', region: 'Jawa Barat', lat: -6.9175, lon: 107.6191 },
    { name: 'Jakarta', region: 'DKI Jakarta', lat: -6.2088, lon: 106.8456 },
    { name: 'Surabaya', region: 'Jawa Timur', lat: -7.2575, lon: 112.7521 },
    { name: 'Solo / Surakarta', region: 'Jawa Tengah', lat: -7.5755, lon: 110.8243 },
    { name: 'Yogyakarta', region: 'DI Yogyakarta', lat: -7.7956, lon: 110.3695 },
    { name: 'Semarang', region: 'Jawa Tengah', lat: -6.9667, lon: 110.4167 },
    { name: 'Denpasar', region: 'Bali', lat: -8.6705, lon: 115.2126 },
    { name: 'Medan', region: 'Sumatera Utara', lat: 3.5952, lon: 98.6722 },
    { name: 'Makassar', region: 'Sulawesi Selatan', lat: -5.1477, lon: 119.4327 },
    { name: 'Palembang', region: 'Sumatera Selatan', lat: -2.9761, lon: 104.7754 },
    { name: 'Tangerang', region: 'Banten', lat: -6.1783, lon: 106.6319 },
    { name: 'Bekasi', region: 'Jawa Barat', lat: -6.2383, lon: 106.9756 },
    { name: 'Bogor', region: 'Jawa Barat', lat: -6.5971, lon: 106.8060 },
    { name: 'Depok', region: 'Jawa Barat', lat: -6.4025, lon: 106.7942 },
    { name: 'Malang', region: 'Jawa Timur', lat: -7.9666, lon: 112.6326 },
    { name: 'Pekanbaru', region: 'Riau', lat: 0.5071, lon: 101.4478 },
    { name: 'Balikpapan', region: 'Kalimantan Timur', lat: -1.2379, lon: 116.8529 },
    { name: 'Samarinda', region: 'Kalimantan Timur', lat: -0.5021, lon: 117.1537 },
    { name: 'Banjarmasin', region: 'Kalimantan Selatan', lat: -3.3194, lon: 114.5908 },
    { name: 'Pontianak', region: 'Kalimantan Barat', lat: -0.0263, lon: 109.3425 },
    { name: 'Padang', region: 'Sumatera Barat', lat: -0.9471, lon: 100.4172 },
    { name: 'Bandar Lampung', region: 'Lampung', lat: -5.4500, lon: 105.2667 },
    { name: 'Manado', region: 'Sulawesi Utara', lat: 1.4748, lon: 124.8428 },
    { name: 'Cirebon', region: 'Jawa Barat', lat: -6.7320, lon: 108.5523 },
    { name: 'Pekalongan', region: 'Jawa Tengah', lat: -6.8886, lon: 109.6753 },
    { name: 'Tasikmalaya', region: 'Jawa Barat', lat: -7.3274, lon: 108.2207 },
    { name: 'Kudus', region: 'Jawa Tengah', lat: -6.8048, lon: 110.8405 },
    { name: 'Jember', region: 'Jawa Timur', lat: -8.1845, lon: 113.6681 },
    { name: 'Banyuwangi', region: 'Jawa Timur', lat: -8.2192, lon: 114.3692 },
    { name: 'Mataram', region: 'Nusa Tenggara Barat', lat: -8.5768, lon: 116.0999 },
    { name: 'Kupang', region: 'Nusa Tenggara Timur', lat: -10.1772, lon: 123.6070 },
    { name: 'Jayapura', region: 'Papua', lat: -2.5337, lon: 140.7181 }
  ];

  const searchOnlineCity = async (queryText) => {
    if (!queryText || queryText.length < 3) {
      setOnlineCityResults([]);
      return;
    }
    setIsSearchingCity(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryText)}&addressdetails=1&limit=4`);
      if (res.ok) {
        const data = await res.json();
        setOnlineCityResults(data || []);
      }
    } catch (e) {
      console.warn('City geocoding search failed:', e);
    } finally {
      setIsSearchingCity(false);
    }
  };

  const handleCityInputChange = (val) => {
    handleBusinessChange('city', val);
    setShowCitySuggestions(true);
    searchOnlineCity(val);
  };

  const handleSelectCityHub = (hub) => {
    setBusinessData(prev => ({
      ...prev,
      city: hub.name,
      latitude: hub.lat,
      longitude: hub.lon,
      formattedLocation: `${hub.name}, ${hub.region}`
    }));
    setShowCitySuggestions(false);
    setOnlineCityResults([]);
    setTouched(prev => ({ ...prev, city: true }));
    setErrors(prev => ({ ...prev, city: '' }));
  };

  const handleSelectOnlineCity = (item) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    const displayName = item.display_name;
    const shortName = item.name || displayName.split(',')[0];

    setBusinessData(prev => ({
      ...prev,
      city: shortName,
      latitude: lat,
      longitude: lon,
      formattedLocation: displayName
    }));
    setShowCitySuggestions(false);
    setOnlineCityResults([]);
    setTouched(prev => ({ ...prev, city: true }));
    setErrors(prev => ({ ...prev, city: '' }));
  };

  // Real-time Nominatim / Google-aligned Address Search
  const searchAddressOnline = async (queryText) => {
    if (!queryText || queryText.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    setIsSearchingAddress(true);
    try {
      const cityFilter = businessData.city || '';
      const fullQuery = cityFilter ? `${queryText}, ${cityFilter}, Indonesia` : `${queryText}, Indonesia`;
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullQuery)}&addressdetails=1&limit=5&countrycodes=id`);
      if (res.ok) {
        const data = await res.json();
        setAddressSuggestions(data || []);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.warn('Real-time geocoding query failed:', err);
    } finally {
      setIsSearchingAddress(false);
    }
  };

  const handleAddressInputChange = (val) => {
    handleBusinessChange('address', val);
    searchAddressOnline(val);
  };

  const handleSelectSuggestion = (item) => {
    const fullAddress = item.display_name || '';
    const lat = parseFloat(item.lat) || 1.1301;
    const lon = parseFloat(item.lon) || 104.0529;
    
    // Auto-detect / update city if found in OpenStreetMap address object
    let detectedCity = businessData.city;
    if (item.address) {
      const addrCity = item.address.city || item.address.town || item.address.city_district || item.address.municipality || item.address.county || item.address.state || '';
      if (addrCity) {
        const matchedHub = NATIONWIDE_HUBS.find(h => 
          addrCity.toLowerCase().includes(h.name.toLowerCase()) || 
          h.name.toLowerCase().includes(addrCity.toLowerCase())
        );
        if (matchedHub) {
          detectedCity = matchedHub.name;
        } else if (!businessData.city || businessData.city === 'Batam') {
          detectedCity = addrCity.split(',')[0].trim();
        }
      }
    }

    setBusinessData(prev => ({
      ...prev,
      address: fullAddress || item.name || '',
      city: detectedCity,
      latitude: lat,
      longitude: lon,
      formattedLocation: fullAddress
    }));
    setShowSuggestions(false);
    setAddressSuggestions([]);
    setTouched(prev => ({ ...prev, address: true }));
    setErrors(prev => ({ ...prev, address: '' }));
  };

  // Step 2: Understand how you operate
  const [operationsData, setOperationsData] = useState({
    productionModel: 'Make-to-Order',
    workersStructure: 'Distributed Artisan Network',
    productionLocations: 'Multiple Decentralized Clusters',
    suppliersStructure: 'Local Wholesale Fabric Distributors',
    externalWorkers: 'Freelance Seamstresses & Crafters',
    courierModel: 'Simpul Courier Network',
    orderVolume: '500 – 2,500 pcs/month'
  });

  // Step 3: Configure your Simpul workspace
  const [configData, setConfigData] = useState({
    inventoryPref: 'Raw Fabric Yardage & Finished Goods Tracking',
    paymentPref: 'Automated Bank Transfer & Worker Wallets',
    workOrderSettings: 'Stage-by-Stage Quality Checkpoints & Auto Piece-rate',
    notificationPref: 'WhatsApp Production Updates & In-app Alerts',
    userRoles: 'Admin + Production Manager + Finance',
    financialSettings: 'Automated Real-Time Unit Cost (HPP) Calculation'
  });

  // OTP Verification state
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpNotification, setOtpNotification] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpError, setOtpError] = useState('');
  const [provisionProgress, setProvisionProgress] = useState(0);
  const otpInputRefs = useRef([]);

  // Validation & Touched States
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (field, value, currentData = businessData) => {
    let err = '';
    const val = value !== undefined ? value : currentData[field] || '';

    switch (field) {
      case 'companyName':
        if (!val || val.trim().length < 3) {
          err = 'Company / Brand name is required (min. 3 characters).';
        }
        break;
      case 'businessSector':
        if (!val || val.trim().length < 2) {
          err = 'Business sector is required (min. 2 characters).';
        }
        break;
      case 'picName':
        if (!val || val.trim().length < 2) {
          err = 'Administrator / contact name is required (min. 2 characters).';
        } else if (!/^[a-zA-Z\s.,'-]+$/.test(val)) {
          err = 'Name must contain letters only.';
        }
        break;
      case 'picRole':
        if (!val || val.trim().length < 2) {
          err = 'Job title / position is required (min. 2 characters).';
        }
        break;
      case 'workEmail':
        if (!val) {
          err = 'Official work email is required.';
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)) {
          err = 'Please enter a valid email address (e.g. name@company.com).';
        }
        break;
      case 'phone': {
        const digits = val.replace(/\D/g, '');
        if (!val) {
          err = 'Phone / WhatsApp number is required.';
        } else if (digits.length < 9 || digits.length > 15) {
          err = 'Please enter a valid phone number (9–15 digits).';
        }
        break;
      }
      case 'yearEstablished': {
        if (val && (!/^\d{4}$/.test(val) || parseInt(val, 10) < 1900 || parseInt(val, 10) > 2026)) {
          err = 'Year established must be a valid 4-digit year (1900 – 2026).';
        }
        break;
      }
      case 'address':
        if (val && val.trim().length > 0 && val.trim().length < 5) {
          err = 'Address must be at least 5 characters.';
        }
        break;
      default:
        break;
    }
    return err;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const err = validateField(field, businessData[field]);
    setErrors(prev => ({ ...prev, [field]: err }));
  };

  const handlePhoneInputChange = (e) => {
    // Only allow numbers, +, spaces, dashes
    const clean = e.target.value.replace(/[^0-9+\s-]/g, '');
    handleBusinessChange('phone', clean);
    if (touched.phone) {
      const err = validateField('phone', clean);
      setErrors(prev => ({ ...prev, phone: err }));
    }
  };

  const handleYearInputChange = (e) => {
    // Only allow 4 digits
    const clean = e.target.value.replace(/\D/g, '').slice(0, 4);
    handleBusinessChange('yearEstablished', clean);
    if (touched.yearEstablished) {
      const err = validateField('yearEstablished', clean);
      setErrors(prev => ({ ...prev, yearEstablished: err }));
    }
  };

  const handlePicNameInputChange = (e) => {
    // Only allow letters, spaces, dots, commas, dashes
    const clean = e.target.value.replace(/[^a-zA-Z\s.,'-]/g, '');
    handleBusinessChange('picName', clean);
    if (touched.picName) {
      const err = validateField('picName', clean);
      setErrors(prev => ({ ...prev, picName: err }));
    }
  };

  const handleBusinessChange = (field, value) => {
    setBusinessData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const err = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: err }));
    }
  };

  const handleOperationsChange = (field, value) => {
    setOperationsData(prev => ({ ...prev, [field]: value }));
  };

  const handleConfigChange = (field, value) => {
    setConfigData(prev => ({ ...prev, [field]: value }));
  };

  const validateAllStep1 = () => {
    const fieldsToValidate = ['companyName', 'businessSector', 'picName', 'picRole', 'workEmail', 'phone', 'yearEstablished', 'address'];
    const newErrors = {};
    const newTouched = {};
    let hasError = false;

    fieldsToValidate.forEach(field => {
      newTouched[field] = true;
      const err = validateField(field, businessData[field]);
      if (err) {
        newErrors[field] = err;
        hasError = true;
      }
    });

    setTouched(prev => ({ ...prev, ...newTouched }));
    setErrors(newErrors);
    return !hasError;
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    const isValid = validateAllStep1();
    if (!isValid) {
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }
    const success = sendEmailOtp(businessData.workEmail);
    if (success) {
      setStep('otp');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate and send OTP to workEmail with validation
  const sendEmailOtp = async (targetEmail) => {
    const emailToUse = targetEmail || businessData.workEmail;
    if (!emailToUse || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToUse.trim())) {
      setErrors(prev => ({ ...prev, workEmail: 'Please enter a valid official work email address.' }));
      setTouched(prev => ({ ...prev, workEmail: true }));
      setStep(1);
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return false;
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newCode);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError('');
    setResendCooldown(60);

    setOtpNotification({
      code: newCode,
      email: emailToUse,
      visible: true
    });

    try {
      const resp = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToUse })
      });
      const data = await resp.json();
      if (data && data.otp) {
        setGeneratedOtp(data.otp);
      }
    } catch (err) {
      console.warn('Backend send-otp offline or mock mode:', err);
    }

    setTimeout(() => {
      if (otpInputRefs.current[0]) {
        otpInputRefs.current[0].focus();
      }
    }, 200);

    return true;
  };

  // Resend OTP countdown effect
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleOtpBoxChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '');
    
    // Multi-character paste via input change
    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split('');
      const newDigits = [...otpDigits];
      chars.forEach((c, i) => {
        if (i < 6) newDigits[i] = c;
      });
      setOtpDigits(newDigits);
      setOtpError('');
      
      const focusIndex = Math.min(chars.length, 5);
      if (otpInputRefs.current[focusIndex]) {
        otpInputRefs.current[focusIndex].focus();
      }
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleaned;
    setOtpDigits(newDigits);
    setOtpError('');

    // Auto advance to next box
    if (cleaned && index < 5) {
      if (otpInputRefs.current[index + 1]) {
        otpInputRefs.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
        if (otpInputRefs.current[index - 1]) {
          otpInputRefs.current[index - 1].focus();
        }
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const chars = pasted.split('');
    const newDigits = ['', '', '', '', '', ''];
    chars.forEach((c, i) => {
      newDigits[i] = c;
    });
    setOtpDigits(newDigits);
    setOtpError('');
    const nextFocus = Math.min(chars.length, 5);
    otpInputRefs.current[nextFocus]?.focus();
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const enteredCode = otpDigits.join('');
    if (enteredCode.length < 6) {
      setOtpError('Please enter all 6 digits of your verification code.');
      return;
    }

    let isVerified = false;

    // Check against generated client OTP, master bypass, or any 6 digits for testing
    if (enteredCode.length === 6) {
      isVerified = true;
    } else if (enteredCode === '123456' || (generatedOtp && enteredCode === generatedOtp)) {
      isVerified = true;
    } else {
      // Check backend API verification
      try {
        const resp = await fetch('http://localhost:5000/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: businessData.workEmail, otp: enteredCode })
        });
        const data = await resp.json();
        if (data && data.verified) {
          isVerified = true;
        }
      } catch (err) {
        console.warn('Backend verify check error:', err);
      }
    }

    if (!isVerified) {
      setOtpError('Invalid verification code. Please check your email or click Resend Code.');
      return;
    }

    setOtpError('');
    setStep('provisioning');
    setProvisionProgress(0);

    const interval = setInterval(() => {
      setProvisionProgress(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          setTimeout(() => {
            onCompleteRegistration({
              id: `comp-${Date.now()}`,
              name: businessData.companyName || 'PT Simpul Fashion',
              businessSector: businessData.businessSector,
              city: businessData.city,
              workEmail: businessData.workEmail,
              phone: businessData.phone,
              picName: businessData.picName,
              picRole: businessData.picRole,
              operations: operationsData,
              config: configData
            });
          }, 600);
          return 4;
        }
        return prev + 1;
      });
    }, 550);
  };

  return (
    <div className="company-reg-wrapper">
      
      {/* ── Fixed Cyan Accent Bar (Left Edge) ── */}
      <div className="minimal-left-accent-line" aria-hidden="true" />

      {/* ── Ambient Glow Background ── */}
      <div className="reg-ambient-canvas" aria-hidden="true">
        <div className="reg-orb orb-top-right" />
        <div className="reg-orb orb-bottom-left" />
      </div>

      {/* ── Top Minimal Header ── */}
      <header className="reg-top-header">
        <span className="reg-logo" onClick={onBackToLanding}>SIMPUL</span>
        <button className="btn-back-landing" onClick={onBackToLanding}>
          &larr; Back to Overview
        </button>
      </header>

      {/* ── Main Form Container ── */}
      <main className="reg-main-container">
        
        {step !== 'provisioning' ? (
          <motion.div 
            className="reg-glass-card"
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            
            {/* Step Indicator Header */}
            <div className="reg-card-header">
              <span className="reg-kicker">
                {step === 1 && 'STEP 01 OF 02 • BUSINESS IDENTITY'}
                {step === 'otp' && 'STEP 02 OF 02 • EMAIL VERIFICATION'}
              </span>
              
              <h1 className="reg-title">
                {step === 1 && 'Tell us about your business'}
                {step === 'otp' && 'Verify your work email'}
              </h1>
              
              <p className="reg-subtitle">
                {step === 1 && 'Lay the foundation of your company identity. Operational model and ledger configurations can be completed anytime in Settings.'}
                {step === 'otp' && `Enter the 6-digit confirmation code sent to ${businessData.workEmail || 'your email'}.`}
              </p>
            </div>

            {/* Step 1: Tell us about your business */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.form 
                  key="step-1"
                  onSubmit={handleStep1Submit} 
                  className="reg-form-body"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="form-grid-2col">
                    <div className="input-field-group">
                      <label className="input-label">Company / Brand Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Enter your company or brand name" 
                        className={`luxury-text-input ${touched.companyName && errors.companyName ? 'input-has-error' : ''}`}
                        value={businessData.companyName}
                        onChange={e => handleBusinessChange('companyName', e.target.value)}
                        onBlur={() => handleBlur('companyName')}
                      />
                      {touched.companyName && errors.companyName && (
                        <span className="field-error-msg">{errors.companyName}</span>
                      )}
                    </div>

                    <div className="input-field-group">
                      <label className="input-label">Business Sector</label>
                      <select 
                        className={`luxury-text-input ${touched.businessSector && errors.businessSector ? 'input-has-error' : ''}`}
                        value={STANDARD_SECTORS.includes(businessData.businessSector) ? businessData.businessSector : (businessData.businessSector ? 'Others' : 'Garment & Apparel Manufacturing')}
                        onChange={e => {
                          const val = e.target.value;
                          if (val === 'Others') {
                            handleBusinessChange('businessSector', 'Lainnya');
                          } else {
                            handleBusinessChange('businessSector', val);
                          }
                        }}
                      >
                        <option value="Garment & Apparel Manufacturing">Garment &amp; Apparel Manufacturing</option>
                        <option value="Fashion Label & Ready-to-Wear (RTW)">Fashion Label &amp; Ready-to-Wear (RTW)</option>
                        <option value="Uniform & Corporate Workwear CMT">Uniform &amp; Corporate Workwear CMT</option>
                        <option value="Haute Couture & Bespoke Tailoring">Haute Couture &amp; Bespoke Tailoring</option>
                        <option value="Traditional Batik, Tenun & Textile Crafts">Traditional Batik, Tenun &amp; Textile Crafts</option>
                        <option value="Footwear, Leather Goods & Accessories">Footwear, Leather Goods &amp; Accessories</option>
                        <option value="Sablon & Bordir Apparel">Sablon, Bordir &amp; Confection</option>
                        <option value="Telecommunications">Telecommunications</option>
                        <option value="Information Technology & Software Services">Information Technology &amp; Software Services</option>
                        <option value="Food & Beverage Processing (F&B)">Food &amp; Beverage Processing (F&B)</option>
                        <option value="Others">Others / Sektor Lainnya...</option>
                      </select>

                      {(!STANDARD_SECTORS.includes(businessData.businessSector) || businessData.businessSector === 'Lainnya') && (
                        <div style={{ marginTop: '8px' }}>
                          <input 
                            type="text" 
                            required
                            placeholder="Tuliskan nama sektor usaha Anda (Contoh: Kuliner Cimol Teteh, Tas Kulit)..." 
                            className={`luxury-text-input ${touched.businessSector && errors.businessSector ? 'input-has-error' : ''}`}
                            value={businessData.businessSector === 'Lainnya' ? '' : businessData.businessSector}
                            onChange={e => handleBusinessChange('businessSector', e.target.value)}
                            onBlur={() => handleBlur('businessSector')}
                            autoFocus
                          />
                        </div>
                      )}

                      {touched.businessSector && errors.businessSector && (
                        <span className="field-error-msg">{errors.businessSector}</span>
                      )}
                    </div>
                  </div>

                  <div className="input-field-group">
                    <div className="label-with-counter">
                      <label className="input-label">Business Description</label>
                      <span className="char-counter">{businessData.businessDescription.length}/300</span>
                    </div>
                    <textarea 
                      rows={3}
                      maxLength={300}
                      placeholder="Brief summary of your production focus, specialized craft, or signature collection..." 
                      className="luxury-text-input luxury-textarea"
                      value={businessData.businessDescription}
                      onChange={e => handleBusinessChange('businessDescription', e.target.value)}
                    />
                  </div>

                  <div className="form-grid-2col">
                    <div className="input-field-group">
                      <label className="input-label">Year Established</label>
                      <input 
                        type="text"
                        maxLength={4}
                        placeholder="e.g. 2022" 
                        className={`luxury-text-input ${touched.yearEstablished && errors.yearEstablished ? 'input-has-error' : ''}`}
                        value={businessData.yearEstablished}
                        onChange={handleYearInputChange}
                        onBlur={() => handleBlur('yearEstablished')}
                      />
                      {touched.yearEstablished && errors.yearEstablished && (
                        <span className="field-error-msg">{errors.yearEstablished}</span>
                      )}
                    </div>

                    <div className="input-field-group">
                      <label className="input-label">Business Scale</label>
                      <select 
                        className="luxury-text-input"
                        value={businessData.businessSize}
                        onChange={e => handleBusinessChange('businessSize', e.target.value)}
                      >
                        <option value="Micro Enterprise (1 – 4 Artisans / Studio)">Micro Enterprise (1 – 4 Artisans / Studio)</option>
                        <option value="Small Enterprise (5 – 19 Artisans / Workshop)">Small Enterprise (5 – 19 Artisans / Workshop)</option>
                        <option value="Medium Enterprise (20 – 99 Workforce / Multi-Line)">Medium Enterprise (20 – 99 Workforce / Multi-Line)</option>
                        <option value="Large Enterprise (100+ Workforce / Factory)">Large Enterprise (100+ Workforce / Factory)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid-2col">
                    <div className="input-field-group">
                      <label className="input-label">Account Administrator</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Full name of representative / admin" 
                        className={`luxury-text-input ${touched.picName && errors.picName ? 'input-has-error' : ''}`}
                        value={businessData.picName}
                        onChange={handlePicNameInputChange}
                        onBlur={() => handleBlur('picName')}
                      />
                      {touched.picName && errors.picName && (
                        <span className="field-error-msg">{errors.picName}</span>
                      )}
                    </div>

                    <div className="input-field-group">
                      <label className="input-label">Job Title / Position</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Founder, Production Manager, Director" 
                        className={`luxury-text-input ${touched.picRole && errors.picRole ? 'input-has-error' : ''}`}
                        value={businessData.picRole}
                        onChange={e => handleBusinessChange('picRole', e.target.value)}
                        onBlur={() => handleBlur('picRole')}
                      />
                      {touched.picRole && errors.picRole && (
                        <span className="field-error-msg">{errors.picRole}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-grid-2col">
                    <div className="input-field-group">
                      <label className="input-label">Work Email</label>
                      <input 
                        type="email" 
                        required
                        placeholder="official.email@company.com" 
                        className={`luxury-text-input ${touched.workEmail && errors.workEmail ? 'input-has-error' : ''}`}
                        value={businessData.workEmail}
                        onChange={e => handleBusinessChange('workEmail', e.target.value)}
                        onBlur={() => handleBlur('workEmail')}
                      />
                      {touched.workEmail && errors.workEmail && (
                        <span className="field-error-msg">{errors.workEmail}</span>
                      )}
                    </div>

                    <div className="input-field-group">
                      <label className="input-label">Phone / WhatsApp</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="e.g. +62 812 3456 7890" 
                        className={`luxury-text-input ${touched.phone && errors.phone ? 'input-has-error' : ''}`}
                        value={businessData.phone}
                        onChange={handlePhoneInputChange}
                        onBlur={() => handleBlur('phone')}
                      />
                      {touched.phone && errors.phone && (
                        <span className="field-error-msg">{errors.phone}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-grid-2col">
                    <div className="input-field-group position-relative">
                      <label className="input-label">City / Operations Hub</label>
                      <div className="address-input-wrapper">
                        <input 
                          type="text" 
                          required
                          placeholder="Type city or operations hub (e.g. Batam, Surabaya, Medan)..." 
                          className={`luxury-text-input ${touched.city && errors.city ? 'input-has-error' : ''}`}
                          value={businessData.city}
                          onChange={e => handleCityInputChange(e.target.value)}
                          onFocus={() => setShowCitySuggestions(true)}
                          onBlur={() => {
                            handleBlur('city');
                            setTimeout(() => setShowCitySuggestions(false), 250);
                          }}
                        />
                        {isSearchingCity && (
                          <span className="address-spinner" />
                        )}
                      </div>
                      {touched.city && errors.city && (
                        <span className="field-error-msg">{errors.city}</span>
                      )}

                      {showCitySuggestions && (
                        <div className="address-suggestions-dropdown">
                          <div className="suggestions-header">
                            <span>Operations Hubs</span>
                            <button 
                              type="button" 
                              className="btn-close-suggestions"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setShowCitySuggestions(false);
                              }}
                            >
                              ✕
                            </button>
                          </div>
                          {/* Preset Hubs Filtered */}
                          {NATIONWIDE_HUBS
                            .filter(h => 
                              !businessData.city || 
                              h.name.toLowerCase().includes(businessData.city.toLowerCase()) ||
                              h.region.toLowerCase().includes(businessData.city.toLowerCase())
                            )
                            .slice(0, 6)
                            .map((hub, idx) => (
                              <div 
                                key={`hub-${idx}`}
                                className="suggestion-item"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleSelectCityHub(hub);
                                }}
                              >
                                <div className="sugg-icon-badge">
                                  <LocationPinIcon />
                                </div>
                                <div className="sugg-text-col">
                                  <span className="sugg-primary">{hub.name}</span>
                                  <span className="sugg-secondary">{hub.region}, Indonesia</span>
                                </div>
                              </div>
                            ))}

                          {/* Online Geocoded Cities for other custom regions */}
                          {onlineCityResults && onlineCityResults.length > 0 && (
                            <>
                              <div className="suggestions-header" style={{ borderTop: '1px solid rgba(24,24,27,0.06)' }}>
                                <span>Other Region Matches</span>
                              </div>
                              {onlineCityResults.map((item, idx) => (
                                <div 
                                  key={`online-${item.place_id || idx}`}
                                  className="suggestion-item"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelectOnlineCity(item);
                                  }}
                                >
                                  <div className="sugg-icon-badge globe-badge">
                                    <GlobeIcon />
                                  </div>
                                  <div className="sugg-text-col">
                                    <span className="sugg-primary">{item.name || item.display_name.split(',')[0]}</span>
                                    <span className="sugg-secondary">{item.display_name}</span>
                                  </div>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="input-field-group position-relative">
                      <label className="input-label">Workshop / HQ Address</label>
                      <div className="address-input-wrapper">
                        <input 
                          type="text" 
                          placeholder="Workshop, studio, or headquarters address..." 
                          className={`luxury-text-input address-live-input ${touched.address && errors.address ? 'input-has-error' : ''}`}
                          value={businessData.address}
                          onChange={e => handleAddressInputChange(e.target.value)}
                          onBlur={() => {
                            handleBlur('address');
                            setTimeout(() => setShowSuggestions(false), 250);
                          }}
                          onFocus={() => {
                            if (addressSuggestions.length > 0) setShowSuggestions(true);
                          }}
                        />
                        {isSearchingAddress && (
                          <span className="address-spinner" />
                        )}
                      </div>
                      {touched.address && errors.address && (
                        <span className="field-error-msg">{errors.address}</span>
                      )}

                      {/* Real-time Address Suggestions Dropdown */}
                      {showSuggestions && addressSuggestions.length > 0 && (
                        <div className="address-suggestions-dropdown">
                          <div className="suggestions-header">
                            <span>Location Matches</span>
                            <button 
                              type="button" 
                              className="btn-close-suggestions"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setShowSuggestions(false);
                              }}
                            >
                              ✕
                            </button>
                          </div>
                          {addressSuggestions.map((item, idx) => (
                            <div 
                              key={item.place_id || idx} 
                              className="suggestion-item"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectSuggestion(item);
                              }}
                            >
                              <div className="sugg-icon-badge">
                                <LocationPinIcon />
                              </div>
                              <div className="sugg-text-col">
                                <span className="sugg-primary">{item.display_name.split(',')[0]}</span>
                                <span className="sugg-secondary">{item.display_name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Clean Map Frame ── */}
                  <div className="gmaps-clean-container">
                    <iframe
                      title="Google Maps Location"
                      width="100%"
                      height="180"
                      style={{ border: 0, borderRadius: '14px' }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(businessData.address ? `${businessData.address}, ${businessData.city}, Indonesia` : businessData.formattedLocation)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    />
                  </div>

                  <div className="form-action-row">
                    <div />
                    <button type="submit" className="btn-reg-primary">
                      <span>Verify Work Email &amp; Continue &rarr;</span>
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Step: OTP Email Verification */}
              {step === 'otp' && (
                <motion.form 
                  key="step-otp"
                  onSubmit={handleVerifyOtp} 
                  className="reg-form-body otp-form-center"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="otp-icon-wrap">
                    <MailEnvelopeIcon />
                  </div>

                  <div className="otp-input-box">
                    <label className="input-label text-center">6-Digit Verification Code</label>
                    
                    {/* 6-Box Segmented Inputs */}
                    <div className="otp-boxes-container" onPaste={handleOtpPaste}>
                      {otpDigits.map((digit, idx) => (
                        <input 
                          key={idx}
                          ref={el => (otpInputRefs.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          autoComplete="one-time-code"
                          value={digit}
                          className={`otp-digit-box ${digit ? 'box-filled' : ''} ${otpError ? 'box-has-error' : ''}`}
                          onChange={e => handleOtpBoxChange(idx, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(idx, e)}
                        />
                      ))}
                    </div>

                    {otpError && <span className="otp-error-msg">{otpError}</span>}
                    <small className="otp-hint-text">A 6-digit confirmation code has been sent to <strong>{businessData.workEmail || 'your email'}</strong>.</small>

                    <div style={{ marginTop: '14px', padding: '10px 14px', background: '#FDF2F8', border: '1px solid #FBCFE8', borderRadius: '8px', fontSize: '0.78rem', color: '#9D174D', textAlign: 'center' }}>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>💡 Mode Pengujian Cepat:</div>
                      <div>Bebas masukkan 6 angka sembarang (misal <code>121211</code> atau <code>123456</code>) untuk langsung lanjut.</div>
                      <button 
                        type="button"
                        style={{ marginTop: '8px', background: '#BE185D', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' }}
                        onClick={() => {
                          setOtpDigits(['1', '2', '3', '4', '5', '6']);
                          setTimeout(() => handleVerifyOtp(), 100);
                        }}
                      >
                        ⚡ Masuk Instan (Isi Otomatis 123456)
                      </button>
                    </div>
                  </div>

                  <div className="otp-resend-row">
                    <span>Didn't receive code?</span>
                    {resendCooldown > 0 ? (
                      <span className="resend-countdown-text">Resend in <strong>{resendCooldown}s</strong></span>
                    ) : (
                      <button 
                        type="button" 
                        className="btn-resend-otp" 
                        onClick={() => sendEmailOtp(businessData.workEmail)}
                      >
                        Resend Code
                      </button>
                    )}
                  </div>

                  <div className="form-action-row justify-content-center">
                    <button type="button" className="btn-reg-secondary" onClick={() => setStep(1)}>
                      &larr; Back
                    </button>
                    <button type="submit" className="btn-reg-primary">
                      <span>Confirm &amp; Enter Company Portal &rarr;</span>
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

          </motion.div>
        ) : (
          
          /* ── Provisioning / Workspace Initialization Screen ── */
          <motion.div 
            className="reg-glass-card text-center provisioning-card"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="provisioning-spinner-ring" />
            <span className="reg-kicker">INITIALIZING PORTAL</span>
            <h2 className="provisioning-title">
              Opening {businessData.companyName || 'Your Company'} Portal
            </h2>
            <p className="reg-subtitle">
              Setting up your clean operational workspace, worker network channels, and inventory ledgers.
            </p>

            <div className="provisioning-checklist">
              <div className={`checklist-item ${provisionProgress >= 1 ? 'item-done' : ''}`}>
                <span className="item-icon">{provisionProgress >= 1 ? '✓' : '○'}</span>
                <span>Company identity &amp; administrative roles verified</span>
              </div>
              <div className={`checklist-item ${provisionProgress >= 2 ? 'item-done' : ''}`}>
                <span className="item-icon">{provisionProgress >= 2 ? '✓' : '○'}</span>
                <span>Clean product catalog &amp; materials schema ready</span>
              </div>
              <div className={`checklist-item ${provisionProgress >= 3 ? 'item-done' : ''}`}>
                <span className="item-icon">{provisionProgress >= 3 ? '✓' : '○'}</span>
                <span>Workforce routing &amp; courier dispatch connected</span>
              </div>
              <div className={`checklist-item ${provisionProgress >= 4 ? 'item-done' : ''}`}>
                <span className="item-icon">{provisionProgress >= 4 ? '✓' : '○'}</span>
                <span>Financial unit cost (HPP) ledger initialized</span>
              </div>
            </div>

            {provisionProgress >= 4 && (
              <motion.div 
                className="mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="ready-indicator">&bull; Portal Ready &bull; Redirecting...</span>
              </motion.div>
            )}
          </motion.div>
        )}

      </main>

      {/* ── Footer ── */}
      <footer className="reg-footer">
        <span>&copy; {new Date().getFullYear()} Simpul OS. All rights reserved.</span>
      </footer>

    </div>
  );
}
