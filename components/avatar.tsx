import { View, Text } from "react-native";

export default function Avatar({ name }: { name: string }) {
  return (
    <View className="h-12 w-12 rounded-full border-[#C9B3F9] border-2 flex items-center justify-center">
      <Text className="text-[#C9B3F9] text-xl font-bold">{name}</Text>
    </View>
  );
}
