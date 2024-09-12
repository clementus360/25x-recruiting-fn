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
  applicantComments: string[]
}

export interface DBTestApplicant {
  applicantId: number,
  applicantName: string,
  createdDate: string,
  source: string,
  resumeUrl: string,
  email: string,
  phone: string,
  city: string,
  state: string,
  coverLetterUrl: string,
  numOfRatings: number,
  applicantComments: string[]
}

export interface ApplicantRowProps {
  applicant: DBApplicant;
  page: number;
  selectedRows: number[];
  handleSelectRow: (applicantId: number) => void;
  handleLoad: (load: boolean) => void;
}

export interface HireRowProps {
  applicant: DBTestApplicant;
  page: number;
  selectedRows: number[];
  handleSelectRow: (applicantId: number) => void;
  handleLoad: (load: boolean) => void;
}

