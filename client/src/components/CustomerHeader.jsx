import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, Rocket } from 'lucide-react';

export default function CustomerHeader() {
  return (
    <header className="border-b border-slate-200 dark:border-indigo-500/20 bg-white dark:bg-[#101222]/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="size-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <Rocket size={20} />
            </div>
            <h2 className="text-xl font-extrabold tracking-tight dark:text-white">NovaCRM</h2>
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/leads"
              className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors"
            >
              Leads
            </Link>
            <Link
              to="/dashboard"
              className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors"
            >
              Deals
            </Link>
            <Link
              to="/customers"
              className="text-indigo-600 dark:text-slate-100 font-bold border-b-2 border-indigo-600 py-7 -mb-1"
            >
              Customers
            </Link>
            <Link
              to="/executive"
              className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors"
            >
              Executive
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="bg-slate-100 dark:bg-indigo-500/10 border-none rounded-xl pl-10 pr-4 py-2 w-64 focus:ring-2 focus:ring-indigo-600/50 dark:text-white placeholder-slate-500 outline-none"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-indigo-500/10 text-slate-600 dark:text-slate-300 hover:bg-indigo-600/20 transition-all">
            <Bell size={20} />
          </button>
          <div className="h-10 w-[1px] bg-slate-200 dark:bg-indigo-500/20 mx-2" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-none dark:text-white">Alex Rivera</p>
              <p className="text-xs text-slate-500 mt-1">Admin Account</p>
            </div>
            <img 
              className="size-10 rounded-full border-2 border-indigo-600/30 object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAl3OesVljf6kSPA-ms4ioKWcQrtNCh6cqDJEAHSSMooboGHq5GeFOXNXl6d-DC9m9CYBWVPbB2QVXQbOoXNpCQnhOjOo0mBVkmxGWbgVF5SfBvDwR2j7U6FdvMmZOi11zmNFOEyOKx8VXRIp4wSLiNHKOSoVrbcfD-_MzRMl3jogvVCj1RjvHVqOoZeZPNAqk_pAAwrUSV_U8hPpVHUB_W2NiI8LzKRHrEUYc1yURdDNi23XXwLA46m5hxOfE7BjiojcnDlVHzJOrp"
              alt="User profile"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

