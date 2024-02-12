import React, { ReactNode, useEffect } from "react";
import { useUserStore } from "../store/use-user-store";
import RNQRGenerator from "rn-qr-generator";
import { Image, View, Text } from "react-native";

export default function QRCode({children}: {children: ReactNode}) {
  const user = useUserStore((state) => state.user);
  const [qrText, setQRText] = React.useState("");

  useEffect(() => {
    if (user) {
      RNQRGenerator.generate({
        value: user?.address,
        height: 400,
        width: 400,
        correctionLevel: "H",
        base64: true,
      })
        .then((response) => {
          const { base64 } = response;
          base64 && setQRText(base64);
        })
        .catch((error) => console.error(error));
    }
  }, [user]);

  if (!qrText) return <></>;

  return (
    <View className="flex flex-col items-center justify-center mt-8 space-y-8">
      <Image
        className="h-[300px] w-[300px] rounded-lg"
        source={{ uri: `data:image/png;base64,${qrText}` }}
      />
      {children}
    </View>
  );
}
