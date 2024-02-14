import { View, Text } from "react-native";

export default function Avatar({
  name,
  size = 12,
}: {
  name: string;
  size?: number;
}) {
  return (
    <View
      className={`h-14 w-14 rounded-full bg-[#B4B7B9] flex items-center justify-center`}
    >
      <Text className={`text-white text-xl font-bold`}>{name}</Text>
    </View>
  );
}
