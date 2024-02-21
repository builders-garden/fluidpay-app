import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Cog } from "lucide-react-native";
import { useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Appbar, Avatar } from "react-native-paper";
import AppButton from "../../components/app-button";
import { SegmentSlider } from "../../components/segment-slider";
import TransactionItem from "../../components/transaction-item";

type GroupOptions = "Expenses" | "Balances";

export default function GroupPage() {
  const { group } = useLocalSearchParams();
  const data = JSON.parse(group as string);

  const [tab, setTab] = useState<GroupOptions>("Expenses");
  const tabs = useRef(["Expenses", "Balances"] as GroupOptions[]).current;

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
              params: { group },
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
              <Avatar.Text
                label={member.username.charAt(0).toUpperCase()}
                size={48}
                labelStyle={{ fontWeight: "bold" }}
                // color="#FFFFFF"
              />
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
                params: { group },
              })
            }
          />
        </View>

        <View className="mt-8">
          <SegmentSlider {...{ tabs, tab, setTab }} />
        </View>
        {tab === "Expenses" && (
          <ScrollView className="bg-[#161618] w-full mx-auto h-[450px] rounded-xl px-4 space-y-4 mt-8 pb-8">
            {transactions.map((transaction, index) => (
              <TransactionItem
                key={index}
                transaction={transaction}
                index={index}
              />
            ))}
          </ScrollView>
        )}
        {tab === "Balances" && (
          <View className="bg-[#161618] w-full mx-auto h-[450px] rounded-xl px-4 space-y-4 mt-8 pb-8">
            <Text className="text-white text-2xl font-bold mt-4">Balances</Text>
            <View className="flex flex-row justify-between">
              <Text className="text-white text-lg">frankc</Text>
              <Text className="text-white text-lg">-18.46</Text>
            </View>
            <View className="flex flex-row justify-between">
              <Text className="text-white text-lg">orbulo</Text>
              <Text className="text-white text-lg">+18.46</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
