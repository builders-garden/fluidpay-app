import { Pressable, View, Text } from "react-native";
import RNIcon from "react-native-vector-icons/FontAwesome";
import { icons } from "lucide-react-native";

const Icon = ({
  name,
  color,
  size,
}: {
  name: string;
  color: string;
  size: number;
}) => {
  const LucideIcon = icons[name as keyof typeof icons];

  if (!LucideIcon) {
    return <RNIcon name={name} color={color} size={size} />;
  }

  return <LucideIcon color={color} size={size} />;
};

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
        <View className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center">
          <Icon name={icon} color="white" size={24} />
        </View>
        <Text className="text-white font-semibold">{text}</Text>
      </View>
    </Pressable>
  );
}
