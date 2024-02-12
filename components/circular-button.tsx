import { Pressable, View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function CircularButton({
  text,
  icon,
  onPress,
}: {
  text: string;
  icon: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <View className="flex flex-col items-center justify-center space-y-2">
        <View className="bg-[#C9B3F9] rounded-full w-16 h-16 flex items-center justify-center">
          <Icon name={icon} color="#201F2D" size={24} />
        </View>
        <Text className="text-white font-semibold">{text}</Text>
      </View>
    </Pressable>
  );
}
