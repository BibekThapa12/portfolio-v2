// All site content lives here; edit this file to update the portfolio.

export const profile = {
  cv: '/Bibek_Thapa_CV.pdf',
  name: 'Bibek Thapa',
  role: 'Full-stack developer',
  location: 'Jhapa, Nepal',
  email: 'bibekthapa9746@gmail.com',
  github: 'https://github.com/BibekThapa12',
  linkedin: 'https://www.linkedin.com/in/bibek-thapa-dev',
};

export const intro =
  'I build web apps with React, TypeScript and Supabase, from the database to the screen, and ship them to real users.';

export const projects: {
  name: string;
  summary: string;
  stack: string;
  live?: string;
  source?: string;
  // one screenshot shown in a browser frame; tall ones scroll on hover
  frame: { file: string; bar: string; alt: string };
}[] = [
  {
    name: 'KhataERP',
    summary:
      'A double-entry accounting ERP for retail and trading businesses in Nepal, now used by six of them. Billing, stock, banking and reports, with Nepali dates and currency.',
    stack: 'React, TypeScript, Tailwind CSS, shadcn/ui, Supabase',
    live: 'https://khataerp.xyz',
    frame: { file: 'khataerp-app', bar: 'khataerp.xyz', alt: 'The KhataERP dashboard for a demo company: account balances, sales and purchase totals, debtors and creditors ageing, cheques, sales and cash-flow charts, top items, VAT, expenses and recent transactions' },
  },
  {
    name: 'KhataERP landing page',
    summary:
      'The marketing site for KhataERP, built as its own app that reuses the ERP’s design language: product tour, features, a live product preview and pricing.',
    stack: 'React, TypeScript, Vite',
    // The Vercel deployment returned 404 on 2026-10-29; add `live` back once it is redeployed.
    source: 'https://github.com/BibekThapa12/KhataERP-LP',
    frame: {
      file: 'lp-page',
      bar: 'KhataERP landing page',
      alt: 'The full KhataERP landing page: hero with a dashboard preview, features, an Add Income entry form and three pricing plans',
    },
  },
];

// Newest first; the current role carries `now`.
export const experience: { when: string; title: string; org: string; points?: string[]; now?: boolean }[] = [
  {
    when: '2026 to now',
    title: 'Software Developer',
    org: 'eNepal Software Technologies',
    points: ['Build and maintain web apps across frontend and backend.', 'Building CFMS, a management system for community forest user groups.'],
    now: true,
  },
  {
    when: 'Feb to Apr 2026',
    title: 'Junior Software Developer, intern',
    org: 'Reactify Software Technologies',
    points: ['Helped build a notes app for Grade 10 to 12 students.', 'Worked with version control, code reviews and senior guidance.'],
  },
  { when: '2024 to 2025', title: 'Senior Accountant', org: 'Gaura Suppliers, Birtamod' },
];

// Newest first. `stat` is the large figure shown beside the list while a row is hovered.
export const education: { when: string; title: string; school: string; tag: string; stat: { value: string; label: string } }[] = [
  { when: '2024', title: 'Diploma in IT Engineering', school: 'Kankai Polytechnic Institute, Durgapur, Jhapa', tag: 'Grade A', stat: { value: 'A', label: 'Grade in the Diploma in IT Engineering' } },
  { when: '2022', title: 'Junior Computer Hardware Technician', school: 'CTEVT, 60-day training in PC assembly and troubleshooting', tag: 'Training', stat: { value: '60', label: 'Days of hands-on CTEVT hardware training' } },
  { when: '2021', title: 'Secondary Education Examination', school: 'Shree Saraswati Secondary School, Jamunbari', tag: 'Grade A+', stat: { value: 'A+', label: 'Grade in the Secondary Education Examination' } },
];

// Each tool name must be known to src/components/Logo.astro. Every fact is true of KhataERP's code.
export const skillGroups: { name: string; note: string; tools: string[]; facts: string[] }[] = [
  {
    name: 'Frontend',
    note: 'Interfaces people use every day',
    tools: ['React', 'TypeScript', 'JavaScript', 'React Router', 'Zustand', 'Tailwind CSS', 'shadcn/ui'],
    facts: ['React 19 with React Router 7 and Zustand for app state', 'Keyboard-first voucher entry with shortcuts for daily billing'],
  },
  {
    name: 'Backend',
    note: 'Data, auth and storage',
    tools: ['Supabase', 'PostgreSQL'],
    facts: [
      'Supabase Auth and Row-Level Security keep each company’s data separate',
      'Double-entry enforced in PostgreSQL: an unbalanced voucher cannot be saved',
      '45 SQL migrations and an Edge Function for automated backups',
    ],
  },
  {
    name: 'Workflow',
    note: 'How I build, test and ship',
    tools: ['Vite', 'Vitest', 'Vercel', 'Git', 'GitHub', 'Claude Code', 'GitHub Copilot'],
    facts: ['65 Vitest test files, including accounting-integrity checks', 'Built with Vite and deployed on Vercel'],
  },
];

// Two years as a senior accountant, built into KhataERP
export const domain = ['Double-entry accounting', 'Nepali Bikram Sambat dates', 'VAT and PAN workflows', 'Rupees in lakh and crore'];

export const languages = [
  { native: 'नेपाली', name: 'Nepali' },
  { native: 'English', name: 'English' },
  { native: 'हिन्दी', name: 'Hindi' },
];
