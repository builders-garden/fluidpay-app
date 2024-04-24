import { Link, Redirect, useNavigation } from "expo-router";
import { View, Text, Pressable, ViewStyle } from "react-native";
import Avatar from "../../../components/avatar";
import CircularButton from "../../../components/circular-button";
import { router } from "expo-router";
import { useTransactionsStore, useUserStore } from "../../../store";
import { ScrollView } from "react-native-gesture-handler";
import TransactionItem from "../../../components/transaction-item";
import { useProfileStore } from "../../../store/use-profile-store";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronRight } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { getPayments } from "../../../lib/api";
import {
  useERC20BalanceOf,
  usePrivyWagmiProvider,
} from "@buildersgarden/privy-wagmi-provider";
import AppButton from "../../../components/app-button";
import tokens from "../../../constants/tokens";
import { formatBigInt } from "../../../lib/utils";
import { useChainStore } from "../../../store/use-chain-store";
import PillButton from "../../../components/pill-button";
import { useEmbeddedWallet } from "@privy-io/expo";
import SkeletonLoader from "expo-skeleton-loader";

export default function Home() {
  const { address, isConnected, isReady } = usePrivyWagmiProvider();
  const wallet = useEmbeddedWallet();
  const [fetchingPayments, setFetchingPayments] = useState(false);
  const chain = useChainStore((state) => state.chain);
  const user = useUserStore((state) => state.user);
  const setProfileUserTransactions = useProfileStore(
    (state) => state.setProfileUserTransactions
  );
  const transactions = useTransactionsStore((state) => state.transactions);
  const setTransactions = useTransactionsStore(
    (state) => state.setTransactions
  );
  const {
    balance,
    isLoading: isLoadingBalance,
    refetch: refetchBalance,
  } = useERC20BalanceOf({
    network: chain.id,
    args: [user?.smartAccountAddress!],
    address: tokens.USDC[chain.id] as `0x${string}`,
  });
  const navigation = useNavigation();

  useEffect(() => {
    const refresh = async () => {
      await Promise.all([refetchBalance()]);
    };

    navigation.addListener("focus", refresh);

    return () => {
      navigation.removeListener("focus", refresh);
    };
  }, []);

  useEffect(() => {
    if (user) {
      refetchBalance();
      fetchPayments(chain.id);
    }
  }, [chain]);

  const fetchPayments = async (chainId: number) => {
    if (!user) return;
    setFetchingPayments(true);
    const res = await getPayments(user!.token, {
      limit: 10,
      chainId: chainId,
    });
    setTransactions(res as any[]);
    setFetchingPayments(false);
  };

  const getUniquePayees = () => {
    const payees = transactions
      .filter((payment) => payment.payeeId !== user?.id)
      .map((payment) => payment.payeeId);
    const uniqueIds = [...new Set(payees)];
    const uniquePayees: any[] = [];

    for (const id of uniqueIds) {
      const payee = transactions.find((payment) => payment.payeeId === id);
      if (!uniquePayees.includes(payee)) uniquePayees.push(payee);
    }

    return uniquePayees;
  };

  const recentPayees = getUniquePayees();

  if (!isReady || !isConnected || !user) {
    return <Redirect href={"/"} />;
  }

  return (
    <LinearGradient
      colors={["#3500B7", "#1B005E", "#000000"]}
      className="h-full"
      style={{}}
    >
      <SafeAreaView className="bg-transparent flex-1">
        <View className="flex flex-col bg-transparent">
          <View className="flex flex-row items-center justify-between px-4 mt-2">
            <View className="flex flex-row items-center space-x-4 pl-2">
              <Link href={"/app/settings"}>
                <Avatar name={user.username.charAt(0).toUpperCase()} />
              </Link>
            </View>
            {/* <View className="flex flex-row items-center space-x-0">
              <IconButton
                icon={() => <Bell size={24} color={"white"} />}
                onPress={() => router.push("/app/qrcode")}
              />
            </View> */}
          </View>
          <ScrollView className="px-4" scrollEnabled={transactions.length > 0}>
            <View className="py-8 flex flex-col space-y-16">
              <View className="flex flex-col space-y-4">
                <Text className="text-white font-semibold text-center">
                  {chain.name} • USDC
                </Text>
                <Text className="text-white font-bold text-center text-5xl">
                  {isLoadingBalance ? "--.--" : `$${formatBigInt(balance!, 2)}`}
                </Text>
                <View>
                  <PillButton
                    text="Accounts"
                    onPress={() => router.push("/app/accounts-modal")}
                  />
                </View>
              </View>
              <View></View>
              <View className="flex flex-row items-center justify-evenly w-full">
                <CircularButton
                  text="Add money"
                  icon="Plus"
                  onPress={() => router.push("/app/add-money-modal")}
                />
                <CircularButton
                  text="Request"
                  icon="Download"
                  disabled={true}
                  onPress={() => router.push("/app/request-modal")}
                />
                <CircularButton
                  text="Send"
                  icon="Send"
                  onPress={() => router.push("/app/transfers")}
                />
                {/*<CircularButton
                  text="Details"
                  icon="Server"
                  onPress={() => router.push("/app/details-modal")}
                />*/}
              </View>
            </View>
            {fetchingPayments && (
              <View className="bg-[#161618] w-full mx-auto rounded-2xl p-4">
                {Array(3)
                  .fill(null)
                  .map((_, i) => (
                    <TransactionLayout key={i} />
                  ))}
              </View>
            )}

            {!fetchingPayments && transactions.length > 0 && (
              <View className="bg-[#161618] w-full mx-auto rounded-2xl p-4">
                {transactions.slice(0, 3).map((payment, index) => (
                  <TransactionItem
                    transaction={payment}
                    index={index}
                    key={`transaction-${index}`}
                  />
                ))}
                <Text
                  onPress={() =>
                    router.push({
                      pathname: "/app/transactions-modal",
                      params: {
                        transactions: JSON.stringify(transactions),
                      },
                    })
                  }
                  className="text-[#0061FF] font-semibold text-center"
                >
                  See all
                </Text>
              </View>
            )}

            {!fetchingPayments && transactions.length === 0 && (
              <AppButton
                text="Make your first payment!"
                variant="secondary"
                loading={false}
                onPress={() => {
                  router.push("/app/transfers");
                }}
              />
            )}

            {recentPayees.length > 0 && (
              <View className="bg-[#161618] w-full mx-auto rounded-2xl mt-8 mb-16 p-4">
                <View className="flex flex-row items-center pb-6">
                  <Text className="text-gray-400">Recent payees</Text>
                  <ChevronRight color="grey" size={14} />
                </View>
                <View className="flex flex-row justify-evenly w-full">
                  {getUniquePayees().map((payment, index) => (
                    <Pressable
                      onPress={() => {
                        setProfileUserTransactions([]);
                        router.push({
                          pathname: "/app/profile-modal",
                          params: { userId: payment.payeeId },
                        });
                      }}
                      key={`payee-${index}`}
                    >
                      <View className="flex space-y-2 items-center">
                        <Avatar
                          name={payment.payee.username.charAt(0).toUpperCase()}
                        />
                        <Text className="text-white font-semibold">
                          {payment.payee.username}
                        </Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const TransactionLayout = ({
  size = 48,
  style,
}: {
  size?: number;
  style?: ViewStyle;
}) => (
  <SkeletonLoader duration={850}>
    <SkeletonLoader.Container
      style={[{ flex: 1, flexDirection: "row", alignItems: "center" }, style]}
    >
      <SkeletonLoader.Container
        style={[{ flex: 1, flexDirection: "row", alignItems: "center" }, style]}
      >
        <SkeletonLoader.Item
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            marginRight: 16,
          }}
        />
        <SkeletonLoader.Container style={{ paddingVertical: 10 }}>
          <SkeletonLoader.Item
            style={{ width: 100, height: 20, marginBottom: 5 }}
          />
          <SkeletonLoader.Item style={{ width: 110, height: 20 }} />
        </SkeletonLoader.Container>
      </SkeletonLoader.Container>

      <SkeletonLoader.Item style={{ width: 70, height: 20 }} />
    </SkeletonLoader.Container>
  </SkeletonLoader>
);
