import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function MetricCard({ title, value, subtext, trend, isTrendPositive }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
      </div>
      
      {(trend || subtext) && (
        <div className="mt-4 flex items-center gap-1.5 text-sm">
          {trend ? (
            <span className={`flex items-center font-medium ${isTrendPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              <ArrowUpRight size={16} className="mr-0.5" />
              {trend}
            </span>
          ) : null}
          {subtext && <span className="text-slate-400 font-normal">{subtext}</span>}
        </div>
      )}
    </div>
  );
}