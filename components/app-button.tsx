import { Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native";

export default function AppButton({
  text,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  mt,
  mb,
}: {
  text: string;
  loading?: boolean;
  onPress: () => void;
  variant?: "primary" | "ghost" | "disabled" | "secondary" | "farcaster";
  disabled?: boolean;
  mt?: `mt-${string}`;
  mb?: `mb-${string}`;
}) {
  const verticalMargin = `${mt} ${mb}`;

  const content = loading ? (
    <ActivityIndicator size="small" color="#FFF" />
  ) : (
    <Text
      className={`text-lg font-semibold ${variant === "primary" ? "text-white" : variant === "ghost" ? "text-primary" : variant === "disabled" ? "text-gray-300" : variant === "farcaster" ? "text-white" : "text-black"}`}
    >
      {text}
    </Text>
  );

  if (variant === "ghost") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        className={`bg-[#FF5D8F4D] rounded-full flex items-center justify-center py-3 ${verticalMargin}`}
      >
        {content}
      </TouchableOpacity>
    );
  }

  if (variant === "disabled") {
    return (
      <View
        className={`bg-primary border-2 opacity-50 border-primary rounded-full flex items-center justify-center py-3 ${verticalMargin}`}
      >
        {content}
      </View>
    );
  }

  if (variant === "secondary") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        className={`bg-white border-2 border-white rounded-full flex items-center justify-center py-3 px-4 text-black ${verticalMargin}`}
      >
        {content}
      </TouchableOpacity>
    );
  }

  if (variant === "farcaster") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        className={`bg-[#855DCD] border-2 border-[#855DCD] rounded-full flex items-center justify-center py-3 px-4 text-white ${verticalMargin}`}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`bg-primary border-2 border-primary rounded-full flex items-center justify-center py-3 ${verticalMargin}`}
    >
      {content}
    </TouchableOpacity>
  );
}
