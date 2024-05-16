import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { Appbar, Switch } from "react-native-paper";
import AppButton from "../../components/app-button";
import { ArrowLeft, ScanFace, Search, Users2 } from "lucide-react-native";
import * as SecureStore from "expo-secure-store";
import { disableFaceID, enableFaceID, getAuthType } from "../../lib/auth";
import { usePrivyWagmiProvider } from "@buildersgarden/privy-wagmi-provider";
import { useColorScheme } from "nativewind";
import { UnwrapPromise } from "../../lib/utils";

export default function SecurityPrivacy() {
  const { colorScheme } = useColorScheme();
  const { address } = usePrivyWagmiProvider();
  const [faceId, setFaceID] = useState(
    !!SecureStore.getItem(`user-faceid-${address}`)
  );
  const [authTypeText, setAuthType] =
    useState<UnwrapPromise<ReturnType<typeof getAuthType>>>(null);

  useEffect(() => {
    getAuthType().then((authType) => {
      setAuthType(authType);
    });
  }, []);

  const handleChangeFaceID = async () => {
    if (faceId) {
      await disableFaceID(address!);
      setFaceID(false);
    } else {
      const response = await enableFaceID(address!);
      console.log("theRes", response);
      if (response !== "success") {
        setFaceID(false);
        return;
      }
      setFaceID(true);
    }
  };
  return (
    <View className="flex-1 flex-col bg-absoluteWhite dark:bg-black">
      <Appbar.Header
        elevated={false}
        statusBarHeight={48}
        className="bg-absoluteWhite dark:bg-black text-darkGrey dark:text-white"
      >
        <Appbar.Action
          icon={() => (
            <ArrowLeft
              size={20}
              color={colorScheme === "dark" ? "#FFF" : "#161618"}
            />
          )}
          onPress={() => {
            router.back();
          }}
          color={colorScheme === "dark" ? "#FFF" : "#161618"}
          size={20}
        />
        <Appbar.Content
          title={""}
          color={colorScheme === "dark" ? "#FFF" : "#161618"}
          titleStyle={{ fontWeight: "bold" }}
        />
      </Appbar.Header>
      <View className="flex px-4 space-y-4">
        <Text className="text-3xl text-darkGrey dark:text-white font-bold">
          Security & Privacy
        </Text>
        <Text className="text-darkGrey dark:text-white font-semibold">
          Security
        </Text>
        <View>
          <AppButton
            onPress={() => {
              router.push("/app/export-private-key-modal");
            }}
            text="Export private key"
          />
        </View>
        {!!authTypeText && (
          <View className="bg-white dark:bg-darkGrey w-full mx-auto rounded-2xl mt-8 p-4">
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center space-x-4">
                <ScanFace size={24} color="#3F89FF" />
                <Text className="text-darkGrey dark:text-white font-semibold">
                  Sign in with {authTypeText}
                </Text>
              </View>
              <Switch
                value={faceId}
                onChange={handleChangeFaceID}
                trackColor={{ true: "#FF238C" }}
              />
            </View>
          </View>
        )}
        <Text className="text-darkGrey dark:text-white font-semibold">
          Privacy
        </Text>

        <View className="bg-white dark:bg-darkGrey w-full mx-auto rounded-2xl mt-8 p-4 flex flex-col space-y-6">
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center space-x-4">
              <Search size={24} color="#3F89FF" />
              <View className="flex flex-col">
                <Text className="text-darkGrey dark:text-white font-semibold">
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
                <Text className="text-darkGrey dark:text-white font-semibold">
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
