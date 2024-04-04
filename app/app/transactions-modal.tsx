import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { View, Text } from "react-native";
import { Appbar } from "react-native-paper";
import TransactionItem from "../../components/transaction-item";
import { DBTransaction } from "../../store/interfaces";

export default function TransactionsModal() {
  const { transactions: transactionsData } = useLocalSearchParams();
  const transactions: DBTransaction[] = JSON.parse(transactionsData as string);

  return (
    <View className="flex-1 flex-col bg-black px-4">
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
      <Text className="text-white text-4xl font-bold">Transactions</Text>
      <View className="flex flex-col justify-between px-4 bg-greyInput rounded-lg mt-4">
        {transactions.map((payment, index) => (
          <TransactionItem
            transaction={payment}
            index={index}
            key={`transaction-${index}`}
          />
        ))}
      </View>
    </View>
  );
}
