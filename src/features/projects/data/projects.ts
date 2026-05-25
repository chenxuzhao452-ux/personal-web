import type { Project, SkillCategory } from '../types';

export const projects: Project[] = [
  {
    id: 'personal-web',
    nameKey: 'projects.items.personal-web.name',
    descKey: 'projects.items.personal-web.desc',
    technologies: ['Next.js', 'TypeScript', 'Three.js', 'R3F', 'Motion'],
    category: 'web',
    liveUrl: '/',
  },
  {
    id: 'project-2',
    nameKey: 'projects.items.ecommerce.name',
    descKey: 'projects.items.ecommerce.desc',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    category: 'web',
    githubUrl: 'https://github.com',
  },
  {
    id: 'project-3',
    nameKey: 'projects.items.fitness.name',
    descKey: 'projects.items.fitness.desc',
    technologies: ['React Native', 'TypeScript', 'Firebase'],
    category: 'mobile',
    githubUrl: 'https://github.com',
  },
  {
    id: 'project-4',
    nameKey: 'projects.items.design-system.name',
    descKey: 'projects.items.design-system.desc',
    technologies: ['Storybook', 'React', 'CSS Modules', 'Figma'],
    category: 'design',
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
  },
];

export const skillCategories: SkillCategory[] = [
  {
    name: 'ML/AI',
    skills: ['Python', 'PyTorch', 'CUDA', 'OpenCV', 'scikit-learn', 'RL'],
  },
  {
    name: 'CS Foundation',
    skills: ['C/C++', 'MATLAB', 'Embedded Systems', 'FPGA'],
  },
  {
    name: 'Dev & Tools',
    skills: ['Linux', 'Git', 'VS Code', 'WSL 2', 'Claude Code'],
  },
];
