import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {months} from '@utils/DummyData';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: string) => void;
  initialDate?: string;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  onSelect,
  initialDate = '01/01/1910',
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('01');
  const [selectedMonth, setSelectedMonth] = useState<string>('Jan');
  const [selectedYear, setSelectedYear] = useState<string>('1910');

  const dayScrollViewRef = useRef<ScrollView>(null);
  const monthScrollViewRef = useRef<ScrollView>(null);
  const yearScrollViewRef = useRef<ScrollView>(null);

  const days = Array.from({length: 31}, (_, i) =>
    String(i + 1).padStart(2, '0'),
  );

  const years = Array.from({length: 200}, (_, i) => String(1910 + i));

  // Set initial values based on initialDate
  useEffect(() => {
    if (initialDate) {
      const parts = initialDate.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        setSelectedDay(day);
        // Convert numeric month to name
        const monthIndex = parseInt(month, 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          setSelectedMonth(months[monthIndex]);
        }
        setSelectedYear(year);
      }
    }
  }, [initialDate]);

  // Set scroll position when the modal becomes visible
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        const dayIndex = days.findIndex(d => d === selectedDay);
        if (dayScrollViewRef.current && dayIndex !== -1) {
          dayScrollViewRef.current.scrollTo({
            y: dayIndex * 50,
            animated: false,
          });
        }

        const monthIndex = months.findIndex(m => m === selectedMonth);
        if (monthScrollViewRef.current && monthIndex !== -1) {
          monthScrollViewRef.current.scrollTo({
            y: monthIndex * 50,
            animated: false,
          });
        }

        const yearIndex = years.findIndex(y => y === selectedYear);
        if (yearScrollViewRef.current && yearIndex !== -1) {
          yearScrollViewRef.current.scrollTo({
            y: yearIndex * 50,
            animated: false,
          });
        }
      }, 200);
    }
  }, [visible, selectedDay, selectedMonth, selectedYear, days, years]);

  const handleConfirm = async () => {
    try {
      // Convert month name to number
      const monthNumber = (months.indexOf(selectedMonth) + 1)
        .toString()
        .padStart(2, '0');
      const formattedDate = `${selectedDay}/${monthNumber}/${selectedYear}`;

      await AsyncStorage.setItem('user_birthday', formattedDate);
      onSelect(formattedDate);
      onClose();
    } catch (error) {
      console.error('Failed to save birthday:', error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleScroll = (
    event: {nativeEvent: {contentOffset: {y: number}}},
    setter: React.Dispatch<React.SetStateAction<string>>,
    items: string[],
  ) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / 50);
    if (index >= 0 && index < items.length) {
      setter(items[index]);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Date Picker */}
          <View style={styles.pickerContainer}>
            {/* Day Picker */}
            <View style={styles.pickerColumn}>
              <ScrollView
                ref={dayScrollViewRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={50}
                decelerationRate="fast"
                onMomentumScrollEnd={e => handleScroll(e, setSelectedDay, days)}
                contentContainerStyle={styles.scrollContent}>
                <View style={styles.paddingItem} />
                {days.map(day => (
                  <View key={`day-${day}`} style={styles.pickerItem}>
                    <Text
                      style={[
                        styles.pickerItemText,
                        selectedDay === day
                          ? styles.selectedItemText
                          : styles.unselectedItemText,
                      ]}>
                      {day}
                    </Text>
                  </View>
                ))}
                <View style={styles.paddingItem} />
              </ScrollView>
              <View style={styles.highlightBar} pointerEvents="none" />
            </View>

            {/* Month Picker */}
            <View style={styles.pickerColumn}>
              <ScrollView
                ref={monthScrollViewRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={50}
                decelerationRate="fast"
                onMomentumScrollEnd={e =>
                  handleScroll(e, setSelectedMonth, months)
                }
                contentContainerStyle={styles.scrollContent}>
                <View style={styles.paddingItem} />
                {months.map(month => (
                  <View key={`month-${month}`} style={styles.pickerItem}>
                    <Text
                      style={[
                        styles.pickerItemText,
                        selectedMonth === month
                          ? styles.selectedItemText
                          : styles.unselectedItemText,
                      ]}>
                      {month}
                    </Text>
                  </View>
                ))}
                <View style={styles.paddingItem} />
              </ScrollView>
              <View style={styles.highlightBar} pointerEvents="none" />
            </View>

            {/* Year Picker */}
            <View style={styles.pickerColumn}>
              <ScrollView
                ref={yearScrollViewRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={50}
                decelerationRate="fast"
                onMomentumScrollEnd={e =>
                  handleScroll(e, setSelectedYear, years)
                }
                contentContainerStyle={styles.scrollContent}>
                <View style={styles.paddingItem} />
                {years.map(year => (
                  <View key={`year-${year}`} style={styles.pickerItem}>
                    <Text
                      style={[
                        styles.pickerItemText,
                        selectedYear === year
                          ? styles.selectedItemText
                          : styles.unselectedItemText,
                      ]}>
                      {year}
                    </Text>
                  </View>
                ))}
                <View style={styles.paddingItem} />
              </ScrollView>
              <View style={styles.highlightBar} pointerEvents="none" />
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={handleCancel}>
              <Text style={styles.buttonText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleConfirm}>
              <Text style={styles.buttonText}>CONFIRM</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
  pickerContainer: {
    flexDirection: 'row',
    height: 220,
  },
  pickerColumn: {
    flex: 1,
    height: 220,
    position: 'relative',
  },
  scrollContent: {
    paddingVertical: 85,
  },
  pickerItem: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemText: {
    fontSize: 20,
  },
  selectedItemText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  unselectedItemText: {
    color: '#aaa',
  },
  paddingItem: {
    height: 85,
  },
  highlightBar: {
    position: 'absolute',
    top: 85,
    left: 0,
    right: 0,
    height: 50,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#80d8ff',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFDE00',
  },
});

export default DatePickerModal;
