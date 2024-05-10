import { useState } from "react";
import { View, Pressable, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function DatePicker({
  date,
  setDate,
}: {
  date: Date;
  setDate: (date: Date) => void;
}) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setDate(date);
    hideDatePicker();
  };

  return (
    <View className="bg-white dark:bg-greyInput rounded-lg px-3 py-4">
      <Pressable onPress={showDatePicker}>
        <Text className="text-darkGrey dark:text-white">
          {date.toDateString()}
        </Text>
      </Pressable>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={new Date()}
        date={date}
      />
    </View>
  );
}
