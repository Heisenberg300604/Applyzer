import { useState } from 'react'
import { useUser } from '@/context/UserContext'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    User, Code, GraduationCap, Briefcase,
    FolderGit2, Plus, Trash2, Save, CheckCircle, Link as LinkIcon
} from 'lucide-react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Skill { id: number; category: string; items: string }
interface Education { id: number; degree: string; institution: string; year: string; coursework: string }
interface Experience { id: number; role: string; company: string; location: string; duration: string; achievements: string }
interface Project { id: number; title: string; description: string; tech: string; url: string; keywords: string }

// ─── Helpers ──────────────────────────────────────────────────────────────────
const emptySkill = (): Skill => ({ id: Date.now(), category: '', items: '' })
const emptyEducation = (): Education => ({ id: Date.now(), degree: '', institution: '', year: '', coursework: '' })
const emptyExperience = (): Experience => ({ id: Date.now(), role: '', company: '', location: '', duration: '', achievements: '' })
const emptyProject = (): Project => ({ id: Date.now(), title: '', description: '', tech: '', url: '', keywords: '' })

const fieldClass = 'rounded-xl border-gray-200 focus:border-violet-400 focus-visible:ring-violet-200'

function SectionHeader({ children }: { children: React.ReactNode }) {
    return <h3 className="text-base font-bold text-gray-900 mb-3">{children}</h3>
}

// ─── Completeness score ───────────────────────────────────────────────────────
function getScore(basic: Record<string, string>, skills: Skill[], edu: Education[], exp: Experience[], proj: Project[]) {
    let score = 0
    if (basic.name) score += 12
    if (basic.email) score += 8
    if (basic.phone) score += 5
    if (basic.linkedin) score += 8
    if (basic.github) score += 7
    if (basic.summary) score += 10
    if (skills.length) score += 15
    if (edu.length) score += 15
    if (exp.length) score += 15
    if (proj.length) score += 5
    return Math.min(score, 100)
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Profile() {
    const { userId } = useUser()

    // Basic info
    const [basic, setBasic] = useState({ name: '', email: '', phone: '', linkedin: '', github: '', summary: '' })
    const updateBasic = (k: keyof typeof basic, v: string) => setBasic(p => ({ ...p, [k]: v }))

    // Collections
    const [skills, setSkills] = useState<Skill[]>([emptySkill()])
    const [education, setEducation] = useState<Education[]>([emptyEducation()])
    const [experience, setExperience] = useState<Experience[]>([emptyExperience()])
    const [projects, setProjects] = useState<Project[]>([emptyProject()])

    const completeness = getScore(basic, skills, education, experience, projects)

    const addItem = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, empty: () => T) => setter(p => [...p, empty()])
    const removeItem = <T extends { id: number }>(setter: React.Dispatch<React.SetStateAction<T[]>>, id: number) => setter(p => p.filter(x => x.id !== id))
    const updateItem = <T extends { id: number }>(setter: React.Dispatch<React.SetStateAction<T[]>>, id: number, patch: Partial<T>) =>
        setter(p => p.map(x => x.id === id ? { ...x, ...patch } : x))

    const handleSave = (section: string) => {
        // TODO: POST to backend API
        toast.success(`${section} saved!`, { description: `User ID: ${userId || 'not logged in'}` })
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Toaster />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Profile Builder</h1>
                <p className="text-gray-500">Fill in your details — ApplyBot uses this to generate tailored applications.</p>
            </div>

            {/* Completeness card */}
            <div className="bg-white rounded-2xl border border-violet-100 p-5 shadow-sm mb-8">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="font-bold text-gray-900">Profile Completeness</p>
                        <p className="text-sm text-gray-500">Complete your profile for better AI-generated resumes</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {completeness === 100 && <CheckCircle className="w-5 h-5 text-green-500" />}
                        <span className="text-2xl font-extrabold text-gradient-violet inline-block">{completeness}%</span>
                    </div>
                </div>
                <Progress value={completeness} className="h-2 bg-violet-50" />
                <div className="flex flex-wrap gap-2 mt-3">
                    {[
                        { label: 'Basic Info', done: !!basic.name && !!basic.email },
                        { label: 'Skills', done: skills.some(s => !!s.category) },
                        { label: 'Education', done: education.some(e => !!e.degree) },
                        { label: 'Experience', done: experience.some(e => !!e.role) },
                        { label: 'Projects', done: projects.some(p => !!p.title) },
                    ].map(({ label, done }) => (
                        <Badge key={label} className={done ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}>
                            {done ? '✓' : '○'} {label}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="basic" className="space-y-6">
                <TabsList className="bg-violet-50 p-1 rounded-xl w-full">
                    <TabsTrigger value="basic" className="flex gap-1.5 flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-violet-700"><User className="w-3.5 h-3.5" />Basic Info</TabsTrigger>
                    <TabsTrigger value="skills" className="flex gap-1.5 flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-violet-700"><Code className="w-3.5 h-3.5" />Skills</TabsTrigger>
                    <TabsTrigger value="education" className="flex gap-1.5 flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-violet-700"><GraduationCap className="w-3.5 h-3.5" />Education</TabsTrigger>
                    <TabsTrigger value="experience" className="flex gap-1.5 flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-violet-700"><Briefcase className="w-3.5 h-3.5" />Experience</TabsTrigger>
                    <TabsTrigger value="projects" className="flex gap-1.5 flex-1 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-violet-700"><FolderGit2 className="w-3.5 h-3.5" />Projects</TabsTrigger>
                </TabsList>

                {/* ── Tab 1: Basic Info ── */}
                <TabsContent value="basic">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
                        <SectionHeader>Personal Information</SectionHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="label-sm">Full Name *</label><Input className={fieldClass} placeholder="John Doe" value={basic.name} onChange={e => updateBasic('name', e.target.value)} /></div>
                            <div><label className="label-sm">Email *</label><Input className={fieldClass} type="email" placeholder="john@example.com" value={basic.email} onChange={e => updateBasic('email', e.target.value)} /></div>
                            <div><label className="label-sm">Phone</label><Input className={fieldClass} placeholder="+1 234 567 890" value={basic.phone} onChange={e => updateBasic('phone', e.target.value)} /></div>
                            <div><label className="label-sm">LinkedIn URL</label><Input className={fieldClass} placeholder="linkedin.com/in/johndoe" value={basic.linkedin} onChange={e => updateBasic('linkedin', e.target.value)} /></div>
                            <div><label className="label-sm">GitHub URL</label><Input className={fieldClass} placeholder="github.com/johndoe" value={basic.github} onChange={e => updateBasic('github', e.target.value)} /></div>
                        </div>
                        <div>
                            <label className="label-sm">Professional Summary</label>
                            <textarea
                                className="w-full rounded-xl border border-gray-200 focus:border-violet-400 p-3 text-sm resize-none outline-none focus:ring-2 focus:ring-violet-100 text-gray-700 mt-1"
                                rows={4}
                                placeholder="A brief summary of your professional background, key skills, and career goals..."
                                value={basic.summary}
                                onChange={e => updateBasic('summary', e.target.value)}
                            />
                        </div>
                        <Button onClick={() => handleSave('Basic Info')} className="gradient-violet text-white border-0 rounded-xl shadow-md shadow-violet-200 gap-2">
                            <Save className="w-4 h-4" /> Save Basic Info
                        </Button>
                    </div>
                </TabsContent>

                {/* ── Tab 2: Skills ── */}
                <TabsContent value="skills">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                        <SectionHeader>Skills</SectionHeader>
                        <p className="text-sm text-gray-500 -mt-2">Group skills by category (e.g., "Languages: Python, TypeScript, Go")</p>
                        {skills.map((s, i) => (
                            <div key={s.id} className="flex gap-3 items-start group">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50/60 rounded-xl p-4 border border-gray-100">
                                    <div><label className="label-sm">Category</label><Input className={fieldClass} placeholder="e.g. Languages" value={s.category} onChange={e => updateItem(setSkills, s.id, { category: e.target.value })} /></div>
                                    <div><label className="label-sm">Skills (comma-separated)</label><Input className={fieldClass} placeholder="Python, TypeScript, Go" value={s.items} onChange={e => updateItem(setSkills, s.id, { items: e.target.value })} /></div>
                                </div>
                                {skills.length > 1 && (
                                    <button onClick={() => removeItem(setSkills, s.id)} className="mt-6 text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => addItem(setSkills, emptySkill)} className="gap-2 rounded-xl border-dashed border-violet-200 text-violet-600 hover:bg-violet-50">
                                <Plus className="w-4 h-4" /> Add Category
                            </Button>
                            <Button onClick={() => handleSave('Skills')} className="gradient-violet text-white border-0 rounded-xl gap-2">
                                <Save className="w-4 h-4" /> Save Skills
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                {/* ── Tab 3: Education ── */}
                <TabsContent value="education">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                        <SectionHeader>Education</SectionHeader>
                        {education.map((e) => (
                            <div key={e.id} className="group bg-gray-50/60 rounded-xl p-4 border border-gray-100 space-y-3 relative">
                                {education.length > 1 && (
                                    <button onClick={() => removeItem(setEducation, e.id)} className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div><label className="label-sm">Degree / Course *</label><Input className={fieldClass} placeholder="B.Tech Computer Science" value={e.degree} onChange={ev => updateItem(setEducation, e.id, { degree: ev.target.value })} /></div>
                                    <div><label className="label-sm">Institution *</label><Input className={fieldClass} placeholder="MIT" value={e.institution} onChange={ev => updateItem(setEducation, e.id, { institution: ev.target.value })} /></div>
                                    <div><label className="label-sm">Graduation Year</label><Input className={fieldClass} placeholder="2024" value={e.year} onChange={ev => updateItem(setEducation, e.id, { year: ev.target.value })} /></div>
                                </div>
                                <div><label className="label-sm">Relevant Coursework</label><Input className={fieldClass} placeholder="Algorithms, ML, Systems Design..." value={e.coursework} onChange={ev => updateItem(setEducation, e.id, { coursework: ev.target.value })} /></div>
                            </div>
                        ))}
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => addItem(setEducation, emptyEducation)} className="gap-2 rounded-xl border-dashed border-violet-200 text-violet-600 hover:bg-violet-50">
                                <Plus className="w-4 h-4" /> Add Education
                            </Button>
                            <Button onClick={() => handleSave('Education')} className="gradient-violet text-white border-0 rounded-xl gap-2">
                                <Save className="w-4 h-4" /> Save Education
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                {/* ── Tab 4: Experience ── */}
                <TabsContent value="experience">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                        <SectionHeader>Work Experience</SectionHeader>
                        {experience.map((ex) => (
                            <div key={ex.id} className="group bg-gray-50/60 rounded-xl p-4 border border-gray-100 space-y-3 relative">
                                {experience.length > 1 && (
                                    <button onClick={() => removeItem(setExperience, ex.id)} className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div><label className="label-sm">Role / Title *</label><Input className={fieldClass} placeholder="Software Engineer Intern" value={ex.role} onChange={e => updateItem(setExperience, ex.id, { role: e.target.value })} /></div>
                                    <div><label className="label-sm">Company *</label><Input className={fieldClass} placeholder="Google" value={ex.company} onChange={e => updateItem(setExperience, ex.id, { company: e.target.value })} /></div>
                                    <div><label className="label-sm">Location</label><Input className={fieldClass} placeholder="San Francisco, CA" value={ex.location} onChange={e => updateItem(setExperience, ex.id, { location: e.target.value })} /></div>
                                    <div><label className="label-sm">Duration</label><Input className={fieldClass} placeholder="Jun 2023 – Aug 2023" value={ex.duration} onChange={e => updateItem(setExperience, ex.id, { duration: e.target.value })} /></div>
                                </div>
                                <div>
                                    <label className="label-sm">Achievements (one per line)</label>
                                    <textarea
                                        className="w-full rounded-xl border border-gray-200 focus:border-violet-400 p-3 text-sm resize-none outline-none focus:ring-2 focus:ring-violet-100 text-gray-700 mt-1"
                                        rows={3}
                                        placeholder={"- Increased API throughput by 40% by refactoring the cache layer\n- Shipped 3 features used by 2M+ users"}
                                        value={ex.achievements}
                                        onChange={e => updateItem(setExperience, ex.id, { achievements: e.target.value })}
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => addItem(setExperience, emptyExperience)} className="gap-2 rounded-xl border-dashed border-violet-200 text-violet-600 hover:bg-violet-50">
                                <Plus className="w-4 h-4" /> Add Experience
                            </Button>
                            <Button onClick={() => handleSave('Experience')} className="gradient-violet text-white border-0 rounded-xl gap-2">
                                <Save className="w-4 h-4" /> Save Experience
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                {/* ── Tab 5: Projects ── */}
                <TabsContent value="projects">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                        <SectionHeader>Projects</SectionHeader>
                        {projects.map((p) => (
                            <div key={p.id} className="group bg-gray-50/60 rounded-xl p-4 border border-gray-100 space-y-3 relative">
                                {projects.length > 1 && (
                                    <button onClick={() => removeItem(setProjects, p.id)} className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div><label className="label-sm">Project Title *</label><Input className={fieldClass} placeholder="ApplyBot" value={p.title} onChange={e => updateItem(setProjects, p.id, { title: e.target.value })} /></div>
                                    <div><label className="label-sm">Tech Stack</label><Input className={fieldClass} placeholder="React, FastAPI, PostgreSQL" value={p.tech} onChange={e => updateItem(setProjects, p.id, { tech: e.target.value })} /></div>
                                    <div className="md:col-span-2"><label className="label-sm">Description</label>
                                        <textarea className="w-full rounded-xl border border-gray-200 focus:border-violet-400 p-3 text-sm resize-none outline-none focus:ring-2 focus:ring-violet-100 text-gray-700 mt-1" rows={2}
                                            placeholder="What it does, impact, complexities solved..."
                                            value={p.description} onChange={e => updateItem(setProjects, p.id, { description: e.target.value })} />
                                    </div>
                                    <div className="flex gap-2 items-center"><LinkIcon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-5" /><div className="flex-1"><label className="label-sm">Project URL</label><Input className={fieldClass} placeholder="github.com/..." value={p.url} onChange={e => updateItem(setProjects, p.id, { url: e.target.value })} /></div></div>
                                    <div><label className="label-sm">Keywords (for ATS matching)</label><Input className={fieldClass} placeholder="REST API, microservices, real-time" value={p.keywords} onChange={e => updateItem(setProjects, p.id, { keywords: e.target.value })} /></div>
                                </div>
                            </div>
                        ))}
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => addItem(setProjects, emptyProject)} className="gap-2 rounded-xl border-dashed border-violet-200 text-violet-600 hover:bg-violet-50">
                                <Plus className="w-4 h-4" /> Add Project
                            </Button>
                            <Button onClick={() => handleSave('Projects')} className="gradient-violet text-white border-0 rounded-xl gap-2">
                                <Save className="w-4 h-4" /> Save Projects
                            </Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
