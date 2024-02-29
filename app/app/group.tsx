import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { ArrowLeft, Cog } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import AppButton from "../../components/app-button";
import { SegmentSlider } from "../../components/segment-slider";
import {
  getGroupBalances,
  getGroupById,
  getGroupExpenses,
} from "../../lib/api";
import { useSendStore, useUserStore } from "../../store";
import ExpenseItem from "../../components/expense-item";
import Avatar from "../../components/avatar";

type GroupOptions = "Expenses" | "Balances";

export default function GroupPage() {
  const { group: localGroup } = useLocalSearchParams();
  const [data, setData] = useState<any>(JSON.parse(localGroup as string));
  const user = useUserStore((state) => state.user);

  const [tab, setTab] = useState<GroupOptions>("Expenses");
  const tabs = useRef(["Expenses", "Balances"] as GroupOptions[]).current;
  const navigation = useNavigation();
  const setSendUser = useSendStore((state) => state.setSendUser);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  console.log(transactions);

  useEffect(() => {
    const refresh = async () => {
      await Promise.all([fetchGroup(), fetchExpenses(), fetchBalances()]);
    };

    navigation.addListener("focus", refresh);

    return () => {
      navigation.removeListener("focus", refresh);
    };
  }, []);

  const fetchGroup = async () => {
    const group = await getGroupById(user!.token, { id: data.id });
    setData(group);
  };

  const fetchExpenses = async () => {
    const expenses = await getGroupExpenses(user!.token, { id: data.id });
    setTransactions(expenses);
  };

  const fetchBalances = async () => {
    const balances = await getGroupBalances(user!.token, { id: data.id });
    setBalances(balances);
  };

  return (
    <View className="flex-1 flex-col bg-black">
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
          title={""}
          color="#fff"
          titleStyle={{ fontWeight: "bold" }}
        />
        <Appbar.Action
          icon={() => <Cog size={24} color="#FFF" />}
          onPress={() =>
            router.push({
              pathname: "/app/group-settings-modal",
              params: { group: JSON.stringify(data) },
            })
          }
          color="#fff"
          size={24}
        />
      </Appbar.Header>
      <View className="flex px-4 space-y-4">
        <Text className="text-4xl text-white font-bold">{data.name}</Text>
        <View className="flex flex-row">
          {data.members.map((member: any, index: number) => (
            <View
              className={index === 0 ? "" : "-ml-6"}
              key={`member-${index}-${data.name}`}
            >
              <Avatar name={member.user.username.charAt(0).toUpperCase()} />
            </View>
          ))}
        </View>
        <View>
          <AppButton
            text="Add expense"
            variant="primary"
            onPress={() =>
              router.push({
                pathname: `/app/create-expense-modal`,
                params: { group: JSON.stringify(data) },
              })
            }
          />
        </View>

        <View className="mt-8">
          <SegmentSlider {...{ tabs, tab, setTab }} />
        </View>
        {tab === "Expenses" && (
          <ScrollView className="bg-[#161618] w-full mx-auto h-auto rounded-xl px-4 space-y-4 mt-8">
            {transactions.map((transaction, index) => (
              <ExpenseItem
                key={`expense-${index}`}
                expense={transaction}
                index={index}
              />
            ))}
          </ScrollView>
        )}
        {tab === "Balances" && (
          <View className="bg-[#161618] w-full mx-auto rounded-xl px-4 space-y-4 mt-8">
            {balances
              .filter((balance: any) => balance.debtor.id === user?.id)
              .map((balance: any) => (
                <Pressable
                  onPress={() => {
                    setSendUser(balance.creditor);
                    router.push({
                      pathname: "/app/send-modal",
                      params: { amount: balance.amount },
                    });
                  }}
                >
                  <View className="flex flex-row items-center justify-between py-3">
                    <View className="flex flex-row space-x-4 items-center">
                      <Avatar
                        name={balance.debtor.username.charAt(0).toUpperCase()}
                      />
                      <View className="flex flex-col items-start justify-center">
                        <Text className="text-white font-semibold text-xl">
                          You
                        </Text>
                        <Text className="text-[#DC3F32] font-semibold">
                          owe {balance.creditor.displayName}
                        </Text>
                      </View>
                    </View>
                    <View className="flex flex-col items-end justify-center">
                      <Text className={`font-semibold text-lg text-white`}>
                        ${balance.amount.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            {balances
              .filter((balance: any) => balance.creditor.id === user?.id)
              .map((balance: any) => (
                <View
                  className="flex flex-row items-center justify-between py-3"
                  key={`balance-${balance.creditor.id}-${balance.debitor.id}`}
                >
                  <View className="flex flex-row space-x-4 items-center">
                    <Avatar
                      name={balance.debtor.username.charAt(0).toUpperCase()}
                    />
                    <View className="flex flex-col items-start justify-center">
                      <Text className="text-white font-semibold text-xl">
                        {balance.debtor.displayName}
                      </Text>
                      <Text className="text-[#39F183] font-semibold">
                        owes you
                      </Text>
                    </View>
                  </View>
                  <View className="flex flex-col items-end justify-center">
                    <Text className={`font-semibold text-lg text-white`}>
                      ${balance.amount.toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        )}
      </View>
    </View>
  );
}