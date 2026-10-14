import React, { useState, useEffect, useMemo } from 'react';
import { Users, ClipboardList, FileText, Sparkles } from 'lucide-react';
import { INITIAL_SITES, DAYS_OF_WEEK } from './data/initialData';
import Header from './components/Header';
import HaziriTab from './components/HaziriTab';
import MaterialTab from './components/MaterialTab';
import OwnerTab from './components/OwnerTab';
import {
  AddWorkerModal,
  AddParchiModal,
  KharchaModal,
  AddSiteModal,
  AiModal,
  WhatsappModal
} from './components/Modals';

export default function App() {
  const [sites, setSites] = useState(() => {
    try {
      const saved = localStorage.getItem('site_munshi_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SITES;
  });

  const [activeSiteId, setActiveSiteId] = useState(() => sites[0]?.id || 'site-1');
  const [activeTab, setActiveTab] = useState('haziri'); // 'haziri', 'parchi', 'report'
  const [lang, setLang] = useState('HI'); // HI or EN
  
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

  const updateCurrentSite = (updater) => {
    setSites(prev => prev.map(s => s.id === currentSite.id ? updater(s) : s));
  };

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

  const handleAttendanceChange = (workerId, dayIndex, status) => {
    updateCurrentSite(site => {
      const key = `${workerId}_${dayIndex}`;
      const existing = site.attendance[key] || { status: '', kharcha: 0 };
      const newStatus = existing.status === status ? '' : status;
      return {
        ...site,
        attendance: {
          ...site.attendance,
          [key]: { ...existing, status: newStatus }
        }
      };
    });
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
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <Header
        sites={sites}
        activeSiteId={activeSiteId}
        setActiveSiteId={setActiveSiteId}
        lang={lang}
        setLang={setLang}
        onOpenAddSite={() => setShowAddSite(true)}
        onOpenAiModal={() => setShowAiModal(true)}
        onClearData={handleClearAllData}
      />

      {/* AI Smart Munshi Banner */}
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

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full p-4 flex-1 pb-24">
        
        {/* Quick Stats Bar */}
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
          <HaziriTab
            currentSite={currentSite}
            lang={lang}
            onOpenAddWorker={() => setShowAddWorker(true)}
            onDeleteWorker={deleteWorker}
            onAttendanceChange={handleAttendanceChange}
            onOpenKharchaModal={(worker, currentKharcha, dayIndex) => {
              setShowKharchaModal({ workerId: worker.id, workerName: worker.name, currentKharcha, dayIndex });
              setKharchaInput(currentKharcha ? currentKharcha.toString() : '');
            }}
          />
        )}

        {/* Tab 2: Material Bills */}
        {activeTab === 'parchi' && (
          <MaterialTab
            currentSite={currentSite}
            lang={lang}
            onOpenAddParchi={() => setShowAddParchi(true)}
            onToggleParchiStatus={toggleParchiStatus}
            onDeleteParchi={deleteParchi}
          />
        )}

        {/* Tab 3: Owner Report */}
        {activeTab === 'report' && (
          <OwnerTab
            currentSite={currentSite}
            weeklySummary={weeklySummary}
            lang={lang}
            onGenerateWhatsApp={generateWhatsAppText}
          />
        )}

      </main>

      {/* Bottom Nav */}
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

      {/* Modals */}
      <AddWorkerModal
        show={showAddWorker}
        lang={lang}
        workerName={newWorkerName}
        setWorkerName={setNewWorkerName}
        workerRole={newWorkerRole}
        setWorkerRole={setNewWorkerRole}
        workerRate={newWorkerRate}
        setWorkerRate={setNewWorkerRate}
        onSubmit={handleAddWorkerSubmit}
        onClose={() => setShowAddWorker(false)}
      />

      <AddParchiModal
        show={showAddParchi}
        lang={lang}
        material={parchiMaterial}
        setMaterial={setParchiMaterial}
        amount={parchiAmount}
        setAmount={setParchiAmount}
        supplier={parchiSupplier}
        setSupplier={setParchiSupplier}
        status={parchiStatus}
        setStatus={setParchiStatus}
        onSubmit={handleAddParchiSubmit}
        onClose={() => setShowAddParchi(false)}
      />

      <KharchaModal
        data={showKharchaModal}
        lang={lang}
        inputVal={kharchaInput}
        setInputVal={setKharchaInput}
        onSubmit={handleSaveKharcha}
        onClose={() => setShowKharchaModal(null)}
      />

      <AddSiteModal
        show={showAddSite}
        lang={lang}
        siteName={newSiteName}
        setSiteName={setNewSiteName}
        budget={newSiteBudget}
        setBudget={setNewSiteBudget}
        received={newSiteReceived}
        setReceived={setNewSiteReceived}
        onSubmit={handleAddSiteSubmit}
        onClose={() => setShowAddSite(false)}
      />

      <AiModal
        show={showAiModal}
        lang={lang}
        prompt={aiPrompt}
        setPrompt={setAiPrompt}
        loading={aiLoading}
        resultPreview={aiResultPreview}
        onSubmit={handleAiCommand}
        onConfirm={confirmAiAction}
        onClose={() => { setShowAiModal(false); setAiResultPreview(null); }}
      />

      <WhatsappModal
        modal={whatsappModal}
        lang={lang}
        onCopy={copyToClipboard}
        onOpenApp={(text) => {
          const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
          window.open(url, '_blank');
        }}
        onClose={() => setWhatsappModal({ open: false, text: '' })}
      />

    </div>
  );
}