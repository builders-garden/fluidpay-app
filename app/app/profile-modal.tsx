import { Link, router } from "expo-router";
import { View, Text } from "react-native";
import { Appbar } from "react-native-paper";
import Avatar from "../../components/avatar";
import { shortenAddress } from "@thirdweb-dev/react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useUserStore } from "../../store";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularButton from "../../components/circular-button";
import { ScrollView } from "react-native-gesture-handler";
import TransactionItem from "../../components/transaction-item";

export default function ProfileModal() {
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);

  const transactions = [
    {
      receipt: null,
      from: "frankc",
      fromUsername: "frankc",
      to: "orbulo",
      toUsername: "orbulo",
      amount: "18.46",
      createdAt: new Date().toISOString(),
      txHash: "1",
    },
    {
      receipt: null,
      from: "frankc",
      fromUsername: "frankc",
      to: "orbulo",
      toUsername: "orbulo",
      amount: "18.46",
      createdAt: new Date().toISOString(),
      txHash: "2",
    },
    {
      receipt: null,
      from: "frankc",
      fromUsername: "frankc",
      to: "orbulo",
      toUsername: "orbulo",
      amount: "18.46",
      createdAt: new Date().toISOString(),
      txHash: "3",
    },
    {
      receipt: null,
      from: "frankc",
      fromUsername: "frankc",
      to: "orbulo",
      toUsername: "orbulo",
      amount: "18.46",
      createdAt: new Date().toISOString(),
      txHash: "3",
    },
    {
      receipt: null,
      from: "frankc",
      fromUsername: "frankc",
      to: "orbulo",
      toUsername: "orbulo",
      amount: "18.46",
      createdAt: new Date().toISOString(),
      txHash: "3",
    },
    {
      receipt: null,
      from: "frankc",
      fromUsername: "frankc",
      to: "orbulo",
      toUsername: "orbulo",
      amount: "18.46",
      createdAt: new Date().toISOString(),
      txHash: "3",
    },
    {
      receipt: null,
      from: "frankc",
      fromUsername: "frankc",
      to: "orbulo",
      toUsername: "orbulo",
      amount: "18.46",
      createdAt: new Date().toISOString(),
      txHash: "3",
    },
    {
      receipt: null,
      from: "frankc",
      fromUsername: "frankc",
      to: "orbulo",
      toUsername: "orbulo",
      amount: "18.46",
      createdAt: new Date().toISOString(),
      txHash: "3",
    },
  ];

  if (!user) {
    return <View className="flex-1 flex-col px-4 bg-[#201F2D]"></View>;
  }

  return (
    <SafeAreaView className="flex-1 flex-col bg-black" edges={{ top: "off" }}>
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Appbar.Header elevated={false} className="bg-black text-white">
        <Appbar.Action
          icon={() => <Icon name="arrow-left" size={20} color="#FFF" />}
          onPress={() => {
            router.back();
          }}
          color="#fff"
          size={20}
        />
        <Appbar.Content
          title=""
          color="#fff"
          titleStyle={{ fontWeight: "bold" }}
        />
      </Appbar.Header>
      <View className="flex flex-col justify-between px-4">
        <View className="flex flex-col items-center mt-4 space-y-3">
          <Avatar name={user?.username.charAt(0).toUpperCase()} />
          <Text className="text-white text-4xl text-center font-semibold">
            @{user?.username}
          </Text>
          <Text className="text-[#8F8F91] text-xl text-ellipsis">
            {shortenAddress(user?.address, false)}
          </Text>
        </View>

        <View className="flex flex-row items-center justify-center space-x-8 py-8">
          <View>
            <CircularButton
              text="Request"
              icon="download"
              onPress={() => router.push("/app/request-modal")}
            />
          </View>
          <View>
            <CircularButton
              text="Send"
              icon="paper-plane"
              onPress={() => router.push("/app/send")}
            />
          </View>
        </View>

        <View className="bg-[#161618] w-full mx-auto rounded-lg p-4 space-y-4">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-gray-400 text-lg font-medium">
              Total sent
            </Text>
            <Text className="text-white text-lg font-medium">$546,00</Text>
          </View>
          <View className="flex flex-row items-center justify-between">
            <Text className="text-gray-400 text-lg font-medium">
              Total received
            </Text>
            <Text className="text-white text-lg font-medium">$150,00</Text>
          </View>
        </View>

        <ScrollView className="bg-[#161618] w-full mx-auto h-[320px] rounded-lg px-4 space-y-4 mt-8 pb-8">
          {transactions.map((transaction, index) => (
            <TransactionItem
              key={index}
              transaction={transaction}
              index={index}
            />
          ))}
        </ScrollView>
        {/* <View className="w-full mt-8">
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
        </View> */}
        {/* <View className="w-full mt-4">
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
        /> */}
      </View>
    </SafeAreaView>
  );
}
