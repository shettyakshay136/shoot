# DigiLocker KYC Process - Deep Analysis

## Complete Flow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User clicks "Verify" button on Application Status Screen    │
│    File: app/(auth)/signup/application.tsx                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. DigiLockerKYCModal opens                                     │
│    File: utils/ui/auth/signup/DigiLockerKYCModal.tsx            │
│    - State: 'idle' → 'loading'                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. API Call: GET /creator/auth/digilocker/auth                  │
│    Function: getDigiLockerAuthUrl()                             │
│    File: utils/server/kyc.ts                                    │
│    Headers: Authorization: Bearer {accessToken}                  │
│    Response: { authorizationUrl: string, state?: string }       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Open DigiLocker URL in Browser                               │
│    Linking.openURL(authUrl)                                      │
│    RNExitApp.exitApp() - App closes                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. User completes verification in DigiLocker                    │
│    (External browser/App)                                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. DigiLocker redirects to deep link                            │
│    rog://digilocker/callback?code=xxx&state=yyy                 │
│    Configured in:                                               │
│    - Android: AndroidManifest.xml                                │
│    - iOS: Info.plist                                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. App reopens and handles deep link                            │
│    File: app/index.tsx (initial URL check)                      │
│    OR: app/callback/index.tsx (route params)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. API Call: GET /creator/auth/digilocker/callback              │
│    Function: callDigiLockerCallback(code, state)                │
│    File: utils/server/digilockerCallback.ts                     │
│    Query Params: ?code=xxx&state=yyy                            │
│    Response: { data: { message, creatorId }, success, statusCode }│
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 9. Update Creator Profile                                       │
│    Function: updateCreatorProfile({ kycVerified: true })         │
│    File: utils/server/auth.ts                                    │
│    API: PUT /creator/auth/profile                                │
│    Headers: Authorization: Bearer {accessToken}                  │
│    Body: { kycVerified: true }                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 10. Redirect to Application Status Screen                        │
│     router.push('/signup/application')                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Detailed API Calls & Payloads

### API 1: Get DigiLocker Authorization URL

**Endpoint:** `GET /creator/auth/digilocker/auth`

**Location:** `utils/server/kyc.ts` - `getDigiLockerAuthUrl()`

**Request:**
```typescript
Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {accessToken}'  // Retrieved from AsyncStorage
}

Method: GET
URL: {API_URL}/creator/auth/digilocker/auth
```

**Response:**
```typescript
{
  data: {
    authorizationUrl: string,  // Full DigiLocker OAuth URL
    state?: string,           // Optional state parameter
    code?: string             // Optional code (if already available)
  },
  message: string,
  statusCode: number,
  success: boolean
}
```

**Implementation Details:**
- Gets access token from `getUserAccessToken()` (AsyncStorage: `@ROG_APP_SESSION`)
- Makes GET request with Authorization header
- Returns the authorization URL to open in browser

---

### API 2: DigiLocker Callback

**Endpoint:** `GET /creator/auth/digilocker/callback`

**Location:** `utils/server/digilockerCallback.ts` - `callDigiLockerCallback(code, state)`

**Request:**
```typescript
Method: GET
URL: {API_URL}/creator/auth/digilocker/callback?code={code}&state={state}

Query Parameters:
  - code: string   // Authorization code from DigiLocker
  - state: string  // State parameter for CSRF protection

Headers: {
  'Content-Type': 'application/json'
  // Note: No Authorization header - uses session from backend
}
```

**Fallback Mechanism:**
If `code` or `state` are empty, the function attempts to retrieve from AsyncStorage:
- `@DIGILOCKER_CODE`
- `@DIGILOCKER_STATE`

**Response:**
```typescript
{
  data: {
    message: string,      // Success message
    creatorId: string     // Creator ID
  },
  message: string,
  statusCode: number,
  success: boolean
}
```

**Post-Callback Actions:**
- On success: Clears stored credentials from AsyncStorage
- Removes `@DIGILOCKER_CODE` and `@DIGILOCKER_STATE`

---

### API 3: Update Creator Profile

**Endpoint:** `PUT /creator/auth/profile`

**Location:** `utils/server/auth.ts` - `updateCreatorProfile(payload, accessToken)`

**Request:**
```typescript
Method: PUT
URL: {API_URL}/creator/auth/profile

Headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {accessToken}'
}

Body: {
  kycVerified: true
}
```

**Response:**
```typescript
{
  data: {
    status: string  // e.g., CREATOR_STATUS.ONBOARDED.value
  }
}
```

**Post-Update Actions:**
- Updates AsyncStorage: `@ROG_APP_CREATOR_STATUS` with new status

---

## Deep Linking Configuration

### Android Configuration

**File:** `android/app/src/main/AndroidManifest.xml`

```xml
<activity
  android:name=".MainActivity"
  android:launchMode="singleTask"
  android:exported="true">
  
  <!-- Main launcher -->
  <intent-filter>
    <action android:name="android.intent.action.MAIN" />
    <category android:name="android.intent.category.LAUNCHER" />
  </intent-filter>
  
  <!-- Deep link handler -->
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data
      android:scheme="rog"
      android:host="digilocker"
      android:pathPrefix="/callback" />
  </intent-filter>
</activity>
```

**Deep Link Format:** `rog://digilocker/callback?code=xxx&state=yyy`

---

### iOS Configuration

**File:** `ios/ROG_Creator_App/Info.plist`

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>rog</string>
    </array>
    <key>CFBundleURLName</key>
    <string>DigiLockerCallback</string>
  </dict>
</array>
```

**Deep Link Format:** `rog://digilocker/callback?code=xxx&state=yyy`

---

## Deep Link Handling

### Initial URL Check (App Startup)

**File:** `app/index.tsx`

```typescript
// On app startup, check if opened via deep link
const initialUrl = await Linking.getInitialURL();
if (initialUrl && initialUrl.includes('callback')) {
  // Parse URL manually (basic implementation)
  router.replace({
    screen: 'callback',
    params: {
      code: initialUrl.split('?code=')[1],
      state: initialUrl.split('?state=')[1],
    },
  });
}
```

**Note:** This is a basic URL parsing implementation. The actual route handler uses `useRoute()` hook.

---

### Route Handler (Primary Handler)

**File:** `app/callback/index.tsx`

**Route:** `/callback` (react-native-auto-route)

**Key Features:**
1. Uses `useRoute()` hook to get route parameters
2. Extracts `code` and `state` from route params
3. Validates parameters before proceeding
4. Shows loading/success/error states
5. Handles errors gracefully with redirects

**Route Parameters:**
```typescript
route.params = {
  code?: string,
  state?: string
}
```

**Flow:**
1. Screen mounts → Logs route params
2. `useEffect` triggers when params are available
3. Validates `code` and `state` exist
4. Calls `callDigiLockerCallback(code, state)`
5. On success: Updates profile with `kycVerified: true`
6. Redirects to `/signup/application`

---

## Error Handling

### Modal Errors (DigiLockerKYCModal)

**Error States:**
- `'error'` - Failed to get auth URL or open URL
- Error message displayed in red alert box
- Retry button available

**Error Scenarios:**
1. API fails to return authorization URL
2. `Linking.openURL()` fails
3. Network errors

---

### Callback Handler Errors (callback/index.tsx)

**Error Scenarios:**
1. Missing `code` or `state` parameters
2. Backend callback verification fails
3. Profile update fails
4. Network errors

**Error Handling:**
```typescript
catch (err) {
  setStatus('error');
  setErrorMessage(err.message || 'Verification failed');
  Toast.error({ message: errorMessage });
  setTimeout(() => {
    router.push('/signup/application');  // Redirect to application screen
  }, 2000);
}
```

---

## AsyncStorage Keys Used

| Key | Purpose | Set By | Cleared By |
|-----|---------|--------|------------|
| `@ROG_APP_SESSION` | User session (access token) | `createUserSession()` | `destroyUserSession()` |
| `@ROG_APP_CREATOR_STATUS` | Creator onboarding status | `updateCreatorProfile()` | - |
| `@DIGILOCKER_CODE` | Fallback for code param | (Not set in current code) | `callDigiLockerCallback()` |
| `@DIGILOCKER_STATE` | Fallback for state param | (Not set in current code) | `callDigiLockerCallback()` |

---

## State Management

### Application Screen State

**File:** `app/(auth)/signup/application.tsx`

**State Variables:**
- `isKYCModalOpen: boolean` - Controls modal visibility
- `currentStatus: string` - Current creator status from AsyncStorage

**Status Values:**
- `CREATOR_STATUS.APPLICATION_RECIEVED.value`
- `CREATOR_STATUS.AWAITING_WORKSHOP_SUBMISSION.value`
- `CREATOR_STATUS.WORKSHOP_INITIATED.value`
- `CREATOR_STATUS.AWAITING_DEMO_SHOOT.value`
- `CREATOR_STATUS.AWAITING_KYC.value`
- `CREATOR_STATUS.ONBOARDED.value`

---

### Callback Screen State

**File:** `app/callback/index.tsx`

**State Variables:**
- `status: 'loading' | 'success' | 'error'` - Current processing state
- `errorMessage: string` - Error message to display

---

## Logging & Debugging

### Console Logs

**KYC Modal:**
- `[KYC Modal] Starting KYC flow`
- `[KYC Modal] Fetching DigiLocker auth URL`
- `[KYC Modal] Got auth URL, opening DigiLocker`
- `[KYC Modal] DigiLocker opened successfully, closing modal`

**API Calls:**
- `[KYC API] Fetching DigiLocker auth URL`
- `[KYC API] Auth URL response received`
- `[KYC API] DigiLocker callback - Starting callback process`
- `[KYC API] DigiLocker callback - Response: {...}`

**Callback Handler:**
- `[DigiLocker Callback] SCREEN MOUNTED - callback/index.tsx`
- `[DigiLocker Callback] Route params: {...}`
- `[DigiLocker Callback] Deep link params: {...}`
- `[DigiLocker Callback] Calling backend callback endpoint`
- `[DigiLocker Callback] Callback response: {...}`

**Watch Script:**
- `scripts/watch-kyc-logs.sh` - Filters logs for KYC-related messages

---

## API Request Implementation

**File:** `utils/server/common.ts` - `makeApiRequest()`

**Features:**
- Base URL from `Config.API_URL` (env variable)
- Query parameter support
- Path parameter replacement
- Request/response logging
- Error handling with message extraction

**Request Logging:**
```typescript
console.group('request logs');
console.log('req sent to', fullUrl);
console.log('method', method);
console.log('params', params);
console.log('body', JSON.stringify(body));
console.groupEnd();
```

**Response Logging:**
```typescript
console.group('response logs');
console.log('response data', data);
console.log('response status', response.status);
console.groupEnd();
```

---

## Callback Handler Files

There are **TWO** callback handler files in the codebase:

### 1. Primary Handler: `app/callback/index.tsx` ✅ (ACTIVE)
- **Route:** `/callback` (matches deep link: `rog://digilocker/callback`)
- **Features:**
  - Properly extracts `code` and `state` from route params using `useRoute()`
  - Validates parameters before API call
  - Comprehensive logging
  - Uses `updateCreatorProfile()` from `utils/server/auth.ts`
  - Redirects to `/signup/application` on completion

### 2. Alternative Handler: `app/(auth)/signup/digilockerCallback.tsx` ⚠️ (POTENTIALLY UNUSED)
- **Route:** `/signup/digilockerCallback`
- **Issues:**
  - Calls `callDigiLockerCallback('', '')` with empty strings (relies on AsyncStorage fallback)
  - Imports `updateCreatorProfile` from wrong file (`digilockerCallback.ts` instead of `auth.ts`)
  - Redirects to `/screens/home` instead of `/signup/application`
  - Less robust error handling

**Recommendation:** The file at `app/callback/index.tsx` appears to be the active handler based on:
1. Route structure matching deep link configuration
2. Proper parameter extraction
3. Correct imports
4. Better implementation

---

## Potential Issues & Notes

### 1. URL Parsing in app/index.tsx
The initial URL parsing is basic:
```typescript
code: initialUrl.split('?code=')[1],
state: initialUrl.split('?state=')[1],
```
This doesn't handle URL encoding or multiple query params properly. The route handler (`callback/index.tsx`) is more robust.

### 2. Missing State Storage
The code checks for `@DIGILOCKER_CODE` and `@DIGILOCKER_STATE` in AsyncStorage as fallback, but these are never set. This suggests either:
- Legacy code that's no longer used
- Future enhancement
- Backend might set these (unlikely)

### 3. App Exit Behavior
`RNExitApp.exitApp()` is called after opening DigiLocker URL. This closes the app completely, requiring the user to reopen it via deep link.

### 4. No State Validation
The callback handler doesn't validate the `state` parameter against a stored value for CSRF protection. This should be handled by the backend.

### 5. Duplicate Redirect Logic
In `app/index.tsx`, there's duplicate redirect logic (lines 76-96) that appears to be redundant.

---

## Summary

The DigiLocker KYC process follows a standard OAuth 2.0 flow:

1. **Initiation:** User clicks verify → Modal fetches auth URL → Opens DigiLocker
2. **Verification:** User completes verification in DigiLocker (external)
3. **Callback:** DigiLocker redirects to deep link → App handles callback
4. **Completion:** App verifies callback → Updates profile → Redirects to application screen

**Key Files:**
- Modal: `utils/ui/auth/signup/DigiLockerKYCModal.tsx`
- Callback Handler: `app/callback/index.tsx`
- API Services: `utils/server/kyc.ts`, `utils/server/digilockerCallback.ts`
- Profile Update: `utils/server/auth.ts`
- Deep Link Config: `AndroidManifest.xml`, `Info.plist`

**API Endpoints:**
1. `GET /creator/auth/digilocker/auth` - Get authorization URL
2. `GET /creator/auth/digilocker/callback?code=xxx&state=yyy` - Process callback
3. `PUT /creator/auth/profile` - Update profile with KYC status

