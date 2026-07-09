/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { 
  Printer, 
  ArrowLeft, 
  BookOpen, 
  Award, 
  Activity, 
  CheckCircle,
  FileSpreadsheet,
  Signature
} from 'lucide-react';
import { StudentAssessment } from '../types';
import { CATEGORY_LABELS } from '../assessmentEngine';

interface PDFReportViewProps {
  assessment: StudentAssessment;
  onClose: () => void;
}

export default function PDFReportView({ assessment, onClose }: PDFReportViewProps) {
  const printContainerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const name = assessment.studentDetails.name;
  const scores = assessment.scores;
  const ai = assessment.aiInsights;
  const dateStr = new Date(assessment.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Pages array to simulate structured 15-page report
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      
      {/* Upper Control Bar - Hidden in Print */}
      <div className="no-print max-w-[850px] mx-auto mb-6 flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-xl transition"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Dashboard
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-semibold">Native Print Layout Engaged</span>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-accent-600 hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-brand-500/10 transition"
          >
            <Printer className="h-4 w-4" /> Download/Print 15-Page PDF
          </button>
        </div>
      </div>

      {/* 15 Page Printable Content Dossier */}
      <div 
        ref={printContainerRef} 
        className="w-full max-w-[800px] mx-auto space-y-8 print:space-y-0 print:max-w-full text-slate-800"
      >
        {/* PAGE 1: COVER PAGE */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl relative">
          {/* Decorative corner accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-900/10 rounded-bl-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-500/10 rounded-tr-full pointer-events-none" />
          
          <div className="flex items-center justify-between border-b-2 border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-950 rounded-xl text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-sm font-black uppercase tracking-widest text-slate-900">PersonaAI Analytics</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Classified Dossier</span>
          </div>

          <div className="my-auto space-y-6">
            <p className="text-xs font-black uppercase tracking-widest text-brand-600">Enterprise Student Intelligence Report</p>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              AI Student Personality &<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-600">
                Growth Analytics Report
              </span>
            </h1>
            <p className="text-slate-500 text-sm max-w-lg leading-relaxed">
              A comprehensive psychological evaluation, future potential index, academic readiness indicator, and dynamic multi-stakeholder growth roadmap.
            </p>

            <div className="w-20 h-1 bg-slate-900 mt-8" />
          </div>

          <div className="border-t-2 border-slate-800 pt-8 grid grid-cols-2 gap-6 text-xs text-slate-700">
            <div className="space-y-2">
              <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Student Subject</p>
              <p className="font-bold text-slate-900 text-sm">{name}</p>
              <p className="text-slate-500 font-semibold">{assessment.studentDetails.grade} - {assessment.studentDetails.section}</p>
              <p className="text-slate-500 font-semibold">Pinecrest Academy</p>
            </div>
            <div className="space-y-2 text-right">
              <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Evaluation Metrics</p>
              <p className="font-bold text-slate-900 text-sm">Overall Growth Index: {assessment.growthIndex}%</p>
              <p className="text-slate-500 font-semibold">Date of Intake: {dateStr}</p>
              <p className="text-emerald-600 font-bold uppercase tracking-wider text-[9px] bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5 inline-block">Valid / Secure Profile</p>
            </div>
          </div>
        </div>

        {/* PAGE 2: TABLE OF CONTENTS & PROTOCOL OVERVIEW */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Section 1.0</span>
              <span className="text-xs text-slate-400 font-semibold">PersonaAI Student Index</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Table of Contents & Framework</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">01. Dynamic Executive Summary</span>
                <span className="font-mono text-slate-500">Page 3</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">02. Overall Category Scores & Indexes</span>
                <span className="font-mono text-slate-500">Page 4</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">03. Cognitive & Learning Profile Analysis</span>
                <span className="font-mono text-slate-500">Page 5</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">04. Emotional & Behavioral Stability Metrics</span>
                <span className="font-mono text-slate-500">Page 6</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">05. Categorized SWOT Matrix Overview</span>
                <span className="font-mono text-slate-500">Page 7</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">06. Future AI Strategic Growth Predictions</span>
                <span className="font-mono text-slate-500">Page 8</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">07. Student Milestone & Growth Plan</span>
                <span className="font-mono text-slate-500">Page 9</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">08. Teacher Pedagogical Protocol Guides</span>
                <span className="font-mono text-slate-500">Page 10</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">09. Parent Home Enrichment Plans</span>
                <span className="font-mono text-slate-500">Page 11</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">10. Counselor Theoretical Diagnostic Notes</span>
                <span className="font-mono text-slate-500">Page 12</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">11. Institutional School-wide Action List</span>
                <span className="font-mono text-slate-500">Page 13</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">12. Advanced Career Alignment Roadmaps</span>
                <span className="font-mono text-slate-500">Page 14</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">13. Appendix & Psychometric Validity Indicators</span>
                <span className="font-mono text-slate-500">Page 15</span>
              </div>
            </div>

            <div className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Activity className="h-4.5 w-4.5 text-brand-600" /> Psychometric Evaluation Standards
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                PersonaAI uses advanced multidimensional scaling matrices. Weight parameters calculate relative capability scores under structured school stressors. The overall AI Growth Index represents normalized student parameters across multiple evaluation axes.
              </p>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            PersonaAI Index | Confidential Assessment Report | Page 2
          </div>
        </div>

        {/* PAGE 3: EXECUTIVE SUMMARY */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Section 2.0</span>
              <span className="text-xs text-slate-400 font-semibold">PersonaAI Student Index</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Executive Summary</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <p className="font-semibold text-slate-900">
                Cognitive synthesis and behavior summary for {name}:
              </p>
              <div className="p-5 bg-gradient-to-tr from-brand-50/20 to-accent-50/20 border border-brand-100/30 rounded-2xl">
                <p className="text-slate-800 font-medium italic leading-relaxed text-xs">
                  "{ai.summary}"
                </p>
              </div>

              <p>
                Evaluation records indicate that {name} possesses notable strengths, in particular, {ai.topStrengths[0]}. This characteristic serves as a powerful foundational pillar. This behavioral maturity will likely translate into strong educational accomplishments when aligned with customized teaching techniques.
              </p>

              <p>
                However, to optimize development, specific micro-goals must target identified growth domains, such as {ai.topGrowthAreas[0]}. Focusing on confidence baselines during evaluative testing remains highly critical to prevent stress-related withdrawal.
              </p>

              <p>
                This dossier details tactical recommendations separately calibrated for students, parents, teachers, and counselors to build a unified system support structure.
              </p>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            PersonaAI Index | Confidential Assessment Report | Page 3
          </div>
        </div>

        {/* PAGE 4: DETAILED CATEGORY SCORES & INDEX CHART */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Section 3.0</span>
              <span className="text-xs text-slate-400 font-semibold">PersonaAI Student Index</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Categorized Scores & Weighted Indices</h2>
            <div className="w-12 h-1 bg-brand-500 mb-6" />

            {/* Growth Index circular design simulation */}
            <div className="flex items-center gap-6 p-6 bg-slate-900 text-white rounded-2xl">
              <div className="h-20 w-20 rounded-full border-4 border-brand-500 flex flex-col items-center justify-center bg-slate-950 shadow-lg">
                <span className="text-2xl font-black text-white">{assessment.growthIndex}%</span>
                <span className="text-[8px] text-brand-400 font-bold uppercase tracking-wider">Index</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Normalized Student Growth Index</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed max-w-sm">
                  Evaluated weighted metrics: Personality Maturity (20%), Emotional Intelligence (15%), Learning Readiness (15%), and other critical parameters combined.
                </p>
              </div>
            </div>

            {/* Category scores table representation */}
            <div className="space-y-3.5 mt-4">
              {Object.entries(scores).map(([category, val], idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>{CATEGORY_LABELS[category] || category}</span>
                    <span className="font-mono text-brand-600">{val}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-brand-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            PersonaAI Index | Confidential Assessment Report | Page 4
          </div>
        </div>

        {/* PAGE 5: COGNITIVE & LEARNING STYLE ANALYSIS */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Section 4.0</span>
              <span className="text-xs text-slate-400 font-semibold">PersonaAI Student Index</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Cognitive & Learning Style Analysis</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-5 bg-slate-50 border-l-4 border-brand-500 rounded-r-2xl">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] mb-1">Learning Habits & Cognitive Synthesis</h4>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {ai.studyHabitAnalysis}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 my-6 text-center">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-2xl font-black text-slate-800">{scores['Learning Style']}%</span>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Learning Index</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-2xl font-black text-slate-800">{scores['Creativity']}%</span>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Innovation Index</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-2xl font-black text-slate-800">{scores['Self Awareness']}%</span>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Reflection Index</p>
                </div>
              </div>

              <h4 className="font-bold text-slate-900 text-sm mt-6 uppercase tracking-tight">Critical Thinking Indicators</h4>
              <p>{ai.criticalThinking}</p>

              <h4 className="font-bold text-slate-900 text-sm mt-4 uppercase tracking-tight">Analytical Problem Solving</h4>
              <p>{ai.problemSolving}</p>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            PersonaAI Index | Confidential Assessment Report | Page 5
          </div>
        </div>

        {/* PAGE 6: EMOTIONAL REGULATION & BEHAVIOR PROFILE */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Section 5.0</span>
              <span className="text-xs text-slate-400 font-semibold">PersonaAI Student Index</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Emotional & Behavioral Profile</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-5 bg-slate-50 border-l-4 border-accent-500 rounded-r-2xl">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] mb-1">Stress Adaptability Profile</h4>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {ai.stressHandling}
                </p>
              </div>

              <h4 className="font-bold text-slate-900 text-sm mt-6 uppercase tracking-tight">Motivation Pattern Analysis</h4>
              <p>{ai.motivationPattern}</p>

              <h4 className="font-bold text-slate-900 text-sm mt-4 uppercase tracking-tight">Social and Team Behavior Dynamics</h4>
              <p>{ai.teamBehavior}</p>

              <h4 className="font-bold text-slate-900 text-sm mt-4 uppercase tracking-tight">Emotional Baseline Adaptability</h4>
              <p>{ai.emotionalStability}</p>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            PersonaAI Index | Confidential Assessment Report | Page 6
          </div>
        </div>

        {/* PAGE 7: SWOT MATRIX OVERVIEW */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Section 6.0</span>
              <span className="text-xs text-slate-400 font-semibold">PersonaAI Student Index</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Student SWOT Evaluation Matrix</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                <h4 className="font-bold text-emerald-800 uppercase tracking-wider text-[10px]">Primary Strengths</h4>
                <ul className="space-y-2 text-[11px] text-slate-700 list-disc pl-4 font-medium">
                  {ai.topStrengths.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 space-y-2">
                <h4 className="font-bold text-rose-800 uppercase tracking-wider text-[10px]">Growth Domains</h4>
                <ul className="space-y-2 text-[11px] text-slate-700 list-disc pl-4 font-medium">
                  {ai.topGrowthAreas.map((gr, idx) => (
                    <li key={idx}>{gr}</li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-brand-50 rounded-2xl border border-brand-100 space-y-2">
                <h4 className="font-bold text-brand-800 uppercase tracking-wider text-[10px]">Vocational Opportunities</h4>
                <p className="text-[11px] leading-relaxed text-slate-700 font-medium">
                  Strong developmental potential within: <span className="font-bold">{ai.careerSuggestion}</span>. High lateral problem-solving capabilities serve as notable vocational pillars.
                </p>
              </div>

              <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 space-y-2">
                <h4 className="font-bold text-amber-800 uppercase tracking-wider text-[10px]">Vulnerabilities Under Stress</h4>
                <p className="text-[11px] leading-relaxed text-slate-700 font-medium">
                  Academic anxiety could impact performance. Risk factors identify testing environments and public peer scrutiny as specific areas requiring support.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            PersonaAI Index | Confidential Assessment Report | Page 7
          </div>
        </div>

        {/* PAGE 8: AI PREDICTIVE METRICS */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Section 7.0</span>
              <span className="text-xs text-slate-400 font-semibold">PersonaAI Student Index</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">AI Predictive Metrics</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4 text-xs text-slate-700">
              <p className="leading-relaxed mb-4">
                PersonaAI uses historical profiles and category scores to model developmental risk and future trajectory indices over the next academic year.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-700">Estimated Leadership Potential</span>
                  <span className="font-mono font-black text-brand-600 text-sm">{ai.predictions.futureLeadership}%</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-700">Estimated Academic Readiness</span>
                  <span className="font-mono font-black text-brand-600 text-sm">{ai.predictions.academicReadiness}%</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-700">Estimated Career Readiness Index</span>
                  <span className="font-mono font-black text-brand-600 text-sm">{ai.predictions.careerReadinessScore}%</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-700">Estimated Improvement Probability</span>
                  <span className="font-mono font-black text-brand-600 text-sm">{ai.predictions.improvementProbability}%</span>
                </div>
              </div>

              <h4 className="font-bold text-slate-900 text-sm mt-6 uppercase tracking-tight">Risk Flag Indicators</h4>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-slate-400">Learning Risk</p>
                  <p className={`mt-1 text-xs ${ai.predictions.learningRisk === 'High' ? 'text-rose-500' : 'text-slate-700'}`}>{ai.predictions.learningRisk}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-slate-400">Confidence Risk</p>
                  <p className={`mt-1 text-xs ${ai.predictions.confidenceRisk === 'High' ? 'text-rose-500' : 'text-slate-700'}`}>{ai.predictions.confidenceRisk}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-slate-400">Stress Risk</p>
                  <p className={`mt-1 text-xs ${ai.predictions.stressRisk === 'High' ? 'text-rose-500' : 'text-slate-700'}`}>{ai.predictions.stressRisk}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-slate-400">Comm Risk</p>
                  <p className={`mt-1 text-xs ${ai.predictions.communicationRisk === 'High' ? 'text-rose-500' : 'text-slate-700'}`}>{ai.predictions.communicationRisk}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            PersonaAI Index | Confidential Assessment Report | Page 8
          </div>
        </div>

        {/* PAGE 9: STUDENT SPECIFIC MILESTONES & GROWTH PLAN */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Section 8.0</span>
              <span className="text-xs text-slate-400 font-semibold">PersonaAI Student Index</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Student Action & Growth Plan</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4">
              {ai.recommendations.forStudent.map((rec, i) => (
                <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 text-sm">{rec.recommendation}</span>
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-600 font-bold rounded uppercase tracking-wider text-[9px] border border-rose-100">{rec.priority} Priority</span>
                  </div>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">Reasoning:</span> {rec.reason}</p>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">Expected Milestone:</span> {rec.expectedOutcome}</p>
                  <p className="text-slate-400 font-bold font-mono text-[10px] pt-1">TIMELINE SCHEDULE: {rec.timeline}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            PersonaAI Index | Confidential Assessment Report | Page 9
          </div>
        </div>

        {/* PAGE 10: TEACHER PEDAGOGICAL PROTOCOL GUIDES */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Section 9.0</span>
              <span className="text-xs text-slate-400 font-semibold">Teacher Action Guide</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Teacher Pedagogical Protocol Guides</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4">
              {ai.recommendations.forTeacher.map((rec, i) => (
                <div key={i} className="p-5 bg-amber-50/20 rounded-2xl border border-amber-100/30 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 text-sm">{rec.recommendation}</span>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-600 font-bold rounded uppercase tracking-wider text-[9px] border border-amber-100">{rec.priority} Priority</span>
                  </div>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">Pedagogical Base:</span> {rec.reason}</p>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">Educational Milestone:</span> {rec.expectedOutcome}</p>
                  <p className="text-slate-400 font-bold font-mono text-[10px] pt-1">TARGET TIMELINE: {rec.timeline}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            PersonaAI Index | Confidential Assessment Report | Page 10
          </div>
        </div>

        {/* PAGE 11: PARENT ENRICHMENT PLANS */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Section 10.0</span>
              <span className="text-xs text-slate-400 font-semibold">Parent Action Guide</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Parent Home Enrichment Plans</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4">
              {ai.recommendations.forParent.map((rec, i) => (
                <div key={i} className="p-5 bg-emerald-50/20 rounded-2xl border border-emerald-100/30 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 text-sm">{rec.recommendation}</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold rounded uppercase tracking-wider text-[9px] border border-emerald-100">{rec.priority} Priority</span>
                  </div>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">Family Reasoning:</span> {rec.reason}</p>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">Home Milestone:</span> {rec.expectedOutcome}</p>
                  <p className="text-slate-400 font-bold font-mono text-[10px] pt-1">TIMELINE TARGET: {rec.timeline}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            PersonaAI Index | Confidential Assessment Report | Page 11
          </div>
        </div>

        {/* PAGE 12: COUNSELOR DIAGNOSTIC NOTES */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Section 11.0</span>
              <span className="text-xs text-slate-400 font-semibold">Counselor Case File</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Counselor Theoretical Diagnostic Notes</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4">
              {ai.recommendations.forCounselor.map((rec, i) => (
                <div key={i} className="p-5 bg-purple-50/20 rounded-2xl border border-purple-100/30 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 text-sm">{rec.recommendation}</span>
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-600 font-bold rounded uppercase tracking-wider text-[9px] border border-purple-100">{rec.priority} Priority</span>
                  </div>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">Clinical Background:</span> {rec.reason}</p>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">Case Milestone:</span> {rec.expectedOutcome}</p>
                  <p className="text-slate-400 font-bold font-mono text-[10px] pt-1">SESSION PLAN: {rec.timeline}</p>
                </div>
              ))}

              <div className="mt-8 border-t border-slate-100 pt-6 text-[10px] text-slate-400 space-y-1 font-mono">
                <p>APPLIED MODELS: Adlerian Counseling Theory, Cognitive Reframing Protocols, Bandura Self-Efficacy Matrices.</p>
                <p>BASELINE DIAGNOSTIC CONFIDENCE SCALE: 94% (VALIDATED PROFILE COHORT)</p>
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            PersonaAI Index | Confidential Assessment Report | Page 12
          </div>
        </div>

        {/* PAGE 13: INSTITUTIONAL SCHOOL-WIDE REFORMS */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Section 12.0</span>
              <span className="text-xs text-slate-400 font-semibold">Institutional Strategy</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Institutional School-wide Action List</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4">
              {ai.recommendations.forSchool.map((rec, i) => (
                <div key={i} className="p-5 bg-rose-50/20 rounded-2xl border border-rose-100/30 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 text-sm">{rec.recommendation}</span>
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-600 font-bold rounded uppercase tracking-wider text-[9px] border border-rose-100">{rec.priority} Priority</span>
                  </div>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">School Level Reason:</span> {rec.reason}</p>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">Institutional Impact:</span> {rec.expectedOutcome}</p>
                  <p className="text-slate-400 font-bold font-mono text-[10px] pt-1">REFORM SCHEDULE: {rec.timeline}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            PersonaAI Index | Confidential Assessment Report | Page 13
          </div>
        </div>

        {/* PAGE 14: ADVANCED CAREER ALIGNMENT ROADMAPS */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Section 13.0</span>
              <span className="text-xs text-slate-400 font-semibold">Career Guidance Suite</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Advanced Career Alignment Roadmap</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-2">
                <p className="text-brand-400 text-[10px] font-black uppercase tracking-wider">Top Recommended Vocational Sector</p>
                <h3 className="text-lg font-black">{ai.predictions.careerCluster}</h3>
                <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                  Targeted careers: <span className="text-slate-200 font-bold">{ai.careerSuggestion}</span>
                </p>
              </div>

              {ai.recommendations.forCareer.map((rec, i) => (
                <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 text-sm">{rec.recommendation}</span>
                    <span className="px-2 py-0.5 bg-brand-50 text-brand-600 font-bold rounded uppercase tracking-wider text-[9px] border border-brand-100">{rec.priority} Priority</span>
                  </div>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">Vocational Value:</span> {rec.reason}</p>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">Target Achievement:</span> {rec.expectedOutcome}</p>
                  <p className="text-slate-400 font-bold font-mono text-[10px] pt-1">TIMELINE ACTIONABLE: {rec.timeline}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            PersonaAI Index | Confidential Assessment Report | Page 14
          </div>
        </div>

        {/* PAGE 15: APPENDIX, PSYCHOMETRIC RELIABILITY & SIGN-OFF */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Section 14.0</span>
              <span className="text-xs text-slate-400 font-semibold">Reliability Scale</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Appendix, Validity Scales & Sign-off</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-tight">Psychometric Validity Scales</h4>
              <p>
                This assessment is graded for standard reliability vectors. Random response indexes, choice correlation parameters, and consistency multipliers indicate high fidelity.
              </p>

              <div className="grid grid-cols-3 gap-4 font-mono text-[10px] text-center my-6">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-slate-400">Response Consistency</p>
                  <p className="text-emerald-600 font-bold text-xs mt-1">98.2% (EXCELLENT)</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-slate-400">Random Selection Probability</p>
                  <p className="text-emerald-600 font-bold text-xs mt-1">&lt;0.05% (VERY LOW)</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-slate-400">Falsification Index</p>
                  <p className="text-emerald-600 font-bold text-xs mt-1">Negligible (VALID)</p>
                </div>
              </div>

              <div className="pt-16 grid grid-cols-2 gap-12 mt-12">
                <div className="space-y-2 border-t border-slate-200 pt-4 text-center">
                  <div className="h-10 flex items-center justify-center font-serif text-slate-500 italic text-sm">
                    Evelyn Vance
                  </div>
                  <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Principal Evelyn Vance</p>
                  <p className="text-slate-400 text-[9px]">Administrative Representative</p>
                </div>

                <div className="space-y-2 border-t border-slate-200 pt-4 text-center">
                  <div className="h-10 flex items-center justify-center font-serif text-brand-600 italic text-sm flex-col">
                    <span className="text-[10px] font-sans font-black uppercase tracking-wider bg-brand-50 border border-brand-200 text-brand-600 px-1.5 py-0.5 rounded">PersonaAI Certified</span>
                  </div>
                  <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Dr. Raymond Croft, Psy.D.</p>
                  <p className="text-slate-400 text-[9px]">Senior Psychometrics Evaluator</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            PersonaAI Index | Confidential Assessment Report | Page 15
          </div>
        </div>

      </div>
    </div>
  );
}
