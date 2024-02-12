import { Link, router } from "expo-router";
import { View, Text } from "react-native";
import { Appbar } from "react-native-paper";
import Avatar from "../../components/avatar";
import { useProfileStore } from "../../store/use-profile-store";
import { shortenAddress } from "@thirdweb-dev/react-native";
import AppButton from "../../components/app-button";
import { useSendStore } from "../../store/use-send-store";
import * as WebBrowser from "expo-web-browser";
import { sepolia } from "../../constants/sepolia";
import TransactionsList from "../../components/transactions-list";
import { getUserTransactions } from "../../lib/firestore";
import React from "react";
import Spacer from "../../components/spacer";
import Icon from "react-native-vector-icons/FontAwesome";

export default function ProfileModal() {
  const isPresented = router.canGoBack();
  const profileUser = useProfileStore((state) => state.user);
  const setProfileUser = useProfileStore((state) => state.setProfileUser);
  const setSendUser = useSendStore((state) => state.setSendUser);
  const [loading, setLoading] = React.useState(false);

  const transactions = useProfileStore((state) => state.transactions);
  const setTransactions = useProfileStore(
    (state) => state.setProfileUserTransactions
  );

  if (!profileUser) {
    return <View className="flex-1 flex-col px-4 bg-[#201F2D]"></View>;
  }

  return (
    <View className="flex-1 flex-col px-4 bg-[#201F2D]">
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Appbar.Header className="bg-[#201F2D] text-white">
        <Appbar.Content
          title="Account"
          color="#fff"
          titleStyle={{ fontWeight: "bold" }}
        />
        <Appbar.Action
          icon={() => <Icon name="close" size={24} color="#FFF" />}
          onPress={() => {
            setProfileUser(undefined);
            router.back();
          }}
          color="#fff"
          size={20}
        />
      </Appbar.Header>
      <View className="flex flex-col justify-between">
        <View className="flex flex-col items-center mt-4 space-y-2">
          <Avatar name={profileUser?.username.charAt(0).toUpperCase()} />
          <Text className="text-white text-lg text-center font-semibold">
            {profileUser?.username}
          </Text>
          <Text className="text-[#53516C] text-ellipsis">
            {shortenAddress(profileUser?.address, false)}
          </Text>
        </View>
        <View className="w-full mt-8">
          <AppButton
            text={"SEND"}
            onPress={() => {
              setSendUser({
                username: profileUser?.username,
                address: profileUser?.address,
                createdAt: "",
                rounding: true,
              });
              router.push(`/app/send-modal`);
            }}
            variant={"primary"}
          />
        </View>
        <View className="w-full mt-4">
          <AppButton
            text={"VIEW ON BLOCK EXPLORER"}
            onPress={async () => {
              await WebBrowser.openBrowserAsync(
                `${sepolia.explorers[0].url}/address/${profileUser.address}`
              );
            }}
            variant={"ghost"}
          />
        </View>
        <Spacer h={92} />
        <TransactionsList
          transactions={transactions!}
          loading={loading}
          setLoading={setLoading}
          setTransactions={setTransactions}
          getTransactions={getUserTransactions}
          withAddress={profileUser.address}
        />
      </View>
    </View>
  );
}
