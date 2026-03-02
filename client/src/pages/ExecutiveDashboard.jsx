import React from 'react';
import { ExecutiveSidebar } from '../components/ExecutiveSidebar.jsx';
import { ExecutiveHeader } from '../components/ExecutiveHeader.jsx';
import { ExecutiveStatCard } from '../components/ExecutiveStatCard.jsx';
import { ExecutiveLeadsChart } from '../components/ExecutiveLeadsChart.jsx';
import { ExecutiveDealFlowTable } from '../components/ExecutiveDealFlowTable.jsx';
import { UserPlus, Wallet, CheckCircle, Briefcase } from 'lucide-react';

export default function ExecutiveDashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden font-sans">
      <ExecutiveSidebar />

      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-[#0B0E14]">
        <ExecutiveHeader />

        <div className="p-6 space-y-6 max-w-[1400px] mx-auto w-full">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <ExecutiveStatCard
              label="Total Leads"
              value="12,840"
              change="12%"
              trend="up"
              icon={UserPlus}
              color="blue"
              sparkline={[40, 70, 50, 80, 60, 90]}
            />
            <ExecutiveStatCard
              label="Total Deals"
              value="4,250"
              change="8%"
              trend="up"
              icon={Briefcase}
              color="primary"
              sparkline={[30, 50, 40, 70, 50, 80]}
            />
            <ExecutiveStatCard
              label="Closed Deals"
              value="1,820"
              change="2%"
              trend="down"
              icon={CheckCircle}
              color="amber"
              sparkline={[80, 60, 70, 40, 50, 30]}
            />
            <ExecutiveStatCard
              label="Revenue"
              value="$1.2M"
              change="15%"
              trend="up"
              icon={Wallet}
              color="emerald"
              sparkline={[20, 40, 60, 50, 80, 100]}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExecutiveLeadsChart />
            <div className="bg-[#151921] border border-white/5 p-6 rounded-2xl">
              <h4 className="text-lg font-bold mb-2">Executive Insights</h4>
              <p className="text-slate-400 text-xs">
                Use this panel for additional executive-level charts or KPIs.
              </p>
            </div>
          </div>

          {/* Table Row */}
          <ExecutiveDealFlowTable />
        </div>
      </main>
    </div>
  );
}
