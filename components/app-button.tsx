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
    <Text
      className={`text-lg font-semibold ${variant === "primary" ? "text-white" : variant === "ghost" ? "text-[#FF238C]" : variant === "disabled" ? "text-gray-300" : "text-black"}`}
    >
      {text}
    </Text>
  );

  if (variant === "ghost") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        className="bg-[#FF238C]/20 rounded-full flex items-center justify-center py-3"
      >
        {content}
      </TouchableOpacity>
    );
  }

  if (variant === "disabled") {
    return (
      <View className="bg-[#FF238C] border-2 opacity-50 border-[#FF238C] rounded-full flex items-center justify-center py-3">
        {content}
      </View>
    );
  }

  if (variant === "secondary") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        className="bg-white border-2 border-white rounded-full flex items-center justify-center py-3 px-4 text-black"
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className="bg-[#FF238C] border-2 border-[#FF238C] rounded-full flex items-center justify-center py-3"
    >
      {content}
    </TouchableOpacity>
  );
}
