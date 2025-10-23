# Codebase Overview

## Project Structure

- **Root**: React Native app with TypeScript
- **app/**: Main app components (index.tsx - entry point with basic NativeWind styled view)
- **android/** & **ios/**: Native platform code
- **utils/**: Server utilities and config
  - **server/auth.ts**: Creator authentication functions (login/signup, profile, Digilocker integration)
  - **server/common.ts**: Generic API request utility using fetch
- ****tests**/**: Jest tests
- **Config files**: Babel, Metro, ESLint, Prettier, Tailwind, TypeScript

## Package Usage

- **Core**: React 19.1.0, React Native 0.81.0
- **Navigation**: @react-navigation/native, @react-navigation/native-stack
- **Styling**: NativeWind (Tailwind CSS for RN), tailwindcss
- **Animation**: react-native-reanimated
- **Routing**: @react-navigation/native, @react-navigation/native-stack, @react-navigation/bottom-tabs
- **Validation**: Zod
- **Dev**: ESLint, Prettier, Jest, TypeScript


## Resources

- use agents/prompts/component.specification.md for component related generations.
- use agents/future/lottie.md for lottie related generations.
- use agents/future/toast.md for toast related generations.