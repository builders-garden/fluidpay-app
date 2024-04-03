import { Link, router, useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import { Appbar } from "react-native-paper";
import Avatar from "../../components/avatar";
import CircularButton from "../../components/circular-button";
import { ScrollView } from "react-native-gesture-handler";
import { ArrowLeft } from "lucide-react-native";
import { useSendStore, useUserStore } from "../../store";
import { useEffect, useState } from "react";
import { getPayments, getUserByIdUsernameOrAddress } from "../../lib/api";
import TransactionItem from "../../components/transaction-item";
import { shortenAddress } from "../../lib/utils";
import { useChainStore } from "../../store/use-chain-store";

export default function ProfileModal() {
  const isPresented = router.canGoBack();
  const { userId } = useLocalSearchParams();
  const currentUser = useUserStore((state) => state.user);
  const setSendUser = useSendStore((state) => state.setSendUser);
  const [profileUser, setUser] = useState<any>(null);
  const [transactions, setTransaction] = useState<any[]>([]);
  const chain = useChainStore((state) => state.chain);

  useEffect(() => {
    if (currentUser) {
      fetchUser();
    }
  }, [currentUser]);

  const fetchUser = async () => {
    console.log(userId);
    const [profile, transactions] = await Promise.all([
      getUserByIdUsernameOrAddress(currentUser!.token, {
        idOrUsernameOrAddress: userId!.toString(),
      }),
      getPayments(currentUser!.token, {
        withUserId: parseInt(userId as string, 10),
        chainId: chain.id,
      }),
    ]);
    setUser(profile);
    setTransaction(transactions);
  };

  if (!profileUser) {
    return <View className="flex-1 flex-col px-4 bg-black"></View>;
  }

  return (
    <View className="flex-1 flex-col bg-black">
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Appbar.Header
        elevated={false}
        statusBarHeight={48}
        className="bg-black text-white"
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
      <View className="flex flex-col justify-between px-4">
        <View className="flex flex-col items-center mt-4 space-y-3">
          <Avatar
            name={profileUser?.username.charAt(0).toUpperCase()}
            size={64}
          />
          <Text className="text-white text-4xl text-center font-semibold">
            @{profileUser?.username}
          </Text>
          <Text className="text-[#8F8F91] text-xl text-ellipsis">
            {shortenAddress(profileUser?.address)}
          </Text>
        </View>

        <View className="flex flex-row items-center justify-center space-x-8 py-8">
          {/* <View>
            <CircularButton
              text="Request"
              icon="Download"
              onPress={() => router.push("/app/request-modal")}
            />
          </View> */}
          <View>
            <CircularButton
              text="Send"
              icon="Send"
              onPress={() => {
                setSendUser(profileUser);
                router.push("/app/send-modal");
              }}
            />
          </View>
        </View>

        <View className="bg-[#161618] w-full mx-auto rounded-lg p-4 space-y-4">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-gray-400 text-lg font-medium">
              Total sent
            </Text>
            <Text className="text-white text-lg font-medium">
              ${profileUser.paymentInfo.out.toFixed(2)}
            </Text>
          </View>
          <View className="flex flex-row items-center justify-between">
            <Text className="text-gray-400 text-lg font-medium">
              Total received
            </Text>
            <Text className="text-white text-lg font-medium">
              ${profileUser.paymentInfo.in.toFixed(2)}
            </Text>
          </View>
        </View>
        {(!transactions || transactions?.length === 0) && (
          <View className="mt-4">
            <Text className="text-white text-center">
              No payments yet with {profileUser?.username}
            </Text>
          </View>
        )}
        {transactions?.length > 0 && (
          <ScrollView className="bg-[#161618] w-full mx-auto h-[320px] rounded-lg px-4 space-y-4 mt-8 pb-8">
            {transactions.map((transaction, index) => (
              <TransactionItem
                key={index}
                transaction={transaction}
                index={index}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
