# 🧩 Component Generation Specification — React Native + NativeWind

**Goal:**  
Generate a **React Native** functional component using **TypeScript** and **NativeWind (v4)** compatible with **React Native 0.81**.  
The component should follow best practices for **theming**, **interactivity**, **accessibility**, and **performance**, and serve as a reusable UI building block.

---

## 🔧 Component Requirements

### **Core Props**
| Prop | Type | Description |
|------|------|--------------|
| `title` | `string` | Label or text content of the component (e.g., button text). |
| `onPress` | `() => void` | Callback triggered when the component is pressed. |
| `style?` | `StyleProp<ViewStyle>` | Optional inline style overrides. |
| `className?` | `string` | Optional Tailwind/NativeWind class overrides. |
| `disabled?` | `boolean` | Disables interaction and updates styling when true. |
| `variant?` | `"primary" \| "secondary" \| "outline"` | Determines style variant (colors, borders, etc.). |
| `icon?` | `ReactNode` | Optional leading icon or element. |

---

## 🌗 Theming & Dark Mode

- Use `useColorScheme()` from **NativeWind** to detect the current mode (`light` | `dark`).
- Implement **CSS variable–based theming** using `vars()` from NativeWind for flexible color overrides.
- Provide fallback classes for both themes:  
  Example:  
  `bg-primary dark:bg-primary-dark text-onPrimary dark:text-onPrimaryDark`
- If a `theme` prop or context is passed, allow overriding default colors.
- All color, spacing, and typography should reference centralized theme tokens.

---

## 🖱️ Hover, Press, and Focus States

- Wrap interactivity in a **`Pressable`** or **`TouchableOpacity`** component.
- Implement **pressed feedback** using:
  - Opacity reduction (`opacity-90`), or
  - Scale transform (`scale-95`), or
  - Background darkening.
- Add **hover:** variants for web or supported platforms via NativeWind.
- Include accessibility roles and states:
  ```tsx
  accessibilityRole="button"
  accessible
  accessibilityState={{ disabled }}
  ```
- Consider focus outlines (`focus:ring` or similar) for web accessibility.

---

## 📱 Responsiveness & Size Variants

- Support size variants via prop:
  ```ts
  size?: "sm" | "md" | "lg"
  ```
  Each should adjust:
  - Padding (e.g., `px-3 py-1` → `px-6 py-3`)
  - Font size (`text-sm`, `text-base`, `text-lg`)
  - Icon size / spacing
- Optionally support responsive adjustments via Tailwind breakpoints (`sm:`, `md:`, etc.) if relevant to layout.

---

## 🧱 Code Structure & Implementation

- Export component as **default**.
- Include descriptive **JSDoc / docstring** at the top summarizing props and purpose.
- Use **`clsx`** or **`twMerge`** to merge dynamic class names:
  ```ts
  const combined = twMerge(clsx(base, variantClasses, sizeClasses, className));
  ```
- Use inline `style={{ ... }}` or `StyleSheet.create()` only for unsupported CSS (e.g., complex shadows, transforms).
- Avoid recreating style objects during render; memoize computed class names using `useMemo`.

---

## 💡 Example Usage

Include an example snippet at the end of the generated file:

```tsx
// Example Usage
<Button
  title="Submit"
  variant="primary"
  onPress={() => console.log("Pressed")}
  size="lg"
  icon={<CheckIcon />}
  className="mt-4"
/>
```

Demonstrate:
- Light / dark mode switch
- Disabled state
- Different variants
- Icon integration

---

## 🧠 Best Practices & Edge Cases

- Ensure animations, gestures, or subscriptions are properly cleaned up.
- Keep logic **pure and functional** — no side effects in render.
- Use **strong typing** for all props and internal variables.
- Include **comments** for fallbacks or platform-specific handling.
- Follow accessibility best practices (minimum 4.5:1 color contrast).
- Validate performance via memoization and minimal re-renders.

---

✅ **Output Format**
- Provide a single, self-contained `.tsx` file.
- Minimal external commentary — only code and inline JSDoc comments.
- Must compile with the following dependencies:
  ```json
  {
    "react-native": "0.81.0",
    "react": "19.1.0",
    "nativewind": "^4.2.1",
    "tailwindcss": "^3.4.18",
    "react-native-reanimated": "^4.1.2",
    "react-native-safe-area-context": "^5.6.1",
    "react-native-screens": "^4.16.0",
    "zod": "^4.1.12"
  }
  ```