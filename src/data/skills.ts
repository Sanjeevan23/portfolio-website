// src/data/skills.ts
export type SkillEntry = {
    id: string;
    label: string;
    category: 'frontend' | 'backend' | 'tools' | 'platform' | 'soft';
    color?: string; // prefer hex, optional
    short?: string;
};

export const SKILLS: SkillEntry[] = [
    // Frontend
    { id: 'html', label: 'HTML5', category: 'frontend', color: '#e34f26' },
    { id: 'css', label: 'CSS3', category: 'frontend', color: '#1572b6' },
    { id: 'js', label: 'JavaScript', category: 'frontend', color: '#f7df1e' },
    { id: 'react', label: 'React', category: 'frontend', color: '#61dafb' },
    { id: 'next', label: 'Next.js', category: 'frontend', color: '#ffffffd7' },
    { id: 'ts', label: 'TypeScript', category: 'frontend', color: '#3178c6' },
    { id: 'tailwind', label: 'Tailwind CSS', category: 'frontend', color: '#06b6d4' },

    // Backend
    { id: 'node', label: 'Node.js', category: 'backend', color: '#43853d' },
    { id: 'nest', label: 'NestJS', category: 'backend', color: '#e0234e' },
    { id: 'mongodb', label: 'MongoDB', category: 'backend', color: '#47a248' },
    { id: 'rest', label: 'REST APIs', category: 'backend', color: '#9b59b6' },

    // Mobile / Cross platform
    { id: 'rn', label: 'React Native', category: 'platform', color: '#61dafb' },
    { id: 'flutter', label: 'Flutter', category: 'platform', color: '#02569b' },
    { id: 'android', label: 'Android', category: 'platform', color: '#3ddc84' },
    { id: 'ios', label: 'iOS', category: 'platform', color: '#ffffff' },

    // Cloud and tools
    { id: 'firebase', label: 'Firebase', category: 'tools', color: '#ffca28' },
    { id: 'cloudinary', label: 'Cloudinary', category: 'tools', color: '#3f8efc' },
    { id: 'cloudflare', label: 'Cloudflare', category: 'tools', color: '#f38020' },
    { id: 'git', label: 'Git & GitHub', category: 'tools', color: '#ffffff' },
    { id: 'vscode', label: 'VS Code', category: 'tools', color: '#0065a9' },
    { id: 'figma', label: 'Figma', category: 'tools', color: '#f24e1e' },
    { id: 'adobexd', label: 'Adobe XD', category: 'tools', color: '#ff61c8' },
    { id: 'canva', label: 'Canva', category: 'tools', color: '#00c4cc' },

    // Soft skills & process
    { id: 'uiux', label: 'UI / UX Design', category: 'soft', color: '#94a3b8' },
    { id: 'communication', label: 'Communication', category: 'soft', color: '#94a3b8' },
    { id: 'teamwork', label: 'Teamwork', category: 'soft', color: '#94a3b8' },
    { id: 'project', label: 'Project Management', category: 'soft', color: '#94a3b8' },
    { id: 'critical', label: 'Critical Thinking', category: 'soft', color: '#94a3b8' },
    { id: 'msoffice', label: 'MS Office', category: 'tools', color: '#217346' },

    // misc
    { id: 'apk', label: 'APK / AAB', category: 'platform', color: '#3ddc84' },
    { id: 'webapp', label: 'Websites', category: 'platform', color: '#0ea5a4' },
    { id: 'mobileapp', label: 'Mobile Apps', category: 'platform', color: '#ffffffc5' },
];
