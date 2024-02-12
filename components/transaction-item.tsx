import { Pressable, View, Text } from "react-native";
import { DBTransaction } from "../store/interfaces";
import { Divider } from "react-native-paper";
import TimeAgo from "@andordavoti/react-native-timeago";
import { sepolia } from "../constants/sepolia";
import * as WebBrowser from "expo-web-browser";
import Avatar from "./avatar";
import { router } from "expo-router";
import { useProfileStore } from "../store/use-profile-store";
import { useUserStore } from "../store/use-user-store";

export default function TransactionItem({
  transaction,
  index,
}: {
  transaction: DBTransaction;
  index: number;
}) {
  const user = useUserStore((state) => state.user);
  const setProfileUser = useProfileStore((state) => state.setProfileUser);
  const setProfileUserTransactions = useProfileStore(
    (state) => state.setProfileUserTransactions
  );
  const { from, to, toUsername, fromUsername, createdAt, txHash } = transaction;
  const amount = parseFloat(transaction.amount);
  const isFrom = from === user?.address;
  return (
    <View key={`transaction-${index}`}>
      <View className="flex flex-row items-center justify-between py-4">
        <View className="flex flex-row items-center space-x-4">
          <Pressable
            key={`profile-event-${index}`}
            onPress={async () => {
              setProfileUser({
                address: isFrom ? to : from,
                username: isFrom ? toUsername : fromUsername,
              });
              setProfileUserTransactions([]);
              router.push("/app/profile-modal");
            }}
          >
            <Avatar
              name={(isFrom ? toUsername : fromUsername)
                .charAt(0)
                .toUpperCase()}
            />
          </Pressable>

          <View className="flex flex-col">
            <Text className="text-white font-semibold text-lg">
              {isFrom ? toUsername : fromUsername}
            </Text>
            <Pressable
              key={`event-${index}`}
              onPress={async () => {
                await WebBrowser.openBrowserAsync(
                  `${sepolia.explorers[0].url}/tx/${txHash}`
                );
              }}
            >
              <Text className="text-[#53516C]">Click to view detail</Text>
            </Pressable>
          </View>
        </View>
        <View className="flex flex-col items-end justify-center">
          <Text
            className={`${
              !isFrom ? "text-emerald-500" : "text-red-500"
            } font-semibold text-lg`}
          >
            {!isFrom ? "+" : "-"} ${amount.toFixed(2)}
          </Text>
          <Text className="text-[#53516C]">
            <TimeAgo dateTo={new Date(createdAt)} />
          </Text>
        </View>
      </View>
      <Divider />
    </View>
  );
}
