import { Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native";

export default function AppButton({
  text,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
}: {
  text: string;
  loading?: boolean;
  onPress: () => void;
  variant?: "primary" | "ghost" | "disabled" | "secondary";
  disabled?: boolean;
}) {
  const content = loading ? (
    <ActivityIndicator size="small" color="#FFF" />
  ) : (
    <Text className="text-lg text-white font-semibold">{text}</Text>
  );

  if (variant === "ghost") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        className="bg-[#0061FF]/20 rounded-full flex items-center justify-center py-3"
      >
        {content}
      </TouchableOpacity>
    );
  }

  if (variant === "disabled") {
    return (
      <View className="bg-[#0061FF] border-2 opacity-50 border-[#0061FF] rounded-full flex items-center justify-center py-3">
        {content}
      </View>
    );
  }

  if (variant === "secondary") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        className="bg-white border-2 border-white rounded-full flex items-center justify-center py-3 px-4"
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className="bg-[#0061FF] border-2 border-[#0061FF] rounded-full flex items-center justify-center py-3"
    >
      {content}
    </TouchableOpacity>
  );
}
