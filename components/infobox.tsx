import { ReactNode } from "react";
import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export function InfoBox({
  title,
  subtitle,
  variant,
}: {
  title: string;
  subtitle: string;
  variant: "info" | "warning";
}) {
  const backgroundColor =
    variant === "info" ? "bg-white/25" : "bg-amber-600/25";
  const textColor = variant === "info" ? "text-white" : "text-amber-600";
  const iconColor = variant === "info" ? "#FFFFFF" : "#FFFF00";
  return (
    <View
      className={`${backgroundColor} rounded-lg flex flex-row space-x-4 p-4 mx-2`}
    >
      <View className="flex-none">
        <Icon
          name={variant === "info" ? "info-circle" : "warning"}
          color={iconColor}
          size={24}
        />
      </View>
      <View className="flex-1 flex flex-col justify-start items-start space-y-2">
        <Text className={`font-bold ${textColor} text-left`}>{title}</Text>
        <Text className={`${textColor}  text-left`}>{subtitle}</Text>
      </View>
    </View>
  );
}
