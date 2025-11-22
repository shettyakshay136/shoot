import '@testing-library/jest-native/extend-expect';

// Silence React Native warn logs in tests to keep output clean
jest.spyOn(global.console, 'warn').mockImplementation(() => {});
jest.spyOn(global.console, 'error').mockImplementation(() => {});
