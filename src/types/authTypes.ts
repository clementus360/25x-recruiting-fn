export type FormDataType = {
    phone: string;
    email: string;
    fname: string;
    lname: string;
    jobTitle: string;
    company: string;
    employees: string;
    industry: string;
};

export type ApiError = {
    message: string[];
    error: string;
    statusCode: number;
};

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    title: string;
    userRole: string;
    note: string;
}

export interface CompanyData {
    id: string,
    companyName: string,
    website: string,
    ownerPhone: string,
    address: string,
    city: string,
    state: string,
    country: string,
    zip: string
}