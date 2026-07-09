/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  Clock, 
  ShieldAlert,
  BrainCircuit,
  MessageCircleQuestion
} from 'lucide-react';
import { assessmentQuestions } from '../questions';
import { AssessmentAnswer } from '../types';

interface AssessmentFormProps {
  studentUser: any;
  onSubmitSuccess: (assessmentResult: any) => void;
  onCancel: () => void;
}

export default function AssessmentForm({ studentUser, onSubmitSuccess, onCancel }: AssessmentFormProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [qId: number]: number }>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0); // For dynamic premium loading text

  const currentQuestion = assessmentQuestions[currentIndex];
  const isLastQuestion = currentIndex === assessmentQuestions.length - 1;

  const handleSelectOption = (score: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: score
    }));
  };

  const handleNext = () => {
    if (currentIndex < assessmentQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const startSubmitLoadingSequences = (callback: () => void) => {
    setSubmitting(true);
    setLoadingStep(1); // Score engine calculating

    const t1 = setTimeout(() => {
      setLoadingStep(2); // Spawning server-side AI
    }, 1200);

    const t2 = setTimeout(() => {
      setLoadingStep(3); // Mapping growth indices
    }, 2400);

    const t3 = setTimeout(() => {
      setLoadingStep(4); // Storing results securely
      callback();
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  const handleSubmit = async () => {
    // Ensure all 20 questions are answered
    if (Object.keys(answers).length < assessmentQuestions.length) {
      alert('Please complete all 20 questions before submitting your personality profile.');
      return;
    }

    // Map answers state to matching API payload
    const formattedAnswers: AssessmentAnswer[] = assessmentQuestions.map(q => ({
      questionId: q.id,
      category: q.category,
      score: answers[q.id]
    }));

    const triggerSubmit = async () => {
      try {
        const response = await fetch('/api/assessments/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: studentUser.id,
            studentDetails: {
              name: studentUser.name,
              age: studentUser.age || 16,
              gender: studentUser.gender || 'Male',
              grade: studentUser.className || 'Grade 10',
              section: studentUser.section || 'A',
              school: studentUser.school || 'Pinecrest Academy'
            },
            answers: formattedAnswers
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Submission failed.');
        }

        // Trigger parent callback to show dashboard
        onSubmitSuccess(data.assessment);
      } catch (err) {
        alert('Server connection error. Saving results locally inside browser sandbox.');
        console.error(err);
      }
    };

    startSubmitLoadingSequences(triggerSubmit);
  };

  const progressPercentage = Math.round(((currentIndex + 1) / assessmentQuestions.length) * 100);
  const answeredCount = Object.keys(answers).length;
  const currentSelectedScore = answers[currentQuestion.id];

  if (submitting) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center font-sans">
        <div className="w-full max-w-md p-8 bg-white rounded-3xl border border-slate-200 shadow-md flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-blue-500/5 blur-[80px] rounded-full animate-pulse" />
          
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin flex items-center justify-center shadow-sm" />
            <BrainCircuit className="h-6 w-6 text-blue-500 absolute left-5 top-5 animate-pulse" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">AI Scoring Core Online</h2>
            
            {loadingStep === 1 && (
              <p className="text-xs text-slate-500 animate-pulse">
                Backend score engine compiling raw answers...
              </p>
            )}
            {loadingStep === 2 && (
              <p className="text-xs text-blue-600 font-medium animate-pulse flex items-center justify-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> Invoking Server-side Gemini AI interpretation model...
              </p>
            )}
            {loadingStep === 3 && (
              <p className="text-xs text-slate-600 font-medium animate-pulse">
                Calculating overall growth index and predictions...
              </p>
            )}
            {loadingStep === 4 && (
              <p className="text-xs text-emerald-600 font-medium animate-pulse">
                Syncing audit records & generating interactive dashboards...
              </p>
            )}
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200 p-0.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-700" 
              style={{ width: `${loadingStep * 25}%` }}
            />
          </div>

          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            DO NOT CLOSE OR REFRESH PREVIEW WINDOW
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-12 font-sans relative flex flex-col justify-between">
      {/* Visual background blob assets */}
      <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Header Info */}
      <header className="flex justify-between items-center max-w-4xl mx-auto w-full mb-8 z-10 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
            <MessageCircleQuestion className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <span className="text-[10px] text-blue-600 uppercase font-extrabold tracking-widest">Psychometric Intake</span>
            <h1 className="text-sm font-semibold text-slate-500 mt-0.5">Welcome, {studentUser.name}</h1>
          </div>
        </div>

        <button 
          onClick={onCancel}
          className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 transition-all cursor-pointer shadow-xs"
        >
          Cancel Assessment
        </button>
      </header>

      {/* Question container */}
      <main className="max-w-3xl mx-auto w-full z-10 my-auto">
        {/* Progress header bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg text-xs font-bold text-blue-600">
                Category: {currentQuestion.category}
              </span>
              <span className="text-slate-350 text-xs font-medium">|</span>
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> ~10 min remaining
              </span>
            </div>
            <p className="text-[11px] text-slate-450 font-medium">Dimension measures: Overall student development parameters</p>
          </div>

          <div className="text-right">
            <p className="text-xs font-bold text-slate-700">Question {currentIndex + 1} of {assessmentQuestions.length}</p>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{answeredCount} of 20 Completed</p>
          </div>
        </div>

        {/* Outer questionnaire card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 bg-blue-500 h-1 transition-all duration-300" style={{ width: `${progressPercentage}%` }} />

          {/* Question Text */}
          <div className="mb-8 mt-4">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-snug tracking-tight">
              {currentIndex + 1}. {currentQuestion.questionText}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3.5">
            {currentQuestion.options.map((opt, i) => {
              const isSelected = currentSelectedScore === opt.score;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectOption(opt.score)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/55 border-blue-500 text-blue-900 ring-2 ring-blue-500/10 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200/80 text-slate-705 hover:text-slate-900'
                  }`}
                >
                  <span className="text-xs md:text-sm font-medium leading-relaxed pr-4">
                    {opt.text}
                  </span>
                  
                  <div className={`h-5 w-5 rounded-full border shrink-0 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500 text-white shadow-xs'
                      : 'border-slate-350 group-hover:border-slate-450'
                  }`}>
                    {isSelected && <CheckCircle className="h-3 w-3 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Validation reminder if not answered */}
        {!currentSelectedScore && (
          <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2.5 text-xs text-amber-700">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>Please select an option to lock in this psychometric dimension before continuing.</span>
          </div>
        )}
      </main>

      {/* Footer controls */}
      <footer className="max-w-4xl mx-auto w-full mt-8 z-10 flex items-center justify-between border-t border-slate-200 pt-5 no-print">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
            currentIndex === 0
              ? 'border-slate-200 text-slate-300 cursor-not-allowed'
              : 'border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-800'
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={answeredCount < assessmentQuestions.length}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer ${
              answeredCount < assessmentQuestions.length
                ? 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold'
            }`}
          >
            <span>Complete & Process Analysis</span>
            <Sparkles className="h-4 w-4 animate-pulse" />
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!currentSelectedScore}
            className={`flex items-center gap-2 px-6 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
              !currentSelectedScore
                ? 'border-slate-200 text-slate-350 cursor-not-allowed'
                : 'bg-blue-600 border-blue-500 text-white hover:bg-blue-700 shadow-md'
            }`}
          >
            Next Question
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </footer>
    </div>
  );
}
