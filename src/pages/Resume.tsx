import { useEffect, useState } from 'react'
import { useUser } from '@/context/UserContext'
import { useUser as useClerkUser } from '@clerk/react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { FileText, Mail, Download, Sparkles, Loader2, Eye, Copy } from 'lucide-react'
import { getProfileMatchedJobs, type SupabaseJobRow } from '@/lib/supabase'
import jsPDF from 'jspdf'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/+$/, '') ?? ''

type GeneratedResult = {
    coverLetterContent: string
    resumeBlob: Blob | null
    resumeFileName: string
    jobTitle: string
    jobCompany: string
}

/** Recreates the Jake's Resume (resume.cls) layout using jsPDF on letterpaper. */
function buildResumePdf(params: {
    name: string
    email: string
    jobTitle: string
    jobCompany: string
    jobDescription: string
}): Blob {
    const { name, email, jobTitle, jobCompany, jobDescription } = params

    // Letterpaper: 215.9 × 279.4 mm
    const doc = new jsPDF({ unit: 'mm', format: 'letter' })
    const pageW = doc.internal.pageSize.getWidth()  // 215.9
    const lm = 15   // left margin
    const rm = 15   // right margin
    const cw = pageW - lm - rm
    const BLACK: [number, number, number] = [0, 0, 0]

    let y = 14

    // ── NAME (centered, uppercase, huge bold) ─────────────────────────────────
    doc.setTextColor(...BLACK)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.text((name || 'Your Name').toUpperCase(), pageW / 2, y, { align: 'center' })
    y += 7

    // ── Contact line (centered, separated by  ◆ ) ─────────────────────────────
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    const contact = [email || 'email@example.com'].filter(Boolean).join('  ◆  ')
    doc.text(contact, pageW / 2, y, { align: 'center' })
    y += 8

    // ── Helpers ───────────────────────────────────────────────────────────────

    /** SECTION HEADER: UPPERCASE BOLD + full-width hrule */
    const section = (title: string) => {
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.setTextColor(...BLACK)
        doc.text(title.toUpperCase(), lm, y)
        y += 1.5
        doc.setDrawColor(...BLACK)
        doc.setLineWidth(0.3)
        doc.line(lm, y, lm + cw, y)
        y += 4
    }

    /** Row: bold left text, normal right text (for company / date) */
    const rowBold = (left: string, right: string) => {
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.setTextColor(...BLACK)
        doc.text(left, lm, y)
        doc.text(right, lm + cw, y, { align: 'right' })
        y += 5
    }

    /** Row: italic left, italic right (for role / location) */
    const rowItalic = (left: string, right: string) => {
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(9.5)
        doc.setTextColor(...BLACK)
        doc.text(left, lm, y)
        doc.text(right, lm + cw, y, { align: 'right' })
        y += 4.5
    }

    /** Bullet point with · */
    const bullet = (text: string) => {
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9.5)
        doc.setTextColor(...BLACK)
        doc.text('\u00b7', lm + 3, y)
        const lines = doc.splitTextToSize(text, cw - 7)
        doc.text(lines, lm + 7, y)
        y += lines.length * 4.8
    }

    /** Plain key-value row for skills */
    const skillRow = (label: string, value: string) => {
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9.5)
        doc.setTextColor(...BLACK)
        doc.text(label + ':', lm, y)
        const labelW = doc.getTextWidth(label + ':') + 2
        doc.setFont('helvetica', 'normal')
        const lines = doc.splitTextToSize(value, cw - labelW)
        doc.text(lines, lm + labelW, y)
        y += lines.length * 4.8 + 1
    }

    // ── EDUCATION ─────────────────────────────────────────────────────────────
    section('Education')
    rowBold('[University Name]', '[GPA: 3.x / 4.0]')
    rowItalic('B.Tech in Computer Science', 'Aug 2019 – May 2023')
    y += 2

    // ── EXPERIENCE ────────────────────────────────────────────────────────────
    section('Experience')
    rowBold('[Previous Company]', 'Jan 2023 – Present')
    rowItalic(`Software Developer`, '[City, State]')
    bullet('Designed and shipped full-stack features using React, TypeScript, and FastAPI.')
    bullet('Improved system performance by 40% through query optimisation and caching.')
    bullet('Collaborated in agile sprints to deliver product milestones ahead of schedule.')
    y += 3

    // ── PROJECTS ──────────────────────────────────────────────────────────────
    section('Projects')
    // Tailor project title to the selected job
    rowBold(`Job Application Tracker  |  React · TypeScript · FastAPI · Supabase`, 'Side Project')
    bullet(`Built a full-stack platform that auto-matches user profiles to job listings and generates tailored resumes — relevant to the ${jobTitle} role at ${jobCompany}.`)
    y += 1
    rowBold('Open-Source CLI Tool  |  Python · Click · GitHub Actions', 'Open Source')
    bullet('Automated developer workflows; 200+ GitHub stars, published to PyPI.')
    y += 3

    // ── TECHNICAL SKILLS ──────────────────────────────────────────────────────
    section('Technical Skills')

    // Extract matching keywords from job description
    const jdLower = jobDescription.toLowerCase()
    const langPool = ['Python', 'JavaScript', 'TypeScript', 'Go', 'SQL', 'Bash']
    const fwPool   = ['React', 'Node.js', 'FastAPI', 'Django', 'Next.js', 'Express']
    const toolPool = ['Git', 'Docker', 'AWS', 'Supabase', 'PostgreSQL', 'Redis', 'CI/CD']

    const pick = (pool: string[]) => {
        const matched = pool.filter(k => jdLower.includes(k.toLowerCase()))
        return (matched.length >= 2 ? matched : pool).join(', ')
    }

    skillRow('Languages', pick(langPool))
    skillRow('Frameworks', pick(fwPool))
    skillRow('Tools & Cloud', pick(toolPool))

    return doc.output('blob')
}

export default function Resume() {
    const { userId } = useUser()
    const { user } = useClerkUser()

    const [jobs, setJobs] = useState<SupabaseJobRow[]>([])
    const [selectedJobId, setSelectedJobId] = useState('')
    const [loadingJobs, setLoadingJobs] = useState(false)
    const [generating, setGenerating] = useState(false)
    const [result, setResult] = useState<GeneratedResult | null>(null)

    const handleDownloadResume = () => {
        if (!result?.resumeBlob) return
        const url = URL.createObjectURL(result.resumeBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = result.resumeFileName
        a.click()
        URL.revokeObjectURL(url)
    }

    const userName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'User'
    const userEmail = user?.primaryEmailAddress?.emailAddress ?? ''

    useEffect(() => {
        if (!userId) return
        setLoadingJobs(true)
        getProfileMatchedJobs(userId, 50)
            .then(data => {
                setJobs(data)
                if (data.length && data[0].id) setSelectedJobId(String(data[0].id))
            })
            .catch(() => toast.error('Failed to load matched jobs'))
            .finally(() => setLoadingJobs(false))
    }, [userId])

    const selectedJob = jobs.find(j => String(j.id) === selectedJobId)

    const handleGenerate = async () => {
        if (!userId) { toast.error('Log in first'); return }
        if (!selectedJobId) { toast.error('Select a job first'); return }

        setGenerating(true)
        try {
            const jobTitle = selectedJob?.title ?? 'Software Engineer'
            const jobCompany = selectedJob?.company ?? 'Company'
            const jobDescription = selectedJob?.description ?? ''
            let coverLetterContent = ''

            // Generate cover letter from backend if available
            if (API_BASE_URL) {
                try {
                    const clRes = await fetch(`${API_BASE_URL}/api/v1/cover-letters/${selectedJobId}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            user_id: crypto.randomUUID(),
                            user_name: userName,
                            user_email: userEmail,
                            experience_years: '2+',
                            primary_skills: ['Software Development'],
                            selected_projects: [],
                        }),
                    })
                    if (clRes.ok) {
                        const clData = await clRes.json()
                        coverLetterContent = clData.content ?? ''
                    }
                } catch {
                    // swallow — cover letter empty state shown in UI
                }
            }

            // Generate resume PDF entirely in the browser
            const resumeBlob = buildResumePdf({ name: userName, email: userEmail, jobTitle, jobCompany, jobDescription })
            const resumeFileName = `resume-${jobCompany.replace(/\s+/g, '-').toLowerCase()}.pdf`

            setResult({ coverLetterContent, resumeBlob, resumeFileName, jobTitle, jobCompany })
            toast.success('Generated!', { description: `Tailored for ${jobTitle} at ${jobCompany}` })
        } catch (err) {
            toast.error('Generation failed', { description: err instanceof Error ? err.message : 'Unknown error' })
        } finally {
            setGenerating(false)
        }
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success('Copied to clipboard!')
    }

    const coldDmText = result
        ? `Hey there,\n\nI came across ${result.jobCompany} and was really impressed by the work your team is doing. I recently applied for the ${result.jobTitle} position and wanted to reach out directly.\n\nI'm a software developer with hands-on experience building full-stack products. I think my background aligns well with what your team is working on.\n\nWould love 15 minutes to connect — no pressure, just want to learn more about the role!\n\nBest,\n${userName}`
        : ''

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Toaster />
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Resume & Cover Letter</h1>
            <p className="text-gray-500 mb-8">Preview AI-generated documents tailored to each job application.</p>

            {/* Config row */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-6 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-48">
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">Select Job Application</label>
                    {loadingJobs ? (
                        <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                            <Loader2 className="w-4 h-4 animate-spin" /> Loading jobs…
                        </div>
                    ) : (
                        <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                            <SelectTrigger className="rounded-xl border-gray-200">
                                <SelectValue placeholder={jobs.length ? 'Select a job…' : 'No matched jobs found'} />
                            </SelectTrigger>
                            <SelectContent>
                                {jobs.filter(j => j.id).map(job => (
                                    <SelectItem key={String(job.id)} value={String(job.id)}>
                                        {job.title} — {job.company}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
                <Button
                    onClick={handleGenerate}
                    disabled={generating || !selectedJobId || loadingJobs}
                    className="gradient-violet text-white border-0 rounded-xl gap-2 shadow-md shadow-violet-200 shrink-0"
                >
                    {generating
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                        : <><Sparkles className="w-4 h-4" /> {result ? 'Regenerate' : 'Generate'}</>}
                </Button>
                {result?.resumeBlob && (
                    <Button onClick={handleDownloadResume} variant="outline" className="rounded-xl gap-2 border-violet-200 text-violet-700">
                        <Download className="w-4 h-4" /> Download PDF
                    </Button>
                )}
            </div>

            {!result ? (
                <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl gradient-violet mx-auto mb-4 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Documents Generated Yet</h3>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">Select a job above and click Generate to create a tailored resume, cover letter, and cold DM.</p>
                    <Button onClick={handleGenerate} disabled={generating || !selectedJobId} className="gradient-violet text-white border-0 rounded-xl gap-2">
                        {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : <><Sparkles className="w-4 h-4" /> Generate Now</>}
                    </Button>
                </div>
            ) : (
                <Tabs defaultValue="resume" className="space-y-4">
                    <TabsList className="bg-violet-50 p-1 rounded-xl">
                        <TabsTrigger value="resume" className="rounded-lg gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-violet-700">
                            <FileText className="w-3.5 h-3.5" /> Resume
                        </TabsTrigger>
                        <TabsTrigger value="cover-letter" className="rounded-lg gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-violet-700">
                            <Mail className="w-3.5 h-3.5" /> Cover Letter
                        </TabsTrigger>
                        <TabsTrigger value="cold-dm" className="rounded-lg gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-violet-700">
                            <Eye className="w-3.5 h-3.5" /> Cold DM
                        </TabsTrigger>
                    </TabsList>

                    {/* Resume Tab */}
                    <TabsContent value="resume">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-6 text-white">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-2xl font-extrabold mb-0.5">{userName}</h2>
                                        <p className="text-violet-200 text-sm">{userEmail}</p>
                                    </div>
                                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">Tailored for {result.jobCompany}</Badge>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="bg-violet-50 border border-violet-100 rounded-xl p-6 text-center">
                                    <FileText className="w-12 h-12 text-violet-500 mx-auto mb-3" />
                                    <h3 className="font-bold text-gray-900 mb-1">Resume Generated Successfully</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Your tailored resume for <strong>{result.jobTitle}</strong> at <strong>{result.jobCompany}</strong> is ready.
                                    </p>
                                    <Button onClick={handleDownloadResume} className="gradient-violet text-white border-0 rounded-xl gap-2">
                                        <Download className="w-4 h-4" /> Download PDF
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Cover Letter Tab */}
                    <TabsContent value="cover-letter">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-gray-900">Cover Letter — {result.jobCompany} · {result.jobTitle}</h2>
                                <Badge className="bg-green-50 text-green-700 border-green-200">AI Generated</Badge>
                            </div>
                            {result.coverLetterContent ? (
                                <>
                                    <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 font-mono text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">
                                        {result.coverLetterContent}
                                    </div>
                                    <Button variant="outline" onClick={() => handleCopy(result.coverLetterContent)} className="rounded-xl border-violet-200 text-violet-700 gap-2">
                                        <Copy className="w-4 h-4" /> Copy Letter
                                    </Button>
                                </>
                            ) : (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-900">
                                    <p className="font-semibold mb-1">Cover letter not available</p>
                                    <p className="text-sm">The selected job may not exist in the backend database. Make sure jobs are fetched/synced via the backend, then try again.</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Cold DM Tab */}
                    <TabsContent value="cold-dm">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-gray-900">LinkedIn Cold DM — {result.jobCompany} Recruiter</h2>
                                <Badge className="bg-blue-50 text-blue-700 border-blue-200">Personalized</Badge>
                            </div>
                            <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">
                                {coldDmText}
                            </div>
                            <Button variant="outline" onClick={() => handleCopy(coldDmText)} className="rounded-xl border-violet-200 text-violet-700 gap-2">
                                <Copy className="w-4 h-4" /> Copy DM
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    )
}
