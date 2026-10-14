import React from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';
import { DAYS_OF_WEEK } from '../data/initialData';

export default function HaziriTab({
  currentSite,
  lang,
  onOpenAddWorker,
  onDeleteWorker,
  onAttendanceChange,
  onOpenKharchaModal
}) {
  return (
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
          onClick={onOpenAddWorker}
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
            onClick={onOpenAddWorker}
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
                    onClick={() => onDeleteWorker(worker.id)}
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

                    return (
                      <div key={day} className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 font-semibold mb-1">{day.slice(0, 3)}</span>
                        <div className="flex items-center gap-0.5 bg-slate-900/80 p-1 rounded-xl border border-slate-700 w-full justify-center">
                          <button
                            onClick={() => onAttendanceChange(worker.id, dIdx, 'P')}
                            className={`w-6 h-7 rounded-lg text-xs font-bold transition ${status === 'P' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                            title="Present"
                          >
                            P
                          </button>
                          <button
                            onClick={() => onAttendanceChange(worker.id, dIdx, 'HALF')}
                            className={`w-6 h-7 rounded-lg text-[10px] font-bold transition ${status === 'HALF' ? 'bg-amber-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                            title="Half Day"
                          >
                            ½
                          </button>
                          <button
                            onClick={() => onAttendanceChange(worker.id, dIdx, 'A')}
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
                          onClick={() => onOpenKharchaModal(worker, record.kharcha || 0, dIdx)}
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
  );
}