import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import SearchIcon from "@/assets/search.svg"
import { candidateNavItems } from "@/data/constants"
import Select from "@/components/Select"
import { useEffect, useState } from "react"

export default function ScreeningNavigation() {
    const [location, setLocation] = useState("FortMyers");
    const router = useRouter();
    const pathname = usePathname()
    const basepath = pathname.split('/').slice(-1)[0]

    useEffect(() => {
        router.push(`${pathname}?location=${location}`);
    })

    const handleLocationChange = (value: string) => {
        setLocation(value)
        router.push(`${pathname}?location=${value}`);
    }

    return (
        <div className="flex flex-col lg:flex-row lg:gap-40 justify-between items-center lg:items-start gap-4 px-4 lg:px-8 pt-4 pb-4 lg:pb-0 bg-gray-100">
            <nav className="w-full lg:w-auto">
                <ul className="flex flex-col lg:flex-row gap-2 text-nowrap">
                    {candidateNavItems.map((item, idx) => (
                        <Link key={idx} href={`/dashboard/screening/${item.path}?location=${location}`}><li className={`relative ${basepath === item.path ? 'bg-lightViolet' : ''} py-3 px-8 text-sm font-medium rounded-t-lg`}>
                            {item.name}
                            <div className={`absolute ${basepath === item.path ? 'block' : 'hidden'} w-full h-[0.2rem] rounded-t-lg bg-accent left-0 bottom-0`}></div>
                        </li></Link>
                    ))}

                </ul>
            </nav>

            <Select
                options={[
                    { value: "FortMyers", label: "Fort Myers" },
                    { value: "Sarasota", label: "Sarasota" },
                ]}
                value={location}
                onChange={(value) => handleLocationChange(value)}
                className="w-full"
            />
        </div>
    )
}