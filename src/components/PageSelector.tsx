'use client'

import Image from "next/image";

import NextIcon from "@/assets/next.svg"
import PreviousIcon from "@/assets/previous.svg"
import { useState } from "react";

function PageNumber({ number, selected, setCurrentPage }: { number: number, selected: boolean, setCurrentPage: (number: number) => void }) {
    return (
        <button
            onClick={() => setCurrentPage(number)}
            className={`h-8 aspect-square border-[0.05rem] ${selected ? 'bg-lightViolet text-white' : 'text-black'} border-gray-400`}
        >
            {number}
        </button>
    )
}

export default function PageSelector({ pageNumber, changePage }: { pageNumber: number, changePage: (page: number) => void }) {
    const [page, setPage] = useState(1);
    const [showAllPages, setShowAllPages] = useState(false); // Track ellipsis state'

    console.log("Page number: ", pageNumber)

    const handleSetPage = (number: number) => {
        setPage(number);
        changePage(number);
    };

    const handleNext = () => {
        if (page < pageNumber) {
            setPage((prev) => prev + 1);
            changePage(page + 1);
        }
    };

    const handlePrevious = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
            changePage(page - 1);
        }
    };

    const DisplayPagination = () => {
        let pageItems = [];
        const maxPagesToShow = 4;
        const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);

        if (showAllPages || pageNumber <= maxPagesToShow) {
            for (let i = 1; i <= pageNumber; i++) {
                pageItems.push(
                    <PageNumber key={i} number={i} selected={i === page} setCurrentPage={handleSetPage} />
                );
            }
        } else {
            if (page <= halfMaxPagesToShow) {
                for (let i = 1; i <= maxPagesToShow - 1; i++) {
                    pageItems.push(
                        <PageNumber key={i} number={i} selected={i === page} setCurrentPage={handleSetPage} />
                    );
                }
                pageItems.push(
                    <button
                        key="ellipsis-end"
                        onClick={() => setShowAllPages(true)}
                        className="flex items-center justify-center text-center h-8 aspect-square border-[0.05rem] border-gray-400"
                    >
                        ...
                    </button>
                );
                pageItems.push(
                    <PageNumber key={pageNumber} number={pageNumber} selected={pageNumber === page} setCurrentPage={handleSetPage} />
                );
            } else if (page > pageNumber - halfMaxPagesToShow) {
                pageItems.push(
                    <PageNumber key={1} number={1} selected={page === 1} setCurrentPage={handleSetPage} />
                );
                pageItems.push(
                    <button
                        key="ellipsis-start"
                        onClick={() => setShowAllPages(true)}
                        className="flex items-center justify-center text-center h-8 aspect-square border-[0.05rem] border-gray-400"
                    >
                        ...
                    </button>
                );
                for (let i = pageNumber - maxPagesToShow + 2; i <= pageNumber; i++) {
                    pageItems.push(
                        <PageNumber key={i} number={i} selected={i === page} setCurrentPage={handleSetPage} />
                    );
                }
            } else {
                pageItems.push(
                    <PageNumber key={1} number={1} selected={page === 1} setCurrentPage={handleSetPage} />
                );
                pageItems.push(
                    <button
                        key="ellipsis-start"
                        onClick={() => setShowAllPages(true)}
                        className="flex items-center justify-center text-center h-8 aspect-square border-[0.05rem] border-gray-400"
                    >
                        ...
                    </button>
                );
                for (let i = page - 1; i <= page + 1; i++) {
                    pageItems.push(
                        <PageNumber key={i} number={i} selected={i === page} setCurrentPage={handleSetPage} />
                    );
                }
                pageItems.push(
                    <button
                        key="ellipsis-end"
                        onClick={() => setShowAllPages(true)}
                        className="flex items-center justify-center text-center h-8 aspect-square border-[0.05rem] border-gray-400"
                    >
                        ...
                    </button>
                );
                pageItems.push(
                    <PageNumber key={pageNumber} number={pageNumber} selected={pageNumber === page} setCurrentPage={handleSetPage} />
                );
            }
        }

        return pageItems;
    };


    return (
        <section className="flex flex-col lg:flex-row gap-4 lg:gap-0 items-center w-full justify-between">
            <div>
                <p>Page {page} {pageNumber>0? `of ${pageNumber}`:''}</p>
            </div>
            <div className="flex items-center lg:self-end">
                <button onClick={handlePrevious} className="text-white bg-primary border-primary border-[0.05rem] py-2 px-3 rounded-l-lg">
                    <Image src={PreviousIcon} height={8} width={8} alt={"search"} />
                </button>

                {DisplayPagination()}

                <button onClick={handleNext} className="text-white bg-primary border-primary border-[0.05rem] py-2 px-3 rounded-r-lg">
                    <Image src={NextIcon} height={8} width={8} alt={"search"} />
                </button>
            </div>
        </section>
    );
}
