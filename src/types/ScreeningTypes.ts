import { JobCardData, UserComment } from "./jobTypes";

export interface DBScreeningApplicant {
    applicantId: number,
    jobId: number,
    applicantName: string,
    applicantPhone: string,
    email: string,
    reasonForDecline: string,
    createdDate: string,
    source: string,
    resumeUrl: string,
    coverLetterUrl: string,
    numOfRatings: number,
    applicantComments:  UserComment[]
  }

export interface ScreeningRowProps {
    applicant: DBScreeningApplicant;
    page: number;
    selectedRows: number[];
    handleSelectRow: (applicantId: number) => void;
    handleLoad: () => void;
    jobs: JobCardData[]
  }