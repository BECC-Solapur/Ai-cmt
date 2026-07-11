/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Student' | 'Teacher' | 'Parent' | 'Admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  school?: string;
  childId?: string; // For Parent to link to their child's student ID
  className?: string; // For Student / Teacher
  section?: string; // For Student / Teacher
  age?: number;
  gender?: string;
  createdAt?: string;
}

export interface Question {
  id: number;
  category: string;
  questionText: string;
  options: {
    text: string;
    score: number; // 1 to 4
  }[];
}

export interface AssessmentAnswer {
  questionId: number;
  category: string;
  score: number; // 1 to 4
}

export interface RecommendationItem {
  recommendation: string;
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
  expectedOutcome: string;
  timeline: string;
}

export interface AIInsights {
  summary: string;
  personalityType: string;
  communicationType: string;
  leadershipType: string;
  careerSuggestion: string;
  topStrengths: string[];
  topGrowthAreas: string[];
  studyHabitAnalysis: string;
  stressHandling: string;
  decisionMakingStyle: string;
  emotionalStability: string;
  motivationPattern: string;
  teamBehavior: string;
  criticalThinking: string;
  problemSolving: string;
  innovationLevel: string;
  socialInteraction: string;
  futureReadiness: string;
  riskIndicator: 'Low' | 'Medium' | 'High';
  recommendations: {
    forStudent: RecommendationItem[];
    forTeacher: RecommendationItem[];
    forParent: RecommendationItem[];
    forCounselor: RecommendationItem[];
    forSchool: RecommendationItem[];
    forCareer: RecommendationItem[];
  };
  predictions: {
    futureLeadership: number; // 0 - 100
    careerCluster: string;
    learningRisk: 'Low' | 'Medium' | 'High';
    confidenceRisk: 'Low' | 'Medium' | 'High';
    stressRisk: 'Low' | 'Medium' | 'High';
    communicationRisk: 'Low' | 'Medium' | 'High';
    academicReadiness: number; // 0 - 100
    careerReadinessScore: number; // 0 - 100
    improvementProbability: number; // 0 - 100
  };
  marathi?: {
    summary: string;
    personalityType: string;
    communicationType: string;
    leadershipType: string;
    careerSuggestion: string;
    topStrengths: string[];
    topGrowthAreas: string[];
    studyHabitAnalysis: string;
    stressHandling: string;
    decisionMakingStyle: string;
    emotionalStability: string;
    motivationPattern: string;
    teamBehavior: string;
    criticalThinking: string;
    problemSolving: string;
    innovationLevel: string;
    socialInteraction: string;
    futureReadiness: string;
    recommendations: {
      forStudent: RecommendationItem[];
      forTeacher: RecommendationItem[];
      forParent: RecommendationItem[];
      forCounselor: RecommendationItem[];
      forSchool: RecommendationItem[];
      forCareer: RecommendationItem[];
    };
    predictions?: {
      careerCluster: string;
    };
  };
  isFallback?: boolean;
}

export interface StudentAssessment {
  id: string;
  studentId: string;
  studentDetails: {
    name: string;
    age: number;
    gender: string;
    grade: string;
    section: string;
    school: string;
  };
  answers: AssessmentAnswer[];
  scores: {
    [category: string]: number; // Category scores scaled from 0 to 100
  };
  growthIndex: number; // Overall weighted growth index (0 - 100)
  date: string; // YYYY-MM-DD
  aiInsights: AIInsights;
}

export interface ClassPerformance {
  className: string;
  section: string;
  averageGrowthIndex: number;
  totalStudents: number;
  completedAssessments: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
}
