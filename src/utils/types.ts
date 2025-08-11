import type { ReactNode } from "react";

export interface LoginCred {
  email: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  mobile: string | null;
  subscription_type: string;
  plan_info: {
    id: number;
    plan_name: string;
  }[];
  end_date: string;
  order_date: string;
}

export interface Essay {
  id: string;
  idnumber: string;
  question_json: any;
  exhibits: Exhibit[];
  level?: 'low' | 'medium' | 'high';
  pass_percentage?: string;
  course: {
    id: string;
    name: string;
  }
  subject: {
    id: string;
    name: string;
  }
  chapter: {
    id: string;
    name: string;
  }
  sim_type: {
    visible: string
  }
  visible: number,
  actions?: any;
}

export type Step = {
  title: string;
  content: ReactNode;
};

export type StepProps = {
  initData?: any,
  onDemandQuestionSave?: () => Promise<string>;
  stepKey: string;
  data: Record<string, any>;
  updateData: (key: string, values: Record<string, any>) => void;
};

export type MetaState = {
  questionId?: string;
  courseId?: string | number;
  subjectId?: string | number;
  chapterId?: string | number;
  difficulty_level?: 'low' | 'medium' | 'high';
  pass_percentage?: string;
  simulationId?: string;
};

export interface SubQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface Exhibit {
  name: string;
  exhibits_file: string;
  id?: number;
}
export interface QuestionState {
  description: string;
  exhibits: Exhibit[];
  subQuestions: SubQuestion[];
}
export interface EssayPagination {
  count: number;
  next: string | null;
  previous: string | null;
  results: Essay[];
}

export interface UserState {
  count: number;
  previous: string | null;
  next: string | null;
  results: User[];
  loading: boolean;
  error: string | null;
  page: number;
  type: number;
}
export interface EssayState {
  data: Essay[];
  count: number;
  next: string | null;
  previous: string | null;
  page: number;
  loading: boolean;
  error: string | null;
  selectedEssay: Essay | null;
  selectedEssayLoading: boolean;
}


export interface Enquiry {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  message: string;
  created_at: string; // You can use `Date` if it's parsed
}
type type = string
export interface Payload {
  start_date: string,
  end_date: string,
};
export interface ExportBodyType {
  type: type,
  payload: Payload
}


export interface QuickContactProps {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string | null;
  state: string | null;
  country: string | null;
  message: string | null;
  created_at: string;
  course_info: {
    id: number;
    full_name: string;
  };
}

export interface PartnerWithUs {
  id: number;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  city: string;
  country: string;
  pincode: string;
  partner_type: string;
  document: string | null;
  query: string;
  status: number;
}

export interface Subscription {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  order_date: string; // ISO date string
  end_date: string;   // ISO date string
  payment_method: string;
  subscription_type: string; // 'yearly' | 'monthly' etc.
  plan_info: {
    id: number;
    plan_name: string;
  };
};


export interface PlacementSupportProps {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  career: string;
  career_other: string | null;
  qualification: string;
  qualification_other: string | null;
  experience: string;
  current_compay: string | null;
  address: string;
  state: string;
  city: string;
  country: string;
  pincode: string;
  message: string | null;
  created_at: string;
}



export interface BookOrder {
  id: number;
  order_date: string;
  orderID: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  payment_status: string;
  isPaid: boolean;
  payment_method: string;
  user: any | null;
}


export interface ExcellenceSection {
  id: number;
  page: number;
  page_id: string;
  section_type_id: string;
  section_type: any;
  text_1: string;
  text_2: string;
  text_3: string | null;
  order: string;
  description: string | null;
  slider_video: string | null;
  image: string | null;
  created_at: string;
  sub_section: SubSection[];
  mentors: any[];
  alt_text?: string,
}

export interface SubSection {
  id: number;
  title: string;
  description: string;
  image: string;
}


interface BlogInfo {
  id: number;
  title: string;
}

export interface Comment {
  id: number;
  name: string;
  email: string;
  status: number;
  comment: string;
  created_at: string;
  blog_info: BlogInfo;
  actions?: any;
}


export interface BookProps {
  id?: string
  name: string;
  course_name: string;
  subject_name: string;
  language: string;
  original_price: number;
  discount_percentage: number;
  total_price: number;
  out_of_stock: number;
  publisher: string;
  actions?: any
  is_bundle?: boolean
}

export interface AuthorProps {
  id?: string
  name: string;
  description: string;
  image: string;
  actions?: any
}
export interface TestimonialProps {
  name: string
  image: string
  content: string
  testimonials_type: string
  id?: string
  qualification: string
  actions?: any
  college?: any
}


export interface Testimonials {
  student: TestimonialProps[]
  placement: TestimonialProps[]
  corporate: TestimonialProps[]
  institutions: TestimonialProps[]
}
export interface CourseProps {
  id?: string
  name: string;
  course_name: string;
  subject_name: string;
  language: string;
  original_price: number;
  discount_percentage: number;
  total_price: number;
  out_of_stock: number;
  publisher: string;
  actions?: any
  is_bundle?: boolean
}