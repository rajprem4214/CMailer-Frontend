"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

const handleGoogleAuth = () => {
    signIn("google");
}

export default function SignIn() {
    return (
        <div className="flex flex-col min-h-dvh w-full items-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
            <div className="max-w-3xl space-y-4 text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-center">
                    CMailer
                </h1>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Personalized Cold Email Templates
                </h1>
                <p className="text-gray-500 dark:text-gray-400 md:text-xl">
                    Upload your resume and the job description, and let our tool generate customized email templates
                    for you.
                </p>
            </div>
            <div className="flex items-center justify-center mt-9">
                <div className="mx-auto w-full max-w-md space-y-6">
                    <div className="text-center mt-9">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Welcome!</h1>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">Sign in to your account to continue</p>
                    </div>
                    <Card>
                        <CardContent className="space-y-4">
                            <Button
                                onClick={handleGoogleAuth}
                                variant="outline"
                                className="w-full mt-5 justify-center items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:focus:ring-gray-300 dark:focus:ring-offset-gray-950"
                            >
                                <ChromeIcon className="h-5 w-5" />
                                Sign in with Google
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            
        </div>
    )
}

function ChromeIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <line x1="21.17" x2="12" y1="8" y2="8" />
            <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
            <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
        </svg>
    )
}