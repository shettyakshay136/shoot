# Development

## Things to be fetchted at boot

```text
- User Context
- Shoot Discovery
- Current Location
- Wallet Balance
```

## Add icon to the app to be shown externally

```bash
npm install --save-dev @bam.tech/react-native-make
npx react-native set-icon --path <original-icon-path>
```

## @ Alias Configuration

The `@` symbol is configured as an alias to the root folder for easier imports. This allows importing modules using `@/path/to/file` instead of relative paths.

### TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Metro Bundler Configuration (metro.config.js)

```javascript
const config = mergeConfig(defaultConfig, {
  resolver: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
```

This setup enables clean imports like:

```typescript
import { Component } from '@/components/Component';
import { utils } from '@/utils/helpers';
```

## Theme Color Palette Configuration

## Vector Icons

- Package: `react-native-vector-icons` (autolinked RN 0.60+)
- Default glyphs used in `HelpButton` via `Ionicons`.
- TypeScript: local module declaration at `types/react-native-vector-icons.d.ts`.
- iOS: After installing pods, fonts are bundled automatically. If icons don’t render, run `cd ios && pod install` and rebuild.
- Android: Autolinking handles fonts. If missing, clean build. Rebuild with `./gradlew clean assembleDebug`.
- Usage example:
  - `import Ionicons from 'react-native-vector-icons/Ionicons'`
  - `<Ionicons name="help-circle-outline" size={20} color="#111827" />`

To add a custom theme color palette, I created `utils/config/theme.config.ts` which exports the ROG color palette with primary and neutral shades ranging from 25 to 900.

```js
export const ROG = {
  primary: {
    25: '#FFF4E8',
    50: '#FFE7C9',
    100: '#FFD9A9',
    200: '#FFC989',
    300: '#FFB366',
    400: '#FF9440',
    500: '#FF6E1A',
    600: '#FF3B00',
    700: '#D32A00',
    800: '#A52000',
    900: '#731600',
  },
  neutral: {
    25: '#F9FAFB',
    50: '#F3F4F6',
    100: '#E5E7EB',
    200: '#D1D5DB',
    300: '#9CA3AF',
    400: '#6B7280',
    500: '#4B5563',
    600: '#374151',
    700: '#1F2937',
    800: '#111827',
    900: '#0A0F19',
  },
};
```

Then, in `tailwind.config.js`, I extended the theme colors to include these palettes, enabling the use of Tailwind classes like `bg-primary-500` or `text-neutral-700` for consistent theming across the app.

```js
  theme: {
    extend: {
      colors: {
        primary: {
          25: '#FFF4E8',
          50: '#FFE7C9',
          100: '#FFD9A9',
          200: '#FFC989',
          300: '#FFB366',
          400: '#FF9440',
          500: '#FF6E1A',
          600: '#FF3B00',
          700: '#D32A00',
          800: '#A52000',
          900: '#731600',
        },
        neutral: {
          25: '#F9FAFB',
          50: '#F3F4F6',
          100: '#E5E7EB',
          200: '#D1D5DB',
          300: '#9CA3AF',
          400: '#6B7280',
          500: '#4B5563',
          600: '#374151',
          700: '#1F2937',
          800: '#111827',
          900: '#0A0F19',
        },
      },
    },
  },
```

## Deep Link Configuration

### DigiLocker Callback Deep Link

The app handles DigiLocker OAuth callbacks via the deep link scheme `rog://digilocker/callback`.

**Android Configuration** (android/app/src/main/AndroidManifest.xml):

```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data
        android:scheme="rog"
        android:host="digilocker"
        android:pathPrefix="/callback" />
</intent-filter>
```

**iOS Configuration** (ios/ROG_Creator_App/Info.plist):

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

**Callback Handler** (app/(auth)/signup/digilockerCallback.tsx):

- Extracts authorization code and state from URL
- Calls backend `/creator/auth/digilocker/callback` endpoint
- Updates creator profile on successful verification
- Redirects to home screen or signup on error

  Terminal 1 - Start app:
  npm run android

  Terminal 2 - Watch logs (BEST):
  adb logcat | grep -E "\[KYC|API REQUEST|API RESPONSE|DigiLocker"

  Or use the script:
  chmod +x scripts/watch-kyc-logs.sh && ./scripts/watch-kyc-logs.sh

## Expo Intervention

```bash

npm rm expo expo-modules-core expo-modules-autolinking
# revert any Expo plugin lines you added in android/* files
# (remove useExpoModules(), the expo classpath, and `id "expo"`)

cd android && ./gradlew clean && cd ..
npm run android


npx --yes -p eas-cli@latest eas init
npx --yes -p eas-cli@latest eas build --platform ios --profile development
```
