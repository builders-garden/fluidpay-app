import { Linking, Text, View } from "react-native";
import { router } from "expo-router";
import { Appbar } from "react-native-paper";
import { useRef, useState } from "react";
import { SegmentSlider } from "../../components/segment-slider";
import { Scanner } from "../../components/scanner";
import QRCode from "../../components/qrcode";
import { CameraProps } from "expo-camera";
import { useUserStore } from "../../store/use-user-store";
import Avatar from "../../components/avatar";
import { ArrowLeft } from "lucide-react-native";
import { shortenAddress } from "../../lib/utils";

type QRScreenOptions = "Pay me" | "Scan";

export default function QRScreen({ option }: { option?: QRScreenOptions }) {
  const user = useUserStore((state) => state.user);
  const [tab, setTab] = useState<QRScreenOptions>(option || "Pay me");
  const tabs = useRef(["Scan", "Pay me"] as QRScreenOptions[]).current;

  return (
    <View className="flex-1 flex-col px-4 bg-black">
      <Appbar.Header
        elevated={false}
        statusBarHeight={48}
        className="bg-black text-white"
      >
        <Appbar.Action
          icon={() => <ArrowLeft size={24} color="#FFF" />}
          onPress={() => {
            router.back();
          }}
          color="#fff"
          size={24}
        />
        <Appbar.Content
          title={""}
          color="#fff"
          titleStyle={{ fontWeight: "bold" }}
        />
      </Appbar.Header>
      <View className="flex flex-row items-center justify-between px-4 pb-8">
        <View className="flex space-y-2">
          <Text className="text-3xl text-white font-bold">
            {shortenAddress(user?.smartAccountAddress!)}
          </Text>
          <Text className="font-bold text-[#FF238C]">@{user?.username}</Text>
        </View>
        <Avatar name={user!.username.charAt(0).toUpperCase()} />
      </View>
      {tab === "Pay me" && (
        <View className="bg-[#161618] mx-auto rounded-lg p-8">
          <QRCode />
        </View>
      )}
      {tab === "Scan" && <QRScan />}
      <Text className="text-gray-400 text-center pt-4">
        Get paid with{" "}
        <Text className="font-bold text-[#FF238C]">
          plink.finance/u/{user?.username}
        </Text>
      </Text>
      <View className="mt-8">
        <SegmentSlider {...{ tabs, tab, setTab }} />
      </View>
    </View>
  );
}

function QRScan() {
  const [handled, setHandled] = useState(false);

  const handleBarCodeScanned: CameraProps["onBarCodeScanned"] = async ({
    data: link,
  }) => {
    if (handled) return;

    Linking.openURL(link);
  };

  return <Scanner handleBarCodeScanned={handleBarCodeScanned} />;
}
