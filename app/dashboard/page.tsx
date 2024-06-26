"use client"
import { useState, useEffect, useRef } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSession, signOut } from 'next-auth/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, Copy, CopyIcon, DownloadIcon, FileIcon, FilePenIcon, LayoutDashboardIcon, LayoutTemplateIcon, MailPlus, MountainIcon, SettingsIcon, ShareIcon, Sparkles, Zap } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { sampleJobDescription } from "@/lib/utils"
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';
import SmallLoader from "@/components/LoadingSmall"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!

interface UserDetails {
    aiKeyUsage?: number;
    name?: string;
    email?: string;
}

interface CustomSession extends Session {
    loggedUser?: string;
}

interface Template {
    body: string;
}

export default function Component() {
    const [jobDescription, setJobDescription] = useState<string>("")
    const [preciseEmailTemplates, setPreciseEmailTemplates] = useState<string[]>(["", "", ""]);
    const [rapidEmailTemplates, setRapidEmailTemplates] = useState<string[]>(["", "", ""]);
    const [openAIApiKey, setOpenAIApiKey] = useState<string>("")
    const [openAIApiKeyError, setOpenAIApiKeyError] = useState<boolean>(false)
    const [isMenuExpanded, setIsMenuExpanded] = useState<boolean>(false)
    const [isKeySavedLocally, setIsKeySavedLocally] = useState<boolean>(localStorage.getItem('openai-api-key') !== null)
    const [useSampleDescription, setUseSampleDescription] = useState<boolean>(false)
    const [aiKeyUsage, setAiKeyUsage] = useState<number>(0)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { data: session, status: sessionStatus } = useSession() as { data: CustomSession | null, status: 'loading' | 'authenticated' | 'unauthenticated' };;
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [triggerFetchUserDetails, setTriggerFetchUserDetails] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("ai");
    const [isGeneratingPrecise, setIsGeneratingPrecise] = useState<boolean>(false);
    const [isGeneratingRapid, setIsGeneratingRapid] = useState<boolean>(false);
    const sampleDescription = sampleJobDescription

    const { toast } = useToast()

    useEffect(() => {
        if (triggerFetchUserDetails) {
            fetchUserDetails().then(() => setTriggerFetchUserDetails(false));
        }
    }, [triggerFetchUserDetails]);

    const router = useRouter();

    useEffect(() => {
        const storedKey = localStorage.getItem('openai-api-key')
        if (storedKey) {
            setOpenAIApiKey(storedKey)
        }
    }, [])

    useEffect(() => {
        if (!session) {
            router.push('/');
        }
    }, [session, sessionStatus, router]);

    useEffect(() => {
        fetchUserDetails();
    }, [session]);

    const fetchUserDetails = async () => {
        if (session && session.user) {
            try {
                const response = await fetch(`${BACKEND_URL}/users/?${session.user.email}`, {
                    headers: {
                        'Authorization': `Bearer ${session?.loggedUser}`
                    }
                });
                const data = await response.json();
                console.log(data[0]?.aiKeyUsage)
                setAiKeyUsage(data[0]?.aiKeyUsage)
            } catch (error) {
                console.error("Error fetching user details", error);
            }
        }
    };

    const handleJobDescriptionChange = (value: string) => {
        setJobDescription(value)
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

    const handlePreciseTemplateChange = (index: number, newValue: string) => {
        setPreciseEmailTemplates(prevTemplates => {
            const newTemplates = [...prevTemplates];
            newTemplates[index] = newValue;
            return newTemplates;
        });
    };

    const handleRapidTemplateChange = (index: number, newValue: string) => {
        setRapidEmailTemplates(prevTemplates => {
            const newTemplates = [...prevTemplates];
            newTemplates[index] = newValue;
            return newTemplates;
        });
    };

    const handleGenerateEmailTemplates = async () => {
        setIsGeneratingPrecise(true);
        toast({
            description: "Generating Email Templates (Precise Mode).",
        })
        if (!selectedFile || !jobDescription) {
            console.error("File or job description is missing");
            return;
        }

        const formData = new FormData();
        formData.append('resume', selectedFile);
        formData.append('jobDescription', jobDescription);
        formData.append('email', session?.user?.email as string);
        if (openAIApiKey) {
            formData.append('apiKey', openAIApiKey);
        }

        try {
            const response = await fetch(`${BACKEND_URL}/resume/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${session?.loggedUser}`
                }
            });

            if (!response.ok) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                })
                throw new Error('Failed to generate precise email templates');
            }

            const data = await response.json();
            setTriggerFetchUserDetails(true);

            const contentWithoutBackticks = data.emailTemplate.message.content.replace(/```json\n|\n```/g, '');
            const templates = JSON.parse(contentWithoutBackticks);
            setPreciseEmailTemplates(templates.map((template: Template) => template.body));
            setIsGeneratingPrecise(false);
            toast({
                variant: "default",
                title: "Email Templates Generated (Precise Mode).",
            })
        } catch (error) {
            console.error("Error generating precise email templates:", error);
        }
    };

    const handleGenerateRapidEmailTemplates = async () => {
        setActiveTab("manual");
        setIsGeneratingRapid(true);
        toast({
            description: "Generating Email Templates (Rapid Mode).",
        })
        if (!selectedFile || !jobDescription) {
            console.error("File or job description is missing");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('jobDescription', jobDescription);
        formData.append('email', session?.user?.email as string);

        try {
            const response = await fetch(`${BACKEND_URL}/resume/rapidTemplates`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${session?.loggedUser}`
                }
            });

            if (!response.ok) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                })
                throw new Error('Failed to generate rapid email templates');
            }

            const data = await response.json();
            setTriggerFetchUserDetails(true);
            const rapidTemplates = data?.rapidTemplates;

            setRapidEmailTemplates(rapidTemplates);
            setIsGeneratingRapid(false);
            toast({
                variant: "default",
                title: "Email Templates Generated (Rapid Mode).",
            })
        } catch (error) {
            console.error("Error generating rapid email templates:", error);
        }
    };

    return (
        <div className="flex w-full h-full no-scrollbar">
            <div className="flex flex-col items-center justify-center w-full h-full gap-8 px-4 py-12 md:px-6 lg:py-10 dark:bg-gray-900 dark:text-white">
                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="dark:bg-gray-800 dark:border-gray-700 h-auto max-h-[auto]">
                        <CardHeader>
                            <Breadcrumb>
                                <BreadcrumbList>
                                    {/* <BreadcrumbItem>
                                        <BreadcrumbLink>
                                            <Link href="/">Home</Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator /> */}
                                    <BreadcrumbItem>
                                        <BreadcrumbLink>
                                            <Link href="/dashboard">Dashboard</Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbLink>
                                            <Link href="" onClick={() => signOut()}>Signout</Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                            <CardTitle className="mt-2">Job Description</CardTitle>
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
                                {aiKeyUsage === 0 && !openAIApiKey && (
                                    <div
                                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative dark:bg-red-900 dark:border-red-600 dark:text-red-400"
                                        role="alert"
                                    >
                                        <strong className="font-bold">Info:</strong>{" "}
                                        <span className="block sm:inline">
                                            Your free usage limit has been reached. Please use your own API key.
                                        </span>
                                    </div>
                                )}
                                <div className="space-y-2 md:space-y-0 md:space-x-2 flex flex-col md:flex-row">
                                    {isGeneratingPrecise ? (
                                        <SmallLoader />
                                    ) : (
                                        <Button className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 w-full md:w-auto" disabled={!jobDescription || !selectedFile || (!openAIApiKey && (aiKeyUsage === 0))} onClick={handleGenerateEmailTemplates}>
                                            <Sparkles className="h-4 w-4 mr-2" />
                                            Precise Generation
                                        </Button>
                                    )}
                                    {isGeneratingRapid ? (
                                        <SmallLoader />
                                    ) : (
                                        <Button className="dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 w-full md:w-auto" disabled={!jobDescription || !selectedFile} onClick={handleGenerateRapidEmailTemplates} >
                                            <Zap className="h-4 w-4 mr-2" />
                                            Rapid Generation
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="dark:bg-gray-800 dark:border-gray-700">
                        <CardHeader>
                            <CardTitle>Customize Email Templates</CardTitle>
                            <CardDescription>Review the generated email templates and make any necessary changes.</CardDescription>
                        </CardHeader>
                        <CardContent className="max-h-[500px] no-scrollbar overflow-auto">
                            <div className="space-y-4  w-full">
                                <Tabs defaultValue="ai" value={activeTab} onValueChange={setActiveTab} className="">
                                    <TabsList className="w-full flex justify-evenly">
                                        <TabsTrigger value="ai" className="w-full"> <Sparkles className="h-4 w-4 mr-2" /> Precise </TabsTrigger>
                                        <TabsTrigger value="manual" className="w-full"> <Zap className="h-4 w-4 mr-2" /> Rapid </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="ai">
                                        {preciseEmailTemplates.map((template, index) => (
                                            <div key={index} className="space-y-2 border rounded-lg mt-3">
                                                <header className="bg-gray-100 px-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <FileIcon className="h-5 w-5 text-gray-500" />
                                                        <span className="text-sm font-medium">{`Template ${index + 1}`}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button disabled={!template} onClick={() => navigator.clipboard.writeText(template)} variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                                                            <CopyIcon className="h-5 w-5" />
                                                            <span className="sr-only">Copy text</span>
                                                        </Button>
                                                        <Button disabled={!template} variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                                                            <ShareIcon className="h-5 w-5" />
                                                            <span className="sr-only">Share text</span>
                                                        </Button>
                                                        <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(template)}`} download={`template_${index + 1}.txt`} className={`text-gray-500 hover:text-gray-700 ${!template ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                            <DownloadIcon className="h-5 w-5" />
                                                            <span className="sr-only">Download text</span>
                                                        </a>
                                                    </div>
                                                </header>
                                                {isGeneratingPrecise ? (<div className="space-y-2 h-auto p-2 w-full">
                                                    <Skeleton className="h-6 w-[40%] bg-gray-200" />
                                                    <Skeleton className="h-[40px] w-[90%] bg-gray-200" />
                                                    <Skeleton className="h-[70px] w-[80%] bg-gray-200" />
                                                    <Skeleton className="h-[40px] w-[90%] bg-gray-200" />
                                                    <Skeleton className="h-[30px] w-[60%] bg-gray-200" />
                                                </div>) : (<Textarea
                                                    className="min-h-[300px] resize-none dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                                    placeholder={`Template ${index + 1}`}
                                                    value={template}
                                                    onChange={(e) => handlePreciseTemplateChange(index, e.target.value)}
                                                />)}

                                            </div>
                                        ))}
                                    </TabsContent>
                                    <TabsContent value="manual">{rapidEmailTemplates.map((template, index) => (
                                        <div key={index} className="space-y-2 border rounded-lg mt-3">
                                            <header className="bg-gray-100 px-4 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FileIcon className="h-5 w-5 text-gray-500" />
                                                    <span className="text-sm font-medium">{`Template ${index + 1}`}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button disabled={!template} onClick={() => navigator.clipboard.writeText(template)} variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                                                        <CopyIcon className="h-5 w-5" />
                                                        <span className="sr-only">Copy text</span>
                                                    </Button>
                                                    <Button disabled={!template} variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                                                        <ShareIcon className="h-5 w-5" />
                                                        <span className="sr-only">Share text</span>
                                                    </Button>
                                                    <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(template)}`} download={`template_${index + 1}.txt`} className={`text-gray-500 hover:text-gray-700 ${!template ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}>
                                                        <DownloadIcon className="h-5 w-5" />
                                                        <span className="sr-only">Download text</span>
                                                    </a>
                                                </div>
                                            </header>
                                            {isGeneratingRapid ? (<div className="space-y-2 h-auto p-2 w-full">
                                                <Skeleton className="h-6 w-[40%] bg-gray-200" />
                                                <Skeleton className="h-[40px] w-[90%] bg-gray-200" />
                                                <Skeleton className="h-[70px] w-[80%] bg-gray-200" />
                                                <Skeleton className="h-[40px] w-[90%] bg-gray-200" />
                                                <Skeleton className="h-[30px] w-[60%] bg-gray-200" />
                                            </div>) : (<Textarea
                                                className="min-h-[300px] resize-none dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                                placeholder={`Template ${index + 1}`}
                                                value={template}
                                                onChange={(e) => handlePreciseTemplateChange(index, e.target.value)}
                                            />)}
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
            {/* <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-auto backdrop-blur-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 flex items-center justify-between gap-4">
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
            </div> */}
        </div>
    )
}
