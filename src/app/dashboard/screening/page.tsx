'use client'

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Page() {

    useEffect(() => {
        redirect('/dashboard/screening/fit-for-hire')
    })

    return (
      <main className="flex min-h-screen flex-col justify-between py-8 px-8">
          <h1 className="text-3xl font-bold">Dashboard/screening/fit-for-hire</h1>
      </main>
    );
  }