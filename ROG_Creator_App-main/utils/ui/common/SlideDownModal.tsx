import React, { useRef, useEffect, useMemo, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  View,
  StyleSheet,
  GestureResponderEvent,
  PanResponderGestureState,
  AccessibilityActionEvent,
} from 'react-native';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  visible: boolean;
  onClose: () => void;
  /** Max height as a ratio of screen height, e.g. 0.88 */
  maxHeightRatio?: number;
  /** If true, dragging is only enabled via the handle area */
  dragOnHandleOnly?: boolean;
  /** Optional snap points as ratios of screen height (<= maxHeightRatio). Example: [0.5, 0.88] */
  snapPoints?: number[];
  /** Initial snap index to open at (defaults to last snap i.e., most open) */
  initialSnapIndex?: number;
  /** Called after snapping to a snap index (not when fully closed) */
  onSnap?: (index: number) => void;
  /** Accessibility label for the drag handle */
  handleA11yLabel?: string;
  /** Forward to react-native-modal to lift sheet above keyboard */
  avoidKeyboard?: boolean;
  /** Your content. Forward ScrollView onScroll to onContentScrollY so we know if it's at top. */
  renderContent: (helpers: {
    onContentScrollY: (y: number) => void;
  }) => React.ReactNode;
};

export default function SlideDownModal({
  visible,
  onClose,
  maxHeightRatio = 0.88,
  dragOnHandleOnly = true,
  snapPoints,
  initialSnapIndex,
  onSnap,
  handleA11yLabel = 'Bottom sheet handle',
  avoidKeyboard,
  renderContent,
}: Props) {
  const insets = useSafeAreaInsets();

  // Track window dims to react to orientation/size changes
  const [dims, setDims] = useState(Dimensions.get('window'));
  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setDims(window);
    });
    return () => {
      // @ts-ignore RN <= 0.71 compatibility
      sub?.remove?.();
    };
  }, []);

  const H = dims.height;
  const sheetHeight = Math.round(H * maxHeightRatio);

  // translateY relative to OPEN position (minTranslate=openAtMax). closedTranslate moves sheet fully below bottom.
  const closedTranslate = sheetHeight + 24; // sheet height + margins
  const translateY = useRef(new Animated.Value(closedTranslate)).current;
  const dragStartRef = useRef(0);
  const contentScrollYRef = useRef(0);
  const [mounted, setMounted] = useState(visible);

  // Build snap points in translateY space
  const snapRatios: number[] = useMemo(() => {
    const base = (
      snapPoints && snapPoints.length > 0 ? snapPoints : [maxHeightRatio]
    ).map(r => Math.max(0.05, Math.min(r, maxHeightRatio)));
    // ensure unique and sorted ascending by ratio
    const uniq = Array.from(new Set(base.map(v => Number(v.toFixed(4)))));
    return uniq.sort((a, b) => a - b);
  }, [snapPoints, maxHeightRatio]);

  const ratioToTranslate = (r: number) => {
    // visible = r * H, but the sheet has height = maxHeightRatio * H
    // translateY = sheetHeight - visible = (maxHeightRatio - r) * H
    return Math.max(0, Math.round((maxHeightRatio - r) * H));
  };
  const minTranslate = useMemo(
    () => ratioToTranslate(snapRatios[snapRatios.length - 1] || maxHeightRatio),
    [H, maxHeightRatio, snapRatios],
  );
  const snapTranslates: number[] = useMemo(
    () => snapRatios.map(r => ratioToTranslate(r)),
    [H, snapRatios],
  );

  // Track current snap index (index within snapTranslates)
  const [snapIndex, setSnapIndex] = useState(() => {
    const idx = initialSnapIndex ?? snapTranslates.length - 1;
    return Math.max(0, Math.min(idx, Math.max(0, snapTranslates.length - 1)));
  });

  useEffect(() => {
    // when snap points or dimensions change, keep the same logical index
    setSnapIndex(prev =>
      Math.max(0, Math.min(prev, Math.max(0, snapTranslates.length - 1))),
    );
  }, [snapTranslates.length]);

  // mount when visible toggles true, unmount after close animation
  useEffect(() => {
    if (visible) {
      setMounted(true);
      const openTo =
        snapTranslates[
          Math.max(0, Math.min(snapIndex, snapTranslates.length - 1))
        ] ?? 0;
      Animated.timing(translateY, {
        toValue: openTo,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else if (mounted) {
      Animated.timing(translateY, {
        toValue: closedTranslate,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setMounted(false);
      });
    }
  }, [
    visible,
    mounted,
    closedTranslate,
    translateY,
    snapTranslates,
    snapIndex,
  ]);

  const animateClose = () => {
    Animated.timing(translateY, {
      toValue: closedTranslate,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setMounted(false);
      onClose();
    });
  };

  const springTo = (toValue: number) =>
    new Promise<void>(resolve => {
      Animated.spring(translateY, {
        toValue,
        damping: 18,
        stiffness: 180,
        useNativeDriver: true,
      }).start(() => resolve());
    });

  const nearestSnapIndexFor = (ty: number) => {
    // consider closed as an option as well, but return -1 for closed to distinguish
    let nearest = 0;
    let best = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < snapTranslates.length; i++) {
      const d = Math.abs(ty - snapTranslates[i]);
      if (d < best) {
        best = d;
        nearest = i;
      }
    }
    // also check distance to closed
    const dClosed = Math.abs(ty - closedTranslate);
    if (dClosed < best) return -1; // prefer closed if closer
    return nearest;
  };

  // Decide when to capture drags
  const shouldCaptureSheet = (
    _: GestureResponderEvent,
    g: PanResponderGestureState,
  ) => {
    const mostlyVertical = Math.abs(g.dy) > 4 && Math.abs(g.dx) < 10;
    const atTop = contentScrollYRef.current <= 1; // epsilon
    return mostlyVertical && atTop;
  };
  const shouldCaptureHandle = (
    _: GestureResponderEvent,
    _g: PanResponderGestureState,
  ) => {
    // Always capture on handle touch to ensure drag starts reliably
    return true;
  };

  // Shared responders for sheet and handle
  const createPanResponder = (
    shouldCaptureFn: (
      e: GestureResponderEvent,
      g: PanResponderGestureState,
    ) => boolean,
  ) =>
    PanResponder.create({
      onStartShouldSetPanResponder: shouldCaptureFn,
      onMoveShouldSetPanResponder: shouldCaptureFn,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        try {
          // @ts-ignore - access internal value for starting point
          dragStartRef.current = translateY.__getValue?.() ?? 0;
        } catch {
          dragStartRef.current = 0;
        }
      },
      onPanResponderMove: (_e, g) => {
        // Positive dy -> dragging downward
        let next = dragStartRef.current + g.dy;
        // Small resistance when trying to push above most-open snap
        if (next < minTranslate)
          next = minTranslate + (next - minTranslate) / 3;
        // Clamp between most-open snap and closed
        next = Math.max(minTranslate, Math.min(next, closedTranslate));
        translateY.setValue(next);
      },
      onPanResponderRelease: async (_e, g) => {
        const proposed = Math.max(
          minTranslate,
          Math.min(dragStartRef.current + g.dy, closedTranslate),
        );
        const fastDown = g.vy > 0.9;
        const pulledBeyondThird = proposed > sheetHeight * 0.33; // retains earlier heuristic

        // Choose target
        let targetIndex = nearestSnapIndexFor(proposed);
        if (fastDown || pulledBeyondThird) {
          // If user strongly pulled down near bottom half, bias towards close
          const distToClosed = Math.abs(proposed - closedTranslate);
          const distToSnap =
            targetIndex >= 0
              ? Math.abs(proposed - snapTranslates[targetIndex])
              : Number.MAX_SAFE_INTEGER;
          if (distToClosed <= distToSnap || fastDown) targetIndex = -1;
        }

        if (targetIndex === -1) {
          animateClose();
        } else {
          await springTo(snapTranslates[targetIndex]);
          setSnapIndex(targetIndex);
          onSnap?.(targetIndex);
        }
      },
      onShouldBlockNativeResponder: () => false,
    });

  const panSheet = useRef(createPanResponder(shouldCaptureSheet)).current;
  const panHandle = useRef(createPanResponder(shouldCaptureHandle)).current;

  // Accessibility handlers for the handle: treat as adjustable (up/down changes snap)
  const onA11yAction = (e: AccessibilityActionEvent) => {
    const name = e.nativeEvent.actionName;
    if (!mounted) return;
    if (name === 'increment') {
      // open more (towards index 0)
      const next = Math.max(0, snapIndex - 1);
      if (next !== snapIndex) {
        springTo(snapTranslates[next]).then(() => {
          setSnapIndex(next);
          onSnap?.(next);
        });
      }
    } else if (name === 'decrement') {
      // close more (towards bottom)
      const next = Math.min(snapTranslates.length - 1, snapIndex + 1);
      if (next !== snapIndex) {
        springTo(snapTranslates[next]).then(() => {
          setSnapIndex(next);
          onSnap?.(next);
        });
      }
    } else if (name === 'activate') {
      animateClose();
    }
  };

  return (
    <Modal
      isVisible={mounted}
      backdropOpacity={0.35}
      onBackdropPress={animateClose}
      onBackButtonPress={animateClose}
      useNativeDriver
      useNativeDriverForBackdrop
      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={160}
      animationOutTiming={140}
      style={{ margin: 0 }}
      statusBarTranslucent
      propagateSwipe
      avoidKeyboard={avoidKeyboard}
    >
      <View style={styles.root}>
        <Animated.View
          style={[
            styles.sheet,
            {
              height: sheetHeight,
              paddingBottom: insets.bottom,
              transform: [{ translateY }],
            },
          ]}
          {...(!dragOnHandleOnly ? panSheet.panHandlers : undefined)}
          accessible={false}
        >
          {/* Handle (drag or visual) */}
          <View
            style={styles.handleWrap}
            {...(dragOnHandleOnly ? panHandle.panHandlers : undefined)}
            accessibilityRole="adjustable"
            accessibilityLabel={handleA11yLabel}
            accessibilityActions={[
              { name: 'increment', label: 'Expand' },
              { name: 'decrement', label: 'Collapse' },
              { name: 'activate', label: 'Close' },
            ]}
            onAccessibilityAction={onA11yAction}
            onAccessibilityEscape={animateClose}
            accessibilityValue={{
              min: 1,
              max: Math.max(1, snapTranslates.length),
              now: Math.min(
                Math.max(1, snapIndex + 1),
                Math.max(1, snapTranslates.length),
              ),
            }}
          >
            <View style={styles.handle} />
          </View>

          {/* Content remains fully interactive. Make sure your ScrollView calls onContentScrollY. */}
          <View style={{ flex: 1 }}>
            {renderContent({
              onContentScrollY: (y: number) => {
                contentScrollYRef.current = y;
              },
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  sheet: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    borderRadius: 28,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  handleWrap: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  handle: {
    width: 68,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
});
