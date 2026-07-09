/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudentAssessment, AssessmentAnswer, AIInsights, RecommendationItem } from './types';

// Category mapping to weight
export const WEIGHTS = {
  'Self Awareness': 0.20,      // Personality Maturity
  'Emotional Regulation': 0.15,// Emotional Intelligence
  'Leadership': 0.10,          // Leadership Potential
  'Learning Style': 0.15,      // Learning Readiness
  'Communication': 0.10,       // Communication Skills
  'Confidence': 0.10,          // Confidence
  'Motivation': 0.10,          // Motivation
  'Creativity': 0.05,          // Creativity
  'Decision Making': 0.05,     // Decision Making
  'Career Interest': 0.10      // Career Readiness
};

// Help map categories to more user-friendly dimensions
export const CATEGORY_LABELS: { [key: string]: string } = {
  'Self Awareness': 'Personality Maturity',
  'Emotional Regulation': 'Emotional Intelligence',
  'Leadership': 'Leadership Potential',
  'Learning Style': 'Learning Readiness',
  'Communication': 'Communication Skills',
  'Confidence': 'Confidence Level',
  'Motivation': 'Motivation Pattern',
  'Creativity': 'Creativity & Innovation',
  'Decision Making': 'Decision Making Style',
  'Career Interest': 'Career Readiness'
};

/**
 * Calculates raw category scores from the 20 answers.
 * Each category contains exactly 2 questions. Raw score is 2 to 8.
 * Percentage score is ((Raw - 2) / 6) * 100
 */
export function calculateScores(answers: AssessmentAnswer[]): { [category: string]: number } {
  const categoryScores: { [category: string]: number[] } = {};
  
  // Group answers by category
  answers.forEach(ans => {
    if (!categoryScores[ans.category]) {
      categoryScores[ans.category] = [];
    }
    categoryScores[ans.category].push(ans.score);
  });
  
  const scores: { [category: string]: number } = {};
  
  // Calculate percentage (0 to 100)
  Object.keys(WEIGHTS).forEach(cat => {
    const rawScores = categoryScores[cat] || [2, 2]; // Fallback default
    const sum = rawScores.reduce((acc, curr) => acc + curr, 0);
    // sum is between 2 and 8
    const percentage = Math.round(((sum - 2) / 6) * 100);
    scores[cat] = Math.max(0, Math.min(100, percentage));
  });
  
  return scores;
}

/**
 * Calculates overall AI Growth Index
 */
export function calculateGrowthIndex(scores: { [category: string]: number }): number {
  let index = 0;
  Object.entries(WEIGHTS).forEach(([category, weight]) => {
    const score = scores[category] || 50;
    index += score * weight;
  });
  return Math.round(index);
}

/**
 * Fallback static, professional, rule-based psychometric generator.
 * Produces deep, unique results based on score bands.
 */
export function generateLocalPsychometrics(
  scores: { [category: string]: number },
  studentDetails: { name: string; age: number; gender: string }
): AIInsights {
  const name = studentDetails.name;
  
  // 1. Determine key scores
  const maturity = scores['Self Awareness'];
  const emotional = scores['Emotional Regulation'];
  const leadership = scores['Leadership'];
  const learning = scores['Learning Style'];
  const comm = scores['Communication'];
  const confidence = scores['Confidence'];
  const motivation = scores['Motivation'];
  const creativity = scores['Creativity'];
  const decision = scores['Decision Making'];
  const career = scores['Career Interest'];

  // 2. Classify Personality types based on score intersections
  let personalityType = 'Strategist (INTJ)';
  let careerSuggestion = 'Computer Science, Systems Engineering, Data Analytics';
  if (creativity > 70 && comm > 70) {
    personalityType = 'Visionary Campaigner (ENFP)';
    careerSuggestion = 'Creative Direction, UI/UX Design, Digital Product Innovation, Communications';
  } else if (leadership > 70 && confidence > 70) {
    personalityType = 'Executive Commander (ENTJ)';
    careerSuggestion = 'Business Operations, Venture Management, Strategic Planning, Public Policy';
  } else if (maturity > 70 && emotional > 70) {
    personalityType = 'Consensus Mediator (INFJ)';
    careerSuggestion = 'Educational Psychology, Counseling, Environmental Science, Social Innovation';
  } else if (learning > 70 && creativity > 70) {
    personalityType = 'Innovative Architect (INTP)';
    careerSuggestion = 'Software Architecture, AI & ML Engineering, Scientific Research, Cryptography';
  } else if (emotional > 75 && comm < 50) {
    personalityType = 'Quiet Guardian (ISFJ)';
    careerSuggestion = 'Clinical Laboratory Science, Database Administration, Technical Writing';
  } else {
    personalityType = 'Analytical Specialist (ISTJ)';
    careerSuggestion = 'Applied Mathematics, Financial Analysis, Cloud Architecture, Industrial Design';
  }

  // 3. Classify communication and leadership styles
  const communicationType = comm >= 75 ? 'Assertive & Persuasive' : comm >= 50 ? 'Collaborative & Constructive' : 'Reflective & Written';
  const leadershipType = leadership >= 75 ? 'Visionary & Inspiring' : leadership >= 50 ? 'Democratic & Organizing' : 'Independent Support';

  // 4. Generate dynamic, personalized descriptions
  const strengths: string[] = [];
  const growthAreas: string[] = [];

  if (maturity >= 70) strengths.push('High self-awareness: regularly reflects on personal capabilities and embraces critique.');
  else growthAreas.push('Self-Reflection: Needs to build consistent habits of reflecting on study routines and mistakes.');

  if (confidence >= 70) strengths.push('Resilient and confident: Welcomes unfamiliar challenges and bounces back from setback.');
  else growthAreas.push('Resilience & Confidence: Tends to hesitate under failure and requires positive reinforcement.');

  if (emotional >= 70) strengths.push('Superb emotional regulation: remains calm and constructive under intense pressure.');
  else growthAreas.push('Stress Management: Experiences academic anxiety during peak periods, requiring relaxation strategies.');

  if (comm >= 70) strengths.push('Articulate communicator: speaks with clarity, presents well, and actively listens.');
  else growthAreas.push('Verbal Expression: Experiences stage fright or hesitation; needs safer opportunities to present ideas.');

  if (leadership >= 70) strengths.push('Natural lead potential: steps up in ambiguous groups to coordinate and motivate.');
  else growthAreas.push('Team Initiatives: Hesitates to take responsibility for group direction; should practice micro-leading.');

  if (creativity >= 70) strengths.push('Highly innovative: thinks outside the box and generates original conceptual solutions.');
  else growthAreas.push('Cognitive Flexibility: Tends to rely on existing templates; needs encouragement to brainstorm creatively.');

  if (decision >= 70) strengths.push('Analytical decider: evaluates systematic pros/cons and accepts ownership of outcomes.');
  else growthAreas.push('Decision Confidence: Tends to postpone choices or overly depend on external guidance.');

  // Top-ups to ensure exactly 5 strengths and 3 growth areas
  const defaultStrengths = [
    'Shows robust determination to master challenging topics.',
    'Exhibits outstanding ethical behavior in collaborative teams.',
    'Possesses structured study planning abilities.',
    'Quickly synthesizes logical arguments.',
    'Demonstrates highly active listening skills.'
  ];
  const defaultGrowth = [
    'Should explore connecting daily academic tasks to visual, long-term aspirations.',
    'Would benefit from engaging in more team-based extracurricular activities.',
    'Needs to practice explaining technical topics to non-technical peers.'
  ];

  while (strengths.length < 5) {
    const next = defaultStrengths.find(s => !strengths.includes(s));
    if (next) strengths.push(next);
    else break;
  }
  while (growthAreas.length < 3) {
    const next = defaultGrowth.find(g => !growthAreas.includes(g));
    if (next) growthAreas.push(next);
    else break;
  }

  // 5. Generate descriptive paragraphs
  const studyHabitAnalysis = learning >= 70
    ? `${name} exhibits highly systematic study habits, utilizing mind-mapping and active learning protocols. This structural learning preference allows them to quickly categorize and memorize complex workflows.`
    : `${name} relies heavily on traditional, quiet reading and note-taking. While disciplined, this method is cognitively taxing; introducing visual diagrams or verbal peer reviews would significantly boost recall rates.`;

  const stressHandling = emotional >= 75
    ? `${name} manages high-pressure situations with commendable emotional maturity. They maintain logical equilibrium during exams, keeping panic-responses entirely under control.`
    : `${name} experiences heightened physiological and emotional anxiety under academic stress. They would benefit enormously from breathing schemas, structured planners, and a supportive, low-critique environment.`;

  const decisionMakingStyle = decision >= 70
    ? `Decisions are approached through rational, data-driven frameworks. ${name} proactively maps options, weighs future impacts, and exhibits high accountability, refraining from blaming external factors when setbacks occur.`
    : `${name} tends to experience analysis paralysis, frequently deferring choices to peers or parents. This stems from a slight fear of negative outcomes; they need training in making small, independent choices.`;

  const emotionalStability = emotional >= 70
    ? `Exhibits highly stable emotional baselines. They react constructively to disagreements and maintain positive self-regard even when confronted with challenging peer environments.`
    : `Emotional baselines fluctuate based on academic performance. Their state is highly reactive to grades; building an identity outside of purely numerical scores will stabilize their resilience.`;

  const motivationPattern = motivation >= 75
    ? `Powered by high intrinsic curiosity and intellectual drive. ${name} is motivated by master-level understanding rather than just letter-grades, making them an excellent candidate for long-term research.`
    : `Primarily extrinsically motivated, relying on external grades, parental praise, or rewards to maintain momentum. While effective in the short term, they need to cultivate personal, intrinsic goals to avoid burnout.`;

  const teamBehavior = leadership >= 70
    ? `A natural facilitator who encourages democratic participation. In group tasks, ${name} ensures every voice is heard while maintaining clear focus on objectives, balancing empathy with strict deadlines.`
    : `Prefers to act as a supportive technical asset within teams. ${name} delivers high-quality individual work but tends to withdraw if team conflict arises, needing to develop dispute-resolution skills.`;

  const criticalThinking = maturity >= 75
    ? 'Demonstrates excellent critical thinking. Capable of checking assumptions, identifying logical fallacies, and structuring complex scientific parameters independently.'
    : 'Analytical thinking is strong but occasionally restricted by rigid templates. Needs prompting to explore alternative explanations and test diverse hypotheses.';

  const problemSolving = creativity >= 70
    ? 'Approaches problems through lateral thinking, generating highly unique pathways that bypass traditional bottlenecks. Outstanding at conceptual engineering.'
    : 'Uses standard algorithmic strategies to solve problems. Extremely accurate with structured problems, but experiences friction when solving open-ended, ill-defined challenges.';

  const innovationLevel = creativity >= 75 ? 'Exceptional' : creativity >= 50 ? 'Strong' : 'Moderate';
  const socialInteraction = comm >= 70 ? 'Extroverted & Facilitating' : comm >= 45 ? 'Balanced & Selective' : 'Introverted & Observing';

  const futureReadiness = career >= 75
    ? `${name} displays clear vision and passion regarding future professional pathways. They actively align current learning with vocational clusters, exhibiting high professional maturity.`
    : `${name} has a generalized or slightly unfocused view of future careers. Introducing structured company visits, technical seminars, or shadow-days will bring clarity to their aspirations.`;

  const riskIndicator = (emotional < 50 && confidence < 50) ? 'High' : (emotional < 65 || confidence < 65) ? 'Medium' : 'Low';

  // 6. Generate precise Recommendations with detailed schema
  const recommendations = {
    forStudent: [
      {
        recommendation: 'Adopt active visual memory tools (Mind Maps & Flowcharts)',
        reason: `${name}'s learning style thrives on relational visual cues. Traditional rote reading is inefficient for their conceptual processing.`,
        priority: 'High' as const,
        expectedOutcome: '30% increase in long-term retention of multi-chapter subjects, reduced exam-prep fatigue.',
        timeline: 'Immediate (Next 2 weeks)'
      },
      {
        recommendation: 'Formulate a "Failure Reframe" journal for exam setbacks',
        reason: 'To counteract slight confidence dips under critique or low grades by logging action-plans instead of self-doubt.',
        priority: 'Medium' as const,
        expectedOutcome: 'Stabilized academic confidence and quicker bounce-back times.',
        timeline: 'Ongoing (Next 1 month)'
      }
    ],
    forTeacher: [
      {
        recommendation: 'Assign micro-leadership roles in scientific/creative tasks',
        reason: `${name} has the foundation for leadership but hesitates to self-initiate. Structured nomination lowers the barrier to entry.`,
        priority: 'High' as const,
        expectedOutcome: 'Enhanced vocal confidence, role responsibility, and practical execution capacity.',
        timeline: 'Within the current term'
      },
      {
        recommendation: 'Provide criteria-based rubrics rather than raw grade feedback',
        reason: 'To help the student focus on specific skill progress rather than reacting emotionally to numeric percentages.',
        priority: 'Medium' as const,
        expectedOutcome: 'Decreased grade-related anxiety and highly targeted improvement.',
        timeline: 'Next academic evaluation cycle'
      }
    ],
    forParent: [
      {
        recommendation: 'Establish an active "Home Reflection Hour" weekly',
        reason: 'Supports self-awareness by creating a low-pressure dialog focused on personal growth, effort, and lessons learned rather than scores.',
        priority: 'High' as const,
        expectedOutcome: 'Stronger parent-child trust and improved emotional self-regulation.',
        timeline: 'Every Sunday evening'
      },
      {
        recommendation: 'Encourage enrollment in specialized non-academic coding/art camps',
        reason: `Aligns with ${name}'s creativity and provides a playground for low-stakes failure, reinforcing confidence.`,
        priority: 'Medium' as const,
        expectedOutcome: 'Broader problem-solving skills and secondary confidence pillars.',
        timeline: 'Upcoming summer/winter holidays'
      }
    ],
    forCounselor: [
      {
        recommendation: 'Conduct monthly cognitive-behavioral resilience sessions',
        reason: `Helps ${name} navigate academic stress and manage emotional baseline fluctuations during exam periods.`,
        priority: 'Medium' as const,
        expectedOutcome: 'Enhanced emotional self-awareness and personalized anxiety coping toolkits.',
        timeline: 'Monthly check-ins'
      }
    ],
    forSchool: [
      {
        recommendation: 'Integrate dynamic multi-disciplinary bento challenges',
        reason: 'To offer open-ended project slots that reward lateral innovation, creativity, and self-organization.',
        priority: 'Low' as const,
        expectedOutcome: 'A culture that celebrates diverse student profiles and original thinking.',
        timeline: 'Next school festival/exhibition'
      }
    ],
    forCareer: [
      {
        recommendation: 'Arrange a 1-on-1 industry shadow program with a Senior Architect/Director',
        reason: `Validates ${name}'s career interests in high-level engineering or visual design and creates strong extrinsic motivation.`,
        priority: 'High' as const,
        expectedOutcome: 'Invaluable real-world exposure and laser-focused selection of university pathways.',
        timeline: 'Next 3 months'
      }
    ]
  };

  // 7. Generate Growth predictions
  const predictions = {
    futureLeadership: Math.round(leadership * 0.7 + comm * 0.3),
    careerCluster: creativity > 70 ? 'Technology & Digital Creative Design' : leadership > 70 ? 'Business Administration & Ventures' : 'Applied Sciences & Research Analytics',
    learningRisk: learning < 50 ? 'High' as const : learning < 65 ? 'Medium' as const : 'Low' as const,
    confidenceRisk: confidence < 50 ? 'High' as const : confidence < 65 ? 'Medium' as const : 'Low' as const,
    stressRisk: emotional < 50 ? 'High' as const : emotional < 65 ? 'Medium' as const : 'Low' as const,
    communicationRisk: comm < 50 ? 'High' as const : comm < 65 ? 'Medium' as const : 'Low' as const,
    academicReadiness: Math.round(learning * 0.4 + maturity * 0.3 + motivation * 0.3),
    careerReadinessScore: Math.round(career * 0.5 + decision * 0.3 + comm * 0.2),
    improvementProbability: Math.round(maturity * 0.5 + motivation * 0.5)
  };

  // Executive summary
  const summary = `${name} is a highly ${maturity > 70 ? 'reflective' : 'adaptive'} student who shows immense potential in ${careerSuggestion.split(',')[0]}. They thrive when given clear, conceptually challenging work where they can leverage their ${creativity > 70 ? 'original imagination' : 'analytical focus'}. While displaying outstanding pillars of strength, their growth index of ${calculateGrowthIndex(scores)}% can be further unlocked by focusing specifically on reducing anxiety under critique and practicing micro-leadership in team workspaces.`;

  return {
    summary,
    personalityType,
    communicationType,
    leadershipType,
    careerSuggestion,
    topStrengths: strengths,
    topGrowthAreas: growthAreas,
    studyHabitAnalysis,
    stressHandling,
    decisionMakingStyle,
    emotionalStability,
    motivationPattern,
    teamBehavior,
    criticalThinking,
    problemSolving,
    innovationLevel,
    socialInteraction,
    futureReadiness,
    riskIndicator,
    recommendations,
    predictions
  };
}

/**
 * Call server-side Gemini to expand and completely customize the analysis!
 * This uses `@google/genai` and model `gemini-3.5-flash`.
 */
export async function generateGeminiPsychometrics(
  scores: { [category: string]: number },
  studentDetails: { name: string; age: number; gender: string; grade: string },
  answersTextSummary: string,
  geminiClient: any
): Promise<AIInsights> {
  const name = studentDetails.name;
  const growthIndex = calculateGrowthIndex(scores);
  
  const systemInstruction = `You are an elite Educational Psychologist, Psychometrist, and Growth Counselor. 
You are analyzing a student named ${name} (Age: ${studentDetails.age}, Gender: ${studentDetails.gender}, Grade: ${studentDetails.grade}).
They have completed a 20 MCQ assessment spanning 10 key categories. 
Your goal is to provide a comprehensive, ultra-detailed, and deeply personalized psychological profile. 
AVOID generic text. Write distinct, beautiful, and action-oriented insights.`;

  const prompt = `
Student Category Percentage Scores:
${JSON.stringify(scores, null, 2)}

Overall Weighted Growth Index: ${growthIndex}%

Questionnaire Answers Context:
${answersTextSummary}

Generate a detailed JSON report according to this exact TypeScript structure:
interface AIInsights {
  summary: string; // Dynamic, highly descriptive paragraphs summarizing the student profile, potentials, and broad growth plan.
  personalityType: string; // e.g. "Visionary Campaigner (ENFP)"
  communicationType: string; // e.g. "Assertive & Empathetic"
  leadershipType: string; // e.g. "Democratic Collaborator"
  careerSuggestion: string; // Comma-separated list of highly specific modern careers.
  topStrengths: string[]; // EXACTLY 5 clear strengths based on scores.
  topGrowthAreas: string[]; // EXACTLY 3 clear growth areas based on scores.
  studyHabitAnalysis: string; // Detailed study habit evaluation paragraph.
  stressHandling: string; // Stress and anxiety management paragraph.
  decisionMakingStyle: string; // Choice evaluation and accountability paragraph.
  emotionalStability: string; // Stability baseline paragraph.
  motivationPattern: string; // Intrinsic vs extrinsic pattern paragraph.
  teamBehavior: string; // Social collaboration paragraph.
  criticalThinking: string; // High-level analytical skills paragraph.
  problemSolving: string; // Lateral vs vertical problem solving paragraph.
  innovationLevel: string; // "Exceptional", "Strong", or "Moderate"
  socialInteraction: string; // "Extroverted & Facilitating", "Balanced", or "Introverted"
  futureReadiness: string; // Professional alignment and maturity paragraph.
  riskIndicator: 'Low' | 'Medium' | 'High'; // Operational risk flags.
  recommendations: {
    forStudent: { recommendation: string; reason: string; priority: 'High'|'Medium'|'Low'; expectedOutcome: string; timeline: string }[];
    forTeacher: { recommendation: string; reason: string; priority: 'High'|'Medium'|'Low'; expectedOutcome: string; timeline: string }[];
    forParent: { recommendation: string; reason: string; priority: 'High'|'Medium'|'Low'; expectedOutcome: string; timeline: string }[];
    forCounselor: { recommendation: string; reason: string; priority: 'High'|'Medium'|'Low'; expectedOutcome: string; timeline: string }[];
    forSchool: { recommendation: string; reason: string; priority: 'High'|'Medium'|'Low'; expectedOutcome: string; timeline: string }[];
    forCareer: { recommendation: string; reason: string; priority: 'High'|'Medium'|'Low'; expectedOutcome: string; timeline: string }[];
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
}

Ensure all JSON properties are valid and strictly match the types. Do not include markdown wraps besides valid JSON.`;

  try {
    const response = await geminiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text.trim());
    return parsed as AIInsights;
  } catch (error) {
    console.error('Gemini Assessment Generation failed, falling back to local psychometrics:', error);
    return generateLocalPsychometrics(scores, studentDetails);
  }
}
