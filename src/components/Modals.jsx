import React from 'react';
import { Users, ClipboardList, Building2, IndianRupee, Sparkles, RefreshCw, Share2 } from 'lucide-react';

export function AddWorkerModal({
  show,
  lang,
  workerName,
  setWorkerName,
  workerRole,
  setWorkerRole,
  workerRate,
  setWorkerRate,
  onSubmit,
  onClose
}) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-400" />
          {lang === 'HI' ? 'Naya Karigar Jodein' : 'Add New Worker'}
        </h3>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Karigar ka Naam' : 'Worker Name'}</label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Mistri"
              value={workerName}
              onChange={(e) => setWorkerName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Role (Kaam)' : 'Role'}</label>
            <select
              value={workerRole}
              onChange={(e) => setWorkerRole(e.target.value)}
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
              value={workerRate}
              onChange={(e) => setWorkerRate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 mt-1"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
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
  );
}

export function AddParchiModal({
  show,
  lang,
  material,
  setMaterial,
  amount,
  setAmount,
  supplier,
  setSupplier,
  status,
  setStatus,
  onSubmit,
  onClose
}) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-amber-400" />
          {lang === 'HI' ? 'Naya Material Bill (Parchi)' : 'Add Material Bill'}
        </h3>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Material Vivran' : 'Material Description'}</label>
            <input
              type="text"
              required
              placeholder="e.g. 50 Bags Ultratech Cement"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Total Amount (₹)' : 'Total Amount (₹)'}</label>
            <input
              type="number"
              required
              placeholder="e.g. 19500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Dukaan / Supplier Naam' : 'Supplier Name'}</label>
            <input
              type="text"
              placeholder="e.g. Gupta Traders"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Bhugtaan Status' : 'Payment Status'}</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 mt-1"
            >
              <option value="udhaar">{lang === 'HI' ? 'Udhaar (Credit)' : 'Udhaar (Credit)'}</option>
              <option value="paid">{lang === 'HI' ? 'Chukta (Paid)' : 'Paid'}</option>
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
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
  );
}

export function KharchaModal({
  data,
  lang,
  inputVal,
  setInputVal,
  onSubmit,
  onClose
}) {
  if (!data) return null;
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-orange-400" />
          {lang === 'HI' ? `Kharcha Darj Karein (${data.workerName})` : `Add Advance for ${data.workerName}`}
        </h3>
        <p className="text-xs text-slate-400">
          {lang === 'HI' ? 'Sham ko diya gaya nagad peshi / kharcha yahan likhein:' : 'Enter cash advance given during the day:'}
        </p>
        <input
          type="number"
          autoFocus
          placeholder="e.g. 300"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-3 text-lg font-bold text-white focus:outline-none focus:border-amber-500"
        />
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-2.5 rounded-xl text-sm transition"
          >
            {lang === 'HI' ? 'Radd' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="flex-1 bg-orange-500 hover:bg-orange-400 text-slate-950 font-black py-2.5 rounded-xl text-sm transition shadow-md"
          >
            {lang === 'HI' ? 'Save Kharcha' : 'Save Kharcha'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AddSiteModal({
  show,
  lang,
  siteName,
  setSiteName,
  budget,
  setBudget,
  received,
  setReceived,
  onSubmit,
  onClose
}) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
        <h3 className="text-lg font-black text-white flex items-center gap-2">
          <Building2 className="w-5 h-5 text-amber-400" />
          {lang === 'HI' ? 'Naya Construction Site Jodein' : 'Add New Site'}
        </h3>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Site / Project Naam' : 'Site Name'}</label>
            <input
              type="text"
              required
              placeholder="e.g. Verma Villa - Phase 2"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Total Estimated Budget (₹)' : 'Total Budget (₹)'}</label>
            <input
              type="number"
              placeholder="e.g. 1500000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 font-medium">{lang === 'HI' ? 'Malik se Mila Advance Cash (₹)' : 'Cash Received (₹)'}</label>
            <input
              type="number"
              placeholder="e.g. 200000"
              value={received}
              onChange={(e) => setReceived(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 mt-1"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
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
  );
}

export function AiModal({
  show,
  lang,
  prompt,
  setPrompt,
  loading,
  resultPreview,
  onSubmit,
  onConfirm,
  onClose
}) {
  if (!show) return null;
  return (
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
        
        <form onSubmit={onSubmit} className="space-y-3">
          <textarea
            rows="3"
            required
            placeholder={lang === 'HI' ? 'Yahan likhiye ya boliye...' : 'Type note here...'}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black py-2.5 rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{lang === 'HI' ? 'AI Munshi se Parse Karwayein' : 'Parse with AI'}</span>
          </button>
        </form>

        {resultPreview && (
          <div className="bg-slate-900 p-4 rounded-2xl border border-amber-500/40 space-y-2">
            <p className="text-xs font-bold text-amber-300">{lang === 'HI' ? '✨ Parsed Result Preview:' : '✨ Parsed Result Preview:'}</p>
            <p className="text-xs text-white">{JSON.stringify(resultPreview, null, 2)}</p>
            <button
              onClick={onConfirm}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs shadow transition"
            >
              {lang === 'HI' ? 'Confirm karke App me Jodein' : 'Confirm & Add to App'}
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-2 rounded-xl text-xs transition"
        >
          {lang === 'HI' ? 'Band Karein' : 'Close'}
        </button>
      </div>
    </div>
  );
}

export function WhatsappModal({
  modal,
  lang,
  onCopy,
  onOpenApp,
  onClose
}) {
  if (!modal.open) return null;
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
        <h3 className="text-lg font-black text-emerald-400 flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          {lang === 'HI' ? 'WhatsApp Hisab Report Ready' : 'WhatsApp Report Ready'}
        </h3>
        <textarea
          readOnly
          rows="8"
          value={modal.text}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none"
        />
        <div className="flex gap-2">
          <button
            onClick={() => onCopy(modal.text)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
          >
            <span>{lang === 'HI' ? '📋 Copy Text' : '📋 Copy Text'}</span>
          </button>
          <button
            onClick={() => onOpenApp(modal.text)}
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
          >
            <span>{lang === 'HI' ? '💬 WhatsApp Kholein' : '💬 Open in WhatsApp'}</span>
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-2 rounded-xl text-xs transition"
        >
          {lang === 'HI' ? 'Band Karein' : 'Close'}
        </button>
      </div>
    </div>
  );
}