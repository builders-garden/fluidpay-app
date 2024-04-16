import { Pressable, View, Text } from "react-native";
import { Link, router } from "expo-router";
import { ActivityIndicator, Appbar } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import React, { useEffect } from "react";
import { useUserStore } from "../../store";
import QRCode from "../../components/qrcode";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Link2Icon,
  Link2OffIcon,
  QrCode,
  RefreshCwIcon,
  ShareIcon,
} from "lucide-react-native";
import { shortenAddress } from "../../lib/utils";
import {
  useGenerateStealthAddress,
  useGetUserSmartAccounts,
} from "@sefu/react-sdk";
import { useChainStore } from "../../store/use-chain-store";

export default function AddMoneyModal() {
  const isPresented = router.canGoBack();
  const [copied, setCopied] = React.useState(false);
  const { smartAccountList } = useGetUserSmartAccounts();
  const chain = useChainStore((state) => state.chain);

  const { stealthAddressCreated, generateNewStealthAddress, isLoading } =
    useGenerateStealthAddress({
      idSmartAccount: smartAccountList
        ? smartAccountList[0].idSmartAccount
        : "",
    });

  useEffect(() => {
    if (smartAccountList && smartAccountList.length > 0) {
      generateNewStealthAddress();
    }
  }, []);

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
      <View className="flex px-4 space-y-4">
        <View>
          <Text className="text-3xl text-white font-bold">Add money</Text>
        </View>

        <View className="flex flex-col space-y-4">
          <View className="bg-primary/10 rounded-lg p-4 flex flex-row justify-between items-center">
            <View className="flex flex-col space-y-2">
              <Text className="text-primary text-lg font-semibold">
                Deposit from Coinbase
              </Text>
              <Text className="text-primary">
                Send from Coinbase through Coinbase Pay.
              </Text>
            </View>
            <View>
              <ExternalLink size={24} color={"#0061FF"} />
            </View>
          </View>
          <View className="bg-greyInput rounded-lg p-4 flex flex-row justify-between items-center">
            <View className="flex flex-col space-y-2">
              <Text className="text-mutedGrey text-lg font-semibold">
                Send USDC to your address on {chain.name}
              </Text>

              <Text className="text-[#8F8F91] text-ellipsis">
                {!isLoading
                  ? shortenAddress(stealthAddressCreated?.address!)
                  : "Generating stealth address..."}
              </Text>
            </View>
            <View className="bg-[#232324] rounded-xl flex flex-col justify-center items-center text-center">
              <Pressable
                onPress={async () => {
                  await Clipboard.setStringAsync(
                    stealthAddressCreated?.address!
                  );
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 1500);
                }}
              >
                {copied ? (
                  <Check size={24} color={"green"} />
                ) : (
                  <Copy size={24} color={"#8F8F91"} />
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
