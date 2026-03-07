import type { GithubRepoLLMInput, GeminiProjectSummary } from '@/types/project'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
const GEMINI_MODEL = (import.meta.env.VITE_GEMINI_MODEL as string | undefined) || 'gemini-2.0-flash'

const TECH_CATALOG = [
  'TypeScript', 'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby',
  'React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'Node.js', 'Express', 'FastAPI', 'Django', 'Flask',
  'Spring Boot', 'NestJS', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Supabase', 'Firebase',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Vercel', 'Netlify', 'GitHub Actions', 'Jest', 'Pytest',
  'Tailwind CSS', 'HTML', 'CSS', 'GraphQL', 'REST API', 'Prisma', 'TensorFlow', 'PyTorch', 'LangChain',
]

const TECH_ALIASES: Record<string, string> = {
  ts: 'TypeScript',
  typescript: 'TypeScript',
  js: 'JavaScript',
  javascript: 'JavaScript',
  node: 'Node.js',
  'nodejs': 'Node.js',
  reactjs: 'React',
  nextjs: 'Next.js',
  postgres: 'PostgreSQL',
  postgresql: 'PostgreSQL',
  mongo: 'MongoDB',
  mongodb: 'MongoDB',
  tailwind: 'Tailwind CSS',
  graphql: 'GraphQL',
  api: 'REST API',
  'github actions': 'GitHub Actions',
}

function normalizeTechToken(value: string) {
  const cleaned = value.trim().toLowerCase().replace(/[()]/g, '')
  return TECH_ALIASES[cleaned] || TECH_CATALOG.find(t => t.toLowerCase() === cleaned) || value.trim()
}

function extractKnownTech(input: GithubRepoLLMInput) {
  const text = `${input.name} ${input.githubDescription || ''} ${input.readmeRaw || ''} ${(input.topics || []).join(' ')} ${input.primaryLanguage || ''}`.toLowerCase()
  const found = new Set<string>()

  for (const tech of TECH_CATALOG) {
    if (text.includes(tech.toLowerCase())) found.add(tech)
  }
  if (input.primaryLanguage) found.add(normalizeTechToken(input.primaryLanguage))

  return [...found]
}

function cleanList(values: string[], limit: number) {
  const dedup = [...new Set(values.map(v => normalizeTechToken(String(v))).map(v => v.trim()).filter(Boolean))]
  return dedup.slice(0, limit)
}

function fallbackSummary(input: GithubRepoLLMInput): GeminiProjectSummary {
  const tech = extractKnownTech(input).slice(0, 8)

  return {
    title: input.name,
    description: input.githubDescription || `Project ${input.name} from GitHub repository analysis.`,
    tech_stack: tech,
    features: [],
    resume_bullets: [
      `Built and maintained ${input.name} with a focus on production-ready implementation.`,
      `Implemented core functionality using ${input.primaryLanguage || 'modern engineering practices'}.`,
      `Published and iterated the project via GitHub with ongoing updates and improvements.`,
    ],
    category: 'other',
    skills_demonstrated: tech.slice(0, 8),
  }
}

function extractJsonObject(text: string) {
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Gemini response did not contain valid JSON object.')
  }
  return JSON.parse(text.slice(start, end + 1))
}

export async function summarizeRepoWithGemini(input: GithubRepoLLMInput): Promise<GeminiProjectSummary> {
  if (!GEMINI_API_KEY) {
    console.warn('Missing VITE_GEMINI_API_KEY in .env. Using fallback project summary.')
    return fallbackSummary(input)
  }

  const prompt = `
You are extracting resume-ready project data from a GitHub repository.
Return ONLY valid JSON with exactly these keys:
title, description, tech_stack, features, resume_bullets, category, skills_demonstrated

Rules:
- title: short human-friendly title
- description: 1-2 sentence plain-English summary
- tech_stack: array of up to 8 technologies
- features: array of up to 6 concrete implemented capabilities
- resume_bullets: array of exactly 3 impact-focused resume bullets
- category: one of [web, mobile, ai_ml, data, devops, backend, frontend, fullstack, blockchain, security, other]
- skills_demonstrated: array of up to 8 practical skills

Repository metadata:
name: ${input.name}
url: ${input.url}
primary_language: ${input.primaryLanguage ?? ''}
github_description: ${input.githubDescription ?? ''}
topics: ${(input.topics || []).join(', ')}
readme:
${input.readmeRaw || ''}
`

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
  )

  if (!response.ok) {
    const errorText = await response.text()
    console.warn(`Gemini request failed (${response.status}). Using fallback summary. ${errorText}`)
    return fallbackSummary(input)
  }

  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    return fallbackSummary(input)
  }

  const parsed = extractJsonObject(text)
  const inferredTech = extractKnownTech(input)
  const modelTech = Array.isArray(parsed.tech_stack) ? parsed.tech_stack.map(String) : []
  const modelSkills = Array.isArray(parsed.skills_demonstrated) ? parsed.skills_demonstrated.map(String) : []

  const finalTech = cleanList([...modelTech, ...inferredTech], 8)
  const finalSkills = cleanList([...modelSkills, ...finalTech], 8)

  return {
    title: String(parsed.title || input.name),
    description: String(parsed.description || input.githubDescription || ''),
    tech_stack: finalTech,
    features: Array.isArray(parsed.features) ? parsed.features.map(String) : [],
    resume_bullets: Array.isArray(parsed.resume_bullets) ? parsed.resume_bullets.map(String).slice(0, 3) : [],
    category: String(parsed.category || 'other'),
    skills_demonstrated: finalSkills,
  }
}
