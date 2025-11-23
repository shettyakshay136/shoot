import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './CalendarModal.styles';
import type { CalendarModalProps } from './CalendarModal.types';
import { PRIMARY_COLORS, NEUTRAL_COLORS, SECONDARY_COLORS } from '@/theme/colors';

const CalendarModal: React.FC<CalendarModalProps> = ({
  isVisible,
  onClose,
  onDateSelect,
  startDate: initialStartDate,
  endDate: initialEndDate,
  mode = 'range',
}) => {
  const [startDate, setStartDate] = useState<string | null>(
    initialStartDate || null,
  );
  const [endDate, setEndDate] = useState<string | null>(initialEndDate || null);
  const [selectedDates, setSelectedDates] = useState<{
    [key: string]: any;
  }>({});

  useEffect(() => {
    if (initialStartDate) {
      setStartDate(initialStartDate);
    }
    if (initialEndDate) {
      setEndDate(initialEndDate);
    }
  }, [initialStartDate, initialEndDate]);

  useEffect(() => {
    // Update marked dates when startDate or endDate changes
    const marked: { [key: string]: any } = {};
    
    if (startDate) {
      marked[startDate] = {
        startingDay: true,
        color: SECONDARY_COLORS[700], // Dark brown for selected date
        textColor: '#FFFFFF',
      };
    }

    if (endDate) {
      marked[endDate] = {
        endingDay: true,
        color: SECONDARY_COLORS[700], // Dark brown for selected date
        textColor: '#FFFFFF',
      };
    }

    // Mark dates in between
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const current = new Date(start);
      
      while (current <= end) {
        const dateStr = current.toISOString().split('T')[0];
        if (dateStr !== startDate && dateStr !== endDate) {
          marked[dateStr] = {
            color: PRIMARY_COLORS[50],
            textColor: PRIMARY_COLORS[900],
          };
        }
        current.setDate(current.getDate() + 1);
      }
    } else if (startDate && !endDate) {
      // Only start date selected
      marked[startDate] = {
        selected: true,
        startingDay: true,
        color: SECONDARY_COLORS[700], // Dark brown for selected date
        textColor: '#FFFFFF',
      };
    }

    setSelectedDates(marked);
  }, [startDate, endDate]);

  const handleDayPress = (day: DateData) => {
    const dateStr = day.dateString;

    if (mode === 'single') {
      setStartDate(dateStr);
      setEndDate(null);
    } else {
      // Range mode
      if (!startDate || (startDate && endDate)) {
        // Start new selection
        setStartDate(dateStr);
        setEndDate(null);
      } else if (startDate && !endDate) {
        // Complete the range
        if (dateStr < startDate) {
          // If selected date is before start date, swap them
          setEndDate(startDate);
          setStartDate(dateStr);
        } else {
          setEndDate(dateStr);
        }
      }
    }
  };

  const handleApply = () => {
    onDateSelect(startDate, endDate);
    onClose();
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedDates({});
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not selected';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (!isVisible) return null;

  return (
    <View style={styles.dropdownContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>
          {mode === 'range' ? 'Select Date Range' : 'Select Date'}
        </Text>

        {mode === 'range' && (
          <View style={styles.dateRangeInfo}>
            <View>
              <Text style={styles.dateInfoText}>Start Date</Text>
              <Text style={styles.dateInfoValue}>{formatDate(startDate)}</Text>
            </View>
            <View>
              <Text style={styles.dateInfoText}>End Date</Text>
              <Text style={styles.dateInfoValue}>{formatDate(endDate)}</Text>
            </View>
          </View>
        )}

        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={selectedDates}
            markingType="period"
            theme={{
              backgroundColor: '#FFFFFF',
              calendarBackground: '#FFFFFF',
              textSectionTitleColor: NEUTRAL_COLORS[600],
              selectedDayBackgroundColor: SECONDARY_COLORS[700], // Dark brown for selected date
              selectedDayTextColor: '#FFFFFF',
              todayBackgroundColor: PRIMARY_COLORS[50], // Light orange-beige for today
              todayTextColor: SECONDARY_COLORS[900], // Dark brown text for today
              dayTextColor: SECONDARY_COLORS[900], // Dark brown for current month dates
              textDisabledColor: NEUTRAL_COLORS[300], // Light grey for inactive dates
              dotColor: PRIMARY_COLORS[500],
              selectedDotColor: '#FFFFFF',
              arrowColor: NEUTRAL_COLORS[600], // Grey for navigation arrows
              monthTextColor: SECONDARY_COLORS[900], // Dark brown for month/year header
              textDayFontFamily: 'Saans TRIAL',
              textMonthFontFamily: 'Saans TRIAL',
              textDayHeaderFontFamily: 'Saans TRIAL',
              textDayFontWeight: '400',
              textMonthFontWeight: '600',
              textDayHeaderFontWeight: '500',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            minDate={new Date().toISOString().split('T')[0]}
            enableSwipeMonths={true}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            activeOpacity={0.7}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.applyButtonTouchable}
            onPress={handleApply}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#000000', '#61240E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.applyButton}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CalendarModal;

