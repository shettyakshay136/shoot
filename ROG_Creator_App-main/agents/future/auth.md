## Authentication System Requirements

1. If offline → render “Home (cached)” immediately and show an offline banner.

2. Validate session (locally)

3. If you have a token locally, allow entry to the app; defer server validation until back online.

4. If token is missing/expired and offline → show a limited “guest/offline” state. (Don’t force a login screen that cannot work.)

5. Kick off background sync when network returns (rehydrate cache, replay queued writes, refresh token if needed).

Perfect—here’s a clean, production-style path using exactly your stack:

@react-native-community/netinfo (reachability)

@react-native-async-storage/async-storage (simple key–value)

realm (primary offline DB + change tracking) ( i want to only make the home screen online)

custom hooks (data layer + mutations)

react-native-background-fetch (replay queue in background)

react-native-keychain (secure tokens)

### Phase 1: Core Authentication Flow

#### Login Flow

- [ ] **Login Initiate**

  - [ ] Accept phone number (10 digits)
  - [ ] Validate phone number format
  - [ ] Call `/creator/auth/login/initiate` endpoint
  - [ ] Handle rate limiting
  - [ ] Store phone number temporarily in memory (not persistent)
  - [ ] Navigate to OTP verification screen on success
  - [ ] Show error toast on failure (network/server errors)

- [ ] **OTP Verification & Login Complete**

  - [ ] Display OTP input field (6-digit code)
  - [ ] Accept OTP from user
  - [ ] Call `/creator/auth/login/complete` with phone + OTP
  - [ ] Handle invalid OTP attempts (max 3 attempts before reset)
  - [ ] Extract from response:
    - [ ] Access token (store in session)
    - [ ] Refresh token (store in session)
    - [ ] User profile data (optional, fetch if not included)

- [ ] **Resend OTP**
  - [ ] Add "Resend OTP" button with countdown timer (60 seconds)
  - [ ] Call `/creator/auth/otp/resend` endpoint
  - [ ] Max 3 resend attempts per session
  - [ ] Show remaining attempts to user
  - [ ] Reset countdown on successful resend

#### Signup Flow (Multi-Step Onboarding)

The signup flow follows the CREATOR_STATUS precedence to guide creators through onboarding:

**Precedence Levels:**

1. ONBOARDING_STARTED (Signup Initiate)
2. MOBILE_VERIFIED (OTP verification)
3. CHECKED_WHATSAPP_PREFERENCE (WhatsApp preference screen)
4. CHECKED_LOCATION_PREFERENCE (Location preference screen)
5. APPLICATION_RECIEVED (Application details submitted)
6. WORKSHOP_INITIATED (Workshop training starts)
7. AWAITING_WORKSHOP_SUBMISSION (Waiting for assignment submission)
8. AWAITING_DEMO_SHOOT (Waiting for demo shoot upload)
9. AWAITING_KYC (Waiting for KYC verification)
10. ONBOARDED (Onboarding complete, can access dashboard)
11. ACTIVE (Creator status is active)
    12-14. INACTIVE, REJECTED, SUSPENDED (Terminal states)

---

- [x] **Signup Initiate** (Status: ONBOARDING_STARTED) - ✅ Implemented in `app/(auth)/signup/index.tsx`

  - [x] Collect: Creator Name, Phone Number, Email (optional), Portfolio Link, iPhone Model, Gender, Location
  - [x] Validate inputs (name, phone 10 digits, valid email format if provided, model, gender, location)
  - [x] Displays form with all required fields and dropdowns for iPhone Model & Gender
  - [x] Navigate to mobile verification screen on valid input
  - [ ] Call `/creator/auth/signup/initiate` endpoint (currently mock)
  - [ ] Update status to ONBOARDING_STARTED in backend

- [x] **Mobile Verification** (Status: MOBILE_VERIFIED) - ✅ Implemented in `app/(auth)/signup/mobileVerification.tsx`

  - [x] Display OTP input field (4-digit code)
  - [x] Option to change phone number
  - [x] Submit OTP to proceed
  - [ ] Call `/creator/auth/signup/complete` with phone + OTP (currently mock with 600ms delay)
  - [ ] Update status to MOBILE_VERIFIED
  - [ ] Create initial session
  - [ ] Fetch user profile data
  - [x] Navigate to WhatsApp preference screen on success

- [x] **WhatsApp Preference Screen** (Status: CHECKED_WHATSAPP_PREFERENCE) - ✅ Implemented in `app/(auth)/signup/whatsAppPreference.tsx`

  - [x] Phone number input field (pre-filled or for entry)
  - [x] WhatsApp opt-in checkbox ("Receive updates on WhatsApp")
  - [x] Referral code field with validation (ROGCREW, WELCOME)
  - [x] Terms & Conditions and Privacy Policy links
  - [ ] Call PUT `/creator/auth/profile` to store WhatsApp preference
  - [ ] Update status to CHECKED_WHATSAPP_PREFERENCE
  - [x] Navigate to location preference screen on valid input

- [x] **Location Preference Screen** (Status: CHECKED_LOCATION_PREFERENCE) - ✅ Implemented in `app/(auth)/signup/locationPreference.tsx`

  - [x] City selection dropdown with search functionality
  - [x] Dropdown displays all available cities (from `cityOptions` config)
  - [x] Search input filters cities in real-time
  - [ ] Call `/creator/auth/profile` with selected city to update profile
  - [ ] Store location preference in backend
  - [ ] Update status to CHECKED_LOCATION_PREFERENCE
  - [x] Navigate to "All Set" modal screen on city selection
  - [ ] After modal: Navigate to application status tracker screen

- [x] **Application Details** (Status: APPLICATION_RECIEVED) - ✅ Partially implemented in `app/(auth)/signup/application.tsx`

  - [x] Displays application status tracker with expandable steps (not a form for collection)
  - [ ] Backend should handle collecting profile data in earlier screens:
    - [ ] Email (collected in Signup Initiate)
    - [ ] Specialization (multi-select) - NOT YET IMPLEMENTED
    - [ ] Availability - NOT YET IMPLEMENTED
    - [ ] Portfolio Link (collected in Signup Initiate)
    - [ ] Address - NOT YET IMPLEMENTED
    - [ ] Emergency Contact - NOT YET IMPLEMENTED
    - [ ] Social Media (Instagram, YouTube, LinkedIn) - NOT YET IMPLEMENTED
    - [ ] iPhone Model (collected in Signup Initiate)
    - [ ] Gender (collected in Signup Initiate)
    - [ ] Bank Details (collected in `bankDetails.tsx`) - ✅ Exists but separate
  - [ ] Call `/creator/auth/signup/complete` with all collected data to finalize application
  - [ ] Update status to APPLICATION_RECIEVED
  - [ ] Navigate to application status tracker screen

- [x] **Application Status Tracker** (Statuses: APPLICATION_RECIEVED → ONBOARDED) - ✅ Implemented in `app/(auth)/signup/application.tsx`
  - [x] Display step-by-step onboarding status with expandable steps:
    - [x] **Application Received** - Shows submission timestamp ("x days ago")
    - [x] **Workshop + Assignment** - Complete skill assessment (1-2 days)
      - [x] "Upload Assignment" button for new submissions
      - [x] "Under Review" state with notification badge
    - [x] **Demo Shoot** - Create first content piece (1 day)
      - [x] "Upload Shoot" button
    - [x] **Digital KYC** - Verify identity (5-10 mins)
      - [x] "Verify" button (Digilocker integration planned)
    - [x] **Onboarded** - Mini celebration component
  - [x] Show completion status with visual indicators (checkmarks for completed, orange for current, gray for locked)
  - [x] Expandable/collapsible steps based on current status
  - [x] Locked steps cannot be expanded (grayed out)
  - [x] Terms & Conditions + Privacy Policy checkbox before "Let's Capture"
  - [x] "Let's Capture" button routes to dashboard (`/screens/home`) once ONBOARDED status reached
  - [ ] Sync status from backend and update UI dynamically

### Phase 2: Session Management

#### Session Creation & Storage

- [ ] **Create User Session** (after successful login/signup)
  - [ ] Store in AsyncStorage with key `@TB_APP_SESSION`
  - [ ] Session object structure:
    ```json
    {
      "access_token": "string",
      "refresh_token": "string",
      "CSRFToken": "string",
      "metrics": {},
      "impersonatingFromUserId": null
    }
    ```
  - [ ] Generate CSRF token (random string)
  - [ ] Validate access token with `/creator/auth/validate` endpoint
  - [ ] Return validation result

#### Session Retrieval

- [ ] **Get Access Token**
  - [ ] Retrieve from `@TB_APP_SESSION` storage
  - [ ] Return null if session doesn't exist
- [ ] **Get Refresh Token**
  - [ ] Retrieve from `@TB_APP_SESSION` storage
  - [ ] Return null if session doesn't exist

#### Session Validation

- [ ] **Validate User Session**
  - [ ] Check if session exists
  - [ ] Call `/creator/auth/validate` with access token
  - [ ] Update session metrics on each validation
  - [ ] Return validation status

#### Session Destruction

- [ ] **Logout**
  - [ ] Call `/creator/auth/logout` endpoint with access token
  - [ ] Clear `@TB_APP_SESSION` from AsyncStorage
  - [ ] Clear all cached user data
  - [ ] Navigate to login screen
  - [ ] Handle network errors gracefully

### Phase 3: Offline Mode Support

#### Offline Detection & Handling

- [ ] **Network Status Check**
  - [ ] Detect when device goes offline/online
  - [ ] Use NetInfo or similar to track connection status
  - [ ] Show offline indicator in UI when network unavailable

#### Offline Session Persistence

- [ ] **Persist Session Data**
  - [ ] Keep access token in AsyncStorage (already implemented)
  - [ ] Cache user profile data in AsyncStorage with key `@TB_APP_USER_PROFILE`
  - [ ] Store user preferences (dark mode, language, etc.)
  - [ ] Track last successful sync timestamp

#### Offline Data Caching

- [ ] **Cache API Responses**
  - [ ] Cache profile data from `/creator/auth/profile`
  - [ ] Cache user dashboard data for offline viewing
  - [ ] Implement LRU cache strategy (limit cache size)
  - [ ] Version cached data for invalidation

#### Offline UI/UX

- [ ] **Offline-Aware Navigation**
  - [ ] Allow browsing cached data when offline
  - [ ] Disable actions that require network (logout, profile updates)
  - [ ] Show "Offline" badge in header
  - [ ] Queue failed requests for sync when online

#### Sync on Reconnect

- [ ] **Re-sync on Network Recovery**
  - [ ] Detect when device comes back online
  - [ ] Validate session with `/creator/auth/validate`
  - [ ] Refresh user profile data if session still valid
  - [ ] Execute queued requests in order
  - [ ] Handle failed requests with user notification

### Phase 4: Security & Token Management

#### Token Security

- [ ] **Access Token Management**

  - [ ] Store access token securely in AsyncStorage
  - [ ] Include in Authorization header for authenticated requests
  - [ ] Handle token expiration gracefully

- [ ] **Refresh Token Flow**
  - [ ] Implement token refresh mechanism
  - [ ] Refresh token before expiration (if expiry info available)
  - [ ] Handle refresh token rotation

#### Error Handling

- [ ] **Authentication Errors**

  - [ ] Invalid phone number format
  - [ ] OTP mismatch (show remaining attempts)
  - [ ] OTP expired (offer resend)
  - [ ] Server errors (show user-friendly messages)
  - [ ] Network errors (suggest retry or offline mode)
  - [ ] Session expired (force logout and redirect to login)

- [ ] **Security Headers**
  - [ ] Include CSRF token in requests
  - [ ] Validate response headers
  - [ ] Handle certificate pinning for API calls

### Phase 5: User Profile Integration

#### Profile Management

- [ ] **Get User Profile**

  - [ ] Call `/creator/auth/profile` after login
  - [ ] Cache profile in AsyncStorage
  - [ ] Use cached profile in offline mode

- [ ] **Update Profile**
  - [ ] Call `/creator/auth/profile` (PUT) with updates
  - [ ] Handle network errors during update
  - [ ] Queue profile updates if offline

#### Digilocker Integration

- [ ] **Digilocker Auth Flow** (future enhancement)
  - [ ] Redirect to Digilocker with `/creator/auth/digilocker/auth`
  - [ ] Handle callback at `/creator/auth/digilocker/callback`
  - [ ] Retrieve user details from `/creator/auth/digilocker/user`

### Phase 7: Status-Based Routing & Navigation

#### Creator Status Management

- [ ] **Track Current Status**
  - [ ] Store CREATOR_STATUS in session along with access/refresh tokens
  - [ ] Update status after each step completion
  - [ ] Fetch status from backend on app resume
  - [ ] Cache status in AsyncStorage with key `@TB_APP_CREATOR_STATUS`

#### Navigation Logic by Status

- [ ] **ONBOARDING_STARTED** → Navigate to mobile verification
- [ ] **MOBILE_VERIFIED** → Navigate to WhatsApp preference
- [ ] **CHECKED_WHATSAPP_PREFERENCE** → Navigate to location preference
- [ ] **CHECKED_LOCATION_PREFERENCE** → Navigate to application details
- [ ] **APPLICATION_RECIEVED** → Navigate to application status tracker
- [ ] **WORKSHOP_INITIATED to AWAITING_KYC** → Show application status tracker (waiting for team review)
- [ ] **ONBOARDED** → Allow navigation to dashboard
- [ ] **ACTIVE** → Full dashboard access
- [ ] **INACTIVE/REJECTED/SUSPENDED** → Show appropriate message and logout option

#### Deep Link Handling

- [ ] Handle deep links to auth screens based on current status
- [ ] Prevent unauthorized access to screens ahead of current status
- [ ] Show proper error/info screens for invalid status transitions

#### Re-entry & Resume

- [ ] **Resume Onboarding**
  - [ ] On app launch, fetch latest CREATOR_STATUS
  - [ ] If status < ONBOARDED, resume from current step
  - [ ] If status = ONBOARDED/ACTIVE, go to dashboard
  - [ ] If status = INACTIVE/REJECTED/SUSPENDED, show appropriate screen

#### OTP Resend Management

- [ ] Track resend attempts per session
- [ ] Implement exponential backoff for resend requests
- [ ] Show countdown timer between resends
- [ ] Warn user about remaining attempts

#### Device-Specific Handling

- [ ] Store device model/type for analytics
- [ ] Track iOS/Android specific flows
- [ ] Handle platform-specific keyboard behaviors

#### Analytics & Logging

- [ ] Log authentication events (login, signup, logout)
- [ ] Track session duration
- [ ] Log errors for debugging
- [ ] Measure auth flow completion rates

### Implementation Checklist

#### Screens to Create/Update

**Login Screens:**

- [ ] `app/(auth)/login/index.tsx` - ✅ Exists (phone input)
- [ ] `app/(auth)/login/complete.tsx` - ✅ Exists (OTP verification)

**Signup Screens (Multi-step onboarding):**

- [x] `app/(auth)/signup/index.tsx` - ✅ Implemented (basic info: name, phone, email, portfolio, iPhone model, gender, location)
- [x] `app/(auth)/signup/mobileVerification.tsx` - ✅ Implemented (OTP verification with 4-digit code)
- [x] `app/(auth)/signup/whatsAppPreference.tsx` - ✅ Implemented (WhatsApp opt-in, phone number, referral code)
- [x] `app/(auth)/signup/locationPreference.tsx` - ✅ Implemented (city selection with search)
- [x] `app/(auth)/signup/application.tsx` - ✅ Implemented (APPLICATION_RECIEVED + status tracker with expandable steps)
- [x] `app/(auth)/signup/bankDetails.tsx` - ⚠️ Exists (bank account details for payments) - Not integrated into flow

**Status Flow Enhancement:**

- [ ] Connect signup screens to actual backend `/creator/auth/signup/initiate` endpoint
- [ ] Connect signup screens to actual backend `/creator/auth/signup/complete` endpoint
- [ ] Call `/creator/auth/profile` to update WhatsApp preference, location, and other details
- [ ] Fetch and sync CREATOR_STATUS from backend after each step
- [ ] Implement conditional navigation based on current CREATOR_STATUS
- [ ] Add re-entry logic (users can re-enter based on their current status)
- [ ] Handle terminal states (REJECTED, SUSPENDED, INACTIVE)
- [ ] Collect missing profile fields:
  - [ ] Specialization (multi-select dropdown) - Add to `app/(auth)/signup/index.tsx` or separate screen
  - [ ] Availability - Add to existing screen
  - [ ] Address - Add to existing screen
  - [ ] Emergency Contact - Add to existing screen
  - [ ] Social Media links - Add to existing screen
- [ ] Integrate bankDetails.tsx into the signup flow (currently orphaned)

#### Utils to Create/Update

- [ ] `utils/server/auth.ts` - ✅ Core APIs exist
- [ ] `utils/server/session.ts` - ✅ Exists (needs offline enhancements)
- [ ] `utils/hooks/useAuth.ts` - Auth context/hooks
- [ ] `utils/hooks/useOfflineMode.ts` - Offline mode management
- [ ] `utils/services/networkService.ts` - Network status monitoring
- [ ] `utils/services/cacheService.ts` - Data caching logic

#### Components to Create

- [ ] `utils/ui/auth/OTPInput.tsx` - OTP input field with masking
- [ ] `utils/ui/auth/CountdownTimer.tsx` - Resend countdown
- [ ] `utils/ui/common/OfflineBadge.tsx` - Offline indicator
- [ ] `utils/ui/common/ErrorToast.tsx` - Error notifications

#### Context/State Management

- [ ] Create AuthContext for global auth state
- [ ] Create OfflineContext for offline mode state
- [ ] Track authentication loading states
- [ ] Track offline data queue

Skip to content
Chat history

You said:
Uploaded image
Give me industry standard way to achieve offile mode of the app, i am working in react-native , thank you
ChatGPT said:

Thought for 9s
Here’s a battle-tested, “offline-first” blueprint for React Native apps. It’s what most production teams converge on.

0. What “offline-first” means
   Read: show cached data immediately (stale-while-revalidate).

Write: accept user actions offline → enqueue them → replay when online.

Sync: reconcile local vs server with clear conflict rules.

1. Core building blocks (recommended stacks)
   Networking / reachability

@react-native-community/netinfo for online/offline status + metered/roaming.

Local cache / database

Light apps: AsyncStorage (or faster react-native-mmkv) via a data cache like TanStack Query (React Query) with persistence.

Data-heavy / relational: SQLite-backed DB such as WatermelonDB or Realm (both have sync helpers and change tracking).

State & cache persistence

TanStack Query + persistQueryClient (storage: MMKV/AsyncStorage).

If using Redux, add redux-persist; for offline queuing, consider redux-offline (mature and maintained fork: @redux-offline/redux-offline).

Background sync

Bare RN: react-native-background-fetch (+ Headless JS for Android).

Expo: expo-background-fetch + expo-task-manager.

Images & files

react-native-fast-image (HTTP cache, prefetch) and react-native-fs or expo-file-system for files you need available offline.

Secure session

Store access tokens in Keychain/Keystore (react-native-keychain or expo-secure-store), not in AsyncStorage.

2. App startup flow (maps to your diagram)
   Fetch NetInfo

If offline → render “Home (cached)” immediately and show an offline banner.

Validate session (locally)

If you have a token locally, allow entry to the app; defer server validation until back online.

If token is missing/expired and offline → show a limited “guest/offline” state. (Don’t force a login screen that cannot work.)

Kick off background sync when network returns (rehydrate cache, replay queued writes, refresh token if needed).

3. Minimal code patterns
   NetInfo + offline banner
   // netinfo.ts
   import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
   export const watchNetwork = (onBackOnline: () => void) =>
   NetInfo.addEventListener(state => {
   if (state.isConnected && state.isInternetReachable) onBackOnline();
   });

// OfflineBanner.tsx
import {useNetInfo} from '@react-native-community/netinfo';
export default function OfflineBanner() {
const {isConnected, isInternetReachable} = useNetInfo();
const offline = isConnected === false || isInternetReachable === false;
if (!offline) return null;
return (
<View style={{padding:8, backgroundColor:'#222'}}>
<Text style={{color:'#fff'}}>You’re offline — showing cached data</Text>
</View>
);
}
React Query with persistent cache (AsyncStorage/MMKV)
// queryClient.ts
import {QueryClient, onlineManager, focusManager} from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
persistQueryClient,
PersistQueryClientProvider,
createAsyncStoragePersistor
} from '@tanstack/react-query-persist-client';

export const queryClient = new QueryClient({
defaultOptions: {
queries: {
staleTime: 60*000, // show cached for 1 min
cacheTime: 24 * 60 \_ 60 \* 1000,
retry: 2,
},
},
});

// Wire NetInfo to React Query's onlineManager
onlineManager.setEventListener(setOnline => {
return NetInfo.addEventListener(state => {
setOnline(Boolean(state.isConnected && state.isInternetReachable));
});
});

// Persist to storage
const persistor = createAsyncStoragePersistor({storage: AsyncStorage});
persistQueryClient({
queryClient,
persistor,
maxAge: 24 _ 60 _ 60 \* 1000,
});
“Offline write queue” (optimistic updates + replay)
Keep a small queue in storage (MMKV/AsyncStorage/DB).

On mutation: write optimistically to cache/UI → push to queue if offline → worker drains queue when back online.

// offlineQueue.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
const KEY = 'offline:queue';

type Job = {id: string; url: string; method: 'POST'|'PUT'|'PATCH'|'DELETE'; body?: any; headers?: any; createdAt: number};

export async function enqueue(job: Job) {
const list: Job[] = JSON.parse((await AsyncStorage.getItem(KEY)) || '[]');
list.push(job);
await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

export async function drain(fetcher: (j: Job)=>Promise<Response>) {
let list: Job[] = JSON.parse((await AsyncStorage.getItem(KEY)) || '[]');
const remaining: Job[] = [];
for (const j of list) {
try {
const res = await fetcher(j);
if (!res.ok) throw new Error('HTTP ' + res.status);
} catch (e) {
// keep it to retry later (exponential backoff recommended)
remaining.push(j);
}
}
await AsyncStorage.setItem(KEY, JSON.stringify(remaining));
}
// useMutation with optimistic update + queue fallback
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {enqueue} from './offlineQueue';
import NetInfo from '@react-native-community/netinfo';

function useCreateTodo() {
const qc = useQueryClient();
return useMutation({
mutationFn: async (payload: {title: string}) => {
const state = await NetInfo.fetch();
const online = !!(state.isConnected && state.isInternetReachable);
if (!online) {
await enqueue({
id: crypto.randomUUID(),
url: '/todos',
method: 'POST',
body: payload,
headers: {'Content-Type':'application/json'},
createdAt: Date.now(),
});
// pretend success (optimistic)
return {id: 'temp-' + Date.now(), ...payload};
}
const r = await fetch(BASE_URL + '/todos', {method:'POST', body: JSON.stringify(payload), headers:{'Content-Type':'application/json'}});
if (!r.ok) throw new Error('Network');
return r.json();
},
onMutate: async (newTodo) => {
await qc.cancelQueries({queryKey:['todos']});
const prev = qc.getQueryData<any[]>(['todos']) || [];
qc.setQueryData(['todos'], [...prev, {id:'temp', ...newTodo}]);
return {prev};
},
onError: (\_err, \_vars, ctx) => {
if (ctx?.prev) qc.setQueryData(['todos'], ctx.prev);
},
onSuccess: () => qc.invalidateQueries({queryKey:['todos']}),
});
}
Background replay when back online
// bootstrap.ts
import {watchNetwork} from './netinfo';
import {drain} from './offlineQueue';

export function bootstrap() {
watchNetwork(() => {
drain(async (job) =>
fetch(BASE_URL + job.url, {
method: job.method,
headers: {'Content-Type':'application/json', ...(job.headers||{})},
body: job.body ? JSON.stringify(job.body) : undefined,
})
);
});
}
With react-native-background-fetch, also trigger drain() periodically so queued writes send even if the app isn’t foregrounded.

4. Server-side must-haves (to make offline safe)
   Idempotent writes

Accept a X-Idempotency-Key or client-generated UUID for each mutation so replaying the same job doesn’t duplicate data.

Timestamps & versioning

Every record has updatedAt (server time). For simple apps use last-write-wins on conflict; for collaborative content consider field-level merge or CRDTs.

Delta sync

Endpoints support since=<timestamp> or ETag/If-None-Match so clients fetch only changes.

Soft delete (tombstones)

Keep deletedAt so deletion propagates to offline clients on next sync.

5. UX details that users expect
   Offline indicator (banner or pill).

Disable or label risky actions when offline (e.g., “Will send when you’re back online”).

Toast on reconnect: “Synced 3 pending updates.”

Skeletons/placeholders for cached screens.

Retry affordances per list item (e.g., failed job shows a “retry” or “edit & resend”).

6. When to choose which local store
   AsyncStorage/MMKV + React Query: CRUD lists, dashboards, forms (most apps).

WatermelonDB / Realm: thousands of rows, relations, complex filters, or you need live queries + sync plugins.

SQLite: if you prefer writing SQL directly or have existing schema; pair with TypeORM/Drizzle-ORM RN flavors.

7. Security & session
   Store tokens in Keychain/Keystore (not in AsyncStorage).

If token expires while offline, queue writes but gate replay until you refresh token on reconnect (gracefully prompt re-login without losing the queue).

Encrypt sensitive at-rest data if required by policy (MMKV crypto / SQLCipher / Realm encryption).

8. Testing checklist
   Airplane mode end-to-end: open app → see cached → create/edit/delete → quit app → reopen → reconnect → confirm replay + server state equals local expectations.

Conflict cases: same record changed on server while offline → verify your rule (LWW, merge, or reject with UI prompt).

Cold start offline with empty cache → ensure graceful “read-only” experience (no crashes).

Background fetch actually fires on both platforms (follow each library’s guides for OS constraints).

TL;DR recommended combo (easy, modern)
TanStack Query (stale-while-revalidate) + persistQueryClient (MMKV/AsyncStorage)

NetInfo for reachability

Simple offline mutation queue (like above) + background-fetch to replay

Secure token via react-native-keychain

Images via react-native-fast-image

If you want, I can adapt these snippets to your exact API shapes (auth flow, entities) and wire it into your current RN project structure.

No file chosenNo file chosen
ChatGPT can make mistakes. Check important info. See Cookie Preferences.
