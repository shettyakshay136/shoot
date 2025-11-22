import images from '@/utils/config/images.config';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export type ReferralCardProps = {
  onValidate: (code: string) => Promise<boolean> | boolean;
  onValidCode?: (code: string) => void;
  placeholder?: string;
  title?: string;
  defaultValue?: string;
  className?: string;
  bonusText?: string;
};

function normalizeReferral(input: string) {
  return input
    .replace(/[^a-zA-Z]/g, '')
    .slice(0, 7)
    .toUpperCase();
}

export default function ReferralCard({
  onValidate,
  onValidCode,
  placeholder = 'Enter referral code',
  title = 'Have a referral code?',
  defaultValue = '',
  bonusText = 'Get up to ₹500 as referral joining bonus',
}: ReferralCardProps) {
  const [code, setCode] = useState<string>(normalizeReferral(defaultValue));
  const [started, setStarted] = useState<boolean>(false);
  const [status, setStatus] = useState<
    'idle' | 'typing' | 'validating' | 'valid' | 'invalid'
  >(defaultValue ? 'typing' : 'idle');
  const validationRun = useRef(0);

  const canValidate = useMemo(() => code.length === 7, [code]);

  const triggerValidate = useCallback(async () => {
    if (!canValidate) return;
    const run = ++validationRun.current;
    try {
      setStatus('validating');
      const res = await onValidate(code);
      if (validationRun.current !== run) return;
      if (res) {
        setStatus('valid');
        onValidCode?.(code);
      } else {
        setStatus('invalid');
      }
    } catch {
      if (validationRun.current !== run) return;
      setStatus('invalid');
    }
  }, [canValidate, code, onValidate, onValidCode]);

  const onChange = (text: string) => {
    const normalized = normalizeReferral(text);
    if (!started && normalized.length > 0) setStarted(true);
    setCode(normalized);

    if (normalized.length < 7) {
      setStatus(normalized.length === 0 ? 'idle' : 'typing');
    } else if (normalized.length === 7) {
      // automatically trigger validation
      triggerValidate();
    }
  };

  const inputStatusClass = useMemo(() => {
    switch (status) {
      case 'valid':
        return 'border-green-500 bg-white';
      case 'invalid':
        return 'border-red-500 bg-white';
      case 'validating':
        return 'border-neutral-300 bg-white';
      default:
        return 'border-neutral-300 bg-white';
    }
  }, [status]);

  const helper = useMemo(() => {
    if (status === 'valid')
      return { text: 'Referral code applied', cls: 'text-green-700' };
    if (status === 'invalid')
      return { text: 'Invalid referral code', cls: 'text-red-700' };
    if (started)
      return { text: 'Enter 7 letter referral code', cls: 'text-neutral-400' };
    return null;
  }, [status, started]);

  const rightIcon = useMemo(() => {
    if (status === 'valid')
      return <Ionicons name="checkmark-sharp" size={18} color="#10B981" />;
    if (status === 'invalid')
      return <Ionicons name="close-sharp" size={18} color="#EF4444" />;
    if (status === 'validating')
      return <Ionicons name="timer-outline" size={18} color="#9CA3AF" />;
    return null;
  }, [status]);

  const giftImg = images.auth.signup.referal;

  return (
    <View className="p-6 my-4 bg-primary-25 rounded-xl gap-4">
      <View className="flex flex-row gap-6 items-center justify-center">
        <View className="w-10 h-10 rounded-2xl items-center justify-center">
          <Image source={giftImg} resizeMode="contain" className="w-16 h-16" />
        </View>
        <View>
          <Text className="text-[15px] font-semibold text-primary-700">
            {title}
          </Text>
          <Text className="text-[12px] text-neutral-300 my-3">{bonusText}</Text>
        </View>
      </View>

      <View className="flex-1">
        {/* Input */}
        <View
          className={`flex-row items-center rounded-full px-3 py-2 border ${inputStatusClass} bg-white`}
          style={{ borderStyle: 'dashed' }}
        >
          <TextInput
            value={code}
            onChangeText={onChange}
            autoCapitalize="characters"
            autoCorrect={false}
            keyboardType="default"
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-[14px] text-neutral-900 py-1"
            maxLength={7}
            returnKeyType="done"
          />
          {rightIcon}
        </View>

        {helper && (
          <Text className={`mt-2 text-[12px] ${helper.cls}`}>
            {helper.text}
          </Text>
        )}
      </View>
    </View>
  );
}
