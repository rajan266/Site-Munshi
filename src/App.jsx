import React, { useState, useEffect, useMemo } from 'react';
import {
  HardHat,
  Users,
  ClipboardList,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Share2,
  Calendar,
  Sparkles,
  Camera,
  Volume2,
  Download,
  Building2,
  IndianRupee,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

// Default initial state with dummy data for first-time visitors
const DEFAULT_SITES = [
  {
    id: 'site-1',
    name: 'Sharma Residence - Solan',
    budget: 1500000,
    received: 500000,
    workers: [
      { id: 'w1', name: 'Ramesh Kumar', role: 'Mistri', rate: 800 },
      { id: 'w2', name: 'Suresh Kumar', role: 'Mazdoor', rate: 500 },
      { id: 'w3', name: 'Chotu Ram', role: 'Helper', rate: 400 },
      { id: 'w4', name: 'Deepak Singh', role: 'Mistri', rate: 800 }
    ],
    attendance: {
      // workerId_dayIndex: { status: 'P' | 'HALF' | 'A', kharcha: number }
      'w1_0': { status: 'P', kharcha: 200 },
      'w1_1': { status: 'P', kharcha: 0 },
      'w1_2': { status: 'HALF', kharcha: 500 },
      'w2_0': { status: 'P', kharcha: 0 },
      'w2_1': { status: 'P', kharcha: 300 },
      'w3_0': { status: 'P', kharcha: 100 }
    },
    parchis: [
      { id: 'p1', material: 'Ultratech Cement (50 Bags)', amount: 19500, status: 'udhaar', supplier: 'Gupta Traders', date: '2026-06-10' },
      { id: 'p2', material: 'Saria / TMT Bars (500kg)', amount: 28000, status: 'paid', supplier: 'Shivalik Steels', date: '2026-06-08' },
      { id: 'p3', material: 'Reti & Crusher (1 Tipper)', amount: 6500, status: 'paid', supplier: 'Local Quarry', date: '2026-06-05' }
    ]
  },
  {
    id: 'site-2',
    name: 'Retaining Wall - Block B',
    budget: 800000,
    received: 300000,
    workers: [
      { id: 'w201', name: 'Kuldeep Singh', role: 'Mistri', rate: 850 },
      { id: 'w202', name: 'Raj Kumar', role: 'Mazdoor', rate: 500 }
    ],
    attendance: {},
    parchis: [
      { id: 'p201', material: 'Bricks (10,000 pcs)', amount: 75000, status: 'udhaar', supplier: 'Bhatha Brick Kiln', date: '2026-06-09' }
    ]
  }
];

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function App() {
  // Load from localStorage or default
  const [sites, setSites] = useState(() => {
    try {
      const saved = localStorage.getItem('site_munshi_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SITES;
  });

  const [activeSiteId, setActiveSiteId] = useState(() => sites[0]?.id || 'site-1');
  const [activeTab, setActiveTab] = useState('haziri'); // 'haziri', 'parchi', 'report', 'settings'
  const [lang, setLang] = useState('HI'); // HI (Hinglish/Hindi) or EN
  
  // Modals & States
  const [showAddWorker, setShowAddWorker] = useState(false);
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerRole, setNewWorkerRole] = useState('Mazdoor');
  const [newWorkerRate, setNewWorkerRate] = useState('500');

  const [showAddParchi, setShowAddParchi] = useState(false);
  const [parchiMaterial, setParchiMaterial] = useState('');
  const [parchiAmount, setParchiAmount] = useState('');
  const [parchiSupplier, setParchiSupplier] = useState('');
  const [parchiStatus, setParchiStatus] = useState('udhaar');

  const [showAddSite, setShowAddSite] = useState(false);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteBudget, setNewSiteBudget] = useState('');
  const [newSiteReceived, setNewSiteReceived] = useState('');

  const [showKharchaModal, setShowKharchaModal] = useState(null); // { workerId, workerName, currentKharcha, dayIndex }
  const [kharchaInput, setKharchaInput] = useState('');

  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResultPreview, setAiResultPreview] = useState(null);

  const [whatsappModal, setWhatsappModal] = useState({ open: false, text: '' });
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Save to localStorage whenever sites change
  useEffect(() => {
    try {
      localStorage.setItem('site_munshi_data', JSON.stringify(sites));
    } catch (e) {
      console.error(e);
    }
  }, [sites]);

  const currentSite = useMemo(() => {
    return sites.find(s => s.id === activeSiteId) || sites[0] || {
      id: 'default',
      name: 'No Site Selected',
      budget: 0,
      received: 0,
      workers: [],
      attendance: {},
      parchis: []
    };
  }, [sites, activeSiteId]);

  // Helper to update current site data
  const updateCurrentSite = (updater) => {
    setSites(prev => prev.map(s => s.id === currentSite.id ? updater(s) : s));
  };

  // Clear All Dummy Data / Reset to Empty State
  const handleClearAllData = () => {
    if (window.confirm(lang === 'HI' ? 'Kya aap saara data clear karke fresh start karna chahte hain?' : 'Are you sure you want to clear all data and start fresh?')) {
      const emptySite = {
        id: 'site-' + Date.now(),
        name: lang === 'HI' ? 'Mera Pehla Site' : 'My First Site',
        budget: 500000,
        received: 100000,
        workers: [
          { id: 'w_init_1', name: lang === 'HI' ? 'Mistri Ji' : 'Lead Mason', role: 'Mistri', rate: 800 },
          { id: 'w_init_2', name: lang === 'HI' ? 'Mazdoor Bhai' : 'Helper', role: 'Mazdoor', rate: 500 }
        ],
        attendance: {},
        parchis: []
      };
      setSites([emptySite]);
      setActiveSiteId(emptySite.id);
      showToast(lang === 'HI' ? 'Saara dummy data clear kar diya gaya hai!' : 'All dummy data cleared successfully!');
    }
  };

  // Attendance Handlers
  const handleAttendanceChange = (workerId, dayIndex, status) => {
    updateCurrentSite(site => {
      const key = `${workerId}_${dayIndex}`;
      const existing = site.attendance[key] || { status: '', kharcha: 0 };
      const newStatus = existing.status === status ? '' : status; // toggle off if clicked again
      return {
        ...site,
        attendance: {
          ...site.attendance,
          [key]: { ...existing, status: newStatus }
        }
      };
    });
  };

  const handleMarkAllPresent = (dayIndex) => {
    updateCurrentSite(site => {
      const updatedAttendance = { ...site.attendance };
      site.workers.forEach(w => {
        const key = `${w.id}_${dayIndex}`;
        const existing = updatedAttendance[key] || { status: '', kharcha: 0 };
        updatedAttendance[key] = { ...existing, status: 'P' };
      });
      return { ...site, attendance: updatedAttendance };
    });
    showToast(lang === 'HI' ? 'Sabhi ko Present mark kar diya gaya!' : 'Marked all present for this day!');
  };

  const handleSaveKharcha = () => {
    if (!showKharchaModal) return;
    const { workerId, dayIndex } = showKharchaModal;
    const amount = parseFloat(kharchaInput) || 0;

    updateCurrentSite(site => {
      const key = `${workerId}_${dayIndex}`;
      const existing = site.attendance[key] || { status: 'P', kharcha: 0 };
      return {
        ...site,
        attendance: {
          ...site.attendance,
          [key]: { ...existing, kharcha: amount }
        }
      };
    });
    setShowKharchaModal(null);
    setKharchaInput('');
    showToast(lang === 'HI' ? 'Kharcha update ho gaya!' : 'Advance kharcha updated!');
  };

  // Calculations for current site
  const weeklySummary = useMemo(() => {
    let totalLaborCost = 0;
    let totalKharchaPaid = 0;

    currentSite.workers.forEach(w => {
      DAYS_OF_WEEK.forEach((_, dIdx) => {
        const key = `${w.id}_${dIdx}`;
        const record = currentSite.attendance[key];
        if (record) {
          if (record.status === 'P') {
            totalLaborCost += w.rate;
          } else if (record.status === 'HALF') {
            totalLaborCost += w.rate / 2;
          }
          totalKharchaPaid += (record.kharcha || 0);
        }
      });
    });

    const totalParchiPaid = currentSite.parchis
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalParchiUdhaar = currentSite.parchis
      .filter(p => p.status === 'udhaar')
      .reduce((sum, p) => sum + p.amount, 0);

    const netLaborPayable = totalLaborCost - totalKharchaPaid;
    const totalSpent = totalLaborCost + totalParchiPaid + totalParchiUdhaar;

    return {
      totalLaborCost,
      totalKharchaPaid,
      netLaborPayable,
      totalParchiPaid,
      totalParchiUdhaar,
      totalSpent
    };
  }, [currentSite]);

  // Add Worker
  const handleAddWorkerSubmit = (e) => {
    e.preventDefault();
    if (!newWorkerName.trim()) return;
    const newWorker = {
      id: 'w_' + Date.now(),
      name: newWorkerName.trim(),
      role: newWorkerRole,
      rate: parseFloat(newWorkerRate) || 500
    };
    updateCurrentSite(site => ({
      ...site,
      workers: [...site.workers, newWorker]
    }));
    setNewWorkerName('');
    setShowAddWorker(false);
    showToast(lang === 'HI' ? 'Naya karigar jod diya gaya!' : 'Worker added successfully!');
  };

  // Add Parchi
  const handleAddParchiSubmit = (e) => {
    e.preventDefault();
    if (!parchiMaterial.trim() || !parchiAmount) return;
    const newP = {
      id: 'p_' + Date.now(),
      material: parchiMaterial.trim(),
      amount: parseFloat(parchiAmount) || 0,
      supplier: parchiSupplier.trim() || (lang === 'HI' ? 'Local Dukaan' : 'Local Supplier'),
      status: parchiStatus,
      date: new Date().toISOString().split('T')[0]
    };
    updateCurrentSite(site => ({
      ...site,
      parchis: [newP, ...site.parchis]
    }));
    setParchiMaterial('');
    setParchiAmount('');
    setParchiSupplier('');
    setShowAddParchi(false);
    showToast(lang === 'HI' ? 'Parchi safalpurvak save ho gayi!' : 'Receipt added successfully!');
  };

  const toggleParchiStatus = (pId) => {
    updateCurrentSite(site => ({
      ...site,
      parchis: site.parchis.map(p => p.id === pId ? { ...p, status: p.status === 'paid' ? 'udhaar' : 'paid' } : p)
    }));
  };

  const deleteParchi = (pId) => {
    updateCurrentSite(site => ({
      ...site,
      parchis: site.parchis.filter(p => p.id !== pId)
    }));
  };

  const deleteWorker = (wId) => {
    updateCurrentSite(site => ({
      ...site,
      workers: site.workers.filter(w => w.id !== wId)
    }));
  };

  // Add New Site
  const handleAddSiteSubmit = (e) => {
    e.preventDefault();
    if (!newSiteName.trim()) return;
    const sId = 'site_' + Date.now();
    const newS = {
      id: sId,
      name: newSiteName.trim(),
      budget: parseFloat(newSiteBudget) || 1000000,
      received: parseFloat(newSiteReceived) || 0,
      workers: [
        { id: 'w_init_' + sId, name: lang === 'HI' ? 'Mistri Ji' : 'Lead Mason', role: 'Mistri', rate: 800 }
      ],
      attendance: {},
      parchis: []
    };
    setSites(prev => [...prev, newS]);
    setActiveSiteId(sId);
    setNewSiteName('');
    setNewSiteBudget('');
    setNewSiteReceived('');
    setShowAddSite(false);
    showToast(lang === 'HI' ? 'Naya site shuru ho gaya!' : 'New site created!');
  };

  // AI Smart Munshi Command Parser Simulation
  const handleAiCommand = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setTimeout(() => {
      const text = aiPrompt.toLowerCase();
      let parsedAction = null;
      if (text.includes('cement') || text.includes('saria') || text.includes('reti') || text.includes('bag') || text.includes('ka')) {
        parsedAction = {
          type: 'parchi',
          material: aiPrompt,
          amount: 15000,
          supplier: 'Gupta Traders',
          status: 'udhaar'
        };
      } else {
        parsedAction = {
          type: 'attendance',
          summary: aiPrompt,
          note: lang === 'HI' ? 'Sabhi mazdoor present aur kharcha darj kiya gaya.' : 'Attendance and advance recorded via AI.'
        };
      }
      setAiResultPreview(parsedAction);
      setAiLoading(false);
    }, 1000);
  };

  const confirmAiAction = () => {
    if (!aiResultPreview) return;
    if (aiResultPreview.type === 'parchi') {
      const newP = {
        id: 'p_ai_' + Date.now(),
        material: aiResultPreview.material,
        amount: aiResultPreview.amount,
        supplier: aiResultPreview.supplier,
        status: aiResultPreview.status,
        date: new Date().toISOString().split('T')[0]
      };
      updateCurrentSite(site => ({ ...site, parchis: [newP, ...site.parchis] }));
    } else {
      // Mark first worker present
      if (currentSite.workers.length > 0) {
        const wId = currentSite.workers[0].id;
        handleAttendanceChange(wId, 0, 'P');
      }
    }
    setShowAiModal(false);
    setAiPrompt('');
    setAiResultPreview(null);
    showToast(lang === 'HI' ? 'AI Munshi ne entry update kar di!' : 'AI Munshi successfully recorded the entry!');
  };

  // WhatsApp Summary Generator
  const generateWhatsAppText = () => {
    const text = `🏗️ *SITE HISAB REPORT: ${currentSite.name}*
📅 *Hafta Summary*
------------------
👷 Total Labor Cost: ₹${weeklySummary.totalLaborCost.toLocaleString('en-IN')}
💸 Total Kharcha Paid: ₹${weeklySummary.totalKharchaPaid.toLocaleString('en-IN')}
🤝 *Net Labor Payable (Baki): ₹${weeklySummary.netLaborPayable.toLocaleString('en-IN')}*

🧱 Material Bills (Paid): ₹${weeklySummary.totalParchiPaid.toLocaleString('en-IN')}
📋 Material Bills (Udhaar): ₹${weeklySummary.totalParchiUdhaar.toLocaleString('en-IN')}
------------------
💰 *Total Site Spend: ₹${weeklySummary.totalSpent.toLocaleString('en-IN')}*
📥 *Cash Received from Owner: ₹${currentSite.received.toLocaleString('en-IN')}*

Kripya agla payment release karne ki kripa karein. Dhanyawad! 🙏`;

    setWhatsappModal({ open: true, text });
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(lang === 'HI' ? 'WhatsApp message copy ho gaya!' : 'WhatsApp message copied to clipboard!');
      }).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      showToast(lang === 'HI' ? 'WhatsApp message copy ho gaya!' : 'WhatsApp message copied!');
    } catch (err) {
      showToast('Copy failed');
    }
    document.body.removeChild(textarea);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400 text-sm font-medium animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40 px-4 py-3 shadow-md">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Logo & Site Switcher */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <div className="flex items-center gap-2.5">
              <div className="bg-amber-500 text-slate-950 p-2 rounded-xl shadow-lg">
                <HardHat className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="font-black tracking-wide text-lg text-amber-400 flex items-center gap-1.5">
                  SITE MUNSHI <span className="text-xs bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">PRO</span>
                </h1>
                <p className="text-xs text-slate-400">Digital Site Diary & Khata</p>
              </div>
            </div>

            {/* Language & Reset Toggle (Mobile) */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                onClick={() => setLang(l => l === 'HI' ? 'EN' : 'HI')}
                className="bg-slate-700 hover:bg-slate-600 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-600 transition"
              >
                {lang === 'HI' ? '🇮🇳 Hinglish' : '🇬🇧 English'}
              </button>
              <button
                onClick={handleClearAllData}
                title="Clear Data"
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-1.5 rounded-lg border border-red-500/30 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Site Selector Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <select
              value={activeSiteId}
              onChange={(e) => setActiveSiteId(e.target.value)}
              aria-label="Select active site"
              className="bg-slate-900 border border-slate-600 rounded-xl px-3 py-2 text-sm font-semibold text-amber-300 focus:outline-none focus:border-amber-500 flex-1 sm:w-64 shadow-inner"
            >
              {sites.map(s => (
                <option key={s.id} value={s.id}>🏗️ {s.name}</option>
              ))}
            </select>
            <button
              onClick={() => setShowAddSite(true)}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-sm flex items-center gap-1 shrink-0 shadow-md transition"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">{lang === 'HI' ? 'Naya Site' : 'New Site'}</span>
            </button>
          </div>

          {/* Desktop Language & Clear Data */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setLang(l => l === 'HI' ? 'EN' : 'HI')}
              className="bg-slate-700 hover:bg-slate-600 text-xs font-bold px-3 py-2 rounded-xl border border-slate-600 transition flex items-center gap-1.5"
            >
              <span>🌐</span> {lang === 'HI' ? 'Hinglish / Hindi' : 'English'}
            </button>
            <button
              onClick={handleClearAllData}
              title={lang === 'HI' ? 'Saara dummy data clear karein' : 'Clear dummy data & start fresh'}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-semibold px-3 py-2 rounded-xl border border-red-500/30 transition flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{lang === 'HI' ? 'Fresh Start' : 'Clear Data'}</span>
            </button>
          </div>

        </div>
      </header>

      {/* AI Smart Munshi Bar Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-slate-950 px-4 py-2.5 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-200 shrink-0 animate-pulse" />
            <p className="text-xs sm:text-sm font-bold text-white">
              {lang === 'HI' ? '✨ AI Munshi: Voice ya text se haziri aur parchi direct enter karein!' : '✨ AI Munshi: Speak or type site updates naturally!'}
            </p>
          </div>
          <button
            onClick={() => setShowAiModal(true)}
            className="bg-slate-900 text-amber-300 hover:bg-slate-950 font-black text-xs px-3 py-1.5 rounded-lg shadow uppercase tracking-wider transition shrink-0"
          >
            {lang === 'HI' ? 'Kholo AI Munshi' : 'Open AI Munshi'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto w-full p-4 flex-1 pb-24">
        
        {/* Quick Stats Overview Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 shadow-sm">
            <p className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Kul Labors (Hafta)' : 'Total Labor Cost'}</p>
            <p className="text-lg font-black text-white mt-0.5">₹{weeklySummary.totalLaborCost.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 shadow-sm">
            <p className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Baki Labor (Bacha Hua)' : 'Net Labor Payable'}</p>
            <p className="text-lg font-black text-amber-400 mt-0.5">₹{weeklySummary.netLaborPayable.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 shadow-sm">
            <p className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Total Parchi Bills' : 'Total Material Bills'}</p>
            <p className="text-lg font-black text-emerald-400 mt-0.5">₹{(weeklySummary.totalParchiPaid + weeklySummary.totalParchiUdhaar).toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 shadow-sm">
            <p className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Malik Se Mila Cash' : 'Owner Cash Received'}</p>
            <p className="text-lg font-black text-blue-400 mt-0.5">₹{currentSite.received.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Tab 1: Haziri & Kharcha */}
        {activeTab === 'haziri' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-800 p-3.5 rounded-2xl border border-slate-700">
              <div>
                <h2 className="font-bold text-base text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  {lang === 'HI' ? '1. Haziri & Kharcha (Hafta Hisab)' : '1. Attendance & Advances'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'HI' ? 'P = Present, 1/2 = Half Day, A = Absent. Sat ko baki hisab karein.' : 'Tap P, 1/2, or A for each worker daily.'}
                </p>
              </div>
              <button
                onClick={() => setShowAddWorker(true)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>{lang === 'HI' ? 'Karigar Jodein' : 'Add Worker'}</span>
              </button>
            </div>

            {currentSite.workers.length === 0 ? (
              <div className="text-center py-12 bg-slate-800/40 rounded-3xl border border-dashed border-slate-700">
                <Users className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-300 font-semibold">{lang === 'HI' ? 'Koi karigar nahi joda gaya hai abhi.' : 'No workers added yet.'}</p>
                <button
                  onClick={() => setShowAddWorker(true)}
                  className="mt-3 bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  {lang === 'HI' ? 'Pehla Karigar Jodein' : 'Add First Worker'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {currentSite.workers.map(worker => {
                  let workerDaysCost = 0;
                  let workerKharcha = 0;
                  DAYS_OF_WEEK.forEach((_, dIdx) => {
                    const rec = currentSite.attendance[`${worker.id}_${dIdx}`];
                    if (rec) {
                      if (rec.status === 'P') workerDaysCost += worker.rate;
                      if (rec.status === 'HALF') workerDaysCost += worker.rate / 2;
                      workerKharcha += (rec.kharcha || 0);
                    }
                  });
                  const workerBaki = workerDaysCost - workerKharcha;

                  return (
                    <div key={worker.id} className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 shadow-md space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-white">{worker.name}</h3>
                            <span className="text-[10px] bg-slate-700 text-amber-300 px-2 py-0.5 rounded-full font-semibold border border-slate-600">
                              {worker.role} • ₹{worker.rate}/day
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {lang === 'HI' ? 'Baki Lena/Dena:' : 'Net Payable:'} <strong className="text-emerald-400">₹{workerBaki}</strong>
                            {workerKharcha > 0 && <span className="text-orange-400 ml-2">(Kharcha: ₹{workerKharcha})</span>}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteWorker(worker.id)}
                          className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg transition"
                          title="Remove worker"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Day Badges */}
                      <div className="grid grid-cols-7 gap-1.5 pt-1">
                        {DAYS_OF_WEEK.map((day, dIdx) => {
                          const key = `${worker.id}_${dIdx}`;
                          const record = currentSite.attendance[key] || { status: '', kharcha: 0 };
                          const status = record.status;
                          
                          let bg = 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500';
                          if (status === 'P') bg = 'bg-emerald-600 text-white border-emerald-500 font-black shadow-sm';
                          if (status === 'HALF') bg = 'bg-amber-600 text-white border-amber-500 font-black shadow-sm';
                          if (status === 'A') bg = 'bg-red-600/80 text-white border-red-500 font-black shadow-sm';

                          return (
                            <div key={day} className="flex flex-col items-center">
                              <span className="text-[10px] text-slate-400 font-semibold mb-1">{day.slice(0, 3)}</span>
                              <div className="flex items-center gap-0.5 bg-slate-900/80 p-1 rounded-xl border border-slate-700 w-full justify-center">
                                <button
                                  onClick={() => handleAttendanceChange(worker.id, dIdx, 'P')}
                                  className={`w-6 h-7 rounded-lg text-xs font-bold transition ${status === 'P' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                                  title="Present"
                                >
                                  P
                                </button>
                                <button
                                  onClick={() => handleAttendanceChange(worker.id, dIdx, 'HALF')}
                                  className={`w-6 h-7 rounded-lg text-[10px] font-bold transition ${status === 'HALF' ? 'bg-amber-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                                  title="Half Day"
                                >
                                  ½
                                </button>
                                <button
                                  onClick={() => handleAttendanceChange(worker.id, dIdx, 'A')}
                                  className={`w-6 h-7 rounded-lg text-xs font-bold transition ${status === 'A' ? 'bg-red-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                                  title="Absent"
                                >
                                  A
                                </button>
                              </div>
                              {record.kharcha > 0 && (
                                <span className="text-[9px] text-orange-400 font-bold mt-0.5">
                                  -₹{record.kharcha}
                                </span>
                              )}
                              <button
                                onClick={() => {
                                  setShowKharchaModal({ workerId: worker.id, workerName: worker.name, currentKharcha: record.kharcha || 0, dayIndex: dIdx });
                                  setKharchaInput(record.kharcha ? record.kharcha.toString() : '');
                                }}
                                className="text-[9px] text-slate-400 hover:text-amber-300 underline mt-0.5"
                              >
                                {record.kharcha > 0 ? 'Edit Kharcha' : '+ Kharcha'}
                              </button>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Material & Parchi Tracker */}
        {activeTab === 'parchi' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-slate-800 p-3.5 rounded-2xl border border-slate-700">
              <div>
                <h2 className="font-bold text-base text-white flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-amber-400" />
                  {lang === 'HI' ? '2. Material & Parchi Tracker' : '2. Material Receipts & Bills'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'HI' ? 'Hardware aur cement ke bills ka hisab aur parchi photo record.' : 'Keep track of supplier bills, cement, saria, and payments.'}
                </p>
              </div>
              <button
                onClick={() => setShowAddParchi(true)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>{lang === 'HI' ? 'Nayi Parchi' : 'Add Bill'}</span>
              </button>
            </div>

            {currentSite.parchis.length === 0 ? (
              <div className="text-center py-12 bg-slate-800/40 rounded-3xl border border-dashed border-slate-700">
                <ClipboardList className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-300 font-semibold">{lang === 'HI' ? 'Koi parchi ya bill darj nahi hai.' : 'No bills recorded yet.'}</p>
                <button
                  onClick={() => setShowAddParchi(true)}
                  className="mt-3 bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  {lang === 'HI' ? 'Pehla Bill Jodein' : 'Add First Bill'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {currentSite.parchis.map(parchi => (
                  <div key={parchi.id} className="bg-slate-800 border border-slate-700/80 rounded-2xl p-4 shadow-md flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-white">{parchi.material}</h3>
                        <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full border ${parchi.status === 'paid' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'}`}>
                          {parchi.status === 'paid' ? (lang === 'HI' ? 'Chukta (Paid)' : 'Paid') : (lang === 'HI' ? 'Udhaar (Credit)' : 'Udhaar')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-2">
                        <span>🏢 {parchi.supplier}</span>
                        <span>•</span>
                        <span>📅 {parchi.date}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-lg font-black text-white">₹{parchi.amount.toLocaleString('en-IN')}</p>
                        <button
                          onClick={() => toggleParchiStatus(parchi.id)}
                          className="text-[10px] text-amber-400 hover:underline font-semibold"
                        >
                          {parchi.status === 'paid' ? (lang === 'HI' ? 'Mark Udhaar' : 'Mark Udhaar') : (lang === 'HI' ? 'Mark Paid (Chukta)' : 'Mark Paid')}
                        </button>
                      </div>
                      <button
                        onClick={() => deleteParchi(parchi.id)}
                        className="text-slate-500 hover:text-red-400 p-2 rounded-xl bg-slate-900 border border-slate-700 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Owner Weekly Report */}
        {activeTab === 'report' && (
          <div className="space-y-4">
            <div className="bg-slate-800 p-5 rounded-3xl border border-slate-700 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div>
                  <h2 className="font-black text-lg text-amber-400 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    {lang === 'HI' ? '3. Owner Weekly Report & WhatsApp Hisab' : '3. Owner Report & WhatsApp Summary'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang === 'HI' ? 'Makaan malik ko bhejne ke liye 1-click professional PDF / WhatsApp report.' : 'Generate clean weekly financial progress for the property owner.'}
                  </p>
                </div>
                <button
                  onClick={generateWhatsAppText}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-lg transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{lang === 'HI' ? 'WhatsApp Hisab Bhejein' : 'Send WhatsApp Report'}</span>
                </button>
              </div>

              {/* Report Card Preview */}
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-700 space-y-4 font-mono text-sm">
                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400">{lang === 'HI' ? 'Site Naam:' : 'Site Name:'}</span>
                  <span className="font-bold text-amber-300">{currentSite.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400">{lang === 'HI' ? 'Total Labor Cost:' : 'Total Labor Cost:'}</span>
                  <span className="font-bold text-white">₹{weeklySummary.totalLaborCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400">{lang === 'HI' ? 'Diye Gaye Kharche:' : 'Total Kharcha Paid:'}</span>
                  <span className="font-bold text-orange-400">- ₹{weeklySummary.totalKharchaPaid.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-3 bg-slate-800/50 p-2 rounded-xl">
                  <span className="text-amber-400 font-bold">{lang === 'HI' ? 'Net Labor Payable (Baki):' : 'Net Labor Payable:'}</span>
                  <span className="font-black text-amber-400">₹{weeklySummary.netLaborPayable.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-3">
                  <span className="text-slate-400">{lang === 'HI' ? 'Material Bills (Paid + Udhaar):' : 'Total Material Bills:'}</span>
                  <span className="font-bold text-emerald-400">₹{(weeklySummary.totalParchiPaid + weeklySummary.totalParchiUdhaar).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-3 font-bold text-base">
                  <span className="text-white">{lang === 'HI' ? 'Kul Kharcha (Total Spend):' : 'Total Site Spend:'}</span>
                  <span className="text-amber-300">₹{weeklySummary.totalSpent.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">{lang === 'HI' ? 'Malik Se Prapt Cash (Received):' : 'Owner Cash Received:'}</span>
                  <span className="font-bold text-blue-400">₹{currentSite.received.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 rounded-xl border border-slate-600 flex items-center justify-center gap-2 transition text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'HI' ? 'Print / Save PDF' : 'Print / Download PDF'}</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Bottom Navigation Bar */}
      <nav className="bg-slate-800 border-t border-slate-700 fixed bottom-0 left-0 right-0 z-40 px-4 py-2 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <button
            onClick={() => setActiveTab('haziri')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${activeTab === 'haziri' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px]">{lang === 'HI' ? 'Haziri & Kharcha' : 'Attendance'}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('parchi')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${activeTab === 'parchi' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <ClipboardList className="w-5 h-5" />
            <span className="text-[10px]">{lang === 'HI' ? 'Material Parchi' : 'Bills & Parchi'}</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${activeTab === 'report' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px]">{lang === 'HI' ? 'Owner Report' : 'WhatsApp Report'}</span>
          </button>
        </div>
      </nav>

      {/* Modal: Add Worker */}
      {showAddWorker && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              {lang === 'HI' ? 'Naya Karigar Jodein' : 'Add New Worker'}
            </h3>
            <form onSubmit={handleAddWorkerSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Karigar ka Naam' : 'Worker Name'}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Mistri"
                  value={newWorkerName}
                  onChange={(e) => setNewWorkerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Role (Kaam)' : 'Role'}</label>
                <select
                  value={newWorkerRole}
                  onChange={(e) => setNewWorkerRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 mt-1"
                >
                  <option value="Mistri">Mistri (Mason)</option>
                  <option value="Mazdoor">Mazdoor (Laborer)</option>
                  <option value="Helper">Helper / Barbender</option>
                  <option value="Supervisor">Supervisor / Engineer</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Daily Dihadi (₹ per day)' : 'Daily Rate (₹)'}</label>
                <input
                  type="number"
                  required
                  value={newWorkerRate}
                  onChange={(e) => setNewWorkerRate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 mt-1"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddWorker(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-2.5 rounded-xl text-sm transition"
                >
                  {lang === 'HI' ? 'Radd Karein' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl text-sm transition shadow-md"
                >
                  {lang === 'HI' ? 'Jodein' : 'Save Worker'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Parchi */}
      {showAddParchi && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-amber-400" />
              {lang === 'HI' ? 'Naya Material Bill (Parchi)' : 'Add Material Bill'}
            </h3>
            <form onSubmit={handleAddParchiSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Material Vivran (e.g. 50 Bags Cement)' : 'Material Description'}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50 Bags Ultratech Cement"
                  value={parchiMaterial}
                  onChange={(e) => setParchiMaterial(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Total Amount (₹)' : 'Total Amount (₹)'}</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 19500"
                  value={parchiAmount}
                  onChange={(e) => setParchiAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Dukaan / Supplier Naam' : 'Supplier Name'}</label>
                <input
                  type="text"
                  placeholder="e.g. Gupta Traders"
                  value={parchiSupplier}
                  onChange={(e) => setParchiSupplier(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Bhugtaan Status' : 'Payment Status'}</label>
                <select
                  value={parchiStatus}
                  onChange={(e) => setParchiStatus(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 mt-1"
                >
                  <option value="udhaar">{lang === 'HI' ? 'Udhaar (Credit)' : 'Udhaar (Credit)'}</option>
                  <option value="paid">{lang === 'HI' ? 'Chukta (Paid)' : 'Paid'}</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddParchi(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-2.5 rounded-xl text-sm transition"
                >
                  {lang === 'HI' ? 'Radd Karein' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl text-sm transition shadow-md"
                >
                  {lang === 'HI' ? 'Save Bill' : 'Save Bill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Kharcha Input */}
      {showKharchaModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-orange-400" />
              {lang === 'HI' ? `Kharcha Darj Karein (${showKharchaModal.workerName})` : `Add Advance for ${showKharchaModal.workerName}`}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'HI' ? 'Sham ko diya gaya nagad peshi / kharcha yahan likhein:' : 'Enter cash advance given during the day:'}
            </p>
            <input
              type="number"
              autoFocus
              placeholder="e.g. 300"
              value={kharchaInput}
              onChange={(e) => setKharchaInput(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-lg font-bold text-white focus:outline-none focus:border-amber-500"
            />
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowKharchaModal(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-2.5 rounded-xl text-sm transition"
              >
                {lang === 'HI' ? 'Radd' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveKharcha}
                className="flex-1 bg-orange-500 hover:bg-orange-400 text-slate-950 font-black py-2.5 rounded-xl text-sm transition shadow-md"
              >
                {lang === 'HI' ? 'Save Kharcha' : 'Save Kharcha'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Site */}
      {showAddSite && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              {lang === 'HI' ? 'Naya Construction Site Jodein' : 'Add New Site'}
            </h3>
            <form onSubmit={handleAddSiteSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Site / Project Naam' : 'Site Name'}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Verma Villa - Phase 2"
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Total Estimated Budget (₹)' : 'Total Budget (₹)'}</label>
                <input
                  type="number"
                  placeholder="e.g. 1500000"
                  value={newSiteBudget}
                  onChange={(e) => setNewSiteBudget(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Malik se Mila Advance Cash (₹)' : 'Cash Received (₹)'}</label>
                <input
                  type="number"
                  placeholder="e.g. 200000"
                  value={newSiteReceived}
                  onChange={(e) => setNewSiteReceived(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 mt-1"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSite(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-2.5 rounded-xl text-sm transition"
                >
                  {lang === 'HI' ? 'Radd' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 rounded-xl text-sm transition shadow-md"
                >
                  {lang === 'HI' ? 'Site Shuru Karein' : 'Create Site'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: AI Munshi */}
      {showAiModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              {lang === 'HI' ? '✨ AI Smart Munshi' : '✨ AI Smart Munshi'}
            </h3>
            <p className="text-xs text-slate-300">
              {lang === 'HI' 
                ? 'Kuch bhi Hinglish me likhiye (Jaise: "Ramesh aur Suresh aaj present hain, Chotu ko 300 kharcha diya, aur 50 bag cement 19500 ka Gupta Traders se udhaar aaya")' 
                : 'Type your site notes naturally in English or Hinglish to parse attendance and bills.'}
            </p>
            
            <form onSubmit={handleAiCommand} className="space-y-3">
              <textarea
                rows="3"
                required
                placeholder={lang === 'HI' ? 'Yahan likhiye ya boliye...' : 'Type note here...'}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={aiLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black py-2.5 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{lang === 'HI' ? 'AI Munshi se Parse Karwayein' : 'Parse with AI'}</span>
              </button>
            </form>

            {aiResultPreview && (
              <div className="bg-slate-900 p-4 rounded-2xl border border-amber-500/40 space-y-2">
                <p className="text-xs font-bold text-amber-300">{lang === 'HI' ? '✨ Parsed Result Preview:' : '✨ Parsed Result Preview:'}</p>
                <p className="text-xs text-white">{JSON.stringify(aiResultPreview, null, 2)}</p>
                <button
                  onClick={confirmAiAction}
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs shadow transition"
                >
                  {lang === 'HI' ? 'Confirm karke App me Jodein' : 'Confirm & Add to App'}
                </button>
              </div>
            )}

            <button
              onClick={() => { setShowAiModal(false); setAiResultPreview(null); }}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-2 rounded-xl text-xs transition"
            >
              {lang === 'HI' ? 'Band Karein' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Modal: WhatsApp Summary */}
      {whatsappModal.open && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-emerald-400 flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              {lang === 'HI' ? 'WhatsApp Hisab Report Ready' : 'WhatsApp Report Ready'}
            </h3>
            <textarea
              readOnly
              rows="8"
              value={whatsappModal.text}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => copyToClipboard(whatsappModal.text)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
              >
                <span>{lang === 'HI' ? '📋 Copy Text' : '📋 Copy Text'}</span>
              </button>
              <button
                onClick={() => {
                  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappModal.text)}`;
                  window.open(url, '_blank');
                }}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
              >
                <span>{lang === 'HI' ? '💬 WhatsApp Kholein' : '💬 Open in WhatsApp'}</span>
              </button>
            </div>
            <button
              onClick={() => setWhatsappModal({ open: false, text: '' })}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-2 rounded-xl text-xs transition"
            >
              {lang === 'HI' ? 'Band Karein' : 'Close'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}