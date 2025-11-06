export * from './auth';
export * from './authUtils';
export { default as rogApi } from './axiosInstance';

// Re-export utility functions for easier access
export {
  loginOtp,
  completeLogin,
  resendOtp,
  initiateSignup,
  completeSignup,
  getCreatorProfile,
  updateCreatorProfile,
  getDigiLockerAuthUrl,
  callDigiLockerCallback,
  getKYCVerificationStatus,
  getDigiLockerUserDetails,
  logout,
  initiatePhoneChange,
  completePhoneChange,
} from './authUtils';

