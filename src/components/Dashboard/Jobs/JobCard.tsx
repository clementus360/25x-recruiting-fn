'use client'

import Image from "next/image";

import LinkIcon from "@/assets/link.svg"
import Link from "next/link";
import { JobCardData } from "@/types/jobTypes";

export default function JobCard(props: JobCardData) {

    const { id, title, applicantCount, candidateCount, city, hiringManager, createdDate, hiresCount, state, status, visibility } = props

    return (
        <Link href={`/dashboard/jobs/${id}/applicants`}>
            <div className="flex flex-col text-wrap gap-4 bg-lightBlue px-8 py-8 rounded-lg drop-shadow-md">
                <div className="flex flex-col">
                    <h3 className="font-semibold text-xl">{title}</h3>
                    <p className="text-accent font-light">{city},{state}</p>
                </div>

                <div className="flex flex-col gap-8 lg:gap-24 lg:flex-row justify-between items-center">

                    <div className="flex lg:w-full justify-between gap-8 lg:gap-16">
                        <div className="flex flex-col items-center">
                            <p className="text-accent text-4xl font-bold">{applicantCount}</p>
                            <p className="text-sm text-grey font-light">Applicants</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <p className="text-accent text-4xl font-bold">{candidateCount}</p>
                            <p className="text-sm text-grey font-light">Candidates</p>
                        </div>

                        <div className="flex flex-col items-center">
                            <p className="text-accent text-4xl font-bold">{hiresCount}</p>
                            <p className="text-sm text-grey font-light">Hires</p>
                        </div>
                    </div>

                    <div className="flex flex-col w-full lg:w-max gap-2 items-start">
                        <p className="text-sm font-bold lg:text-nowrap">Hiring Manager: <span className="text-grey font-light">{hiringManager}</span></p>
                        <p className="text-sm font-bold lg:text-nowrap">Status: <span className="text-grey font-light">{status}</span></p>
                        <p className="text-sm font-bold lg:text-nowrap">Visibility: <span className="text-grey font-light">{visibility}</span></p>
                    </div>

                    <button className="flex w-full gap-2 items-center justify-center bg-primary hover:bg-opacity-80  h-max px-4 py-2 text-white text-sm font-bold rounded-md">
                        <Image src={LinkIcon} height={14} width={14} alt={"search"} />
                        <p className="text-xs">View job</p>
                    </button>

                </div>
            </div>
        </Link>
    )
}