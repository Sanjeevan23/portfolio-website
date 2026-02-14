// File: src/data/experience.ts
export type Experience = {
  id: string;
  company: string;
  title: string;
  start: string; 
  end?: string; 
  location?: string;
  workType?:string; 
  bullets: string[]; 
  tech?: string[]; 
  link?: string; 
};

export const EXPERIENCES: Experience[] = [
  {
    id: 'ahken-assoc',
    company: 'Ahken Labs (PVT) LTD',
    title: 'Associate - Full Stack Developer',
    start: 'January 2025',
    end: 'June 2026',
    location: 'Jaffna, Sri Lanka - Remote',
    workType: 'Full time',
    bullets: [
      'Worked as part of a team building corporate websites and admin panels using HTML, CSS and JavaScript with modern frameworks.',
      'Implemented UI/UX modal flows, responsive layouts and a sample hospital website project for client onboarding.',
      'Gained practical experience with SQL basics, building CRUD flows and integrating simple DB-backed features.',
      'Collaborated with designers and QA in an agile-like workflow; contributed to design iterations and peer reviews.'
    ],
    tech: ['HTML5', 'CSS3', 'JavaScript', 'UI/UX', 'SQL (basic)'],
    link: 'https://www.linkedin.com/company/ahkenlabs',
  },

  {
    id: 'ahken-fullstack',
    company: 'Ahken Labs (PVT) LTD',
    title: 'Full Stack Engineer (Part-time)',
    start: 'July 2025',
    end: 'Present',
    location: 'Sunderland, UK - Remote',
    workType: 'Part time',
    bullets: [
      'Lead developer on multiple production websites and cross-platform mobile apps (React Native & Flutter).',
      'Designed and shipped landing pages, real-world travel sites and admin dashboards with Next.js, Node.js and Tailwind.',
      'Integrated hosting and infra (Vercel, AWS), Firebase auth & realtime, Postman-driven API integration and MongoDB for persistence.',
      'Performed codebase maintenance on GitHub, implemented CI-friendly workflows and mentored team members on engineering practices.'
    ],
    tech: ['Next.js', 'React', 'React Native', 'Flutter', 'Node.js', 'TypeScript', 'Tailwind', 'Firebase', 'MongoDB', 'Vercel', 'AWS'],
    link: 'https://www.linkedin.com/company/ahkenlabs',
  },

  {
    id: 'jyothi-assoc',
    company: "JYOTHI's ICT ZONE (PVT) LTD",
    title: 'Associate Full-stack Engineer',
    start: 'June 2025',
    end: 'November 2025',
    location: 'Germany - Remote',
    workType: 'Full time',
    bullets: [
      'Built responsive mobile-first applications using React Native and TypeScript for iOS and Android.',
      'Worked on NestJS backends and integrated REST APIs and CRUD endpoints for client-facing apps.',
      'Collaborated with product owners to implement features, handle troubleshooting and QA feedback cycles.'
    ],
    tech: ['React Native', 'TypeScript', 'NestJS', 'APIs', 'CRUD', 'iOS', 'Android'],
    link: 'https://www.linkedin.com/company/jyothis-ict-zone-pvt-ltd',
  },

  {
    id: 'jyothi-freelance',
    company: "JYOTHI's ICT ZONE (PVT) LTD",
    title: 'Freelance Full-stack Engineer',
    start: 'November 2025',
    end: 'Present',
    location: 'Remote',
    workType: 'Freelance',
    bullets: [
      'Continued delivering features and maintenance as an independent contractor.',
      'Implemented cross-platform responsive designs and API integrations, focusing on stability and performance.',
      'Provided technical guidance and small-scope architecture suggestions to the in-house team.'
    ],
    tech: ['React Native', 'NestJS', 'TypeScript', 'APIs', 'Responsive Design'],
    link: 'https://www.linkedin.com/company/jyothis-ict-zone-pvt-ltd',
  },
];

// small profile left in case you want to reuse elsewhere
export const PROFILE = {
  languages: [
    { code: 'en', label: 'English (fluent)' },
    { code: 'ta', label: 'Tamil (native)' },
  ],
  availability: 'Flexible - available across time zones',
};

export default EXPERIENCES;
