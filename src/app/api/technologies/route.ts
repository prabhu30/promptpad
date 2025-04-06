import { NextResponse } from 'next/server';

// This could be moved to a database or external API in the future
const technologies = [
  { id: 'nextjs', name: 'Next.js' },
  { id: 'reactjs', name: 'React.js' },
  { id: 'tailwind', name: 'Tailwind CSS' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'nodejs', name: 'Node.js' },
  { id: 'express', name: 'Express.js' },
  { id: 'mongodb', name: 'MongoDB' },
  { id: 'postgresql', name: 'PostgreSQL' },
  { id: 'prisma', name: 'Prisma' },
  { id: 'graphql', name: 'GraphQL' },
  { id: 'redux', name: 'Redux' },
  { id: 'vue', name: 'Vue.js' },
  { id: 'angular', name: 'Angular' },
  { id: 'svelte', name: 'Svelte' },
  { id: 'python', name: 'Python' },
  { id: 'django', name: 'Django' },
  { id: 'flask', name: 'Flask' },
  { id: 'fastapi', name: 'FastAPI' },
  { id: 'java', name: 'Java' },
  { id: 'spring', name: 'Spring Boot' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'ruby', name: 'Ruby' },
  { id: 'rails', name: 'Ruby on Rails' },
  { id: 'php', name: 'PHP' },
  { id: 'laravel', name: 'Laravel' },
  { id: 'dotnet', name: '.NET' },
  { id: 'csharp', name: 'C#' },
  { id: 'kotlin', name: 'Kotlin' },
  { id: 'swift', name: 'Swift' },
  { id: 'flutter', name: 'Flutter' },
  { id: 'react-native', name: 'React Native' },
  { id: 'docker', name: 'Docker' },
  { id: 'kubernetes', name: 'Kubernetes' },
  { id: 'aws', name: 'AWS' },
  { id: 'azure', name: 'Azure' },
  { id: 'gcp', name: 'Google Cloud' },
  { id: 'firebase', name: 'Firebase' },
  { id: 'supabase', name: 'Supabase' },
];

export async function GET() {
  return NextResponse.json(technologies);
} 