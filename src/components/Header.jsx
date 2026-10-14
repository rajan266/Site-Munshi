import React from 'react';
import { HardHat, Plus, Trash2, Sparkles } from 'lucide-react';

export default function Header({
  sites,
  activeSiteId,
  setActiveSiteId,
  lang,
  setLang,
  onOpenAddSite,
  onOpenAiModal,
  onClearData
}) {
  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40 px-4 py-3 shadow-md">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Logo & Mobile Toggles */}
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

          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => setLang(l => l === 'HI' ? 'EN' : 'HI')}
              className="bg-slate-700 hover:bg-slate-600 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-600 transition"
            >
              {lang === 'HI' ? '🇮🇳 Hinglish' : '🇬🇧 English'}
            </button>
            <button
              onClick={onClearData}
              title="Clear Data"
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-1.5 rounded-lg border border-red-500/30 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Site Selector & Add Site Button */}
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
            onClick={onOpenAddSite}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-sm flex items-center gap-1 shrink-0 shadow-md transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">{lang === 'HI' ? 'Naya Site' : 'New Site'}</span>
          </button>
        </div>

        {/* Desktop Controls */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => setLang(l => l === 'HI' ? 'EN' : 'HI')}
            className="bg-slate-700 hover:bg-slate-600 text-xs font-bold px-3 py-2 rounded-xl border border-slate-600 transition flex items-center gap-1.5"
          >
            <span>🌐</span> {lang === 'HI' ? 'Hinglish / Hindi' : 'English'}
          </button>
          <button
            onClick={onClearData}
            title={lang === 'HI' ? 'Saara dummy data clear karein' : 'Clear dummy data & start fresh'}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-semibold px-3 py-2 rounded-xl border border-red-500/30 transition flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{lang === 'HI' ? 'Fresh Start' : 'Clear Data'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}