import Link from "next/link"
import { usePathname } from "next/navigation"

import SearchIcon from "@/assets/search.svg"
import { candidateNavItems} from "@/data/constants"

export default function CandidateNavigation() {

    const pathname = usePathname()
    const basepath = pathname.split('/').slice(-1)[0]

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