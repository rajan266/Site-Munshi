import React from 'react';
import { FileText, Share2, Download } from 'lucide-react';

export default function OwnerTab({
  currentSite,
  weeklySummary,
  lang,
  onGenerateWhatsApp
}) {
  return (
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
            onClick={onGenerateWhatsApp}
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
  );
}