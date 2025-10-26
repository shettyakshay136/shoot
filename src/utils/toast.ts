/**
 * Toast utility functions for showing success and error messages
 * These can be used throughout the app for consistent toast notifications
 */

// Example usage:
// import { showSuccess, showError } from '@/utils/toast';
// showSuccess('Operation completed successfully');
// showError('Something went wrong');

// Note: These functions require the component to have access to useToast hook
// For use in components, use the hook directly:
// const { showToast } = useToast();
// showToast('Success', 'success', 'Message here');

export const TOAST_DURATION = 3000; // 3 seconds

