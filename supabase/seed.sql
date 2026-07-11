-- =============================================================================
-- LearnHub AI — Seed data: careers catalog + free-first resource library.
--
-- Runs automatically on `supabase db reset` (local). For a linked/remote
-- project, paste into the SQL editor or run once.
--
-- Salary ranges are illustrative starting points — refine per market.
-- Idempotent: careers upsert on slug; resources seed only when empty.
-- =============================================================================

insert into public.careers
  (slug, title, category, description, typical_skills, salary_ranges, remote_potential, demand_level)
values
  ('frontend-engineer', 'Frontend Engineer', 'software',
   'Build the screens people actually use — the buttons, pages, and interactions of web apps.',
   array['HTML','CSS','JavaScript','React','Responsive design','Git'],
   '{"NG":"₦250k–₦800k/mo","KE":"KSh 60k–180k/mo","GH":"GH₵4k–12k/mo","ZA":"R18k–R45k/mo","remote":"$600–$2500/mo"}'::jsonb,
   'high', 'high'),

  ('backend-engineer', 'Backend Engineer', 'software',
   'Build the engine behind apps — the logic, databases, and APIs that make everything work.',
   array['A backend language (Node/Python/Go)','APIs','Databases','SQL','Authentication','Git'],
   '{"NG":"₦300k–₦1m/mo","KE":"KSh 70k–200k/mo","GH":"GH₵5k–14k/mo","ZA":"R22k–R55k/mo","remote":"$700–$3000/mo"}'::jsonb,
   'high', 'high'),

  ('fullstack-engineer', 'Full-Stack Engineer', 'software',
   'Do a bit of everything — frontend and backend — to ship whole features on your own.',
   array['JavaScript/TypeScript','React','Node','Databases','APIs','Git'],
   '{"NG":"₦350k–₦1.2m/mo","KE":"KSh 80k–220k/mo","GH":"GH₵5k–15k/mo","ZA":"R25k–R60k/mo","remote":"$800–$3500/mo"}'::jsonb,
   'high', 'high'),

  ('mobile-developer', 'Mobile Developer', 'software',
   'Build the apps in people''s pockets — for Android and iOS.',
   array['Kotlin or Swift','Flutter or React Native','APIs','UI basics','Git'],
   '{"NG":"₦300k–₦900k/mo","KE":"KSh 70k–190k/mo","GH":"GH₵4.5k–13k/mo","ZA":"R22k–R50k/mo","remote":"$700–$2800/mo"}'::jsonb,
   'high', 'medium'),

  ('data-analyst', 'Data Analyst', 'data',
   'Turn raw data into clear answers — spot patterns and help teams decide with confidence.',
   array['Spreadsheets','SQL','Data visualisation','Python or R','Statistics basics','Storytelling'],
   '{"NG":"₦250k–₦750k/mo","KE":"KSh 55k–160k/mo","GH":"GH₵4k–11k/mo","ZA":"R18k–R42k/mo","remote":"$500–$2200/mo"}'::jsonb,
   'high', 'high'),

  ('data-scientist', 'Data Scientist', 'data',
   'Use statistics and machine learning to predict, model, and uncover deeper insight.',
   array['Python','Statistics','Machine learning','SQL','Pandas','Data visualisation'],
   '{"NG":"₦400k–₦1.3m/mo","KE":"KSh 90k–230k/mo","GH":"GH₵6k–16k/mo","ZA":"R28k–R65k/mo","remote":"$900–$4000/mo"}'::jsonb,
   'high', 'medium'),

  ('data-engineer', 'Data Engineer', 'data',
   'Build the pipelines and systems that move and store data reliably at scale.',
   array['Python','SQL','ETL','Databases','Cloud basics','Data modelling'],
   '{"NG":"₦400k–₦1.3m/mo","KE":"KSh 90k–230k/mo","GH":"GH₵6k–16k/mo","ZA":"R28k–R65k/mo","remote":"$900–$4000/mo"}'::jsonb,
   'high', 'medium'),

  ('ai-ml-engineer', 'AI / ML Engineer', 'ai',
   'Build and ship machine-learning and AI features — from models to real products.',
   array['Python','Machine learning','Deep learning basics','APIs','Maths','Git'],
   '{"NG":"₦450k–₦1.5m/mo","KE":"KSh 100k–250k/mo","GH":"GH₵7k–18k/mo","ZA":"R30k–R70k/mo","remote":"$1000–$4500/mo"}'::jsonb,
   'high', 'medium'),

  ('product-designer', 'Product Designer (UI/UX)', 'design',
   'Design how products look and feel so they''re easy — and a pleasure — to use.',
   array['Figma','UI design','UX principles','Prototyping','User research basics','Design systems'],
   '{"NG":"₦250k–₦800k/mo","KE":"KSh 55k–170k/mo","GH":"GH₵4k–12k/mo","ZA":"R18k–R45k/mo","remote":"$600–$2600/mo"}'::jsonb,
   'high', 'high'),

  ('ux-researcher', 'UX Researcher', 'design',
   'Understand real users through research so teams build the right thing.',
   array['User interviews','Usability testing','Surveys','Synthesis','Communication'],
   '{"NG":"₦250k–₦750k/mo","KE":"KSh 55k–160k/mo","GH":"GH₵4k–11k/mo","ZA":"R18k–R42k/mo","remote":"$600–$2400/mo"}'::jsonb,
   'medium', 'medium'),

  ('cybersecurity-analyst', 'Cybersecurity Analyst', 'cybersecurity',
   'Protect systems and people — spot threats, close gaps, and respond to attacks.',
   array['Networking basics','Linux','Security fundamentals','Threat analysis','Tools (SIEM)','Scripting'],
   '{"NG":"₦300k–₦1m/mo","KE":"KSh 70k–200k/mo","GH":"GH₵5k–14k/mo","ZA":"R22k–R55k/mo","remote":"$700–$3000/mo"}'::jsonb,
   'medium', 'high'),

  ('cloud-devops-engineer', 'Cloud / DevOps Engineer', 'cloud',
   'Run and automate the infrastructure that keeps software fast, reliable, and shipping.',
   array['Linux','Cloud (AWS/GCP/Azure)','CI/CD','Docker','Scripting','Networking basics'],
   '{"NG":"₦400k–₦1.4m/mo","KE":"KSh 90k–240k/mo","GH":"GH₵6k–17k/mo","ZA":"R28k–R68k/mo","remote":"$900–$4200/mo"}'::jsonb,
   'high', 'high'),

  ('product-manager', 'Product Manager', 'product',
   'Decide what to build and why — connect users, business, and engineering to ship value.',
   array['Product thinking','User research','Roadmapping','Communication','Data literacy','Prioritisation'],
   '{"NG":"₦400k–₦1.3m/mo","KE":"KSh 90k–230k/mo","GH":"GH₵6k–16k/mo","ZA":"R28k–R65k/mo","remote":"$900–$4000/mo"}'::jsonb,
   'high', 'medium'),

  ('qa-engineer', 'QA / Test Engineer', 'qa',
   'Make sure software actually works — find bugs before users do, manually and with automation.',
   array['Test cases','Manual testing','Automation basics','A scripting language','Attention to detail'],
   '{"NG":"₦250k–₦750k/mo","KE":"KSh 55k–160k/mo","GH":"GH₵4k–11k/mo","ZA":"R18k–R42k/mo","remote":"$500–$2200/mo"}'::jsonb,
   'medium', 'medium'),

  ('technical-writer', 'Technical Writer', 'software',
   'Explain complex tech clearly — docs, guides, and tutorials developers rely on.',
   array['Clear writing','Understanding of tech','Markdown','Docs tools','Empathy for readers'],
   '{"NG":"₦250k–₦700k/mo","KE":"KSh 50k–150k/mo","GH":"GH₵3.5k–10k/mo","ZA":"R16k–R38k/mo","remote":"$500–$2500/mo"}'::jsonb,
   'high', 'medium'),

  ('no-code-developer', 'No-Code Developer', 'software',
   'Build real apps, sites, and automations with visual tools — fast, and without heavy coding.',
   array['Webflow or Bubble','Zapier/Make','Airtable','Logic & workflows','Design sense'],
   '{"NG":"₦200k–₦650k/mo","KE":"KSh 45k–140k/mo","GH":"GH₵3k–9k/mo","ZA":"R15k–R35k/mo","remote":"$400–$2000/mo"}'::jsonb,
   'high', 'medium')

on conflict (slug) do nothing;

-- Resource library (free-first), across all 9 categories. Seeds only if empty.
do $$
begin
  if not exists (select 1 from public.resources) then
    insert into public.resources
      (title, url, provider, resource_type, cost, difficulty, description, tags, skill, career_id, category, duration_minutes, offers_certificate)
    values
      -- Software Engineering
      ('Responsive Web Design', 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', 'freeCodeCamp', 'course', 'free', 'beginner',
       'Learn HTML and CSS by building real projects.', array['html','css','frontend'], 'HTML & CSS',
       (select id from public.careers where slug = 'frontend-engineer'), 'Software Engineering', 1800, false),
      ('The Odin Project', 'https://www.theodinproject.com/', 'The Odin Project', 'course', 'free', 'beginner',
       'A complete, free full-stack curriculum from zero.', array['javascript','fullstack'], 'Full-stack web',
       (select id from public.careers where slug = 'fullstack-engineer'), 'Software Engineering', 12000, false),
      ('CS50x: Intro to Computer Science', 'https://cs50.harvard.edu/x/', 'Harvard', 'course', 'free', 'beginner',
       'Harvard''s legendary intro to programming and CS.', array['programming','fundamentals'], 'CS fundamentals',
       (select id from public.careers where slug = 'backend-engineer'), 'Software Engineering', 6000, true),
      ('Back End Development and APIs', 'https://www.freecodecamp.org/learn/back-end-development-and-apis/', 'freeCodeCamp', 'course', 'free', 'intermediate',
       'Build APIs and services with Node and Express.', array['node','api','backend'], 'APIs & backend',
       (select id from public.careers where slug = 'backend-engineer'), 'Software Engineering', 2400, false),

      -- Data Science
      ('Learn Python & Pandas', 'https://www.kaggle.com/learn', 'Kaggle', 'course', 'free', 'beginner',
       'Short, hands-on courses in Python, Pandas, and ML.', array['python','pandas','data'], 'Python for data',
       (select id from public.careers where slug = 'data-analyst'), 'Data Science', 900, false),
      ('SQL Tutorial', 'https://mode.com/sql-tutorial/', 'Mode', 'course', 'free', 'beginner',
       'Practical SQL for analysis, from basic to advanced.', array['sql','data'], 'SQL',
       (select id from public.careers where slug = 'data-analyst'), 'Data Science', 600, false),
      ('Google Data Analytics Certificate', 'https://www.coursera.org/professional-certificates/google-data-analytics', 'Google / Coursera', 'course', 'freemium', 'beginner',
       'Industry-recognised path (audit free).', array['data','analytics'], 'Data analytics',
       (select id from public.careers where slug = 'data-analyst'), 'Data Science', 9000, true),

      -- AI
      ('Machine Learning with Python', 'https://www.freecodecamp.org/learn/machine-learning-with-python/', 'freeCodeCamp', 'course', 'free', 'intermediate',
       'Build ML models with TensorFlow and Python.', array['python','ml','ai'], 'Machine learning',
       (select id from public.careers where slug = 'ai-ml-engineer'), 'AI', 1800, false),
      ('Machine Learning Crash Course', 'https://developers.google.com/machine-learning/crash-course', 'Google', 'course', 'free', 'intermediate',
       'Google''s fast, practical intro to ML concepts.', array['ml','ai'], 'ML foundations',
       (select id from public.careers where slug = 'ai-ml-engineer'), 'AI', 900, false),

      -- Cloud
      ('AWS Cloud Practitioner Essentials', 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/', 'AWS', 'course', 'free', 'beginner',
       'A free intro to cloud and AWS fundamentals.', array['cloud','aws'], 'Cloud fundamentals',
       (select id from public.careers where slug = 'cloud-devops-engineer'), 'Cloud', 360, false),
      ('Azure Fundamentals', 'https://learn.microsoft.com/en-us/training/paths/microsoft-azure-fundamentals-describe-cloud-concepts/', 'Microsoft Learn', 'course', 'free', 'beginner',
       'Core cloud concepts on Microsoft Azure.', array['cloud','azure'], 'Cloud fundamentals',
       (select id from public.careers where slug = 'cloud-devops-engineer'), 'Cloud', 480, false),

      -- DevOps
      ('Docker — Get Started', 'https://docs.docker.com/get-started/', 'Docker', 'documentation', 'free', 'beginner',
       'Containerise and run applications with Docker.', array['docker','devops'], 'Containers',
       (select id from public.careers where slug = 'cloud-devops-engineer'), 'DevOps', 240, false),
      ('GitHub Actions', 'https://docs.github.com/en/actions', 'GitHub', 'documentation', 'free', 'intermediate',
       'Automate builds, tests, and deploys with CI/CD.', array['ci-cd','devops'], 'CI/CD',
       (select id from public.careers where slug = 'cloud-devops-engineer'), 'DevOps', 300, false),

      -- Cybersecurity
      ('TryHackMe', 'https://tryhackme.com/', 'TryHackMe', 'course', 'freemium', 'beginner',
       'Hands-on cybersecurity in the browser, free tier.', array['security','hacking'], 'Security fundamentals',
       (select id from public.careers where slug = 'cybersecurity-analyst'), 'Cybersecurity', 3000, false),
      ('Introduction to Cybersecurity', 'https://www.netacad.com/courses/cybersecurity/introduction-cybersecurity', 'Cisco', 'course', 'free', 'beginner',
       'Cisco''s free intro to security concepts and careers.', array['security'], 'Security intro',
       (select id from public.careers where slug = 'cybersecurity-analyst'), 'Cybersecurity', 900, true),

      -- Product Management
      ('Product Management First Steps', 'https://productschool.com/free-product-management-resources', 'Product School', 'course', 'free', 'beginner',
       'Free intro resources to product management.', array['product'], 'Product basics',
       (select id from public.careers where slug = 'product-manager'), 'Product Management', 600, false),
      ('INSPIRED: How to Create Products', 'https://www.svpg.com/inspired-how-to-create-products-customers-love/', 'Marty Cagan', 'book', 'paid', 'intermediate',
       'The classic on how great product teams work.', array['product'], 'Product craft',
       (select id from public.careers where slug = 'product-manager'), 'Product Management', 900, false),

      -- UI/UX
      ('Figma for Beginners', 'https://help.figma.com/hc/en-us/sections/4405269443991', 'Figma', 'course', 'free', 'beginner',
       'Learn interface design in the industry-standard tool.', array['figma','ui'], 'UI design',
       (select id from public.careers where slug = 'product-designer'), 'UI/UX', 300, false),
      ('Google UX Design Certificate', 'https://www.coursera.org/professional-certificates/google-ux-design', 'Google / Coursera', 'course', 'freemium', 'beginner',
       'End-to-end UX design path (audit free).', array['ux','design'], 'UX design',
       (select id from public.careers where slug = 'product-designer'), 'UI/UX', 9000, true),
      ('Laws of UX', 'https://lawsofux.com/', 'Laws of UX', 'article', 'free', 'beginner',
       'The psychology principles behind good design.', array['ux','design'], 'UX principles',
       (select id from public.careers where slug = 'ux-researcher'), 'UI/UX', 120, false),

      -- Digital Marketing
      ('Fundamentals of Digital Marketing', 'https://learndigital.withgoogle.com/digitalgarage/course/digital-marketing', 'Google Digital Garage', 'course', 'free', 'beginner',
       'Free, certificate-bearing intro to digital marketing.', array['marketing','seo'], 'Digital marketing',
       null, 'Digital Marketing', 2400, true),
      ('HubSpot Academy', 'https://academy.hubspot.com/', 'HubSpot', 'course', 'free', 'beginner',
       'Free certifications in marketing, content, and more.', array['marketing','content'], 'Inbound marketing',
       null, 'Digital Marketing', 1800, true);
  end if;
end $$;
