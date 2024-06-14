import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "CMailer",
    description: "Get Personalized Cold Emails from your Resume",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            {children}
        </div>
    );
}
