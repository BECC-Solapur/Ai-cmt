/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  UserSquare, 
  Award, 
  TrendingUp, 
  Heart, 
  FileText, 
  Clock, 
  CheckCircle, 
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Plus
} from 'lucide-react';
import { StudentAssessment, User } from '../types';
import { CATEGORY_LABELS } from '../assessmentEngine';

interface ParentDashboardProps {
  childAssessments: StudentAssessment[];
  childUser: User | null;
  parentUser: User;
  onOpenReport: () => void;
}

export default function ParentDashboard({
  childAssessments,
  childUser,
  parentUser,
  onOpenReport
}: ParentDashboardProps) {
  const [timerSeconds, setTimerSeconds] = useState(1800); // 30 minutes default study check
  const [timerActive, setTimerActive] = useState(false);
  const [timerIntervalId, setTimerIntervalId] = useState<any>(null);
  const [routines, setRoutines] = useState<string[]>([
    'Afternoon Active Recall Study (30 min)',
    'Box Breathing Stress Reduction Cycle (5 min)',
    'Positive Behavior Reinforcement Session (10 min)'
  ]);
  const [newRoutineText, setNewRoutineText] = useState('');

  // Get active assessment
  const activeAssessment = useMemo(() => {
    if (childAssessments.length === 0) return null;
    // Sort descending by date
    return [...childAssessments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }, [childAssessments]);

  // Get previous assessment for comparison
  const previousAssessment = useMemo(() => {
    if (childAssessments.length < 2) return null;
    const sorted = [...childAssessments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sorted[1];
  }, [childAssessments]);

  // Handle study routine timer
  const toggleTimer = () => {
    if (timerActive) {
      clearInterval(timerIntervalId);
      setTimerActive(false);
    } else {
      const interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimerActive(false);
            alert("Routines block completed! Great work parenting.");
            return 1800;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerIntervalId(interval);
      setTimerActive(true);
    }
  };

  const resetTimer = () => {
    if (timerActive) {
      clearInterval(timerIntervalId);
      setTimerActive(false);
    }
    setTimerSeconds(1800);
  };

  const handleAddRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutineText.trim()) return;
    setRoutines(prev => [...prev, newRoutineText.trim()]);
    setNewRoutineText('');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!activeAssessment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] font-sans p-6 text-center">
        <div className="max-w-md p-8 bg-white rounded-3xl border border-slate-200 space-y-6 shadow-sm">
          <div className="h-14 w-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600 mx-auto shadow-sm">
            <UserSquare className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">No Child Records Logged</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your child has not completed their 20-Question psychometric intake. Please coordinate with school counselors or let them take the questionnaire directly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const scores = activeAssessment.scores;
  const ai = activeAssessment.aiInsights;

  // Comparison score matrix
  const compareData = Object.entries(scores).map(([category, val]) => {
    const prevVal = previousAssessment ? (previousAssessment.scores[category] as number) || 0 : 0;
    const diff = previousAssessment ? (val as number) - prevVal : 0;
    return {
      category,
      label: CATEGORY_LABELS[category] || category,
      current: val as number,
      previous: prevVal,
      diff
    };
  });

  return (
    <div className="font-sans text-slate-800 p-6 space-y-6">
      
      {/* Upper Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <span className="text-[10px] text-blue-600 uppercase font-black tracking-widest flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> PARENT CASE CONTROL PANEL
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Child Progress Summary: {activeAssessment.studentDetails.name}
          </h1>
          <p className="text-xs text-slate-500">
            Assigned Guardian: {parentUser.name} • Class: {activeAssessment.studentDetails.grade} • Pinecrest Academy
          </p>
        </div>

        <button
          onClick={onOpenReport}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer"
        >
          <FileText className="h-4 w-4" /> Open 15-Page Child Dossier
        </button>
      </div>

      {/* KPI Cards Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* GROWTH INDEX */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-full border-2 border-blue-500 flex items-center justify-center font-black text-slate-800 text-lg bg-slate-50">
            {activeAssessment.growthIndex}%
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-blue-600 tracking-wider block">Child Growth Score</span>
            <span className="text-xs font-bold text-slate-700">Excellent Development</span>
          </div>
        </div>

        {/* STUDY HABITS INDEX */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-blue-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">Study Habits Index</span>
            <span className="text-sm font-bold text-slate-850">{scores['Learning Style']}% Mastery</span>
          </div>
        </div>

        {/* EMOTIONAL STABILITY */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-emerald-600">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">Emotional Maturity</span>
            <span className="text-sm font-bold text-slate-850">{scores['Emotional Regulation']}% Index</span>
          </div>
        </div>

        {/* DECISION MAKING */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-indigo-600">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">Decision Making index</span>
            <span className="text-sm font-bold text-slate-850">{scores['Decision Making']}% Mastery</span>
          </div>
        </div>
      </div>

      {/* Comparison Grid and Routine Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* INTERACTIVE ROUTINE & STUDY TIME BUILDER */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-850 uppercase tracking-tight flex items-center gap-2">
              <Clock className="h-4.5 w-4.5 text-blue-600" /> Parenting Routine Builder & Timer
            </h3>
            <p className="text-[11px] text-slate-500">Coordinate and track active study times and behavioral sessions at home.</p>
          </div>

          {/* Interactive Clock Timer */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-3">
            <span className="text-3xl font-mono font-black text-blue-600 tracking-wider">{formatTime(timerSeconds)}</span>
            <div className="flex gap-2">
              <button
                onClick={toggleTimer}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition cursor-pointer"
              >
                {timerActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {timerActive ? 'Pause Session' : 'Start Study block'}
              </button>
              <button
                onClick={resetTimer}
                className="p-1.5 bg-white border border-slate-200 text-slate-500 hover:text-slate-750 rounded-lg transition shadow-xs cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Routines checklist */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Routine Actions:</p>
            <div className="space-y-2 text-xs">
              {routines.map((rt, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="font-medium">{rt}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddRoutine} className="flex gap-2 pt-2">
              <input
                type="text"
                required
                placeholder="Add custom routine..."
                value={newRoutineText}
                onChange={(e) => setNewRoutineText(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all shadow-xs"
              />
              <button
                type="submit"
                className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition cursor-pointer shadow-xs"
              >
                <Plus className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* COMPARISON CHANGE AXIS */}
        <div className="lg:col-span-2 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-850 uppercase tracking-tight flex items-center gap-2">
            <TrendingUp className="h-4.5 w-4.5 text-blue-600" /> Category Score Comparison & Progression
          </h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Compares your child's current development metrics with their previous baseline values. Visualizes areas of steady gains or those needing reinforcement.
          </p>

          <div className="space-y-3.5">
            {compareData.map((cd, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-700 font-bold">{cd.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 font-mono text-[11px]">Prev: {cd.previous}%</span>
                    <span className="text-slate-800 font-mono font-bold">Curr: {cd.current}%</span>
                    {previousAssessment && (
                      <span className={`px-1.5 py-0.5 font-mono font-extrabold rounded text-[9px] ${
                        cd.diff >= 0 ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/25' : 'bg-rose-500/10 text-rose-600 border border-rose-500/25'
                      }`}>
                        {cd.diff >= 0 ? `+${cd.diff}` : cd.diff}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200 p-0.5 relative">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all" 
                    style={{ width: `${cd.current}%` }}
                  />
                  {previousAssessment && (
                    <div 
                      className="absolute top-0.5 bottom-0.5 w-1 bg-slate-400"
                      style={{ left: `${cd.previous}%` }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* PARENT SPECIFIC ADVICE */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-850 uppercase tracking-tight flex items-center gap-2">
          <Heart className="h-4.5 w-4.5 text-emerald-500" /> Parent Home Guidance Matrix
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {ai.recommendations.forParent.map((rec, i) => (
            <div key={i} className="p-5 bg-slate-50 border border-slate-150 rounded-2xl space-y-2 shadow-xs">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-800 text-sm">{rec.recommendation}</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 font-bold rounded uppercase tracking-wider text-[9px] border border-emerald-500/20">{rec.priority} Priority</span>
              </div>
              <p className="text-slate-500 font-medium"><span className="font-bold text-slate-700">Why it helps:</span> {rec.reason}</p>
              <p className="text-slate-500 font-medium"><span className="font-bold text-slate-700">Success Milestone:</span> {rec.expectedOutcome}</p>
              <p className="text-slate-400 font-bold font-mono text-[9px] pt-1">TIMELINE SCHEDULE: {rec.timeline}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
