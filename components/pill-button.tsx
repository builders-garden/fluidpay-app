import { Pressable, View, Text } from "react-native";

export default function PillButton({
  text,
  onPress,
}: {
  text: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <View className="flex flex-col rounded-lg items-center justify-center space-y-2">
        <View className="bg-white/20 rounded-full p-4 flex items-center justify-center">
          <Text className="text-white font-semibold">{text}</Text>
        </View>
      </View>
    </Pressable>
  );
}
