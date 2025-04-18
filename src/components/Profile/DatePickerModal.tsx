import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ListRenderItemInfo,
} from 'react-native';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: string) => void;
  initialDate?: string;
}

const ITEM_HEIGHT = 50;
const PICKER_HEIGHT = 250;

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  onClose,
  onSelect,
  initialDate = '01/01/2000',
}) => {
  const parseInitialDate = () => {
    if (initialDate) {
      const parts = initialDate.split('/');
      if (parts.length === 3) {
        const [day, monthNumber, year] = parts;
        const monthIndex = parseInt(monthNumber, 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
          const monthNames = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ];
          return {
            day,
            month: monthNames[monthIndex],
            year,
          };
        }

        return {day, month: 'Jan', year};
      }
    }
    return {day: '01', month: 'Jan', year: '2000'};
  };

  const initialDateValues = parseInitialDate();

  const [selectedDay, setSelectedDay] = useState<string>(initialDateValues.day);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    initialDateValues.month,
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    initialDateValues.year,
  );

  const dayListRef = useRef<FlatList>(null);
  const monthListRef = useRef<FlatList>(null);
  const yearListRef = useRef<FlatList>(null);

  const days = Array.from({length: 31}, (_, i) =>
    (i + 1).toString().padStart(2, '0'),
  );
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const years = Array.from({length: 100}, (_, i) => (i + 1970).toString());

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        scrollToInitialPositions();
      }, 200);
    }
  }, [visible]);

  const scrollToInitialPositions = () => {
    const dayIndex = days.findIndex(d => d === selectedDay);
    if (dayIndex !== -1 && dayListRef.current) {
      dayListRef.current.scrollToOffset({
        offset: dayIndex * ITEM_HEIGHT,
        animated: false,
      });
    }

    const monthIndex = months.findIndex(m => m === selectedMonth);
    if (monthIndex !== -1 && monthListRef.current) {
      monthListRef.current.scrollToOffset({
        offset: monthIndex * ITEM_HEIGHT,
        animated: false,
      });
    }

    const yearIndex = years.findIndex(y => y === selectedYear);
    if (yearIndex !== -1 && yearListRef.current) {
      yearListRef.current.scrollToOffset({
        offset: yearIndex * ITEM_HEIGHT,
        animated: false,
      });
    }
  };

  const handleConfirm = async () => {
    try {
      const monthNumber = (months.indexOf(selectedMonth) + 1)
        .toString()
        .padStart(2, '0');
      const formattedDate = `${selectedDay}/${monthNumber}/${selectedYear}`;
      onSelect(formattedDate);
      onClose();
    } catch (error) {
      console.error('Failed to save birthday:', error);
    }
  };

  const handleCancel = () => {
    setSelectedDay(initialDateValues.day);
    setSelectedMonth(initialDateValues.month);
    setSelectedYear(initialDateValues.year);
    onClose();
  };

  const getItemLayout = (data: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  const handleDayChange = (index: number) => {
    if (index >= 0 && index < days.length) {
      setSelectedDay(days[index]);
    }
  };

  const handleMonthChange = (index: number) => {
    if (index >= 0 && index < months.length) {
      setSelectedMonth(months[index]);
    }
  };

  const handleYearChange = (index: number) => {
    if (index >= 0 && index < years.length) {
      setSelectedYear(years[index]);
    }
  };

  const renderDay = ({item}: ListRenderItemInfo<string>) => (
    <View
      style={[
        styles.pickerItem,
        selectedDay === item && styles.selectedItemContainer,
      ]}>
      <Text
        style={[
          styles.pickerItemText,
          selectedDay === item
            ? styles.selectedItemText
            : styles.unselectedItemText,
        ]}>
        {item}
      </Text>
    </View>
  );

  const renderMonth = ({item}: ListRenderItemInfo<string>) => (
    <View
      style={[
        styles.pickerItem,
        selectedMonth === item && styles.selectedItemContainer,
      ]}>
      <Text
        style={[
          styles.pickerItemText,
          selectedMonth === item
            ? styles.selectedItemText
            : styles.unselectedItemText,
        ]}>
        {item}
      </Text>
    </View>
  );

  const renderYear = ({item}: ListRenderItemInfo<string>) => (
    <View
      style={[
        styles.pickerItem,
        selectedYear === item && styles.selectedItemContainer,
      ]}>
      <Text
        style={[
          styles.pickerItemText,
          selectedYear === item
            ? styles.selectedItemText
            : styles.unselectedItemText,
        ]}>
        {item}
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.pickerContainer}>
            <View style={styles.pickerColumn}>
              <FlatList
                ref={dayListRef}
                data={days}
                renderItem={renderDay}
                keyExtractor={item => `day-${item}`}
                getItemLayout={getItemLayout}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                onScrollToIndexFailed={() => {}}
                onMomentumScrollEnd={e => {
                  const offset = e.nativeEvent.contentOffset.y;
                  const index = Math.round(offset / ITEM_HEIGHT);
                  handleDayChange(index);
                }}
                ListHeaderComponent={<View style={styles.pickerHeaderFooter} />}
                ListFooterComponent={<View style={styles.pickerHeaderFooter} />}
                initialNumToRender={31}
                maxToRenderPerBatch={31}
                windowSize={5}
                removeClippedSubviews={true}
              />
              <View style={styles.highlightBar} pointerEvents="none" />
            </View>
            <View style={styles.pickerColumn}>
              <FlatList
                ref={monthListRef}
                data={months}
                renderItem={renderMonth}
                keyExtractor={item => `month-${item}`}
                getItemLayout={getItemLayout}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                onScrollToIndexFailed={() => {}}
                onMomentumScrollEnd={e => {
                  const offset = e.nativeEvent.contentOffset.y;
                  const index = Math.round(offset / ITEM_HEIGHT);
                  handleMonthChange(index);
                }}
                ListHeaderComponent={<View style={styles.pickerHeaderFooter} />}
                ListFooterComponent={<View style={styles.pickerHeaderFooter} />}
                initialNumToRender={12}
                maxToRenderPerBatch={12}
                windowSize={5}
                removeClippedSubviews={true}
              />
              <View style={styles.highlightBar} pointerEvents="none" />
            </View>
            <View style={styles.pickerColumn}>
              <FlatList
                ref={yearListRef}
                data={years}
                renderItem={renderYear}
                keyExtractor={item => `year-${item}`}
                getItemLayout={getItemLayout}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                onScrollToIndexFailed={() => {}}
                onMomentumScrollEnd={e => {
                  const offset = e.nativeEvent.contentOffset.y;
                  const index = Math.round(offset / ITEM_HEIGHT);
                  handleYearChange(index);
                }}
                ListHeaderComponent={<View style={styles.pickerHeaderFooter} />}
                ListFooterComponent={<View style={styles.pickerHeaderFooter} />}
                initialNumToRender={20}
                maxToRenderPerBatch={20}
                windowSize={7}
                removeClippedSubviews={true}
              />
              <View style={styles.highlightBar} pointerEvents="none" />
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>CONFIRM</Text>
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
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
  },
  pickerContainer: {
    flexDirection: 'row',
    height: PICKER_HEIGHT,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  pickerColumn: {
    flex: 1,
    height: PICKER_HEIGHT,
    position: 'relative',
    justifyContent: 'center',
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  staticItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedItemContainer: {
    backgroundColor: 'rgba(232, 245, 255, 0.3)',
  },
  pickerItemText: {
    fontSize: 20,
    textAlign: 'center',
  },
  selectedItemText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  unselectedItemText: {
    color: '#aaa',
    fontSize: 18,
  },
  pickerHeaderFooter: {
    height: Math.floor((PICKER_HEIGHT - ITEM_HEIGHT) / 2),
  },
  highlightBar: {
    position: 'absolute',
    top: (PICKER_HEIGHT - ITEM_HEIGHT) / 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#cae7ff',
    zIndex: -1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFDE00',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFDE00',
  },
});

export default DatePickerModal;
