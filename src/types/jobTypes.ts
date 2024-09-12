import { ReactNode } from "react";

export interface JobCardData {
  id: number;
  title: string;
  description: string;
  status: 'internal' | 'external';
  hiringManager: string;
  category: string;
  city: string;
  state: string;
  createdDate: string;
  applicantCount: number;
  candidateCount: number;
  hiresCount: number;
  visibility: string
}

export interface Job {
  id: number,
  companyId: number,
  title: string,
  category: string,
  seats: number,
  payRate: number,
  payFrequency: string,
  managementRole: string,
  employmentType: string,
  address: string,
  city: string,
  state: string,
  country: string,
  zipCode: number,
  description: string,
  createdAt: string,
  status: string,
  visibility: string
}

export type FormDataType = {
  jobTitle: string;
  category: string;
  department: string;
  seats: number;
  payRate: number;
  payPeriod: string;
  payFrequency: string;
  managementRole: string;
  employmentType: string;
  hireType: string;
  hiringManager: string;
  search: string;
  isRemote: boolean;
  country: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  description: string;
  status: string;
  visibility: string
};

export type FormDataContextType = {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
};

export type FormDataProviderProps = {
  children: ReactNode;
};

export type ApplicantFormDataType = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  referredBy: string;
  resumeUrl: string;
};

export interface UserComment {
  id: number;
  comment: string;
  createdDate: string;
  names: string
}

export interface HiringManager {
  id: number;
  firstName: string;
  lastName: string
}