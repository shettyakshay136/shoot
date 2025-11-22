# DigiLocker KYC Verification

## Overview

DigiLocker-based identity verification using deep linking.

## Flow

```
1. User clicks "Verify KYC" on Application Status screen
   ↓
2. Modal gets auth URL from backend: GET /creator/auth/digilocker/auth
   ↓
3. App opens DigiLocker in browser → Modal closes
   ↓
4. User completes verification in DigiLocker
   ↓
5. DigiLocker redirects: rog://digilocker/callback?code=xxx&state=yyy
   ↓
6. App deep link routes to /digilocker-callback
   ↓
7. Handler calls: POST /creator/auth/digilocker/callback with code & state
   ↓
8. Updates creator profile and sets status to ONBOARDED
   ↓
9. Redirects to home
```

## API Endpoints

| Method | Endpoint                            | Purpose                     |
| ------ | ----------------------------------- | --------------------------- |
| GET    | `/creator/auth/digilocker/auth`     | Get authorization URL       |
| POST   | `/creator/auth/digilocker/callback` | Process callback            |
| GET    | `/creator/auth/profile`             | Get updated creator profile |

## Files

- **Modal**: `utils/ui/auth/signup/DigiLockerKYCModal.tsx` - Opens DigiLocker URL
- **Handler**: `app/digilocker-callback.tsx` - Processes deep link callback
- **Services**: `utils/server/kyc.ts`, `utils/server/digilockerCallback.ts`
- **Screen**: `app/(auth)/signup/application.tsx` - Triggers KYC

## Deep Link Setup

**Android** (`android/app/src/main/AndroidManifest.xml`):

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="rog" android:host="digilocker" android:pathPrefix="/callback" />
</intent-filter>
```

**iOS** (`ios/ROG_Creator_App/Info.plist`):

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array><string>rog</string></array>
    <key>CFBundleURLName</key>
    <string>DigiLockerCallback</string>
  </dict>
</array>
```

## Backend Config

DigiLocker callback redirect URI:

```
https://your-domain.com/creator/auth/digilocker/callback
```

## Modal States

- `idle` - Initial state
- `loading` - Getting auth URL
- `error` - Failed to get URL
