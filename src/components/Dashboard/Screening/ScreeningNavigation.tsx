import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import SearchIcon from "@/assets/search.svg"
import { candidateNavItems } from "@/data/constants"
import Select from "@/components/Select"
import { useEffect, useState } from "react"

export default function ScreeningNavigation() {
    const [location, setLocation] = useState("FortMyers");
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname()
    const basepath = pathname.split('/').slice(-1)[0]

    useEffect(() => {
        router.push(`${pathname}?location=${location}`);
    }, [])

    const handleLocationChange = (value: string) => {
        setLocation(value)
        router.push(`${pathname}?location=${value}`);
    }

    return (
        <div className="flex justify-between px-8 pt-4 bg-gray-100">
            <nav>
                <ul className="flex gap-2">
                    {candidateNavItems.map((item, idx) => (
                        <Link key={idx} href={`/dashboard/screening/${item.path}`}><li className={`relative ${basepath === item.path ? 'bg-lightViolet' : ''} py-3 px-8 text-sm font-medium rounded-t-lg`}>
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
            />

            <input style={{
                background: `url(${SearchIcon.src})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '1rem',
                backgroundSize: '1.5rem',
            }}
                className={` h-max py-2 border-[0.01rem] border-grey px-12 rounded-md text-sm`} type="search" name="search-jobs" id="search-jobs" placeholder="Search Jobs"
            />
        </div>
    )
}