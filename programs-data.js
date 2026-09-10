/* ==========================================================================
   EntryMap — programs, olympiads and competitions dataset
   Loaded as a plain script before app.js (no modules, no bundler).

   deadline  — ISO date of the next published application deadline. Where the
               organiser has not yet announced the next cycle, this is the most
               recent published deadline, so the entry reads as closed. Open /
               closed is DERIVED from it by programStatus(), never stored.
   subjects  — subject tags shared with S.profile.interests; recommendPrograms()
               scores a program by how much this overlaps the student's profile.
   domain    — used by logo() for the organiser's real logo, with an initials
               fallback built from accent + short.
   ========================================================================== */
const PROGRAMS = [
  /* ------------------------------------------------- Research programmes */
  { id:'rsi', name:'Research Science Institute (RSI)', short:'RSI',
    organizer:'Center for Excellence in Education & MIT', domain:'cee.org', accent:'#A31F34',
    category:'research', deadline:'2026-12-09', format:'offline',
    cost:'Free — fully funded, including travel and housing',
    subjects:['Math','CS','Physics','Chemistry','Biology','Engineering'],
    eligibility:'Grade 11 students with outstanding PSAT/SAT scores and prior science coursework. Open worldwide; about 100 places, roughly 80 US and 20 international.',
    link:'https://www.cee.org/programs/research-science-institute',
    requirements:[
      { id:'rsi-essay',   type:'essay',          label:'Four short essays',        note:'Research interests, a problem you solved, and two personal responses' },
      { id:'rsi-tr',      type:'transcript',     label:'Official transcript',      note:'Grades 9–11 with school stamp and English translation' },
      { id:'rsi-recs',    type:'recs',           label:'Two recommendations',      note:'One from a maths/science teacher, one from a counsellor' },
      { id:'rsi-scores',  type:'language-cert',  label:'Standardised test scores', note:'PSAT/SAT or ACT report; TOEFL/IELTS if schooled outside the US' },
      { id:'rsi-consent', type:'parent-consent', label:'Parent/guardian consent',  note:'Signed release for the residential five-week stay at MIT' }
    ],
    portfolioImpact:{ category:'Research',
      resumeLine:'Research Science Institute (MIT/CEE): 1 of ~100 selected worldwide; 5-week mentored project, written paper and symposium talk.',
      signal:'Shows you can carry out original, mentored research at university level — the strongest single STEM credential available in secondary school.' } },

  { id:'ssp', name:'Summer Science Program (SSP)', short:'SSP',
    organizer:'SSP International', domain:'ssp.org', accent:'#1B4D89',
    category:'research', deadline:'2027-01-30', format:'offline',
    cost:'$8,900 — need-based aid, many attend free',
    subjects:['Astronomy','Physics','Math','Biology','Chemistry'],
    eligibility:'Students aged 15–18 who have completed pre-calculus and one lab science. International deadline is earlier than the domestic one.',
    link:'https://ssp.org/application/',
    requirements:[
      { id:'ssp-essay', type:'essay',          label:'Written responses',    note:'Short answers on motivation and a time you worked in a team' },
      { id:'ssp-tr',    type:'transcript',     label:'Transcript',           note:'Must show completed pre-calculus and a lab science' },
      { id:'ssp-recs',  type:'recs',           label:'Two teacher letters',  note:'Maths and science teachers submit directly' },
      { id:'ssp-fee',   type:'fee',            label:'Application fee',      note:'$60; waived automatically for aid applicants' }
    ],
    portfolioImpact:{ category:'Research',
      resumeLine:'Summer Science Program: determined a near-Earth asteroid orbit from original telescope observations; 39-day residential research team.',
      signal:'Real data, real instruments, real error bars — reads as scientific practice rather than enrichment coursework.' } },

  { id:'primes', name:'MIT PRIMES-USA', short:'PRIMES',
    organizer:'MIT Department of Mathematics', domain:'math.mit.edu', accent:'#A31F34',
    category:'research', deadline:'2026-12-01', format:'online',
    cost:'Free',
    subjects:['Math','CS'],
    eligibility:'US-based students in grades 9–11 with olympiad-level mathematics. Year-long remote research; not open to international applicants.',
    link:'https://math.mit.edu/research/highschool/primes/',
    requirements:[
      { id:'pr-problems', type:'portfolio',      label:'Solved problem set',     note:'Entrance problems published in October; full written solutions required' },
      { id:'pr-essay',    type:'essay',          label:'Motivation essay',       note:'Why research, and how you will protect 10+ hours a week for it' },
      { id:'pr-tr',       type:'transcript',     label:'School transcript',      note:'Current-year grades plus a list of maths courses taken' },
      { id:'pr-recs',     type:'recs',           label:'Teacher recommendation', note:'From a maths teacher who can speak to independent work' }
    ],
    portfolioImpact:{ category:'Research',
      resumeLine:'MIT PRIMES-USA: year-long mentored mathematics research; produced an original paper and presented at the PRIMES conference.',
      signal:'Evidence of sustained, self-directed depth in one subject — a year-long project reads very differently from a two-week camp.' } },

  { id:'simons', name:'Simons Summer Research Program', short:'Simons',
    organizer:'Stony Brook University', domain:'stonybrook.edu', accent:'#990000',
    category:'research', deadline:'2026-02-05', format:'offline',
    cost:'Free — students receive a stipend',
    subjects:['Biology','Chemistry','Physics','Math','CS','Engineering'],
    eligibility:'US high-school juniors aged 16+ by the start of the programme. Matched with a Stony Brook faculty mentor for seven weeks.',
    link:'https://www.stonybrook.edu/simons/',
    requirements:[
      { id:'si-essay', type:'essay',          label:'Research statement',   note:'Rank three faculty research areas and explain the choice' },
      { id:'si-tr',    type:'transcript',     label:'Transcript & scores',  note:'Unofficial transcript plus PSAT/SAT results' },
      { id:'si-recs',  type:'recs',           label:'Two recommendations',  note:'Science and maths teachers' },
      { id:'si-cons',  type:'parent-consent', label:'Parent consent',       note:'Required for the residential option' }
    ],
    portfolioImpact:{ category:'Research',
      resumeLine:'Simons Summer Research Fellow, Stony Brook: seven weeks in a faculty lab; produced a research poster presented at the closing symposium.',
      signal:'Places you inside a working university lab rather than a teaching lab — mentors can write about you as a junior colleague.' } },

  { id:'clark', name:'Clark Scholars Program', short:'Clark',
    organizer:'Texas Tech University', domain:'ttu.edu', accent:'#CC0000',
    category:'research', deadline:'2027-03-31', format:'offline',
    cost:'Free — $750 stipend, room and board covered',
    subjects:['Biology','Chemistry','Physics','Engineering','Math','CS'],
    eligibility:'Students aged 17+ by the programme start. Only 12 scholars selected each summer; open to international applicants.',
    link:'https://www.depts.ttu.edu/honors/academicsandenrichment/affiliatedandhighschool/clarks/',
    requirements:[
      { id:'cl-essay', type:'essay',      label:'Three essays',         note:'Research interest, career goals and a personal statement' },
      { id:'cl-tr',    type:'transcript', label:'Transcript & scores',  note:'Official transcript plus SAT/ACT where available' },
      { id:'cl-recs',  type:'recs',       label:'Two recommendations',  note:'At least one from a science or maths teacher' }
    ],
    portfolioImpact:{ category:'Research',
      resumeLine:'Clark Scholar, Texas Tech: 1 of 12 selected internationally; seven weeks of mentored research ending in a written technical report.',
      signal:'A very small cohort — the selectivity itself is legible to admissions officers who know the programme.' } },

  { id:'garcia', name:'Garcia Summer Research Program', short:'Garcia',
    organizer:'Stony Brook University — Garcia Center', domain:'stonybrook.edu', accent:'#00693E',
    category:'research', deadline:'2026-02-15', format:'offline',
    cost:'$4,500 — partial scholarships available',
    subjects:['Chemistry','Physics','Engineering','Biology'],
    eligibility:'Students aged 16+ with strong chemistry and physics grades. Seven-week polymer and materials science research programme.',
    link:'https://www.stonybrook.edu/garcia/',
    requirements:[
      { id:'ga-essay', type:'essay',      label:'Personal statement',  note:'Why materials science, and prior lab exposure' },
      { id:'ga-tr',    type:'transcript', label:'Transcript',          note:'Must show chemistry and physics coursework' },
      { id:'ga-recs',  type:'recs',       label:'Recommendation',      note:'From a science teacher' }
    ],
    portfolioImpact:{ category:'Research',
      resumeLine:'Garcia Center research programme: polymer science project completed to conference-abstract standard; several alumni co-author papers.',
      signal:'One of the few high-school routes to a genuine materials-science publication record.' } },

  { id:'pioneer', name:'Pioneer Research Program', short:'Pioneer',
    organizer:'Pioneer Academics', domain:'pioneeracademics.com', accent:'#1F3A93',
    category:'research', deadline:'2027-03-15', format:'online',
    cost:'$6,850 — need-based aid available',
    subjects:['Math','CS','Economics','Biology','Physics','Writing','Social Science'],
    eligibility:'Students aged 15–18 worldwide. One-to-one online research with a US university professor, accredited for college credit.',
    link:'https://pioneeracademics.com/',
    requirements:[
      { id:'pi-essay', type:'essay',      label:'Application essays',   note:'Subject interest plus a short analytical writing sample' },
      { id:'pi-tr',    type:'transcript', label:'Transcript',           note:'Two most recent years' },
      { id:'pi-recs',  type:'recs',       label:'Teacher reference',    note:'From a teacher in the subject you plan to research' },
      { id:'pi-lang',  type:'language-cert', label:'English proficiency', note:'Required for applicants outside English-medium schools' }
    ],
    portfolioImpact:{ category:'Research',
      resumeLine:'Pioneer Research Program: one-to-one research with a US professor; produced an independent 20-page paper for college credit.',
      signal:'Fully remote and open worldwide — one of the few credible research credentials reachable from Central Asia without travel funding.' } },

  { id:'horizon', name:'Horizon Academic Research Program', short:'Horizon',
    organizer:'Horizon Inspires', domain:'horizoninspires.com', accent:'#0B7285',
    category:'research', deadline:'2026-11-15', format:'online',
    cost:'$5,500 — need-based aid available',
    subjects:['Economics','Social Science','CS','Biology','Physics','Law'],
    eligibility:'Students aged 14–18 worldwide. Trimester-length seminars ending in a university-style research paper.',
    link:'https://horizoninspires.com/',
    requirements:[
      { id:'ho-essay', type:'essay',      label:'Statement of interest', note:'Which research track and why, 500 words' },
      { id:'ho-tr',    type:'transcript', label:'Transcript',            note:'Most recent full year' },
      { id:'ho-cv',    type:'cv',         label:'Activity list',         note:'Relevant coursework, reading and prior projects' }
    ],
    portfolioImpact:{ category:'Research',
      resumeLine:'Horizon Academic Research Program: completed a 20-page social-science research paper under a PhD mentor; submitted to the Horizon journal.',
      signal:'Fits humanities and social-science applicants, where credible research programmes are much scarcer than in STEM.' } },

  { id:'lumiere', name:'Lumiere Research Scholar Program', short:'Lumiere',
    organizer:'Lumiere Education', domain:'lumiere-education.com', accent:'#5B3393',
    category:'research', deadline:'2027-01-25', format:'online',
    cost:'$2,590–$8,900 by track — full scholarships available',
    subjects:['Economics','CS','Biology','Physics','Writing','Social Science','Medicine'],
    eligibility:'Students aged 14–18 worldwide, no prior research required. Mentors are PhD students from top universities.',
    link:'https://www.lumiere-education.com/',
    requirements:[
      { id:'lu-essay', type:'essay',      label:'Short application',    note:'Research interest and availability; no essay portfolio needed' },
      { id:'lu-tr',    type:'transcript', label:'Transcript',           note:'Latest school report' },
      { id:'lu-cv',    type:'cv',         label:'Activity summary',     note:'One page — clubs, projects, reading' }
    ],
    portfolioImpact:{ category:'Research',
      resumeLine:'Lumiere Research Scholar: 12-week independent research project with a PhD mentor, ending in a publishable paper.',
      signal:'Low barrier to entry, so the paper itself does the talking — make sure the topic is specific enough to defend in an interview.' } },

  { id:'bu-rise', name:'Boston University RISE Internship', short:'RISE',
    organizer:'Boston University', domain:'bu.edu', accent:'#CC0000',
    category:'research', deadline:'2026-02-14', format:'offline',
    cost:'$5,050 (Internship track) — need-based aid available',
    subjects:['Biology','Chemistry','Physics','CS','Engineering','Math'],
    eligibility:'Rising high-school seniors. Six weeks, 40 hours a week in a BU lab, ending with a poster symposium.',
    link:'https://www.bu.edu/summer/high-school-programs/research-internship/',
    requirements:[
      { id:'ri-essay', type:'essay',      label:'Two essays',           note:'Research interest and what you want from a lab placement' },
      { id:'ri-tr',    type:'transcript', label:'Transcript',           note:'Official, plus test scores if available' },
      { id:'ri-recs',  type:'recs',       label:'Two recommendations',  note:'Science teacher and one other' },
      { id:'ri-fee',   type:'fee',        label:'Application fee',      note:'$80, waivers available' }
    ],
    portfolioImpact:{ category:'Research',
      resumeLine:'BU RISE research intern: six weeks full-time in a university lab; presented findings at the BU summer poster symposium.',
      signal:'Full-time hours in one lab show stamina, not sampling — useful evidence for a pre-med or engineering narrative.' } },

  /* ------------------------------------------------------ Summer schools */
  { id:'yygs', name:'Yale Young Global Scholars (YYGS)', short:'YYGS',
    organizer:'Yale University', domain:'yale.edu', accent:'#00356B',
    category:'summer', deadline:'2027-01-12', format:'offline',
    cost:'$6,500 — need-based financial aid up to full tuition',
    subjects:['Social Science','Economics','Physics','Biology','CS','Writing','Law'],
    eligibility:'Students aged 16–18 currently in secondary school. Open worldwide; students from 130+ countries attend each summer.',
    link:'https://globalscholars.yale.edu/',
    requirements:[
      { id:'yy-essay', type:'essay',         label:'Two short essays',    note:'200 and 500 words on your interests and a community you belong to' },
      { id:'yy-tr',    type:'transcript',    label:'Academic transcript', note:'Most recent full year, English translation if needed' },
      { id:'yy-rec',   type:'recs',          label:'One recommendation',  note:'From a current teacher — not a family member or friend' },
      { id:'yy-lang',  type:'language-cert', label:'English proficiency', note:'TOEFL/IELTS/Duolingo if English is not your school language' },
      { id:'yy-fee',   type:'fee',           label:'Application fee',     note:'$80 — fee waiver available on the same form' }
    ],
    portfolioImpact:{ category:'Academic',
      resumeLine:'Yale Young Global Scholars — Innovations in Science & Technology: two-week academic intensive with students from 130+ countries.',
      signal:'Shows academic curiosity beyond the school curriculum and comfort in an international, discussion-driven classroom.' } },

  { id:'stanford-pcsi', name:'Stanford Pre-Collegiate Summer Institutes', short:'SPCS',
    organizer:'Stanford University', domain:'stanford.edu', accent:'#8C1515',
    category:'summer', deadline:'2027-02-10', format:'hybrid',
    cost:'$8,575 residential · $4,900 online',
    subjects:['Math','CS','Physics','Biology','Writing','Economics','Philosophy'],
    eligibility:'Students in grades 8–11 at the time of application. Open worldwide; residential and online sessions run in parallel.',
    link:'https://spcs.stanford.edu/programs/stanford-pre-collegiate-summer-institutes',
    requirements:[
      { id:'sp-essay',   type:'essay',          label:'Two personal essays',    note:'Course-choice rationale plus one open personal response' },
      { id:'sp-tr',      type:'transcript',     label:'Transcript',             note:'Two most recent years, official or school-certified copy' },
      { id:'sp-rec',     type:'recs',           label:'Teacher recommendation', note:'Submitted directly through the portal by the teacher' },
      { id:'sp-consent', type:'parent-consent', label:'Parent/guardian forms',  note:'Consent and health forms required for residential sessions' },
      { id:'sp-fee',     type:'fee',            label:'Application fee',        note:'$65, non-refundable; waivers for financial-aid applicants' }
    ],
    portfolioImpact:{ category:'Academic',
      resumeLine:'Stanford Pre-Collegiate Summer Institutes: three-week single-subject intensive in Number Theory with a final research presentation.',
      signal:'Demonstrates you sought out university-level coursework in your intended major before applying to it.' } },

  { id:'sumac', name:'Stanford University Mathematics Camp (SUMaC)', short:'SUMaC',
    organizer:'Stanford University', domain:'stanford.edu', accent:'#8C1515',
    category:'summer', deadline:'2027-02-01', format:'hybrid',
    cost:'$8,250 residential · $3,300 online — need-based aid available',
    subjects:['Math'],
    eligibility:'Students in grades 10–11 with strong abstract-mathematics ability. Admission turns mostly on the mathematics section of the application.',
    link:'https://sumac.spcs.stanford.edu/',
    requirements:[
      { id:'su-math',  type:'portfolio',  label:'Mathematics problem set', note:'The decisive part of the application — full proofs expected' },
      { id:'su-essay', type:'essay',      label:'Short essays',            note:'Mathematical interests and a problem you enjoyed' },
      { id:'su-tr',    type:'transcript', label:'Transcript',              note:'Must show completed algebra II / pre-calculus' },
      { id:'su-rec',   type:'recs',       label:'Maths teacher letter',    note:'Speaks to proof-writing ability, not just grades' }
    ],
    portfolioImpact:{ category:'Science/Math',
      resumeLine:'Stanford University Mathematics Camp: abstract algebra and number theory track; completed a guided independent proof project.',
      signal:'Signals proof-based mathematical maturity — the specific thing maths departments look for beyond contest scores.' } },

  { id:'mites', name:'MITES Summer', short:'MITES',
    organizer:'MIT Office of Engineering Outreach Programs', domain:'mit.edu', accent:'#A31F34',
    category:'summer', deadline:'2027-02-01', format:'offline',
    cost:'Free — MIT covers tuition, housing and meals',
    subjects:['Math','Physics','CS','Engineering','Writing'],
    eligibility:'US high-school juniors from backgrounds under-represented in engineering. Six weeks on the MIT campus.',
    link:'https://oeop.mit.edu/programs/mites',
    requirements:[
      { id:'mi-essay', type:'essay',          label:'Essay set',            note:'Several essays on background, motivation and resilience' },
      { id:'mi-tr',    type:'transcript',     label:'Transcript & scores',  note:'Official transcript plus PSAT/SAT if taken' },
      { id:'mi-recs',  type:'recs',           label:'Two recommendations',  note:'Maths and science teachers' },
      { id:'mi-cons',  type:'parent-consent', label:'Family information',   note:'Household data used for the eligibility review' }
    ],
    portfolioImpact:{ category:'Academic',
      resumeLine:'MITES Summer at MIT: six-week residential STEM programme; completed college-level coursework in physics, maths and science writing.',
      signal:'Highly selective and fully funded — a credential that carries weight precisely because money was not the filter.' } },

  { id:'bwsi', name:'MIT Beaver Works Summer Institute', short:'BWSI',
    organizer:'MIT Lincoln Laboratory', domain:'mit.edu', accent:'#8A8B8C',
    category:'summer', deadline:'2027-03-01', format:'hybrid',
    cost:'Free',
    subjects:['CS','Robotics','Engineering','Math'],
    eligibility:'Rising high-school seniors who complete the online prerequisite course. Project-based tracks in autonomy, radar and machine learning.',
    link:'https://beaverworks.ll.mit.edu/CMS/bw/bwsi',
    requirements:[
      { id:'bw-course', type:'portfolio',     label:'Online prerequisite course', note:'Must be completed and passed before the application closes' },
      { id:'bw-essay',  type:'essay',         label:'Short responses',            note:'Track choice and prior programming experience' },
      { id:'bw-tr',     type:'transcript',    label:'Transcript',                 note:'Current year grades' },
      { id:'bw-rec',    type:'recs',          label:'Teacher recommendation',     note:'STEM teacher preferred' }
    ],
    portfolioImpact:{ category:'Computer/Technology',
      resumeLine:'MIT Beaver Works Summer Institute: built and raced an autonomous 1/10-scale vehicle; four-week project-based engineering course.',
      signal:'Project you can demo and talk about in detail — far more interview-ready than a lecture-based summer course.' } },

  { id:'promys', name:'PROMYS — Program in Mathematics for Young Scientists', short:'PROMYS',
    organizer:'Boston University', domain:'promys.org', accent:'#CC0000',
    category:'summer', deadline:'2027-04-01', format:'offline',
    cost:'$6,300 — full need-based aid, no admitted student turned away',
    subjects:['Math'],
    eligibility:'Students aged 14–18 worldwide. Admission is decided almost entirely on the open-ended problem set.',
    link:'https://promys.org/',
    requirements:[
      { id:'pm-problems', type:'portfolio',  label:'Entrance problem set', note:'Open-ended number theory problems; partial progress is expected' },
      { id:'pm-essay',    type:'essay',      label:'Short essays',         note:'Mathematical background and why PROMYS' },
      { id:'pm-tr',       type:'transcript', label:'Transcript',           note:'Latest school report' },
      { id:'pm-rec',      type:'recs',       label:'Maths reference',      note:'From a teacher familiar with your problem-solving' }
    ],
    portfolioImpact:{ category:'Science/Math',
      resumeLine:'PROMYS at Boston University: six-week immersion in number theory; wrote up an independent exploration of a research-level problem.',
      signal:'Alongside Ross, the classic proof-based maths programme — maths departments recognise the name immediately.' } },

  { id:'ross', name:'Ross Mathematics Program', short:'Ross',
    organizer:'Ross Mathematics Foundation', domain:'rossprogram.org', accent:'#BB0000',
    category:'summer', deadline:'2027-03-31', format:'offline',
    cost:'$6,000 — need-based aid available',
    subjects:['Math'],
    eligibility:'Students aged 15–18 worldwide who can commit to six weeks of intensive number theory. Admission rests on the problem set.',
    link:'https://rossprogram.org/',
    requirements:[
      { id:'ro-problems', type:'portfolio',  label:'Application problem set', note:'Solutions must show reasoning, not just answers' },
      { id:'ro-essay',    type:'essay',      label:'Personal statement',      note:'Mathematical experience and motivation' },
      { id:'ro-tr',       type:'transcript', label:'Transcript',              note:'Recent maths coursework' },
      { id:'ro-rec',      type:'recs',       label:'Recommendation',          note:'Maths teacher or coach' }
    ],
    portfolioImpact:{ category:'Science/Math',
      resumeLine:'Ross Mathematics Program: six weeks of "think deeply of simple things" number theory; completed daily proof sets and a final exploration.',
      signal:'A programme that measures persistence on hard problems — exactly the trait selective maths courses screen for.' } },

  { id:'mathcamp', name:'Canada/USA Mathcamp', short:'Mathcamp',
    organizer:'Mathematics Foundation of America', domain:'mathcamp.org', accent:'#2E7D32',
    category:'summer', deadline:'2027-03-10', format:'offline',
    cost:'$5,500 — sliding-scale aid, roughly half of campers pay less',
    subjects:['Math'],
    eligibility:'Students aged 13–18 worldwide. The Qualifying Quiz is the main admission criterion.',
    link:'https://www.mathcamp.org/',
    requirements:[
      { id:'mc-quiz',  type:'portfolio',  label:'Qualifying Quiz',      note:'Open-ended problems released in January; collaboration not allowed' },
      { id:'mc-essay', type:'essay',      label:'Application essays',   note:'Mathematical autobiography and community questions' },
      { id:'mc-rec',   type:'recs',       label:'Recommendation',       note:'Teacher or mentor who knows your mathematics' }
    ],
    portfolioImpact:{ category:'Science/Math',
      resumeLine:'Canada/USA Mathcamp: five weeks of undergraduate and graduate-level mathematics electives chosen and self-directed daily.',
      signal:'Self-directed curriculum — shows you can navigate advanced mathematics without being assigned it.' } },

  { id:'tass', name:'Telluride Association Summer Seminar (TASS)', short:'TASS',
    organizer:'Telluride Association', domain:'tellurideassociation.org', accent:'#4A2E6B',
    category:'summer', deadline:'2027-01-05', format:'offline',
    cost:'Free — full scholarship including travel',
    subjects:['Social Science','Writing','Law','Philosophy'],
    eligibility:'Students in grades 10–11 worldwide. Six weeks of college-level critical theory seminars with no grades and no credit.',
    link:'https://www.tellurideassociation.org/our-programs/high-school-students/',
    requirements:[
      { id:'ta-essay', type:'essay',      label:'Essay set',            note:'Several long-form essays — the core of the application' },
      { id:'ta-tr',    type:'transcript', label:'Transcript',           note:'Grades 9 onward' },
      { id:'ta-recs',  type:'recs',       label:'Two recommendations',  note:'Humanities or social-science teachers preferred' }
    ],
    portfolioImpact:{ category:'Academic',
      resumeLine:'Telluride Association Summer Seminar: fully funded six-week humanities seminar; wrote weekly critical essays and led seminar discussion.',
      signal:'The strongest free humanities credential available to high-school students, and it is need-blind and merit-only.' } },

  { id:'cosmos', name:'COSMOS — California State Summer School for Math & Science', short:'COSMOS',
    organizer:'University of California', domain:'universityofcalifornia.edu', accent:'#1295D8',
    category:'summer', deadline:'2026-02-06', format:'offline',
    cost:'$5,300 for non-California residents — aid for CA residents',
    subjects:['Math','Physics','Biology','Engineering','CS','Environment'],
    eligibility:'Students in grades 8–12 with strong STEM grades. Four weeks on a UC campus in a chosen cluster.',
    link:'https://cosmos.ucop.edu/',
    requirements:[
      { id:'co-essay', type:'essay',      label:'Cluster essays',       note:'Why this cluster, plus a STEM experience response' },
      { id:'co-tr',    type:'transcript', label:'Transcript',           note:'Maths and science grades weigh most' },
      { id:'co-recs',  type:'recs',       label:'Two recommendations',  note:'Maths and science teachers' },
      { id:'co-fee',   type:'fee',        label:'Application fee',      note:'$40; waivers available' }
    ],
    portfolioImpact:{ category:'Academic',
      resumeLine:'COSMOS at UC San Diego: four-week intensive in a single STEM cluster, ending with a team research project and poster.',
      signal:'Well known to California admissions readers, and the cluster you pick sends a clear signal about intended major.' } },

  { id:'harvard-ssp', name:'Harvard Summer School — Secondary School Program', short:'Harvard SSP',
    organizer:'Harvard University', domain:'harvard.edu', accent:'#A51C30',
    category:'summer', deadline:'2026-04-15', format:'hybrid',
    cost:'$5,500–$15,800 depending on credits and housing',
    subjects:['Writing','Economics','CS','Biology','Social Science','Math'],
    eligibility:'Students aged 16–19 worldwide. Take real Harvard undergraduate courses for credit alongside university students.',
    link:'https://summer.harvard.edu/high-school-programs/',
    requirements:[
      { id:'hs-essay', type:'essay',         label:'Personal statement',  note:'Course choice and academic readiness' },
      { id:'hs-tr',    type:'transcript',    label:'Transcript',          note:'Official, with English translation if needed' },
      { id:'hs-rec',   type:'recs',          label:'Counsellor/teacher recommendation', note:'Confirms readiness for college coursework' },
      { id:'hs-lang',  type:'language-cert', label:'English proficiency', note:'TOEFL 100+ / IELTS 7.0+ for non-native speakers' },
      { id:'hs-fee',   type:'fee',           label:'Application fee',     note:'$75' }
    ],
    portfolioImpact:{ category:'Academic',
      resumeLine:'Harvard Summer School: earned 8 college credits in Expository Writing and Microeconomics alongside undergraduates; final grade on transcript.',
      signal:'Produces a real university transcript — evidence of college-level performance rather than participation.' } },

  { id:'lse-summer', name:'LSE Summer School — Young Leaders Programme', short:'LSE',
    organizer:'London School of Economics', domain:'lse.ac.uk', accent:'#E1261C',
    category:'summer', deadline:'2027-05-01', format:'offline',
    cost:'£3,500 — limited bursaries',
    subjects:['Economics','Business','Law','Social Science','Debate'],
    eligibility:'Students aged 15–18 worldwide. Two-week social-science programme taught by LSE faculty in central London.',
    link:'https://www.lse.ac.uk/study-at-lse/summer-schools',
    requirements:[
      { id:'ls-essay', type:'essay',         label:'Motivation statement', note:'500 words on your interest in the social sciences' },
      { id:'ls-tr',    type:'transcript',    label:'School report',        note:'Most recent year' },
      { id:'ls-lang',  type:'language-cert', label:'English proficiency',  note:'IELTS 6.5+ or equivalent for non-native speakers' },
      { id:'ls-cons',  type:'parent-consent', label:'Parent consent',      note:'Required for under-18 residential students' }
    ],
    portfolioImpact:{ category:'Academic',
      resumeLine:'LSE Summer School: two-week programme in economics and public policy taught by LSE faculty; completed an assessed group policy brief.',
      signal:'A clear UK-facing signal for economics and PPE applicants, who are read differently from US applicants.' } },

  { id:'yspa', name:'Yale Summer Program in Astrophysics (YSPA)', short:'YSPA',
    organizer:'Yale University', domain:'yale.edu', accent:'#00356B',
    category:'summer', deadline:'2027-03-20', format:'offline',
    cost:'$6,700 — need-based aid available',
    subjects:['Astronomy','Physics','Math','CS'],
    eligibility:'Students aged 16–18 who have completed pre-calculus. Four weeks of asteroid observation, Python analysis and a written paper.',
    link:'https://yspa.yale.edu/',
    requirements:[
      { id:'ys-essay', type:'essay',      label:'Application essays',   note:'Astronomy interest and a problem-solving experience' },
      { id:'ys-tr',    type:'transcript', label:'Transcript',           note:'Must show pre-calculus and physics' },
      { id:'ys-recs',  type:'recs',       label:'Two recommendations',  note:'Maths/science teachers' }
    ],
    portfolioImpact:{ category:'Research',
      resumeLine:'Yale Summer Program in Astrophysics: measured an asteroid orbit from original observations and co-wrote a formal research paper.',
      signal:'Combines observational data, Python and formal scientific writing — three concrete skills in one line.' } },

  { id:'m-and-t', name:'Penn M&T Summer Institute', short:'M&TSI',
    organizer:'University of Pennsylvania', domain:'upenn.edu', accent:'#011F5B',
    category:'summer', deadline:'2026-03-01', format:'offline',
    cost:'$10,500 — need-based aid available',
    subjects:['Business','Engineering','CS','Entrepreneurship'],
    eligibility:'Rising high-school juniors and seniors. Three weeks combining engineering and Wharton business coursework.',
    link:'https://www.seas.upenn.edu/mtsi/',
    requirements:[
      { id:'mt-essay', type:'essay',      label:'Essays',               note:'Technology-and-business interest plus a product idea' },
      { id:'mt-tr',    type:'transcript', label:'Transcript & scores',  note:'Official transcript, SAT/ACT optional' },
      { id:'mt-recs',  type:'recs',       label:'Two recommendations',  note:'Maths/science teacher and one other' },
      { id:'mt-fee',   type:'fee',        label:'Application fee',      note:'$85, waivers available' }
    ],
    portfolioImpact:{ category:'Career Oriented',
      resumeLine:'Penn M&T Summer Institute: three-week engineering-and-business intensive; pitched a venture prototype to Wharton faculty judges.',
      signal:'The clearest signal available for a technology-plus-business narrative, which otherwise reads as unfocused.' } },

  /* --------------------------------------------------------- Internships */
  { id:'gwc-sip', name:'Girls Who Code Summer Immersion Program', short:'GWC',
    organizer:'Girls Who Code', domain:'girlswhocode.com', accent:'#25355A',
    category:'internship', deadline:'2027-03-13', format:'online',
    cost:'Free — need-based stipend available',
    subjects:['CS','Engineering','Entrepreneurship'],
    eligibility:'Students who identify as girls or non-binary, in grades 9–11, based in the US or Canada. No prior coding experience required.',
    link:'https://girlswhocode.com/programs/summer-immersion-program',
    requirements:[
      { id:'gw-essay',   type:'essay',          label:'Short answers',           note:'Three 150-word responses on impact and what you want to build' },
      { id:'gw-consent', type:'parent-consent', label:'Parent/guardian consent', note:'Required for all participants under 18' },
      { id:'gw-cv',      type:'cv',             label:'Activity list',           note:'Clubs, projects and any prior tech exposure — one page' }
    ],
    portfolioImpact:{ category:'Career Oriented',
      resumeLine:'Girls Who Code Summer Immersion: two-week industry program; built and shipped a team web app with engineer mentors from a partner company.',
      signal:'Combines technical skill with exposure to a professional engineering team — reads as career intent, not just classroom interest.' } },

  { id:'nasa-ostem', name:'NASA OSTEM Internships', short:'NASA',
    organizer:'NASA Office of STEM Engagement', domain:'nasa.gov', accent:'#0B3D91',
    category:'internship', deadline:'2026-05-16', format:'hybrid',
    cost:'Free — paid stipend',
    subjects:['Engineering','Physics','CS','Astronomy','Math','Earth Science'],
    eligibility:'US citizens aged 16+ with a 3.0 GPA or higher. One application covers all NASA centres and sessions.',
    link:'https://intern.nasa.gov/',
    requirements:[
      { id:'na-essay', type:'essay',      label:'Statement of interest', note:'Ranked centre and project preferences with justification' },
      { id:'na-tr',    type:'transcript', label:'Transcript',            note:'Unofficial accepted; 3.0 GPA minimum enforced' },
      { id:'na-rec',   type:'recs',       label:'One recommendation',    note:'Teacher or mentor, submitted through the portal' },
      { id:'na-cv',    type:'cv',         label:'Résumé',                note:'One page, technical projects first' }
    ],
    portfolioImpact:{ category:'Internship',
      resumeLine:'NASA OSTEM intern: contributed to a flight-hardware test campaign; delivered a written technical report to the centre mentor.',
      signal:'A paid federal internship — the pay itself signals that the work was substantive rather than observational.' } },

  { id:'boa-leaders', name:'Bank of America Student Leaders', short:'BofA',
    organizer:'Bank of America', domain:'bankofamerica.com', accent:'#E31837',
    category:'internship', deadline:'2027-01-15', format:'offline',
    cost:'Free — paid eight-week internship',
    subjects:['Business','Social Science','Economics'],
    eligibility:'US high-school juniors and seniors. Paid summer placement with a local non-profit plus a leadership summit in Washington DC.',
    link:'https://about.bankofamerica.com/en/making-an-impact/student-leaders',
    requirements:[
      { id:'bo-essay', type:'essay',          label:'Essay responses',      note:'Community involvement and leadership experience' },
      { id:'bo-recs',  type:'recs',           label:'Two recommendations',  note:'One from a community or non-profit contact' },
      { id:'bo-cv',    type:'cv',             label:'Résumé',               note:'Volunteering hours and roles held' },
      { id:'bo-cons',  type:'parent-consent', label:'Work authorisation',   note:'Employment paperwork for paid minors' }
    ],
    portfolioImpact:{ category:'Community Service (Volunteer)',
      resumeLine:'Bank of America Student Leader: paid eight-week non-profit internship plus the national Student Leadership Summit in Washington DC.',
      signal:'Ties service to paid professional responsibility — stronger than volunteer hours alone.' } },

  { id:'nih-sip', name:'NIH Summer Internship Program', short:'NIH SIP',
    organizer:'National Institutes of Health', domain:'nih.gov', accent:'#20558A',
    category:'internship', deadline:'2027-02-28', format:'offline',
    cost:'Free — paid monthly stipend',
    subjects:['Biology','Chemistry','Medicine','CS'],
    eligibility:'US citizens or permanent residents aged 17+ at the start of the internship. Eight weeks minimum in an NIH lab.',
    link:'https://www.training.nih.gov/programs/sip',
    requirements:[
      { id:'ni-essay', type:'essay',      label:'Cover letter',        note:'Research interests and which institutes you are targeting' },
      { id:'ni-tr',    type:'transcript', label:'Transcript',          note:'Current unofficial transcript' },
      { id:'ni-recs',  type:'recs',       label:'Two references',      note:'Science teachers or prior research supervisors' },
      { id:'ni-cv',    type:'cv',         label:'Résumé',              note:'Lab skills and coursework' }
    ],
    portfolioImpact:{ category:'Research',
      resumeLine:'NIH Summer Internship: eight weeks in an intramural laboratory; presented a poster at NIH Summer Poster Day.',
      signal:'Federal biomedical research experience — the single most recognisable pre-med research credential in the US.' } },

  /* ------------------------------------------------------- Olympiads */
  { id:'imo', name:'International Mathematical Olympiad (IMO) — national selection', short:'IMO',
    organizer:'IMO Board / national olympiad committee', domain:'imo-official.org', accent:'#1B5E20',
    category:'olympiad', deadline:'2026-11-15', format:'offline',
    cost:'Free',
    subjects:['Math'],
    eligibility:'Secondary-school students under 20 who place in the national round. IMO 2027 is hosted in Budapest, Hungary, 16–26 July 2027.',
    link:'https://www.imo-official.org/',
    requirements:[
      { id:'im-nom',  type:'transcript',     label:'School nomination',   note:'Entry through the school into the regional round' },
      { id:'im-cons', type:'parent-consent', label:'Parent consent',      note:'Required for the national training camp and travel' },
      { id:'im-cv',   type:'cv',             label:'Results record',      note:'Regional scores and prior olympiad placements' }
    ],
    portfolioImpact:{ category:'Science/Math',
      resumeLine:'National Mathematical Olympiad: qualified for the national team selection camp for IMO 2027 (Budapest).',
      signal:'An externally ranked result against a national cohort — universities can calibrate it without knowing your school.' } },

  { id:'ioi-nat', name:'International Olympiad in Informatics (IOI) — national selection', short:'IOI',
    organizer:'IOI / national informatics committee', domain:'ioinformatics.org', accent:'#0D47A1',
    category:'olympiad', deadline:'2026-12-15', format:'offline',
    cost:'Free',
    subjects:['CS','Math'],
    eligibility:'Secondary-school students under 20 who place in the regional round. IOI 2027 is hosted by the Hasso Plattner Institute in Potsdam, Germany.',
    link:'https://ioinformatics.org/',
    requirements:[
      { id:'io-nom',     type:'transcript',     label:'School nomination',       note:'Signed by the school and regional olympiad committee' },
      { id:'io-consent', type:'parent-consent', label:'Parent/guardian consent', note:'Required for travel to the national selection camp' },
      { id:'io-cv',      type:'cv',             label:'Results record',          note:'Regional round score plus any prior olympiad placements' }
    ],
    portfolioImpact:{ category:'Science/Math',
      resumeLine:'National Informatics Olympiad: placed in the national selection round; competed in the four-person team training camp.',
      signal:'A ranked, externally verified result — admissions offices can compare it directly against a national cohort.' } },

  { id:'ipho', name:'International Physics Olympiad (IPhO) — national selection', short:'IPhO',
    organizer:'IPhO / national physics committee', domain:'ipho-unofficial.org', accent:'#4A148C',
    category:'olympiad', deadline:'2026-12-01', format:'offline',
    cost:'Free',
    subjects:['Physics','Math'],
    eligibility:'Secondary-school students under 20. Five-student national teams sit a theoretical and an experimental exam.',
    link:'https://www.ipho-unofficial.org/',
    requirements:[
      { id:'ip-nom',  type:'transcript',     label:'School nomination',  note:'Regional physics olympiad entry' },
      { id:'ip-cons', type:'parent-consent', label:'Parent consent',     note:'For the residential selection camp' },
      { id:'ip-cv',   type:'cv',             label:'Results record',     note:'Prior physics olympiad results' }
    ],
    portfolioImpact:{ category:'Science/Math',
      resumeLine:'National Physics Olympiad: national selection round qualifier for IPhO; trained on Olympiad-level mechanics and electromagnetism.',
      signal:'The experimental exam makes this a rare signal of lab skill as well as theory.' } },

  { id:'icho', name:'International Chemistry Olympiad (IChO) — national selection', short:'IChO',
    organizer:'IChO / national chemistry committee', domain:'ichosc.org', accent:'#00695C',
    category:'olympiad', deadline:'2026-12-20', format:'offline',
    cost:'Free',
    subjects:['Chemistry','Biology'],
    eligibility:'Secondary-school students under 20 who have not begun university study. Four-student national teams.',
    link:'https://www.ichosc.org/',
    requirements:[
      { id:'ic-nom',  type:'transcript',     label:'School nomination',  note:'Regional chemistry olympiad entry' },
      { id:'ic-cons', type:'parent-consent', label:'Parent consent',     note:'Laboratory safety and travel forms' },
      { id:'ic-cv',   type:'cv',             label:'Results record',     note:'Prior chemistry competition results' }
    ],
    portfolioImpact:{ category:'Science/Math',
      resumeLine:'National Chemistry Olympiad: qualified for the national selection round; five-hour practical laboratory examination.',
      signal:'The practical component is unusual — it evidences bench technique, which most chemistry applicants cannot show.' } },

  { id:'ibo', name:'International Biology Olympiad (IBO) — national selection', short:'IBO',
    organizer:'IBO / national biology committee', domain:'ibo-info.org', accent:'#2E7D32',
    category:'olympiad', deadline:'2027-01-15', format:'offline',
    cost:'Free',
    subjects:['Biology','Medicine'],
    eligibility:'Secondary-school students under 20. National rounds usually begin with a written multiple-choice screen.',
    link:'https://www.ibo-info.org/',
    requirements:[
      { id:'ib-nom',  type:'transcript',     label:'School nomination',  note:'Entry into the national screening exam' },
      { id:'ib-cons', type:'parent-consent', label:'Parent consent',     note:'For the training camp' },
      { id:'ib-cv',   type:'cv',             label:'Results record',     note:'Prior biology olympiad or science-fair results' }
    ],
    portfolioImpact:{ category:'Science/Math',
      resumeLine:'National Biology Olympiad: advanced to the national selection round; practical exams in anatomy, genetics and ecology.',
      signal:'For pre-med applicants, a ranked biology result carries more weight than shadowing hours.' } },

  { id:'iol', name:'International Linguistics Olympiad (IOL) — national selection', short:'IOL',
    organizer:'IOL / national linguistics committee', domain:'ioling.org', accent:'#6A1B9A',
    category:'olympiad', deadline:'2027-01-20', format:'hybrid',
    cost:'Free',
    subjects:['Linguistics','Math','CS','Writing'],
    eligibility:'Secondary-school students. No prior knowledge of any language is needed — the problems are self-contained puzzles.',
    link:'https://ioling.org/',
    requirements:[
      { id:'il-reg',  type:'cv',             label:'Registration',       note:'Through your school or national organiser' },
      { id:'il-cons', type:'parent-consent', label:'Parent consent',     note:'For travel if selected for the national team' }
    ],
    portfolioImpact:{ category:'Science/Math',
      resumeLine:'National Linguistics Olympiad: national round qualifier; solved self-contained problems in Tzeltal, Georgian and Old Norse morphology.',
      signal:'An unusual, memorable credential that reads as pure analytical reasoning — strong for cognitive science and CS applications.' } },

  { id:'ieo', name:'International Economics Olympiad (IEO) — national selection', short:'IEO',
    organizer:'IEO / national economics committee', domain:'ecolymp.org', accent:'#B71C1C',
    category:'olympiad', deadline:'2027-02-01', format:'hybrid',
    cost:'Free',
    subjects:['Economics','Business','Math'],
    eligibility:'Secondary-school students under 20. Three rounds: economics theory, financial literacy and a business case.',
    link:'https://ecolymp.org/',
    requirements:[
      { id:'ie-reg',   type:'cv',             label:'Registration',      note:'Through the national organiser' },
      { id:'ie-case',  type:'portfolio',      label:'Business case',     note:'Team round — a presented solution to a live case' },
      { id:'ie-cons',  type:'parent-consent', label:'Parent consent',    note:'For international travel if selected' }
    ],
    portfolioImpact:{ category:'Science/Math',
      resumeLine:'National Economics Olympiad: national round qualifier; scored across economics theory, financial literacy and the team business case.',
      signal:'One of the few ranked, objective credentials available to economics and business applicants.' } },

  { id:'ioaa', name:'International Olympiad on Astronomy and Astrophysics (IOAA)', short:'IOAA',
    organizer:'IOAA / national astronomy committee', domain:'ioaastrophysics.org', accent:'#283593',
    category:'olympiad', deadline:'2027-01-10', format:'offline',
    cost:'Free',
    subjects:['Astronomy','Physics','Math'],
    eligibility:'Secondary-school students under 20. Theory, data-analysis and observation rounds, including a night-sky examination.',
    link:'https://www.ioaastrophysics.org/',
    requirements:[
      { id:'ia-nom',  type:'transcript',     label:'School nomination',  note:'Through the national astronomy olympiad' },
      { id:'ia-cons', type:'parent-consent', label:'Parent consent',     note:'Night observation sessions require consent' }
    ],
    portfolioImpact:{ category:'Science/Math',
      resumeLine:'National Astronomy Olympiad: qualified for the IOAA selection round; theory, data-analysis and night-sky observation examinations.',
      signal:'Pairs quantitative physics with real observation — a distinctive line for astrophysics applicants.' } },

  { id:'igeo', name:'International Geography Olympiad (iGeo) — national selection', short:'iGeo',
    organizer:'International Geographical Union', domain:'geoolympiad.org', accent:'#00838F',
    category:'olympiad', deadline:'2026-02-15', format:'offline',
    cost:'Free',
    subjects:['Earth Science','Environment','Social Science'],
    eligibility:'Students aged 16–19. Written test, multimedia test and a substantial fieldwork exercise.',
    link:'https://geoolympiad.org/',
    requirements:[
      { id:'ig-nom',  type:'transcript',     label:'School nomination',  note:'Via the national geography olympiad' },
      { id:'ig-field',type:'portfolio',      label:'Fieldwork exercise', note:'Mapping and data collection component' },
      { id:'ig-cons', type:'parent-consent', label:'Parent consent',     note:'For fieldwork and travel' }
    ],
    portfolioImpact:{ category:'Science/Math',
      resumeLine:'National Geography Olympiad: national round qualifier; completed the fieldwork exercise in urban land-use mapping.',
      signal:'The fieldwork component evidences data collection in the real world, not just exam performance.' } },

  { id:'usabo', name:'USA Biology Olympiad (USABO)', short:'USABO',
    organizer:'Center for Excellence in Education', domain:'cee.org', accent:'#388E3C',
    category:'olympiad', deadline:'2026-01-31', format:'online',
    cost:'$150 per school registration',
    subjects:['Biology','Medicine'],
    eligibility:'US-enrolled students in grades 9–12. Open Exam in February, Semifinal in March, then a national finals camp.',
    link:'https://www.usabo-trc.org/',
    requirements:[
      { id:'ub-reg', type:'cv',  label:'School registration', note:'A teacher must register the school before the deadline' },
      { id:'ub-fee', type:'fee', label:'Registration fee',    note:'Paid by the school; some districts cover it' }
    ],
    portfolioImpact:{ category:'Science/Math',
      resumeLine:'USA Biology Olympiad Semifinalist: top 10% of ~10,000 entrants on the Open Exam.',
      signal:'A percentile you can state precisely — that specificity is what makes a competition line persuasive.' } },

  { id:'amc', name:'AMC 10/12 → AIME → USAMO', short:'AMC',
    organizer:'Mathematical Association of America', domain:'maa.org', accent:'#1565C0',
    category:'olympiad', deadline:'2026-10-16', format:'offline',
    cost:'$3–$5 per student, paid by the school',
    subjects:['Math'],
    eligibility:'Students in grade 12 or below. The AMC is the entry point to the entire US olympiad pipeline, and is sat worldwide.',
    link:'https://maa.org/student-programs/amc/',
    requirements:[
      { id:'am-reg', type:'cv',  label:'School registration', note:'Your school must register as a test centre by the deadline' },
      { id:'am-fee', type:'fee', label:'Sitting fee',         note:'Nominal per-student fee, usually paid by the school' }
    ],
    portfolioImpact:{ category:'Science/Math',
      resumeLine:'AIME qualifier via AMC 12 (score 108); invited to the American Invitational Mathematics Examination.',
      signal:'The most widely understood mathematics benchmark in US admissions — a score needs no explanation.' } },

  { id:'egmo', name:"European Girls' Mathematical Olympiad (EGMO) — national selection", short:'EGMO',
    organizer:'EGMO / national olympiad committee', domain:'egmo.org', accent:'#AD1457',
    category:'olympiad', deadline:'2026-12-10', format:'offline',
    cost:'Free',
    subjects:['Math'],
    eligibility:'Female secondary-school students under 20. Four-student national teams; many non-European countries send guest teams.',
    link:'https://www.egmo.org/',
    requirements:[
      { id:'eg-nom',  type:'transcript',     label:'National round entry', note:'Selection is drawn from national olympiad results' },
      { id:'eg-cons', type:'parent-consent', label:'Parent consent',       note:'For the training camp and travel' }
    ],
    portfolioImpact:{ category:'Science/Math',
      resumeLine:"European Girls' Mathematical Olympiad: national team selection camp; two four-and-a-half-hour proof-based examinations.",
      signal:'A proof-based international result — qualitatively different from multiple-choice contest scores.' } },

  { id:'ijso', name:'International Junior Science Olympiad (IJSO)', short:'IJSO',
    organizer:'IJSO / national science committee', domain:'ijsoweb.org', accent:'#F57C00',
    category:'olympiad', deadline:'2026-10-30', format:'offline',
    cost:'Free',
    subjects:['Physics','Chemistry','Biology'],
    eligibility:'Students aged 15 or under on 31 December of the competition year. Combined physics, chemistry and biology exams.',
    link:'https://www.ijsoweb.org/',
    requirements:[
      { id:'ij-nom',  type:'transcript',     label:'School nomination', note:'Through the national junior science olympiad' },
      { id:'ij-cons', type:'parent-consent', label:'Parent consent',    note:'Required — all participants are minors' }
    ],
    portfolioImpact:{ category:'Science/Math',
      resumeLine:'International Junior Science Olympiad: national team member; integrated physics, chemistry and biology theory and practical exams.',
      signal:'Starting the olympiad track before 16 shows a long runway of sustained interest by the time you apply.' } },

  /* -------------------------------------------------- Essay & writing */
  { id:'john-locke', name:'John Locke Institute Global Essay Prize', short:'Locke',
    organizer:'John Locke Institute', domain:'johnlockeinstitute.com', accent:'#7B1113',
    category:'essay-contest', deadline:'2027-03-31', format:'online',
    cost:'Free to register — late-entry fees apply',
    subjects:['Writing','Economics','Law','Philosophy','Social Science','Business'],
    eligibility:'Students aged 18 or under on 30 June; a Junior category runs for entrants under 15. Open worldwide. Registration closes 31 March, essays are due 30 June.',
    link:'https://www.johnlockeinstitute.com/essay-competition',
    requirements:[
      { id:'jl-reg',     type:'cv',             label:'Registration',           note:'Register by 31 March — you cannot submit without it' },
      { id:'jl-essay',   type:'essay',          label:'Essay, 2,000 words max',  note:'One of seven subject questions; footnotes excluded from the count' },
      { id:'jl-consent', type:'parent-consent', label:'Parent/teacher email',    note:'A supervising adult must confirm your registration' },
      { id:'jl-fee',     type:'fee',            label:'Late entry fee',          note:'Only if submitted after the standard deadline' }
    ],
    portfolioImpact:{ category:'Academic',
      resumeLine:'John Locke Institute Essay Competition — shortlisted, Economics category: 2,000-word argumentative essay judged by Oxford academics.',
      signal:'Proof of written argument at university standard — especially persuasive for UK humanities and social-science applications.' } },

  { id:'concord', name:'The Concord Review', short:'Concord',
    organizer:'The Concord Review', domain:'tcr.org', accent:'#4E342E',
    category:'essay-contest', deadline:'2026-11-01', format:'online',
    cost:'$70 submission fee (includes a subscription)',
    subjects:['Writing','Social Science','Law'],
    eligibility:'Secondary-school students worldwide. The only quarterly journal that publishes academic history papers by school students.',
    link:'https://tcr.org/',
    requirements:[
      { id:'cr-paper', type:'essay',      label:'History research paper', note:'Typically 5,000–8,000 words with full endnotes' },
      { id:'cr-cite',  type:'portfolio',  label:'Bibliography',           note:'Chicago-style endnotes and sources are assessed' },
      { id:'cr-fee',   type:'fee',        label:'Submission fee',         note:'$70; fee assistance available on request' }
    ],
    portfolioImpact:{ category:'Journalism/Publication',
      resumeLine:'Published in The Concord Review: 6,000-word researched history paper accepted by the only journal of its kind for school students.',
      signal:'Actual publication, not participation — roughly 5% of submissions are accepted, and readers in the humanities know it.' } },

  { id:'nyt-editorial', name:'New York Times Student Editorial Contest', short:'NYT',
    organizer:'The New York Times Learning Network', domain:'nytimes.com', accent:'#000000',
    category:'essay-contest', deadline:'2027-03-17', format:'online',
    cost:'Free',
    subjects:['Writing','Social Science','Debate'],
    eligibility:'Students aged 13–19 worldwide. A 450-word evidence-based editorial on any issue you choose.',
    link:'https://www.nytimes.com/section/learning',
    requirements:[
      { id:'ny-essay', type:'essay',          label:'450-word editorial', note:'Hard word limit; must cite at least one NYT and one non-NYT source' },
      { id:'ny-cons',  type:'parent-consent', label:'Parent consent',     note:'Required for entrants under 18' }
    ],
    portfolioImpact:{ category:'Journalism/Publication',
      resumeLine:'New York Times Student Editorial Contest — top 10 winner from ~16,000 entries; editorial published on nytimes.com.',
      signal:'Free to enter and judged blind, so it reads as pure writing merit; publication makes it verifiable in one click.' } },

  { id:'immerse-essay', name:'Immerse Education Essay Competition', short:'Immerse',
    organizer:'Immerse Education', domain:'immerse.education', accent:'#0F4C81',
    category:'essay-contest', deadline:'2026-10-15', format:'online',
    cost:'Free to enter — prize is a scholarship towards an Immerse programme',
    subjects:['Writing','Economics','Medicine','CS','Law','Business'],
    eligibility:'Students aged 13–18 worldwide. Choose one subject question and answer in 500 words.',
    link:'https://www.immerse.education/essay-competition/',
    requirements:[
      { id:'ime-essay', type:'essay',          label:'500-word essay',   note:'One question from your chosen subject stream' },
      { id:'ime-cons',  type:'parent-consent', label:'Parent details',   note:'Required at registration for under-18s' }
    ],
    portfolioImpact:{ category:'Academic',
      resumeLine:'Immerse Education Essay Competition — highly commended: 500-word subject essay judged by Oxford and Cambridge academics.',
      signal:'A low-cost entry point to a judged writing credential; useful early in Grade 10 before bigger competitions are realistic.' } },

  { id:'hir-writing', name:'Harvard International Review Academic Writing Contest', short:'HIR',
    organizer:'Harvard International Review', domain:'hir.harvard.edu', accent:'#A51C30',
    category:'essay-contest', deadline:'2026-11-30', format:'online',
    cost:'$20 entry fee — waivers available',
    subjects:['Writing','Social Science','Economics','Law'],
    eligibility:'Secondary-school students worldwide. International-relations essays in an academic or journalistic format.',
    link:'https://hir.harvard.edu/writing-contest/',
    requirements:[
      { id:'hi-essay', type:'essay',     label:'Essay, 800–1,200 words', note:'Academic commentary on a current international issue' },
      { id:'hi-cite',  type:'portfolio', label:'Source list',            note:'Cited evidence is part of the rubric' },
      { id:'hi-fee',   type:'fee',       label:'Entry fee',              note:'$20; fee waiver form available' }
    ],
    portfolioImpact:{ category:'Journalism/Publication',
      resumeLine:'Harvard International Review Writing Contest — finalist; essay on Central Asian water policy considered for publication.',
      signal:'Subject-specific and internationally framed — strong for IR, politics and public-policy applications.' } },

  /* ---------------------------------------- Competitions & challenges */
  { id:'regeneron-sts', name:'Regeneron Science Talent Search', short:'STS',
    organizer:'Society for Science', domain:'societyforscience.org', accent:'#0072CE',
    category:'competition', deadline:'2026-11-05', format:'hybrid',
    cost:'Free to enter',
    subjects:['Biology','Chemistry','Physics','Math','CS','Engineering'],
    eligibility:'US high-school seniors submitting an original independent research project. $3.1M in awards; top prize $250,000.',
    link:'https://www.societyforscience.org/regeneron-sts/',
    requirements:[
      { id:'rg-paper',   type:'portfolio',      label:'Research report',        note:'Up to 20 pages on original independent work' },
      { id:'rg-essay',   type:'essay',          label:'Written responses',      note:'Short essays on your process, setbacks and next questions' },
      { id:'rg-tr',      type:'transcript',     label:'Transcript & scores',    note:'Full high-school transcript plus standardised test results' },
      { id:'rg-recs',    type:'recs',           label:'Two recommendations',    note:'Research mentor and a school educator' },
      { id:'rg-consent', type:'parent-consent', label:'Ethics & consent forms', note:'Research approval forms; required before human/animal studies' }
    ],
    portfolioImpact:{ category:'Research',
      resumeLine:'Regeneron Science Talent Search scholar: independent research project selected from ~2,000 national entries; full paper submitted.',
      signal:'A national research credential judged by working scientists — it validates the project itself, not just your participation.' } },

  { id:'isef', name:'Regeneron International Science and Engineering Fair (ISEF)', short:'ISEF',
    organizer:'Society for Science', domain:'societyforscience.org', accent:'#00A0DF',
    category:'competition', deadline:'2027-02-01', format:'offline',
    cost:'Free — affiliated fair entry may charge',
    subjects:['Biology','Chemistry','Physics','Engineering','CS','Environment','Math'],
    eligibility:'Students in grades 9–12 worldwide who win a place at an ISEF-affiliated regional or national fair. Kazakhstan has affiliated fairs.',
    link:'https://www.societyforscience.org/isef/',
    requirements:[
      { id:'is-project', type:'portfolio',      label:'Research project & board', note:'Original project with logbook and display board' },
      { id:'is-forms',   type:'parent-consent', label:'ISEF approval forms',      note:'Forms 1–3 signed before experimentation begins' },
      { id:'is-abstract',type:'essay',          label:'Abstract',                 note:'250 words, submitted through the affiliated fair' },
      { id:'is-recs',    type:'recs',           label:'Adult sponsor',            note:'A teacher or mentor must sign as sponsor' }
    ],
    portfolioImpact:{ category:'Research',
      resumeLine:'Regeneron ISEF finalist: qualified through the national fair; presented an original engineering project to international judges.',
      signal:'The largest pre-college science competition in the world — "ISEF finalist" is understood by every admissions office.' } },

  { id:'diamond', name:'Diamond Challenge for High School Entrepreneurs', short:'Diamond',
    organizer:'University of Delaware Horn Entrepreneurship', domain:'udel.edu', accent:'#00539F',
    category:'competition', deadline:'2027-01-14', format:'hybrid',
    cost:'Free to enter',
    subjects:['Entrepreneurship','Business','Economics','CS'],
    eligibility:'Students aged 14–18 worldwide, in teams of two to four. Business Concept and Social Innovation tracks.',
    link:'https://diamondchallenge.org/',
    requirements:[
      { id:'di-pitch',  type:'portfolio',      label:'Written concept & pitch', note:'Concept document plus a recorded pitch video' },
      { id:'di-team',   type:'cv',             label:'Team registration',       note:'Two to four students plus a listed adult advisor' },
      { id:'di-cons',   type:'parent-consent', label:'Parent consent',          note:'Required for all under-18 team members' }
    ],
    portfolioImpact:{ category:'Career Oriented',
      resumeLine:'Diamond Challenge semifinalist: led a four-person team to a written business concept and pitch judged against 1,000+ global entries.',
      signal:'Team leadership plus a shippable artefact — much stronger than "founded a club" with nothing attached.' } },

  { id:'conrad', name:'Conrad Challenge', short:'Conrad',
    organizer:'Conrad Foundation', domain:'conradchallenge.org', accent:'#F9A825',
    category:'competition', deadline:'2026-11-10', format:'online',
    cost:'$499 per team at the Innovation Stage — scholarships available',
    subjects:['Engineering','Environment','CS','Business','Entrepreneurship'],
    eligibility:'Students aged 13–18 worldwide in teams of two to five, working on commercialisable solutions to global problems.',
    link:'https://www.conradchallenge.org/',
    requirements:[
      { id:'cn-brief', type:'portfolio',      label:'Innovation brief',   note:'Problem, solution and market analysis' },
      { id:'cn-team',  type:'cv',             label:'Team & coach',       note:'Two to five students plus a registered coach' },
      { id:'cn-cons',  type:'parent-consent', label:'Parent consent',     note:'For every team member under 18' },
      { id:'cn-fee',   type:'fee',            label:'Stage entry fee',    note:'Charged only if you advance past the first stage' }
    ],
    portfolioImpact:{ category:'Career Oriented',
      resumeLine:'Conrad Challenge Innovation Stage finalist: engineered and costed a commercial solution in the Energy & Environment category.',
      signal:'Forces you to cost and defend a solution, so it evidences commercial reasoning alongside technical work.' } },

  { id:'wharton-invest', name:'Wharton Global High School Investment Competition', short:'Wharton',
    organizer:'University of Pennsylvania — Wharton', domain:'upenn.edu', accent:'#011F5B',
    category:'competition', deadline:'2026-10-05', format:'online',
    cost:'Free',
    subjects:['Business','Economics','Math'],
    eligibility:'Students aged 14–18 worldwide, in teams of four to seven with a teacher advisor. Ten weeks of simulated portfolio management.',
    link:'https://globalyouth.wharton.upenn.edu/investment-competition/',
    requirements:[
      { id:'wh-team',   type:'cv',        label:'Team registration',  note:'Four to seven students plus one teacher advisor' },
      { id:'wh-report', type:'portfolio', label:'Final strategy report', note:'Written investment thesis for a fictional client' },
      { id:'wh-trades', type:'portfolio', label:'Trading record',     note:'Ten weeks of documented trades and rationales' }
    ],
    portfolioImpact:{ category:'Career Oriented',
      resumeLine:'Wharton Global Investment Competition: managed a simulated $100,000 portfolio for ten weeks; authored the team investment thesis.',
      signal:'Documented decisions over ten weeks — evidence of process, which finance-oriented readers value over one-off results.' } },

  { id:'first-robotics', name:'FIRST Robotics Competition', short:'FIRST',
    organizer:'FIRST', domain:'firstinspires.org', accent:'#F57C00',
    category:'competition', deadline:'2026-10-15', format:'offline',
    cost:'$6,000+ per team — grants widely available',
    subjects:['Robotics','Engineering','CS','Business'],
    eligibility:'School or community teams of students aged 14–18. Six weeks to build a competition robot after the January kickoff.',
    link:'https://www.firstinspires.org/robotics/frc',
    requirements:[
      { id:'fr-team', type:'cv',             label:'Team registration',  note:'Register the team and pay the season fee before the deadline' },
      { id:'fr-cons', type:'parent-consent', label:'Consent & safety',   note:'Consent plus shop-safety forms for every student' },
      { id:'fr-fee',  type:'fee',            label:'Season fee',         note:'Rookie grants and sponsorships cover this for many teams' }
    ],
    portfolioImpact:{ category:'Robotics',
      resumeLine:'FIRST Robotics Competition — drivetrain lead: designed and machined the chassis for a 55 kg competition robot in a six-week build.',
      signal:'A named technical role on a real deadline-driven build is far more legible than "member of robotics club".' } },

  { id:'wro', name:'World Robot Olympiad', short:'WRO',
    organizer:'World Robot Olympiad Association', domain:'wro-association.org', accent:'#0288D1',
    category:'competition', deadline:'2027-03-31', format:'offline',
    cost:'National entry fee varies — typically modest',
    subjects:['Robotics','CS','Engineering'],
    eligibility:'Teams of two to three students aged 8–19 with a coach. National finals feed an international final each November.',
    link:'https://wro-association.org/',
    requirements:[
      { id:'wr-team',  type:'cv',             label:'Team & coach registration', note:'Registered through the national organiser' },
      { id:'wr-robot', type:'portfolio',      label:'Robot & engineering log',   note:'Build documentation is judged alongside performance' },
      { id:'wr-cons',  type:'parent-consent', label:'Parent consent',            note:'Required for all team members' }
    ],
    portfolioImpact:{ category:'Robotics',
      resumeLine:'World Robot Olympiad national finalist: built and programmed an autonomous robot for the Future Innovators category.',
      signal:'Runs national rounds in Kazakhstan and Central Asia, so it is reachable without international travel funding.' } },

  { id:'technovation', name:'Technovation Girls', short:'Technovation',
    organizer:'Technovation', domain:'technovation.org', accent:'#E91E63',
    category:'competition', deadline:'2026-04-25', format:'online',
    cost:'Free',
    subjects:['CS','Entrepreneurship','Business','Engineering'],
    eligibility:'Girls aged 8–18 worldwide, in teams of one to five with a mentor. Build a mobile app addressing a community problem.',
    link:'https://www.technovation.org/',
    requirements:[
      { id:'te-app',   type:'portfolio',      label:'Working app & demo video', note:'Functioning prototype plus a pitch video' },
      { id:'te-plan',  type:'essay',          label:'Business plan',            note:'Market, users and sustainability plan' },
      { id:'te-cons',  type:'parent-consent', label:'Parent consent',           note:'Required for every participant' }
    ],
    portfolioImpact:{ category:'Computer/Technology',
      resumeLine:'Technovation Girls: shipped a working Android app for local water-quality reporting; regional semifinalist with a full business plan.',
      signal:'A shipped app plus a business plan covers both technical and commercial ground in one activity.' } },

  { id:'breakthrough-jr', name:'Breakthrough Junior Challenge', short:'Breakthrough',
    organizer:'Breakthrough Prize Foundation', domain:'breakthroughjuniorchallenge.org', accent:'#212121',
    category:'competition', deadline:'2027-06-25', format:'online',
    cost:'Free',
    subjects:['Physics','Math','Biology','Writing'],
    eligibility:'Students aged 13–18 worldwide. A three-minute video explaining a big idea in physics, maths or life sciences. $250,000 scholarship.',
    link:'https://breakthroughjuniorchallenge.org/',
    requirements:[
      { id:'bj-video', type:'portfolio',      label:'Three-minute video', note:'Explains one concept; judged on clarity, not production budget' },
      { id:'bj-cons',  type:'parent-consent', label:'Parent consent',     note:'Required for entrants under 18' }
    ],
    portfolioImpact:{ category:'Science/Math',
      resumeLine:'Breakthrough Junior Challenge entrant: produced a three-minute explainer on quantum tunnelling, judged on scientific clarity.',
      signal:'Science communication is a distinct, demonstrable skill — and the video is a portfolio piece you can link directly.' } },

  { id:'genius-olympiad', name:'GENIUS Olympiad', short:'GENIUS',
    organizer:'Terra Science and Education & SUNY Oswego', domain:'geniusolympiad.org', accent:'#2E7D32',
    category:'competition', deadline:'2026-03-10', format:'hybrid',
    cost:'$60 project fee — finalists pay programme costs',
    subjects:['Environment','Writing','Arts','Business','CS','Engineering'],
    eligibility:'Students aged 13–18 worldwide. Six categories, all framed around environmental problems.',
    link:'https://www.geniusolympiad.org/',
    requirements:[
      { id:'ge-project', type:'portfolio', label:'Project submission', note:'Paper, artwork, business plan or app depending on category' },
      { id:'ge-abstract',type:'essay',     label:'Abstract',           note:'Summarises the environmental problem addressed' },
      { id:'ge-fee',     type:'fee',       label:'Submission fee',     note:'$60 per project' }
    ],
    portfolioImpact:{ category:'Research',
      resumeLine:'GENIUS Olympiad finalist: environmental science project on urban air quality presented at SUNY Oswego.',
      signal:'Open to international students on equal terms, with categories for humanities and art as well as science.' } },

  { id:'wsdc', name:'World Schools Debating Championships — national trials', short:'WSDC',
    organizer:'WSDC / national debate association', domain:'wsdcdebate.org', accent:'#5D4037',
    category:'competition', deadline:'2026-12-01', format:'hybrid',
    cost:'Free to trial — national squads usually fund travel',
    subjects:['Debate','Social Science','Law','Writing'],
    eligibility:'Students under 19 selected onto a national team. Trials are run by each country’s debating association.',
    link:'https://wsdcdebate.org/',
    requirements:[
      { id:'ws-trial', type:'portfolio',      label:'Trial rounds',       note:'Speak in the national selection rounds' },
      { id:'ws-cv',    type:'cv',             label:'Debate record',      note:'Tournament results and speaker points' },
      { id:'ws-cons',  type:'parent-consent', label:'Parent consent',     note:'For the training camp and international travel' }
    ],
    portfolioImpact:{ category:'Debate/Speech',
      resumeLine:'National debate squad — WSDC trials: argued British Parliamentary and World Schools formats at the national selection rounds.',
      signal:'Debate at national-selection level evidences argument under pressure, which interviews at Oxbridge test directly.' } },

  { id:'hmun', name:'Harvard Model United Nations', short:'HMUN',
    organizer:'Harvard International Relations Council', domain:'harvardmun.org', accent:'#A51C30',
    category:'competition', deadline:'2026-10-31', format:'offline',
    cost:'$115 delegate fee plus travel — scholarships available',
    subjects:['Social Science','Law','Debate','Economics'],
    eligibility:'Secondary-school delegations worldwide. Four days of committee simulation in Boston each January.',
    link:'https://www.harvardmun.org/',
    requirements:[
      { id:'hm-reg',   type:'cv',             label:'Delegation registration', note:'Schools register a delegation and are assigned countries' },
      { id:'hm-paper', type:'essay',          label:'Position paper',          note:'Required for award eligibility in most committees' },
      { id:'hm-cons',  type:'parent-consent', label:'Travel consent',          note:'Parent and school consent for international travel' },
      { id:'hm-fee',   type:'fee',            label:'Delegate fee',            note:'$115 per delegate, plus travel and accommodation' }
    ],
    portfolioImpact:{ category:'Debate/Speech',
      resumeLine:'Harvard Model United Nations: Best Delegate in the Historical Security Council; authored the committee position paper.',
      signal:'MUN is common, so the award matters more than attendance — name the committee and the recognition explicitly.' } },

  { id:'blue-ocean', name:'Blue Ocean Student Entrepreneur Competition', short:'Blue Ocean',
    organizer:'Blue Ocean Competition', domain:'blueoceancompetition.org', accent:'#0277BD',
    category:'competition', deadline:'2027-02-15', format:'online',
    cost:'Free',
    subjects:['Entrepreneurship','Business','Economics'],
    eligibility:'Students aged 13–18 worldwide, individually or in teams. Fully online — a pitch video is the only submission.',
    link:'https://www.blueoceancompetition.org/',
    requirements:[
      { id:'bl-video', type:'portfolio',      label:'Pitch video',      note:'Under five minutes, applying blue-ocean strategy' },
      { id:'bl-plan',  type:'essay',          label:'Written summary',  note:'Value curve and target non-customers' },
      { id:'bl-cons',  type:'parent-consent', label:'Parent consent',   note:'Required for entrants under 18' }
    ],
    portfolioImpact:{ category:'Career Oriented',
      resumeLine:'Blue Ocean Student Entrepreneur Competition — top 100 globally: pitched a venture concept judged on strategic differentiation.',
      signal:'Free and fully online, so it is one of the most accessible business credentials from outside the US.' } },

  { id:'scholastic', name:'Scholastic Art & Writing Awards', short:'Scholastic',
    organizer:'Alliance for Young Artists & Writers', domain:'artandwriting.org', accent:'#C62828',
    category:'competition', deadline:'2026-01-08', format:'online',
    cost:'$10 per entry — fee waivers available',
    subjects:['Writing','Arts'],
    eligibility:'Students in grades 7–12 in the US, Canada or American schools abroad. 28 categories across art and writing.',
    link:'https://www.artandwriting.org/',
    requirements:[
      { id:'sc-work', type:'portfolio',      label:'Submitted work',   note:'Original art or writing in one of 28 categories' },
      { id:'sc-cons', type:'parent-consent', label:'Educator sign-off', note:'A teacher must confirm the work is original' },
      { id:'sc-fee',  type:'fee',            label:'Entry fee',        note:'$10 per work; waivers for students in need' }
    ],
    portfolioImpact:{ category:'Art',
      resumeLine:'Scholastic Art & Writing Awards — Gold Key, Personal Essay & Memoir: regional top award from ~340,000 national submissions.',
      signal:'The oldest US recognition programme for teenage artists and writers; a Gold Key is a well-calibrated signal in arts admissions.' } }
];

/* ==========================================================================
   Official marks
   --------------------------------------------------------------------------
   Same source and rules as UNI_LOGOS in universities-data.js: the organiser's
   own mark from its Wikidata item, on Wikimedia Commons, served through
   Special:FilePath.

   Most organisers here are competitions rather than institutions, and their
   logos are not freely licensed — the international olympiads (IPhO, IChO,
   EGMO, IJSO) all have Wikidata items but no free logo on file. Those keep the
   favicon route, and where a site only publishes a 16px favicon the logo
   loader in app.js rejects it as too small and paints the initials tile
   instead, which stays crisp at any size.
   ========================================================================== */
const PROGRAM_LOGOS = {
  'm-and-t': "https://commons.wikimedia.org/wiki/Special:FilePath/Shield_of_the_University_of_Pennsylvania.svg?width=256"
};

PROGRAMS.forEach(p => { if (PROGRAM_LOGOS[p.id]) p.logoUrl = PROGRAM_LOGOS[p.id]; });
