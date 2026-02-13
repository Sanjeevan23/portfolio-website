// Example data file: src/data/projects.ts

export type Project = {
    id: string; // short id used for image filenames
    title: string;
    subtitle?: string;
    short: string;
    long?: string;
    tags: string[];
    year?: string | number;
    website?: string;
    repo?: string;
    role?: string;
    images?: string[]; // urls to public images, e.g. /images/projects/ahken-1.jpg
};

export const PROJECTS: Project[] = [
    {
        id: 'ahkenlabs',
        title: 'Ahken Labs - Official Website',
        subtitle: 'Next.js • Tailwind • TypeScript • Firebase • Cloudinary',
        short: 'Official corporate website built with Next.js and Tailwind, with modern design and image upload admin flow.',
        long:
            'I built the official Ahken Labs cross platform responsive website using Next.js and TypeScript. Features include an admin image upload flow using Firebase + Cloudinary, fast static rendering for public pages, responsive design with Tailwind, and CI deployed to Vercel. I managed the full repo on GitHub and implemented analytics and SEO.',
        tags: ['Next.js', 'TypeScript', 'Tailwind', 'Firebase', 'Cloudinary', 'Vercel'],
        year: 2025,
        website: 'https://ahkenlabs.com/',
        repo: 'https://github.com/Sanjeevan23/ahken-labs',
        role: 'Full-stack, Frontend lead',
        images: ['/images/ahkenlabs-hero.png', '/images/ahkenlabs-1.jpg', '/images/ahkenlabs-footer.png','/images/ahkenlabs-loading.png'],
    },
    {
        id: 'taskmanager',
        title: 'Task Manager - Workflow System',
        subtitle: 'React • Tailwind • Firebase • Brevo • Serverless Architecture',
        short: 'Multi-role organization task & communication platform with real-time updates, chats, and project timeline tracking.',
        long:
            'Designed and developed a full organization workflow management system focused on internal company operations. The platform supports admin and employee roles with completely separate dashboards. Administrators can create organizations, generate employee accounts with credentials, manage permissions, rename or delete users, and visually group employees using color identifiers similar to collaborative spreadsheet systems.\n\nEmployees can update assigned tasks, communicate through private and group chats, and collaborate in real-time. Each project includes dynamic timeline visualization with automatic Gantt chart generation based on task progress.\n\nThe platform uses a serverless architecture powered by Firebase for real-time data synchronization and authentication. Email verification and OTP delivery are handled through Brevo. The UI is designed with a premium dark interface for clarity and reduced eye strain during long work sessions.\n\nDeployed on Vercel with full source management on GitHub.',
        tags: ['React', 'Tailwind', 'Firebase', 'Brevo', 'GitHub', 'Vercel'],
        year: 2025,
        website: 'https://task-manager-app-saju.vercel.app',
        repo: 'https://github.com/Sanjeevan23/task-manager-app',
        role: 'Full System Design, Frontend Architecture & Realtime Data Modeling',
        images: ['/images/task-manager-admin.png', '/images/task-manager-step.png', '/images/task-manager-task.png', '/images/task-manager-open.png'],
    },
    {
        id: 'explorer',
        title: 'Explorer — Travel UI/UX (Figma)',
        subtitle: 'Figma • Mobile-first design',
        short: 'Figma mobile UI/UX design for a travel platform (Explorer). Modern, natural aesthetic with green-forward visuals.',
        long:
            'Mobile-first UI/UX design for a travel platform called Explorer. The Figma project contains interactive prototypes, full project design, component library and responsive variants for mobile. Link and screenshots available on request.',
        tags: ['Figma', 'UI/UX', 'Design'],
        year: 2024,
        website: 'https://www.figma.com/design/Od9HmGCNNjRxZZGOyCMjfy/Explorer---dev?node-id=0-1&t=5NYXWmYWK1xr8vxa-1',
        repo: '',
        role: 'Product UI/UX Designer',
        images: ['/images/Explorer-full.png'],
    },
];


// -----------------------------
// Notes / How to use
// -----------------------------
// 1) Drop images into public/images/projects/ using the naming convention: <id>-1.jpg, <id>-2.jpg, ...
//    Examples: /public/images/ahkenlabs-1.jpg, /public/images/taskmanager-1.jpg
// 2) The card preview uses `object-fit: contain` so the full image is visible. Thumbnails in the deck use `cover`.
// 3) TypeScript "possibly undefined" errors are handled by using `const images = project.images ?? []` everywhere.
// 4) Files are split under src/components/projects/ for easier maintenance.
// 5) If you want the preview to crop instead of letterbox, change `objectFit: 'contain'` to `'cover'` in ProjectCard and ProjectModal.
// 6) Want a deeper three.js based 3D card later? I can convert the card surface to a tiny react-three/fiber mesh per card.

