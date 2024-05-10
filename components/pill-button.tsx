import { PropsWithChildren } from "react";
import { Pressable, View } from "react-native";

export default function PillButton({
  onPress,
  children,
}: PropsWithChildren<{ onPress?: () => void }>) {
  return (
    <View className="flex flex-col rounded-lg items-center justify-center space-y-2">
      <Pressable
        onPress={onPress}
        className="bg-[#FF5D8F4D] dark:bg-white/20 rounded-full py-1.5 px-2.5 flex-row space-x-2.5 items-center justify-center"
      >
        {children}
      </Pressable>
    </View>
  );
}
