// app/(auth)/signup/UploadAssignment.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
// If you already use a picker, wire it here; otherwise this will be optional.
let DocumentPicker: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  DocumentPicker = require('react-native-document-picker');
} catch {}

type UploadStatus = 'queued' | 'uploading' | 'uploaded' | 'failed';

type UploadItem = {
  id: string;
  name: string;
  sizeBytes: number;
  progress: number; // 0..1
  status: UploadStatus;
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
};

const randomId = () => Math.random().toString(36).slice(2, 9);

export default function UploadAssignmentScreen() {
  const [items, setItems] = useState<UploadItem[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setInterval>>>(
    {},
  ).current;

  // —— Derived rules
  const hasFiles = items.length > 0;
  const anyUploading = items.some(f => f.status === 'uploading');
  const allUploaded = hasFiles && items.every(f => f.status === 'uploaded');

  // —— Progress bar animation per row
  const progressSV = useRef<
    Record<string, ReturnType<typeof useSharedValue<number>>>
  >({}).current;
  const ensureProgress = (id: string, p: number) => {
    if (!progressSV[id]) progressSV[id] = useSharedValue(0);
    progressSV[id].value = withTiming(p, { duration: 160 });
  };

  // —— Simulated upload (replace with real uploader)
  const beginUpload = (u: UploadItem) => {
    setItems(prev =>
      prev.map(it => (it.id === u.id ? { ...it, status: 'uploading' } : it)),
    );
    timers[u.id] && clearInterval(timers[u.id]);

    timers[u.id] = setInterval(() => {
      setItems(prev => {
        const cur = prev.find(i => i.id === u.id);
        if (!cur) return prev;
        if (cur.status !== 'uploading') return prev;
        const nextProgress = Math.min(1, cur.progress + Math.random() * 0.08);
        ensureProgress(u.id, nextProgress);
        if (nextProgress >= 1) {
          clearInterval(timers[u.id]);
          delete timers[u.id];
          return prev.map(i =>
            i.id === u.id ? { ...i, progress: 1, status: 'uploaded' } : i,
          );
        }
        return prev.map(i =>
          i.id === u.id ? { ...i, progress: nextProgress } : i,
        );
      });
    }, 350);
  };

  useEffect(() => {
    return () => {
      Object.values(timers).forEach(clearInterval);
    };
  }, []);

  // —— Picker
  const pickFiles = async () => {
    try {
      if (!DocumentPicker) {
        // Fallback: add a couple of demo items if the picker lib isn't installed
        const demo: UploadItem = {
          id: randomId(),
          name: `Demo_Highlight_${Date.now().toString().slice(-4)}.mp4`,
          sizeBytes: 220 * 1024 * 1024,
          progress: 0,
          status: 'queued',
        };
        setItems(prev => {
          ensureProgress(demo.id, 0);
          return [...prev, demo];
        });
        setTimeout(() => beginUpload(demo), 250);
        return;
      }

      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.video, DocumentPicker.types.allFiles],
        copyTo: 'cachesDirectory',
        allowMultiSelection: true,
      });

      const mapped: UploadItem[] = res.map((f: any) => ({
        id: randomId(),
        name: f.name ?? 'Unnamed',
        sizeBytes: Number(f.size) || 0,
        progress: 0,
        status: 'queued',
      }));

      setItems(prev => {
        mapped.forEach(m => ensureProgress(m.id, 0));
        return [...prev, ...mapped];
      });

      // Kick off uploads
      setTimeout(() => mapped.forEach(beginUpload), 250);
    } catch (e: any) {
      if (
        DocumentPicker &&
        DocumentPicker.isCancel &&
        DocumentPicker.isCancel(e)
      ) {
        // user cancelled
      } else {
        Alert.alert('Picker error', String(e?.message ?? e));
      }
    }
  };

  const removeItem = (id: string) => {
    timers[id] && clearInterval(timers[id]);
    delete timers[id];
    setItems(prev => prev.filter(i => i.id !== id));
    delete progressSV[id];
  };

  const ProgressBar = ({ id }: { id: string }) => {
    const sv = progressSV[id] || (progressSV[id] = useSharedValue(0));
    const style = useAnimatedStyle(() => ({
      width: `${Math.max(0, Math.min(1, sv.value)) * 100}%`,
    }));
    return (
      <View className="h-1.5 rounded-full bg-neutral-200 overflow-hidden">
        <Animated.View
          className="h-1.5 rounded-full bg-primary-700"
          style={style}
        />
      </View>
    );
  };

  const Row = ({ f }: { f: UploadItem }) => {
    const rightText =
      f.status === 'uploaded'
        ? formatSize(f.sizeBytes)
        : `${Math.round(f.progress * 100)}%`;

    return (
      <View className="mb-3 rounded-2xl bg-white border border-neutral-200 px-3 py-2">
        <View className="flex-row items-start">
          <View className="flex-1 pr-2">
            <Text
              className="text-[13px] text-neutral-900"
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {f.name}
            </Text>
            <Text
              className={`text-[11px] mt-0.5 ${
                f.status === 'uploaded' ? 'text-green-700' : 'text-neutral-500'
              }`}
            >
              {f.status === 'uploaded' ? 'Uploaded' : 'Uploading'}
            </Text>

            {/* progress */}
            {f.status !== 'uploaded' ? (
              <View className="mt-2">
                <ProgressBar id={f.id} />
              </View>
            ) : null}
          </View>

          {/* right side: percentage / size + action */}
          <View className="items-end">
            <Text
              className={`text-[11px] ${
                f.status === 'uploaded'
                  ? 'text-neutral-500'
                  : 'text-neutral-500'
              }`}
            >
              {rightText}
            </Text>

            <Pressable
              onPress={() => removeItem(f.id)}
              className="mt-1.5 p-1 rounded-full active:opacity-80"
              accessibilityRole="button"
            >
              <Ionicons
                name={f.status === 'uploaded' ? 'trash' : 'close'}
                size={16}
                color={f.status === 'uploaded' ? '#E11D48' : '#9CA3AF'}
              />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  const onSubmit = () => {
    if (!allUploaded) return;
    Alert.alert('Submitted', 'Your files were submitted for review. 🎉');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
      >
        {/* Top art */}
        <View className="items-center mt-3 mb-4">
          <Ionicons name="film" size={44} color="#6B7280" />
        </View>

        <Text className="text-center text-[20px] font-semibold text-neutral-900">
          Upload files
        </Text>
        <Text className="text-center text-[12px] text-neutral-500 mt-2 mb-6">
          Follow the instructions you have received in the email and upload it
          securely from here.
        </Text>

        {/* Upload button (dashed) */}
        <Pressable
          onPress={pickFiles}
          className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/30 px-4 py-3 active:opacity-90"
          style={{ borderStyle: 'dashed' }}
          accessibilityRole="button"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="cloud-upload-outline" size={18} color="#B45309" />
            <Text
              className="ml-2 text-[13px] font-semibold"
              style={{ color: '#B45309' }}
            >
              Upload files
            </Text>
          </View>
        </Pressable>

        {/* Files list */}
        {items.length > 0 && (
          <View className="mt-4">
            {items.map(f => (
              <Row key={f.id} f={f} />
            ))}
          </View>
        )}

        {/* Submit CTA */}
        <View className="mt-6">
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={!allUploaded}
            onPress={onSubmit}
            className="w-full rounded-full overflow-hidden"
          >
            <LinearGradient
              colors={
                allUploaded ? ['#2B0A06', '#7E0B06'] : ['#E5E7EB', '#D1D5DB']
              }
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={{ paddingVertical: 16, borderRadius: 999 }}
            >
              <View className="flex-row items-center justify-center">
                <Text
                  className={`font-semibold text-[15px] ${
                    allUploaded ? 'text-white' : 'text-neutral-600'
                  }`}
                >
                  Submit for review
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={16}
                  color={allUploaded ? '#fff' : '#6B7280'}
                  style={{ marginLeft: 8 }}
                />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Hint */}
          {!hasFiles ? (
            <Text className="text-center text-[12px] text-neutral-400 mt-2">
              Add at least one file to continue.
            </Text>
          ) : !allUploaded ? (
            <Text className="text-center text-[12px] text-neutral-400 mt-2">
              Please wait for all uploads to finish.
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
