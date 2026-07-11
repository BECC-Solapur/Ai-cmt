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
    questionTextMarathi: 'आपण आपल्या वैयक्तिक सामर्थ्य, कमकुवतपणा आणि शैक्षणिक कामगिरीवर किती वेळा विचार करता?',
    options: [
      { text: 'Daily: I actively write down reflections and set conscious self-improvement goals.', textMarathi: 'दैनिक: मी सक्रियपणे विचार लिहून ठेवतो आणि जागरूक सुधारणेची उद्दिष्टे निश्चित करतो.', score: 4 },
      { text: 'Weekly: I regularly think about how I am doing and make adjustments where needed.', textMarathi: 'साप्ताहिक: मी नियमितपणे माझी प्रगती कशी सुरू आहे यावर विचार करतो आणि आवश्यक तेथे बदल करतो.', score: 3 },
      { text: 'Occasionally: I only reflect when something goes wrong or when prompted by a teacher or parent.', textMarathi: 'अधूनमधून: जेव्हा काहीतरी चुकीचे घडते किंवा जेव्हा शिक्षक किंवा पालकांनी विचारले तेव्हाच मी विचार करतो.', score: 2 },
      { text: 'Rarely: I seldom spend time reflecting on my capabilities or habits.', textMarathi: 'दुर्मिळ: मी माझ्या क्षमता किंवा सवयींवर विचार करण्यात क्वचितच वेळ घालवतो.', score: 1 }
    ]
  },
  {
    id: 2,
    category: 'Self Awareness',
    questionText: 'When a teacher or parent provides constructive feedback on your schoolwork, how do you typically respond?',
    questionTextMarathi: 'जेव्हा एखादे शिक्षक किंवा पालक तुमच्या शालेय कामाबद्दल सकारात्मक अभिप्राय देतात, तेव्हा तुमचा प्रतिसाद कसा असतो?',
    options: [
      { text: 'I view it as a valuable growth opportunity, analyze the feedback, and incorporate it immediately.', textMarathi: 'मी त्याकडे वाढीची एक मौल्यवान संधी म्हणून पाहतो, अभिप्रायाचे विश्लेषण करतो आणि ते त्वरित लागू करतो.', score: 4 },
      { text: 'I listen carefully and try to understand how I can apply it to my future assignments.', textMarathi: 'मी लक्षपूर्वक ऐकतो आणि माझ्या भविष्यातील अभ्यासात ते कसे लागू करू शकतो हे समजून घेण्याचा प्रयत्न करतो.', score: 3 },
      { text: 'I feel discouraged or slightly embarrassed, which temporarily halts my focus.', textMarathi: 'मला निराश किंवा थोडे लाजल्यासारखे वाटते, ज्यामुळे माझे लक्ष तात्पुरते विचलित होते.', score: 2 },
      { text: 'I feel defensive or upset, believing the feedback is unfair or incorrect.', textMarathi: 'मला बचावात्मक किंवा अस्वस्थ वाटते, आणि हा अभिप्राय अन्यायकारक किंवा चुकीचा आहे असा माझा समज होतो.', score: 1 }
    ]
  },
  // 2. Confidence
  {
    id: 3,
    category: 'Confidence',
    questionText: 'When faced with a highly complex, unfamiliar academic topic or project, what is your first instinct?',
    questionTextMarathi: 'अत्यंत गुंतागुंतीचा, अपरिचित शैक्षणिक विषय किंवा प्रकल्पाचा सामना करताना, तुमची पहिली प्रतिक्रिया काय असते?',
    options: [
      { text: 'I embrace it enthusiastically as an exciting challenge to learn something entirely new.', textMarathi: 'नवीन काहीतरी शिकण्याचे एक रोमांचक आव्हान म्हणून मी उत्साहाने त्याचा स्वीकार करतो.', score: 4 },
      { text: 'I approach it willingly but prefer to have structured guidance or check-ins to feel secure.', textMarathi: 'मी स्वेच्छेने सामोरे जातो परंतु सुरक्षित वाटण्यासाठी मला पद्धतशीर मार्गदर्शन हवे असते.', score: 3 },
      { text: 'I feel highly anxious and hesitate, often putting off the task out of fear of doing it poorly.', textMarathi: 'मला खूप चिंता वाटते आणि मी संकोच करतो, अनेकदा खराब कामगिरीच्या भीतीने काम पुढे घकलतो.', score: 2 },
      { text: 'I actively avoid it or seek a simpler alternative because I doubt my ability to succeed.', textMarathi: 'मी सक्रियपणे ते टाळतो किंवा सोपा पर्याय शोधतो कारण मला माझ्या यशाच्या क्षमतेबद्दल शंका असते.', score: 1 }
    ]
  },
  {
    id: 4,
    category: 'Confidence',
    questionText: 'After receiving a disappointing grade or failing at a challenging task, you:',
    questionTextMarathi: 'निराशाजनक गुण मिळाल्यानंतर किंवा आव्हानात्मक कार्यात अपयशी ठरल्यानंतर, तुम्ही:',
    options: [
      { text: 'Deconstruct what went wrong, adapt your strategy, and tackle the challenge again with high resilience.', textMarathi: 'काय चुकले याचे विश्लेषण करतो, माझी रणनीती बदलतो आणि दृढनिश्चयाने पुन्हा आव्हानाचा सामना करतो.', score: 4 },
      { text: 'Accept the outcome, brush it off, and commit to studying harder in the next attempt.', textMarathi: 'मी निकाल स्वीकारतो, त्याकडे दुर्लक्ष करतो आणि पुढच्या वेळी अधिक कठोर अभ्यास करण्याचा निश्चय करतो.', score: 3 },
      { text: 'Feel bad for several days, losing confidence and doubting your ability in that subject area.', textMarathi: 'मला अनेक दिवस वाईट वाटते, माझा आत्मविश्वास कमी होतो आणि त्या विषयात माझ्या क्षमतेबद्दल शंका निर्माण होते.', score: 2 },
      { text: 'Conclude that you are simply "not good enough" at this subject and disengage from it.', textMarathi: 'या विषयात मी "पुरेसा हुशार नाही" असा निष्कर्ष काढून मी त्यापासून दूर जातो.', score: 1 }
    ]
  },
  // 3. Learning Style
  {
    id: 5,
    category: 'Learning Style',
    questionText: 'How do you absorb and process complex academic information most effectively?',
    questionTextMarathi: 'तुम्ही अत्यंत गुंतागुंतीची शैक्षणिक माहिती सर्वात प्रभावीपणे कशी समजून घेता आणि प्रक्रिया करता?',
    options: [
      { text: 'Visual: I study best with diagrams, flowcharts, colors, mind maps, and interactive video aids.', textMarathi: 'दृश्य (Visual): मी आकृत्या, फ्लोचार्ट, रंग, माइंड मॅप्स आणि परस्परसंवादी व्हिडिओंच्या मदतीने सर्वोत्तम अभ्यास करतो.', score: 4 },
      { text: 'Auditory: I learn best through lectures, group discussions, explaining concepts aloud, or podcasts.', textMarathi: 'श्राव्य (Auditory): मी व्याख्याने, गट चर्चा, संकल्पना मोठ्याने स्पष्ट करणे किंवा पॉडकास्टद्वारे सर्वोत्तम शिकतो.', score: 3 },
      { text: 'Read/Write: I absorb info best by writing summaries, reading textbook chapters, and taking meticulous notes.', textMarathi: 'वाचन/लेखन (Read/Write): मी सारांश लिहून, पाठ्यपुस्तकातील धडे वाचून आणि काळजीपूर्वक नोट्स काढून माहिती सर्वोत्तम आत्मसात करतो.', score: 2 },
      { text: 'Kinesthetic: I grasp ideas best through hands-on experiments, building models, or active trial-and-error.', textMarathi: 'प्रायोगिक (Kinesthetic): मी प्रत्यक्ष प्रयोग, मॉडेल तयार करणे किंवा सक्रिय प्रयत्न आणि त्रुटींद्वारे संकल्पना सर्वोत्तम समजून घेतो.', score: 1 }
    ]
  },
  {
    id: 6,
    category: 'Learning Style',
    questionText: 'When preparing for a comprehensive, multi-chapter exam, which method represents your go-to study routine?',
    questionTextMarathi: 'बहु-प्रकरणांच्या परीक्षेची तयारी करताना, खालीलपैकी कोणती पद्धत तुमच्या अभ्यासाची मुख्य पद्धत आहे?',
    options: [
      { text: 'Creating interconnected concept maps to visualize how different topics relate to each other.', textMarathi: 'विविध विषयांचा एकमेकांशी कसा संबंध आहे हे समजून घेण्यासाठी परस्परसंबंधित संकल्पना नकाशे तयार करणे.', score: 4 },
      { text: 'Studying in a group where we explain difficult chapters to each other and debate questions.', textMarathi: 'अशा गटात अभ्यास करणे जिथे आम्ही एकमेकांना कठीण प्रकरणे स्पष्ट करतो आणि प्रश्नांवर चर्चा करतो.', score: 3 },
      { text: 'Quietly re-reading notes multiple times, rewriting key paragraphs, and tackling practice papers.', textMarathi: 'शांतपणे अनेक वेळा नोट्स वाचणे, महत्त्वाचे परिच्छेद पुन्हा लिहिणे आणि सराव पेपर्स सोडवणे.', score: 2 },
      { text: 'Using interactive flashcards, simulators, or physically building out code/projects to test concepts.', textMarathi: 'संकल्पनांची चाचणी घेण्यासाठी परस्परसंवादी फ्लॅशकार्ड्स, सिम्युलेटर वापरणे किंवा प्रत्यक्ष प्रकल्प/कोडिंग करणे.', score: 1 }
    ]
  },
  // 4. Motivation
  {
    id: 7,
    category: 'Motivation',
    questionText: 'What is the primary driving force behind your academic efforts and goals?',
    questionTextMarathi: 'तुमच्या शैक्षणिक प्रयत्नांमागे आणि ध्येयांमागे मुख्य प्रेरक शक्ती काय आहे?',
    options: [
      { text: 'Intrinsic: An inner curiosity, a love for learning, and a personal desire to master subjects.', textMarathi: 'अंतर्गत (Intrinsic): शिकण्याची आंतरिक उत्सुकता, ज्ञानाची आवड आणि विषयांवर प्रभुत्व मिळवण्याची वैयक्तिक इच्छा.', score: 4 },
      { text: 'Extrinsic: Achieving high grades, winning medals, earning awards, and getting praise from others.', textMarathi: 'बाह्य (Extrinsic): चांगले गुण मिळवणे, पदके जिंकणे, पुरस्कार मिळवणे आणि इतरांकडून कौतुक मिळवणे.', score: 3 },
      { text: 'Social/Obligation: Meeting my parents’ expectations and avoiding letting my teachers down.', textMarathi: 'सामाजिक/कर्तव्य: माझ्या पालकांच्या अपेक्षा पूर्ण करणे आणि शिक्षकांना निराश न करणे.', score: 2 },
      { text: 'Survival: Doing just enough to pass, avoid trouble, and complete the minimum requirements.', textMarathi: 'केवळ उत्तीर्ण होणे: केवळ उत्तीर्ण होण्यासाठी, अडचणी टाळण्यासाठी आणि किमान आवश्यकता पूर्ण करण्यासाठी अभ्यास करणे.', score: 1 }
    ]
  },
  {
    id: 8,
    category: 'Motivation',
    questionText: 'When an academic task or assignment becomes repetitive, long, or tedious, how do you handle it?',
    questionTextMarathi: 'जेव्हा एखादे शैक्षणिक काम किंवा गृहपाठ पुनरावृत्तीचे, लांब किंवा कंटाळवाणे होते, तेव्हा तुम्ही ते कसे हाताळता?',
    options: [
      { text: 'I find ways to gamify the task or link it directly to my long-term personal growth goals.', textMarathi: 'मी त्या कामाला खेळाचे स्वरूप देतो किंवा माझ्या दीर्घकालीन वैयक्तिक विकासाच्या ध्येयाशी थेट जोडतो.', score: 4 },
      { text: 'I apply self-discipline, power through, and complete the task because it is my duty.', textMarathi: 'मी स्वयं-शिस्त लागू करतो, कंटाळा बाजूला सारून काम पूर्ण करतो कारण ते माझे कर्तव्य आहे.', score: 3 },
      { text: 'I procrastinate heavily, losing focus, and only finish it when the deadline is imminent.', textMarathi: 'मी खूप टाळाटाळ करतो, लक्ष विचलित होते आणि अंतिम मुदत जवळ आल्यावरच ते पूर्ण करतो.', score: 2 },
      { text: 'I lose motivation quickly and abandon the task unless I am constantly supervised.', textMarathi: 'माझी प्रेरणा लवकर कमी होते आणि सतत देखरेख असल्याशिवाय मी ते काम अर्धवट सोडतो.', score: 1 }
    ]
  },
  // 5. Emotional Regulation
  {
    id: 9,
    category: 'Emotional Regulation',
    questionText: 'Under heavy academic pressure (e.g., final exams, multiple due dates), how do you manage your emotional state?',
    questionTextMarathi: 'तीव्र शैक्षणिक दबावाखाली (उदा. अंतिम परीक्षा, अनेक गृहपाठ), तुम्ही तुमच्या मानसिक स्थितीचे व्यवस्थापन कसे करता?',
    options: [
      { text: 'I stay composed by using structured time-management, relaxation exercises, or mindfulness techniques.', textMarathi: 'मी नियोजित वेळ-व्यवस्थापन, विश्रांतीचे व्यायाम किंवा ध्यान तंत्रांचा वापर करून शांत राहतो.', score: 4 },
      { text: 'I cope by sharing my feelings with friends or family, venting to relieve stress and re-focusing.', textMarathi: 'मी माझे विचार मित्र किंवा कुटुंबासह सामायिक करतो, तणाव कमी करतो आणि पुन्हा लक्ष केंद्रित करतो.', score: 3 },
      { text: 'I become irritable, anxious, or experience sleep disruption, which negatively impacts my focus.', textMarathi: 'मी चिडचिडा किंवा चिंताग्रस्त होतो, किंवा माझ्या झोपेत अडथळा येतो, ज्यामुळे माझ्या लक्ष केंद्रित करण्यावर नकारात्मक परिणाम होतो.', score: 2 },
      { text: 'I feel completely overwhelmed, shut down mentally, and experience severe academic burnout.', textMarathi: 'मला पूर्णपणे दडपण आल्यासारखे वाटते, मानसिकदृष्ट्या थकतो आणि तीव्र शैक्षणिक नैराश्याचा अनुभव घेतो.', score: 1 }
    ]
  },
  {
    id: 10,
    category: 'Emotional Regulation',
    questionText: 'During a group project, if team members strongly disagree with your point of view, you:',
    questionTextMarathi: 'एखाद्या ग्रुप प्रोजेक्ट दरम्यान, जर टीममधील सदस्य तुमच्या मताशी तीव्र असहमत असतील, तर तुम्ही:',
    options: [
      { text: 'Stay perfectly calm, actively listen to their perspectives, and seek a logical, evidence-based consensus.', textMarathi: 'पूर्णपणे शांत राहतो, त्यांच्या दृष्टिकोनाचे काळजीपूर्वक श्रवण करतो आणि तार्किक, पुराव्यावर आधारित सहमती शोधतो.', score: 4 },
      { text: 'Acquiesce to the group’s wishes immediately just to maintain harmony and avoid any conflict.', textMarathi: 'केवळ सुसंवाद राखण्यासाठी आणि कोणताही वाद टाळण्यासाठी मी त्वरित गटाच्या इच्छेशी सहमत होतो.', score: 3 },
      { text: 'Defend your idea with high passion, arguing vigorously even if it creates friction within the team.', textMarathi: 'मी माझ्या कल्पनेचे अत्यंत उत्साहाने समर्थन करतो, संघात तणाव निर्माण झाला तरी जोरदार वाद घालतो.', score: 2 },
      { text: 'Become frustrated, shut down, and withdraw your participation from the project entirely.', textMarathi: 'मी निराश होतो, शांत बसतो आणि प्रकल्पातील माझा सहभाग पूर्णपणे काढून घेतो.', score: 1 }
    ]
  },
  // 6. Communication
  {
    id: 11,
    category: 'Communication',
    questionText: 'When participating in a collaborative group project, how do you express your thoughts?',
    questionTextMarathi: 'सहयोगी गट प्रकल्पात सहभागी होताना, तुम्ही तुमचे विचार कसे मांडता?',
    options: [
      { text: 'I articulate my ideas clearly, invite constructive questions, and facilitate a balanced group dialog.', textMarathi: 'मी माझे विचार स्पष्टपणे मांडतो, रचनात्मक प्रश्नांचे स्वागत करतो आणि गटात संतुलित संवाद साधतो.', score: 4 },
      { text: 'I share my ideas briefly when requested, speaking with clarity but avoiding leading the conversation.', textMarathi: 'विनंती केल्यावर मी माझे विचार थोडक्यात मांडतो, स्पष्टपणे बोलतो परंतु संवादाचे नेतृत्व करणे टाळतो.', score: 3 },
      { text: 'I prefer to put my ideas in writing or charts, feeling uneasy about expressing them verbally to the group.', textMarathi: 'मला माझे विचार लेखी किंवा तक्त्यामध्ये मांडणे आवडते, कारण गटासमोर ते तोंडी सांगण्यास मला संकोच वाटतो.', score: 2 },
      { text: 'I remain mostly quiet, preferring to follow instructions and let others make the points.', textMarathi: 'मी मुख्यतः शांत राहतो, सूचनांचे पालन करणे आणि इतरांना त्यांचे मुद्दे मांडू देणे पसंत करतो.', score: 1 }
    ]
  },
  {
    id: 12,
    category: 'Communication',
    questionText: 'When delivering an oral presentation or speech in front of the entire class, you:',
    questionTextMarathi: 'संपूर्ण वर्गासमोर तोंडी सादरीकरण किंवा भाषण देताना, तुम्ही:',
    options: [
      { text: 'Deliver the material confidently with effective body language, solid pacing, and direct eye contact.', textMarathi: 'प्रभावी देहबोली, योग्य गती आणि थेट डोळ्यांशी संपर्क ठेवून आत्मविश्वासाने सादरीकरण करतो.', score: 4 },
      { text: 'Present clearly and deliver the content successfully, though I experience moderate internal nervousness.', textMarathi: 'मी स्पष्टपणे सादरीकरण करतो आणि सामग्री यशस्वीरित्या पोहोचवतो, जरी मला आतून थोडी भीती वाटत असली तरी.', score: 3 },
      { text: 'Read directly from slides or notes, minimizing eye contact and speaking with a quiet, flat tone.', textMarathi: 'थेट स्लाईड्स किंवा नोट्सवरून वाचतो, डोळ्यांशी संपर्क टाळतो आणि अगदी शांत, संथ आवाजात बोलतो.', score: 2 },
      { text: 'Suffer from severe stage fright, occasionally lose track of thoughts, and find it extremely difficult to speak.', textMarathi: 'मला तीव्र स्टेज भीती वाटते, कधीकधी माझे विचार विसरतो आणि बोलणे अत्यंत कठीण होते.', score: 1 }
    ]
  },
  // 7. Leadership
  {
    id: 13,
    category: 'Leadership',
    questionText: 'When a group assignment lacks clear direction or organization, what do you usually do?',
    questionTextMarathi: 'जेव्हा एखाद्या ग्रुप असाइनमेंटमध्ये स्पष्ट दिशा किंवा नियोजनाचा अभाव असतो, तेव्हा तुम्ही सहसा काय करता?',
    options: [
      { text: 'I immediately step forward, organize roles, assign deadlines, and establish a productive workspace.', textMarathi: 'मी लगेच पुढे येतो, भूमिकांचे आयोजन करतो, मुदती निश्चित करतो आणि एक उत्पादक वातावरण तयार करतो.', score: 4 },
      { text: 'I help organize and coordinate roles if someone else initiates the leadership first.', textMarathi: 'जर इतरांनी आधी नेतृत्व सुरू केले तर मी भूमिकांचे आयोजन आणि समन्वय साधण्यास मदत करतो.', score: 3 },
      { text: 'I focus strictly on my own assigned part, ignoring the overall progress of the group.', textMarathi: 'मी केवळ माझ्या वाटणीच्या भागावर लक्ष केंद्रित करतो, गटाच्या एकूण प्रगतीकडे दुर्लक्ष करतो.', score: 2 },
      { text: 'I wait passively for someone to assign me exactly what to do, doing nothing in the meantime.', textMarathi: 'मी निष्क्रियपणे कोणीतरी मला नेमके काय करायचे आहे ते सांगण्याची वाट पाहतो, तोपर्यंत काहीही करत नाही.', score: 1 }
    ]
  },
  {
    id: 14,
    category: 'Leadership',
    questionText: 'What is your primary focus when you are put in charge of leading a group or team?',
    questionTextMarathi: 'जेव्हा तुम्हाला एखाद्या गटाचे किंवा संघाचे नेतृत्व करण्याची जबाबदारी दिली जाते, तेव्हा तुमचे मुख्य लक्ष कशावर असते?',
    options: [
      { text: 'To inspire and motivate team members, leveraging individual strengths while working towards a shared vision.', textMarathi: 'सदस्यांना प्रेरित करणे, त्यांच्या वैयक्तिक सामर्थ्याचा वापर करून एका सामायिक ध्येयाकडे वाटचाल करणे.', score: 4 },
      { text: 'To ensure the final product is completed with absolute perfection, closely checking everyone’s work.', textMarathi: 'प्रत्येकाच्या कामाची बारकाईने तपासणी करून अंतिम काम परिपूर्णतेने पूर्ण होईल याची खात्री करणे.', score: 3 },
      { text: 'To delegate tasks and expect instructions to be followed precisely without much discussion.', textMarathi: 'कामे सोपवणे आणि फारशी चर्चा न करता दिलेल्या सूचनांचे तंतोतंत पालन केले जाण्याची अपेक्षा ठेवणे.', score: 2 },
      { text: 'I actively avoid leading because I dislike having responsibility for others’ performance.', textMarathi: 'मी सक्रियपणे नेतृत्व करणे टाळतो कारण मला इतरांच्या कामगिरीची जबाबदारी घेणे आवडत नाही.', score: 1 }
    ]
  },
  // 8. Creativity
  {
    id: 15,
    category: 'Creativity',
    questionText: 'When solving a complex logic problem, coding challenge, or scientific experiment, you:',
    questionTextMarathi: 'एखादी गुंतागुंतीची तार्किक समस्या, कोडिंग आव्हान किंवा वैज्ञानिक प्रयोग सोडवताना, तुम्ही:',
    options: [
      { text: 'Think outside the box, brainstorm unconventional methods, and experiment with novel ideas.', textMarathi: 'चौकटीबाहेरचा विचार करतो, अपारंपरिक पद्धतींचा वापर करतो आणि नवीन कल्पनांचे प्रयोग करतो.', score: 4 },
      { text: 'Analyze multiple existing solutions and adapt/combine them in a slightly modified way.', textMarathi: 'अस्तित्वात असलेल्या अनेक उपायांचे विश्लेषण करतो आणि त्यात थोडे बदल करून ते लागू करतो.', score: 3 },
      { text: 'Follow established, pre-approved rules or textbooks step-by-step to arrive at a proven answer.', textMarathi: 'सिद्ध झालेल्या उत्तरापर्यंत पोहोचण्यासाठी प्रस्थापित नियमांचे किंवा पाठ्यपुस्तकांचे टप्प्याटप्प्याने पालन करतो.', score: 2 },
      { text: 'Feel completely stuck or frustrated if there isn’t a clear, pre-existing template or example to copy.', textMarathi: 'कॉपी करण्यासाठी कोणतीही स्पष्ट पूर्व-अस्तित्वात असलेली पद्धत किंवा उदाहरण नसल्यास मला पूर्णपणे अडकल्यासारखे किंवा निराश वाटते.', score: 1 }
    ]
  },
  {
    id: 16,
    category: 'Creativity',
    questionText: 'How do you incorporate originality, innovation, or creative expression into your regular routine?',
    questionTextMarathi: 'तुम्ही तुमच्या दैनंदिन दिनक्रमात नाविन्यपूर्णता किंवा सर्जनशील अभिव्यक्ती कशी समाविष्ट करता?',
    options: [
      { text: 'I regularly engage in original hobbies like creative writing, visual design, inventing, or building custom code.', textMarathi: 'मी नियमितपणे सर्जनशील लेखन, डिझाइन, नवीन शोध किंवा सानुकूल कोडिंग यासारख्या मूळ छंदात व्यस्त असतो.', score: 4 },
      { text: 'I appreciate creative works (art, technology, games) and enjoy talking about how they were made.', textMarathi: 'मी सर्जनशील कामांचे (कला, तंत्रज्ञान, खेळ) कौतुक करतो आणि ते कसे तयार केले गेले याबद्दल बोलण्याचा आनंद घेतो.', score: 3 },
      { text: 'I prefer routines, structured learning, and tasks that have clear, predictable results with no ambiguity.', textMarathi: 'मी दिनचर्या, पद्धतशीर शिक्षण आणि स्पष्ट, अंदाज लावता येण्याजोग्या परिणामांच्या कामांना प्राधान्य देतो.', score: 2 },
      { text: 'I rarely generate original concepts and find creative self-expression difficult or unnecessary.', textMarathi: 'मी नवीन संकल्पना क्वचितच तयार करतो आणि मला सर्जनशील अभिव्यक्ती कठीण किंवा अनावश्यक वाटते.', score: 1 }
    ]
  },
  // 9. Decision Making
  {
    id: 17,
    category: 'Decision Making',
    questionText: 'When faced with an important decision (e.g., choosing electives, science projects, or future majors), you:',
    questionTextMarathi: 'जेव्हा तुमच्यासमोर एखादा महत्त्वाचा निर्णय असतो (उदा. विषय निवडणे, विज्ञान प्रकल्प किंवा भविष्यातील मुख्य शाखा), तेव्हा तुम्ही:',
    options: [
      { text: 'Collect all relevant data, weigh the long-term pros/cons, and seek advice from experienced counselors.', textMarathi: 'सर्व संबंधित माहिती गोळा करतो, दीर्घकालीन फायद्या-तोट्यांचा विचार करतो आणि तज्ज्ञ समुपदेशकांचा सल्ला घेतो.', score: 4 },
      { text: 'Trust your immediate gut feeling/intuition and pick what feels right in the moment.', textMarathi: 'तुमच्या तात्कालिक अंतर्ज्ञानावर विश्वास ठेवता आणि त्या क्षणी जे योग्य वाटते ते निवडता.', score: 3 },
      { text: 'Ask your parents, friends, or siblings to make the decision for you, following their lead entirely.', textMarathi: 'तुमचे पालक, मित्र किंवा भावंडांना तुमच्यासाठी निर्णय घेण्यास सांगता आणि त्यांच्या निर्णयाचे पूर्णपणे पालन करता.', score: 2 },
      { text: 'Avoid making the decision, procrastinating until the absolute last minute when choices are limited.', textMarathi: 'निर्णय घेणे टाळता, अगदी शेवटच्या क्षणापर्यंत टाळाटाळ करता जेव्हा पर्याय मर्यादित असतात.', score: 1 }
    ]
  },
  {
    id: 18,
    category: 'Decision Making',
    questionText: 'Once you make a major choice and experience a setback or failure because of it, how do you react?',
    questionTextMarathi: 'एकदा तुम्ही एखादा मोठा निर्णय घेतला आणि त्यामध्ये अपयश आले, तर तुमची प्रतिक्रिया कशी असते?',
    options: [
      { text: 'I take full, mature responsibility for the outcome, learn from the mistake, and adapt my future approach.', textMarathi: 'मी परिपक्वतेने निकालाची पूर्ण जबाबदारी घेतो, चुकीतून शिकतो आणि भविष्यातील दृष्टिकोन बदलतो.', score: 4 },
      { text: 'I feel some regret or disappointment but try to push through and make the best of the current situation.', textMarathi: 'मला थोडे खेद किंवा निराशा वाटते परंतु मी पुढे जाण्याचा आणि सध्याच्या परिस्थितीचा सर्वोत्तम वापर करण्याचा प्रयत्न करतो.', score: 3 },
      { text: 'I blame external circumstances, bad luck, or other people for the unfavorable outcome.', textMarathi: 'प्रतिकूल परिणामासाठी मी बाह्य परिस्थिति, दुर्दैव किंवा इतर लोकांना दोष देतो.', score: 2 },
      { text: 'I feel completely overwhelmed, regret the choice intensely, and wish I could undo it entirely.', textMarathi: 'मला पूर्णपणे दडपण आल्यासारखे वाटते, निर्णयाचा तीव्र पश्चात्ताप होतो आणि तो निर्णय रद्द व्हावा अशी इच्छा होते.', score: 1 }
    ]
  },
  // 10. Career Interest
  {
    id: 19,
    category: 'Career Interest',
    questionText: 'Which area of activity do you find most naturally engaging and rewarding during your free time?',
    questionTextMarathi: 'तुमच्या मोकळ्या वेळेत तुम्हाला कोणती क्रिया सर्वात नैसर्गिक आणि फायद्याची वाटते?',
    options: [
      { text: 'Problem Solving & Engineering: Programming, analyzing data, researching science, or building physical things.', textMarathi: 'समस्या निवारण आणि अभियांत्रिकी: प्रोग्रामिंग, डेटा विश्लेषण, विज्ञान संशोधन किंवा भौतिक वस्तू तयार करणे.', score: 4 },
      { text: 'Design & Expression: Writing articles/stories, sketching, digital art, or producing audio/video content.', textMarathi: 'डिझाईन आणि अभिव्यक्ती: लेख/कथा लिहिणे, रेखाटन, डिजिटल कला किंवा ऑडिओ/व्हिडिओ सामग्री तयार करणे.', score: 3 },
      { text: 'Helping & Human Development: Explaining concepts, tutoring peers, counseling friends, or volunteering.', textMarathi: 'मदत आणि मानवी विकास: संकल्पना स्पष्ट करणे, मित्रांना शिकवणे, समुपदेशन किंवा स्वयंसेवा करणे.', score: 2 },
      { text: 'Leadership & Business: Organizing events, managing budgets, planning campaigns, or pitching ideas.', textMarathi: 'नेतृत्व आणि व्यवसाय: कार्यक्रमांचे आयोजन, बजेट व्यवस्थापन, मोहिमांचे नियोजन किंवा कल्पना मांडणे.', score: 1 }
    ]
  },
  {
    id: 20,
    category: 'Career Interest',
    questionText: 'When you envision your dream future career, what is your most significant goal?',
    questionTextMarathi: 'जेव्हा तुम्ही तुमच्या स्वप्नातील भविष्यातील करिअरची कल्पना करता, तेव्हा तुमचे सर्वात महत्त्वाचे ध्येय काय असते?',
    options: [
      { text: 'Developing innovative technologies, coding cutting-edge systems, or discovering new scientific facts.', textMarathi: 'नाविन्यपूर्ण तंत्रज्ञान विकसित करणे, अत्याधुनिक प्रणाल्या कोडिंग करणे किंवा नवीन वैज्ञानिक तथ्ये शोधणे.', score: 4 },
      { text: 'Creating meaningful art, literature, game designs, marketing campaigns, or multimedia content.', textMarathi: 'अर्थपूर्ण कला, साहित्य, गेम डिझाईन्स, विपणन मोहिमा किंवा मल्टीमीडिया सामग्री तयार करणे.', score: 3 },
      { text: 'Making a direct positive impact on human lives through education, healthcare, therapy, or social services.', textMarathi: 'शिक्षण, आरोग्य सेवा, थेरपी किंवा सामाजिक सेवांद्वारे मानवी जीवनावर थेट सकारात्मक प्रभाव पाडणे.', score: 2 },
      { text: 'Building a scalable startup, leading corporate projects, managing assets, or spearheading public ventures.', textMarathi: 'एक यशस्वी स्टार्टअप उभारणे, कॉर्पोरेट प्रकल्पांचे नेतृत्व करणे, मालमत्ता व्यवस्थापित करणे किंवा सार्वजनिक उपक्रमांचे नेतृत्व करणे.', score: 1 }
    ]
  }
];
