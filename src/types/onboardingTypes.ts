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
  