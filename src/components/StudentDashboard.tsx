/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Award, 
  TrendingUp, 
  Briefcase, 
  ShieldAlert, 
  Calendar, 
  Sparkles, 
  FileText, 
  CheckCircle, 
  Activity, 
  ChevronRight,
  Send,
  Printer
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, 
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell 
} from 'recharts';
import { StudentAssessment } from '../types';
import { CATEGORY_LABELS } from '../assessmentEngine';

interface StudentDashboardProps {
  assessment: StudentAssessment | null;
  history: StudentAssessment[];
  onTakeAssessment: () => void;
  onOpenReport: () => void;
  onNotifyParent: (studentName: string, email: string) => void;
}

export default function StudentDashboard({
  assessment,
  history,
  onTakeAssessment,
  onOpenReport,
  onNotifyParent
}: StudentDashboardProps) {
  const [showCertificate, setShowCertificate] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);

  // Check if dark class exists on document
  const isDark = false;

  if (!assessment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] font-sans p-6 text-center">
        <div className="max-w-md p-8 bg-white rounded-3xl border border-slate-200 space-y-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-blue-500/5 blur-[80px] rounded-full" />
          <div className="h-14 w-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600 mx-auto shadow-sm">
            <Activity className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">No Assessment Record Found</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Unlock your personalized psychological index, professional SWOT metrics, academic risk flags, and counselor growth plans.
            </p>
          </div>
          <button
            onClick={onTakeAssessment}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 font-bold text-white text-xs uppercase tracking-wider rounded-xl shadow-sm cursor-pointer transition-colors"
          >
            Launch 20-Question MCQ Intake
          </button>
        </div>
      </div>
    );
  }

  const scores = assessment.scores;
  const ai = assessment.aiInsights;

  // Compile Recharts Data structures
  const radarData = Object.entries(scores).map(([category, val]) => ({
    subject: CATEGORY_LABELS[category] || category,
    score: val,
    fullMark: 100,
  }));

  const barData = Object.entries(scores).map(([category, val]) => ({
    name: category.split(' ')[0], // truncate name for clean axis spacing
    score: val,
  }));

  // Compiling historical growth path
  const growthPathData = [...history]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(a => ({
      date: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      growthIndex: a.growthIndex
    }));

  const pieData = [
    { name: 'Technical / Science', value: scores['Career Interest'] || 50, color: '#3b82f6' },
    { name: 'Creative / Design', value: scores['Creativity'] || 50, color: '#8b5cf6' },
    { name: 'Social / Education', value: scores['Self Awareness'] || 50, color: '#10b981' },
    { name: 'Management / Venture', value: scores['Leadership'] || 50, color: '#f59e0b' }
  ];

  const handleNotifyTrigger = () => {
    setNotifying(true);
    // Simulate API dispatch email
    setTimeout(async () => {
      try {
        await fetch('/api/notify/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentName: assessment.studentDetails.name,
            recipientEmail: 'parent@school.edu',
            subject: `Confidential Personality Analysis Report for ${assessment.studentDetails.name}`,
            type: 'Parent Automated'
          })
        });
        setNotifySuccess(true);
        onNotifyParent(assessment.studentDetails.name, 'parent@school.edu');
      } catch (e) {
        console.error(e);
      } finally {
        setNotifying(false);
      }
    }, 1200);
  };

  return (
    <div className="font-sans text-slate-800 p-6 space-y-6">
      
      {/* Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <span className="text-[10px] text-blue-600 uppercase font-black tracking-widest flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> STUDENT ACADEMIC PROFILE PORTAL
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome Back, {assessment.studentDetails.name}!
          </h1>
          <p className="text-xs text-slate-500">
            Current Cohort: {assessment.studentDetails.grade} • Section {assessment.studentDetails.section} • Pinecrest Academy
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onOpenReport}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm"
          >
            <FileText className="h-4 w-4 text-blue-600" /> View 15-Page dossier
          </button>
          
          <button
            onClick={onTakeAssessment}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer"
          >
            <Calendar className="h-4 w-4" /> Re-Take Assessment
          </button>
        </div>
      </div>

      {/* Primary KPI Card Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* GROWTH INDEX */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 relative overflow-hidden flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-full border-2 border-blue-500 flex items-center justify-center font-black text-slate-800 text-lg bg-slate-50">
            {assessment.growthIndex}%
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-blue-600 tracking-wider block">AI Growth Index</span>
            <span className="text-sm font-bold text-slate-700">Balanced Development</span>
          </div>
        </div>

        {/* PERSONALITY TYPE */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-blue-600">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">Personality Profile</span>
            <span className="text-xs font-bold text-slate-700 truncate block max-w-[130px]">{ai.personalityType}</span>
          </div>
        </div>

        {/* FUTURE READY */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-indigo-600">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">Career Interest</span>
            <span className="text-xs font-bold text-slate-700 truncate block max-w-[130px]">{ai.careerSuggestion.split(',')[0]}</span>
          </div>
        </div>

        {/* RISK PROFILE */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className={`p-3 rounded-xl border ${ai.riskIndicator === 'High' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">Anxiety Risk Flag</span>
            <span className="text-xs font-bold text-slate-700">{ai.riskIndicator} Risk Level</span>
          </div>
        </div>
      </div>

      {/* Sub-Axis Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* BAR SCORES */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Category Score Breakdowns</h4>
          <div className="h-[200px] w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#475569" fontSize={10} />
                <YAxis stroke="#475569" fontSize={10} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }} />
                <Bar dataKey="score" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LINE COHORT PROGRESS OVER MONTHS */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Monthly Growth Index Progression</h4>
          <div className="h-[200px] w-full text-xs">
            {growthPathData.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthPathData}>
                  <XAxis dataKey="date" stroke="#475569" fontSize={10} />
                  <YAxis stroke="#475569" fontSize={10} domain={[40, 100]} />
                  <Tooltip contentStyle={{ background: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }} />
                  <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="growthIndex" stroke="#10b981" strokeWidth={3} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <TrendingUp className="h-8 w-8 text-slate-400 mb-2" />
                <p className="text-[11px] text-slate-500">Take multiple assessments over the next term to visualize your monthly growth path index.</p>
              </div>
            )}
          </div>
        </div>

        {/* INTEREST BIASES DONUT */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Primary Core Strength Distribution</h4>
          <div className="h-[200px] w-full text-xs relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label inside donut */}
            <div className="absolute text-center">
              <span className="text-lg font-black text-slate-800">{scores['Creativity'] || 50}%</span>
              <p className="text-[8px] text-slate-500 uppercase font-bold tracking-widest">Innovation</p>
            </div>
          </div>
        </div>

      </div>

      {/* TIMELINE OF HISTORICAL ASSESSMENTS */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
          <Calendar className="h-4.5 w-4.5 text-blue-600" /> Historical Assessment Record Timeline
        </h3>
        
        <div className="space-y-4 relative pl-6 border-l border-slate-200">
          {history.map((h, i) => (
            <div key={h.id} className="relative space-y-1">
              {/* Timeline marker node */}
              <div className="absolute left-[-29px] top-1.5 h-3.5 w-3.5 rounded-full bg-white border-2 border-blue-500 shadow-sm" />
              
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-800">Growth Score Achieved: <span className="text-blue-600 font-black">{h.growthIndex}%</span></p>
                <span className="text-[10px] text-slate-400 font-semibold">{new Date(h.date).toLocaleDateString()}</span>
              </div>
              <p className="text-[11px] text-slate-500 max-w-xl leading-relaxed">{h.aiInsights.summary.slice(0, 180)}...</p>
            </div>
          ))}
        </div>
      </div>

      {/* RE-PRINTABLE CERTIFICATE PREVIEW CARD */}
      <div className="p-6 bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" /> Printable Certification Credential
            </h4>
            <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
              Upon finishing your personality and self-awareness index evaluation, you receive an official PersonaAI student credential documenting your developmental capabilities.
            </p>
          </div>
          <button
            onClick={() => setShowCertificate(!showCertificate)}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 uppercase tracking-wider transition cursor-pointer shadow-sm"
          >
            {showCertificate ? 'Hide Certificate' : 'Preview Certificate'}
          </button>
        </div>

        {showCertificate && (
          /* High-Fidelity printable student certificate */
          <div className="p-12 bg-white text-slate-800 rounded-2xl border-8 border-slate-100 shadow-inner max-w-2xl mx-auto space-y-8 relative font-serif text-center">
            {/* Visual credential stamp */}
            <div className="absolute top-6 right-6 h-14 w-14 rounded-full border-4 border-amber-500 flex items-center justify-center font-bold text-amber-500 text-[10px] rotate-12 tracking-wider">
              VALID
            </div>

            <div className="space-y-2">
              <span className="text-xs font-sans font-black uppercase tracking-widest text-brand-600 block">PersonaAI Analytics Program</span>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Certificate of Personality Development</h2>
              <div className="w-16 h-0.5 bg-brand-500 mx-auto mt-2" />
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-400 italic">This official student credential confirms that</p>
              <p className="text-xl font-bold font-sans text-slate-900 tracking-tight">{assessment.studentDetails.name}</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                has successfully completed the complete 20-Question psychometric intake, evaluating a normalized general <span className="font-bold">Growth Index of {assessment.growthIndex}%</span> across Self-Awareness, Motivative, and Emotional intelligence parameters.
              </p>
            </div>

            <div className="pt-8 border-t border-slate-100 grid grid-cols-2 gap-6 text-[10px] text-slate-400 font-sans uppercase tracking-widest">
              <div>
                <p className="font-bold text-slate-800">Evelyn Vance</p>
                <p className="text-[8px] mt-0.5">Pinecrest Academy Admin</p>
              </div>
              <div>
                <p className="font-bold text-slate-800">PersonaAI Evaluator</p>
                <p className="text-[8px] mt-0.5">Raymond Croft, Psy.D.</p>
              </div>
            </div>

            <div className="no-print pt-4 flex justify-center">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-sans font-bold uppercase tracking-wider rounded-xl transition"
              >
                <Printer className="h-3.5 w-3.5" /> Print Credential
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
