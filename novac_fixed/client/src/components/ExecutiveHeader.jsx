import React from 'react';
import { Search, Moon, Bell } from 'lucide-react';

export function ExecutiveHeader() {
  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0B0E14]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-8">
        <h1 className="text-lg font-bold tracking-tight">
          Executive <span className="text-blue-400">Overview</span>
        </h1>
        <div className="relative w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <input
            className="w-full pl-9 pr-4 py-2 bg-[#151921] border border-white/5 focus:border-blue-500/20 focus:ring-1 focus:ring-blue-500/20 rounded-xl text-sm transition-all outline-none placeholder:text-slate-600"
            placeholder="Global search for leads, deals or reports..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 transition-colors">
          <Moon className="w-5 h-5" />
        </button>
        <div className="relative">
          <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0B0E14]" />
        </div>
        <div className="h-8 w-px bg-white/10 mx-1" />
        <div className="flex items-center gap-2 bg-blue-500/10 pl-2 pr-3 py-1.5 rounded-full border border-blue-500/20">
          <div className="bg-blue-600 text-[10px] font-bold text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
            Admin
          </div>
          <span className="text-sm font-semibold">Alex Rivera</span>
        </div>
      </div>
    </header>
  );
}
