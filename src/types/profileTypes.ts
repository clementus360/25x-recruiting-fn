export interface ProfileFormData {
    companyName: string;
    website: string;
    phone: string;
    address: string;
    country: string;
    state: string;
    city: string;
    postal: string;
    image: string | null;
};

export interface Company {
    companyId: number;
    companyName: string;
    companyWebsite?: string;
    companyPhone: string;
    companyEmail: string;
    registrationToken: string;
    registrationStatus: 'pending' | 'approved' | 'rejected';
    companyAddress?: string;
    companyCity?: string;
    companyState?: string;
    companyCountry?: string;
    companyZipCode?: string;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roleName: string;
    createdDate: string
}

export interface UserUpdateData {
    string: string,
    title: string,
    email: string,
    oldPassword: string,
    newPassword: string
}

export interface CompanyUpdateData{
    companyName: string;
    website: string;
    ownerPhone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip: string;
}

export interface CompanyData{
    id: number;
    companyName: string;
    website: string;
    ownerPhone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip: number;
}