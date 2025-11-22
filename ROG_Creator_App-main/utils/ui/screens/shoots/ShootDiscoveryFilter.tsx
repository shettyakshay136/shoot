// shootDiscoveryFilter.tsx
import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Modal,
  Pressable,
  UIManager,
  findNodeHandle,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ROG } from '@/utils/config/theme.config';

type HoursOption = 'Any' | '0-2 hours' | '2-5 hours' | '5-8 hours' | '8+ hours';

const HOURS_OPTIONS: HoursOption[] = [
  'Any',
  '0-2 hours',
  '2-5 hours',
  '5-8 hours',
  '8+ hours',
];

export interface ShootDiscoveryFilterProps {
  // controlled values
  startDate?: Date | null;
  endDate?: Date | null;
  shootHours?: HoursOption | null;
  radiusKm: number; // 15..45

  // setters from parent (so parent holds the state)
  setStartDate: (d: Date | null) => void;
  setEndDate: (d: Date | null) => void;
  setShootHours: (h: HoursOption | null) => void;
  setRadiusKm: (km: number) => void;

  // CTA
  canFilter: boolean;
  onFilter: () => void;

  // Optional: label overrides
  title?: string;
}

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const formatDate = (d?: Date | null) =>
  d ? `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}` : '';

export default function ShootDiscoveryFilter({
  startDate = null,
  endDate = null,
  shootHours = null,
  radiusKm,
  setStartDate,
  setEndDate,
  setShootHours,
  setRadiusKm,
  canFilter,
  onFilter,
  title = 'Filter shoots',
}: ShootDiscoveryFilterProps) {
  // local UI state
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [hoursOpen, setHoursOpen] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState<
    { x: number; y: number; width: number; height: number } | null
  >(null);
  const hoursRef = useRef<View>(null);

  const prettyStart = useMemo(() => formatDate(startDate), [startDate]);
  const prettyEnd = useMemo(() => formatDate(endDate), [endDate]);

  const onPickStart = (_: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS !== 'ios') setShowStartPicker(false);
    if (date) {
      setStartDate(date);
      // keep endDate valid (>= startDate)
      if (endDate && date > endDate) setEndDate(date);
    }
  };

  const onPickEnd = (_: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS !== 'ios') setShowEndPicker(false);
    if (date) {
      // end cannot be earlier than start
      if (startDate && date < startDate) {
        setEndDate(startDate);
        return;
      }
      setEndDate(date);
    }
  };

  const inactive = !canFilter;

  return (
    <View className="w-full p-6">
      {/* Title */}
      <Text className="text-center text-[20px] font-semibold text-neutral-900 dark:text-neutral-100 mb-5">
        {title}
      </Text>

      {/* Date range */}
      <Text className="text-[12px] text-neutral-500 mb-2">Date range</Text>
      <View className="flex-row items-center gap-3">
        {/* Start */}
        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          activeOpacity={0.9}
          className="flex-1 rounded-xl border border-neutral-200 dark:border-neutral-800 px-4 py-3 bg-white dark:bg-neutral-900"
        >
          <Text
            className={`text-[14px] ${
              startDate
                ? 'text-neutral-900 dark:text-neutral-100'
                : 'text-neutral-400'
            }`}
          >
            {prettyStart || 'Starting date'}
          </Text>
        </TouchableOpacity>

        {/* dash */}
        <Text className="text-neutral-400">—</Text>

        {/* End */}
        <TouchableOpacity
          onPress={() => setShowEndPicker(true)}
          activeOpacity={0.9}
          className="flex-1 rounded-xl border border-neutral-200 dark:border-neutral-800 px-4 py-3 bg-white dark:bg-neutral-900"
        >
          <Text
            className={`text-[14px] ${
              endDate
                ? 'text-neutral-900 dark:text-neutral-100'
                : 'text-neutral-400'
            }`}
          >
            {prettyEnd || 'Ending date'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Native pickers (Android opens as dialogs; iOS inline modal-style) */}
      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={onPickStart}
          maximumDate={endDate || undefined}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={endDate || startDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={onPickEnd}
          minimumDate={startDate || undefined}
        />
      )}

      {/* Shoot hours */}
      <Text className="text-[12px] text-neutral-500 mt-6 mb-2">
        Shoot hours
      </Text>
      <TouchableOpacity
        ref={hoursRef}
        onPress={() => {
          const handle = findNodeHandle(hoursRef.current);
          if (handle) {
            // measure the input position in window coords
            UIManager.measureInWindow(
              handle,
              (x, y, width, height) => {
                setDropdownLayout({ x, y, width, height });
                setHoursOpen(true);
              },
            );
          } else {
            setHoursOpen(true);
          }
        }}
        activeOpacity={0.9}
        className="rounded-xl border border-neutral-200 dark:border-neutral-800 px-4 py-3 bg-white dark:bg-neutral-900 flex-row items-center justify-between"
      >
        <Text
          className={`text-[14px] ${
            shootHours
              ? 'text-neutral-900 dark:text-neutral-100'
              : 'text-neutral-400'
          }`}
        >
          {shootHours || 'Select hours'}
        </Text>
        <Ionicons
          name="chevron-down"
          size={18}
          color={shootHours ? '#0F172A' : '#9CA3AF'}
        />
      </TouchableOpacity>

      {/* Hours dropdown overlay (anchored) */}
      <Modal
        visible={hoursOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setHoursOpen(false)}
      >
        <Pressable
          className="flex-1"
          onPress={() => setHoursOpen(false)}
          accessibilityRole="button"
          accessibilityLabel="Close hours dropdown"
        >
          <View className="absolute bg-white rounded-2xl shadow-lg border border-neutral-200"
            style={{
              top: (dropdownLayout?.y ?? 120) + (dropdownLayout?.height ?? 0) + 4,
              left: dropdownLayout?.x ?? 16,
              width: dropdownLayout?.width ?? 280,
            }}
          >
            {HOURS_OPTIONS.map(item => {
              const selected = shootHours === item;
              return (
                <Pressable
                  key={item}
                  onPress={() => {
                    setShootHours(item === 'Any' ? null : item);
                    setHoursOpen(false);
                  }}
                  className={`px-4 py-3 flex-row justify-between items-center ${
                    selected ? 'bg-primary-50' : 'bg-white'
                  } active:opacity-90`}
                >
                  <Text
                    className={selected ? 'text-primary-700 font-semibold' : 'text-neutral-900'}
                  >
                    {item}
                  </Text>
                  {selected && (
                    <Ionicons name="checkmark" size={18} color={ROG.primary[600]} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>

      {/* Radius */}
      <Text className="text-[12px] text-neutral-500 mt-6 mb-2">Radius</Text>

      <View className="px-1 relative">
        <Slider
          value={radiusKm}
          onValueChange={v => setRadiusKm(Math.round(v))}
          minimumValue={15}
          maximumValue={45}
          step={1}
          minimumTrackTintColor={inactive ? '#E5E7EB' : '#111827'}
          maximumTrackTintColor={inactive ? '#F3F4F6' : '#111827'}
          thumbTintColor={inactive ? '#D1D5DB' : '#FFFFFF'}
        />
        {/* Static markers to mimic design (15km, 30km, 45km) */}
        <View pointerEvents="none" className="absolute left-0 right-0 top-[-6px] flex-row justify-between px-0">
          {['left', 'center', 'right'].map((_, i) => (
            <View
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className="w-4 h-4 rounded-full"
              style={{
                borderWidth: 2,
                borderColor: inactive ? '#E5E7EB' : '#111827',
                backgroundColor: '#FFFFFF',
              }}
            />
          ))}
        </View>
        <View className="flex-row justify-between mt-1">
          <Text className="text-[12px] text-neutral-500">15km</Text>
          <Text className="text-[12px] text-neutral-500">30km</Text>
          <Text className="text-[12px] text-neutral-500">45km</Text>
        </View>
      </View>

      {/* Filter button */}
      <TouchableOpacity
        onPress={onFilter}
        activeOpacity={canFilter ? 0.85 : 1}
        disabled={!canFilter}
        className="w-full rounded-full mt-8 overflow-hidden"
      >
        <LinearGradient
          colors={
            canFilter
              ? [ROG.primary[900], ROG.primary[800]]
              : ['#E5E7EB', '#D1D5DB']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ paddingVertical: 16, borderRadius: 999 }}
        >
          <Text
            className={`text-center font-semibold text-[15px] ${
              canFilter ? 'text-white' : 'text-neutral-600'
            }`}
          >
            Filter ↗
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

// Example usage

// const [startDate, setStartDate] = useState<Date | null>(null);
// const [endDate, setEndDate] = useState<Date | null>(null);
// const [shootHours, setShootHours] = useState<HoursOption | null>(null);
// const [radiusKm, setRadiusKm] = useState(15);

// const canFilter = !!startDate && !!endDate && radiusKm >= 15 && radiusKm <= 45; // your rule

// <ShootDiscoveryFilter
//   startDate={startDate}
//   endDate={endDate}
//   shootHours={shootHours}
//   radiusKm={radiusKm}
//   setStartDate={setStartDate}
//   setEndDate={setEndDate}
//   setShootHours={setShootHours}
//   setRadiusKm={setRadiusKm}
//   canFilter={canFilter}
//   onFilter={() => {
//     // call API or navigate with params
//   }}
// />;
