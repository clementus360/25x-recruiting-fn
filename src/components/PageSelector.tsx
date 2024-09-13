'use client'

import Image from "next/image";
import NextIcon from "@/assets/next.svg";
import PreviousIcon from "@/assets/previous.svg";
import { useState, FC } from "react";

// Define the prop types for the PageNumber component
interface PageNumberProps {
  number: number;
  selected: boolean;
  setCurrentPage: (number: number) => void;
}

// Define the prop types for the PageSelector component
interface PageSelectorProps {
  pageNumber: number;
  changePage: (page: number) => void;
}

// PageNumber component
const PageNumber: FC<PageNumberProps> = ({ number, selected, setCurrentPage }) => {
  return (
    <button
      onClick={() => setCurrentPage(number)}
      className={`h-8 aspect-square border-[0.05rem] ${
        selected ? "bg-lightViolet text-white" : "text-black"
      } border-gray-400`}
    >
      {number}
    </button>
  );
};

// PageSelector component
const PageSelector: FC<PageSelectorProps> = ({ pageNumber, changePage }) => {
  const [page, setPage] = useState<number>(1);
  const maxPagesToShow = 5;

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
    const pageItems: JSX.Element[] = [];
    const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
    const startPage = Math.max(1, page - halfMaxPagesToShow);
    const endPage = Math.min(pageNumber, page + halfMaxPagesToShow);

    // Conditionally add the first page
    if (startPage > 1) {
      pageItems.push(
        <PageNumber key={1} number={1} selected={page === 1} setCurrentPage={handleSetPage} />
      );
      if (startPage > 2) {
        pageItems.push(<span key="start-ellipsis">...</span>);
      }
    }

    // Add the main page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageItems.push(
        <PageNumber key={i} number={i} selected={i === page} setCurrentPage={handleSetPage} />
      );
    }

    // Conditionally add the last page
    if (endPage < pageNumber) {
      if (endPage < pageNumber - 1) {
        pageItems.push(<span key="end-ellipsis">...</span>);
      }
      pageItems.push(
        <PageNumber key={pageNumber} number={pageNumber} selected={page === pageNumber} setCurrentPage={handleSetPage} />
      );
    }

    return pageItems;
  };

  return (
    <section className="flex flex-col lg:flex-row gap-4 lg:gap-0 items-center w-full justify-between">
      <div>
        <p>
          Page {page} {pageNumber > 0 ? `of ${pageNumber}` : ""}
        </p>
      </div>
      <div className="flex items-center lg:self-end">
        <button onClick={handlePrevious} className="text-white bg-primary border-primary border-[0.05rem] py-2 px-3 rounded-l-lg">
          <Image src={PreviousIcon} height={8} width={8} alt={"previous"} />
        </button>

        {DisplayPagination()}

        <button onClick={handleNext} className="text-white bg-primary border-primary border-[0.05rem] py-2 px-3 rounded-r-lg">
          <Image src={NextIcon} height={8} width={8} alt={"next"} />
        </button>
      </div>
    </section>
  );
};

export default PageSelector;
