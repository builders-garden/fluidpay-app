import { Linking, Share, View, Text, Pressable } from "react-native";
import { Link, router } from "expo-router";
import { Appbar } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRef, useState } from "react";
import { SegmentSlider } from "../../components/segment-slider";
import { Scanner } from "../../components/scanner";
import QRCode from "../../components/qrcode";
import { BarCodeScannedCallback } from "expo-barcode-scanner";
import { useUserStore } from "../../store/use-user-store";
import { shortenAddress } from "@thirdweb-dev/react-native";

type QRScreenOptions = "PAY ME" | "SCAN";

export default function QRCodeModal({ option }: { option?: QRScreenOptions }) {
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);
  const [tab, setTab] = useState<QRScreenOptions>(option || "PAY ME");
  const tabs = useRef(["PAY ME", "SCAN"] as QRScreenOptions[]).current;
  const title = tab === "PAY ME" ? "Display QR Code" : "Scan QR Code";
  return (
    <View className="flex-1 flex-col px-4 bg-[#201F2D]">
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Appbar.Header className="bg-[#201F2D] text-white">
        <Appbar.Content
          title={title}
          color="#fff"
          titleStyle={{ fontWeight: "bold" }}
        />
        <Appbar.Action
          icon={() => <Icon name="close" size={24} color="#FFF" />}
          onPress={() => {
            router.back();
          }}
          color="#fff"
          size={20}
        />
      </Appbar.Header>
      <SegmentSlider {...{ tabs, tab, setTab }} />
      {tab === "PAY ME" && (
        <QRCode
          children={
            <View className="flex flex-row items-center space-x-4">
              <View className="flex flex-col items-center">
                <Text className="text-white font-semibold text-lg text-center">
                  {user?.username}
                </Text>
                <Text className="text-[#53516C] font-semibold text-md">
                  {shortenAddress(user?.address)}
                </Text>
              </View>
              <Pressable
                onPress={async () => {
                  await Share.share({
                    message: user!.address,
                  });
                }}
              >
                <Icon
                  name="share-square-o"
                  size={24}
                  color="#FFFFFF"
                  className="ml-auto"
                ></Icon>
              </Pressable>
            </View>
          }
        />
      )}
      {tab === "SCAN" && <QRScan />}
    </View>
  );
}

function QRScan() {
  const [handled, setHandled] = useState(false);

  const handleBarCodeScanned: BarCodeScannedCallback = async ({ data }) => {
    if (handled) return;

    Linking.openURL("https://google.com");
  };

  return <Scanner handleBarCodeScanned={handleBarCodeScanned} />;
}
