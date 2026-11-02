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

export const education: { when: string; title: string; school: string; grade?: string; featured?: boolean }[] = [
  { when: '2024', title: 'Diploma in IT Engineering', school: 'Kankai Polytechnic Institute, Durgapur, Jhapa', grade: 'A', featured: true },
  { when: '2022', title: 'Junior Computer Hardware Technician', school: 'CTEVT, 60-day training in PC assembly and troubleshooting' },
  { when: '2021', title: 'Secondary Education Examination', school: 'Shree Saraswati Secondary School, Jamunbari', grade: 'A+' },
];

// Each tool name must have a logo in src/components/Logo.astro.
export const skillGroups: { name: string; note: string; tools: string[]; wide?: boolean }[] = [
  { name: 'Frontend', note: 'Interfaces people use every day', tools: ['React', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'shadcn/ui'], wide: true },
  { name: 'Backend', note: 'Data, auth and storage', tools: ['Supabase', 'PostgreSQL'] },
  { name: 'Workflow', note: 'How I build and ship', tools: ['Git', 'GitHub', 'Claude Code', 'GitHub Copilot'], wide: true },
];

export const languages = [
  { native: 'नेपाली', name: 'Nepali' },
  { native: 'English', name: 'English' },
  { native: 'हिन्दी', name: 'Hindi' },
];
