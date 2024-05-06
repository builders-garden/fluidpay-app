import { useState } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { Appbar, Switch } from "react-native-paper";
import AppButton from "../../components/app-button";
import { ArrowLeft, ScanFace, Search, Users2 } from "lucide-react-native";
import * as SecureStore from "expo-secure-store";
import { disableFaceID, enableFaceID } from "../../lib/auth";
import { usePrivyWagmiProvider } from "@buildersgarden/privy-wagmi-provider";

export default function SecurityPrivacy() {
  const { address } = usePrivyWagmiProvider();
  const [faceId, setFaceID] = useState(
    !!SecureStore.getItem(`user-faceid-${address}`)
  );

  const handleChangeFaceID = async () => {
    if (faceId) {
      await disableFaceID(address!);
      setFaceID(false);
    } else {
      await enableFaceID(address!);
      setFaceID(true);
    }
  };
  return (
    <View className="flex-1 flex-col bg-black">
      <Appbar.Header
        elevated={false}
        statusBarHeight={48}
        className="bg-black text-white"
      >
        <Appbar.Action
          icon={() => <ArrowLeft size={20} color="#FFF" />}
          onPress={() => {
            router.back();
          }}
          color="#fff"
          size={20}
        />
        <Appbar.Content
          title={""}
          color="#fff"
          titleStyle={{ fontWeight: "bold" }}
        />
      </Appbar.Header>
      <View className="flex px-4 space-y-4">
        <Text className="text-3xl text-white font-bold">
          Security & Privacy
        </Text>
        <Text className="text-white font-semibold">Security</Text>
        <View>
          <AppButton
            onPress={() => {
              router.push("/app/export-private-key-modal");
            }}
            text="Export private key"
          />
        </View>
        <View className="bg-[#161618] w-full mx-auto rounded-2xl mt-8 p-4">
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center space-x-4">
              <ScanFace size={24} color="#3F89FF" />
              <Text className="text-white font-semibold">
                Sign in with Face ID
              </Text>
            </View>
            <Switch
              value={faceId}
              onChange={handleChangeFaceID}
              trackColor={{ true: "#FF238C" }}
            />
          </View>
        </View>
        <Text className="text-white font-semibold">Privacy</Text>

        <View className="bg-[#161618] w-full mx-auto rounded-2xl mt-8 p-4 flex flex-col space-y-6">
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center space-x-4">
              <Search size={24} color="#3F89FF" />
              <View className="flex flex-col">
                <Text className="text-white font-semibold">
                  Make me discoverable
                </Text>
                <Text className="text-gray-400">
                  By name, username or email
                </Text>
              </View>
            </View>
            <Switch value={false} trackColor={{ true: "#FF238C" }} />
          </View>
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center space-x-4">
              <Users2 size={24} color="#3F89FF" />
              <View className="flex flex-col">
                <Text className="text-white font-semibold">
                  Allow others to add me to groups
                </Text>
              </View>
            </View>
            <Switch value={false} trackColor={{ true: "#FF238C" }} />
          </View>
        </View>
      </View>
    </View>
  );
}
