"use client"
import { useState, ChangeEvent, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Menu from "@/components/StickyMenu"
import { useSession } from 'next-auth/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BotIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, FilePenIcon, LayoutDashboardIcon, LayoutTemplateIcon, MountainIcon, SettingsIcon, ShareIcon, Sparkles, Zap } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { sampleJobDescription } from "@/lib/utils"
import { useRouter } from 'next/navigation';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!

export default function Component() {
    const [jobDescription, setJobDescription] = useState<string>("")
    const [generationMode, setGenerationMode] = useState<"ai" | "manual">("ai")
    const [emailTemplates, setEmailTemplates] = useState<string[]>(["", "", ""])
    const [openAIApiKey, setOpenAIApiKey] = useState<string>("")
    const [openAIApiKeyError, setOpenAIApiKeyError] = useState<boolean>(false)
    const [freeAIGenerations, setFreeAIGenerations] = useState<number>(3)
    const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false)
    const [isKeySavedLocally, setIsKeySavedLocally] = useState<boolean>(localStorage.getItem('openai-api-key') !== null)
    const [useSampleDescription, setUseSampleDescription] = useState<boolean>(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { data: session, status: sessionStatus } = useSession();
    const [userDetails, setUserDetails] = useState(null);
    const sampleDescription = sampleJobDescription

    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.push('/');
        }
    }, [session, sessionStatus, router]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (session && session.user) {
                try {
                    const response = await fetch(`${BACKEND_URL}/users/?${session.user.email}`);
                    const data = await response.json();
                    console.log(data)
                    setUserDetails(data);
                } catch (error) {
                    console.error("Error fetching user details", error);
                }
            }
        };

        fetchUserDetails();
    }, [session]);


    const handleJobDescriptionChange = (value: string) => {
        setJobDescription(value)
    }

    const handleGenerationModeChange = (mode: "ai" | "manual") => {
        setGenerationMode(mode)
        if (mode === "manual") {
            setEmailTemplates(["", "", ""])
        } else {
            generateAITemplates()
        }
    }

    const handleOpenAIApiKeyChange = (value: string) => {
        setOpenAIApiKey(value)
        setOpenAIApiKeyError(false)
    }


    const handleSaveKeyLocallyChange = (checked: boolean) => {
        setIsKeySavedLocally(checked)
        if (checked) {
            localStorage.setItem('openai-api-key', openAIApiKey)
        } else {
            localStorage.removeItem('openai-api-key')
        }
    }

    const handleUseSampleDescriptionChange = (checked: boolean) => {
        setUseSampleDescription(checked)
        if (checked) {
            setJobDescription(sampleDescription)
        } else {
            setJobDescription("")
        }
    }

    const handleEmailTemplateChange = (index: number, value: string) => {
        setEmailTemplates((prevTemplates) => {
            const updatedTemplates = [...prevTemplates]
            updatedTemplates[index] = value
            return updatedTemplates
        })
    }

    const handleGenerateTemplate = () => {
        if (generationMode === "ai") {
            if (openAIApiKey) {
                generateAITemplates()
            } else if (freeAIGenerations > 0) {
                generateAITemplates()
                setFreeAIGenerations(freeAIGenerations - 1)
            } else {
                setOpenAIApiKeyError(true)
            }
        }
    }

    const generateAITemplates = () => {
        const generatedTemplates = generateTemplatesFromAI(jobDescription, openAIApiKey)
        setEmailTemplates(generatedTemplates)
    }

    const generateTemplatesFromAI = (description: string, apiKey: string): string[] => {
        return [
            `Dear Hiring Manager,\n\nI am excited to apply for the [Job Title] position at [Company Name]. With my [Relevant Experience], I believe I am an excellent fit for this role.\n\nI am passionate about [Relevant Passion] and have a proven track record of [Relevant Accomplishments]. I am confident that I can contribute to your team and help [Company Name] achieve its goals.\n\nThank you for considering my application. I look forward to the opportunity to discuss my qualifications further.\n\nBest regards,\n[Your Name]`,
            `Hello [Hiring Manager's Name],\n\nI hope this email finds you well. I am writing to express my strong interest in the [Job Title] position at [Company Name].\n\nWith my [Relevant Experience], I am confident that I can make a valuable contribution to your team. I am particularly excited about the opportunity to [Relevant Passion] and leverage my skills in [Relevant Skills] to help [Company Name] [Relevant Goal].\n\nI would welcome the chance to discuss my qualifications in more detail. Please let me know if you have any questions or if there is any additional information I can provide.\n\nThank you for your consideration. I look forward to hearing from you.\n\nBest regards,\n[Your Name]`,
            `Subject: Exciting Opportunity at [Company Name]\n\nDear [Hiring Manager's Name],\n\nI hope this email finds you well. I am writing to express my strong interest in the [Job Title] position at [Company Name].\n\nWith my extensive experience in [Relevant Experience], I am confident that I can make a significant contribution to your team. I am particularly excited about the opportunity to [Relevant Passion] and leverage my skills in [Relevant Skills] to help [Company Name] [Relevant Goal].\n\nI would welcome the chance to discuss my qualifications in more detail. Please let me know if you have any questions or if there is any additional information I can provide.\n\nThank you for your consideration. I look forward to hearing from you.\n\nBest regards,\n[Your Name]`,
        ]
    }

    useEffect(() => {
        const storedKey = localStorage.getItem('openai-api-key')
        if (storedKey) {
            setOpenAIApiKey(storedKey)
        }
    }, [])

    return (
        <div className="flex w-full h-full">
            <div className="flex flex-col items-center justify-center w-full h-full gap-8 px-4 py-12 md:px-6 lg:py-10 dark:bg-gray-900 dark:text-white">
                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="dark:bg-gray-800 dark:border-gray-700 h-auto max-h-[auto]">
                        <CardHeader>
                            <CardTitle>Job Description</CardTitle>
                            <CardDescription>Paste the job description or provide a URL.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="resume">Your Resume</Label>
                                    <Input type="file" id="resume" required onChange={(e) => setSelectedFile(e.target?.files ? e.target.files[0] : null)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="job-description" className="dark:text-gray-400">
                                        Job Description
                                    </Label>
                                    <div className="flex items-center space-x-2 ">
                                        <Switch id="job-description-switch" checked={useSampleDescription} onCheckedChange={handleUseSampleDescriptionChange} />
                                        <Label htmlFor="job-description-switch" className="text-gray-600">Use Sample Job Description</Label>
                                    </div>
                                    <Textarea
                                        id="job-description"
                                        placeholder="Paste the job description here..."
                                        value={jobDescription}
                                        onChange={(e) => handleJobDescriptionChange(e.target.value)}
                                        className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                    />
                                </div>
                                {openAIApiKeyError && (
                                    <div
                                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:border-red-600 dark:text-red-400"
                                        role="alert"
                                    >
                                        <strong className="font-bold">Error:</strong>{" "}
                                        <span className="block sm:inline">
                                            Please enter a valid OpenAI API key to use the AI-powered template generation.
                                        </span>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="openai-api-key" className="dark:text-gray-400">
                                        OpenAI API Key
                                    </Label>
                                    <Input
                                        id="openai-api-key"
                                        type="text"
                                        placeholder="Enter your OpenAI API key"
                                        value={openAIApiKey}
                                        onChange={(e) => handleOpenAIApiKeyChange(e.target.value)}
                                        className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                    />
                                    <div className="flex items-center space-x-2">
                                        <Switch id="openai-api-key" checked={isKeySavedLocally} onCheckedChange={handleSaveKeyLocallyChange} disabled={!openAIApiKey} />
                                        <Label htmlFor="openai-api-key" className="text-gray-600">Save OpenAI Key Locally</Label>
                                    </div>
                                </div>
                                <div className="space-y-2 md:space-y-0 md:space-x-2 flex flex-col md:flex-row">
                                    <Button className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 w-full md:w-auto" disabled={!jobDescription || !selectedFile || !openAIApiKey}>
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Precise Generation
                                    </Button>
                                    <Button className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 w-full md:w-auto" disabled={!jobDescription || !selectedFile}>
                                        <Zap className="h-4 w-4 mr-2" />
                                        Rapid Generation
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="dark:bg-gray-800 dark:border-gray-700">
                        <CardHeader>
                            <CardTitle>Customize Email Templates</CardTitle>
                            <CardDescription>Review the generated email templates and make any necessary changes.</CardDescription>
                        </CardHeader>
                        <CardContent className="max-h-[400px] overflow-auto">
                            <div className="space-y-4  w-full">

                                <Tabs defaultValue="ai" className="">
                                    <TabsList className="w-full flex justify-evenly">
                                        <TabsTrigger value="ai" className="w-full"> <Sparkles className="h-4 w-4 mr-2" /> Precise </TabsTrigger>
                                        <TabsTrigger value="manual" className="w-full"> <Zap className="h-4 w-4 mr-2" /> Rapid </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="ai">
                                        {emailTemplates.map((template, index) => (
                                            <div key={index} className="space-y-2">
                                                <Textarea
                                                    className="min-h-[300px] resize-none space-y-2 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                                    placeholder={`Template ${index + 1}`}
                                                    value={template}
                                                    onChange={(e) => handleEmailTemplateChange(index, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </TabsContent>
                                    <TabsContent value="manual">{emailTemplates.map((template, index) => (
                                        <div key={index} className="space-y-2">
                                            <Textarea
                                                className="min-h-[300px] resize-none dark:bg-gray-700 space-y-2 dark:text-gray-300 dark:border-gray-600"
                                                placeholder={`Template ${index + 1}`}
                                                value={template}
                                                onChange={(e) => handleEmailTemplateChange(index, e.target.value)}
                                            />
                                        </div>
                                    ))}</TabsContent>
                                </Tabs>
                            </div>
                        </CardContent>
                        <CardFooter>
                        </CardFooter>
                    </Card>
                </div>
            </div>
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-auto backdrop-blur-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsMenuExpanded(!isMenuExpanded)} className="transition-transform duration-500 ease-in-out">
                        {isMenuExpanded ? <ChevronLeftIcon className="h-6 w-6" style={{ transform: 'rotate(0deg)' }} /> : (<div className="p-2"><ChevronRightIcon className="h-6 w-6" style={{ transform: 'rotate(0deg)' }} /></div>)}
                    </button>
                    {isMenuExpanded && (
                        <nav className="flex flex-row items-center gap-4">
                            <Link
                                href="#"
                                className="rounded-full p-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                prefetch={false}
                            >
                                <LayoutDashboardIcon className="h-6 w-6" />
                            </Link>
                            <Link
                                href="#"
                                className="rounded-full p-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                prefetch={false}
                            >
                                <LayoutTemplateIcon className="h-6 w-6" />
                            </Link>
                            <Link
                                href="#"
                                className="rounded-full p-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                prefetch={false}
                            >
                                <SettingsIcon className="h-6 w-6" />
                            </Link>
                        </nav>
                    )}
                </div>
            </div>
        </div>
    )
}
