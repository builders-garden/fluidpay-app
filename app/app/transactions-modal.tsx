import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowUpDown,
} from "lucide-react-native";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Appbar } from "react-native-paper";
import TransactionItem from "../../components/transaction-item";
import { DBTransaction } from "../../store/interfaces";
import { useMemo, useState } from "react";
import { useUserStore } from "../../store";
import { useChainStore } from "../../store/use-chain-store";
import { getPayments } from "../../lib/api";
import {
  debounce,
  formatDateToMonthDay,
  getFormattedTime,
  isTodayOrYesterday,
} from "../../lib/utils";
import TransactionSkeletonLayout from "../../components/skeleton-layout/transactions";
import { useColorScheme } from "nativewind";

enum TransanctionDirection {
  DEFAULT = 0,
  IN = 1,
  OUT = 2,
}

export default function TransactionsModal() {
  const { colorScheme } = useColorScheme();
  const { transactions: transactionsData } = useLocalSearchParams();
  const [transactions, setTransactions] = useState(
    JSON.parse(transactionsData as string) as DBTransaction[]
  );
  const user = useUserStore((state) => state.user);
  const chain = useChainStore((state) => state.chain);
  const [fetchingPayments, setFetchingPayments] = useState(false);
  const [trxDirection, setTrxDirection] = useState<TransanctionDirection>(
    TransanctionDirection.DEFAULT
  );
  const fetchPayments = async (direction: TransanctionDirection) => {
    try {
      if (!user) return;
      setFetchingPayments(true);
      const query: any = {
        limit: 10,
        chainId: chain.id,
      };

      if (direction === TransanctionDirection.IN) {
        query["direction"] = "in";
      } else if (direction === TransanctionDirection.OUT) {
        query["direction"] = "out";
      }

      const res = await getPayments(user.token, query);
      setTransactions(res as any[]);
      setFetchingPayments(false);
    } catch (error) {
      setFetchingPayments(false);
    }
  };

  const handleChangeTransactionDirection = () => {
    const newDirection = (trxDirection + 1) % (TransanctionDirection.OUT + 1);
    debounce(() => fetchPayments(newDirection), 500)();
    setTrxDirection(newDirection);
  };

  const transactionsByDay = useMemo(() => {
    return transactions.reduce<
      Record<string, { transactions: DBTransaction[] }>
    >((prev, cur, index, arr) => {
      const date = cur.createdAt.split("T")[0];
      const transaction = arr[index];

      prev[date] = {
        transactions: [...(prev[date]?.transactions || []), transaction],
      };

      return prev;
    }, {});
  }, [transactions]);

  const dates = Object.keys(transactionsByDay);

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
              size={24}
              color={colorScheme === "dark" ? "#FFF" : "#161618"}
            />
          )}
          onPress={() => {
            router.back();
          }}
          color={colorScheme === "dark" ? "#fff" : "#161618"}
          size={24}
          animated={false}
        />
        <Appbar.Content
          title=""
          color={colorScheme === "dark" ? "#fff" : "#161618"}
          titleStyle={{ fontWeight: "bold" }}
        />
      </Appbar.Header>

      <View className="flex-row items-center justify-between px-4">
        <Text className="font-semibold text-4xl text-darkGrey dark:text-white">
          Transactions
        </Text>
        <Pressable onPress={handleChangeTransactionDirection}>
          {trxDirection === TransanctionDirection.DEFAULT && (
            <ArrowUpDown color="#8F8F91" />
          )}
          {trxDirection === TransanctionDirection.OUT && (
            <ArrowUp color="#DC3F32" />
          )}
          {trxDirection === TransanctionDirection.IN && (
            <ArrowDown color="#39F183" />
          )}
        </Pressable>
      </View>
      <ScrollView className="w-full space-y-4 mt-8 px-4">
        {fetchingPayments && (
          <ScrollView className="bg-darkGrey w-full mx-auto rounded-lg p-4 space-y-4">
            {Array(3)
              .fill(null)
              .map((_, i) => (
                <TransactionSkeletonLayout
                  key={i}
                  isDark={colorScheme === "dark"}
                />
              ))}
          </ScrollView>
        )}

        {!fetchingPayments &&
          dates.map((date) => {
            const transactionList = transactionsByDay[date].transactions;
            return (
              <View key={date} className="w-full rounded-lg">
                <Text className="text-xl text-darkGrey dark:text-white font-medium mb-2.5">
                  {isTodayOrYesterday(date) || formatDateToMonthDay(date)}
                </Text>
                <View className="bg-white dark:bg-darkGrey w-full rounded-lg px-4 space-y-4">
                  {transactionList.map((transaction, index) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                      index={index}
                      time={getFormattedTime(transaction.createdAt)}
                    />
                  ))}
                </View>
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
}
