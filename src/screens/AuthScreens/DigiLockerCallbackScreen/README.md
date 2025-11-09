# DigiLocker Callback Screen

## Overview

This screen handles the OAuth callback flow from DigiLocker for KYC verification in the ROG Creator App. It implements industry-standard practices for handling deep links in React Native applications.

## Architecture

### Files Structure

```
DigiLockerCallbackScreen/
├── DigiLockerCallbackScreen.tsx         # Main component
├── DigiLockerCallbackScreen.types.ts    # TypeScript types
├── DigiLockerCallbackScreen.styles.ts   # StyleSheet definitions
└── index.ts                             # Export barrel file
```

## Key Features

### 1. Deep Link Handling

- **Cold Start**: Uses `Linking.getInitialURL()` to handle deep links when app is not running
- **Hot Start**: Uses `Linking.addEventListener()` to handle deep links when app is already open
- **Fallback**: Uses AsyncStorage via `callDigiLockerCallback()` if no URL params are found

### 2. OAuth Flow

The screen handles the DigiLocker OAuth callback in the following order:

1. Extracts `code` and `state` from deep link URL or route params
2. Calls `callDigiLockerCallback(code, state)` service function
3. Service function falls back to AsyncStorage if params are empty
4. Updates user profile after successful verification
5. Shows toast notifications for success/error states
6. Redirects to ApplicationScreen after completion

### 3. State Management

Uses three states for UI rendering:

- `LOADING`: Processing the callback
- `SUCCESS`: KYC verification initiated successfully
- `ERROR`: Failed to process callback

## Usage

### Navigation

Add to deep link configuration in `app.json` or equivalent:

```json
{
  "scheme": "rogcreator",
  "prefixes": ["rogcreator://"]
}
```

### Deep Link Format

```
rogcreator://auth/digilocker/callback?code=ABC123&state=XYZ789
```

### Programmatic Navigation

```typescript
navigation.navigate('DigiLockerCallbackScreen', {
  code: 'ABC123',
  state: 'XYZ789',
});
```

## Integration Points

### Services Used

- `callDigiLockerCallback(code, state)` - Main service function from `/src/services/authUtils.ts`
  - Handles API call to `/creator/auth/digilocker/callback`
  - Manages AsyncStorage for code/state persistence
  - Auto-clears stored credentials after success

### Context Used

- `useToast()` - For showing success/error notifications

### Navigation

- Uses `navigation.replace('ApplicationScreen')` to prevent back navigation to callback screen

## Error Handling

### Graceful Degradation

1. Deep link parsing errors → Fallback to AsyncStorage
2. Missing URL params → Fallback to AsyncStorage
3. API errors → Show error toast + redirect after 3 seconds
4. Success → Show success toast + redirect after 1.5 seconds

### Error Display

- Shows error icon (✕)
- Displays error message from API
- Auto-redirects to ApplicationScreen

## Best Practices Implemented

### 1. React Native Standards

- Uses `useCallback` for memoized handlers
- Proper cleanup of event listeners
- TypeScript for type safety

### 2. OAuth Best Practices

- Validates state parameter (handled by backend)
- Secure token storage via AsyncStorage
- One-time use of authorization code

### 3. UX Best Practices

- Loading states with spinner
- Success/error visual feedback
- Auto-redirect (no user interaction needed)
- Toast notifications for feedback

### 4. Security

- No sensitive data in component state
- Credentials cleared after use
- HTTPS-only API calls (enforced by service layer)

## Testing Scenarios

### Test Case 1: Cold Start Deep Link

1. Kill the app completely
2. Click deep link: `rogcreator://auth/digilocker/callback?code=ABC&state=XYZ`
3. Expected: App opens → Shows loading → Shows success → Redirects

### Test Case 2: Hot Start Deep Link

1. Open app and login
2. Navigate to KYC section
3. Click "Verify with DigiLocker"
4. Complete DigiLocker auth in browser
5. Deep link opens app
6. Expected: App comes to foreground → Shows loading → Shows success → Redirects

### Test Case 3: AsyncStorage Fallback

1. Code/state stored in AsyncStorage
2. Navigate directly: `navigation.navigate('DigiLockerCallbackScreen')`
3. Expected: Retrieves from storage → Shows loading → Shows success → Redirects

### Test Case 4: Error Handling

1. Navigate with invalid code/state
2. Expected: Shows loading → Shows error → Redirects after 3s

## Configuration

### AuthNavigator Integration

Screen is registered in `/src/navigation/AuthNavigator/AuthNavigator.tsx`:

```typescript
<AuthStack.Screen
  name="DigiLockerCallbackScreen"
  component={DigiLockerCallbackScreen}
  options={{
    title: 'DigiLocker Verification',
    headerShown: false,
  }}
/>
```

### Type Definitions

Added to `/src/navigation/AuthNavigator/AuthNavigator.types.ts`:

```typescript
DigiLockerCallbackScreen: {
  code?: string;
  state?: string;
};
```

## Troubleshooting

### Issue: Deep link not opening app

**Solution**: Check `app.json` scheme configuration and rebuild app

### Issue: "No params found" error

**Solution**: Ensure DigiLocker redirect URL matches app scheme

### Issue: Infinite loading

**Solution**: Check network connection and API endpoint availability

### Issue: Redirect not working

**Solution**: Verify ApplicationScreen is registered in AuthNavigator

## Future Enhancements

1. **Retry Mechanism**: Add retry button on error state
2. **Better Error Messages**: Map API error codes to user-friendly messages
3. **Analytics**: Track callback success/failure rates
4. **Deep Link Validation**: Validate URL format before processing
5. **Timeout Handling**: Add timeout for API calls with retry option

## Related Files

- `/src/services/authUtils.ts` - Contains `callDigiLockerCallback()`
- `/src/services/auth.ts` - Contains `apiDigiLockerCallback()`
- `/src/contexts/ToastContext.tsx` - Toast notification system
- `/src/screens/AuthScreens/ApplicationScreen/` - Target screen after callback
- `/src/navigation/AuthNavigator/` - Navigation configuration
