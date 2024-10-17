import { Applicant, Application, RecentApplications } from "@/types/applicationTypes"
import { Company } from "@/types/profileTypes";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const stats = [
    {
        id: 1,
        number: 366,
        title: "Applicants and candidates ready for review",
    },
    {
        id: 2,
        number: 14,
        title: "Onboarding tasks need manager completion",
    },
    {
        id: 3,
        number: 17,
        title: "Onboarding tasks are overdue",
    },
]

export const recentApplications: RecentApplications[] = [
    {
        id: 1,
        date: '12/06/24',
        name: 'John Doe',
        job: '25x Caregivers',
        resume: false,
        coverLetter: false,
        application: 'Unread'
    },
    {
        id: 2,
        date: '12/06/24',
        name: 'John Doe',
        job: '25x Caregivers',
        resume: false,
        coverLetter: false,
        application: 'Unread'
    },
]

export const navItems = [
    { name: 'Applicants', path: 'applicants' },
    { name: 'Candidates', path: 'candidates' },
    { name: 'Hires', path: 'hires' },
    { name: 'Declined', path: 'declined' },
    // { name: 'Details', path: 'details' }
]

export const candidateNavItems = [
    { name: 'Need Review', path: 'fit-for-hire' },
    { name: 'Do Not Hire List', path: 'do-not-hire' },
    { name: 'Not Fit List', path: 'not-fit-list' },
    { name: 'Uncategorized', path: 'uncategorized' },
]

const CompanyData: Company = {
    companyId: 1,
    companyName: "Caregivers United",
    companyWebsite: "http://caregiversunited.net/",
    companyPhone: "+1 941 225-0055",
    companyEmail: "info@caregiversunited.net", // Replace with actual email if needed
    registrationToken: "sample-registration-token",
    registrationStatus: "pending",
    companyAddress: "2075 Main Street",
    companyCity: "Sarasota",
    companyState: "Florida",
    companyCountry: "United States",
    companyZipCode: "34237",
};

export const AddJobSteps = [
    { id: 1, title: 'Details' },
    { id: 2, title: 'Description' },
    { id: 3, title: 'Preview' },
]

export const initialErrors = {
    jobTitle: '',
    category: '',
    department: '',
    seats: '',
    pay: '',
    payRange: '',
    payPeriod: '',
    payFrequency: '',
    managementRole: '',
    employmentType: '',
    hireType: '',
    hiringManager: '',
    search: '',
    isRemote: '',
    country: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    status: '',
    visibility: ''
}

export const categories = {
    Accounting_and_Finance: 'Accounting & Finance',
    Administrative: 'Administrative',
    CustomerService: 'Customer Service',
    Education: 'Education',
    Executive: 'Executive',
    Fitness: 'Fitness',
    Healthcare: 'Healthcare',
    Hospitality: 'Hospitality',
    HumanResources: 'Human Resources',
    IT_and_Engineering: 'IT & Engineering',
    Marketing: 'Marketing',
    ProjectManager: 'Project Manager',
    Sales: 'Sales',
    Technician_SkilledLabour_Contractor: 'Technician/Skilled Labour/Contractor',
    Other: 'Other'
};

export const departments = {
    Accounting: 'Accounting',
    Administrative: 'Administrative',
    Corporate: 'Corporate',
    CustomerService: 'Customer Service',
    Executive: 'Executive',
    FacilityMaintenance: 'Facility Maintenance',
    Finance: 'Finance',
    FoodServices: 'Food Services',
    HomeCare: 'Home Care',
    HomeHealth: 'Home Health',
    Hospice: 'Hospice',
    HumanResources: 'Human Resources',
    InformationTechnology: 'Information Technology',
    Internship: 'Internship',
    Management: 'Management',
    Marketing: 'Marketing',
    MedicalStaffing: 'Medical Staffing',
    MentalHealthServices: 'Mental Health Services',
    Operations: 'Operations',
    PediatricCare: 'Pediatric Care',
    Programs_and_Activities: 'Programs and Activities',
    Sales: 'Sales',
    Security: 'Security',
    SkilledNursing: 'Skilled Nursing',
    Therapy: 'Therapy',
    TransitionalCare: 'Transitional Care',
    Transaportation: 'Transportation',
    Other: 'Other',
};

export const payPeriods = {
    YEAR: 'Year',
    MONTH: 'Month',
    WEEK: 'Week',
    DAY: 'Day',
    HOUR: 'Hour'
};

export const payFrequencies = {
    "BI-WEEKLY": 'Bi-weekly',
    "SEMI-MONTHLY": 'Semi-Monthly',
    "WEEKLY": 'Weekly',
    "MONTHLY": 'Monthly'
};

export const employmentTypes = {
    full_time_salary: 'Full-time - Salary',
    full_time_hourly: 'Full-time - Hourly',
    part_time_salary: 'Part-time - Salary',
    part_time_hourly: 'Part-time - Hourly',
    contractor: 'Contractor',
    full_time_base_plus_commission: 'Full-time - Base Plus Commission',
    full_time_commission_only: 'Full-time - Commission Only',
    part_time_base_plus_commission: 'Part-time - Base Plus Commission',
    part_time_commission_only: 'Part-time - Commission Only'
};

export const onboardingCandidates = [
    {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "123-456-7890",
        job: "Software Engineer",
        hiredDate: "2024-09-01",
        steps: [
            {
                name: "E-Signature",
                documents: [{ name: "Coded Electronic Signature Form", completed: true }],
                type: "signature"
            },
            {
                name: "Personal Information",
                documents: [
                    { name: "Personal Information", completed: true },
                    { name: "Emergency Contacts", completed: false }
                ],
                type: "form"
            },
            {
                name: "Direct Deposit",
                documents: [{ name: "Direct Deposit", completed: true }],
                type: "form"
            },
            {
                name: "Additional Documents",
                documents: [
                    { name: "References & Employment History", completed: true },
                    { name: "Electronic Signature Agreement", completed: false },
                    { name: "Confidentiality & Non-Compete Agreement", completed: true },
                    { name: "Conflict of Interest", completed: false },
                    { name: "Corporate Compliance", completed: true },
                    { name: "Orientation Checklist", completed: true },
                    { name: "PPE & Infection Control Acknowledgment", completed: false },
                    { name: "Job Acceptance", completed: true },
                    { name: "Receipt of Employee Handbook", completed: false },
                    { name: "TB TARGETED MEDICAL QUESTIONNAIRE FORM", completed: true },
                    { name: "Field Employee Standards & Procedures", completed: false },
                    { name: "Employee Safety Form Duties", completed: true },
                    { name: "Mask Policy", completed: false },
                    { name: "Privacy Policy", completed: true },
                    { name: "HEPATITIS VACCINE REQUIREMENT", completed: false }
                ],
                type: "form"
            },
            {
                name: "Test/Certifications",
                documents: [
                    { name: "HIV & Aids Test", completed: true },
                    { name: "Alzheimer Disease Test", completed: false },
                    { name: "Home Health Aide Competency Test", completed: true },
                    { name: "Post Test", completed: false },
                    { name: "Culture Index Survey", completed: true }
                ],
                type: "form"
            },
            {
                name: "Tax Withholding",
                documents: [
                    { name: "Tax Form Information Verification", completed: true },
                    { name: "Federal / State W-4", completed: false }
                ],
                type: "form"
            },
            {
                name: "Employment Eligibility",
                documents: [{ name: "I9", completed: true }],
                type: "form"
            }
        ]
    },
    {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "987-654-3210",
        job: "Project Manager",
        hiredDate: "2024-08-15",
        steps: [
            {
                name: "E-Signature",
                documents: [{ name: "Coded Electronic Signature Form", completed: false }],
                type: "signature"
            },
            {
                name: "Personal Information",
                documents: [
                    { name: "Personal Information", completed: true },
                    { name: "Emergency Contacts", completed: true }
                ],
                type: "form"
            },
            {
                name: "Direct Deposit",
                documents: [{ name: "Direct Deposit", completed: false }]
            },
            {
                name: "Additional Documents",
                documents: [
                    { name: "References & Employment History", completed: true },
                    { name: "Electronic Signature Agreement", completed: true },
                    { name: "Confidentiality & Non-Compete Agreement", completed: false },
                    { name: "Conflict of Interest", completed: true },
                    { name: "Corporate Compliance", completed: true },
                    { name: "Orientation Checklist", completed: false },
                    { name: "PPE & Infection Control Acknowledgment", completed: true },
                    { name: "Job Acceptance", completed: true },
                    { name: "Receipt of Employee Handbook", completed: true },
                    { name: "TB TARGETED MEDICAL QUESTIONNAIRE FORM", completed: false },
                    { name: "Field Employee Standards & Procedures", completed: true },
                    { name: "Employee Safety Form Duties", completed: false },
                    { name: "Mask Policy", completed: true },
                    { name: "Privacy Policy", completed: true },
                    { name: "HEPATITIS VACCINE REQUIREMENT", completed: true }
                ]
            },
            {
                name: "Test/Certifications",
                documents: [
                    { name: "HIV & Aids Test", completed: false },
                    { name: "Alzheimer Disease Test", completed: true },
                    { name: "Home Health Aide Competency Test", completed: false },
                    { name: "Post Test", completed: true },
                    { name: "Culture Index Survey", completed: false }
                ]
            },
            {
                name: "Tax Withholding",
                documents: [
                    { name: "Tax Form Information Verification", completed: false },
                    { name: "Federal / State W-4", completed: true }
                ]
            },
            {
                name: "Employment Eligibility",
                documents: [{ name: "I9", completed: false }]
            }
        ]
    },
    {
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        phone: "555-678-1234",
        job: "Marketing Specialist",
        hiredDate: "2024-07-30",
        steps: [
            {
                name: "E-Signature",
                documents: [{ name: "Coded Electronic Signature Form", completed: true }]
            },
            {
                name: "Personal Information",
                documents: [
                    { name: "Personal Information", completed: false },
                    { name: "Emergency Contacts", completed: false }
                ]
            },
            {
                name: "Direct Deposit",
                documents: [{ name: "Direct Deposit", completed: true }]
            },
            {
                name: "Additional Documents",
                documents: [
                    { name: "References & Employment History", completed: false },
                    { name: "Electronic Signature Agreement", completed: true },
                    { name: "Confidentiality & Non-Compete Agreement", completed: false },
                    { name: "Conflict of Interest", completed: true },
                    { name: "Corporate Compliance", completed: false },
                    { name: "Orientation Checklist", completed: false },
                    { name: "PPE & Infection Control Acknowledgment", completed: true },
                    { name: "Job Acceptance", completed: true },
                    { name: "Receipt of Employee Handbook", completed: true },
                    { name: "TB TARGETED MEDICAL QUESTIONNAIRE FORM", completed: true },
                    { name: "Field Employee Standards & Procedures", completed: true },
                    { name: "Employee Safety Form Duties", completed: true },
                    { name: "Mask Policy", completed: false },
                    { name: "Privacy Policy", completed: true },
                    { name: "HEPATITIS VACCINE REQUIREMENT", completed: false }
                ]
            },
            {
                name: "Test/Certifications",
                documents: [
                    { name: "HIV & Aids Test", completed: true },
                    { name: "Alzheimer Disease Test", completed: true },
                    { name: "Home Health Aide Competency Test", completed: true },
                    { name: "Post Test", completed: false },
                    { name: "Culture Index Survey", completed: true }
                ]
            },
            {
                name: "Tax Withholding",
                documents: [
                    { name: "Tax Form Information Verification", completed: true },
                    { name: "Federal / State W-4", completed: true }
                ]
            },
            {
                name: "Employment Eligibility",
                documents: [{ name: "I9", completed: true }]
            }
        ]
    },
    {
        name: "Michael Brown",
        email: "michael.brown@example.com",
        phone: "321-654-0987",
        job: "Data Analyst",
        hiredDate: "2024-06-20",
        steps: [
            {
                name: "E-Signature",
                documents: [{ name: "Coded Electronic Signature Form", completed: true }]
            },
            {
                name: "Personal Information",
                documents: [
                    { name: "Personal Information", completed: true },
                    { name: "Emergency Contacts", completed: true }
                ]
            },
            {
                name: "Direct Deposit",
                documents: [{ name: "Direct Deposit", completed: true }]
            },
            {
                name: "Additional Documents",
                documents: [
                    { name: "References & Employment History", completed: true },
                    { name: "Electronic Signature Agreement", completed: true },
                    { name: "Confidentiality & Non-Compete Agreement", completed: true },
                    { name: "Conflict of Interest", completed: true },
                    { name: "Corporate Compliance", completed: true },
                    { name: "Orientation Checklist", completed: true },
                    { name: "PPE & Infection Control Acknowledgment", completed: true },
                    { name: "Job Acceptance", completed: true },
                    { name: "Receipt of Employee Handbook", completed: true },
                    { name: "TB TARGETED MEDICAL QUESTIONNAIRE FORM", completed: true },
                    { name: "Field Employee Standards & Procedures", completed: true },
                    { name: "Employee Safety Form Duties", completed: true },
                    { name: "Mask Policy", completed: true },
                    { name: "Privacy Policy", completed: true },
                    { name: "HEPATITIS VACCINE REQUIREMENT", completed: true }
                ]
            },
            {
                name: "Test/Certifications",
                documents: [
                    { name: "HIV & Aids Test", completed: true },
                    { name: "Alzheimer Disease Test", completed: true },
                    { name: "Home Health Aide Competency Test", completed: true },
                    { name: "Post Test", completed: true },
                    { name: "Culture Index Survey", completed: true }
                ]
            },
            {
                name: "Tax Withholding",
                documents: [
                    { name: "Tax Form Information Verification", completed: true },
                    { name: "Federal / State W-4", completed: true }
                ]
            },
            {
                name: "Employment Eligibility",
                documents: [{ name: "I9", completed: true }]
            }
        ]
    }
];

export const applicantNavItems = [
    { name: 'Resume', path: 'resume' },
    { name: 'Cover Letter', path: 'cover-letter' },
    { name: 'Application', path: 'application' },
    { name: 'Qualification Documents', path: 'qualification-documents' },
]

export const onboardingSteps = [
    "E-Signature",
    "Personal Information",
    "Direct Deposit",
    "Additional Documents",
    "Test/Certifications",
    "Tax Withholding",
    "Employment Eligibility",
]

export const applicantTestData = {
    applicantId: 52,
    jobId: 8,
    applicantName: "Tory Colt",
    applicantPhone: "Sep 10, 2024",
    createdDate: "Unknown Type: date",
    source: "INTERNAL",
    resumeUrl: "NONE",
    coverLetterUrl: "NONE",
    numOfRatings: 5,
    email: "clementus360@gmail.com",
    phone: "12124567890",
    city: "Sarasota",
    state: "Florida",
    applicantComments: []
}