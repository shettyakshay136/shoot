

Drop-in usage (success screen)
import React, { useRef, useEffect } from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";

export default function SubmittedScreen() {
  const anim = useRef<LottieView>(null);

  useEffect(() => {
    // Start once when screen mounts
    anim.current?.play(0, 120); // or .play() to loop from start
  }, []);

  return (
    <View className="items-center mt-10">
      <LottieView
        ref={anim}
        source={require("@/assets/lottie/party.json")} // local json is fastest
        autoPlay
        loop={false}
        style={{ width: 180, height: 180 }}
        // Android perf: use hardware renderer for complex files
        renderMode="HARDWARE"
      />
    </View>
  );
}

Control it (play/pause/segments)
// Play a segment for subtle “burst”
anim.current?.play(30, 90);

// Pause on last frame
anim.current?.pause();

// Reset
anim.current?.reset();

Button + Lottie combo (your “Check Status” CTA)
<TouchableOpacity onPress={() => anim.current?.play(0, 60)}>
  <LinearGradient /* your ROG gradient */>
    <Text>Check Status ↗</Text>
  </LinearGradient>
</TouchableOpacity>

Performance & quality tips (battle-tested)

Use local assets (require) rather than remote URLs → faster & offline.

Trim unused frames in LottieFiles editor; keep JSON < ~500KB if possible.

Avoid heavy masks/blur: they tank Android FPS. Prefer vector paths or pre-baked shapes.

Android: set renderMode="HARDWARE" (default is AUTOMATIC). If visual glitches, try SOFTWARE.

Multiple Lotties on one screen? Keep them paused until visible; use onAnimationFinish to stop.

Accessibility: hide decorative animations from screen readers (accessible={false} on the wrapper).

Dark/Light variants: swap source based on theme.

TypeScript: useRef<LottieView>(null) and import default.

Minimal API you’ll actually use
<LottieView
  source={require("...json")}
  autoPlay       // start automatically
  loop={false}   // or true if loading/indeterminate
  speed={1.0}    // slow-mo 0.5, fast 1.5
  onAnimationFinish={() => {}}
/>


If you share the exact confetti JSON you like, I’ll wire it into your screen with the right sizing and timing (e.g., burst on mount, then fade out as the “What happens next?” card fades in).

* We have already installed lottie-react-native

