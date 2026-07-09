/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question } from './types';

export const assessmentQuestions: Question[] = [
  // 1. Self Awareness
  {
    id: 1,
    category: 'Self Awareness',
    questionText: 'How frequently do you reflect on your personal strengths, weaknesses, and academic performance?',
    options: [
      { text: 'Daily: I actively write down reflections and set conscious self-improvement goals.', score: 4 },
      { text: 'Weekly: I regularly think about how I am doing and make adjustments where needed.', score: 3 },
      { text: 'Occasionally: I only reflect when something goes wrong or when prompted by a teacher or parent.', score: 2 },
      { text: 'Rarely: I seldom spend time reflecting on my capabilities or habits.', score: 1 }
    ]
  },
  {
    id: 2,
    category: 'Self Awareness',
    questionText: 'When a teacher or parent provides constructive feedback on your schoolwork, how do you typically respond?',
    options: [
      { text: 'I view it as a valuable growth opportunity, analyze the feedback, and incorporate it immediately.', score: 4 },
      { text: 'I listen carefully and try to understand how I can apply it to my future assignments.', score: 3 },
      { text: 'I feel discouraged or slightly embarrassed, which temporarily halts my focus.', score: 2 },
      { text: 'I feel defensive or upset, believing the feedback is unfair or incorrect.', score: 1 }
    ]
  },
  // 2. Confidence
  {
    id: 3,
    category: 'Confidence',
    questionText: 'When faced with a highly complex, unfamiliar academic topic or project, what is your first instinct?',
    options: [
      { text: 'I embrace it enthusiastically as an exciting challenge to learn something entirely new.', score: 4 },
      { text: 'I approach it willingly but prefer to have structured guidance or check-ins to feel secure.', score: 3 },
      { text: 'I feel highly anxious and hesitate, often putting off the task out of fear of doing it poorly.', score: 2 },
      { text: 'I actively avoid it or seek a simpler alternative because I doubt my ability to succeed.', score: 1 }
    ]
  },
  {
    id: 4,
    category: 'Confidence',
    questionText: 'After receiving a disappointing grade or failing at a challenging task, you:',
    options: [
      { text: 'Deconstruct what went wrong, adapt your strategy, and tackle the challenge again with high resilience.', score: 4 },
      { text: 'Accept the outcome, brush it off, and commit to studying harder in the next attempt.', score: 3 },
      { text: 'Feel bad for several days, losing confidence and doubting your ability in that subject area.', score: 2 },
      { text: 'Conclude that you are simply "not good enough" at this subject and disengage from it.', score: 1 }
    ]
  },
  // 3. Learning Style
  {
    id: 5,
    category: 'Learning Style',
    questionText: 'How do you absorb and process complex academic information most effectively?',
    options: [
      { text: 'Visual: I study best with diagrams, flowcharts, colors, mind maps, and interactive video aids.', score: 4 },
      { text: 'Auditory: I learn best through lectures, group discussions, explaining concepts aloud, or podcasts.', score: 3 },
      { text: 'Read/Write: I absorb info best by writing summaries, reading textbook chapters, and taking meticulous notes.', score: 2 },
      { text: 'Kinesthetic: I grasp ideas best through hands-on experiments, building models, or active trial-and-error.', score: 1 }
    ]
  },
  {
    id: 6,
    category: 'Learning Style',
    questionText: 'When preparing for a comprehensive, multi-chapter exam, which method represents your go-to study routine?',
    options: [
      { text: 'Creating interconnected concept maps to visualize how different topics relate to each other.', score: 4 },
      { text: 'Studying in a group where we explain difficult chapters to each other and debate questions.', score: 3 },
      { text: 'Quietly re-reading notes multiple times, rewriting key paragraphs, and tackling practice papers.', score: 2 },
      { text: 'Using interactive flashcards, simulators, or physically building out code/projects to test concepts.', score: 1 }
    ]
  },
  // 4. Motivation
  {
    id: 7,
    category: 'Motivation',
    questionText: 'What is the primary driving force behind your academic efforts and goals?',
    options: [
      { text: 'Intrinsic: An inner curiosity, a love for learning, and a personal desire to master subjects.', score: 4 },
      { text: 'Extrinsic: Achieving high grades, winning medals, earning awards, and getting praise from others.', score: 3 },
      { text: 'Social/Obligation: Meeting my parents’ expectations and avoiding letting my teachers down.', score: 2 },
      { text: 'Survival: Doing just enough to pass, avoid trouble, and complete the minimum requirements.', score: 1 }
    ]
  },
  {
    id: 8,
    category: 'Motivation',
    questionText: 'When an academic task or assignment becomes repetitive, long, or tedious, how do you handle it?',
    options: [
      { text: 'I find ways to gamify the task or link it directly to my long-term personal growth goals.', score: 4 },
      { text: 'I apply self-discipline, power through, and complete the task because it is my duty.', score: 3 },
      { text: 'I procrastinate heavily, losing focus, and only finish it when the deadline is imminent.', score: 2 },
      { text: 'I lose motivation quickly and abandon the task unless I am constantly supervised.', score: 1 }
    ]
  },
  // 5. Emotional Regulation
  {
    id: 9,
    category: 'Emotional Regulation',
    questionText: 'Under heavy academic pressure (e.g., final exams, multiple due dates), how do you manage your emotional state?',
    options: [
      { text: 'I stay composed by using structured time-management, relaxation exercises, or mindfulness techniques.', score: 4 },
      { text: 'I cope by sharing my feelings with friends or family, venting to relieve stress and re-focusing.', score: 3 },
      { text: 'I become irritable, anxious, or experience sleep disruption, which negatively impacts my focus.', score: 2 },
      { text: 'I feel completely overwhelmed, shut down mentally, and experience severe academic burnout.', score: 1 }
    ]
  },
  {
    id: 10,
    category: 'Emotional Regulation',
    questionText: 'During a group project, if team members strongly disagree with your point of view, you:',
    options: [
      { text: 'Stay perfectly calm, actively listen to their perspectives, and seek a logical, evidence-based consensus.', score: 4 },
      { text: 'Acquiesce to the group’s wishes immediately just to maintain harmony and avoid any conflict.', score: 3 },
      { text: 'Defend your idea with high passion, arguing vigorously even if it creates friction within the team.', score: 2 },
      { text: 'Become frustrated, shut down, and withdraw your participation from the project entirely.', score: 1 }
    ]
  },
  // 6. Communication
  {
    id: 11,
    category: 'Communication',
    questionText: 'When participating in a collaborative group project, how do you express your thoughts?',
    options: [
      { text: 'I articulate my ideas clearly, invite constructive questions, and facilitate a balanced group dialog.', score: 4 },
      { text: 'I share my ideas briefly when requested, speaking with clarity but avoiding leading the conversation.', score: 3 },
      { text: 'I prefer to put my ideas in writing or charts, feeling uneasy about expressing them verbally to the group.', score: 2 },
      { text: 'I remain mostly quiet, preferring to follow instructions and let others make the points.', score: 1 }
    ]
  },
  {
    id: 12,
    category: 'Communication',
    questionText: 'When delivering an oral presentation or speech in front of the entire class, you:',
    options: [
      { text: 'Deliver the material confidently with effective body language, solid pacing, and direct eye contact.', score: 4 },
      { text: 'Present clearly and deliver the content successfully, though I experience moderate internal nervousness.', score: 3 },
      { text: 'Read directly from slides or notes, minimizing eye contact and speaking with a quiet, flat tone.', score: 2 },
      { text: 'Suffer from severe stage fright, occasionally lose track of thoughts, and find it extremely difficult to speak.', score: 1 }
    ]
  },
  // 7. Leadership
  {
    id: 13,
    category: 'Leadership',
    questionText: 'When a group assignment lacks clear direction or organization, what do you usually do?',
    options: [
      { text: 'I immediately step forward, organize roles, assign deadlines, and establish a productive workspace.', score: 4 },
      { text: 'I help organize and coordinate roles if someone else initiates the leadership first.', score: 3 },
      { text: 'I focus strictly on my own assigned part, ignoring the overall progress of the group.', score: 2 },
      { text: 'I wait passively for someone to assign me exactly what to do, doing nothing in the meantime.', score: 1 }
    ]
  },
  {
    id: 14,
    category: 'Leadership',
    questionText: 'What is your primary focus when you are put in charge of leading a group or team?',
    options: [
      { text: 'To inspire and motivate team members, leveraging individual strengths while working towards a shared vision.', score: 4 },
      { text: 'To ensure the final product is completed with absolute perfection, closely checking everyone’s work.', score: 3 },
      { text: 'To delegate tasks and expect instructions to be followed precisely without much discussion.', score: 2 },
      { text: 'I actively avoid leading because I dislike having responsibility for others’ performance.', score: 1 }
    ]
  },
  // 8. Creativity
  {
    id: 15,
    category: 'Creativity',
    questionText: 'When solving a complex logic problem, coding challenge, or scientific experiment, you:',
    options: [
      { text: 'Think outside the box, brainstorm unconventional methods, and experiment with novel ideas.', score: 4 },
      { text: 'Analyze multiple existing solutions and adapt/combine them in a slightly modified way.', score: 3 },
      { text: 'Follow established, pre-approved rules or textbooks step-by-step to arrive at a proven answer.', score: 2 },
      { text: 'Feel completely stuck or frustrated if there isn’t a clear, pre-existing template or example to copy.', score: 1 }
    ]
  },
  {
    id: 16,
    category: 'Creativity',
    questionText: 'How do you incorporate originality, innovation, or creative expression into your regular routine?',
    options: [
      { text: 'I regularly engage in original hobbies like creative writing, visual design, inventing, or building custom code.', score: 4 },
      { text: 'I appreciate creative works (art, technology, games) and enjoy talking about how they were made.', score: 3 },
      { text: 'I prefer routines, structured learning, and tasks that have clear, predictable results with no ambiguity.', score: 2 },
      { text: 'I rarely generate original concepts and find creative self-expression difficult or unnecessary.', score: 1 }
    ]
  },
  // 9. Decision Making
  {
    id: 17,
    category: 'Decision Making',
    questionText: 'When faced with an important decision (e.g., choosing electives, science projects, or future majors), you:',
    options: [
      { text: 'Collect all relevant data, weigh the long-term pros/cons, and seek advice from experienced counselors.', score: 4 },
      { text: 'Trust your immediate gut feeling/intuition and pick what feels right in the moment.', score: 3 },
      { text: 'Ask your parents, friends, or siblings to make the decision for you, following their lead entirely.', score: 2 },
      { text: 'Avoid making the decision, procrastinating until the absolute last minute when choices are limited.', score: 1 }
    ]
  },
  {
    id: 18,
    category: 'Decision Making',
    questionText: 'Once you make a major choice and experience a setback or failure because of it, how do you react?',
    options: [
      { text: 'I take full, mature responsibility for the outcome, learn from the mistake, and adapt my future approach.', score: 4 },
      { text: 'I feel some regret or disappointment but try to push through and make the best of the current situation.', score: 3 },
      { text: 'I blame external circumstances, bad luck, or other people for the unfavorable outcome.', score: 2 },
      { text: 'I feel completely overwhelmed, regret the choice intensely, and wish I could undo it entirely.', score: 1 }
    ]
  },
  // 10. Career Interest
  {
    id: 19,
    category: 'Career Interest',
    questionText: 'Which area of activity do you find most naturally engaging and rewarding during your free time?',
    options: [
      { text: 'Problem Solving & Engineering: Programming, analyzing data, researching science, or building physical things.', score: 4 },
      { text: 'Design & Expression: Writing articles/stories, sketching, digital art, or producing audio/video content.', score: 3 },
      { text: 'Helping & Human Development: Explaining concepts, tutoring peers, counseling friends, or volunteering.', score: 2 },
      { text: 'Leadership & Business: Organizing events, managing budgets, planning campaigns, or pitching ideas.', score: 1 }
    ]
  },
  {
    id: 20,
    category: 'Career Interest',
    questionText: 'When you envision your dream future career, what is your most significant goal?',
    options: [
      { text: 'Developing innovative technologies, coding cutting-edge systems, or discovering new scientific facts.', score: 4 },
      { text: 'Creating meaningful art, literature, game designs, marketing campaigns, or multimedia content.', score: 3 },
      { text: 'Making a direct positive impact on human lives through education, healthcare, therapy, or social services.', score: 2 },
      { text: 'Building a scalable startup, leading corporate projects, managing assets, or spearheading public ventures.', score: 1 }
    ]
  }
];
