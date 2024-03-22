import { Pressable, View, Text } from "react-native";
import { Link, router } from "expo-router";
import { Appbar } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { useUserStore } from "../../store";
import QRCode from "../../components/qrcode";
import { ArrowLeft, Check, Copy } from "lucide-react-native";
import { shortenAddress } from "../../lib/utils";

export default function AddMoneyModal() {
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);
  const [copied, setCopied] = React.useState(false);

  return (
    <View className="flex-1 flex-col bg-[#161618]">
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Appbar.Header
        elevated={false}
        statusBarHeight={0}
        className="bg-[#161618] text-white"
      >
        <Appbar.Action
          icon={() => <ArrowLeft size={24} color="#FFF" />}
          onPress={() => router.back()}
          color="#fff"
          size={20}
        />
        <Appbar.Content
          title=""
          color="#fff"
          titleStyle={{ fontWeight: "bold" }}
        />
      </Appbar.Header>
      <View className="flex px-4 space-y-2">
        <Text className="text-3xl text-white font-bold">Add money</Text>
        <Text className="text-[#8F8F91] font-semibold mt-8">
          Add money to account
        </Text>
        <Text className="text-white font-semibold">
          Send USDC to your address below on Base.
        </Text>
        <View className="bg-[#232324] rounded-xl flex flex-row justify-between items-center mt-4 px-4 py-2">
          <Text className="text-[#8F8F91] text-lg text-ellipsis">
            {shortenAddress(user?.address!)}
          </Text>
          <Pressable
            onPress={async () => {
              await Clipboard.setStringAsync(user!.address);
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 1500);
            }}
          >
            {copied ? (
              <Check size={16} color={"green"} />
            ) : (
              <Copy size={16} color={"#8F8F91"} />
            )}
          </Pressable>
        </View>
        <View className="bg-[#161618] mx-auto rounded-lg p-8">
          <QRCode />
        </View>
      </View>
    </View>
  );
}
