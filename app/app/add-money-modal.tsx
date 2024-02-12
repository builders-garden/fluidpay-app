import { Pressable, View, Text } from "react-native";
import { Link, router } from "expo-router";
import { Appbar } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { useUserStore } from "../../store";
import { shortenAddress } from "@thirdweb-dev/react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import QRCode from "../../components/qrcode";

export default function AddMoneyModal() {
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);
  const [copied, setCopied] = React.useState(false);

  return (
    <View className="flex-1 flex-col px-4 bg-[#201F2D]">
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Appbar.Header
        elevated={false}
        statusBarHeight={0}
        className="bg-[#201F2D] text-white"
      >
        <Appbar.Content
          title="Add money"
          color="#fff"
          titleStyle={{ fontWeight: "bold" }}
        />
        <Appbar.Action
          icon={() => <Icon name="close" size={24} color="#FFF" />}
          onPress={() => router.back()}
          color="#fff"
          size={20}
        />
      </Appbar.Header>
      <Text className="text-[#53516C] font-semibold mt-8">
        Add money to account
      </Text>
      <Text className="text-white font-semibold mt-2">
        Send GHO, USDC, USDT to your address below.
      </Text>
      <View className="bg-[#292836] rounded-lg flex flex-row justify-between mt-4 px-4 py-2">
        <Text className="text-[#53516C] text-ellipsis">
          {shortenAddress(user?.address)}
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
          <Icon
            name={!copied ? "clipboard" : "check"}
            size={16}
            color={!copied ? "#53516C" : "green"}
          />
        </Pressable>
      </View>
      <QRCode
        children={
          <Text className="text-white font-semibold mt-4">
            Scan QR code to receive money
          </Text>
        }
      />
    </View>
  );
}
