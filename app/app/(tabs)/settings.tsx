import { View, Text, Pressable, Switch } from "react-native";
import { Appbar } from "react-native-paper";
import { Redirect, router } from "expo-router";
import Avatar from "../../../components/avatar";
import * as Clipboard from "expo-clipboard";
import AppButton from "../../../components/app-button";
import { shortenAddress, useConnectedWallet } from "@thirdweb-dev/react-native";
import * as WebBrowser from "expo-web-browser";
import { sepolia } from "../../../constants/sepolia";
import { useState } from "react";
import { useUserStore } from "../../../store";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import LogoutModal from "../../../components/modals/logout-modal";

export default function Settings() {
  const signer = useConnectedWallet();
  const [showModal, setShowModal] = React.useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [copied, setCopied] = React.useState(false);
  const user = useUserStore((state) => state.user);
  const [isEnabled, setIsEnabled] = useState(user?.rounding);

  if (!signer || !user) {
    return <Redirect href={"/"} />;
  }

  return (
    <>
      <Appbar.Header className="bg-[#201F2D] text-white">
        <Appbar.BackAction
          onPress={() => router.back()}
          color="#fff"
          size={20}
        />
        <Appbar.Content
          title="Settings"
          color="#fff"
          titleStyle={{ fontWeight: "bold" }}
        />
      </Appbar.Header>
      <View className="flex-1 flex-col px-4 bg-[#201F2D]">
        <View className="flex-1 flex-col px-0 mt-4">
          <View className="flex flex-row space-x-4 items-center mb-8">
            <Avatar name={user.username.charAt(0).toUpperCase()} />
            <View className="flex flex-col space-y-1">
              <View className="flex flex-row space-x-2 items-center">
                <Text className="text-white font-semibold">
                  {user.username}
                </Text>

                <Pressable
                  className="flex flex-row items-center space-x-2"
                  onPress={() => {
                    Clipboard.setStringAsync(user?.address);
                    setCopied(true);
                    setTimeout(() => {
                      setCopied(false);
                    }, 1500);
                  }}
                >
                  <Text className="text-[#53516C] mr-2">
                    {shortenAddress(user.address)}
                  </Text>
                  <Icon
                    name={!copied ? "clipboard" : "check"}
                    size={16}
                    color={!copied ? "#53516C" : "green"}
                  />
                </Pressable>
              </View>
              <Text className="text-[#53516C] font-semibold">
                GHO • Sepolia
              </Text>
            </View>
          </View>
          <AppButton
            text="VIEW ON ON EXPLORER"
            onPress={async () => {
              await WebBrowser.openBrowserAsync(
                `${sepolia.explorers[0].url}/address/${user?.address}`
              );
            }}
            variant="ghost"
          />
          <Text className="text-[#53516C] font-semibold mt-8">Preferences</Text>
          <View className="flex flex-row justify-between mt-2">
            <Text className="max-w-[300px] text-white">
              Set aside the remainder of each received transaction rounded to
              the nearest dollar (if you receive $1.30 set aside $0.30). This is
              enabled by default.
            </Text>
            <Switch
              trackColor={{ false: "black", true: "#C9B3F9" }}
              thumbColor={"#201F2D"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
              disabled
            />
          </View>
          <View className="mt-8">
            <AppButton
              text="EXPORT PRIVATE KEY"
              onPress={() => {
                router.push("/app/export-private-key-modal");
              }}
              variant="primary"
            />
          </View>
          <Text
            onPress={() => {
              setShowModal(true);
            }}
            className="text-[#C9B3F9] text-center font-semibold mt-8"
          >
            LOGOUT
          </Text>
        </View>
        <LogoutModal
          visible={showModal}
          hideModal={() => setShowModal(false)}
        />
      </View>
    </>
  );
}
