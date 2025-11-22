# Skeleton Implementation Prompt

You are tasked with helping implement skeleton loaders in a React Native application. Follow this specification to create or integrate skeleton components.

## Context

- Project uses React Native with Expo/React Native CLI
- Uses `react-native-reanimated` for animations
- Uses NativeWind for styling (Tailwind CSS)
- Follows file-based routing with react-native-auto-route
- Target is ROG Creator App (Expo-based)

## Task

Implement skeleton loaders for loading states in React Native screens and components.

## Implementation Steps

### 1. Component Structure

Create a reusable skeleton component at `utils/ui/common/Skeleton.tsx` with:

- **Skeleton** component for individual skeleton items

  - Props: width, height, borderRadius, margin\* (marginTop, marginBottom, marginLeft, marginRight), margin, style
  - Animated opacity between 0.6 and 1.0
  - Default background color: #E5E7EB
  - Default animation duration: 1000ms loop
  - Uses react-native-reanimated for smooth animations

- **SkeletonGroup** component for multiple skeletons
  - Props: count, spacing, children (render function), style
  - Auto-spacing between items
  - Optional custom render function for complex layouts

### 2. Animation Details

- Use `react-native-reanimated` shared values and hooks
- Animate opacity from 0.6 to 1.0
- Use withRepeat and withTiming for continuous pulse effect
- Duration: 1000ms per cycle
- Loop infinitely with reverse effect (true)

### 3. Props Implementation

- Accept both fixed numbers and percentage strings for width/height
- Support individual margin props (marginTop, marginBottom, marginLeft, marginRight)
- Support unified margin prop (overrides individual margins)
- Allow custom styles via style prop for color/theme customization
- Default values: width='100%', height=20, borderRadius=4

### 4. Usage Patterns

#### Loading State Toggle

```tsx
const [isLoading, setIsLoading] = useState(true);

if (isLoading) {
  return <SkeletonGroup count={3} spacing={12} />;
}
return <ActualContent />;
```

#### Complex Layouts

```tsx
<SkeletonGroup
  count={5}
  spacing={12}
  children={index => (
    <View style={{ flexDirection: 'row' }}>
      <Skeleton width={60} height={60} borderRadius={8} marginRight={12} />
      <View style={{ flex: 1 }}>
        <Skeleton width="80%" height={16} borderRadius={4} marginBottom={8} />
        <Skeleton width="60%" height={14} borderRadius={4} />
      </View>
    </View>
  )}
/>
```

#### Custom Styling

```tsx
<Skeleton width="100%" height={60} style={{ backgroundColor: '#F3F4F6' }} />
```

### 5. File Organization

```
utils/
  ui/
    common/
      Skeleton.tsx          (main component)
      SkeletonExample.tsx   (usage example)
SKELETON_GUIDE.md          (comprehensive documentation)
SKELETON_QUICK_START.md    (quick reference)
```

### 6. Documentation Requirements

Create two markdown files:

- **SKELETON_QUICK_START.md**: Quick reference with common examples
- **SKELETON_GUIDE.md**: Comprehensive guide with:
  - Feature list
  - Installation (already included)
  - Basic usage examples
  - Props tables
  - Real-world examples
  - Performance tips
  - File location and import paths

### 7. Testing Checklist

- [x] Component renders without errors
- [x] Animation plays smoothly (opacity pulse)
- [x] SkeletonGroup renders correct count
- [x] Margins are applied correctly
- [x] BorderRadius works on all platforms
- [x] Custom styles override defaults
- [x] No TypeScript errors
- [x] Linter passes (ESLint)
- [x] Performance: Less than 5 skeletons renders instantly

### 8. Common Pitfalls to Avoid

- Don't use state in Skeleton component (stateless)
- Don't forget to remove skeleton when data loads
- Don't animate too many skeletons at once (limit to 10-15)
- Don't use inline styles for performance (but we accept margin props)
- Don't forget dependencies in useEffect hooks

### 9. Integration Points

- Import as: `import { Skeleton, SkeletonGroup } from '@/utils/ui/common/Skeleton';`
- Use in any screen/component for loading states
- Works with AsyncStorage, API calls, or any async operation
- Compatible with offline mode (show cached data or skeleton)

### 10. Customization Options

Allow developers to:

- Change animation speed (modify duration in useEffect)
- Change background color (via style prop)
- Mix Skeleton and SkeletonGroup components
- Create custom skeleton layouts with children function
- Use different dimensions per skeleton

## Expected Output

1. **Skeleton.tsx**: Core component file (~90 lines)
2. **SkeletonExample.tsx**: Example component showing usage
3. **SKELETON_GUIDE.md**: Full documentation
4. **SKELETON_QUICK_START.md**: Quick reference card

## Success Criteria

- ✅ Component passes linting (npm run lint)
- ✅ No TypeScript errors
- ✅ Smooth animations on physical device and emulator
- ✅ Proper import/export structure
- ✅ Comprehensive documentation with examples
- ✅ Ready to use in any component immediately
- ✅ No external dependencies beyond react-native-reanimated

## Performance Notes

- Skeleton uses shared values (not state) - minimal re-renders
- Animations run on native thread - no JS thread blocking
- Safe to render 10+ skeletons simultaneously
- Memory usage: ~1KB per skeleton instance

## Future Enhancements (Optional)

- Shimmer effect variant (slide animation)
- Pulsing background color animation
- Wave effect across skeleton items
- Configurable animation presets (fast, normal, slow)
- Theme integration (light/dark mode colors)
