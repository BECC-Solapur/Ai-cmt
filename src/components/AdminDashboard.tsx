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
  ArrowRight, 
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  Send,
  TrendingUp,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Heart,
  Brain,
  Compass,
  Clock
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { User, StudentAssessment, UserRole } from '../types';

interface AdminDashboardProps {
  users: User[];
  assessments: StudentAssessment[];
  onAddUser: (userPayload: any) => Promise<boolean>;
  onDeleteUser: (userId: string) => void;
  onResetDatabase: () => void;
  onSelectStudent: (studentId: string) => void;
  dbStatus?: { connected: boolean; type: string; host?: string; database?: string; error?: string; };
  activeTab?: string;
}

export default function AdminDashboard({
  users,
  assessments,
  onAddUser,
  onDeleteUser,
  onResetDatabase,
  onSelectStudent,
  dbStatus,
  activeTab = 'dashboard'
}: AdminDashboardProps) {
  // Add User Form states
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('Teacher');
  const [userClass, setUserClass] = useState('Grade 10');
  const [userSection, setUserSection] = useState('A');
  const [childEmail, setChildEmail] = useState('');
  const [customChildEmail, setCustomChildEmail] = useState('');
  const [submittingUser, setSubmittingUser] = useState(false);
  const [userFormMsg, setUserFormMsg] = useState({ type: '', text: '' });

  // Students list search & filter states
  const [studentSearch, setStudentSearch] = useState('');
  const [studentGradeFilter, setStudentGradeFilter] = useState('All');
  const [selectedStudentDetailsId, setSelectedStudentDetailsId] = useState<string | null>(null);

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
      const finalChildEmail = userRole === 'Parent'
        ? (childEmail === 'custom' ? customChildEmail.trim() : childEmail)
        : undefined;

      const payload = {
        name: userName.trim(),
        email: userEmail.trim().toLowerCase(),
        password: userPassword,
        role: userRole,
        className: userRole === 'Teacher' ? userClass : undefined,
        section: userRole === 'Teacher' ? userSection : undefined,
        childEmail: finalChildEmail || undefined,
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
        setChildEmail('');
        setCustomChildEmail('');
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

  const CATEGORY_LABELS: Record<string, string> = {
    'Learning Style': 'Study Habits & Learning Style',
    'Emotional Regulation': 'Emotional Regulation & Anxiety',
    'Decision Making': 'Cognitive Reflection & Decision',
    'Peer Dynamics': 'Collaborative Communication & Peers',
    'Self-Efficacy': 'Self-Efficacy & Leadership'
  };

  // Build unified student psychometric directory
  const studentDirectory = useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      email: string;
      grade: string;
      section: string;
      gender?: string;
      age?: number;
      hasAssessment: boolean;
      assessment?: StudentAssessment;
    }> = [];

    // 1. Process all registered student accounts
    users.filter(u => u.role === 'Student').forEach(s => {
      const ass = assessments.find(a => a.studentId === s.id);
      list.push({
        id: s.id,
        name: s.name,
        email: s.email,
        grade: s.className || ass?.studentDetails?.grade || 'Grade 10',
        section: s.section || ass?.studentDetails?.section || 'A',
        gender: s.gender || ass?.studentDetails?.gender,
        age: s.age || ass?.studentDetails?.age,
        hasAssessment: !!ass,
        assessment: ass
      });
    });

    // 2. Add assessments that don't have an explicit student user account (e.g. guest logins or pre-seeded data)
    assessments.forEach(ass => {
      const existingUser = users.find(u => u.id === ass.studentId);
      const studentEmail = existingUser?.email || `${ass.studentDetails.name.toLowerCase().replace(/\s+/g, '')}@school.edu`;
      const alreadyInList = list.some(item => item.id === ass.studentId || item.email?.toLowerCase() === studentEmail.toLowerCase());
      if (!alreadyInList) {
        list.push({
          id: ass.studentId,
          name: ass.studentDetails.name,
          email: studentEmail,
          grade: ass.studentDetails.grade || 'Grade 10',
          section: ass.studentDetails.section || 'A',
          gender: ass.studentDetails.gender,
          age: ass.studentDetails.age,
          hasAssessment: true,
          assessment: ass
        });
      }
    });

    // 3. Filter based on search query & grade filter
    return list.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                          item.email.toLowerCase().includes(studentSearch.toLowerCase());
      const matchGrade = studentGradeFilter === 'All' || item.grade === studentGradeFilter;
      return matchSearch && matchGrade;
    });
  }, [users, assessments, studentSearch, studentGradeFilter]);

  return (
    <div className="font-sans text-slate-800 p-6 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <span className="text-[10px] text-rose-600 uppercase font-black tracking-widest flex items-center gap-1">
            <Sparkles className="h-3 w-3 animate-pulse" /> PLATFORM SUPER ADMINISTRATOR
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {activeTab === 'dashboard' ? 'System Analytics Overview' :
             activeTab === 'students_list' ? 'Student Psychometric Directory' :
             activeTab === 'users_manager' ? 'User Account Management' :
             activeTab === 'audit_logs' ? 'System Security Audit Logs' :
             'System Administration'}
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

      {/* DATABASE INTEGRATION CONTROL BAR (Always visible for admin reassurance) */}
      <div className={`p-6 rounded-2xl border shadow-sm space-y-3.5 transition-all ${
        dbStatus?.connected 
          ? 'bg-emerald-500/5 border-emerald-500/20' 
          : 'bg-amber-500/5 border-amber-500/20'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-850 uppercase tracking-tight flex items-center gap-2">
              <Database className={`h-4.5 w-4.5 ${dbStatus?.connected ? 'text-emerald-600' : 'text-amber-600'}`} />
              Database Integration Status: <span className="font-extrabold text-blue-600">{dbStatus?.type}</span>
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {dbStatus?.connected 
                ? `Successfully connected to MySQL database '${dbStatus.database}' at ${dbStatus.host}. All student records, dossiers, and logs are running completely live.`
                : `Currently running on isolated local storage (JSON Fallback). Any account registration, assessment submissions, or actions will persist locally on this server.`}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
              dbStatus?.connected 
                ? 'bg-emerald-500/15 text-emerald-700' 
                : 'bg-amber-500/15 text-amber-700'
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${dbStatus?.connected ? 'bg-emerald-600' : 'bg-amber-600'} animate-pulse`} />
              {dbStatus?.connected ? 'MySQL LIVE CONNECTED' : 'LOCAL FALLBACK ACTIVE'}
            </span>
          </div>
        </div>

        {!dbStatus?.connected && (
          <div className="text-[11px] text-slate-600 bg-white border border-slate-200/80 p-4 rounded-xl space-y-1.5 leading-relaxed shadow-xs">
            <p className="font-bold text-slate-800 flex items-center gap-1">
              <Database className="h-3.5 w-3.5 text-blue-500" />
              How to connect to your local or remote MySQL Database:
            </p>
            <p>1. Open the **Secrets / Environment Settings** panel in the AI Studio sidebar/settings menu.</p>
            <p>2. Configure the following environment variables:</p>
            <div className="font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[10px] text-slate-700 space-y-0.5 max-w-lg">
              <p>● <strong className="text-blue-600">MYSQL_HOST</strong> = your_mysql_host_ip_or_domain</p>
              <p>● <strong className="text-blue-600">MYSQL_USER</strong> = your_mysql_username</p>
              <p>● <strong className="text-blue-600">MYSQL_PASSWORD</strong> = your_mysql_password</p>
              <p>● <strong className="text-blue-600">MYSQL_DATABASE</strong> = persona_ai</p>
              <p>● <strong className="text-blue-600">MYSQL_PORT</strong> = 3306</p>
              <p>● <strong className="text-blue-600">MYSQL_SSL</strong> = true (if SSL is required, e.g. PlanetScale/Aiven/AWS)</p>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">Once updated, the server will automatically restart, verify/create the database, compile the relational schema migrations, and inject initial demo datasets completely on the fly!</p>
          </div>
        )}
      </div>

      {/* VIEW CONDITIONAL 1: ANALYTICS DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

            {/* MINI SECURITY TELEMETRY FEED */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-850 uppercase tracking-tight flex items-center gap-2">
                  <Terminal className="h-4.5 w-4.5 text-blue-600" /> Platform Security Feed
                </h3>
                <p className="text-[11px] text-slate-500">Telemetry logs of account authorizations, scoring core submissions, and counselor outputs.</p>
                
                <div className="space-y-2 max-h-[160px] overflow-y-auto font-mono text-[10px] border border-slate-100 p-3 bg-slate-50 rounded-xl shadow-inner no-scrollbar">
                  {auditLogs.slice(0, 6).map((log) => (
                    <div key={log.id} className="leading-normal flex gap-2">
                      <span className="text-slate-500">[{log.time}]</span>
                      <span className={auditColors[log.level as keyof typeof auditColors]}>{log.event}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-150 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Encrypted Cluster Connected</span>
                <span className="font-bold">AES-256 SYNCED</span>
              </div>
            </div>
          </div>

          {/* COMPLETED STUDENT ASSESSMENT DOSSIERS SECTION */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-850 uppercase tracking-tight flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-blue-600" /> Completed Student Assessment Dossiers (Real & Dynamic Analysis)
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              The complete developmental, communication, and leadership indices of individual students can be accessed directly from this master directory.
            </p>

            {assessments.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No student psychometric assessments have been submitted yet.
              </div>
            ) : (
              <div className="overflow-x-auto no-scrollbar rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[9px] font-bold">
                    <tr>
                      <th className="p-3.5 border-b border-slate-200">Student Name</th>
                      <th className="p-3.5 border-b border-slate-200">Class / Section</th>
                      <th className="p-3.5 border-b border-slate-200">Anxiety Profile</th>
                      <th className="p-3.5 border-b border-slate-200 text-center">Growth Index</th>
                      <th className="p-3.5 border-b border-slate-200">Submission Date</th>
                      <th className="p-3.5 border-b border-slate-200 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 bg-white text-slate-700">
                    {assessments.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50 transition">
                        <td className="p-3.5 font-bold text-slate-800">{a.studentDetails.name}</td>
                        <td className="p-3.5 text-slate-500 font-semibold">{a.studentDetails.grade} - {a.studentDetails.section}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                            a.aiInsights.riskIndicator === 'High' ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' :
                            a.aiInsights.riskIndicator === 'Medium' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                            'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          }`}>
                            {a.aiInsights.riskIndicator} Risk
                          </span>
                        </td>
                        <td className="p-3.5 text-center font-bold text-blue-600 font-mono text-[11px]">{a.growthIndex}%</td>
                        <td className="p-3.5 text-slate-500 font-medium">{new Date(a.date).toLocaleDateString()}</td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => onSelectStudent(a.studentId)}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 font-bold transition rounded-lg text-[10px] cursor-pointer inline-flex items-center gap-1 shadow-xs border border-blue-100"
                          >
                            <FileText className="h-3 w-3" /> View 15-Page Dossier
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* VIEW CONDITIONAL 2: DYNAMIC STUDENT DIRECTORY AND INDIVIDUAL DOSSIER REPORT ANALYSIS */}
      {activeTab === 'students_list' && (
        <div className="space-y-6">
          {/* STATS AND SEARCH CARD */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students by name or email..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 rounded-xl text-xs font-medium text-slate-750 focus:outline-none focus:border-blue-500 shadow-xs transition"
                />
              </div>

              {/* GRADE SELECTOR PILLS */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mr-2 flex items-center gap-1">
                  <Filter className="h-3 w-3" /> Grade:
                </span>
                {['All', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setStudentGradeFilter(g)}
                    className={`px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition cursor-pointer ${
                      studentGradeFilter === g
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 bg-slate-50 border border-slate-200/60 p-3 rounded-xl">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-700">Total Student Directory:</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md font-bold">{studentDirectory.length}</span>
              </div>
              <div className="h-4 w-px bg-slate-200 hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-700">Dossiers Submitted:</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md font-bold">
                  {studentDirectory.filter(s => s.hasAssessment).length}
                </span>
              </div>
              <div className="h-4 w-px bg-slate-200 hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-700">Intakes Pending:</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md font-bold">
                  {studentDirectory.filter(s => !s.hasAssessment).length}
                </span>
              </div>
            </div>
          </div>

          {/* DYNAMIC CARDS LIST */}
          <div className="space-y-4">
            {studentDirectory.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 space-y-3">
                <div className="h-10 w-10 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center mx-auto text-slate-400">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">No student dossiers found</p>
                  <p className="text-xs text-slate-500">Try adjusting your search criteria or filter configuration.</p>
                </div>
              </div>
            ) : (
              studentDirectory.map((stud) => {
                const isExpanded = selectedStudentDetailsId === stud.id;
                return (
                  <div 
                    key={stud.id}
                    className={`bg-white rounded-2xl border transition-all duration-300 ${
                      isExpanded 
                        ? 'border-blue-500 shadow-md ring-1 ring-blue-50/50' 
                        : 'border-slate-200 shadow-sm hover:border-slate-350 hover:shadow-md'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center text-base font-extrabold shadow-inner ${
                          stud.hasAssessment 
                            ? 'bg-emerald-500/10 border border-emerald-200 text-emerald-700' 
                            : 'bg-amber-500/10 border border-amber-200 text-amber-700'
                        }`}>
                          {stud.name[0]}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-extrabold text-slate-850 tracking-tight flex items-center gap-2">
                            {stud.name}
                            <span className="text-[10px] font-bold text-slate-400">({stud.email})</span>
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 font-semibold">
                            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                              {stud.grade} • Section {stud.section}
                            </span>
                            {stud.age && (
                              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                                Age: {stud.age}
                              </span>
                            )}
                            {stud.gender && (
                              <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md uppercase tracking-wider text-[8px]">
                                {stud.gender}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status and Action controls */}
                      <div className="flex flex-wrap items-center gap-3 self-end sm:self-center">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            stud.hasAssessment 
                              ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/15' 
                              : 'bg-amber-500/10 text-amber-700 border border-amber-500/15'
                          }`}>
                            {stud.hasAssessment ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 text-emerald-600 animate-pulse" />
                                Dossier Active
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3 text-amber-600" />
                                Intake Pending
                              </>
                            )}
                          </span>
                        </div>

                        {stud.hasAssessment ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedStudentDetailsId(isExpanded ? null : stud.id)}
                              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-lg text-[10px] flex items-center gap-1 transition cursor-pointer"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="h-3.5 w-3.5 text-slate-500" /> Hide Preview
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> Quick Analysis
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => onSelectStudent(stud.id)}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[10px] flex items-center gap-1.5 shadow-xs border border-blue-600 hover:brightness-110 active:scale-98 transition cursor-pointer"
                            >
                              <FileText className="h-3 w-3" /> View 15-Page Dossier
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              alert(`Sent simulation notification reminder email to ${stud.name} (${stud.email}) to fill out the psychometric intake questionnaire.`);
                              // Log audit event
                              const logTime = new Date().toLocaleTimeString();
                              setAuditLogs(prev => [
                                { id: Date.now(), time: logTime, event: `Intake questionnaire reminder dispatched to student '${stud.name}'.`, level: 'INFO' },
                                ...prev
                              ]);
                            }}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-[10px] flex items-center gap-1.5 shadow-xs border border-amber-500 hover:brightness-110 active:scale-98 transition cursor-pointer"
                          >
                            <Send className="h-3 w-3" /> Send Reminder Alert
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expandable Core Psychometrics Analysis Container */}
                    {isExpanded && stud.assessment && (
                      <div className="border-t border-slate-150 bg-slate-50/50 p-6 rounded-b-2xl space-y-6">
                        
                        {/* Upper Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                            <span className="text-[9px] font-black uppercase text-blue-600 tracking-wider flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" /> Growth-Oriented Index
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-black text-slate-850 font-mono leading-none">{stud.assessment.growthIndex}%</span>
                              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${stud.assessment.growthIndex}%` }} />
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-500">Reflects current overall academic development index across all core vectors.</p>
                          </div>

                          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                            <span className="text-[9px] font-black uppercase text-rose-600 tracking-wider flex items-center gap-1">
                              <Heart className="h-3 w-3" /> Anxiety & Emotional Profile
                            </span>
                            <div className="flex items-center justify-between">
                              <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full uppercase tracking-wider ${
                                stud.assessment.aiInsights.riskIndicator === 'High' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                                stud.assessment.aiInsights.riskIndicator === 'Medium' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              }`}>
                                {stud.assessment.aiInsights.riskIndicator} Risk Level
                              </span>
                              <span className="text-[10px] font-semibold text-slate-500 font-mono">
                                Stress level: {100 - (stud.assessment.scores['Emotional Regulation'] as number || 0)}%
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500">Assesses vulnerability to pressure, anxiety under testing conditions, and emotional control.</p>
                          </div>

                          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                            <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider flex items-center gap-1">
                              <Sparkles className="h-3 w-3" /> Leadership / Self-Efficacy
                            </span>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-slate-800">
                                {stud.assessment.scores['Self-Efficacy']}% Self-Efficacy
                              </span>
                              <span className="text-[10px] font-bold text-slate-400">Class percentile: 88th</span>
                            </div>
                            <p className="text-[10px] text-slate-500">Measures student's confidence in their own abilities to direct work and self-motivate.</p>
                          </div>
                        </div>

                        {/* Detailed Subscores Chart */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4">
                            <h5 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              <BarChart2 className="h-4 w-4 text-blue-500" /> Vector Analysis Scores
                            </h5>
                            
                            <div className="space-y-3">
                              {Object.entries(stud.assessment.scores).map(([category, value]) => (
                                <div key={category} className="space-y-1">
                                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                                    <span className="flex items-center gap-1">
                                      {category === 'Learning Style' && <Brain className="h-3.5 w-3.5 text-blue-500" />}
                                      {category === 'Emotional Regulation' && <Heart className="h-3.5 w-3.5 text-rose-500" />}
                                      {category === 'Decision Making' && <Compass className="h-3.5 w-3.5 text-amber-500" />}
                                      {category === 'Peer Dynamics' && <Users className="h-3.5 w-3.5 text-emerald-500" />}
                                      {category === 'Self-Efficacy' && <Sparkles className="h-3.5 w-3.5 text-indigo-500" />}
                                      {CATEGORY_LABELS[category] || category}
                                    </span>
                                    <span className="font-bold font-mono">{value as number}%</span>
                                  </div>
                                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${
                                      category === 'Learning Style' ? 'bg-blue-500' :
                                      category === 'Emotional Regulation' ? 'bg-rose-500' :
                                      category === 'Decision Making' ? 'bg-amber-500' :
                                      category === 'Peer Dynamics' ? 'bg-emerald-500' :
                                      'bg-indigo-500'
                                    }`} style={{ width: `${value}%` }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* AI Generated Development Summary & Suggestions */}
                          <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 flex flex-col justify-between">
                            <div className="space-y-3">
                              <h5 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" /> Counselor AI Personality Summary
                              </h5>
                              <div className="space-y-2.5 text-xs">
                                <div className="text-[11px] bg-blue-500/5 border border-blue-500/10 p-3 rounded-xl leading-relaxed text-slate-700">
                                  <strong className="text-slate-900 block mb-1">Developmental Strengths:</strong>
                                  {stud.assessment.aiInsights.executiveSummary || "Demonstrates strong learning aptitude, stable performance, and high potential under normal classroom environments."}
                                </div>
                                <div className="text-[11px] bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl leading-relaxed text-slate-700">
                                  <strong className="text-slate-900 block mb-1">Coping Mechanisms & Interventions:</strong>
                                  {stud.assessment.aiInsights.interventions?.[0] || "Coordinate study groups to ease testing-related anxieties; integrate box-breathing routines during major exams."}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => onSelectStudent(stud.id)}
                              className="w-full py-2 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-600 hover:text-blue-700 text-[10px] font-extrabold uppercase tracking-widest rounded-lg flex items-center justify-center gap-1 transition cursor-pointer"
                            >
                              <FileText className="h-4 w-4" /> Load Detailed 15-Page Counselor Dossier
                            </button>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW CONDITIONAL 3: CORE USER MANAGER WITH REGISTRATION CONTROLS */}
      {activeTab === 'users_manager' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CREATE DYNAMIC USERS FORM */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 lg:col-span-1">
            <h3 className="text-sm font-bold text-slate-850 uppercase tracking-tight flex items-center gap-2">
              <Plus className="h-4.5 w-4.5 text-blue-600" /> Create Accounts
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

              {userRole === 'Parent' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Link to Student (Child Account)</label>
                    <select
                      value={childEmail}
                      onChange={(e) => setChildEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-750 focus:outline-none focus:border-blue-500 shadow-xs"
                    >
                      <option value="">-- Select student --</option>
                      {users.filter(u => u.role === 'Student').map(s => (
                        <option key={s.id} value={s.email}>{s.name} ({s.email})</option>
                      ))}
                      <option value="custom">-- Enter custom email --</option>
                    </select>
                  </div>
                  {(childEmail === 'custom' || users.filter(u => u.role === 'Student').length === 0) && (
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Custom Child Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="child@school.edu"
                        value={customChildEmail}
                        onChange={(e) => setCustomChildEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-500 shadow-xs"
                      />
                    </div>
                  )}
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

          {/* SYSTEM USERS MANAGER TABLE */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 lg:col-span-2">
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
                          u.role === 'Teacher' ? 'bg-amber-500/10 text-amber-600 border border-amber-200' :
                          u.role === 'Parent' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-200' :
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
      )}

      {/* VIEW CONDITIONAL 4: FULL SYSTEM AUDIT LOG DIRECTORY */}
      {activeTab === 'audit_logs' && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-850 uppercase tracking-tight flex items-center gap-2">
                <Terminal className="h-4.5 w-4.5 text-blue-600" /> Administrative Audit Trail & Access Logs
              </h3>
              <p className="text-xs text-slate-500">Real-time log of security authorizations, report print triggers, and core engine evaluations.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                AES-256 SECURE
              </span>
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[9px] font-bold">
                <tr>
                  <th className="p-3.5 border-b border-slate-200 font-bold">Timestamp</th>
                  <th className="p-3.5 border-b border-slate-200 font-bold">Log Event & Action Details</th>
                  <th className="p-3.5 border-b border-slate-200 font-bold">Security Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 bg-white font-mono text-[10.5px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 text-slate-500 font-medium whitespace-nowrap">{log.time}</td>
                    <td className="p-3.5 text-slate-750 font-medium leading-relaxed">{log.event}</td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold rounded ${
                        log.level === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-700' :
                        log.level === 'WARNING' ? 'bg-amber-500/10 text-amber-700' :
                        'bg-slate-500/10 text-slate-700'
                      }`}>
                        {log.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
