/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  UserSquare, 
  ShieldCheck, 
  LogOut, 
  Moon, 
  Sun, 
  Database, 
  BookOpen,
  ArrowRightLeft
} from 'lucide-react';
import { UserRole, User } from '../types';

interface SidebarProps {
  user: User | null;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onQuickLogin: (role: UserRole) => void;
  onResetDatabase: () => void;
}

export default function Sidebar({
  user,
  currentTab,
  setCurrentTab,
  onLogout,
  darkMode,
  setDarkMode,
  onQuickLogin,
  onResetDatabase
}: SidebarProps) {
  if (!user) return null;

  const role = user.role;

  // Get tabs based on role
  const getTabs = () => {
    switch (role) {
      case 'Student':
        return [
          { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
          { id: 'assessment', label: 'Take Assessment', icon: ClipboardList },
        ];
      case 'Teacher':
        return [
          { id: 'dashboard', label: 'Class Analytics', icon: LayoutDashboard },
          { id: 'students_list', label: 'Student Cohorts', icon: Users },
        ];
      case 'Parent':
        return [
          { id: 'dashboard', label: 'Child Progress', icon: UserSquare },
        ];
      case 'Admin':
        return [
          { id: 'dashboard', label: 'System Analytics', icon: LayoutDashboard },
          { id: 'students_list', label: 'Students', icon: Users },
          { id: 'users_manager', label: 'User Manager', icon: Users },
          { id: 'audit_logs', label: 'System Logs', icon: ShieldCheck },
        ];
      default:
        return [];
    }
  };

  const tabs = getTabs();

  return (
    <aside id="sidebar-nav" className="no-print w-64 bg-white text-slate-700 flex flex-col fixed h-screen z-20 left-0 top-0 border-r border-slate-200/80 shadow-xs">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
          <BookOpen className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="text-slate-900 font-bold text-lg tracking-tight">PersonaAI</span>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
            Growth Analytics
          </p>
        </div>
      </div>

      {/* User Card */}
      <div className="p-4 mx-4 mb-4 rounded-xl border border-slate-200 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-blue-600 text-base shadow-sm">
            {user.name[0]}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-slate-800 truncate">{user.name}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded uppercase tracking-wider ${
                role === 'Admin' ? 'bg-rose-500/10 text-rose-600 border border-rose-200' :
                role === 'Teacher' ? 'bg-amber-500/10 text-amber-600 border border-amber-200' :
                role === 'Parent' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-200' :
                'bg-blue-500/10 text-blue-600 border border-blue-200'
              }`}>
                {role}
              </span>
              {user.className && (
                <span className="text-[9px] text-slate-400 font-mono">
                  {user.className}-{user.section || 'A'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
        <div className="text-slate-400 text-[9px] uppercase font-bold tracking-widest mb-3 px-2">Main Console</div>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-450'}`} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Core Options / Settings */}
      <div className="p-4 space-y-2 border-t border-slate-150">
        {/* Database Reset Option */}
        <button
          onClick={() => {
            if (window.confirm('Reset local sandbox database to pre-seeded enterprise cohort?')) {
              onResetDatabase();
            }
          }}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-750 rounded-xl transition-all duration-200"
        >
          <Database className="h-4 w-4 text-slate-400" />
          Reset Cohort Data
        </button>

        {/* Dynamic Role Switch Helper */}
        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-150 space-y-1.5">
          <p className="text-[9px] font-bold text-slate-450 uppercase tracking-widest flex items-center gap-1">
            <ArrowRightLeft className="h-3 w-3 text-slate-400" /> DEMO QUICK-SWITCH
          </p>
          <div className="grid grid-cols-2 gap-1 text-[10px]">
            <button
              onClick={() => onQuickLogin('Student')}
              className="px-1.5 py-1 bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100/80 rounded text-center transition-all"
            >
              Student
            </button>
            <button
              onClick={() => onQuickLogin('Teacher')}
              className="px-1.5 py-1 bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100/85 rounded text-center transition-all"
            >
              Teacher
            </button>
            <button
              onClick={() => onQuickLogin('Parent')}
              className="px-1.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100/85 rounded text-center transition-all"
            >
              Parent
            </button>
            <button
              onClick={() => onQuickLogin('Admin')}
              className="px-1.5 py-1 bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100/85 rounded text-center transition-all"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rose-650 hover:bg-rose-50 rounded-xl transition-all duration-300"
        >
          <LogOut className="h-4.5 w-4.5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
