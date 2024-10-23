export interface Document {
  name: string;
  completed: boolean;
}

export interface Step {
  name: string;
  documents: Document[];
  subSteps?: Step[];
  type?: 'form' | 'signature'; // Type of step
}

export interface Candidate {
  name: string;
  email: string;
  phone: string;
  job: string;
  hiredDate: string;
  steps: Step[];
}

export interface OnboardingPersonalInfo {
  firstName: string,
  lastName: string,
  preferedName: string,
  streeLine1: string,
  streetLine2: string,
  city: string,
  postalCode: string,
  country: string,
  state: string,
  primaryPhone: string,
  email: string,
  dob: string,
  ssn: string,
  gender: string,
  driverLicenseNumber: string,
  driverLicenseExpiration: string
}

export interface OnboardingPersonalInfoForm {
  firstName: string,
  lastName: string,
  preferedName: string,
  streeLine1: string,
  streetLine2: string,
  city: string,
  postalCode: string,
  country: string,
  state: string,
  primaryPhone: string,
  email: string,
  dob: string,
  ssn: string,
  confirmSsn: string,
  gender: string,
  driverLicenseNumber: string,
  driverLicenseExpiration: string
}


export interface OnboardingEmergencyContacts {
  firstName: string,
  lastName: string,
  primaryPhone: string,
  secondaryPhone: string,
  relationship: string
}

export interface DirectDeposit {
  financialInstitution: string,
  routingNumber: string,
  accountNumber: string,
  allocateFundsMethod: string,
  accountType: string
}

export interface ReferencesAndEmployment {
  primaryName: string,
  primaryEmployer: string,
  primaryPhone: string,
  primaryRelationship: string,
  secondaryName: string,
  secondaryEmployer: string,
  secondaryPhone: string,
  secondaryRelationship: string,
  primaryJobTitle: string,
  primaryCompanyName: string,
  primaryStartDate: string,
  primaryEndDate: string,
  primaryStartingSalary: string,
  primaryEndingSalary: string,
  primarySupervisorName: string,
  primaryWorkPhone: string,
  primaryReasonForLeave: string,
  secondaryJobTitle: string,
  secondaryCompanyName: string,
  secondaryStartDate: string,
  secondaryEndDate: string,
  secondaryStartingSalary: string,
  secondaryEndingSalary: string,
  secondarySupervisorName: string,
  secondaryWorkPhone: string,
  secondaryReasonForLeave: string,
  thirdJobTitle: string,
  thirdCompanyName: string,
  thirdStartDate: string,
  thirdEndDate: string,
  thirdStartingSalary: string,
  thirdEndingSalary: string,
  thirdSupervisorName: string,
  thirdWorkPhone: string,
  thirdReasonForLeave: string
}

export interface TaxWithholding {
  homeAddress: string,
  homeAddressLineTwo: string,
  city: string,
  state: string,
  zipCode: string,
  socialSecurityNumber: string
}

export interface TBMedicalQuestionnaire {
  everHadTbSkin: string,
  doYouCoughBlood: string,
  doYouHaveChronicCough: string,
  doYouHaveProlongedOrRecurrentFever: string,
  doYouHaveSweatingAtNight: string,
  haveYouEverHadBcgVaccine: string,
  haveYouRecentlyLostWeight: string,
  doYouHaveRiskFactors: string,
  describe: string
}
