import { router } from "expo-router";
import { Pressable, View, Text } from "react-native";
import { DBTransaction, DBUser } from "../store/interfaces";
import Avatar from "./avatar";
import TimeAgo from "@andordavoti/react-native-timeago";

export default function InteractedUser({
  user,
  transaction,
}: {
  user: DBUser;
  transaction: DBTransaction;
}) {
  const direction = transaction.payerId === user.id ? "from" : "to";
  return (
    <Pressable
      className="flex flex-row justify-between py-4"
      onPress={() => {
        router.push({
          pathname: `/app/send-modal`,
          params: { user: JSON.stringify(user) },
        });
      }}
      key={user.id}
    >
      <View className="flex flex-row space-x-4">
        <Avatar
          name={user.displayName?.charAt(0).toUpperCase()}
          uri={user.avatarUrl}
        />
        <View className="flex flex-col">
          <Text className="text-darkGrey dark:text-white font-semibold text-lg">
            {user.displayName}
          </Text>
          <Text className="text-gray-500 font-semibold text-sm">
            {direction === "from"
              ? `🤑 Sent you $${transaction.amount.toFixed(2)}`
              : `💸 You sent $${transaction.amount.toFixed(2)}`}
          </Text>
        </View>
      </View>
      <View className="flex flex-row space-x-4">
        <Text className="text-mutedGrey">
          <TimeAgo dateTo={new Date(transaction.createdAt)} />
        </Text>
      </View>
    </Pressable>
  );
}
