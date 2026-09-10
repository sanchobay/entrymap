/* ==========================================================================
   EntryMap — university dataset
   Loaded as a plain script before app.js (no modules, no bundler).

   rank      — QS World University Rankings 2026 (official table, June 2025).
               null where the institution does not appear in the QS top 500.
   accept    — most recently published overall admission rate.
   tuition   — published international/overseas tuition for one academic year,
               2025/26 cycle, in the institution's own currency.
   gpa/ielts/sat — indicative competitive minimums used by the eligibility
               engine, not official cut-offs (most of these schools publish
               ranges rather than floors).
   logoUrl   — the institution's official mark on Wikimedia Commons, taken from
               its Wikidata logo/seal/coat-of-arms claim and kept only where the
               image is square-ish: wordmarks (Stanford, Princeton, CMU at 11:1)
               are unreadable in a 34px square slot, so those fall through to the
               favicon source instead, which is square by construction.
   domain    — used by logo() for the favicon sources; accent + short drive the
               generated fallback tile when every request fails.
   logo      — optional id of an inline sprite symbol (legacy hand-drawn marks).
   ========================================================================== */
const UNIS = [
  /* ---------------------------------------------------------- Americas */
  { id:'mit', logo:'u-mit', short:'MIT', name:'Massachusetts Institute of Technology',
    country:'United States', city:'Cambridge, MA', region:'americas', domain:'mit.edu', accent:'#A31F34',
    rank:1, accept:'4.5%', tuition:'$62,396', gpa:3.90, ielts:7.0, sat:1520,
    programs:['Computer Science','Electrical Engineering','Mathematics','Aerospace Engineering','Physics'] },

  { id:'stanford', logo:'u-stanford', short:'Stanford', name:'Stanford University',
    country:'United States', city:'Stanford, CA', region:'americas', domain:'stanford.edu', accent:'#8C1515',
    rank:3, accept:'3.9%', tuition:'$65,127', gpa:3.85, ielts:7.0, sat:1500,
    programs:['Computer Science','Electrical Engineering','Management Science','Biology','Symbolic Systems'] },

  { id:'harvard', logo:'u-harvard', short:'Harvard', name:'Harvard University',
    country:'United States', city:'Cambridge, MA', region:'americas', domain:'harvard.edu', accent:'#A51C30',
    rank:5, accept:'3.6%', tuition:'$59,320', gpa:3.92, ielts:7.5, sat:1540,
    programs:['Economics','Government','Computer Science','Applied Mathematics','Molecular Biology'] },

  { id:'caltech', short:'Caltech', name:'California Institute of Technology',
    country:'United States', city:'Pasadena, CA', region:'americas', domain:'caltech.edu', accent:'#FF6C0C',
    rank:10, accept:'3.1%', tuition:'$63,255', gpa:3.95, ielts:7.0, sat:1550,
    programs:['Physics','Computer Science','Chemical Engineering','Astrophysics','Mathematics'] },

  { id:'uchicago', short:'UChicago', name:'University of Chicago',
    country:'United States', city:'Chicago, IL', region:'americas', domain:'uchicago.edu', accent:'#800000',
    rank:13, accept:'4.8%', tuition:'$68,244', gpa:3.90, ielts:7.0, sat:1530,
    programs:['Economics','Mathematics','Computer Science','Political Science','Statistics'] },

  { id:'upenn', short:'UPenn', name:'University of Pennsylvania',
    country:'United States', city:'Philadelphia, PA', region:'americas', domain:'upenn.edu', accent:'#011F5B',
    logoUrl:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Shield_of_the_University_of_Pennsylvania.svg/330px-Shield_of_the_University_of_Pennsylvania.svg.png',
    rank:15, accept:'5.4%', tuition:'$66,104', gpa:3.88, ielts:7.5, sat:1520,
    programs:['Finance (Wharton)','Computer Science','Bioengineering','Nursing','International Relations'] },

  { id:'cornell', short:'Cornell', name:'Cornell University',
    country:'United States', city:'Ithaca, NY', region:'americas', domain:'cornell.edu', accent:'#B31B1B',
    rank:16, accept:'7.3%', tuition:'$69,844', gpa:3.80, ielts:7.0, sat:1500,
    programs:['Computer Science','Hotel Administration','Engineering Physics','Agriculture','Architecture'] },

  { id:'berkeley', short:'UC Berkeley', name:'University of California, Berkeley',
    country:'United States', city:'Berkeley, CA', region:'americas', domain:'berkeley.edu', accent:'#003262',
    rank:17, accept:'11.4%', tuition:'$51,014', gpa:3.85, ielts:6.5, sat:1480,
    programs:['Electrical Engineering & CS','Business Administration','Data Science','Molecular Biology','Economics'] },

  { id:'yale', short:'Yale', name:'Yale University',
    country:'United States', city:'New Haven, CT', region:'americas', domain:'yale.edu', accent:'#00356B',
    logoUrl:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Yale_University_Shield_1.svg/330px-Yale_University_Shield_1.svg.png',
    rank:21, accept:'4.6%', tuition:'$67,250', gpa:3.92, ielts:7.5, sat:1540,
    programs:['Economics','Political Science','Computer Science','History','Molecular Biophysics'] },

  { id:'princeton', short:'Princeton', name:'Princeton University',
    country:'United States', city:'Princeton, NJ', region:'americas', domain:'princeton.edu', accent:'#E77500',
    rank:25, accept:'4.5%', tuition:'$62,400', gpa:3.92, ielts:7.5, sat:1540,
    programs:['Computer Science','Public & International Affairs','Physics','Operations Research','Economics'] },

  { id:'columbia', short:'Columbia', name:'Columbia University',
    country:'United States', city:'New York, NY', region:'americas', domain:'columbia.edu', accent:'#005AA5',
    logoUrl:'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/33/Coat_of_Arms_of_Columbia_University.svg/330px-Coat_of_Arms_of_Columbia_University.svg.png',
    rank:38, accept:'3.9%', tuition:'$71,170', gpa:3.90, ielts:7.5, sat:1530,
    programs:['Computer Science','Economics','Financial Engineering','Political Science','Journalism'] },

  { id:'cmu', short:'CMU', name:'Carnegie Mellon University',
    country:'United States', city:'Pittsburgh, PA', region:'americas', domain:'cmu.edu', accent:'#C41230',
    rank:52, accept:'11.0%', tuition:'$66,224', gpa:3.82, ielts:7.5, sat:1510,
    programs:['Computer Science','Robotics','Information Systems','Drama','Statistics & Machine Learning'] },

  { id:'nyu', short:'NYU', name:'New York University',
    country:'United States', city:'New York, NY', region:'americas', domain:'nyu.edu', accent:'#57068C',
    rank:55, accept:'8.0%', tuition:'$64,556', gpa:3.70, ielts:7.0, sat:1480,
    programs:['Computer Science','Business (Stern)','Film & TV','Economics','Data Science'] },

  { id:'gatech', short:'Georgia Tech', name:'Georgia Institute of Technology',
    country:'United States', city:'Atlanta, GA', region:'americas', domain:'gatech.edu', accent:'#B3A369',
    logoUrl:'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6c/Georgia_Tech_seal.svg/330px-Georgia_Tech_seal.svg.png',
    rank:123, accept:'12.8%', tuition:'$34,730', gpa:3.75, ielts:7.0, sat:1470,
    programs:['Computer Science','Mechanical Engineering','Industrial Engineering','Aerospace Engineering','Cybersecurity'] },

  { id:'mcgill', short:'McGill', name:'McGill University',
    country:'Canada', city:'Montréal, QC', region:'americas', domain:'mcgill.ca', accent:'#ED1B2F',
    rank:27, accept:'39.0%', tuition:'CA$59,900', gpa:3.50, ielts:6.5, sat:1400,
    programs:['Computer Science','Medicine','Economics','Chemical Engineering','Cognitive Science'] },

  { id:'toronto', logo:'u-toronto', short:'U of T', name:'University of Toronto',
    country:'Canada', city:'Toronto, ON', region:'americas', domain:'utoronto.ca', accent:'#25355A',
    rank:29, accept:'43.0%', tuition:'CA$64,870', gpa:3.40, ielts:6.5, sat:1330,
    programs:['Computer Science','Rotman Commerce','Life Sciences','Engineering Science','Statistics'] },

  { id:'ubc', short:'UBC', name:'University of British Columbia',
    country:'Canada', city:'Vancouver, BC', region:'americas', domain:'ubc.ca', accent:'#002145',
    rank:40, accept:'52.4%', tuition:'CA$47,000', gpa:3.30, ielts:6.5, sat:1300,
    programs:['Computer Science','Sauder Commerce','Environmental Science','Engineering','Psychology'] },

  { id:'waterloo', short:'Waterloo', name:'University of Waterloo',
    country:'Canada', city:'Waterloo, ON', region:'americas', domain:'uwaterloo.ca', accent:'#FDD54F',
    rank:119, accept:'53.0%', tuition:'CA$68,600', gpa:3.60, ielts:6.5, sat:1420,
    programs:['Computer Science (co-op)','Software Engineering','Mathematics','Nanotechnology','Actuarial Science'] },

  /* ------------------------------------------------------------ Europe */
  { id:'imperial', short:'Imperial', name:'Imperial College London',
    country:'United Kingdom', city:'London, England', region:'europe', domain:'imperial.ac.uk', accent:'#003E74',
    rank:2, accept:'11.0%', tuition:'£41,300', gpa:3.85, ielts:7.0, sat:1500,
    programs:['Computing','Aeronautical Engineering','Medicine','Mathematics','Physics'] },

  { id:'oxford', logo:'u-oxford', short:'Oxford', name:'University of Oxford',
    country:'United Kingdom', city:'Oxford, England', region:'europe', domain:'ox.ac.uk', accent:'#002147',
    rank:4, accept:'16.0%', tuition:'£39,010', gpa:3.88, ielts:7.5, sat:1490,
    programs:['Economics & Management','PPE','Computer Science','Law','Engineering Science'] },

  { id:'cambridge', short:'Cambridge', name:'University of Cambridge',
    country:'United Kingdom', city:'Cambridge, England', region:'europe', domain:'cam.ac.uk', accent:'#A3C1AD',
    rank:6, accept:'17.5%', tuition:'£39,162', gpa:3.88, ielts:7.5, sat:1490,
    programs:['Mathematics','Natural Sciences','Computer Science','Economics','Engineering'] },

  { id:'ucl', short:'UCL', name:'University College London',
    country:'United Kingdom', city:'London, England', region:'europe', domain:'ucl.ac.uk', accent:'#500778',
    logoUrl:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/UCL_Crest.svg/330px-UCL_Crest.svg.png',
    rank:9, accept:'32.0%', tuition:'£34,400', gpa:3.60, ielts:6.5, sat:1400,
    programs:['Computer Science','Economics','Architecture','Neuroscience','Law'] },

  { id:'kcl', short:'KCL', name:"King's College London",
    country:'United Kingdom', city:'London, England', region:'europe', domain:'kcl.ac.uk', accent:'#003D7D',
    logoUrl:'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/Kcl-logo.svg/330px-Kcl-logo.svg.png',
    rank:31, accept:'35.0%', tuition:'£34,650', gpa:3.50, ielts:6.5, sat:1370,
    programs:['Medicine','International Relations','Computer Science','Law','Neuroscience'] },

  { id:'edinburgh', short:'Edinburgh', name:'University of Edinburgh',
    country:'United Kingdom', city:'Edinburgh, Scotland', region:'europe', domain:'ed.ac.uk', accent:'#D50032',
    rank:34, accept:'40.0%', tuition:'£29,900', gpa:3.40, ielts:6.5, sat:1340,
    programs:['Artificial Intelligence','Medicine','Informatics','Business','Veterinary Medicine'] },

  { id:'lse', short:'LSE', name:'London School of Economics and Political Science',
    country:'United Kingdom', city:'London, England', region:'europe', domain:'lse.ac.uk', accent:'#E1261C',
    rank:56, accept:'8.9%', tuition:'£28,176', gpa:3.80, ielts:7.0, sat:1490,
    programs:['Economics','Politics & Economics','Finance','International Relations','Data Science'] },

  { id:'warwick', short:'Warwick', name:'University of Warwick',
    country:'United Kingdom', city:'Coventry, England', region:'europe', domain:'warwick.ac.uk', accent:'#5B3393',
    logoUrl:'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Shield_of_the_University_of_Warwick.svg/330px-Shield_of_the_University_of_Warwick.svg.png',
    rank:74, accept:'42.0%', tuition:'£31,620', gpa:3.40, ielts:6.5, sat:1350,
    programs:['Mathematics','Economics','Computer Science','Business (WBS)','Engineering'] },

  { id:'ethz', short:'ETH Zurich', name:'ETH Zurich — Swiss Federal Institute of Technology',
    country:'Switzerland', city:'Zurich', region:'europe', domain:'ethz.ch', accent:'#1F407A',
    rank:7, accept:'27.0%', tuition:'CHF 1,660', gpa:3.70, ielts:7.0, sat:1450,
    programs:['Computer Science','Mechanical Engineering','Physics','Environmental Science','Architecture'] },

  { id:'epfl', short:'EPFL', name:'École Polytechnique Fédérale de Lausanne',
    country:'Switzerland', city:'Lausanne', region:'europe', domain:'epfl.ch', accent:'#FF0000',
    rank:22, accept:'30.0%', tuition:'CHF 1,580', gpa:3.60, ielts:6.5, sat:1420,
    programs:['Computer Science','Microengineering','Life Sciences','Robotics','Communication Systems'] },

  { id:'tum', short:'TUM', name:'Technical University of Munich',
    country:'Germany', city:'Munich', region:'europe', domain:'tum.de', accent:'#3070B3',
    rank:22, accept:'45.0%', tuition:'€6,000', gpa:3.40, ielts:6.5, sat:1350,
    programs:['Informatics','Mechanical Engineering','Management & Technology','Physics','Data Engineering'] },

  { id:'lmu', short:'LMU Munich', name:'Ludwig Maximilian University of Munich',
    country:'Germany', city:'Munich', region:'europe', domain:'lmu.de', accent:'#009440',
    rank:58, accept:'48.0%', tuition:'€258 (semester fee)', gpa:3.30, ielts:6.5, sat:1300,
    programs:['Medicine','Physics','Economics','Psychology','Law'] },

  { id:'heidelberg', short:'Heidelberg', name:'Heidelberg University',
    country:'Germany', city:'Heidelberg', region:'europe', domain:'uni-heidelberg.de', accent:'#C31D2C',
    logoUrl:'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4f/Logo_University_of_Heidelberg.svg/330px-Logo_University_of_Heidelberg.svg.png',
    rank:80, accept:'52.0%', tuition:'€3,000', gpa:3.25, ielts:6.5, sat:1290,
    programs:['Molecular Biotechnology','Medicine','Physics','Political Science','Mathematics'] },

  { id:'tudelft', logo:'u-tudelft', short:'TU Delft', name:'Delft University of Technology',
    country:'Netherlands', city:'Delft', region:'europe', domain:'tudelft.nl', accent:'#00A6D6',
    rank:47, accept:'65.0%', tuition:'€21,730', gpa:3.20, ielts:6.5, sat:1280,
    programs:['Aerospace Engineering','Architecture','Applied Physics','Industrial Design','Computer Science'] },

  { id:'uva', short:'UvA', name:'University of Amsterdam',
    country:'Netherlands', city:'Amsterdam', region:'europe', domain:'uva.nl', accent:'#BC0031',
    rank:53, accept:'65.0%', tuition:'€15,000', gpa:3.20, ielts:6.5, sat:1270,
    programs:['Politics, Psychology, Law & Economics','Artificial Intelligence','Economics & Business','Communication Science','Data Science'] },

  { id:'kuleuven', short:'KU Leuven', name:'KU Leuven',
    country:'Belgium', city:'Leuven', region:'europe', domain:'kuleuven.be', accent:'#1D8DB0',
    rank:60, accept:'60.0%', tuition:'€6,600', gpa:3.20, ielts:6.5, sat:1270,
    programs:['Engineering Science','Business Engineering','Biomedical Sciences','Philosophy','Informatics'] },

  { id:'psl', short:'PSL', name:'Université PSL (Paris Sciences & Lettres)',
    country:'France', city:'Paris', region:'europe', domain:'psl.eu', accent:'#00205B',
    rank:28, accept:'22.0%', tuition:'€3,770', gpa:3.55, ielts:6.5, sat:1400,
    programs:['Mathematics','Physics','Economics','Computer Science','Humanities'] },

  { id:'ipparis', short:'IP Paris', name:'Institut Polytechnique de Paris',
    country:'France', city:'Palaiseau', region:'europe', domain:'ip-paris.fr', accent:'#C8102E',
    logoUrl:'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Institut_polytechnique_de_Paris_logo.svg/330px-Institut_polytechnique_de_Paris_logo.svg.png',
    rank:41, accept:'25.0%', tuition:'€12,000', gpa:3.50, ielts:6.5, sat:1400,
    programs:['Mathematics & Computer Science','Physics','Economics','Data Science','Engineering'] },

  { id:'kth', short:'KTH', name:'KTH Royal Institute of Technology',
    country:'Sweden', city:'Stockholm', region:'europe', domain:'kth.se', accent:'#1954A6',
    rank:78, accept:'55.0%', tuition:'SEK 310,000', gpa:3.20, ielts:6.5, sat:1280,
    programs:['Computer Science','Industrial Engineering','Electrical Engineering','Architecture','Energy Systems'] },

  { id:'msu', short:'MSU', name:'Lomonosov Moscow State University',
    country:'Russia', city:'Moscow', region:'europe', domain:'msu.ru', accent:'#003399',
    rank:105, accept:'20.0%', tuition:'₽450,000', gpa:3.30, ielts:6.0, sat:1250,
    programs:['Mathematics & Mechanics','Computational Mathematics','Physics','Economics','International Relations'] },

  /* -------------------------------------------------------------- Asia */
  { id:'nus', logo:'u-nus', short:'NUS', name:'National University of Singapore',
    country:'Singapore', city:'Queenstown, SG', region:'asia', domain:'nus.edu.sg', accent:'#EF7C00',
    rank:8, accept:'5.0%', tuition:'S$40,250', gpa:3.60, ielts:6.5, sat:1420,
    programs:['Computer Science','Business Analytics','Civil Engineering','Pharmacy','Data Science & Economics'] },

  { id:'hku', logo:'u-hku', short:'HKU', name:'The University of Hong Kong',
    country:'Hong Kong', city:'Pokfulam, HK', region:'asia', domain:'hku.hk', accent:'#046A38',
    rank:11, accept:'25.0%', tuition:'HK$198,000', gpa:3.50, ielts:6.5, sat:1380,
    programs:['Data Science','Business Administration','Medicine','Architecture','Computer Science'] },

  { id:'ntu-sg', short:'NTU Singapore', name:'Nanyang Technological University',
    country:'Singapore', city:'Jurong West, SG', region:'asia', domain:'ntu.edu.sg', accent:'#00205B',
    rank:12, accept:'19.0%', tuition:'S$38,700', gpa:3.55, ielts:6.5, sat:1400,
    programs:['Computer Science','Electrical Engineering','Business','Materials Science','Mathematics'] },

  { id:'peking', short:'PKU', name:'Peking University',
    country:'China', city:'Beijing', region:'asia', domain:'pku.edu.cn', accent:'#94070A',
    logoUrl:'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f4/Peking_University_seal.svg/330px-Peking_University_seal.svg.png',
    rank:14, accept:'6.0%', tuition:'CN¥30,000', gpa:3.70, ielts:6.5, sat:1450,
    programs:['Economics','Computer Science','Guanghua Management','Physics','International Relations'] },

  { id:'tsinghua', short:'Tsinghua', name:'Tsinghua University',
    country:'China', city:'Beijing', region:'asia', domain:'tsinghua.edu.cn', accent:'#660874',
    logoUrl:'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ec/Tsinghua_University_Logo.svg/330px-Tsinghua_University_Logo.svg.png',
    rank:17, accept:'6.5%', tuition:'CN¥40,000', gpa:3.70, ielts:6.5, sat:1450,
    programs:['Computer Science','Economics & Management','Architecture','Automation','Mathematics & Physics'] },

  { id:'cuhk', short:'CUHK', name:'The Chinese University of Hong Kong',
    country:'Hong Kong', city:'Sha Tin, HK', region:'asia', domain:'cuhk.edu.hk', accent:'#7A1F3D',
    rank:32, accept:'30.0%', tuition:'HK$165,000', gpa:3.40, ielts:6.5, sat:1350,
    programs:['Computer Science','Business Administration','Medicine','Economics','Artificial Intelligence'] },

  { id:'tokyo', short:'UTokyo', name:'The University of Tokyo',
    country:'Japan', city:'Tokyo', region:'asia', domain:'u-tokyo.ac.jp', accent:'#004098',
    rank:36, accept:'34.0%', tuition:'¥535,800', gpa:3.60, ielts:6.5, sat:1420,
    programs:['PEAK Environmental Sciences','Engineering','Economics','Physics','International Programme on Japan'] },

  { id:'snu', short:'SNU', name:'Seoul National University',
    country:'South Korea', city:'Seoul', region:'asia', domain:'snu.ac.kr', accent:'#00468B',
    rank:38, accept:'15.0%', tuition:'₩6,000,000', gpa:3.55, ielts:6.5, sat:1400,
    programs:['Computer Science & Engineering','Business Administration','Economics','Materials Science','Biological Sciences'] },

  { id:'hkust', short:'HKUST', name:'The Hong Kong University of Science and Technology',
    country:'Hong Kong', city:'Clear Water Bay, HK', region:'asia', domain:'hkust.edu.hk', accent:'#003366',
    rank:44, accept:'28.0%', tuition:'HK$180,000', gpa:3.45, ielts:6.5, sat:1370,
    programs:['Computer Science','Quantitative Finance','Data Science','Mechanical Engineering','Business'] },

  { id:'kyoto', short:'Kyoto', name:'Kyoto University',
    country:'Japan', city:'Kyoto', region:'asia', domain:'kyoto-u.ac.jp', accent:'#1F3E6E',
    logoUrl:'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Kyoto_University_emblem.svg/330px-Kyoto_University_emblem.svg.png',
    rank:57, accept:'35.0%', tuition:'¥535,800', gpa:3.50, ielts:6.5, sat:1390,
    programs:['Civil Engineering (iUP)','Science','Economics','Medicine','Informatics'] },

  { id:'kaznu', short:'KazNU', name:'Al-Farabi Kazakh National University',
    country:'Kazakhstan', city:'Almaty', region:'asia', domain:'kaznu.kz', accent:'#0057B8',
    rank:166, accept:'55.0%', tuition:'₸2,100,000', gpa:3.00, ielts:5.5, sat:1150,
    programs:['Information Systems','International Relations','Physics','Economics','Biotechnology'] },

  { id:'nazarbayev', short:'NU', name:'Nazarbayev University',
    country:'Kazakhstan', city:'Astana', region:'asia', domain:'nu.edu.kz', accent:'#0B4DA2',
    rank:null, accept:'30.0%', tuition:'Full scholarship (most students)', gpa:3.30, ielts:6.5, sat:1300,
    programs:['Computer Science','Chemical Engineering','Economics','Biological Sciences','Political Science'] },

  { id:'enu', short:'ENU', name:'L.N. Gumilyov Eurasian National University',
    country:'Kazakhstan', city:'Astana', region:'asia', domain:'enu.kz', accent:'#1B5E9C',
    rank:317, accept:'60.0%', tuition:'₸1,600,000', gpa:2.90, ielts:5.5, sat:1100,
    programs:['Information Technology','International Relations','Journalism','Mathematics','Law'] },

  /* -------------------------------------------------------- MENA & Türkiye */
  { id:'nyuad', logo:'u-nyuad', short:'NYU Abu Dhabi', name:'NYU Abu Dhabi',
    country:'United Arab Emirates', city:'Abu Dhabi, UAE', region:'mena', domain:'nyuad.nyu.edu', accent:'#57068C',
    rank:55, accept:'3.9%', tuition:'$62,000 (need-blind aid)', gpa:3.70, ielts:7.0, sat:1450,
    programs:['Computer Science','Economics','Engineering','Political Science','Interactive Media'] },

  { id:'kfupm', short:'KFUPM', name:'King Fahd University of Petroleum & Minerals',
    country:'Saudi Arabia', city:'Dhahran', region:'mena', domain:'kfupm.edu.sa', accent:'#00693E',
    logoUrl:'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/KFUPM_seal.png/330px-KFUPM_seal.png',
    rank:67, accept:'25.0%', tuition:'Full scholarship (international)', gpa:3.40, ielts:6.0, sat:1330,
    programs:['Petroleum Engineering','Computer Science','Chemical Engineering','Geosciences','Finance'] },

  { id:'qatar-u', short:'Qatar U', name:'Qatar University',
    country:'Qatar', city:'Doha', region:'mena', domain:'qu.edu.qa', accent:'#8A1538',
    rank:112, accept:'45.0%', tuition:'QR 27,000', gpa:3.00, ielts:6.0, sat:1200,
    programs:['Engineering','Business & Economics','Computer Science','Medicine','Law'] },

  { id:'khalifa', short:'Khalifa', name:'Khalifa University of Science and Technology',
    country:'United Arab Emirates', city:'Abu Dhabi, UAE', region:'mena', domain:'ku.ac.ae', accent:'#00447C',
    rank:177, accept:'35.0%', tuition:'Full scholarship (merit)', gpa:3.30, ielts:6.5, sat:1300,
    programs:['Computer Engineering','Aerospace Engineering','Petroleum Engineering','Artificial Intelligence','Biomedical Engineering'] },

  { id:'metu', short:'METU', name:'Middle East Technical University',
    country:'Türkiye', city:'Ankara', region:'mena', domain:'metu.edu.tr', accent:'#9E1B32',
    logoUrl:'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/Logo_ODT%C3%9C.svg/330px-Logo_ODT%C3%9C.svg.png',
    rank:269, accept:'40.0%', tuition:'$4,500', gpa:3.10, ielts:6.0, sat:1220,
    programs:['Computer Engineering','Electrical & Electronics Engineering','Economics','Physics','Industrial Design'] },

  { id:'koc', short:'Koç', name:'Koç University',
    country:'Türkiye', city:'Istanbul', region:'mena', domain:'ku.edu.tr', accent:'#00205B',
    rank:323, accept:'35.0%', tuition:'$28,000 (scholarships common)', gpa:3.20, ielts:6.5, sat:1280,
    programs:['Computer Engineering','Business Administration','Economics','Molecular Biology','International Relations'] },

  { id:'bogazici', short:'Boğaziçi', name:'Boğaziçi University',
    country:'Türkiye', city:'Istanbul', region:'mena', domain:'bogazici.edu.tr', accent:'#004B87',
    rank:371, accept:'30.0%', tuition:'$3,600', gpa:3.15, ielts:6.5, sat:1260,
    programs:['Computer Engineering','Economics','Industrial Engineering','Political Science','Mathematics'] },

  /* ----------------------------------------------------------- Oceania */
  { id:'melbourne', short:'Melbourne', name:'The University of Melbourne',
    country:'Australia', city:'Melbourne, VIC', region:'oceania', domain:'unimelb.edu.au', accent:'#000F46',
    logoUrl:'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c2/Arms_of_the_University_of_Melbourne.svg/330px-Arms_of_the_University_of_Melbourne.svg.png',
    rank:19, accept:'70.0%', tuition:'A$54,000', gpa:3.20, ielts:6.5, sat:1280,
    programs:['Science','Commerce','Biomedicine','Design','Computing & Software Systems'] },

  { id:'unsw', short:'UNSW', name:'The University of New South Wales',
    country:'Australia', city:'Sydney, NSW', region:'oceania', domain:'unsw.edu.au', accent:'#FFC629',
    rank:20, accept:'68.0%', tuition:'A$56,000', gpa:3.15, ielts:6.5, sat:1270,
    programs:['Computer Science','Actuarial Studies','Civil Engineering','Medicine','Commerce'] },

  { id:'sydney', short:'Sydney', name:'The University of Sydney',
    country:'Australia', city:'Sydney, NSW', region:'oceania', domain:'sydney.edu.au', accent:'#E64626',
    rank:25, accept:'70.0%', tuition:'A$55,500', gpa:3.15, ielts:6.5, sat:1270,
    programs:['Advanced Computing','Commerce','Engineering Honours','Health Sciences','Architecture'] },

  { id:'anu', short:'ANU', name:'Australian National University',
    country:'Australia', city:'Canberra, ACT', region:'oceania', domain:'anu.edu.au', accent:'#BE830E',
    logoUrl:'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Arms_of_the_Australian_National_University.svg/330px-Arms_of_the_Australian_National_University.svg.png',
    rank:32, accept:'35.0%', tuition:'A$51,000', gpa:3.20, ielts:6.5, sat:1290,
    programs:['International Relations','Computer Science','Actuarial Studies','Politics & Economics','Astrophysics'] },

  { id:'auckland', short:'Auckland', name:'The University of Auckland',
    country:'New Zealand', city:'Auckland', region:'oceania', domain:'auckland.ac.nz', accent:'#00467F',
    rank:65, accept:'45.0%', tuition:'NZ$44,000', gpa:3.00, ielts:6.0, sat:1200,
    programs:['Engineering Honours','Computer Science','Commerce','Biomedical Science','Architecture'] }
];

/* ==========================================================================
   Official marks
   --------------------------------------------------------------------------
   Each entry is the institution's own logo, seal or coat of arms as claimed on
   its Wikidata item (P154 logo / P158 seal / P94 coat of arms) and hosted on
   Wikimedia Commons. Served through Special:FilePath, which redirects to the
   right thumbnail, so the URL stays valid when Commons re-hashes its storage.

   Only square-ish marks are listed. A wordmark — Carnegie Mellon's is 11:1 —
   would render as an illegible sliver in a 34px slot, so those institutions
   deliberately fall through to the favicon source, which is square by
   construction. Institutions whose marks are not freely licensed (NUS, HKU,
   Tsinghua, NYU Abu Dhabi and others) are absent for the same reason and also
   use the favicon route.

   Applied as a patch rather than inline fields so the dataset above stays
   readable and one source of truth governs where these images come from.
   ========================================================================== */
const UNI_LOGOS = {
  stanford:   "https://commons.wikimedia.org/wiki/Special:FilePath/Seal_of_Leland_Stanford_Junior_University.svg?width=256",
  harvard:    "https://commons.wikimedia.org/wiki/Special:FilePath/Harvard_University_coat_of_arms.svg?width=256",
  upenn:      "https://commons.wikimedia.org/wiki/Special:FilePath/Shield_of_the_University_of_Pennsylvania.svg?width=256",
  cornell:    "https://commons.wikimedia.org/wiki/Special:FilePath/Cornell_University_No_White_Background_Logo.svg?width=256",
  berkeley:   "https://commons.wikimedia.org/wiki/Special:FilePath/Seal_of_University_of_California%2C_Berkeley.svg?width=256",
  yale:       "https://commons.wikimedia.org/wiki/Special:FilePath/Yale_University_Shield_1.svg?width=256",
  princeton:  "https://commons.wikimedia.org/wiki/Special:FilePath/Princeton_seal.svg?width=256",
  columbia:   "https://commons.wikimedia.org/wiki/Special:FilePath/Coat_of_Arms_of_Columbia_University.svg?width=256",
  gatech:     "https://commons.wikimedia.org/wiki/Special:FilePath/Georgia_Tech_seal.svg?width=256",
  mcgill:     "https://commons.wikimedia.org/wiki/Special:FilePath/Mcgill_university_coa.png?width=256",
  ubc:        "https://commons.wikimedia.org/wiki/Special:FilePath/British_columbia_univ_coat_arms.svg?width=256",
  imperial:   "https://commons.wikimedia.org/wiki/Special:FilePath/Shield_of_Imperial_College_London.svg?width=256",
  oxford:     "https://commons.wikimedia.org/wiki/Special:FilePath/Arms_of_University_of_Oxford.svg?width=256",
  cambridge:  "https://commons.wikimedia.org/wiki/Special:FilePath/Coat_of_Arms_of_the_University_of_Cambridge.svg?width=256",
  ucl:        "https://commons.wikimedia.org/wiki/Special:FilePath/UCL_Crest.svg?width=256",
  kcl:        "https://commons.wikimedia.org/wiki/Special:FilePath/King's_College%2C_London_full_achievement.svg?width=256",
  edinburgh:  "https://commons.wikimedia.org/wiki/Special:FilePath/University_of_Edinburgh_coat_of_arms.JPG?width=256",
  lse:        "https://commons.wikimedia.org/wiki/Special:FilePath/London_School_of_Economics_Coat_of_Arms.svg?width=256",
  warwick:    "https://commons.wikimedia.org/wiki/Special:FilePath/Shield_of_the_University_of_Warwick.svg?width=256",
  lmu:        "https://commons.wikimedia.org/wiki/Special:FilePath/Sigillum_Universitatis_Ludovico-Maximilianeae.svg?width=256",
  heidelberg: "https://commons.wikimedia.org/wiki/Special:FilePath/Logo_University_of_Heidelberg.svg?width=256",
  tudelft:    "https://commons.wikimedia.org/wiki/Special:FilePath/Zegel_Technische_Universiteit_Delft.svg?width=256",
  kuleuven:   "https://commons.wikimedia.org/wiki/Special:FilePath/KUL.svg?width=256",
  ipparis:    "https://commons.wikimedia.org/wiki/Special:FilePath/Institut_polytechnique_de_Paris_logo.svg?width=256",
  kth:        "https://commons.wikimedia.org/wiki/Special:FilePath/KTH_logotype.jpg?width=256",
  peking:     "https://commons.wikimedia.org/wiki/Special:FilePath/Peking_University_seal.svg?width=256",
  kyoto:      "https://commons.wikimedia.org/wiki/Special:FilePath/Kyoto_University_emblem.svg?width=256",
  kfupm:      "https://commons.wikimedia.org/wiki/Special:FilePath/KFUPM_seal.png?width=256",
  metu:       "https://commons.wikimedia.org/wiki/Special:FilePath/Logo_ODT%C3%9C.svg?width=256",
  melbourne:  "https://commons.wikimedia.org/wiki/Special:FilePath/Arms_of_the_University_of_Melbourne.svg?width=256",
  anu:        "https://commons.wikimedia.org/wiki/Special:FilePath/Arms_of_the_Australian_National_University.svg?width=256"
};

UNIS.forEach(u => { if (UNI_LOGOS[u.id]) u.logoUrl = UNI_LOGOS[u.id]; });
