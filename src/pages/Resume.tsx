import { useState } from 'react'
import { useUser } from '@/context/UserContext'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { FileText, Mail, Download, Sparkles, Loader2, Eye, Copy } from 'lucide-react'

const SAMPLE_RESUME_SECTIONS = [
    {
        heading: 'Work Experience',
        items: [
            { title: 'Software Engineer Intern', org: 'Google — Mountain View, CA | Jun 2023 – Aug 2023', bullets: ['Reduced API latency by 37% through cache optimization, impacting 50M+ daily requests.', 'Shipped 3 production features in Android codebase adopted by 2M+ users.'] },
            { title: 'Full Stack Developer', org: 'StartupXYZ — Remote | Jan 2023 – May 2023', bullets: ['Built end-to-end B2B SaaS dashboard using React, FastAPI, and PostgreSQL.', 'Integrated Stripe billing, reducing churn by 18% through proactive dunning flows.'] },
        ]
    },
    {
        heading: 'Education',
        items: [{ title: 'B.Tech Computer Science — IIT Bombay', org: '2020 – 2024 | CGPA: 9.1/10', bullets: ['Relevant coursework: Algorithms, Distributed Systems, ML, Operating Systems'] }]
    },
    {
        heading: 'Skills',
        items: [{ title: '', org: '', bullets: ['Languages: Python, TypeScript, Go, C++', 'Frameworks: React, FastAPI, Node.js, LangChain', 'Cloud: AWS, GCP, Docker, Kubernetes'] }]
    },
    {
        heading: 'Projects',
        items: [{ title: 'ApplyBot', org: 'github.com/user/applybot', bullets: ['AI-powered job application automation using LangGraph + OpenAI. Sends personalized resumes & cold emails at scale.'] }]
    },
]

const SAMPLE_COVER_LETTER = `Dear Hiring Team at {Company},

I'm excited to apply for the {Role} position. As a Computer Science engineer with experience building production systems at scale — including projects that have served millions of users — I believe I'm well-positioned to contribute meaningfully to your team.

During my internship at Google, I reduced API latency by 37% through a cache optimization that impacted 50M+ daily requests. I also shipped 3 production features that are now used by 2M+ Android users. These experiences taught me to balance engineering rigor with user empathy.

What excites me most about {Company} is {reason}. I'd love to bring my background in distributed systems, AI tooling, and full-stack development to help you achieve {goal}.

I've attached my tailored resume for your review. I'd be happy to discuss how my experience aligns with your needs.

Best regards,
[Your Name]`

const SAMPLE_COLD_DM = `Hey {FirstName},

I came across your work at {Company} and was really impressed by {specific_thing}. I recently applied for the {Role} position and wanted to reach out directly.

I'm a CS grad with hands-on experience in {relevant_skill} — I built {project} which {achievement}. I think my background aligns well with what your team is working on.

Would love 15 minutes to chat. No pressure — just want to learn more about the role!

Best,
[Your Name]`

export default function Resume() {
    const { userId } = useUser()
    const [selectedJob, setSelectedJob] = useState('1')
    const [generating, setGenerating] = useState(false)
    const [generated, setGenerated] = useState(false)

    const handleGenerate = async () => {
        if (!userId) { toast.error('Log in first'); return }
        setGenerating(true)
        await new Promise(r => setTimeout(r, 2200)) // simulate POST /api/v1/resume/generate
        setGenerating(false)
        setGenerated(true)
        toast.success('Resume & Cover Letter generated!', { description: 'Tailored for the selected job.' })
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success('Copied to clipboard!')
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Toaster />
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Resume & Cover Letter</h1>
            <p className="text-gray-500 mb-8">Preview AI-generated documents tailored to each job application.</p>

            {/* Config row */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm mb-6 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-48">
                    <label className="text-sm font-semibold text-gray-700 block mb-1.5">Select Job Application</label>
                    <Select value={selectedJob} onValueChange={setSelectedJob}>
                        <SelectTrigger className="rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Software Engineer — Google</SelectItem>
                            <SelectItem value="2">ML Engineer — OpenAI</SelectItem>
                            <SelectItem value="3">Frontend Engineer — Vercel</SelectItem>
                            <SelectItem value="4">Backend Engineer — Stripe</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="gradient-violet text-white border-0 rounded-xl gap-2 shadow-md shadow-violet-200 shrink-0"
                >
                    {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> {generated ? 'Regenerate' : 'Generate'}</>}
                </Button>
                {generated && (
                    <Button variant="outline" className="rounded-xl gap-2 border-violet-200 text-violet-700" onClick={() => toast.info('PDF download coming soon!')}>
                        <Download className="w-4 h-4" /> Download PDF
                    </Button>
                )}
            </div>

            {!generated ? (
                <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl gradient-violet mx-auto mb-4 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Documents Generated Yet</h3>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">Select a job above and click Generate to create a tailored resume, cover letter, and cold DM.</p>
                    <Button onClick={handleGenerate} disabled={generating} className="gradient-violet text-white border-0 rounded-xl gap-2">
                        {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate Now</>}
                    </Button>
                </div>
            ) : (
                <Tabs defaultValue="resume" className="space-y-4">
                    <TabsList className="bg-violet-50 p-1 rounded-xl">
                        <TabsTrigger value="resume" className="rounded-lg gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-violet-700"><FileText className="w-3.5 h-3.5" /> Resume</TabsTrigger>
                        <TabsTrigger value="cover-letter" className="rounded-lg gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-violet-700"><Mail className="w-3.5 h-3.5" /> Cover Letter</TabsTrigger>
                        <TabsTrigger value="cold-dm" className="rounded-lg gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-violet-700"><Eye className="w-3.5 h-3.5" /> Cold DM</TabsTrigger>
                    </TabsList>

                    {/* Resume Preview */}
                    <TabsContent value="resume">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* Resume header */}
                            <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-8 py-6 text-white">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-2xl font-extrabold mb-0.5">John Doe</h2>
                                        <p className="text-violet-200 text-sm">Software Engineer · john@example.com · github.com/johndoe · linkedin.com/in/johndoe</p>
                                    </div>
                                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">Tailored for Google</Badge>
                                </div>
                            </div>
                            {/* Resume body */}
                            <div className="p-8 space-y-6">
                                <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
                                    <h3 className="text-xs font-black text-violet-600 uppercase tracking-widest mb-2">Professional Summary</h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Driven software engineer with 3+ years of experience building scalable distributed systems and high-performance APIs. Strong foundation in Python, Go, and cloud infrastructure. Proven track record of shipping impactful features at Google and reducing API latency by 37% at scale.
                                    </p>
                                </div>
                                {SAMPLE_RESUME_SECTIONS.map(section => (
                                    <div key={section.heading}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">{section.heading}</h3>
                                            <div className="flex-1 h-px bg-gray-200" />
                                        </div>
                                        <div className="space-y-3">
                                            {section.items.map((item, i) => (
                                                <div key={i}>
                                                    {item.title && <div className="flex items-start justify-between"><p className="font-bold text-gray-900 text-sm">{item.title}</p><p className="text-xs text-gray-500 ml-2 shrink-0">{item.org}</p></div>}
                                                    <ul className="mt-1 space-y-0.5">
                                                        {item.bullets.map((b, bi) => (
                                                            <li key={bi} className="text-sm text-gray-600 flex gap-2"><span className="text-violet-400 mt-0.5 flex-shrink-0">•</span>{b}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Actions */}
                            <div className="px-8 pb-6 flex gap-3">
                                <Button className="gradient-violet text-white border-0 rounded-xl gap-2"><Download className="w-4 h-4" /> Download PDF</Button>
                                <Button variant="outline" className="rounded-xl border-violet-200 text-violet-700 gap-2" onClick={() => handleCopy('Resume content')}>
                                    <Copy className="w-4 h-4" /> Copy Text
                                </Button>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Cover Letter Preview */}
                    <TabsContent value="cover-letter">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-gray-900">Cover Letter — Google Software Engineer</h2>
                                <Badge className="bg-green-50 text-green-700 border-green-200">AI Generated</Badge>
                            </div>
                            <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 font-mono text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">
                                {SAMPLE_COVER_LETTER.replace('{Company}', 'Google').replace('{Role}', 'Software Engineer').replace('{reason}', 'the scale of infrastructure you build').replace('{goal}', 'make search even better')}
                            </div>
                            <Button variant="outline" onClick={() => handleCopy(SAMPLE_COVER_LETTER)} className="rounded-xl border-violet-200 text-violet-700 gap-2">
                                <Copy className="w-4 h-4" /> Copy Letter
                            </Button>
                        </div>
                    </TabsContent>

                    {/* Cold DM Preview */}
                    <TabsContent value="cold-dm">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-gray-900">LinkedIn Cold DM — Google Recruiter</h2>
                                <Badge className="bg-blue-50 text-blue-700 border-blue-200">Personalized</Badge>
                            </div>
                            <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 text-sm text-gray-700 leading-relaxed whitespace-pre-line mb-4">
                                {SAMPLE_COLD_DM.replace('{FirstName}', 'Sarah').replace('{Company}', 'Google').replace('{specific_thing}', 'the recent work on Google DeepMind integration').replace('{Role}', 'Software Engineer').replace('{relevant_skill}', 'distributed systems').replace('{project}', 'ApplyBot').replace('{achievement}', 'automated 10,000+ job applications')}
                            </div>
                            <Button variant="outline" onClick={() => handleCopy(SAMPLE_COLD_DM)} className="rounded-xl border-violet-200 text-violet-700 gap-2">
                                <Copy className="w-4 h-4" /> Copy DM
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>
            )}
        </div>
    )
}
