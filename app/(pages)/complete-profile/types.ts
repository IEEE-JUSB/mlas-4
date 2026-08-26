export type FoodPreference = "VEG" | "NON_VEG";

export type TshirtSize = "S" | "M" | "L" | "XL" | "XXL";

export type FormErrors = {
  phone?: string;
  college?: string;
  year?: string;
  department?: string;
  degree?: string;
  foodPreference?: string;
  tShirtSize?: string;
  ieeeStudentBranch?: string;
  ieeeMembershipNumber?: string;
  ieeeMembershipProofUrl?: string;
  general?: string;
};

export type ProfileApiResponse = {
  profile?: {
    phone?: string | null;
    college?: string | null;
    year?: number | null;
    department?: string | null;
    degree?: string | null;
    foodPreference?: FoodPreference | null;
    tshirtSize?: TshirtSize | null;
    ieeeStudentBranch?: string | null;
    ieeeMembershipNumber?: string | null;
    ieeeMembershipProofUrl?: string | null;
  } | null;
};
