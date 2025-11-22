export const iosModelOptions = ['iPhone 13', 'iPhone 14', 'iPhone 15'];
export const genderOptions = ['Male', 'Female', 'Other'];
export const cityOptions = [
  'Mumbai',
  'Delhi',
  'Bengaluru',
  'Hyderabad',
  'Pune',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Surat',
  'Lucknow',
  'Chandigarh',
  'Indore',
  'Nagpur',
  'Gurgaon',
  'Noida',
  'Vadodara',
  'Visakhapatnam',
  'Kochi',
  'Coimbatore',
  'Bhopal',
  'Thiruvananthapuram',
  'Mysore',
  'Pune',
];

export type UserContextType = {
  name: string;
  location: string;
  isOnline: boolean;
};

export const userContext: UserContextType = {
  name: 'Rohit',
  location: 'Hyderabad, India',
  isOnline: true,
};

// creator
export const CREATOR_STATUS = {
  ONBOARDING_STARTED: { value: 'ONBOARDING_STARTED', precedence: 1 },
  MOBILE_VERIFIED: { value: 'MOBILE_VERIFIED', precedence: 2 },
  CHECKED_WHATSAPP_PREFERENCE: {
    value: 'CHECKED_WHATSAPP_PREFERENCE',
    precedence: 3,
  },
  CHECKED_LOCATION_PREFERENCE: {
    value: 'CHECKED_LOCATION_PREFERENCE',
    precedence: 4,
  },
  APPLICATION_RECIEVED: { value: 'APPLICATION_RECIEVED', precedence: 5 },
  WORKSHOP_INITIATED: {
    value: 'WORKSHOP_INITIATED',
    precedence: 6,
  },
  AWAITING_WORKSHOP_SUBMISSION: {
    value: 'AWAITING_WORKSHOP_SUBMISSION',
    precedence: 7,
  },
  AWAITING_DEMO_SHOOT: { value: 'AWAITING_DEMO_SHOOT', precedence: 8 },
  AWAITING_KYC: { value: 'AWAITING_KYC', precedence: 9 },
  ONBOARDED: { value: 'ONBOARDED', precedence: 10 },
  ACTIVE: { value: 'ACTIVE', precedence: 11 },
  INACTIVE: { value: 'INACTIVE', precedence: 12 },
  REJECTED: { value: 'REJECTED', precedence: 13 },
  SUSPENDED: { value: 'SUSPENDED', precedence: 14 },
};
