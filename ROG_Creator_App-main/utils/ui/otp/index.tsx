// OtpInput.tsx

import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface OtpInputProps {
  phoneNumber: string;
  onChangeOtp: (code: string) => void;
  isResendLoading?: boolean;
  onResend: () => void;
  error?: string | boolean;
  length?: number;
  initialSeconds?: number;
  style?: ViewStyle;
  boxStyle?: ViewStyle;
  boxTextStyle?: TextStyle;
  resendTextStyle?: TextStyle;
  errorTextStyle?: TextStyle;
}

const DIGIT_REGEX = /^[0-9]$/;

export default function OtpInput({
  phoneNumber,
  onChangeOtp,
  isResendLoading,
  onResend,
  error,
  length = 4,
  initialSeconds = 60,
  style,
  boxStyle,
  resendTextStyle,
  errorTextStyle,
}: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(
    Array.from({ length }, () => ''),
  );
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  const inputsRef = useRef<Array<TextInput | null>>([]);

  // Mask phone like 9******987
  const maskedPhone = useMemo(() => {
    const d = (phoneNumber || '').replace(/\D/g, '');
    if (d.length <= 3) return d;
    const last3 = d.slice(-3);
    const head = d[0] ?? '';
    return `${head}${'******'}${last3}`;
  }, [phoneNumber]);

  // Countdown for resend
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft(s => s - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  // Notify parent of change
  useEffect(() => {
    onChangeOtp(digits.join(''));
  }, [digits, onChangeOtp]);

  const focusInput = (idx: number) => {
    inputsRef.current[idx]?.focus();
  };

  const setDigit = (idx: number, val: string) => {
    setDigits(prev => {
      const nxt = [...prev];
      nxt[idx] = val;
      return nxt;
    });
  };

  const handleChange = (idx: number, val: string) => {
    if (val.length > 1) {
      // handle paste: “1234” pasted into one box
      const cleaned = val.replace(/\D/g, '');
      if (!cleaned) return;
      const arr = Array.from({ length }, (_, i) => cleaned[i] || '');
      setDigits(arr);
      const lastIdx = Math.min(cleaned.length, length) - 1;
      if (lastIdx >= 0) {
        focusInput(lastIdx);
      }
      return;
    }

    if (val === '' || DIGIT_REGEX.test(val)) {
      setDigit(idx, val);
      if (val && idx < length - 1) {
        focusInput(idx + 1);
      }
      if (val && idx === length - 1) {
        inputsRef.current[idx]?.blur();
      }
    }
  };

  const handleKeyPress = (
    idx: number,
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (digits[idx] === '' && idx > 0) {
        setDigit(idx - 1, '');
        focusInput(idx - 1);
      }
    }
  };

  const onPressResend = () => {
    if (secondsLeft > 0 || isResendLoading) return;
    setSecondsLeft(initialSeconds);
    onResend();
  };

  const hasError = Boolean(error);
  const errorText = typeof error === 'string' ? error : undefined;

  return (
    <View style={[{ width: '100%' }, style]}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>
        Enter the confirmation code that we sent
        {maskedPhone ? ` to ${maskedPhone}` : ''}
      </Text>

      <View style={styles.boxRow}>
        {Array.from({ length }).map((_, i) => {
          return (
            <TextInput
              key={i}
              ref={r => {
                inputsRef.current[i] = r;
              }}
              value={digits[i]}
              onChangeText={v => handleChange(i, v)}
              onKeyPress={e => handleKeyPress(i, e)}
              keyboardType="number-pad"
              returnKeyType="done"
              maxLength={1}
              style={[
                styles.boxBase,
                boxStyle,
                hasError ? styles.boxError : undefined,
              ]}
              textContentType="oneTimeCode"
              selectionColor="#000"
              placeholder=""
              placeholderTextColor="#999"
              autoFocus={i === 0}
              blurOnSubmit={false}
              onSubmitEditing={() => {
                // if last, blur
                if (i === length - 1) inputsRef.current[i]?.blur();
              }}
              textAlign="center"
            />
          );
        })}
      </View>

      {errorText ? (
        <Text style={[styles.errorText, errorTextStyle]}>{errorText}</Text>
      ) : null}

      <TouchableOpacity
        onPress={onPressResend}
        activeOpacity={secondsLeft > 0 || isResendLoading ? 1 : 0.8}
        style={{ marginTop: 16 }}
      >
        <Text
          style={[
            styles.resendText,
            resendTextStyle,
            secondsLeft > 0 || isResendLoading ? { opacity: 0.6 } : {},
          ]}
        >
          {secondsLeft > 0 || isResendLoading
            ? isResendLoading
              ? 'Resend OTP'
              : `Resend OTP in ${formatTime(secondsLeft)}`
            : 'Resend OTP'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const ss = s < 10 ? `0${s}` : `${s}`;
  return `${m}:${ss}`;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  boxBase: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    fontSize: 22,
    color: '#111',
  },
  boxError: {
    borderColor: '#d00',
  },
  errorText: {
    marginTop: 8,
    fontSize: 13,
    color: '#d00',
  },
  resendText: {
    fontSize: 14,
    color: '#d00',
  },
});
