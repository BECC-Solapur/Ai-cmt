/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  BookOpen, 
  ChevronRight, 
  User, 
  Award,
  Users2,
  ShieldAlert
} from 'lucide-react';
import { UserRole } from '../types';

interface LoginProps {
  onLoginSuccess: (token: string, user: any) => void;
  onStudentStart: (studentDetails: any) => void;
  onResetDatabase: () => void;
}

export default function Login({ onLoginSuccess, onStudentStart, onResetDatabase }: LoginProps) {
  const [activeTab, setActiveTab] = useState<'portal' | 'student-entry'>('student-entry');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Student details state
  const [studentName, setStudentName] = useState('');
  const [studentAge, setStudentAge] = useState('');
  const [studentGender, setStudentGender] = useState('Male');
  const [studentGrade, setStudentGrade] = useState('Grade 10');
  const [studentSection, setStudentSection] = useState('A');
  const [studentEmail, setStudentEmail] = useState('');

  const handlePortalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      onLoginSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to the login server.');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentAge) {
      setError('Name and Age are required to build your personalized psychometric index.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: studentName,
          age: studentAge,
          gender: studentGender,
          grade: studentGrade,
          section: studentSection,
          email: studentEmail
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Student registration failed.');
      }

      // Keep token + user on parent App context, but immediately direct them to assessment questionnaire
      onStudentStart({
        token: data.token,
        user: data.user
      });
    } catch (err: any) {
      setError(err.message || 'Unable to launch assessment.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickLogin = (role: UserRole) => {
    if (role === 'Admin') {
      setEmail('admin@school.edu');
      setPassword('admin');
    } else if (role === 'Teacher') {
      setEmail('teacher@school.edu');
      setPassword('teacher');
    } else if (role === 'Parent') {
      setEmail('parent@school.edu');
      setPassword('parent');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-300">
      {/* Visual background blob assets */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 dark:bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/5 dark:bg-indigo-600/10 blur-[120px] pointer-events-none" />

      {/* Main Login Frame */}
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-md dark:shadow-2xl dark:shadow-black/60 border border-slate-200 dark:border-slate-800/80 z-10">
        {/* Banner header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 dark:from-slate-900 dark:to-slate-850 p-8 text-center relative border-b border-slate-100 dark:border-slate-800">
          <div className="absolute top-4 right-4 bg-white/10 px-3 py-1 rounded-full text-[11px] text-white/90 font-medium tracking-wide">
            v2.1 Enterprise SaaS
          </div>
          <div className="inline-flex p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-4 border border-white/10">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">PersonaAI</h1>
          <p className="text-slate-100 dark:text-slate-300 text-xs mt-1 max-w-md mx-auto">
            AI Student Personality & Psychological Growth Analytics Platform for Educational Institutions
          </p>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={() => { setActiveTab('student-entry'); setError(''); }}
            className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'student-entry'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 bg-white dark:bg-slate-900/10'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Award className="h-4 w-4" />
            Take Personality Assessment
          </button>
          <button
            onClick={() => { setActiveTab('portal'); setError(''); }}
            className={`flex-1 py-4 text-center text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'portal'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500 bg-white dark:bg-slate-900/10'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users2 className="h-4 w-4" />
            Counselor / Partner Login
          </button>
        </div>

        {/* Errors view */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <p className="text-xs text-rose-700 dark:text-rose-300 font-medium leading-relaxed">{error}</p>
          </div>
        )}

        <div className="p-8">
          {activeTab === 'student-entry' ? (
            /* Student registration intake */
            <form onSubmit={handleStudentIntakeSubmit} className="space-y-4">
              <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 mb-4">
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                  Welcome! Enter your details below to create your student record. Once completed, you will be launched into the 20-question psychological assessment wizard.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Mercer"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Age</label>
                  <input
                    type="number"
                    required
                    min="5"
                    max="25"
                    placeholder="e.g. 16"
                    value={studentAge}
                    onChange={(e) => setStudentAge(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Gender</label>
                  <select
                    value={studentGender}
                    onChange={(e) => setStudentGender(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 transition-all shadow-xs"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Grade / Class</label>
                  <select
                    value={studentGrade}
                    onChange={(e) => setStudentGrade(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 transition-all shadow-xs"
                  >
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Section</label>
                  <input
                    type="text"
                    placeholder="A, B, C..."
                    value={studentSection}
                    onChange={(e) => setStudentSection(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Email Address (Optional)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="email"
                    placeholder="e.g. student@school.com"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all shadow-xs"
                  />
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-450 mt-1 block font-medium">Used for direct login to view your results dashboard later.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Initializing Record...' : 'Begin Psychological Assessment'}
                <ChevronRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            /* Portal login for teachers/parents/admins */
            <form onSubmit={handlePortalLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Portal Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="your@school.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Secret Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all shadow-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Securing Access...' : 'Authenticate & Enter Dashboard'}
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Sandbox Quick Logins for rapid evaluation */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/85">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 text-center">
                  🔐 QUICK EVALUATION LOGIN SHORTCUTS
                </p>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <button
                    type="button"
                    onClick={() => fillQuickLogin('Admin')}
                    className="p-2.5 bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 hover:bg-rose-500/15 rounded-xl text-left transition-all cursor-pointer"
                  >
                    <p className="font-bold text-rose-600 dark:text-rose-400">Admin</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[9px] mt-0.5 truncate">admin@school.edu</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickLogin('Teacher')}
                    className="p-2.5 bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 hover:bg-amber-500/15 rounded-xl text-left transition-all cursor-pointer"
                  >
                    <p className="font-bold text-amber-600 dark:text-amber-400">Teacher</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[9px] mt-0.5 truncate">teacher@school.edu</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickLogin('Parent')}
                    className="p-2.5 bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-500/15 rounded-xl text-left transition-all cursor-pointer"
                  >
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">Parent</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[9px] mt-0.5 truncate">parent@school.edu</p>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="mt-6 text-slate-500 dark:text-slate-400 text-xs text-center leading-relaxed">
        <p>Built with enterprise-tier student psychological profiling models.</p>
        <p className="text-[10px] mt-1 text-slate-400 dark:text-slate-500">Secure AES-256 JWT sessions & role-based school audits active.</p>
      </div>
    </div>
  );
}
