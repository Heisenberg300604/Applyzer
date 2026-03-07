export type GithubRepoLLMInput = {
  name: string
  url: string
  primaryLanguage: string | null
  githubDescription: string | null
  topics: string[]
  readmeRaw: string
}

export type GeminiProjectSummary = {
  title: string
  description: string
  tech_stack: string[]
  features: string[]
  resume_bullets: string[]
  category: string
  skills_demonstrated: string[]
}
