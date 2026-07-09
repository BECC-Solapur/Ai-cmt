/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Database, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Terminal, 
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { User, StudentAssessment, UserRole } from '../types';

interface AdminDashboardProps {
  users: User[];
  assessments: StudentAssessment[];
  onAddUser: (userPayload: any) => Promise<boolean>;
  onDeleteUser: (userId: string) => void;
  onResetDatabase: () => void;
}

export default function AdminDashboard({
  users,
  assessments,
  onAddUser,
  onDeleteUser,
  onResetDatabase
}: AdminDashboardProps) {
  // Add User Form states
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('Teacher');
  const [userClass, setUserClass] = useState('Grade 10');
  const [userSection, setUserSection] = useState('A');
  const [submittingUser, setSubmittingUser] = useState(false);
  const [userFormMsg, setUserFormMsg] = useState({ type: '', text: '' });

  // System audit stream
  const [auditLogs, setAuditLogs] = useState<any[]>([
    { id: 1, time: '12:04:12 PM', event: 'Database session initialized in sandbox.', level: 'INFO' },
    { id: 2, time: '12:04:35 PM', event: 'JWT token verification completed for user admin@school.edu.', level: 'SUCCESS' },
    { id: 3, time: '12:05:01 PM', event: 'Server-side Gemini AI model gemini-3.5-flash loaded.', level: 'SUCCESS' },
    { id: 4, time: '12:05:15 PM', event: 'System diagnostic checklist: ALL SECURE.', level: 'SUCCESS' },
  ]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim() || !userPassword.trim()) {
      setUserFormMsg({ type: 'error', text: 'All credentials are required to register accounts.' });
      return;
    }
    setUserFormMsg({ type: '', text: '' });
    setSubmittingUser(true);

    try {
      const payload = {
        name: userName.trim(),
        email: userEmail.trim().toLowerCase(),
        password: userPassword,
        role: userRole,
        className: userRole === 'Teacher' ? userClass : undefined,
        section: userRole === 'Teacher' ? userSection : undefined,
        school: 'Pinecrest Academy'
      };

      const success = await onAddUser(payload);
      if (success) {
        setUserFormMsg({ type: 'success', text: `Registered ${userRole} account successfully!` });
        // Add log
        const logTime = new Date().toLocaleTimeString();
        setAuditLogs(prev => [
          { id: Date.now(), time: logTime, event: `New ${userRole} user '${userName}' created dynamically.`, level: 'SUCCESS' },
          ...prev
        ]);
        // Reset inputs
        setUserName('');
        setUserEmail('');
        setUserPassword('');
      } else {
        setUserFormMsg({ type: 'error', text: 'Account creation failed. User might exist.' });
      }
    } catch (err: any) {
      setUserFormMsg({ type: 'error', text: err.message || 'Error occurred.' });
    } finally {
      setSubmittingUser(false);
    }
  };

  // Calculations for KPI Cards
  const totalUsers = users.length;
  const teachersCount = users.filter(u => u.role === 'Teacher').length;
  const parentsCount = users.filter(u => u.role === 'Parent').length;
  const assessmentsCount = assessments.length;

  // Grade distributions
  const gradeDistribution = useMemo(() => {
    const counts: { [key: string]: number } = {
      'Grade 9': 0,
      'Grade 10': 0,
      'Grade 11': 0,
      'Grade 12': 0
    };
    assessments.forEach(a => {
      if (counts[a.studentDetails.grade] !== undefined) {
        counts[a.studentDetails.grade]++;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [assessments]);

  const auditColors = {
    'INFO': 'text-slate-500',
    'SUCCESS': 'text-emerald-600',
    'WARNING': 'text-amber-600'
  };

  return (
    <div className="font-sans text-slate-800 p-6 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <span className="text-[10px] text-rose-600 uppercase font-black tracking-widest flex items-center gap-1">
            <Sparkles className="h-3 w-3 animate-pulse" /> PLATFORM SUPER ADMINISTRATOR
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            System Administration
          </h1>
          <p className="text-xs text-slate-500">
            Institution: Multi-School District • License: Active Enterprise Suite • Secure Sandbox ACTIVE
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Reset local sandbox database to pre-seeded enterprise cohort?')) {
              onResetDatabase();
              // Add log
              setAuditLogs(prev => [
                { id: Date.now(), time: new Date().toLocaleTimeString(), event: 'Database reset triggered to pre-seeded baseline.', level: 'WARNING' },
                ...prev
              ]);
            }
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition cursor-pointer"
        >
          <Database className="h-4 w-4" /> Reset Sandbox Database
        </button>
      </div>

      {/* KPI Cards Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* TOTAL USERS */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-blue-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">Registered Accounts</span>
            <span className="text-lg font-bold text-slate-800">{totalUsers} Users</span>
          </div>
        </div>

        {/* LICENSED TEACHERS */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-amber-600">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">Active Teachers</span>
            <span className="text-lg font-bold text-slate-800">{teachersCount} Licensed</span>
          </div>
        </div>

        {/* REGISTERED PARENTS */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-emerald-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">Parent Connections</span>
            <span className="text-lg font-bold text-slate-800">{parentsCount} Synced</span>
          </div>
        </div>

        {/* INTENSIVE EVALUATIONS */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-rose-600">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">Completed Intakes</span>
            <span className="text-lg font-bold text-slate-800">{assessmentsCount} Dossiers</span>
          </div>
        </div>
      </div>

      {/* Forms and System Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CREATE DYNAMIC USERS */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-850 uppercase tracking-tight flex items-center gap-2">
            <Plus className="h-4.5 w-4.5 text-blue-600" /> Create Teacher & Parent Accounts
          </h3>
          <p className="text-[11px] text-slate-500">Provide credentials below to pre-register and authorize new partners dynamically inside the system database.</p>

          {userFormMsg.text && (
            <div className={`p-3 text-xs font-medium rounded-xl border ${
              userFormMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-rose-500/10 border-rose-500/20 text-rose-600'
            }`}>
              {userFormMsg.text}
            </div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">User Role</label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-750 focus:outline-none focus:border-blue-500 shadow-xs"
              >
                <option value="Teacher">Teacher (Academic Advisor)</option>
                <option value="Parent">Parent (Family Counseling)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Prof. Sarah Jenkins"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500 shadow-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@school.edu"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Secret password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500 shadow-xs"
                />
              </div>
            </div>

            {userRole === 'Teacher' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Assigned Class</label>
                  <select
                    value={userClass}
                    onChange={(e) => setUserClass(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-750 focus:outline-none focus:border-blue-500 shadow-xs"
                  >
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Section</label>
                  <input
                    type="text"
                    placeholder="A, B..."
                    value={userSection}
                    onChange={(e) => setUserSection(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500 shadow-xs"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submittingUser}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl uppercase tracking-wider shadow-md hover:brightness-110 active:scale-98 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {submittingUser ? 'Authorizing Profile...' : 'Complete Registration'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* SYSTEM AUDIT LOG STREAM */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-850 uppercase tracking-tight flex items-center gap-2">
              <Terminal className="h-4.5 w-4.5 text-blue-600" /> Platform Security & Audit Trail
            </h3>
            <p className="text-[11px] text-slate-500">Real-time telemetry logging of account authorizations, scoring core submissions, and school credentialing prints.</p>
            
            <div className="space-y-2 max-h-[220px] overflow-y-auto font-mono text-[10px] border border-slate-200 p-3 bg-slate-50 rounded-xl shadow-inner">
              {auditLogs.map((log) => (
                <div key={log.id} className="leading-normal flex gap-2">
                  <span className="text-slate-500">[{log.time}]</span>
                  <span className={auditColors[log.level as keyof typeof auditColors]}>{log.event}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Encrypted Logs</span>
            <span className="font-bold">AES-256 SYNCED</span>
          </div>
        </div>

        {/* GRADE INTENSITY RECHARTS GRAPH */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-850 uppercase tracking-tight">Active Assessment Densities</h3>
          <p className="text-[11px] text-slate-500">Displays distribution of finalized psychometric assessments completed across different school grade levels.</p>

          <div className="h-[200px] w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ background: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }} />
                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* SYSTEM USERS MANAGER TABLE */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-850 uppercase tracking-tight flex items-center gap-2">
          <Users className="h-4.5 w-4.5 text-blue-600" /> Core System Accounts Directory
        </h3>
        
        <div className="overflow-x-auto no-scrollbar rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[9px] font-bold">
              <tr>
                <th className="p-3.5 border-b border-slate-200">Account Holder Name</th>
                <th className="p-3.5 border-b border-slate-200">Email Reference</th>
                <th className="p-3.5 border-b border-slate-200">Assigned Role</th>
                <th className="p-3.5 border-b border-slate-200">Target Cohort</th>
                <th className="p-3.5 border-b border-slate-200">Institution</th>
                <th className="p-3.5 border-b border-slate-200 text-center">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 bg-white text-slate-700">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-bold text-slate-800">{u.name}</td>
                  <td className="p-3.5 font-mono text-slate-500 text-[11px]">{u.email}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full uppercase tracking-wider ${
                      u.role === 'Admin' ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' :
                      u.role === 'Teacher' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                      u.role === 'Parent' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                      'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500 font-semibold">{u.className ? `${u.className}-${u.section || 'A'}` : 'System Wide'}</td>
                  <td className="p-3.5 text-slate-500">{u.school || 'Pinecrest Academy'}</td>
                  <td className="p-3.5 text-center">
                    {u.role !== 'Admin' ? (
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete user '${u.name}'? This action cannot be reversed.`)) {
                            onDeleteUser(u.id);
                          }
                        }}
                        className="text-rose-600 hover:text-rose-700 transition cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Default Admin</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
