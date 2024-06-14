"use client"
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Session } from 'next-auth'
import Loader from "@/components/Loading";
import SignIn from "@/components/SignIn";

interface Props {
  session: Session | null
}

const HomeContent: React.FC = () => {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
  }, [sessionStatus, router]);

  if (sessionStatus === "loading") {
    return <Loader />;
  }

  if (sessionStatus === "unauthenticated") {
    return <SignIn />;
  }

  return null;
};

const Home: React.FC<Props> = ({ session }) => {
  return (
    <SessionProvider session={session}>
      <HomeContent />
    </SessionProvider>
  );
};

export default Home;