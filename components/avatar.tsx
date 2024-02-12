import { View, Text } from "react-native";

export default function Avatar({ name }: { name: string }) {
  return (
    <View className="h-12 w-12 rounded-full border-[#667DFF] border-2 flex items-center justify-center">
      <Text className="text-[#667DFF] text-xl font-bold">{name}</Text>
    </View>
  );
}
