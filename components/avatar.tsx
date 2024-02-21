import { View, Text } from "react-native";
import { Avatar } from "react-native-paper";

export default function CruminaAvatar({
  name,
  size = 48,
  color = "#B4B7B9",
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  return (
    <Avatar.Text
      label={name}
      size={size}
      labelStyle={{ fontWeight: "bold", color: "white" }}
      color={color}
    />
  );
}
