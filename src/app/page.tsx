'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    // If there is no accessToken or it's invalid, redirect to the sign-in page
    if (!accessToken) {
        router.push("/sign-in");
    } else {
      router.push("/dashboard");// Validate the token
    }
}, [router]);

  return (
    <main>
      <div>
        Home
      </div>
    </main>
  );
}
