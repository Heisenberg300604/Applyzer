import { useEffect, useMemo, useState } from 'react'
import { useUser as useClerkUser } from '@clerk/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { ExternalLink, Github, Loader2, Sparkles } from 'lucide-react'

type GithubRepo = {
  id: number
  name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  owner: { login: string }
}

type GeneratedProfile = {
  headline: string
  summary: string
  skills: string[]
  highlights: string[]
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'this', 'that', 'from', 'your', 'you', 'are', 'into', 'using', 'used', 'build', 'built', 'project', 'projects',
  'repository', 'repo', 'application', 'app', 'data', 'code', 'file', 'files', 'readme', 'setup', 'install', 'usage', 'demo', 'test', 'tests',
  'about', 'over', 'under', 'into', 'onto', 'http', 'https', 'www', 'com', 'org', 'net', 'can', 'will', 'should', 'have', 'has', 'had', 'not',
  'all', 'any', 'each', 'more', 'most', 'some', 'such', 'than', 'then', 'when', 'where', 'which', 'while', 'what', 'why', 'who', 'how',
])

const extractKeywords = (text: string, max = 12) => {
  const tokens = (text.toLowerCase().match(/[a-z][a-z0-9+#.-]{2,}/g) || [])
    .filter(token => !STOP_WORDS.has(token))

  const frequency = new Map<string, number>()
  for (const token of tokens) {
    frequency.set(token, (frequency.get(token) || 0) + 1)
  }

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([token]) => token)
}

const normalizeSkill = (value: string) => {
  if (value.toLowerCase() === 'next.js') return 'Next.js'
  if (value.toLowerCase() === 'node.js') return 'Node.js'
  if (value.toLowerCase() === 'typescript') return 'TypeScript'
  if (value.toLowerCase() === 'javascript') return 'JavaScript'
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const formatDate = (value: string) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

export default function Profile() {
  const { user, isLoaded, isSignedIn } = useClerkUser()

  const githubAccount = useMemo(() => {
    if (!user) return null

    return user.externalAccounts?.find((account: any) => {
      const provider = String(account.provider || account.providerSlug || '').toLowerCase()
      return provider.includes('github')
    }) || null
  }, [user])

  const githubUsername = (githubAccount as any)?.username || null

  const [repos, setRepos] = useState<GithubRepo[]>([])
  const [loadingRepos, setLoadingRepos] = useState(false)
  const [selectedRepoIds, setSelectedRepoIds] = useState<number[]>([])
  const [generating, setGenerating] = useState(false)
  const [generatedProfile, setGeneratedProfile] = useState<GeneratedProfile | null>(null)

  useEffect(() => {
    const fetchRepos = async () => {
      if (!githubUsername) return

      setLoadingRepos(true)
      try {
        const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`)
        if (!response.ok) throw new Error('Failed to load repositories.')

        const data: GithubRepo[] = await response.json()
        setRepos(data)
      } catch (error) {
        console.error(error)
        toast.error('Could not load GitHub repositories.')
      } finally {
        setLoadingRepos(false)
      }
    }

    fetchRepos()
  }, [githubUsername])

  const toggleRepo = (repoId: number) => {
    setSelectedRepoIds(prev => {
      if (prev.includes(repoId)) return prev.filter(id => id !== repoId)
      if (prev.length >= 3) {
        toast.error('Select up to 3 repositories.')
        return prev
      }
      return [...prev, repoId]
    })
  }

  const buildGeneratedProfile = (selectedRepos: GithubRepo[], readmes: string[]) => {
    const languages = [...new Set(selectedRepos.map(repo => repo.language).filter(Boolean) as string[])]
    const repoContext = selectedRepos
      .map(repo => `${repo.name} ${repo.description || ''} ${repo.language || ''}`)
      .join(' ')

    const combinedText = `${repoContext} ${readmes.join(' ')}`
    const keywords = extractKeywords(combinedText, 16).map(normalizeSkill)

    const skills = [...new Set([...
      languages.map(normalizeSkill),
      ...keywords,
    ])].slice(0, 12)

    const headlineSkills = skills.slice(0, 3).join(', ')
    const headline = headlineSkills
      ? `Project-driven developer focused on ${headlineSkills}`
      : 'Project-driven software developer'

    const repoNames = selectedRepos.map(repo => repo.name).join(', ')
    const summary = `Built and maintained ${selectedRepos.length} selected repositories (${repoNames}). Core strengths include ${skills.slice(0, 6).join(', ') || 'software development'}, based on README and repository metadata analysis.`

    const highlights = selectedRepos.map((repo, index) => {
      const repoKeywords = extractKeywords(`${repo.description || ''} ${readmes[index] || ''}`, 4).map(normalizeSkill)
      const focus = repoKeywords.length ? repoKeywords.join(', ') : (repo.language || 'general software engineering')
      return `${repo.name}: ${repo.description || 'Implemented and maintained this project.'} Focus areas: ${focus}.`
    })

    return { headline, summary, skills, highlights }
  }

  const handleGenerateProfile = async () => {
    if (selectedRepoIds.length < 2) {
      toast.error('Select at least 2 repositories.')
      return
    }

    const selectedRepos = repos.filter(repo => selectedRepoIds.includes(repo.id))
    if (!selectedRepos.length) return

    setGenerating(true)
    try {
      const readmes = await Promise.all(
        selectedRepos.map(async repo => {
          try {
            const response = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`, {
              headers: { Accept: 'application/vnd.github.raw+json' },
            })

            if (!response.ok) return ''
            return await response.text()
          } catch {
            return ''
          }
        }),
      )

      const result = buildGeneratedProfile(selectedRepos, readmes)
      setGeneratedProfile(result)
      toast.success('Profile generated from selected repositories.')
    } catch (error) {
      console.error(error)
      toast.error('Failed to generate profile.')
    } finally {
      setGenerating(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <Toaster />
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex items-center gap-3 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading profile...
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <Toaster />
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Profile From GitHub</h1>
          <p className="text-gray-500">Please sign in to view repositories and generate your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Toaster />

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Auto Profile Builder</h1>
        <p className="text-gray-500">Select 2-3 GitHub repositories, then generate a profile summary from their README keywords.</p>
      </div>

      {!githubUsername && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-5 mb-6">
          GitHub account not found on this Clerk user. Connect GitHub in Clerk to use this feature.
        </div>
      )}

      {githubUsername && (
        <>
          <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <div className="flex items-center gap-3 text-gray-700">
              <Github className="w-5 h-5" />
              <div>
                <p className="font-semibold">{githubUsername}</p>
                <p className="text-sm text-gray-500">Public repositories: {repos.length}</p>
              </div>
            </div>

            <Button
              onClick={handleGenerateProfile}
              disabled={generating || selectedRepoIds.length < 2}
              className="gradient-violet text-white border-0 rounded-xl gap-2"
            >
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate Profile
            </Button>
          </div>

          {loadingRepos ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex items-center gap-3 text-gray-600">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading repositories...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
              {repos.map(repo => {
                const selected = selectedRepoIds.includes(repo.id)
                const limitReached = selectedRepoIds.length >= 3 && !selected

                return (
                  <button
                    key={repo.id}
                    onClick={() => toggleRepo(repo.id)}
                    disabled={limitReached}
                    className={`text-left bg-white rounded-2xl border p-4 shadow-sm transition-all ${selected ? 'border-violet-400 ring-2 ring-violet-200' : 'border-gray-100 hover:border-violet-200'} ${limitReached ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 truncate">{repo.name}</h3>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="text-gray-400 hover:text-gray-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 min-h-[2.5rem]">{repo.description || 'No description available.'}</p>

                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                      <span>{repo.language || 'Unknown language'}</span>
                      <span>Updated {formatDate(repo.updated_at)}</span>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Badge className="bg-gray-100 text-gray-700 border-0">Stars {repo.stargazers_count}</Badge>
                      <Badge className="bg-gray-100 text-gray-700 border-0">Forks {repo.forks_count}</Badge>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {generatedProfile && (
            <div className="bg-white rounded-2xl border border-violet-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Generated Profile</h2>
              <p className="text-violet-700 font-medium mb-4">{generatedProfile.headline}</p>

              <p className="text-gray-700 mb-5">{generatedProfile.summary}</p>

              <div className="mb-5">
                <p className="text-sm font-semibold text-gray-900 mb-2">Skills from selected repositories</p>
                <div className="flex flex-wrap gap-2">
                  {generatedProfile.skills.map(skill => (
                    <Badge key={skill} className="bg-violet-50 text-violet-700 border-violet-100">{skill}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">Project-based highlights</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  {generatedProfile.highlights.map(item => (
                    <li key={item} className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
