import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, CheckSquare, Search, Bell, Settings,
  Plus, Calendar, MoreHorizontal, Link as LinkIcon,
  MessageSquare, Paperclip, Rocket
} from 'lucide-react';
import { motion } from 'motion/react';
import SharedHeader from '../components/SharedHeader';
import { useTheme } from '../context/ThemeContext';

const SidebarItem = ({ icon: Icon, label, active = false, to }) => (
  <Link
    to={to || '#'}
    className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all duration-200 rounded-xl ${active
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
  >
    <Icon size={18} />
    <span className="font-medium text-sm">{label}</span>
  </Link>
);

const TaskCard = ({ task }) => {
  const priorityColors = {
    'High Priority': 'bg-red-500/10 text-red-400 border border-red-500/20',
    'Medium': 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    'Low': 'bg-green-500/10 text-green-400 border border-green-500/20'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#151921] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <div className="flex items-center gap-1 text-slate-500 text-[10px]">
          <Calendar size={10} />
          <span>{task.date}</span>
        </div>
      </div>

      <h4 className="text-sm font-semibold mb-2 leading-snug text-white">{task.title}</h4>

      {task.link && (
        <div className="flex items-center gap-1 text-blue-400 text-[11px] mb-3">
          <LinkIcon size={12} />
          <span className="hover:underline cursor-pointer">{task.link}</span>
        </div>
      )}

      {task.progress !== undefined && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <div className="flex items-center gap-1 text-slate-500 text-[10px]">
              <CheckSquare size={10} />
              <span>Active</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${task.progress}%` }}
              className="h-full bg-blue-500 rounded-full"
            />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-3 border-t border-white/5">
        <div className="flex -space-x-2">
          {task.assignees.map((avatar, i) => (
            <img
              key={i}
              src={avatar}
              className="w-6 h-6 rounded-full border-2 border-[#151921] object-cover"
              alt="Assignee"
              referrerPolicy="no-referrer"
            />
          ))}
          {task.moreAssignees && (
            <div className="w-6 h-6 rounded-full border-2 border-[#151921] bg-blue-600 text-[10px] flex items-center justify-center font-bold">
              {task.moreAssignees}
            </div>
          )}
        </div>
        {task.statusText && (
          <span className="text-[10px] text-slate-500">{task.statusText}</span>
        )}
        <div className="flex items-center gap-3 text-slate-500">
          {task.comments !== undefined && (
            <div className="flex items-center gap-1">
              <MessageSquare size={12} />
              <span className="text-[10px]">{task.comments}</span>
            </div>
          )}
          {task.attachments !== undefined && (
            <div className="flex items-center gap-1">
              <Paperclip size={12} />
              <span className="text-[10px]">{task.attachments}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const TaskColumn = ({ title, count, tasks, color }) => (
  <div className="flex flex-col gap-4 min-w-[300px] flex-1">
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <span className="bg-white/10 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
          {count}
        </span>
      </div>
      <button className="text-slate-500 hover:text-white transition-colors">
        <MoreHorizontal size={16} />
      </button>
    </div>
    <div className="flex flex-col gap-3">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  </div>
);

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState('My Tasks');

  const tasks = {
    todo: [
      {
        id: 1,
        priority: 'High Priority',
        date: 'Oct 24',
        title: 'Follow up on Enterprise Proposal',
        link: 'Acme Corp Deal',
        assignees: ['https://picsum.photos/seed/user1/40/40'],
        comments: 1
      },
      {
        id: 2,
        priority: 'Medium',
        date: 'Oct 25',
        title: 'Prepare Sales Deck for Q4',
        link: 'General Sales',
        assignees: [],
        attachments: 1
      }
    ],
    inProgress: [
      {
        id: 3,
        priority: 'High Priority',
        date: 'Active',
        title: 'Negotiation: Pricing with TechFlow',
        link: 'TechFlow SaaS Deal',
        progress: 65,
        assignees: ['https://picsum.photos/seed/user2/40/40']
      }
    ],
    review: [
      {
        id: 4,
        priority: 'Low',
        date: 'Oct 20',
        title: 'Contract Final Draft Approval',
        link: 'Globex Corp',
        assignees: [],
        moreAssignees: 'WA',
        statusText: 'Waiting for CEO'
      }
    ]
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0E14] text-white">
      {/* Sidebar */}
      <aside className="w-56 bg-[#0f1117] border-r border-white/5 flex flex-col p-5">
        <Link to="/dashboard" className="flex items-center gap-2.5 mb-8">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Rocket size={18} className="text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">NovaCRM</h1>
        </Link>

        <div className="flex flex-col gap-6 flex-1">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-4">
              Main Menu
            </p>
            <nav className="flex flex-col gap-1">
              <SidebarItem icon={LayoutDashboard} label="Overview" to="/dashboard" />
              <SidebarItem icon={CheckSquare} label="My Tasks" active={true} to="/tasks" />
              <SidebarItem icon={Users} label="Team Space" to="/customers" />
              <SidebarItem icon={Calendar} label="Calendar" to="/dashboard" />
            </nav>
          </div>
        </div>

        <div className="bg-[#151921] p-4 rounded-xl border border-white/5 mt-auto">
          <p className="text-blue-400 text-xs font-bold mb-1">Upgrade Pro</p>
          <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
            Get advanced analytics and unlimited leads.
          </p>
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded-lg transition-all">
            Upgrade Now
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#0B0E14]/80 backdrop-blur-md z-10 shrink-0">
          <nav className="flex items-center gap-6">
            <Link to="/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link to="/leads" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Leads
            </Link>
            <Link to="/deals" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Deals
            </Link>
            <span className="text-sm font-semibold text-blue-400">
              Tasks
              <div className="h-0.5 w-full bg-blue-500 mt-0.5 rounded-full" />
            </span>
            <Link to="/reports" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Reports
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input
                type="text"
                placeholder="Search tasks, leads..."
                className="bg-[#151921] border border-white/5 rounded-xl py-1.5 pl-9 pr-4 text-xs w-52 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="text-slate-400 hover:text-white transition-colors relative p-1.5">
                <Bell size={18} />
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
              </button>
              <Link to="/settings" className="text-slate-400 hover:text-white transition-colors p-1.5">
                <Settings size={18} />
              </Link>
              <Link to="/settings" className="w-8 h-8 rounded-full overflow-hidden border border-white/10 ml-1">
                <img src="https://picsum.photos/seed/profile/100/100" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Task Command Center</h2>
              <p className="text-slate-400 text-sm">Managing 18 active sales tasks across the pipeline</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/5 p-1 rounded-xl flex gap-1">
                <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-blue-600/20">
                  My Tasks
                </button>
                <button className="text-slate-400 hover:text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">
                  All Tasks
                </button>
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20">
                <Plus size={14} />
                New Task
              </button>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="flex gap-6 h-full">
            <TaskColumn
              title="To Do"
              count={5}
              tasks={tasks.todo}
              color="bg-slate-400"
            />
            <TaskColumn
              title="In Progress"
              count={3}
              tasks={tasks.inProgress}
              color="bg-blue-500"
            />
            <TaskColumn
              title="Review"
              count={2}
              tasks={tasks.review}
              color="bg-amber-500"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
