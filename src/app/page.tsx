'use client'

import LoadingPage from "@/components/Dashboard/LoadingPage";
import { getAccessToken, parseJwt } from "@/data/cookies";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const accessToken = getAccessToken();

    if (!accessToken) {

      router.replace('/sign-in');

    } else {

      const tokenPayload = parseJwt(accessToken);

      if (!tokenPayload) {
        throw new Error("Invalid token. Please try again.");
      }

      if (tokenPayload.role === 'onboarding') {
        router.replace('/onboarding');
      } else {
        router.replace('/dashboard/jobs');
      }
    }

  }, [router]);

  if (isLoading) {
    return (
      <LoadingPage loading={isLoading} />
    );
  }

  return (
    <main>
      <div>
        Home
      </div>
    </main>
  );
}
