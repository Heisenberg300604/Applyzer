import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useUser as useClerkUser } from '@clerk/react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import {
  ExternalLink, LucideGithub, Loader2, Plus, Trash2,
  User, Briefcase, GraduationCap, Code2, Star,
  Sparkles, RefreshCw, CheckCircle2,
  FileText, Upload, X, ChevronRight,
} from 'lucide-react'
import { summarizeRepoWithGemini } from '@/lib/gemini'
import {
  upsertProjects,
  getProfileFromSupabase,
  saveProfileToSupabase,
  getProjectsFromSupabase,
  toggleProjectFeaturedInSupabase,
  type StoredProject,
  type ProfileSkillCategory,
  type ProfileEducationItem,
  type ProfileExperienceItem,
} from '@/lib/supabase'

// ── Skill presets ─────────────────────────────────────────────────────────────

const SKILL_PRESETS: { category: string; items: string[] }[] = [
  {
    category: 'Languages',
    items: [
      'Python', 'JavaScript', 'TypeScript', 'Java', 'C', 'C++', 'C#', 'Go',
      'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'Dart',
      'Lua', 'Perl', 'Haskell', 'Elixir', 'Erlang', 'Clojure', 'F#',
      'MATLAB', 'Julia', 'Groovy', 'Shell', 'Bash', 'PowerShell',
      'Objective-C', 'Assembly', 'COBOL', 'Fortran', 'Prolog', 'Lisp',
      'Racket', 'Nim', 'Crystal', 'Zig', 'V', 'Solidity', 'Move',
    ],
  },
  {
    category: 'Web / Frontend',
    items: [
      'React', 'Next.js', 'Vue', 'Nuxt.js', 'Angular', 'Svelte', 'SvelteKit',
      'HTML', 'CSS', 'Tailwind CSS', 'SASS', 'Redux', 'Zustand', 'GraphQL',
      'Webpack', 'Vite', 'Astro', 'Remix', 'Gatsby', 'HTMX',
    ],
  },
  {
    category: 'Backend / APIs',
    items: [
      'Node.js', 'Express', 'FastAPI', 'Django', 'Flask', 'Spring Boot',
      'NestJS', 'Gin', 'Echo', 'Actix', 'Rails', 'Laravel', 'Phoenix',
      'gRPC', 'REST', 'GraphQL', 'tRPC', 'WebSockets',
    ],
  },
  {
    category: 'Databases',
    items: [
      'PostgreSQL', 'MySQL', 'SQLite', 'MongoDB', 'Redis', 'Cassandra',
      'DynamoDB', 'Supabase', 'Firebase', 'Elasticsearch', 'InfluxDB',
      'Neo4j', 'CockroachDB', 'PlanetScale', 'Turso', 'Neon',
    ],
  },
  {
    category: 'DevOps / Cloud',
    items: [
      'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Terraform', 'Ansible',
      'CI/CD', 'GitHub Actions', 'Jenkins', 'Nginx', 'Linux', 'Helm',
      'Pulumi', 'Vercel', 'Render', 'Railway', 'Cloudflare Workers',
    ],
  },
  {
    category: 'AI / ML',
    items: [
      'PyTorch', 'TensorFlow', 'scikit-learn', 'Keras', 'Hugging Face',
      'LangChain', 'OpenAI API', 'Gemini API', 'Pandas', 'NumPy',
      'Matplotlib', 'ONNX', 'CUDA', 'JAX', 'Llamaindex',
    ],
  },
]

// ── Education presets ─────────────────────────────────────────────────────────

const DEGREE_PRESETS = [
  // School
  'High School (Class X / 10th)', 'Senior Secondary (Class XII / 12th)',
  'CBSE Class X', 'CBSE Class XII', 'ICSE Class X', 'ISC Class XII',
  'O Level', 'A Level', 'International Baccalaureate (IB)',
  // Undergraduate
  'B.Tech Computer Science', 'B.Tech Information Technology', 'B.Tech Electronics & Communication',
  'B.Tech Electrical Engineering', 'B.Tech Mechanical Engineering', 'B.Tech Civil Engineering',
  'B.E. Computer Science', 'B.E. Information Science', 'B.Sc Computer Science',
  'B.Sc Mathematics', 'B.Sc Physics', 'B.Sc Statistics', 'B.Sc Data Science',
  'B.A. Computer Science', 'B.A. Economics', 'B.B.A.', 'B.Com',
  'M.Tech Computer Science', 'M.Tech Artificial Intelligence', 'M.Tech Data Science',
  'M.Tech Software Engineering', 'M.Tech Information Security', 'M.Tech VLSI',
  'M.Sc Computer Science', 'M.Sc Data Science', 'M.Sc Mathematics', 'M.Sc Statistics',
  'M.S. Computer Science', 'M.S. Electrical Engineering', 'M.S. Data Science',
  'M.B.A.', 'M.B.A. (Finance)', 'M.B.A. (Marketing)', 'M.B.A. (Technology Management)',
  'Ph.D. Computer Science', 'Ph.D. Machine Learning', 'Ph.D. Electrical Engineering',
  'Ph.D. Mathematics', 'Diploma in Computer Science', 'Diploma in IT',
  'Associate Degree in Computer Science', 'High School Diploma',
]

const INSTITUTION_PRESETS = [
  // IITs
  'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
  'IIT Roorkee', 'IIT Guwahati', 'IIT Hyderabad', 'IIT BHU', 'IIT Jodhpur',
  'IIT Tirupati', 'IIT Patna', 'IIT Gandhinagar', 'IIT Indore', 'IIT Mandi',
  // NITs
  'NIT Trichy', 'NIT Surathkal', 'NIT Warangal', 'NIT Calicut', 'NIT Rourkela',
  'NIT Allahabad', 'NIT Jaipur', 'NIT Surat', 'NIT Durgapur', 'NIT Silchar',
  // IIITs
  'IIIT Hyderabad', 'IIIT Allahabad', 'IIIT Bangalore', 'IIIT Delhi', 'IIIT Pune',
  // Central & deemed
  'BITS Pilani', 'BITS Goa', 'BITS Hyderabad',
  'Delhi University', 'Jadavpur University', 'Anna University',
  'VIT Vellore', 'VIT Chennai', 'Manipal Institute of Technology',
  'SRM Institute of Science and Technology', 'Amity University',
  'Thapar University', 'PSG College of Technology', 'Coimbatore Institute of Technology',
  'College of Engineering Pune', 'VJTI Mumbai', 'ICT Mumbai',
  // Global
  'MIT', 'Stanford University', 'Carnegie Mellon University', 'UC Berkeley',
  'University of Michigan', 'Georgia Tech', 'University of Illinois Urbana-Champaign',
  'Cornell University', 'Princeton University', 'Harvard University',
  'Columbia University', 'UCLA', 'University of Washington',
  'University of Toronto', 'University of British Columbia',
  'ETH Zurich', 'Imperial College London', 'University of Cambridge',
  'University of Oxford', 'Technical University of Munich',
  'National University of Singapore', 'Nanyang Technological University',
  // — merged with SCHOOL_PRESETS at runtime via INSTITUTION_ALL
]

const YEAR_PRESETS = ['Present', ...Array.from({ length: 14 }, (_, i) => String(new Date().getFullYear() + 2 - i))]

const SCHOOL_PRESETS = [
  // Top CBSE chains
  'Delhi Public School', 'DPS R.K. Puram', 'DPS Vasant Kunj', 'DPS Noida',
  'DPS Bangalore', 'DPS Hyderabad', 'DPS Bokaro', 'DPS Dwarka',
  'Kendriya Vidyalaya', 'Kendriya Vidyalaya (NVS)',
  'Jawahar Navodaya Vidyalaya',
  // DAV
  'DAV Public School', 'DAV Model School',
  // Ryan, St., etc.
  'Ryan International School', 'Ryan International (Noida)',
  "St. Xavier's School", "St. Mary's School", "St. Joseph's School",
  "St. Thomas School", "St. Ann's School",
  'Amity International School', 'Amity International (Noida)',
  'The Shri Ram School', 'Springdales School',
  'Modern School Barakhamba', 'Modern School Vasant Vihar',
  'Sanskriti School', 'Vasant Valley School',
  'Bal Bharati Public School', 'Bluebells School International',
  'G.D. Goenka Public School', 'Army Public School',
  'Frank Anthony Public School', 'Bishop Cotton School',
  'La Martiniere College', 'Mayo College', 'The Doon School',
  'Welham Boys School', "Welham Girls' School",
  'Scindia School', 'Lawrence School Sanawar',
  'Rishi Valley School', 'Dhirubhai Ambani International School',
  'Cathedral and John Connon School',
  'Bombay Scottish School', 'Campion School Mumbai',
  'Don Bosco School', "Don Bosco High School",
  'Lakshmipat Singhania Academy',
  'The Heritage School Kolkata',
  'Birla High School', 'South Point High School',
  'P.S. Senior Secondary School',
  'Sishya School', 'Padma Seshadri Bala Bhavan',
  'Vidya Mandir Senior Secondary School',
  'Chinmaya Vidyalaya', 'Sardar Patel Vidyalaya',
]

const INSTITUTION_ALL = [...INSTITUTION_PRESETS.filter(s => !s.includes('merged')), ...SCHOOL_PRESETS]

// ── Experience presets ────────────────────────────────────────────────────────

const ROLE_PRESETS = [
  'Software Engineer', 'Senior Software Engineer', 'Staff Software Engineer',
  'Principal Software Engineer', 'Software Developer', 'Senior Software Developer',
  'SDE I', 'SDE II', 'SDE III', 'Lead Engineer', 'Engineering Manager',
  'Frontend Engineer', 'Backend Engineer', 'Full Stack Engineer',
  'Mobile Engineer', 'iOS Engineer', 'Android Engineer',
  'DevOps Engineer', 'Site Reliability Engineer (SRE)', 'Platform Engineer',
  'Cloud Engineer', 'Infrastructure Engineer', 'Security Engineer',
  'ML Engineer', 'AI Engineer', 'Data Scientist', 'Data Engineer',
  'Data Analyst', 'Research Engineer', 'Applied Scientist',
  'Product Manager', 'Technical Program Manager', 'Engineering Lead',
  'Solutions Architect', 'Technical Architect', 'Systems Engineer',
  'QA Engineer', 'Automation Engineer', 'Test Engineer',
  'Software Engineering Intern', 'SDE Intern', 'Research Intern',
  'Teaching Assistant', 'Open Source Contributor',
]

const LOCATION_PRESETS = [
  'Remote', 'Hybrid', 'On-site',
  'Bangalore, India', 'Hyderabad, India', 'Mumbai, India', 'Pune, India',
  'Chennai, India', 'Delhi, India', 'Noida, India', 'Gurgaon, India',
  'Kolkata, India', 'Ahmedabad, India', 'Kochi, India',
  'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX',
  'Boston, MA', 'Chicago, IL', 'Los Angeles, CA', 'Denver, CO',
  'London, UK', 'Berlin, Germany', 'Amsterdam, Netherlands',
  'Singapore', 'Toronto, Canada', 'Vancouver, Canada',
]

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

// ── Types ─────────────────────────────────────────────────────────────────────

type LucideGithubRepo = {
  id: number
  name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  owner: { login: string }
  topics?: string[]
}

type BasicInfo = {
  full_name: string
  email: string
  phone: string
  location: string
  linkedin_url: string
  github_url: string
  github_username: string
  professional_summary: string
  experience_years: string
}

type SkillRow = { id: string; category: string; items: string }
type EduRow = { id: string; degree: string; institution: string; start_year: string; end_year: string; coursework: string }
type ExpRow = { id: string; role: string; company: string; location: string; start_month: string; start_year_exp: string; end_month: string; end_year_exp: string; achievements: string }

type ParsedResumeData = {
  professional_summary?: string
  skills?: { category: string; items: string[] }[]
  education?: { degree: string; institution: string; year: string; coursework?: string }[]
  experiences?: { role: string; company: string; location: string; duration: string; achievements: string[] }[]
  projects?: { title: string; description: string; technologies: string[]; achievements: string[]; skills_demonstrated: string[]; project_url: string }[]
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const uid = () => crypto.randomUUID()
const formatDate = (v: string) =>
  new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

const blankSkill = (): SkillRow => ({ id: uid(), category: '', items: '' })
const blankEdu = (): EduRow => ({ id: uid(), degree: '', institution: '', start_year: '', end_year: '', coursework: '' })
const blankExp = (): ExpRow => ({ id: uid(), role: '', company: '', location: '', start_month: '', start_year_exp: '', end_month: '', end_year_exp: '', achievements: '' })

const skillsToDb = (rows: SkillRow[]): ProfileSkillCategory[] =>
  rows
    .filter(r => r.category.trim() && r.items.trim())
    .map(r => ({
      category: r.category.trim(),
      items: r.items.split(',').map(s => s.trim()).filter(Boolean),
    }))

const eduToDb = (rows: EduRow[]): ProfileEducationItem[] =>
  rows
    .filter(r => r.degree.trim() && r.institution.trim())
    .map(r => {
      const start = r.start_year.trim()
      const end = r.end_year.trim()
      const year = start && end ? `${start} – ${end}` : start || end || ''
      return {
        degree: r.degree.trim(),
        institution: r.institution.trim(),
        year,
        start_year: start || undefined,
        end_year: end || undefined,
        coursework: r.coursework.trim() || undefined,
      }
    })

const expToDb = (rows: ExpRow[]): ProfileExperienceItem[] =>
  rows
    .filter(r => r.role.trim() && r.company.trim())
    .map(r => {
      const start = [r.start_month, r.start_year_exp].filter(Boolean).join(' ')
      const end = [r.end_month, r.end_year_exp].filter(Boolean).join(' ')
      const duration = start && end ? `${start} – ${end}` : start || end || ''
      return {
        role: r.role.trim(),
        company: r.company.trim(),
        location: r.location.trim(),
        duration,
        achievements: r.achievements.split('\n').map(s => s.trim()).filter(Boolean),
      }
    })

const skillsFromDb = (data: ProfileSkillCategory[]): SkillRow[] =>
  data.length ? data.map(s => ({ id: uid(), category: s.category, items: s.items.join(', ') })) : [blankSkill()]

const eduFromDb = (data: ProfileEducationItem[]): EduRow[] =>
  data.length
    ? data.map(e => {
        // Backward-compat: if no start/end_year, try to parse from year string
        let start = e.start_year ?? ''
        let end = e.end_year ?? ''
        if (!start && !end && e.year) {
          const parts = e.year.split(/\s*[–\-]\s*/)
          start = parts[0]?.trim() ?? ''
          end = parts[1]?.trim() ?? ''
        }
        return { id: uid(), degree: e.degree, institution: e.institution, start_year: start, end_year: end, coursework: e.coursework ?? '' }
      })
    : [blankEdu()]

const expFromDb = (data: ProfileExperienceItem[]): ExpRow[] =>
  data.length
    ? data.map(e => {
        let start_month = '', start_year_exp = '', end_month = '', end_year_exp = ''
        if (e.duration) {
          const parseMonthYear = (s: string) => {
            const t = s.trim().split(/\s+/)
            if (t.length >= 2 && MONTHS.includes(t[0])) return { month: t[0], year: t.slice(1).join(' ') }
            return { month: '', year: s.trim() }
          }
          const parts = e.duration.split(/\s*[–\-]\s*/)
          const s = parseMonthYear(parts[0] ?? '')
          const en = parseMonthYear(parts[1] ?? '')
          start_month = s.month; start_year_exp = s.year
          end_month = en.month; end_year_exp = en.year
        }
        return { id: uid(), role: e.role, company: e.company, location: e.location, start_month, start_year_exp, end_month, end_year_exp, achievements: e.achievements.join('\n') }
      })
    : [blankExp()]

const computeCompleteness = (
  basic: BasicInfo,
  skills: SkillRow[],
  edu: EduRow[],
  exp: ExpRow[],
  projectCount: number,
) => {
  let score = 0
  if (basic.full_name.trim() && basic.email.trim()) score += 20
  if (skills.some(s => s.category.trim() && s.items.trim())) score += 20
  if (edu.some(e => e.degree.trim() && e.institution.trim())) score += 20
  if (exp.some(e => e.role.trim() && e.company.trim())) score += 20
  if (projectCount > 0) score += 20
  return score
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SearchInput({
  value,
  onChange,
  options,
  placeholder,
  className,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const filtered = value.trim()
    ? options.filter(o => o.toLowerCase().includes(value.toLowerCase())).slice(0, 5)
    : options.slice(0, 5)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className={`relative ${className ?? ''}`}>
      <Input
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="rounded-sm"
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-sm shadow-md overflow-hidden">
          {filtered.map(opt => (
            <li
              key={opt}
              onMouseDown={e => { e.preventDefault(); onChange(opt); setOpen(false) }}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                opt === value ? 'bg-orange-50 text-orange-600 font-medium' : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function StyledSelect({ value, onChange, options, placeholder }: {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full border border-input bg-background rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-700"
    >
      <option value="">{placeholder ?? 'Select…'}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function SectionHeader({
  icon: Icon,
  label,
  onAdd,
  addLabel,
}: {
  icon: React.ElementType
  label: string
  onAdd?: () => void
  addLabel?: string
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
        <Icon className="w-3.5 h-3.5 text-orange-500" />
        {label}
      </h2>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1 text-xs font-medium text-orange-500 hover:text-orange-600 transition-colors"
        >
          <Plus className="w-3 h-3" /> {addLabel ?? 'Add'}
        </button>
      )}
    </div>
  )
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-1.5 text-gray-300 hover:text-gray-500 transition-colors rounded-sm"
      title="Remove"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Profile() {
  const { user, isLoaded, isSignedIn } = useClerkUser()

  // ── Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'projects'>('profile')

  // ── Profile form
  const [basic, setBasic] = useState<BasicInfo>({
    full_name: '', email: '', phone: '', location: '',
    linkedin_url: '', github_url: '', github_username: '',
    professional_summary: '', experience_years: '',
  })
  const [skillRows, setSkillRows] = useState<SkillRow[]>([blankSkill()])
  const [presetsOpen, setPresetsOpen] = useState(true)
  const [presetCategory, setPresetCategory] = useState(SKILL_PRESETS[0].category)
  const [presetSkill, setPresetSkill] = useState('')
  const [eduRows, setEduRows] = useState<EduRow[]>([blankEdu()])
  const [expRows, setExpRows] = useState<ExpRow[]>([blankExp()])
  const [profileLoaded, setProfileLoaded] = useState(false)

  // ── Resume parser
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [parsingResume, setParsingResume] = useState(false)
  const [parsedResume, setParsedResume] = useState<ParsedResumeData | null>(null)
  const resumeInputRef = useRef<HTMLInputElement>(null)
  const [savingProfile, setSavingProfile] = useState(false)

  // ── Projects
  const [existingProjects, setExistingProjects] = useState<StoredProject[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // ── GitHub
  const githubAccount = useMemo(() => {
    if (!user) return null
    return (
      user.externalAccounts?.find((account: any) => {
        const provider = String(account.provider || account.providerSlug || '').toLowerCase()
        return provider.includes('github')
      }) ?? null
    )
  }, [user])
  const clerkLucideGithubUsername: string | null = (githubAccount as any)?.username ?? null

  const [repos, setRepos] = useState<LucideGithubRepo[]>([])
  const [loadingRepos, setLoadingRepos] = useState(false)
  const [selectedRepoIds, setSelectedRepoIds] = useState<number[]>([])
  const [syncing, setSyncing] = useState(false)

  const githubHeaders = useMemo<Record<string, string>>(() => {
    const token = (import.meta.env.VITE_GITHUB_TOKEN as string | undefined)?.trim()
    const headers: Record<string, string> = { Accept: 'application/vnd.github+json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    return headers
  }, [])

  // Use saved github_username first, fall back to Clerk OAuth account
  const effectiveLucideGithubUsername = basic.github_username.trim() || clerkLucideGithubUsername

  const activePreset = useMemo(
    () => SKILL_PRESETS.find(p => p.category === presetCategory) ?? SKILL_PRESETS[0],
    [presetCategory],
  )

  const selectedPresetSkills = useMemo(() => {
    const row = skillRows.find(r => r.category.toLowerCase() === presetCategory.toLowerCase())
    return row ? row.items.split(',').map(s => s.trim()).filter(Boolean) : []
  }, [skillRows, presetCategory])

  const addPresetSkill = useCallback((category: string, skill: string) => {
    const nextSkill = skill.trim()
    if (!nextSkill) return

    setSkillRows(prev => {
      const idx = prev.findIndex(r => r.category.toLowerCase() === category.toLowerCase())
      if (idx === -1) {
        return [...prev, { id: uid(), category, items: nextSkill }]
      }

      const row = prev[idx]
      const current = row.items.split(',').map(s => s.trim()).filter(Boolean)
      if (current.some(s => s.toLowerCase() === nextSkill.toLowerCase())) return prev

      const updated = { ...row, items: [...current, nextSkill].join(', ') }
      return prev.map((r, i) => (i === idx ? updated : r))
    })
  }, [])

  const removePresetSkill = useCallback((category: string, skill: string) => {
    setSkillRows(prev => {
      const idx = prev.findIndex(r => r.category.toLowerCase() === category.toLowerCase())
      if (idx === -1) return prev

      const row = prev[idx]
      const next = row.items
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .filter(s => s.toLowerCase() !== skill.toLowerCase())

      if (next.length === 0) {
        return prev.filter((_, i) => i !== idx)
      }

      const updated = { ...row, items: next.join(', ') }
      return prev.map((r, i) => (i === idx ? updated : r))
    })
  }, [])

  // ── Load profile + projects on mount ──────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return

    const load = async () => {
      try {
        const data = await getProfileFromSupabase(user.id)
        if (data) {
          setBasic({
            full_name: data.full_name || user.fullName || '',
            email: data.email || user.primaryEmailAddress?.emailAddress || '',
            phone: data.phone || '',
            location: data.location || '',
            linkedin_url: data.linkedin_url || '',
            github_url: data.github_url || '',
            github_username: data.github_username || clerkLucideGithubUsername || '',
            professional_summary: data.professional_summary || '',
            experience_years: data.experience_years || '',
          })
          setSkillRows(skillsFromDb(data.skills))
          setEduRows(eduFromDb(data.education))
          setExpRows(expFromDb(data.experience))
        } else {
          setBasic(prev => ({
            ...prev,
            full_name: user.fullName || '',
            email: user.primaryEmailAddress?.emailAddress || '',
            github_username: clerkLucideGithubUsername || '',
          }))
        }
      } catch {
        // silently fall back to empty form
      }
      setProfileLoaded(true)

      setLoadingProjects(true)
      try {
        setExistingProjects(await getProjectsFromSupabase(user.id))
      } catch {
        // ignore
      }
      setLoadingProjects(false)
    }

    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  // ── Fetch GitHub repos ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!effectiveLucideGithubUsername) return

    const fetchRepos = async () => {
      setLoadingRepos(true)
      try {
        const response = await fetch(
          `https://api.github.com/users/${encodeURIComponent(effectiveLucideGithubUsername)}/repos?sort=updated&per_page=100`,
          { headers: githubHeaders },
        )
        if (!response.ok) {
          const errJson = (await response.json().catch(() => ({}))) as { message?: string }
          throw new Error(errJson.message ?? `GitHub API ${response.status}`)
        }
        setRepos(await response.json())
      } catch (error) {
        console.error('[Profile] repos fetch failed:', error)
        const msg = error instanceof Error ? error.message : 'Unknown error'
        toast.error('Could not load GitHub repositories.', { description: msg })
      } finally {
        setLoadingRepos(false)
      }
    }

    void fetchRepos()
  }, [effectiveLucideGithubUsername, githubHeaders])

  // ── Resume parser ──────────────────────────────────────────────────────────
  const _rawEnvUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''
  // Strip trailing slashes; prepend http:// if no protocol present
  const apiBaseNorm = _rawEnvUrl.replace(/\/+$/, '').replace(/^(?!https?:\/\/)(.+)/, 'http://$1')

  const handleParseResume = useCallback(async () => {
    if (!resumeFile) return
    setParsingResume(true)

    const endpoint = `${apiBaseNorm}/api/v1/profile/parse-resume`

    console.group('%c🔍 Resume Parser — Debug', 'color: #f97316; font-weight: bold')
    console.log('%c📦 ENV  VITE_API_BASE_URL (raw):', 'color: #6b7280', _rawEnvUrl || '(empty — check .env!)')
    console.log('%c🌐 API base (normalized):', 'color: #6b7280', apiBaseNorm || '(empty!)')
    console.log('%c🎯 Full endpoint URL:', 'color: #3b82f6', endpoint)
    console.log('%c📄 File name:', 'color: #6b7280', resumeFile.name)
    console.log('%c📏 File size:', 'color: #6b7280', `${(resumeFile.size / 1024).toFixed(1)} KB`)
    console.log('%c🗂️  File MIME type:', 'color: #6b7280', resumeFile.type || 'application/pdf (assumed)')

    try {
      const form = new FormData()
      form.append('file', resumeFile)
      console.log('%c📤 Sending POST multipart/form-data…', 'color: #8b5cf6')
      toast.loading('Sending resume to server…', { id: 'resume-parse' })

      let res: Response
      try {
        res = await fetch(endpoint, { method: 'POST', body: form })
      } catch (networkErr) {
        console.error('%c🔌 Network/CORS error (fetch threw):', 'color: red', networkErr)
        console.error('Check: is the backend running? Is CORS configured for this origin?')
        console.groupEnd()
        toast.error('Network error — cannot reach backend. Check console.', { id: 'resume-parse' })
        return
      }

      console.log('%c📥 Response status:', 'color: #6b7280', res.status, res.statusText)
      console.log('%c📋 Response headers:', 'color: #6b7280')
      res.headers.forEach((v, k) => console.log(`   ${k}: ${v}`))

      const rawText = await res.text()
      console.log('%c📝 Raw response body:', 'color: #6b7280', rawText.slice(0, 2000))

      if (!res.ok) {
        console.error('%c❌ Non-OK response:', 'color: red', res.status, rawText)
        console.groupEnd()
        toast.error(`Server error ${res.status} — ${rawText.slice(0, 120)}`, { id: 'resume-parse' })
        throw new Error(`Parse failed (${res.status}): ${rawText}`)
      }

      let json: { success: boolean; parsed_data: ParsedResumeData }
      try {
        json = JSON.parse(rawText)
      } catch (jsonErr) {
        console.error('%c❌ JSON parse error:', 'color: red', jsonErr)
        console.error('Raw text:', rawText)
        console.groupEnd()
        toast.error('Server returned non-JSON. Check console.', { id: 'resume-parse' })
        throw new Error('Invalid JSON from server')
      }

      const d = json.parsed_data
      console.log('%c✅ Parsed JSON:', 'color: #10b981', json)
      console.log('%c📊 Extraction summary:', 'color: #10b981')
      console.log('   professional_summary:', d?.professional_summary ? '✓' : '✗ (missing)')
      console.log('   skills categories:   ', d?.skills?.length ?? 0)
      console.log('   education entries:   ', d?.education?.length ?? 0)
      console.log('   experience entries:  ', d?.experiences?.length ?? 0)
      console.log('   projects:            ', d?.projects?.length ?? 0)
      console.groupEnd()

      const skillCount = d?.skills?.length ?? 0
      const expCount = d?.experiences?.length ?? 0
      toast.success(
        `Parsed! ${expCount} role${expCount !== 1 ? 's' : ''}, ${skillCount} skill categor${skillCount !== 1 ? 'ies' : 'y'} found.`,
        { id: 'resume-parse' }
      )
      setParsedResume(d)

    } catch (e: unknown) {
      if (!((e as Error)?.message?.includes('Parse failed') || (e as Error)?.message?.includes('Invalid JSON'))) {
        console.error('%c💥 Unhandled error:', 'color: red', e)
        console.groupEnd()
        toast.error(e instanceof Error ? e.message : 'Resume parsing failed.', { id: 'resume-parse' })
      }
    } finally {
      setParsingResume(false)
    }
  }, [resumeFile, apiBaseNorm, _rawEnvUrl])

  const applyParsedResume = useCallback(() => {
    if (!parsedResume) return
    if (parsedResume.professional_summary) {
      setBasic(p => ({ ...p, professional_summary: parsedResume.professional_summary! }))
    }
    if (parsedResume.skills?.length) {
      setSkillRows(parsedResume.skills.map(s => ({ id: uid(), category: s.category, items: s.items.join(', ') })))
    }
    if (parsedResume.education?.length) {
      setEduRows(parsedResume.education.map(e => {
        const parts = e.year.split(/\s*[–\-]\s*/)
        return { id: uid(), degree: e.degree, institution: e.institution, start_year: parts[0]?.trim() ?? '', end_year: parts[1]?.trim() ?? e.year, coursework: e.coursework ?? '' }
      }))
    }
    if (parsedResume.experiences?.length) {
      setExpRows(parsedResume.experiences.map(e => {
        const parseMonthYear = (s: string) => {
          const t = s.trim().split(/\s+/)
          if (t.length >= 2 && MONTHS.includes(t[0])) return { month: t[0], year: t.slice(1).join(' ') }
          return { month: '', year: s.trim() }
        }
        const parts = e.duration.split(/\s*[–\-]\s*/)
        const from = parseMonthYear(parts[0] ?? '')
        const to = parseMonthYear(parts[1] ?? '')
        return { id: uid(), role: e.role, company: e.company, location: e.location, start_month: from.month, start_year_exp: from.year, end_month: to.month, end_year_exp: to.year, achievements: e.achievements.join('\n') }
      }))
    }
    setParsedResume(null)
    setResumeFile(null)
    if (resumeInputRef.current) resumeInputRef.current.value = ''
    toast.success('Resume data applied! Review and save.')
  }, [parsedResume])

  // ── Save profile ───────────────────────────────────────────────────────────
  const handleSaveProfile = useCallback(async () => {
    if (!user?.id) return
    if (!basic.full_name.trim() || !basic.email.trim()) {
      toast.error('Full name and email are required.')
      return
    }
    setSavingProfile(true)
    try {
      await saveProfileToSupabase(user.id, {
        full_name: basic.full_name.trim(),
        email: basic.email.trim(),
        phone: basic.phone.trim() || null,
        location: basic.location.trim() || null,
        linkedin_url: basic.linkedin_url.trim() || null,
        github_url: basic.github_url.trim() || null,
        github_username: basic.github_username.trim() || null,
        professional_summary: basic.professional_summary.trim() || null,
        experience_years: basic.experience_years.trim() || null,
        skills: skillsToDb(skillRows),
        education: eduToDb(eduRows),
        experience: expToDb(expRows),
      })
      toast.success('Profile saved successfully.')
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error'
      toast.error('Failed to save profile.', { description: msg.slice(0, 200) })
    } finally {
      setSavingProfile(false)
    }
  }, [user?.id, basic, skillRows, eduRows, expRows])

  // ── Toggle project featured ────────────────────────────────────────────────
  const handleToggleFeatured = useCallback(async (project: StoredProject) => {
    setTogglingId(project.id)
    const next = !project.is_featured
    try {
      await toggleProjectFeaturedInSupabase(project.id, next)
      setExistingProjects(prev => prev.map(p => p.id === project.id ? { ...p, is_featured: next } : p))
      toast.success(next ? 'Project featured on resume.' : 'Project hidden from resume.')
    } catch {
      toast.error('Could not update project.')
    } finally {
      setTogglingId(null)
    }
  }, [])

  // ── Toggle repo selection ──────────────────────────────────────────────────
  const toggleRepo = useCallback((repoId: number) => {
    setSelectedRepoIds(prev => {
      if (prev.includes(repoId)) return prev.filter(id => id !== repoId)
      if (prev.length >= 5) { toast.error('Select up to 5 repositories.'); return prev }
      return [...prev, repoId]
    })
  }, [])

  // ── Sync repos via Gemini → Supabase ──────────────────────────────────────
  const handleSyncProjects = useCallback(async () => {
    if (!user?.id || selectedRepoIds.length < 1) return

    const selectedRepos = repos.filter(r => selectedRepoIds.includes(r.id))
    setSyncing(true)
    try {
      const repoDetails = await Promise.all(
        selectedRepos.map(async repo => {
          try {
            const [readmeRes, repoRes] = await Promise.all([
              fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`, {
                headers: { ...githubHeaders, Accept: 'application/vnd.github.raw+json' },
              }),
              fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}`, { headers: githubHeaders }),
            ])
            const readme = readmeRes.ok ? await readmeRes.text() : ''
            const repoJson = repoRes.ok ? await repoRes.json() : null
            return { repo, readme, topics: Array.isArray(repoJson?.topics) ? (repoJson.topics as string[]) : [] }
          } catch {
            return { repo, readme: '', topics: [] as string[] }
          }
        }),
      )

      const llmSummaries = await Promise.all(
        repoDetails.map(item =>
          summarizeRepoWithGemini({
            name: item.repo.name,
            url: item.repo.html_url,
            primaryLanguage: item.repo.language,
            githubDescription: item.repo.description,
            topics: item.topics,
            readmeRaw: item.readme,
          }),
        ),
      )

      const now = new Date().toISOString()
      await upsertProjects(
        repoDetails.map((item, i) => ({
          id: uid(),
          profile_id: user.id,
          github_repo_name: item.repo.name,
          github_repo_url: item.repo.html_url,
          primary_language: item.repo.language,
          github_topics: item.topics,
          github_stars: item.repo.stargazers_count,
          github_updated_at: item.repo.updated_at,
          title: llmSummaries[i].title,
          description: llmSummaries[i].description,
          tech_stack: llmSummaries[i].tech_stack,
          features: llmSummaries[i].features,
          resume_bullets: llmSummaries[i].resume_bullets,
          category: llmSummaries[i].category,
          skills_demonstrated: llmSummaries[i].skills_demonstrated,
          is_featured: true,
          last_synced_at: now,
          llm_processed_at: now,
          readme_raw: item.readme || null,
        })),
      )

      const fresh = await getProjectsFromSupabase(user.id)
      setExistingProjects(fresh)
      setSelectedRepoIds([])
      toast.success(`${selectedRepos.length} project${selectedRepos.length > 1 ? 's' : ''} synced.`)
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error'
      toast.error('Sync failed.', { description: msg.slice(0, 200) })
    } finally {
      setSyncing(false)
    }
  }, [user?.id, repos, selectedRepoIds, githubHeaders])

  // ── Completeness score ─────────────────────────────────────────────────────
  const completeness = computeCompleteness(basic, skillRows, eduRows, expRows, existingProjects.length)

  // ── Guards ─────────────────────────────────────────────────────────────────
  if (!isLoaded) {
    return (
      <div className="p-8">
        <Toaster />
        <div className="bg-white border border-gray-200 p-8 flex items-center gap-3 text-gray-600 rounded-sm shadow-sm">
          <Loader2 className="w-5 h-5 animate-spin text-orange-500" /> Loading profile...
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="p-8">
        <Toaster />
        <div className="bg-white border border-gray-200 p-8 rounded-sm shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">My Profile</h1>
          <p className="text-sm text-gray-500">Please sign in to set up your profile.</p>
        </div>
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-8">
      <Toaster />

      {/* Page header + completeness */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">My Profile</h1>
            <p className="text-sm text-gray-500">
              Build your professional profile. Completeness powers better resume matching.
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-3xl font-black text-orange-500">{completeness}%</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Complete</p>
          </div>
        </div>
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-500 transition-all duration-500"
            style={{ width: `${completeness}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          {['Basic Info', 'Skills', 'Education', 'Experience', 'Projects'].map((label, i) => (
            <span
              key={label}
              className={`text-xs ${(i + 1) * 20 <= completeness ? 'text-orange-500 font-medium' : 'text-gray-400'}`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gray-200 mb-6">
        {(['profile', 'projects'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab === 'profile'
              ? 'Profile Info'
              : `Projects${existingProjects.length ? ` (${existingProjects.length})` : ''}`}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ───────────────────────────────────────────────────── */}
      {activeTab === 'profile' && (
        <div className="space-y-6">

          {/* Resume Parser */}
          <div className="bg-white border border-orange-200 rounded-sm shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-3.5 h-3.5 text-orange-500" />
              <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Quick-fill from Resume</h2>
              <span className="ml-auto text-xs text-gray-400">PDF only · max 5 MB</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex-1 flex items-center gap-2 border border-dashed border-gray-300 rounded-sm px-4 py-2.5 cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-colors">
                <Upload className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="text-sm text-gray-500 truncate">
                  {resumeFile ? resumeFile.name : 'Click to choose your resume PDF…'}
                </span>
                <input
                  ref={resumeInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={e => setResumeFile(e.target.files?.[0] ?? null)}
                />
              </label>
              <InteractiveHoverButton
                onClick={handleParseResume}
                disabled={!resumeFile || parsingResume}
                className="rounded-none gap-2 py-2.5 px-5 text-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                {parsingResume ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Parsing…</> : <><Sparkles className="w-3.5 h-3.5" /> Parse Resume</>}
              </InteractiveHoverButton>
            </div>
          </div>

          {/* Parsed Resume Preview Overlay */}
          {parsedResume && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-end" onClick={() => setParsedResume(null)}>
              <div
                className="w-full max-w-xl h-full bg-white shadow-2xl flex flex-col overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-500" />
                    <span className="font-semibold text-gray-800 text-sm">Parsed Resume Preview</span>
                  </div>
                  <button onClick={() => setParsedResume(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 text-sm">

                  {parsedResume.professional_summary && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Summary</p>
                      <p className="text-gray-700 text-sm leading-relaxed">{parsedResume.professional_summary}</p>
                    </div>
                  )}

                  {parsedResume.skills?.length ? (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Skills</p>
                      <div className="space-y-2">
                        {parsedResume.skills.map(s => (
                          <div key={s.category}>
                            <span className="text-xs font-medium text-gray-500">{s.category}: </span>
                            <span className="text-xs text-gray-700">{s.items.join(', ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {parsedResume.education?.length ? (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Education</p>
                      <div className="space-y-2">
                        {parsedResume.education.map((e, i) => (
                          <div key={i} className="border-l-2 border-orange-200 pl-3">
                            <p className="font-medium text-gray-800 text-xs">{e.degree}</p>
                            <p className="text-gray-500 text-xs">{e.institution} · {e.year}</p>
                            {e.coursework && <p className="text-gray-400 text-xs mt-0.5">{e.coursework}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {parsedResume.experiences?.length ? (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Experience</p>
                      <div className="space-y-3">
                        {parsedResume.experiences.map((e, i) => (
                          <div key={i} className="border-l-2 border-orange-200 pl-3">
                            <p className="font-medium text-gray-800 text-xs">{e.role} · <span className="font-normal text-gray-600">{e.company}</span></p>
                            <p className="text-gray-400 text-xs">{e.duration}{e.location ? ` · ${e.location}` : ''}</p>
                            <ul className="mt-1 space-y-0.5">
                              {e.achievements.map((a, j) => (
                                <li key={j} className="text-gray-600 text-xs flex gap-1.5">
                                  <ChevronRight className="w-3 h-3 text-orange-400 shrink-0 mt-0.5" />{a}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {parsedResume.projects?.length ? (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Projects <span className="normal-case font-normal text-gray-400">(info only — sync from GitHub tab)</span></p>
                      <div className="space-y-2">
                        {parsedResume.projects.map((p, i) => (
                          <div key={i} className="border-l-2 border-gray-200 pl-3">
                            <p className="font-medium text-gray-800 text-xs">{p.title}</p>
                            <p className="text-gray-500 text-xs">{p.description}</p>
                            {p.technologies?.length ? <p className="text-xs text-orange-500 mt-0.5">{p.technologies.join(', ')}</p> : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex gap-3 shrink-0">
                  <InteractiveHoverButton
                    onClick={applyParsedResume}
                    className="flex-1 rounded-none gap-2 py-2.5 text-sm justify-center"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Apply to Profile
                  </InteractiveHoverButton>
                  <button
                    onClick={() => setParsedResume(null)}
                    className="px-4 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors"
                  >
                    Discard
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
            <SectionHeader icon={User} label="Basic Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Full Name <span className="text-orange-500">*</span>
                </label>
                <Input
                  value={basic.full_name}
                  onChange={e => setBasic(p => ({ ...p, full_name: e.target.value }))}
                  placeholder="Jane Doe"
                  className="rounded-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Email <span className="text-orange-500">*</span>
                </label>
                <Input
                  value={basic.email}
                  onChange={e => setBasic(p => ({ ...p, email: e.target.value }))}
                  placeholder="jane@example.com"
                  type="email"
                  className="rounded-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone</label>
                <Input
                  value={basic.phone}
                  onChange={e => setBasic(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+1 555 123 4567"
                  className="rounded-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Location</label>
                <Input
                  value={basic.location}
                  onChange={e => setBasic(p => ({ ...p, location: e.target.value }))}
                  placeholder="San Francisco, CA"
                  className="rounded-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">LinkedIn URL</label>
                <Input
                  value={basic.linkedin_url}
                  onChange={e => setBasic(p => ({ ...p, linkedin_url: e.target.value }))}
                  placeholder="https://linkedin.com/in/janedoe"
                  className="rounded-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">GitHub Username</label>
                <Input
                  value={basic.github_username}
                  onChange={e => setBasic(p => ({ ...p, github_username: e.target.value }))}
                  placeholder="janedoe"
                  className="rounded-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Years of Experience</label>
                <select
                  value={basic.experience_years}
                  onChange={e => setBasic(p => ({ ...p, experience_years: e.target.value }))}
                  className="w-full h-9 border border-input bg-background rounded-sm px-3 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="">Select...</option>
                  {['0-1', '1-2', '2-3', '3-5', '5-7', '7-10', '10+'].map(v => (
                    <option key={v} value={v}>{v} years</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Professional Summary</label>
                <textarea
                  value={basic.professional_summary}
                  onChange={e => setBasic(p => ({ ...p, professional_summary: e.target.value }))}
                  placeholder="A brief 2-3 sentence summary of your professional background and goals..."
                  rows={3}
                  className="w-full border border-input bg-background rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
            <SectionHeader
              icon={Code2}
              label="Skills"
              onAdd={() => setSkillRows(p => [...p, blankSkill()])}
              addLabel="Add Category"
            />

            {/* Preset quick-add */}
            <div className="mb-5 border border-gray-200 rounded-sm bg-[#FCFAF7]">
              <button
                type="button"
                onClick={() => setPresetsOpen(p => !p)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:bg-gray-100 transition-colors"
              >
                <span>Quick-add skills</span>
                <span className="text-gray-400">{presetsOpen ? '▲' : '▼'}</span>
              </button>
              {presetsOpen && (
                <div className="px-4 pb-4 pt-3 border-t border-gray-200 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1.5">Category</p>
                      <Select value={presetCategory} onValueChange={setPresetCategory}>
                        <SelectTrigger className="bg-white rounded-sm">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {SKILL_PRESETS.map(preset => (
                            <SelectItem key={preset.category} value={preset.category}>{preset.category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1.5">Add skill</p>
                      <Select
                        value={presetSkill || '__none__'}
                        onValueChange={value => {
                          if (value === '__none__') return
                          addPresetSkill(presetCategory, value)
                          setPresetSkill('')
                        }}
                      >
                        <SelectTrigger className="bg-white rounded-sm">
                          <SelectValue placeholder={`Select ${presetCategory.toLowerCase()} skill`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__" disabled>Select a skill</SelectItem>
                          {activePreset.items.map(skill => {
                            const alreadyAdded = selectedPresetSkills.some(s => s.toLowerCase() === skill.toLowerCase())
                            return (
                              <SelectItem key={skill} value={skill} disabled={alreadyAdded}>
                                {skill}{alreadyAdded ? ' • added' : ''}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Selected in {presetCategory}</p>
                    {selectedPresetSkills.length === 0 ? (
                      <p className="text-xs text-gray-400">No skills selected yet.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedPresetSkills.map(skill => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => removePresetSkill(presetCategory, skill)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-medium border border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
                            title="Remove skill"
                          >
                            {skill} <X className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {skillRows.map((row, i) => (
                <div key={row.id} className="grid grid-cols-[1fr_2fr_auto] gap-3 items-start">
                  <div>
                    {i === 0 && <p className="text-xs text-gray-400 mb-1">Category</p>}
                    <Input
                      value={row.category}
                      onChange={e => setSkillRows(p => p.map(r => r.id === row.id ? { ...r, category: e.target.value } : r))}
                      placeholder="Languages"
                      className="rounded-sm"
                    />
                  </div>
                  <div>
                    {i === 0 && <p className="text-xs text-gray-400 mb-1">Skills (comma-separated)</p>}
                    <Input
                      value={row.items}
                      onChange={e => setSkillRows(p => p.map(r => r.id === row.id ? { ...r, items: e.target.value } : r))}
                      placeholder="Python, TypeScript, Go"
                      className="rounded-sm"
                    />
                  </div>
                  <div className={i === 0 ? 'mt-5' : ''}>
                    <RemoveBtn onClick={() => setSkillRows(p => p.filter(r => r.id !== row.id))} />
                  </div>
                </div>
              ))}
              {skillRows.length === 0 && (
                <p className="text-xs text-gray-400 italic">No skill categories yet.</p>
              )}
            </div>
            {skillsToDb(skillRows).length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-1.5">
                {skillsToDb(skillRows).flatMap(s => s.items).slice(0, 20).map(item => (
                  <Badge key={item} className="bg-orange-50 text-orange-600 border-orange-200 text-xs font-medium">
                    {item}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Education */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
            <SectionHeader
              icon={GraduationCap}
              label="Education"
              onAdd={() => setEduRows(p => [...p, blankEdu()])}
              addLabel="Add Degree"
            />
            <div className="space-y-4">
              {eduRows.map(row => (
                <div key={row.id} className="border border-gray-100 rounded-sm p-4 bg-gray-50/50 relative">
                  <div className="absolute top-3 right-3">
                    <RemoveBtn onClick={() => setEduRows(p => p.filter(r => r.id !== row.id))} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Degree</label>
                      <SearchInput
                        value={row.degree}
                        onChange={v => setEduRows(p => p.map(r => r.id === row.id ? { ...r, degree: v } : r))}
                        options={DEGREE_PRESETS}
                        placeholder="B.Tech Computer Science"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Institution / School</label>
                      <SearchInput
                        value={row.institution}
                        onChange={v => setEduRows(p => p.map(r => r.id === row.id ? { ...r, institution: v } : r))}
                        options={INSTITUTION_ALL}
                        placeholder="IIT Bombay / DPS R.K. Puram"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Start Year</label>
                      <SearchInput
                        value={row.start_year}
                        onChange={v => setEduRows(p => p.map(r => r.id === row.id ? { ...r, start_year: v } : r))}
                        options={YEAR_PRESETS}
                        placeholder="2020"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">End Year</label>
                      <SearchInput
                        value={row.end_year}
                        onChange={v => setEduRows(p => p.map(r => r.id === row.id ? { ...r, end_year: v } : r))}
                        options={YEAR_PRESETS}
                        placeholder="2024 / Present"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-400 mb-1">Relevant Coursework (optional)</label>
                      <Input
                        value={row.coursework}
                        onChange={e => setEduRows(p => p.map(r => r.id === row.id ? { ...r, coursework: e.target.value } : r))}
                        placeholder="Algorithms, OS, Databases"
                        className="rounded-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {eduRows.length === 0 && (
                <p className="text-xs text-gray-400 italic">No education entries yet.</p>
              )}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
            <SectionHeader
              icon={Briefcase}
              label="Work Experience"
              onAdd={() => setExpRows(p => [...p, blankExp()])}
              addLabel="Add Role"
            />
            <div className="space-y-4">
              {expRows.map(row => (
                <div key={row.id} className="border border-gray-100 rounded-sm p-4 bg-gray-50/50 relative">
                  <div className="absolute top-3 right-3">
                    <RemoveBtn onClick={() => setExpRows(p => p.filter(r => r.id !== row.id))} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-8 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Role / Title</label>
                      <SearchInput
                        value={row.role}
                        onChange={v => setExpRows(p => p.map(r => r.id === row.id ? { ...r, role: v } : r))}
                        options={ROLE_PRESETS}
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Company</label>
                      <Input
                        value={row.company}
                        onChange={e => setExpRows(p => p.map(r => r.id === row.id ? { ...r, company: e.target.value } : r))}
                        placeholder="Acme Corp"
                        className="rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Location</label>
                      <SearchInput
                        value={row.location}
                        onChange={v => setExpRows(p => p.map(r => r.id === row.id ? { ...r, location: v } : r))}
                        options={LOCATION_PRESETS}
                        placeholder="Remote / Bangalore, India"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">Duration</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">From</p>
                          <div className="flex gap-1">
                            <StyledSelect
                              value={row.start_month}
                              onChange={v => setExpRows(p => p.map(r => r.id === row.id ? { ...r, start_month: v } : r))}
                              options={MONTHS}
                              placeholder="Mon"
                            />
                            <SearchInput
                              value={row.start_year_exp}
                              onChange={v => setExpRows(p => p.map(r => r.id === row.id ? { ...r, start_year_exp: v } : r))}
                              options={YEAR_PRESETS.filter(y => y !== 'Present')}
                              placeholder="Year"
                              className="w-24"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">To</p>
                          <div className="flex gap-1">
                            <StyledSelect
                              value={row.end_month}
                              onChange={v => setExpRows(p => p.map(r => r.id === row.id ? { ...r, end_month: v } : r))}
                              options={MONTHS}
                              placeholder="Mon"
                            />
                            <SearchInput
                              value={row.end_year_exp}
                              onChange={v => setExpRows(p => p.map(r => r.id === row.id ? { ...r, end_year_exp: v } : r))}
                              options={YEAR_PRESETS}
                              placeholder="Year"
                              className="w-24"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Achievements (one per line)
                    </label>
                    <textarea
                      value={row.achievements}
                      onChange={e => setExpRows(p => p.map(r => r.id === row.id ? { ...r, achievements: e.target.value } : r))}
                      placeholder={"Reduced API latency by 40% via Redis caching\nShipped feature X 2 weeks ahead of schedule"}
                      rows={3}
                      className="w-full border border-input bg-background rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none"
                    />
                  </div>
                </div>
              ))}
              {expRows.length === 0 && (
                <p className="text-xs text-gray-400 italic">No experience entries yet.</p>
              )}
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end pb-2">
            <InteractiveHoverButton
              onClick={handleSaveProfile}
              disabled={savingProfile || !profileLoaded}
              className="rounded-none gap-2 py-2.5 px-6 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {savingProfile
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                : <><CheckCircle2 className="w-4 h-4" /> Save Profile</>}
            </InteractiveHoverButton>
          </div>
        </div>
      )}

      {/* ── PROJECTS TAB ──────────────────────────────────────────────────── */}
      {activeTab === 'projects' && (
        <div className="space-y-6">

          {/* Existing synced projects */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <Code2 className="w-3.5 h-3.5 text-orange-500" />
                Synced Projects
                {existingProjects.length > 0 && (
                  <span className="text-orange-500 font-black text-sm ml-1 normal-case tracking-normal">
                    {existingProjects.length}
                  </span>
                )}
              </h2>
              <button
                onClick={async () => {
                  if (!user?.id) return
                  setLoadingProjects(true)
                  try { setExistingProjects(await getProjectsFromSupabase(user.id)) } catch { /* ignore */ }
                  setLoadingProjects(false)
                }}
                className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded-sm"
                title="Refresh"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingProjects ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <p className="text-xs text-gray-400 mb-5">
              Star (<Star className="inline w-3 h-3" />) a project to include it on generated resumes. Unstar to hide it.
            </p>

            {loadingProjects ? (
              <div className="py-10 flex items-center justify-center gap-2 text-gray-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-orange-500" /> Loading projects...
              </div>
            ) : existingProjects.length === 0 ? (
              <div className="py-10 text-center">
                <Code2 className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                <p className="text-sm font-semibold text-gray-500">No projects synced yet.</p>
                <p className="text-xs text-gray-400 mt-1">
                  Use the GitHub sync section below to import repositories.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {existingProjects.map(project => (
                  <div
                    key={project.id}
                    className={`border rounded-sm p-4 transition-all ${
                      project.is_featured
                        ? 'border-orange-200 bg-orange-50/30 shadow-sm shadow-orange-50'
                        : 'border-gray-200 bg-white shadow-sm opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">
                          {project.title || project.github_repo_name}
                        </h3>
                        <a
                          href={project.github_repo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-gray-400 hover:text-orange-500 flex items-center gap-1 mt-0.5 transition-colors"
                        >
                          <LucideGithub className="w-3 h-3" />
                          {project.github_repo_name}
                        </a>
                      </div>
                      <button
                        onClick={() => handleToggleFeatured(project)}
                        disabled={togglingId === project.id}
                        title={project.is_featured ? 'Remove from resume' : 'Feature on resume'}
                        className={`shrink-0 p-1 rounded-sm transition-colors disabled:opacity-40 ${
                          project.is_featured
                            ? 'text-orange-500 hover:text-orange-600'
                            : 'text-gray-300 hover:text-orange-400'
                        }`}
                      >
                        {togglingId === project.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Star className={`w-4 h-4 ${project.is_featured ? 'fill-orange-500' : ''}`} />}
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-2 mb-3 min-h-8">
                      {project.description || 'No description.'}
                    </p>

                    {(project.tech_stack?.length ?? 0) > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {(project.tech_stack ?? []).slice(0, 4).map(tech => (
                          <Badge key={tech} className="bg-orange-50 text-orange-600 border-orange-200 text-xs font-medium">
                            {tech}
                          </Badge>
                        ))}
                        {(project.tech_stack?.length ?? 0) > 4 && (
                          <Badge className="bg-gray-50 text-gray-500 border-gray-200 text-xs">
                            +{(project.tech_stack?.length ?? 0) - 4}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-gray-500 font-medium">{project.primary_language || '—'}</span>
                      <span className={`font-medium ${project.is_featured ? 'text-orange-500' : 'text-gray-400'}`}>
                        {project.is_featured ? 'On resume' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* GitHub Sync */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="flex items-center gap-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <LucideGithub className="w-3.5 h-3.5 text-orange-500" />
                Sync from GitHub
              </h2>
              {effectiveLucideGithubUsername && (
                <span className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                  <LucideGithub className="w-3.5 h-3.5 text-gray-400" />
                  {effectiveLucideGithubUsername}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-5">
              Select repos to import. AI extracts tech stack, features and resume bullets from each repository's README.
            </p>

            {!effectiveLucideGithubUsername ? (
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm">
                <p className="text-sm font-semibold text-gray-700">GitHub username not set.</p>
                <p className="text-xs text-gray-500 mt-1">
                  Add your GitHub username in the{' '}
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="text-orange-500 underline underline-offset-2 hover:text-orange-600"
                  >
                    Profile Info
                  </button>{' '}
                  tab to load your repositories.
                </p>
              </div>
            ) : loadingRepos ? (
              <div className="py-8 flex items-center justify-center gap-2 text-gray-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-orange-500" /> Loading repositories...
              </div>
            ) : repos.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">No public repositories found.</div>
            ) : (
              <>
                {/* Selection controls */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      <span className="font-black text-gray-900 text-sm mr-0.5">{repos.length}</span> repos
                    </span>
                    <span>
                      <span className="font-black text-orange-500 text-sm mr-0.5">{selectedRepoIds.length}/5</span> selected
                    </span>
                  </div>
                  {selectedRepoIds.length > 0 && (
                    <InteractiveHoverButton
                      onClick={handleSyncProjects}
                      disabled={syncing}
                      className="rounded-none gap-2 py-2 px-4 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {syncing
                        ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Syncing...</>
                        : <><Sparkles className="w-3.5 h-3.5" /> Sync {selectedRepoIds.length} repo{selectedRepoIds.length > 1 ? 's' : ''}</>}
                    </InteractiveHoverButton>
                  )}
                </div>

                {/* Repo grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {repos.map(repo => {
                    const selected = selectedRepoIds.includes(repo.id)
                    const limitReached = selectedRepoIds.length >= 5 && !selected
                    const alreadySynced = existingProjects.some(p => p.github_repo_url === repo.html_url)

                    return (
                      <button
                        key={repo.id}
                        onClick={() => toggleRepo(repo.id)}
                        disabled={limitReached}
                        className={`text-left border p-3.5 transition-all duration-150 rounded-sm ${
                          selected
                            ? 'border-orange-400 bg-orange-50 shadow-sm shadow-orange-100'
                            : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow-sm'
                        } ${limitReached ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h3 className="font-semibold text-gray-900 truncate text-sm">{repo.name}</h3>
                          <div className="flex items-center gap-2 shrink-0">
                            {alreadySynced && (
                              <span className="text-xs text-orange-500 font-medium">Synced</span>
                            )}
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="text-gray-300 hover:text-orange-500 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 min-h-8">
                          {repo.description || 'No description available.'}
                        </p>
                        <div className="flex items-center justify-between mt-2.5 text-xs">
                          <span className={`font-medium ${selected ? 'text-orange-500' : 'text-gray-600'}`}>
                            {repo.language || 'Unknown'}
                          </span>
                          <div className="flex items-center gap-3 text-gray-400">
                            <span>★ {repo.stargazers_count}</span>
                            <span>{formatDate(repo.updated_at)}</span>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
