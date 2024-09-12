export interface FilterItem {
    label: string;
    type: 'select' | 'toggle' | 'more';
    options?: string[]; // For select-type filters
    selected?: boolean; // For toggle-type filters
}

export interface Candidate {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    state: string,
    zipCode: number,
    country: string,
    referredBy: string,
    resumeUrl: string
  }

  export interface DBCandidate {
    id: number,
    name: string,
    email: string,
    phone: string,
    city: string,
    state: string,
    createdDate: string,
    title: string,
    companyName: string
  }