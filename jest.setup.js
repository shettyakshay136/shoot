try {
  // Optional matching helpers for RN components when the package is installed.
  require('@testing-library/jest-native/extend-expect');
} catch (error) {
  // Matcher package is optional for this project; ignore if unavailable.
}

// Silence React Native warn logs in tests to keep output clean
jest.spyOn(global.console, 'warn').mockImplementation(() => {});
jest.spyOn(global.console, 'error').mockImplementation(() => {});
