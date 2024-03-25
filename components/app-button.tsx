import { Text, TouchableOpacity, View } from "react-native";

export default function AppButton({
  text,
  onPress,
  variant = "primary",
  disabled = false,
}: {
  text: string;
  onPress: () => void;
  variant?: "primary" | "ghost" | "disabled" | "secondary";
  disabled?: boolean;
}) {
  if (variant === "ghost") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className="bg-[#0061FF]/20 rounded-full flex items-center justify-center py-3"
      >
        <Text className="text-lg text-[#3F89FF] font-semibold">{text}</Text>
      </TouchableOpacity>
    );
  }

  if (variant === "disabled") {
    return (
      <View className="bg-[#0061FF] border-2 opacity-50 border-[#0061FF] rounded-full flex items-center justify-center py-3">
        <Text className="text-lg text-white font-semibold">{text}</Text>
      </View>
    );
  }

  if (variant === "secondary") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className="bg-white border-2 border-white rounded-full flex items-center justify-center py-3 px-4"
      >
        <Text className="text-lg text-black font-semibold">{text}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-[#0061FF] border-2 border-[#0061FF] rounded-full flex items-center justify-center py-3"
    >
      <Text className="text-lg text-white font-semibold">{text}</Text>
    </TouchableOpacity>
  );
}
