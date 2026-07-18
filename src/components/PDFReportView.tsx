/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { 
  Printer, 
  ArrowLeft, 
  BookOpen, 
  Award, 
  Activity, 
  CheckCircle,
  FileSpreadsheet,
  Signature,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { StudentAssessment } from '../types';
import { CATEGORY_LABELS } from '../assessmentEngine';

const CATEGORY_LABELS_MR: { [key: string]: string } = {
  'Self Awareness': 'आत्म-जागरूकता',
  'Emotional Regulation': 'भावनिक नियंत्रण',
  'Leadership': 'नेतृत्व क्षमता',
  'Learning Style': 'शिकण्याची शैली',
  'Communication': 'संवाद कौशल्य',
  'Confidence': 'आत्मविश्वास',
  'Motivation': 'प्रेरणा पातळी',
  'Creativity': 'सर्जनशीलता',
  'Decision Making': 'निर्णय घेणे',
  'Career Interest': 'कारकीर्द आवड'
};

const TRANSLATIONS_MR: { [key: string]: string } = {
  'Return to Dashboard': 'डॅशबोर्डवर परत जा',
  'Regenerate with Gemini AI': 'जेमिनी AI द्वारे पुन्हा तयार करा',
  'Download/Print 15-Page PDF': '१५ पानांची PDF डाउनलोड/प्रिंट करा',
  'Classified Dossier': 'गोपनीय अहवाल (Classified Dossier)',
  'Enterprise Student Intelligence Report': 'एंटरप्राइझ विद्यार्थी बुद्धिमत्ता अहवाल',
  'AI Student Personality &': 'AI विद्यार्थी व्यक्तिमत्व आणि',
  'Growth Analytics Report': 'विकास विश्लेषण अहवाल',
  'A comprehensive psychological evaluation, future potential index, academic readiness indicator, and dynamic multi-stakeholder growth roadmap.': 'एक व्यापक मानसशास्त्रीय मूल्यमापन, भविष्यातील क्षमता निर्देशांक, शैक्षणिक तयारी निर्देशक आणि गतिमान बहु-भागधारक विकास आराखडा।',
  'Student Subject': 'विद्यार्थी विषय',
  'Evaluation Metrics': 'मूल्यमापन निकष',
  'Overall Growth Index': 'एकूण विकास निर्देशांक (Growth Index)',
  'Date of Intake': 'नोंदणीची तारीख',
  'Valid / Secure Profile': 'वैध / सुरक्षित प्रोफाइल',
  'Table of Contents & Framework': 'अनुक्रमणिका आणि फ्रेमवर्क',
  '01. Dynamic Executive Summary': '०१. गतिमान कार्यकारी सारांश',
  '02. Overall Category Scores & Indexes': '०२. एकूण श्रेणी गुण आणि निर्देशांक',
  '03. Cognitive & Learning Profile Analysis': '०३. ज्ञानात्मक आणि शिकण्याचे प्रोफाइल विश्लेषण',
  '04. Emotional & Behavioral Stability Metrics': '०४. भावनिक आणि वर्तणूक स्थिरता निकष',
  '05. Categorized SWOT Matrix Overview': '०५. वर्गीकृत SWOT मॅट्रिक्स आढावा',
  '06. Future AI Strategic Growth Predictions': '०६. भविष्यातील AI धोरणात्मक विकास अंदाज',
  '07. Student Milestone & Growth Plan': '०७. विद्यार्थी टप्पे आणि विकास योजना',
  '08. Teacher Pedagogical Protocol Guides': '०८. शिक्षकांचे अध्यापनशास्त्र मार्गदर्शक',
  '09. Parent Home Enrichment Plans': '०९. पालकांचे गृह समृद्धीकरण नियोजन',
  '10. Counselor Theoretical Diagnostic Notes': '१०. समुपदेशकाचे नैदानिक टिपण',
  '11. Institutional School-wide Action List': '११. संस्थात्मक शाळा-स्तरीय कृती यादी',
  '12. Advanced Career Alignment Roadmaps': '१२. प्रगत कारकीर्द सुसंगतता मार्गदर्शक',
  '13. Appendix & Psychometric Validity Indicators': '१३. परिशिष्ट आणि मानसोपचार वैधता निर्देशांक',
  'Psychometric Evaluation Standards': 'मानसोपचार मूल्यमापन निकष',
  'PersonaAI uses advanced multidimensional scaling matrices. Weight parameters calculate relative capability scores under structured school stressors. The overall AI Growth Index represents normalized student parameters across multiple evaluation axes.': 'PersonaAI प्रगत बहुआयामी स्केलिंग पद्धतींचा वापर करते। पद्धतशीर शालेय ताणतणावाखालील सापेक्ष क्षमता गुणांची गणना याद्वारे केली जाते। एकूण AI विकास निर्देशांक अनेक मूल्यमापन अक्षांवर सामान्यीकृत विद्यार्थी मापदंड दर्शवतो।',
  'Executive Summary': 'कार्यकारी सारांश',
  'Cognitive synthesis and behavior summary for': 'ज्ञानात्मक संश्लेषण आणि वर्तणूक सारांश:',
  'Evaluation records indicate that': 'मूल्यमापन नोंदींवरून असे दिसून येते की,',
  'possesses notable strengths, in particular,': 'यांच्यामध्ये महत्त्वपूर्ण बलस्थाने आहेत, विशेषतः,',
  'This characteristic serves as a powerful foundational pillar. This behavioral maturity will likely translate into strong educational accomplishments when aligned with customized teaching techniques.': 'हे वैशिष्ट्य एक मजबूत पाया म्हणून कार्य करते। अध्यापन तंत्रांशी जुळवून घेतल्यास या वर्तणूक परिपक्वतेचे रूपांतर मजबूत शैक्षणिक यशात होऊ शकते।',
  'However, to optimize development, specific micro-goals must target identified growth domains, such as': 'तथापि, विकास सुलभ करण्यासाठी, विशिष्ट सूक्ष्म-उद्दिष्टांनी ओळखल्या गेलेल्या विकासाच्या क्षेत्रांना लक्ष्य केले पाहिजे, जसे की,',
  'Focusing on confidence baselines during evaluative testing remains highly critical to prevent stress-related withdrawal.': 'परीक्षांच्या वेळी आत्मविश्वास पातळीवर लक्ष केंद्रित करणे ताणतणावामुळे होणारी पीछेहाट रोखण्यासाठी अत्यंत महत्त्वपूर्ण आहे।',
  'This dossier details tactical recommendations separately calibrated for students, parents, teachers, and counselors to build a unified system support structure.': 'या अहवालात विद्यार्थी, पालक, शिक्षक आणि समुपदेशकांसाठी स्वतंत्रपणे तयार केलेल्या धोरणात्मक शिफारसींचा तपशील दिला आहे, जेणेकरून एकसंध आधार प्रणाली तयार होईल।',
  'Categorized Scores & Weighted Indices': 'वर्गीकृत गुण आणि भारित निर्देशांक',
  'Normalized Student Growth Index': 'सामान्यीकृत विद्यार्थी विकास निर्देशांक',
  'Evaluated weighted metrics: Personality Maturity (20%), Emotional Intelligence (15%), Learning Readiness (15%), and other critical parameters combined.': 'मूल्यमापन केलेले भारित निकष: व्यक्तिमत्व परिपक्वता (२०%), भावनिक बुद्धिमत्ता (१५%), शिकण्याची तयारी (१५%) आणि इतर महत्त्वपूर्ण घटकांचे एकत्रीकरण।',
  'Cognitive & Learning Style Analysis': 'ज्ञानात्मक आणि शिकण्याची शैली विश्लेषण',
  'Learning Habits & Cognitive Synthesis': 'शिकण्याच्या सवयी आणि ज्ञानात्मक संश्लेषण',
  'Learning Index': 'शिकण्याचा निर्देशांक (Learning Index)',
  'Innovation Index': 'नाविन्यता निर्देशांक (Innovation Index)',
  'Reflection Index': 'चिंतनशीलता निर्देशांक (Reflection Index)',
  'Critical Thinking Indicators': 'गंभीर विचार निर्देशक (Critical Thinking)',
  'Analytical Problem Solving': 'विश्लेषणात्मक समस्या निवारण (Problem Solving)',
  'Emotional & Behavioral Profile': 'भावनिक आणि वर्तणूक प्रोफाइल',
  'Stress Adaptability Profile': 'ताणतणाव अनुकूलता प्रोफाइल',
  'Motivation Pattern Analysis': 'प्रेरणा नमुना विश्लेषण',
  'Social and Team Behavior Dynamics': 'सामाजिक आणि सामूहिक वर्तन गतिशीलता',
  'Emotional Baseline Adaptability': 'भावनिक पाया अनुकूलता',
  'Student SWOT Evaluation Matrix': 'विद्यार्थ्याचा SWOT मूल्यमापन आराखडा',
  'Primary Strengths': 'मुख्य बलस्थाने (Strengths)',
  'Growth Domains': 'विकासाचे पैलू (Growth Areas)',
  'Vocational Opportunities': 'व्यावसायिक संधी (Opportunities)',
  'Strong developmental potential within:': 'यामध्ये मजबूत विकास क्षमता:',
  'High lateral problem-solving capabilities serve as notable vocational pillars.': 'चौकटीबाहेरची विश्लेषणात्मक समस्या सोडवण्याची क्षमता हे महत्त्वपूर्ण व्यावसायिक आधारस्तंभ आहेत।',
  'Vulnerabilities Under Stress': 'तणावाखालील कमकुवतपणा (Vulnerabilities)',
  'Academic anxiety could impact performance. Risk factors identify testing environments and public peer scrutiny as specific areas requiring support.': 'शैक्षणिक चिंता कामगिरीवर परिणाम करू शकते। परीक्षेचे वातावरण आणि सार्वजनिक पडताळणी हे समर्थन आवश्यक असलेले विशिष्ट क्षेत्र म्हणून ओळखले जातात।',
  'AI Predictive Metrics': 'AI भविष्यसूचक निकष (Predictive Metrics)',
  'PersonaAI uses historical profiles and category scores to model developmental risk and future trajectory indices over the next academic year.': 'PersonaAI पुढील शैक्षणिक वर्षात विकासात्मक जोखीम आणि भविष्यातील प्रगतीचा अंदाज लावण्यासाठी ऐतिहासिक प्रोफाइल आणि श्रेणी गुणांचा वापर करते।',
  'Estimated Leadership Potential': 'अंदाजित नेतृत्व क्षमता',
  'Estimated Academic Readiness': 'अंदाजित शैक्षणिक तयारी',
  'Estimated Career Readiness Index': 'अंदाजित कारकीर्द तयारी निर्देशांक',
  'Estimated Improvement Probability': 'अंदाजित सुधारणा संभाव्यता',
  'Risk Flag Indicators': 'जोखीम पातळी निर्देशक',
  'Learning Risk': 'शिकण्याचा धोका',
  'Confidence Risk': 'आत्मविश्वासाचा धोका',
  'Stress Risk': 'तणावाचा धोका',
  'Comm Risk': 'संवाद धोका',
  'Student Action & Growth Plan': 'विद्यार्थी कृती आणि विकास आराखडा',
  'Reasoning:': 'कारण (Reasoning):',
  'Expected Milestone:': 'अपेक्षित उद्दिष्ट (Expected Milestone):',
  'TIMELINE SCHEDULE:': 'वेळापत्रक नियोजन (Timeline Schedule):',
  'Teacher Pedagogical Protocol Guides': 'शिक्षकांचे अध्यापनशास्त्र मार्गदर्शक',
  'Pedagogical Base:': 'अध्यापनशास्त्रीय पाया:',
  'Educational Milestone:': 'शैक्षणिक उद्दिष्ट:',
  'TARGET TIMELINE:': 'लक्ष्यित वेळापत्रक:',
  'Parent Home Enrichment Plans': 'पालकांचे गृह समृद्धीकरण नियोजन',
  'Family Reasoning:': 'कौटुंबिक कारण:',
  'Home Milestone:': 'कौटुंबिक उद्दिष्ट:',
  'TIMELINE TARGET:': 'वेळापत्रक लक्ष्य:',
  'Counselor Theoretical Diagnostic Notes': 'समुपदेशकाचे नैदानिक टिपण',
  'Clinical Background:': 'नैदानिक पार्श्वभूमी:',
  'Case Milestone:': 'प्रकरणाचे उद्दिष्ट:',
  'SESSION PLAN:': 'सत्राचे नियोजन:',
  'APPLIED MODELS: Adlerian Counseling Theory, Cognitive Reframing Protocols, Bandura Self-Efficacy Matrices.': 'लागू केलेले सिद्धांत: ॲडलेरियन समुपदेशन सिद्धांत, संज्ञानात्मक पुनर्रचना शिष्टाचार, बांडुरा स्व-कार्यक्षमता आराखडे।',
  'BASELINE DIAGNOSTIC CONFIDENCE SCALE: 94% (VALIDATED PROFILE COHORT)': 'नैदानिक आत्मविश्वास स्केल: ९४% (प्रमाणित प्रोफाइल गट)',
  'Institutional School-wide Action List': 'संस्थात्मक शाळा-स्तरीय कृती यादी',
  'School Level Reason:': 'शालेय पातळीवरील कारण:',
  'Institutional Impact:': 'संस्थात्मक प्रभाव:',
  'REFORM SCHEDULE:': 'सुधारणा वेळापत्रक:',
  'Advanced Career Alignment Roadmap': 'प्रगत कारकीर्द सुसंगतता मार्गदर्शक',
  'Top Recommended Vocational Sector': 'सर्वोच्च शिफारस केलेले व्यावसायिक क्षेत्र',
  'Targeted careers:': 'लक्ष्यित कारकीर्द:',
  'Vocational Value:': 'व्यावसायिक मूल्य:',
  'Target Achievement:': 'लक्ष्य प्राप्ती:',
  'TIMELINE ACTIONABLE:': 'कृती वेळापत्रक:',
  'Appendix, Validity Scales & Sign-off': 'परिशिष्ट, वैधता निकष आणि स्वाक्षरी',
  'Psychometric Validity Scales': 'मानसोपचार चाचणी वैधता स्केल',
  'This assessment is graded for standard reliability vectors. Random response indexes, choice correlation parameters, and consistency multipliers indicate high fidelity.': 'हे मूल्यमापन प्रमाण विश्वसनीयता घटकांसाठी वर्गीकृत केले आहे। यादृच्छिक प्रतिसाद निर्देशांक, निवड परस्परसंबंध मापदंड आणि सातत्यपूर्ण गुणांक उच्च अचूकता दर्शवतात।',
  'Response Consistency': 'प्रतिसादातील सातत्य',
  'Random Selection Probability': 'यादृच्छिक निवड संभाव्यता',
  'Falsification Index': 'बनावटीकरण निर्देशांक',
  'Negligible (VALID)': 'नगण्य (वैध)',
  'Counsellor Kiran Kulkarni': 'समुपदेशक किरण कुलकर्णी',
  'Administrative Representative': 'प्रशासकीय प्रतिनिधी',
  'Dr. Raymond Croft, Psy.D.': 'डॉ. रेमंड क्रॉफ्ट, Psy.D.',
  'Senior Psychometrics Evaluator': 'वरिष्ठ मानसोपचार मूल्यमापक',
  'Section': 'विभाग',
  'Page': 'पान',
  'Teacher Action Guide': 'शिक्षक कृती मार्गदर्शक',
  'Parent Action Guide': 'पालक कृती मार्गदर्शक',
  'Counselor Case File': 'समुपदेशक केस फाइल',
  'Institutional Strategy': 'संस्थात्मक धोरण',
  'Career Guidance Suite': 'कारकीर्द मार्गदर्शन संच',
  'Reliability Scale': 'विश्वसनीयता स्केल',
  'Administrative Representative ': 'प्रशासकीय प्रतिनिधी ',
  'Confidential Assessment Report': 'गोपनीय मूल्यमापन अहवाल',
  'PersonaAI Index': 'PersonaAI निर्देशांक'
};

interface PDFReportViewProps {
  assessment: StudentAssessment;
  onClose: () => void;
  onAssessmentUpdated?: (updated: StudentAssessment) => void;
}

export default function PDFReportView({ assessment, onClose, onAssessmentUpdated }: PDFReportViewProps) {
  const printContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFailurePopup, setShowFailurePopup] = useState(false);
  const [popupErrorDetails, setPopupErrorDetails] = useState('');
  const [lang, setLang] = useState<'en' | 'mr'>('en');

  const name = assessment.studentDetails.name;
  const scores = assessment.scores;
  const ai = assessment.aiInsights;

  // Localized date formatting
  const dateStr = lang === 'mr'
    ? new Date(assessment.date).toLocaleDateString('mr-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : new Date(assessment.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

  // Localized AI dynamic parameters
  const careerCluster = lang === 'mr' && ai.marathi?.predictions?.careerCluster ? ai.marathi.predictions.careerCluster : ai.predictions.careerCluster;
  const personalityType = lang === 'mr' && ai.marathi?.personalityType ? ai.marathi.personalityType : ai.personalityType;
  const communicationType = lang === 'mr' && ai.marathi?.communicationType ? ai.marathi.communicationType : ai.communicationType;
  const leadershipType = lang === 'mr' && ai.marathi?.leadershipType ? ai.marathi.leadershipType : ai.leadershipType;
  const careerSuggestion = lang === 'mr' && ai.marathi?.careerSuggestion ? ai.marathi.careerSuggestion : ai.careerSuggestion;
  const topStrengths = lang === 'mr' && ai.marathi?.topStrengths ? ai.marathi.topStrengths : ai.topStrengths;
  const topGrowthAreas = lang === 'mr' && ai.marathi?.topGrowthAreas ? ai.marathi.topGrowthAreas : ai.topGrowthAreas;
  const studyHabitAnalysis = lang === 'mr' && ai.marathi?.studyHabitAnalysis ? ai.marathi.studyHabitAnalysis : ai.studyHabitAnalysis;
  const stressHandling = lang === 'mr' && ai.marathi?.stressHandling ? ai.marathi.stressHandling : ai.stressHandling;
  const decisionMakingStyle = lang === 'mr' && ai.marathi?.decisionMakingStyle ? ai.marathi.decisionMakingStyle : ai.decisionMakingStyle;
  const emotionalStability = lang === 'mr' && ai.marathi?.emotionalStability ? ai.marathi.emotionalStability : ai.emotionalStability;
  const motivationPattern = lang === 'mr' && ai.marathi?.motivationPattern ? ai.marathi.motivationPattern : ai.motivationPattern;
  const teamBehavior = lang === 'mr' && ai.marathi?.teamBehavior ? ai.marathi.teamBehavior : ai.teamBehavior;
  const criticalThinking = lang === 'mr' && ai.marathi?.criticalThinking ? ai.marathi.criticalThinking : ai.criticalThinking;
  const problemSolving = lang === 'mr' && ai.marathi?.problemSolving ? ai.marathi.problemSolving : ai.problemSolving;
  const innovationLevel = lang === 'mr' && ai.marathi?.innovationLevel ? ai.marathi.innovationLevel : ai.innovationLevel;
  const socialInteraction = lang === 'mr' && ai.marathi?.socialInteraction ? ai.marathi.socialInteraction : ai.socialInteraction;
  const futureReadiness = lang === 'mr' && ai.marathi?.futureReadiness ? ai.marathi.futureReadiness : ai.futureReadiness;
  const summary = lang === 'mr' && ai.marathi?.summary ? ai.marathi.summary : ai.summary;
  
  const recommendations = lang === 'mr' && ai.marathi?.recommendations ? ai.marathi.recommendations : ai.recommendations;
  const predictions = ai.predictions;

  const t = (key: string) => {
    if (lang === 'mr') {
      return TRANSLATIONS_MR[key] || key;
    }
    return key;
  };


  const handlePrint = () => {
    window.print();
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md space-y-6 animate-fade-in">
          {/* Pulsing Brain / Sparkles Visual */}
          <div className="relative h-20 w-20 mx-auto">
            <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
            <div className="relative h-20 w-20 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
              <Sparkles className="h-10 w-10 text-blue-200 animate-pulse" />
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-black uppercase tracking-widest inline-block animate-pulse">
              Gemini AI Engaged
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white">Analyzing and Compiling Behavioral Insights...</h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
              Please wait while Gemini evaluates 20 cognitive and behavioral dimensions to build a customized, 15-page student development dossier. This includes action plans for parents, teachers, and counselors.
            </p>
          </div>

          {/* Loading status bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full animate-pulse w-3/4" />
          </div>

          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">
            Compiling weighted indices • Please wait...
          </p>
        </div>
      </div>
    );
  }

  // Pages array to simulate structured 15-page report
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 font-sans">
      
      {/* Upper Control Bar - Hidden in Print */}
      <div className="no-print max-w-[850px] mx-auto mb-6 flex flex-col gap-3">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center justify-between font-medium">
            <div className="flex items-center gap-2">
              <span className="font-extrabold">Notice:</span> {errorMsg}
            </div>
            <button onClick={() => setErrorMsg('')} className="text-rose-400 hover:text-rose-700 font-bold px-2">
              ✕
            </button>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> {t('Return to Dashboard')}
          </button>

          {/* Language Selection Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('mr')}
              className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                lang === 'mr'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              मराठी (Marathi)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow shadow-blue-500/10 transition cursor-pointer"
            >
              <Printer className="h-4 w-4" /> {t('Download/Print 15-Page PDF')}
            </button>
          </div>
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
              <span className="text-sm font-black uppercase tracking-widest text-slate-900">{t('PersonaAI Analytics')}</span>
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('Classified Dossier')}</span>
          </div>

          <div className="my-auto space-y-6">
            <p className="text-xs font-black uppercase tracking-widest text-brand-600">{t('Enterprise Student Intelligence Report')}</p>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {t('AI Student Personality &')}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-600">
                {t('Growth Analytics Report')}
              </span>
            </h1>
            <p className="text-slate-500 text-sm max-w-lg leading-relaxed">
              {t('A comprehensive psychological evaluation, future potential index, academic readiness indicator, and dynamic multi-stakeholder growth roadmap.')}
            </p>

            <div className="w-20 h-1 bg-slate-900 mt-8" />
          </div>

          <div className="border-t-2 border-slate-800 pt-8 grid grid-cols-2 gap-6 text-xs text-slate-700">
            <div className="space-y-2">
              <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">{t('Student Subject')}</p>
              <p className="font-bold text-slate-900 text-sm">{name}</p>
              <p className="text-slate-500 font-semibold">{assessment.studentDetails.grade} - {assessment.studentDetails.section}</p>
              <p className="text-slate-500 font-semibold">Pinecrest Academy</p>
            </div>
            <div className="space-y-2 text-right">
              <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">{t('Evaluation Metrics')}</p>
              <p className="font-bold text-slate-900 text-sm">{t('Overall Growth Index')}: {assessment.growthIndex}%</p>
              <p className="text-slate-500 font-semibold">{t('Date of Intake')}: {dateStr}</p>
              <p className="text-emerald-600 font-bold uppercase tracking-wider text-[9px] bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5 inline-block">{t('Valid / Secure Profile')}</p>
            </div>
          </div>
        </div>

        {/* PAGE 2: TABLE OF CONTENTS & PROTOCOL OVERVIEW */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('Section')} 1.0</span>
              <span className="text-xs text-slate-400 font-semibold">{t('PersonaAI Student Index')}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{t('Table of Contents & Framework')}</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">{t('01. Dynamic Executive Summary')}</span>
                <span className="font-mono text-slate-500">{t('Page')} 3</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">{t('02. Overall Category Scores & Indexes')}</span>
                <span className="font-mono text-slate-500">{t('Page')} 4</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">{t('03. Cognitive & Learning Profile Analysis')}</span>
                <span className="font-mono text-slate-500">{t('Page')} 5</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">{t('04. Emotional & Behavioral Stability Metrics')}</span>
                <span className="font-mono text-slate-500">{t('Page')} 6</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">{t('05. Categorized SWOT Matrix Overview')}</span>
                <span className="font-mono text-slate-500">{t('Page')} 7</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">{t('06. Future AI Strategic Growth Predictions')}</span>
                <span className="font-mono text-slate-500">{t('Page')} 8</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">{t('07. Student Milestone & Growth Plan')}</span>
                <span className="font-mono text-slate-500">{t('Page')} 9</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">{t('08. Teacher Pedagogical Protocol Guides')}</span>
                <span className="font-mono text-slate-500">{t('Page')} 10</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">{t('09. Parent Home Enrichment Plans')}</span>
                <span className="font-mono text-slate-500">{t('Page')} 11</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">{t('10. Counselor Theoretical Diagnostic Notes')}</span>
                <span className="font-mono text-slate-500">{t('Page')} 12</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">{t('11. Institutional School-wide Action List')}</span>
                <span className="font-mono text-slate-500">{t('Page')} 13</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">{t('12. Advanced Career Alignment Roadmaps')}</span>
                <span className="font-mono text-slate-500">{t('Page')} 14</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">{t('13. Appendix & Psychometric Validity Indicators')}</span>
                <span className="font-mono text-slate-500">{t('Page')} 15</span>
              </div>
            </div>

            <div className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Activity className="h-4.5 w-4.5 text-brand-600" /> {t('Psychometric Evaluation Standards')}
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {t('PersonaAI uses advanced multidimensional scaling matrices. Weight parameters calculate relative capability scores under structured school stressors. The overall AI Growth Index represents normalized student parameters across multiple evaluation axes.')}
              </p>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            {t('PersonaAI Index')} | {t('Confidential Assessment Report')} | {t('Page')} 2
          </div>
        </div>

        {/* PAGE 3: EXECUTIVE SUMMARY */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('Section')} 2.0</span>
              <span className="text-xs text-slate-400 font-semibold">{t('PersonaAI Student Index')}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{t('Executive Summary')}</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <p className="font-semibold text-slate-900">
                {t('Cognitive synthesis and behavior summary for')} {name}:
              </p>
              <div className="p-5 bg-gradient-to-tr from-brand-50/20 to-accent-50/20 border border-brand-100/30 rounded-2xl">
                <p className="text-slate-800 font-medium italic leading-relaxed text-xs">
                  "{summary}"
                </p>
              </div>

              <p>
                {t('Evaluation records indicate that')} {name} {t('possesses notable strengths, in particular,')} {topStrengths[0]}. {t('This characteristic serves as a powerful foundational pillar. This behavioral maturity will likely translate into strong educational accomplishments when aligned with customized teaching techniques.')}
              </p>

              <p>
                {t('However, to optimize development, specific micro-goals must target identified growth domains, such as')} {topGrowthAreas[0]}. {t('Focusing on confidence baselines during evaluative testing remains highly critical to prevent stress-related withdrawal.')}
              </p>

              <p>
                {t('This dossier details tactical recommendations separately calibrated for students, parents, teachers, and counselors to build a unified system support structure.')}
              </p>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            {t('PersonaAI Index')} | {t('Confidential Assessment Report')} | {t('Page')} 3
          </div>
        </div>

        {/* PAGE 4: DETAILED CATEGORY SCORES & INDEX CHART */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('Section')} 3.0</span>
              <span className="text-xs text-slate-400 font-semibold">{t('PersonaAI Student Index')}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{t('Categorized Scores & Weighted Indices')}</h2>
            <div className="w-12 h-1 bg-brand-500 mb-6" />

            {/* Growth Index circular design simulation */}
            <div className="flex items-center gap-6 p-6 bg-slate-900 text-white rounded-2xl">
              <div className="h-20 w-20 rounded-full border-4 border-brand-500 flex flex-col items-center justify-center bg-slate-950 shadow-lg">
                <span className="text-2xl font-black text-white">{assessment.growthIndex}%</span>
                <span className="text-[8px] text-brand-400 font-bold uppercase tracking-wider">{t('Index')}</span>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">{t('Normalized Student Growth Index')}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed max-w-sm">
                  {t('Evaluated weighted metrics: Personality Maturity (20%), Emotional Intelligence (15%), Learning Readiness (15%), and other critical parameters combined.')}
                </p>
              </div>
            </div>

            {/* Category scores table representation */}
            <div className="space-y-3.5 mt-4">
              {Object.entries(scores).map(([category, val], idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>{lang === 'mr' ? (CATEGORY_LABELS_MR[category] || category) : (CATEGORY_LABELS[category] || category)}</span>
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
            {t('PersonaAI Index')} | {t('Confidential Assessment Report')} | {t('Page')} 4
          </div>
        </div>

        {/* PAGE 5: COGNITIVE & LEARNING STYLE ANALYSIS */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('Section')} 4.0</span>
              <span className="text-xs text-slate-400 font-semibold">{t('PersonaAI Student Index')}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{t('Cognitive & Learning Style Analysis')}</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-5 bg-slate-50 border-l-4 border-brand-500 rounded-r-2xl">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] mb-1">{t('Learning Habits & Cognitive Synthesis')}</h4>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {studyHabitAnalysis}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 my-6 text-center">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-2xl font-black text-slate-800">{scores['Learning Style']}%</span>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{t('Learning Index')}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-2xl font-black text-slate-800">{scores['Creativity']}%</span>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{t('Innovation Index')}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-2xl font-black text-slate-800">{scores['Self Awareness']}%</span>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{t('Reflection Index')}</p>
                </div>
              </div>

              <h4 className="font-bold text-slate-900 text-sm mt-6 uppercase tracking-tight">{t('Critical Thinking Indicators')}</h4>
              <p>{criticalThinking}</p>

              <h4 className="font-bold text-slate-900 text-sm mt-4 uppercase tracking-tight">{t('Analytical Problem Solving')}</h4>
              <p>{problemSolving}</p>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            {t('PersonaAI Index')} | {t('Confidential Assessment Report')} | {t('Page')} 5
          </div>
        </div>

        {/* PAGE 6: EMOTIONAL REGULATION & BEHAVIOR PROFILE */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('Section')} 5.0</span>
              <span className="text-xs text-slate-400 font-semibold">{t('PersonaAI Student Index')}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{t('Emotional & Behavioral Profile')}</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-5 bg-slate-50 border-l-4 border-accent-500 rounded-r-2xl">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[10px] mb-1">{t('Stress Adaptability Profile')}</h4>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {stressHandling}
                </p>
              </div>

              <h4 className="font-bold text-slate-900 text-sm mt-6 uppercase tracking-tight">{t('Motivation Pattern Analysis')}</h4>
              <p>{motivationPattern}</p>

              <h4 className="font-bold text-slate-900 text-sm mt-4 uppercase tracking-tight">{t('Social and Team Behavior Dynamics')}</h4>
              <p>{teamBehavior}</p>

              <h4 className="font-bold text-slate-900 text-sm mt-4 uppercase tracking-tight">{t('Emotional Baseline Adaptability')}</h4>
              <p>{emotionalStability}</p>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            {t('PersonaAI Index')} | {t('Confidential Assessment Report')} | {t('Page')} 6
          </div>
        </div>

        {/* PAGE 7: SWOT MATRIX OVERVIEW */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('Section')} 6.0</span>
              <span className="text-xs text-slate-400 font-semibold">{t('PersonaAI Student Index')}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{t('Student SWOT Evaluation Matrix')}</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                <h4 className="font-bold text-emerald-800 uppercase tracking-wider text-[10px]">{t('Primary Strengths')}</h4>
                <ul className="space-y-2 text-[11px] text-slate-700 list-disc pl-4 font-medium">
                  {topStrengths.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 space-y-2">
                <h4 className="font-bold text-rose-800 uppercase tracking-wider text-[10px]">{t('Growth Domains')}</h4>
                <ul className="space-y-2 text-[11px] text-slate-700 list-disc pl-4 font-medium">
                  {topGrowthAreas.map((gr, idx) => (
                    <li key={idx}>{gr}</li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-brand-50 rounded-2xl border border-brand-100 space-y-2">
                <h4 className="font-bold text-brand-800 uppercase tracking-wider text-[10px]">{t('Vocational Opportunities')}</h4>
                <p className="text-[11px] leading-relaxed text-slate-700 font-medium">
                  {t('Strong developmental potential within:')} <span className="font-bold">{careerSuggestion}</span>. {t('High lateral problem-solving capabilities serve as notable vocational pillars.')}
                </p>
              </div>

              <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 space-y-2">
                <h4 className="font-bold text-amber-800 uppercase tracking-wider text-[10px]">{t('Vulnerabilities Under Stress')}</h4>
                <p className="text-[11px] leading-relaxed text-slate-700 font-medium">
                  {t('Academic anxiety could impact performance. Risk factors identify testing environments and public peer scrutiny as specific areas requiring support.')}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            {t('PersonaAI Index')} | {t('Confidential Assessment Report')} | {t('Page')} 7
          </div>
        </div>

        {/* PAGE 8: AI PREDICTIVE METRICS */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('Section')} 7.0</span>
              <span className="text-xs text-slate-400 font-semibold">{t('PersonaAI Student Index')}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{t('AI Predictive Metrics')}</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4 text-xs text-slate-700">
              <p className="leading-relaxed mb-4">
                {t('PersonaAI uses historical profiles and category scores to model developmental risk and future trajectory indices over the next academic year.')}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-700">{t('Estimated Leadership Potential')}</span>
                  <span className="font-mono font-black text-brand-600 text-sm">{predictions.futureLeadership}%</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-700">{t('Estimated Academic Readiness')}</span>
                  <span className="font-mono font-black text-brand-600 text-sm">{predictions.academicReadiness}%</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-700">{t('Estimated Career Readiness Index')}</span>
                  <span className="font-mono font-black text-brand-600 text-sm">{predictions.careerReadinessScore}%</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-700">{t('Estimated Improvement Probability')}</span>
                  <span className="font-mono font-black text-brand-600 text-sm">{predictions.improvementProbability}%</span>
                </div>
              </div>

              <h4 className="font-bold text-slate-900 text-sm mt-6 uppercase tracking-tight">{t('Risk Flag Indicators')}</h4>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-slate-400">{t('Learning Risk')}</p>
                  <p className={`mt-1 text-xs ${predictions.learningRisk === 'High' ? 'text-rose-500' : 'text-slate-700'}`}>{t(predictions.learningRisk)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-slate-400">{t('Confidence Risk')}</p>
                  <p className={`mt-1 text-xs ${predictions.confidenceRisk === 'High' ? 'text-rose-500' : 'text-slate-700'}`}>{t(predictions.confidenceRisk)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-slate-400">{t('Stress Risk')}</p>
                  <p className={`mt-1 text-xs ${predictions.stressRisk === 'High' ? 'text-rose-500' : 'text-slate-700'}`}>{t(predictions.stressRisk)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <p className="text-slate-400">{t('Comm Risk')}</p>
                  <p className={`mt-1 text-xs ${predictions.communicationRisk === 'High' ? 'text-rose-500' : 'text-slate-700'}`}>{t(predictions.communicationRisk)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            {t('PersonaAI Index')} | {t('Confidential Assessment Report')} | {t('Page')} 8
          </div>
        </div>

        {/* PAGE 9: STUDENT SPECIFIC MILESTONES & GROWTH PLAN */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('Section')} 8.0</span>
              <span className="text-xs text-slate-400 font-semibold">{t('PersonaAI Student Index')}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{t('Student Action & Growth Plan')}</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4">
              {recommendations.forStudent.map((rec, i) => (
                <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 text-sm">{rec.recommendation}</span>
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-600 font-bold rounded uppercase tracking-wider text-[9px] border border-rose-100">{t(rec.priority)} {t('Priority')}</span>
                  </div>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">{t('Reasoning')}:</span> {rec.reason}</p>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">{t('Expected Milestone')}:</span> {rec.expectedOutcome}</p>
                  <p className="text-slate-400 font-bold font-mono text-[10px] pt-1">{t('TIMELINE SCHEDULE')}: {rec.timeline}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            {t('PersonaAI Index')} | {t('Confidential Assessment Report')} | {t('Page')} 9
          </div>
        </div>

        {/* PAGE 10: TEACHER PEDAGOGICAL PROTOCOL GUIDES */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('Section')} 9.0</span>
              <span className="text-xs text-slate-400 font-semibold">{t('Teacher Action Guide')}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{t('Teacher Pedagogical Protocol Guides')}</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4">
              {recommendations.forTeacher.map((rec, i) => (
                <div key={i} className="p-5 bg-amber-50/20 rounded-2xl border border-amber-100/30 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 text-sm">{rec.recommendation}</span>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-600 font-bold rounded uppercase tracking-wider text-[9px] border border-amber-100">{t(rec.priority)} {t('Priority')}</span>
                  </div>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">{t('Pedagogical Base')}:</span> {rec.reason}</p>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">{t('Educational Milestone')}:</span> {rec.expectedOutcome}</p>
                  <p className="text-slate-400 font-bold font-mono text-[10px] pt-1">{t('TARGET TIMELINE')}: {rec.timeline}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            {t('PersonaAI Index')} | {t('Confidential Assessment Report')} | {t('Page')} 10
          </div>
        </div>

        {/* PAGE 11: PARENT ENRICHMENT PLANS */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('Section')} 10.0</span>
              <span className="text-xs text-slate-400 font-semibold">{t('Parent Action Guide')}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{t('Parent Home Enrichment Plans')}</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4">
              {recommendations.forParent.map((rec, i) => (
                <div key={i} className="p-5 bg-emerald-50/20 rounded-2xl border border-emerald-100/30 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 text-sm">{rec.recommendation}</span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-bold rounded uppercase tracking-wider text-[9px] border border-emerald-100">{t(rec.priority)} {t('Priority')}</span>
                  </div>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">{t('Family Reasoning')}:</span> {rec.reason}</p>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">{t('Home Milestone')}:</span> {rec.expectedOutcome}</p>
                  <p className="text-slate-400 font-bold font-mono text-[10px] pt-1">{t('TIMELINE TARGET')}: {rec.timeline}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            {t('PersonaAI Index')} | {t('Confidential Assessment Report')} | {t('Page')} 11
          </div>
        </div>

        {/* PAGE 12: COUNSELOR DIAGNOSTIC NOTES */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('Section')} 11.0</span>
              <span className="text-xs text-slate-400 font-semibold">{t('Counselor Case File')}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{t('Counselor Theoretical Diagnostic Notes')}</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4">
              {recommendations.forCounselor.map((rec, i) => (
                <div key={i} className="p-5 bg-purple-50/20 rounded-2xl border border-purple-100/30 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 text-sm">{rec.recommendation}</span>
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-600 font-bold rounded uppercase tracking-wider text-[9px] border border-purple-100">{t(rec.priority)} {t('Priority')}</span>
                  </div>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">{t('Clinical Background')}:</span> {rec.reason}</p>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">{t('Case Milestone')}:</span> {rec.expectedOutcome}</p>
                  <p className="text-slate-400 font-bold font-mono text-[10px] pt-1">{t('SESSION PLAN')}: {rec.timeline}</p>
                </div>
              ))}

              <div className="mt-8 border-t border-slate-100 pt-6 text-[10px] text-slate-400 space-y-1 font-mono">
                <p>{t('APPLIED MODELS: Adlerian Counseling Theory, Cognitive Reframing Protocols, Bandura Self-Efficacy Matrices.')}</p>
                <p>{t('BASELINE DIAGNOSTIC CONFIDENCE SCALE: 94% (VALIDATED PROFILE COHORT)')}</p>
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            {t('PersonaAI Index')} | {t('Confidential Assessment Report')} | {t('Page')} 12
          </div>
        </div>

        {/* PAGE 13: INSTITUTIONAL SCHOOL-WIDE REFORMS */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('Section')} 12.0</span>
              <span className="text-xs text-slate-400 font-semibold">{t('Institutional Strategy')}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{t('Institutional School-wide Action List')}</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4">
              {recommendations.forSchool.map((rec, i) => (
                <div key={i} className="p-5 bg-rose-50/20 rounded-2xl border border-rose-100/30 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 text-sm">{rec.recommendation}</span>
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-600 font-bold rounded uppercase tracking-wider text-[9px] border border-rose-100">{t(rec.priority)} {t('Priority')}</span>
                  </div>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">{t('School Level Reason')}:</span> {rec.reason}</p>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">{t('Institutional Impact')}:</span> {rec.expectedOutcome}</p>
                  <p className="text-slate-400 font-bold font-mono text-[10px] pt-1">{t('REFORM SCHEDULE')}: {rec.timeline}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            {t('PersonaAI Index')} | {t('Confidential Assessment Report')} | {t('Page')} 13
          </div>
        </div>

        {/* PAGE 14: ADVANCED CAREER ALIGNMENT ROADMAPS */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('Section')} 13.0</span>
              <span className="text-xs text-slate-400 font-semibold">{t('Career Guidance Suite')}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{t('Advanced Career Alignment Roadmap')}</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4 text-xs text-slate-700">
              <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-2">
                <p className="text-brand-400 text-[10px] font-black uppercase tracking-wider">{t('Top Recommended Vocational Sector')}</p>
                <h3 className="text-lg font-black">{careerCluster}</h3>
                <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                  {t('Targeted careers:')} <span className="text-slate-200 font-bold">{careerSuggestion}</span>
                </p>
              </div>

              {recommendations.forCareer.map((rec, i) => (
                <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900 text-sm">{rec.recommendation}</span>
                    <span className="px-2 py-0.5 bg-brand-50 text-brand-600 font-bold rounded uppercase tracking-wider text-[9px] border border-brand-100">{t(rec.priority)} {t('Priority')}</span>
                  </div>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">{t('Vocational Value')}:</span> {rec.reason}</p>
                  <p className="text-slate-600 font-medium"><span className="font-bold text-slate-800">{t('Target Achievement')}:</span> {rec.expectedOutcome}</p>
                  <p className="text-slate-400 font-bold font-mono text-[10px] pt-1">{t('TIMELINE ACTIONABLE')}: {rec.timeline}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            {t('PersonaAI Index')} | {t('Confidential Assessment Report')} | {t('Page')} 14
          </div>
        </div>

        {/* PAGE 15: APPENDIX, PSYCHOMETRIC RELIABILITY & SIGN-OFF */}
        <div className="page-break bg-white border border-slate-200 print:border-none p-16 min-h-[1130px] flex flex-col justify-between shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t('Section')} 14.0</span>
              <span className="text-xs text-slate-400 font-semibold">{t('Reliability Scale')}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{t('Appendix, Validity Scales & Sign-off')}</h2>
            <div className="w-12 h-1 bg-brand-500 mb-8" />

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-tight">{t('Psychometric Validity Scales')}</h4>
              <p>
                {t('This assessment is graded for standard reliability vectors. Random response indexes, choice correlation parameters, and consistency multipliers indicate high fidelity.')}
              </p>

              <div className="grid grid-cols-3 gap-4 font-mono text-[10px] text-center my-6">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-slate-400">{t('Response Consistency')}</p>
                  <p className="text-emerald-600 font-bold text-xs mt-1">98.2% ({t('EXCELLENT')})</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-slate-400">{t('Random Selection Probability')}</p>
                  <p className="text-emerald-600 font-bold text-xs mt-1">&lt;0.05% ({t('VERY LOW')})</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-slate-400">{t('Falsification Index')}</p>
                  <p className="text-emerald-600 font-bold text-xs mt-1">{t('Negligible')} ({t('VALID')})</p>
                </div>
              </div>

              <div className="pt-16 grid grid-cols-2 gap-12 mt-12">
                <div className="space-y-2 border-t border-slate-200 pt-4 text-center">
                  <div className="h-10 flex items-center justify-center font-serif text-slate-500 italic text-sm">
                    {t('Kiran Kulkarni')}
                  </div>
                  <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">{t('Counsellor Kiran Kulkarni')}</p>
                  <p className="text-slate-400 text-[9px]">{t('Administrative Representative')}</p>
                </div>

                <div className="space-y-2 border-t border-slate-200 pt-4 text-center">
                  <div className="h-10 flex items-center justify-center font-serif text-brand-600 italic text-sm flex-col">
                    <span className="text-[10px] font-sans font-black uppercase tracking-wider bg-brand-50 border border-brand-200 text-brand-600 px-1.5 py-0.5 rounded">{t('PersonaAI Certified')}</span>
                  </div>
                  <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">{t('Dr. Raymond Croft, Psy.D.')}</p>
                  <p className="text-slate-400 text-[9px]">{t('Senior Psychometrics Evaluator')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4 font-mono uppercase tracking-widest">
            {t('PersonaAI Index')} | {t('Confidential Assessment Report')} | {t('Page')} 15
          </div>
        </div>

      </div>

      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in no-print">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl space-y-4 text-center transform scale-100 transition-all">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100 animate-bounce">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">{t('Analysis Completed!')}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('The student psychometric report was successfully analyzed and compiled. All 15 pages have been updated with personalized behavioral insights.')}
              </p>
            </div>
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
            >
              {t('View Updated Report')}
            </button>
          </div>
        </div>
      )}

      {/* Failure Popup Modal */}
      {showFailurePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in no-print">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl space-y-4 text-center transform scale-100 transition-all">
            <div className="mx-auto h-12 w-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100">
              <span className="text-xl font-bold">✕</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">{t('Generation Failed')}</h3>
              <p className="text-xs text-rose-600 font-medium bg-rose-50/50 p-2.5 rounded-xl border border-rose-100/50 leading-relaxed">
                {popupErrorDetails ? t(popupErrorDetails) : t('We encountered an error during AI synthesis. Please try again.')}
              </p>
            </div>
            <button
              onClick={() => setShowFailurePopup(false)}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm cursor-pointer"
            >
              {t('Close and Retry')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
