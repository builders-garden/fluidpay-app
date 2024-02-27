import { Avatar } from "react-native-paper";
import { colorHash } from "../lib/utils";

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
      theme={{
        colors: {
          primary: colorHash(name).hex,
          text: "#FFF",
        },
      }}
    />
  );
}
