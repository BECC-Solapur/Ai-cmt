/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  Heart, 
  ShieldAlert, 
  Download, 
  Filter, 
  ChevronRight, 
  ArrowUpRight,
  FileSpreadsheet,
  Printer,
  Sparkles,
  X,
  Brain,
  Target,
  Award,
  Zap,
  CheckCircle,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend 
} from 'recharts';
import { StudentAssessment, User } from '../types';
import { CATEGORY_LABELS } from '../assessmentEngine';

interface TeacherDashboardProps {
  assessments: StudentAssessment[];
  users: User[];
  teacherUser: User;
  onSelectStudent: (studentId: string) => void;
  onAssessmentUpdated?: (updated: StudentAssessment) => void;
}

export default function TeacherDashboard({
  assessments,
  users,
  teacherUser,
  onSelectStudent,
  onAssessmentUpdated
}: TeacherDashboardProps) {
  // Filters
  const [filterClass, setFilterClass] = useState('All');
  const [filterSection, setFilterSection] = useState('All');
  const [filterGender, setFilterGender] = useState('All');
  const [filterAge, setFilterAge] = useState('All');

  // Popup modal state for individual student detailed psychometrics
  const [activePopupStudent, setActivePopupStudent] = useState<StudentAssessment | null>(null);
  const [modalTab, setModalTab] = useState<'analysis' | 'charts'>('analysis');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [popupError, setPopupError] = useState('');
  const [popupSuccess, setPopupSuccess] = useState('');

  // Computations for detailed popup graphs
  const popupBarData = useMemo(() => {
    if (!activePopupStudent) return [];
    return Object.entries(activePopupStudent.scores).map(([cat, val]) => ({
      name: cat.length > 15 ? cat.substring(0, 15) + '...' : cat,
      fullName: cat,
      score: val
    }));
  }, [activePopupStudent]);

  const popupPieData = useMemo(() => {
    if (!activePopupStudent) return [];
    const s = activePopupStudent.scores;
    const cognitive = Math.round(((s['Learning Style'] || 0) + (s['Creativity'] || 0) + (s['Decision Making'] || 0)) / 3);
    const interpersonal = Math.round(((s['Communication'] || 0) + (s['Leadership'] || 0)) / 2);
    const emotional = Math.round(((s['Emotional Regulation'] || 0) + (s['Confidence'] || 0) + (s['Self Awareness'] || 0)) / 3);
    const motivational = Math.round(((s['Motivation'] || 0) + (s['Career Interest'] || 0)) / 2);

    return [
      { name: 'Cognitive Readiness', value: cognitive || 10, color: '#3b82f6' },
      { name: 'Interpersonal Skills', value: interpersonal || 10, color: '#10b981' },
      { name: 'Emotional Resilience', value: emotional || 10, color: '#8b5cf6' },
      { name: 'Motivational Drive', value: motivational || 10, color: '#f59e0b' },
    ];
  }, [activePopupStudent]);

  const handleRegeneratePopupAI = async (assessmentId: string) => {
    setAiGenerating(true);
    setPopupError('');
    setPopupSuccess('');
    try {
      const response = await fetch('/api/assessments/regenerate-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ assessmentId })
      });

      if (response.ok) {
        const data = await response.json();
        setActivePopupStudent(data.assessment);
        setPopupSuccess('Analysis and generation completed successfully!');
        if (onAssessmentUpdated) {
          onAssessmentUpdated(data.assessment);
        }
      } else {
        const errData = await response.json();
        setPopupError(errData.error || 'Failed to regenerate report with Gemini AI.');
      }
    } catch (err: any) {
      console.error(err);
      setPopupError('Network error while requesting live Gemini evaluation.');
    } finally {
      setAiGenerating(false);
    }
  };

  // Filter students
  const filteredAssessments = useMemo(() => {
    return assessments.filter(a => {
      if (filterClass !== 'All' && a.studentDetails.grade !== filterClass) return false;
      if (filterSection !== 'All' && a.studentDetails.section !== filterSection) return false;
      if (filterGender !== 'All' && a.studentDetails.gender !== filterGender) return false;
      if (filterAge !== 'All' && a.studentDetails.age.toString() !== filterAge) return false;
      return true;
    });
  }, [assessments, filterClass, filterSection, filterGender, filterAge]);

  // Calculations for KPI Cards
  const totalStudentsCount = filteredAssessments.length;
  
  const classAvgGrowthIndex = useMemo(() => {
    if (totalStudentsCount === 0) return 0;
    const sum = filteredAssessments.reduce((acc, curr) => acc + curr.growthIndex, 0);
    return Math.round(sum / totalStudentsCount);
  }, [filteredAssessments, totalStudentsCount]);

  const emotionalHealth = useMemo(() => {
    if (totalStudentsCount === 0) return 0;
    const sum = filteredAssessments.reduce((acc, curr) => acc + (curr.scores['Emotional Regulation'] || 50), 0);
    return Math.round(sum / totalStudentsCount);
  }, [filteredAssessments, totalStudentsCount]);

  const studentsNeedingAttention = useMemo(() => {
    return filteredAssessments.filter(a => a.growthIndex < 60 || a.aiInsights.riskIndicator === 'High');
  }, [filteredAssessments]);

  // Student ranking data
  const studentRankings = useMemo(() => {
    return [...filteredAssessments].sort((a, b) => b.growthIndex - a.growthIndex);
  }, [filteredAssessments]);

  // Distribution chart data
  const careerDistribution = useMemo(() => {
    const counts: { [key: string]: number } = {
      'Tech / Research': 0,
      'Creative / Design': 0,
      'Social / Education': 0,
      'Leadership / Business': 0
    };
    
    filteredAssessments.forEach(a => {
      const cluster = a.aiInsights.predictions.careerCluster;
      if (cluster.includes('Technology') || cluster.includes('Research')) counts['Tech / Research']++;
      else if (cluster.includes('Creative') || cluster.includes('Design')) counts['Creative / Design']++;
      else if (cluster.includes('Business') || cluster.includes('Ventures')) counts['Leadership / Business']++;
      else counts['Social / Education']++;
    });

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredAssessments]);

  const careerColors = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b'];

  // Check if dark class exists on document
  const isDark = false;

  // Exports CSV data trigger
  const handleExportCSV = () => {
    const headers = ['Name', 'Grade', 'Section', 'Age', 'Gender', 'Growth Index', 'Personality Type', 'Anxiety Risk'];
    const rows = filteredAssessments.map(a => [
      a.studentDetails.name,
      a.studentDetails.grade,
      a.studentDetails.section,
      a.studentDetails.age,
      a.studentDetails.gender,
      `${a.growthIndex}%`,
      a.aiInsights.personalityType,
      a.aiInsights.riskIndicator
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Class_Cohort_Analytics_${filterClass}_${filterSection}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="font-sans text-slate-800 p-6 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <span className="text-[10px] text-blue-600 uppercase font-black tracking-widest flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> EDUCATOR COHORT PORTAL
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Cohort Analytics: {teacherUser.name}
          </h1>
          <p className="text-xs text-slate-500">
            Institution: {teacherUser.school || 'Pinecrest Academy'} • Department: student psychological growth monitoring
          </p>
        </div>

        {/* Dynamic Exports */}
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> Export Excel/CSV
          </button>
          
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition cursor-pointer"
          >
            <Printer className="h-4 w-4" /> Export PDF Report
          </button>
        </div>
      </div>

      {/* Interactive Filters Grid */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-wrap gap-4 items-center shadow-sm">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase shrink-0">
          <Filter className="h-4 w-4 text-blue-600" /> Filter Cohort:
        </div>

        {/* Class Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-semibold">Grade</span>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none shadow-xs"
          >
            <option value="All">All Grades</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
          </select>
        </div>

        {/* Section Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-semibold">Section</span>
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none shadow-xs"
          >
            <option value="All">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
        </div>

        {/* Gender Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-semibold">Gender</span>
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none shadow-xs"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Age Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-semibold">Age</span>
          <select
            value={filterAge}
            onChange={(e) => setFilterAge(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none shadow-xs"
          >
            <option value="All">All Ages</option>
            <option value="15">15 Years</option>
            <option value="16">16 Years</option>
            <option value="17">17 Years</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* TOTAL ENROLLED */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-blue-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">Cohort size</span>
            <span className="text-lg font-bold text-slate-800">{totalStudentsCount} Enrolled</span>
          </div>
        </div>

        {/* CLASS AVG INDEX */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="h-12 w-12 rounded-full border-2 border-blue-500 flex items-center justify-center font-black text-slate-800 text-lg bg-slate-50">
            {classAvgGrowthIndex}%
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-blue-600 tracking-wider block">Cohort Growth Avg</span>
            <span className="text-xs font-bold text-slate-800">System Average</span>
          </div>
        </div>

        {/* CLASS EMOTIONAL HEALTH */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-emerald-600">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">Emotional Health index</span>
            <span className="text-lg font-bold text-slate-800">{emotionalHealth}% Average</span>
          </div>
        </div>

        {/* RISK STUDENTS */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
          <div className={`p-3 rounded-xl border ${studentsNeedingAttention.length > 0 ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">Critical Risk Flag</span>
            <span className="text-lg font-bold text-slate-800">{studentsNeedingAttention.length} Students</span>
          </div>
        </div>
      </div>

      {/* Interactive Mastery Heatmap */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
          <TrendingUp className="h-4.5 w-4.5 text-blue-600" /> Cohort Category Mastery Heatmap
        </h3>
        <p className="text-[11px] text-slate-500">
          Visualizes detailed category performance for individual students. Cells represent percentage scores mapped as green (High Mastery), yellow (Developing), or red (Requires Support).
        </p>

        <div className="overflow-x-auto no-scrollbar rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[9px] font-bold">
              <tr>
                <th className="p-3.5 border-b border-slate-200">Student Name</th>
                <th className="p-2 border-b border-slate-200 text-center">Self</th>
                <th className="p-2 border-b border-slate-200 text-center">Conf</th>
                <th className="p-2 border-b border-slate-200 text-center">Learn</th>
                <th className="p-2 border-b border-slate-200 text-center">Motiv</th>
                <th className="p-2 border-b border-slate-200 text-center">Emot</th>
                <th className="p-2 border-b border-slate-200 text-center">Comm</th>
                <th className="p-2 border-b border-slate-200 text-center">Lead</th>
                <th className="p-2 border-b border-slate-200 text-center">Creat</th>
                <th className="p-2 border-b border-slate-200 text-center">Decis</th>
                <th className="p-2 border-b border-slate-200 text-center">Career</th>
                <th className="p-3.5 border-b border-slate-200 text-center">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 bg-white text-slate-700">
              {filteredAssessments.map(student => {
                const s = student.scores;
                const getHeatColor = (score: number) => {
                  if (score >= 75) return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20';
                  if (score >= 50) return 'bg-amber-500/10 text-amber-600 border border-amber-500/20';
                  return 'bg-rose-500/10 text-rose-600 border border-rose-500/20';
                };
                return (
                  <tr key={student.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-bold text-slate-850">
                      <button 
                        onClick={() => {
                          setActivePopupStudent(student);
                          setModalTab('analysis');
                          setPopupError('');
                          setPopupSuccess('');
                        }}
                        className="text-left hover:text-indigo-600 hover:underline transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Brain className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                        {student.studentDetails.name}
                      </button>
                    </td>
                    <td className="p-2 text-center"><span className={`px-2 py-1 rounded font-mono font-bold text-[10px] ${getHeatColor(s['Self Awareness'])}`}>{s['Self Awareness']}%</span></td>
                    <td className="p-2 text-center"><span className={`px-2 py-1 rounded font-mono font-bold text-[10px] ${getHeatColor(s['Confidence'])}`}>{s['Confidence']}%</span></td>
                    <td className="p-2 text-center"><span className={`px-2 py-1 rounded font-mono font-bold text-[10px] ${getHeatColor(s['Learning Style'])}`}>{s['Learning Style']}%</span></td>
                    <td className="p-2 text-center"><span className={`px-2 py-1 rounded font-mono font-bold text-[10px] ${getHeatColor(s['Motivation'])}`}>{s['Motivation']}%</span></td>
                    <td className="p-2 text-center"><span className={`px-2 py-1 rounded font-mono font-bold text-[10px] ${getHeatColor(s['Emotional Regulation'])}`}>{s['Emotional Regulation']}%</span></td>
                    <td className="p-2 text-center"><span className={`px-2 py-1 rounded font-mono font-bold text-[10px] ${getHeatColor(s['Communication'])}`}>{s['Communication']}%</span></td>
                    <td className="p-2 text-center"><span className={`px-2 py-1 rounded font-mono font-bold text-[10px] ${getHeatColor(s['Leadership'])}`}>{s['Leadership']}%</span></td>
                    <td className="p-2 text-center"><span className={`px-2 py-1 rounded font-mono font-bold text-[10px] ${getHeatColor(s['Creativity'])}`}>{s['Creativity']}%</span></td>
                    <td className="p-2 text-center"><span className={`px-2 py-1 rounded font-mono font-bold text-[10px] ${getHeatColor(s['Decision Making'])}`}>{s['Decision Making']}%</span></td>
                    <td className="p-2 text-center"><span className={`px-2 py-1 rounded font-mono font-bold text-[10px] ${getHeatColor(s['Career Interest'])}`}>{s['Career Interest']}%</span></td>
                    <td className="p-3.5 text-center font-bold text-blue-600 font-mono text-[11px]">{student.growthIndex}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cohort Distributions Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* STUDENTS NEEDING ATTENTION */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-4.5 w-4.5 text-rose-500" /> Critical Focus Group (Attention Needed)
          </h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">Identified cohort students scoring below 60% Growth Index or exhibiting High stress risk baselines.</p>
          
          <div className="space-y-3">
            {studentsNeedingAttention.map(student => (
              <div key={student.id} className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-rose-600">{student.studentDetails.name}</p>
                  <p className="text-[10px] text-slate-500">Stress Risk: {student.aiInsights.predictions.stressRisk} • Learn Risk: {student.aiInsights.predictions.learningRisk}</p>
                </div>
                <button
                  onClick={() => {
                    setActivePopupStudent(student);
                    setModalTab('analysis');
                    setPopupError('');
                    setPopupSuccess('');
                  }}
                  className="px-2.5 py-1.5 bg-indigo-50 border border-indigo-150 text-[10px] font-bold text-indigo-600 hover:bg-indigo-100 rounded-lg transition shadow-xs cursor-pointer"
                >
                  Analyze Profile
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* COHORT CAREER ALIGNMENT */}
        <div className="lg:col-span-2 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Cohort Vocational Cluster Alignment</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed">Displays estimated distribution of current cohort students across key modern vocational areas.</p>
          
          <div className="h-[200px] w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={careerDistribution}>
                <XAxis dataKey="name" stroke="#475569" fontSize={10} />
                <YAxis stroke="#475569" fontSize={10} />
                <Tooltip contentStyle={{ background: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }} />
                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]}>
                  {careerDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={careerColors[index % careerColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* COHORT RANKINGS LIST */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">Cohort Leaderboard Ranking</h3>
        <p className="text-[11px] text-slate-500">Detailed student listings filtered according to overall development indices.</p>

        <div className="overflow-x-auto no-scrollbar rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[9px] font-bold">
              <tr>
                <th className="p-3 border-b border-slate-200 text-center">Rank</th>
                <th className="p-3 border-b border-slate-200">Student Name</th>
                <th className="p-3 border-b border-slate-200">Personality Type</th>
                <th className="p-3 border-b border-slate-200">Anxiety Profile</th>
                <th className="p-3 border-b border-slate-200 text-center">Growth Index</th>
                <th className="p-3 border-b border-slate-200 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 bg-white text-slate-700">
              {studentRankings.map((student, idx) => (
                <tr key={student.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 text-center font-bold font-mono text-slate-500">#{idx + 1}</td>
                  <td className="p-3 font-bold text-slate-850">
                    <button
                      onClick={() => {
                        setActivePopupStudent(student);
                        setModalTab('analysis');
                        setPopupError('');
                        setPopupSuccess('');
                      }}
                      className="hover:text-indigo-600 hover:underline transition cursor-pointer text-left flex items-center gap-1.5"
                    >
                      <Brain className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      {student.studentDetails.name}
                    </button>
                  </td>
                  <td className="p-3 text-slate-500 font-medium">{student.aiInsights.personalityType}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      student.aiInsights.riskIndicator === 'High' ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' :
                      student.aiInsights.riskIndicator === 'Medium' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                      'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    }`}>
                      {student.aiInsights.riskIndicator} Risk
                    </span>
                  </td>
                  <td className="p-3 text-center font-bold text-blue-600 font-mono text-[11px]">{student.growthIndex}%</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => {
                        setActivePopupStudent(student);
                        setModalTab('analysis');
                        setPopupError('');
                        setPopupSuccess('');
                      }}
                      className="text-indigo-600 hover:text-indigo-700 font-bold transition flex items-center gap-0.5 mx-auto cursor-pointer"
                    >
                      Analyze Profile <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED STUDENT PSYCHOMETRICS POPUP MODAL */}
      {activePopupStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in no-print overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden transform scale-100 transition-all">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50/50 gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl shadow-sm shrink-0">
                  {activePopupStudent.studentDetails.name[0]}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                      {activePopupStudent.studentDetails.name}
                    </h3>
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                      activePopupStudent.aiInsights.riskIndicator === 'High' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                      activePopupStudent.aiInsights.riskIndicator === 'Medium' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                      'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}>
                      {activePopupStudent.aiInsights.riskIndicator} Stress Risk
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activePopupStudent.studentDetails.grade} • {activePopupStudent.studentDetails.section} • Age {activePopupStudent.studentDetails.age} • {activePopupStudent.studentDetails.gender}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                {/* Growth Index Gauge */}
                <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl mr-2">
                  <div className="text-right">
                    <span className="text-[9px] font-bold uppercase text-indigo-500 tracking-wider block">Growth Index</span>
                    <span className="text-sm font-black text-indigo-700">{activePopupStudent.growthIndex}%</span>
                  </div>
                  <div className="h-8 w-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-600 flex items-center justify-center font-bold text-indigo-700 text-[10px]">
                    {activePopupStudent.growthIndex}%
                  </div>
                </div>

                <button
                  onClick={() => handleRegeneratePopupAI(activePopupStudent.id)}
                  disabled={aiGenerating}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Regenerate AI
                </button>

                <button
                  onClick={() => {
                    onSelectStudent(activePopupStudent.studentId);
                    setActivePopupStudent(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm"
                >
                  <Printer className="h-3.5 w-3.5 text-slate-500" /> Full Dossier
                </button>

                <button
                  onClick={() => {
                    setActivePopupStudent(null);
                    setPopupError('');
                    setPopupSuccess('');
                  }}
                  className="p-2.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 py-2 bg-white border-b border-slate-100 flex gap-4">
              <button
                onClick={() => setModalTab('analysis')}
                className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer ${
                  modalTab === 'analysis' ? 'border-indigo-600 text-indigo-600 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800 font-bold'
                }`}
              >
                AI Psychometrics & Reports
              </button>
              <button
                onClick={() => setModalTab('charts')}
                className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer ${
                  modalTab === 'charts' ? 'border-indigo-600 text-indigo-600 font-extrabold' : 'border-transparent text-slate-500 hover:text-slate-800 font-bold'
                }`}
              >
                Visual Performance Charts
              </button>
            </div>

            {/* Content Scroll Area */}
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6 flex-1 bg-slate-50/30">
              {modalTab === 'analysis' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  {/* Left Column: Summary and core insights */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
                      <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                        <Brain className="h-4 w-4" /> AI Executive Summary
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {activePopupStudent.aiInsights.summary}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Strengths */}
                      <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-3">
                        <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4" /> Student Strengths
                        </h4>
                        <ul className="space-y-2">
                          {activePopupStudent.aiInsights.topStrengths.map((str, idx) => (
                            <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                              <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Growth Areas */}
                      <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm space-y-3">
                        <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                          <TrendingUp className="h-4 w-4" /> Focus Areas
                        </h4>
                        <ul className="space-y-2">
                          {activePopupStudent.aiInsights.topGrowthAreas.map((area, idx) => (
                            <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                              <span className="text-amber-500 font-bold mt-0.5">•</span>
                              <span>{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Behavioral Analysis & Habits */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Cognitive & Social Profiles</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs leading-relaxed">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <strong className="text-slate-800 block mb-1">Study Habits:</strong>
                          <span className="text-slate-600">{activePopupStudent.aiInsights.studyHabitAnalysis}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <strong className="text-slate-800 block mb-1">Social Interaction:</strong>
                          <span className="text-slate-600">{activePopupStudent.aiInsights.socialInteraction}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <strong className="text-slate-800 block mb-1">Decision Making Style:</strong>
                          <span className="text-slate-600">{activePopupStudent.aiInsights.decisionMakingStyle}</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <strong className="text-slate-800 block mb-1">Stress Handling:</strong>
                          <span className="text-slate-600">{activePopupStudent.aiInsights.stressHandling}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Key Metas, Future Predictions, and risks */}
                  <div className="space-y-6">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="h-4 w-4 text-indigo-500" /> Profiling Attributes
                      </h4>
                      <div className="space-y-3 divide-y divide-slate-50 text-xs">
                        <div className="pt-2 flex justify-between items-center">
                          <span className="text-slate-500">Personality Type:</span>
                          <span className="font-bold text-indigo-600">{activePopupStudent.aiInsights.personalityType}</span>
                        </div>
                        <div className="pt-2.5 flex justify-between items-center">
                          <span className="text-slate-500">Communication Mode:</span>
                          <span className="font-bold text-slate-700">{activePopupStudent.aiInsights.communicationType}</span>
                        </div>
                        <div className="pt-2.5 flex justify-between items-center">
                          <span className="text-slate-500">Leadership Type:</span>
                          <span className="font-bold text-slate-700">{activePopupStudent.aiInsights.leadershipType}</span>
                        </div>
                        <div className="pt-2.5 flex justify-between items-center">
                          <span className="text-slate-500">Suggested Sector:</span>
                          <span className="font-bold text-teal-600 text-right">{activePopupStudent.aiInsights.careerSuggestion}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Briefcase className="h-4 w-4 text-slate-500" /> AI Prognostics
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-slate-500">Academic Readiness:</span>
                            <span className="text-slate-800">{activePopupStudent.aiInsights.predictions.academicReadiness}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${activePopupStudent.aiInsights.predictions.academicReadiness}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-slate-500">Career Readiness Score:</span>
                            <span className="text-slate-800">{activePopupStudent.aiInsights.predictions.careerReadinessScore}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${activePopupStudent.aiInsights.predictions.careerReadinessScore}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-slate-500">Future Leadership Index:</span>
                            <span className="text-slate-800">{activePopupStudent.aiInsights.predictions.futureLeadership}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${activePopupStudent.aiInsights.predictions.futureLeadership}%` }} />
                          </div>
                        </div>

                        <div className="pt-2 grid grid-cols-2 gap-2 text-[10px]">
                          <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-slate-400 block font-semibold">Learning Risk</span>
                            <span className={`font-bold ${
                              activePopupStudent.aiInsights.predictions.learningRisk === 'High' ? 'text-rose-600' :
                              activePopupStudent.aiInsights.predictions.learningRisk === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                            }`}>{activePopupStudent.aiInsights.predictions.learningRisk}</span>
                          </div>
                          <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-slate-400 block font-semibold">Confidence Risk</span>
                            <span className={`font-bold ${
                              activePopupStudent.aiInsights.predictions.confidenceRisk === 'High' ? 'text-rose-600' :
                              activePopupStudent.aiInsights.predictions.confidenceRisk === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                            }`}>{activePopupStudent.aiInsights.predictions.confidenceRisk}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 text-left">
                  {/* Category Mastery bar chart (Left 3 columns) */}
                  <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <TrendingUp className="h-4 w-4 text-blue-500" /> Category Mastery Scores
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1">Real-time percentage index across the 10 psychometric development pillars</p>
                    </div>

                    <div className="h-[300px] text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={popupBarData} layout="vertical" margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                          <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={10} />
                          <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={110} />
                          <Tooltip 
                            contentStyle={{ background: '#ffffff', borderColor: '#e2e8f0', color: '#0f172a' }}
                            formatter={(value: any, name: any, props: any) => [`${value}%`, props.payload.fullName]}
                          />
                          <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                            {popupBarData.map((entry, index) => {
                              const score = entry.score;
                              let color = '#3b82f6'; // Blue
                              if (score >= 75) color = '#10b981'; // Emerald
                              else if (score < 55) color = '#ef4444'; // Red
                              return <Cell key={`cell-${index}`} fill={color} />;
                            })}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Psychometric balance pie chart (Right 2 columns) */}
                  <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <PieChart className="h-4 w-4 text-violet-500" /> Core Dimension Alignment
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1">Balanced cluster distribution of student competencies</p>
                    </div>

                    <div className="h-[220px] relative flex items-center justify-center text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={popupPieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {popupPieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest text-[9px]">Competency</span>
                        <span className="text-xl font-extrabold text-slate-800">{activePopupStudent.growthIndex}%</span>
                      </div>
                    </div>

                    {/* Custom Legend */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] pt-4 border-t border-slate-100">
                      {popupPieData.map((d, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full block shrink-0" style={{ backgroundColor: d.color }} />
                          <span className="text-slate-500 truncate font-semibold">{d.name} ({d.value}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
              <button
                onClick={() => {
                  setActivePopupStudent(null);
                  setPopupError('');
                  setPopupSuccess('');
                }}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
              >
                Close Modal
              </button>
            </div>

            {/* Live AI generation loading screen inside popup */}
            {aiGenerating && (
              <div className="absolute inset-0 z-[110] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 space-y-6 animate-fade-in">
                <div className="relative h-20 w-20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                  <Sparkles className="h-8 w-8 text-indigo-400 animate-pulse" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <span className="text-[10px] bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full font-black uppercase tracking-widest inline-block animate-pulse">
                    Synthesizing Psychometrics...
                  </span>
                  <h3 className="text-xl font-black text-white tracking-tight">Analyzing and Compiling Behavioral Insights...</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Please wait while Gemini evaluates cognitive and behavioral dimensions to build a customized, 15-page student development dossier.
                  </p>
                </div>
              </div>
            )}

            {/* Failure Popup within Modal */}
            {popupError && (
              <div className="absolute inset-0 z-[120] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl space-y-4 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Generation Failed</h3>
                    <p className="text-xs text-rose-600 font-medium bg-rose-50/50 p-2.5 rounded-xl border border-rose-100/50 leading-relaxed">
                      {popupError}
                    </p>
                  </div>
                  <button
                    onClick={() => setPopupError('')}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Success Popup within Modal */}
            {popupSuccess && (
              <div className="absolute inset-0 z-[120] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl space-y-4 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100 animate-bounce">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Synthesis Updated!</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      The student psychometric analysis and visual charts have been successfully compiled and updated.
                    </p>
                  </div>
                  <button
                    onClick={() => setPopupSuccess('')}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm cursor-pointer"
                  >
                    View Updated Insights
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
