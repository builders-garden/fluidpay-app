import { router } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";
import { ScanFace } from "lucide-react-native";

import AppButton from "../components/app-button";
import { enableFaceID, getAuthType } from "../lib/auth";
import { usePrivyWagmiProvider } from "@buildersgarden/privy-wagmi-provider";
import { useEffect, useState } from "react";
import { UnwrapPromise } from "../lib/utils";

const SetFaceID = () => {
  const { address } = usePrivyWagmiProvider();
  const [authTypeText, setAuthType] =
    useState<UnwrapPromise<ReturnType<typeof getAuthType>>>(null);

  useEffect(() => {
    getAuthType().then((authType) => {
      setAuthType(authType);
    });
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 px-4 justify-end items-center">
        <ScanFace size={150} color="#FF238C" />

        <Text className="text-darkGrey dark:text-white text-4xl text-center font-semibold my-5">
          {authTypeText} Recognition
        </Text>
        <Text className="text-xl text-darkGrey dark:text-white text-center font-semibold">
          For even faster and more secure access.
        </Text>
      </View>
      <View className="flex-1 mt-auto px-4 justify-end">
        <AppButton
          text="Setup FaceID"
          variant="primary"
          onPress={() =>
            enableFaceID(address!).then(() => router.push("/app/home"))
          }
          mb="mb-[17px]"
        />
        <AppButton
          text="Skip for now"
          variant="ghost"
          onPress={() => router.push("/app/home")}
        />
      </View>
    </SafeAreaView>
  );
};

export default SetFaceID;
