import { UserComment } from "./jobTypes";

export interface RecentApplications {
  id: number;
  date: string;
  name: string;
  job: string;
  resume: boolean;
  coverLetter: boolean;
  application: string;
}

export interface Application {
  applicationId: number;
  jobId: number;
  applicantId: number;
  applicationStatus: 'screened' | 'not screened' | 'do not hire';
  coverLetterURL: string;
  createdAt: string;
  updatedAt: string;
}

export interface Applicant {
  applicantId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  state: string;
  resumeUrl: string;
  rate: number;
  notes: string[];
  status: 'do_not_hire' | 'applicant' | 'candidate' | 'hired' | 'not_fit' | 'declined';
  source: 'internal' | 'external';
  createdAt: string;
  updatedAt: string
}

export interface DBApplicant {
  applicantId: number,
  applicantName: string,
  createdDate: string,
  source: string,
  resumeUrl: string,
  coverLetterUrl: string,
  numOfRatings: number,
  applicantComments:  UserComment[]
}

export interface DBDeclined {
  applicantId: number,
  applicantName: string,
  email: string,
  createdDate: string,
  reasonForDecline: string,
  source: string,
  resumeUrl: string,
  coverLetterUrl: string,
  numOfRatings: number,
  applicantComments:  UserComment[]
}

export interface DBTestApplicant {
  applicantId: number,
  applicantName: string,
  createdDate: string,
  source: string,
  resumeUrl: string,
  email: string,
  applicantPhone: string,
  city: string,
  state: string,
  coverLetterUrl: string,
  numOfRatings: number,
  applicantComments: UserComment[]
}

export interface ApplicantRowProps {
  applicant: DBApplicant;
  page: number;
  handleLoad: () => void;
}

export interface DeclinedRowProps {
  applicant: DBDeclined;
  page: number;
  handleLoad: () => void;
}

export interface HireRowProps {
  applicant: DBTestApplicant;
  page: number;
  handleLoad: () => void;
}

export interface DBSingleApplicant {
  id: number,
  firstName: string,
  lastName: string,
  createdDate: string,
  status:  "APPLICANT" | "CANDIDATE" | "HIRED" | "DECLINED",
  source: string,
  resume: string,
  email: string,
  phone: string,
  address: string
  city: string,
  country: string,
  state: string,
  zipCode: number,
  referredBy: string,
  coverLetterUrl: string,
  rating: number,
  notes: UserComment[]
}

