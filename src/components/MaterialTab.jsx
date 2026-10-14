import React from 'react';
import { ClipboardList, Plus, Trash2 } from 'lucide-react';

export default function MaterialTab({
  currentSite,
  lang,
  onOpenAddParchi,
  onToggleParchiStatus,
  onDeleteParchi
}) {
  return (
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
          onClick={onOpenAddParchi}
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
            onClick={onOpenAddParchi}
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
                    onClick={() => onToggleParchiStatus(parchi.id)}
                    className="text-[10px] text-amber-400 hover:underline font-semibold"
                  >
                    {parchi.status === 'paid' ? (lang === 'HI' ? 'Mark Udhaar' : 'Mark Udhaar') : (lang === 'HI' ? 'Mark Paid (Chukta)' : 'Mark Paid')}
                  </button>
                </div>
                <button
                  onClick={() => onDeleteParchi(parchi.id)}
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
  );
}