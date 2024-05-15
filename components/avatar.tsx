import { Avatar } from "react-native-paper";
import { colorHash } from "../lib/utils";
import { Image } from "react-native";

export default function CruminaAvatar({
  name = " ",
  size = 48,
  color = "#B4B7B9",
  uri = null,
}: {
  name: string;
  size?: number;
  color?: string;
  uri?: string | null;
}) {
  if (!!uri) {
    return (
      <Image
        source={{ uri }}
        className="rounded-full w-[90px] h-[90px]"
        style={{ width: size, height: size, borderRadius: 999 }}
      />
    );
  }
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
