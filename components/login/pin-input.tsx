import { View, TextInput, Text } from "react-native";
import { useEffect, useRef } from "react";

export default function PinInput({
  pin,
  setPin,
}: {
  pin: string[];
  setPin: (pin: string[]) => void;
}) {
  const inputRefs = useRef<TextInput[]>([]);
  const handleInputChange = (text: string, index: number) => {
    const newCode = [...pin];
    newCode[index] = text;
    setPin(newCode);
  };
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && index >= 0) {
      inputRefs.current[index - 1]?.focus();
      handleInputChange("", index);
    } else if (
      parseInt(e.nativeEvent.key) >= 0 &&
      parseInt(e.nativeEvent.key) <= 9
    ) {
      inputRefs.current[index + 1]?.focus();
      handleInputChange(e.nativeEvent.key, index);
    }
  };
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, pin.length);
  }, [pin]);
  return (
    <View className="w-full flex flex-col">
      <View className="flex flex-row mb-4 space-x-4 justify-evenly">
        {pin.map((value, index) => (
          <TextInput
            key={index}
            value={value}
            // onChangeText={(text) => handleInputChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            maxLength={1}
            keyboardType="numeric"
            ref={(el: TextInput) => (inputRefs.current[index] = el)}
            className="text-4xl text-center basis-1/6 text-white bg-[#232324] py-4 rounded-lg placeholder-white"
          />
        ))}
      </View>
    </View>
  );
}
