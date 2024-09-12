import Link from "next/link"
import { usePathname } from "next/navigation"

import { navItems } from "@/data/constants"

export default function JobNavigation({ jobId }: { jobId: string }) {

    const pathname = usePathname()
    const basepath = pathname.split('/').slice(-1)[0]

    return (
        <div className="flex flex-col lg:flex-row justify-between px-4 lg:px-8 pt-4 pb-4 lg:pb-0 bg-gray-100">
            <nav className="w-full lg:w-auto">
                <ul className="flex flex-col lg:flex-row gap-2">
                    {navItems.map((item, idx) => (
                        <Link key={idx} href={`/dashboard/jobs/${jobId}/${item.path}`}>
                            <li className={`relative ${basepath === item.path ? 'bg-lightViolet' : ''} py-3 px-4 lg:px-8 text-sm font-medium rounded-t-lg`}>
                                {item.name}
                                <div className={`absolute ${basepath === item.path ? 'block' : 'hidden'} w-full h-[0.2rem] rounded-t-lg bg-accent left-0 bottom-0`}></div>
                            </li>
                        </Link>
                    ))}
                </ul>
            </nav>
        </div>
    )
}