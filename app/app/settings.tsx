import { View, Text, Pressable } from "react-native";
import { Appbar } from "react-native-paper";
import { Redirect, router } from "expo-router";
import Avatar from "../../components/avatar";
import { shortenAddress, useConnectedWallet } from "@thirdweb-dev/react-native";
import { useState } from "react";
import { useUserStore } from "../../store";
import React from "react";
import {
  QrCode,
  Bell,
  LifeBuoy,
  Shield,
  LogOut,
  ArrowLeft,
} from "lucide-react-native";

import { LinearGradient } from "expo-linear-gradient";
import LogoutModal from "../../components/modals/logout-modal";

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
    <View className="flex-1 bg-black h-full">
      <LinearGradient
        colors={["#3500B7", "#1B005E", "#000000"]}
        className="h-full"
        style={{}}
      >
        <View className="flex-1 bg-white/20 h-full">
          <Appbar.Header
            elevated={false}
            statusBarHeight={48}
            className="bg-transparent text-white"
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
              title=""
              color="#fff"
              titleStyle={{ fontWeight: "bold" }}
            />
          </Appbar.Header>
          <View className="flex-1 flex-col px-4 bg-transparent space-y-8">
            <View className="flex flex-col items-center mt-4 space-y-3">
              <Avatar name={user?.username.charAt(0).toUpperCase()} size={64} />
              <Text className="text-white text-4xl text-center font-semibold">
                @{user?.username}
              </Text>
              <View className="flex flex-row space-x-2 items-center">
                <Text className="text-[#8F8F91] text-xl text-ellipsis">
                  {shortenAddress(user?.address, false)}
                </Text>
                <QrCode
                  onPress={() => {
                    router.push("/app/qrcode");
                  }}
                  size={24}
                  color="#FFF"
                />
              </View>
            </View>
            <View className="bg-white/20 w-full mx-auto rounded-2xl p-6 flex flex-col space-y-8">
              <View className="flex flex-row items-center space-x-4">
                <LifeBuoy size={24} color="#FFF" />
                <Text className="text-white text-xl">Help</Text>
              </View>
              <Pressable
                onPress={() => {
                  router.push("/app/security-privacy");
                }}
              >
                <View className="flex flex-row items-center space-x-4">
                  <Shield size={24} color="#FFF" />
                  <Text className="text-white text-xl">Security & privacy</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  router.push("/app/notification-settings");
                }}
              >
                <View className="flex flex-row items-center space-x-4">
                  <Bell size={24} color="#FFF" />
                  <Text className="text-white text-xl">
                    Notification settings
                  </Text>
                </View>
              </Pressable>
            </View>

            <View className="bg-white/20 w-full mx-auto rounded-2xl p-6 flex flex-col space-y-6">
              <Pressable
                onPress={() => {
                  setShowModal(true);
                }}
              >
                <View className="flex flex-row items-center space-x-4">
                  <LogOut size={24} color="#FFF" />
                  <Text className="text-white text-xl">Logout</Text>
                </View>
              </Pressable>
            </View>
            <LogoutModal
              visible={showModal}
              hideModal={() => setShowModal(false)}
            />
            {/* <View className="flex-1 flex-col px-0 mt-4">
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
                    <Text className="text-[#8F8F91] mr-2">
                      {shortenAddress(user.address)}
                    </Text>
                    <Icon
                      name={!copied ? "clipboard" : "check"}
                      size={16}
                      color={!copied ? "#8F8F91" : "green"}
                    />
                  </Pressable>
                </View>
                <Text className="text-[#8F8F91] font-semibold">
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
            <Text className="text-[#8F8F91] font-semibold mt-8">
              Preferences
            </Text>
            <View className="flex flex-row justify-between mt-2">
              <Text className="max-w-[300px] text-white">
                Set aside the remainder of each received transaction rounded to
                the nearest dollar (if you receive $1.30 set aside $0.30). This
                is enabled by default.
              </Text>
              <Switch
                trackColor={{ false: "black", true: "#667DFF" }}
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
              className="text-[#667DFF] text-center font-semibold mt-8"
            >
              LOGOUT
            </Text>
          </View>
          <LogoutModal
            visible={showModal}
            hideModal={() => setShowModal(false)}
          /> */}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
