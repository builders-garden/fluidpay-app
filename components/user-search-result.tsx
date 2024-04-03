import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Pressable, View, Text } from "react-native";
import { DBTransaction, DBUser } from "../store/interfaces";
import Avatar from "./avatar";

export default function UserSearchResult({
  user,
  transaction,
}: {
  user: DBUser;
  transaction?: DBTransaction;
}) {
  return (
    <Pressable
      className="flex flex-row items-center justify-between py-4"
      onPress={() => {
        router.push({
          pathname: `/app/send-modal`,
          params: { user: JSON.stringify(user) },
        });
      }}
      key={user.id}
    >
      <View className="flex flex-row items-center space-x-4">
        <Avatar name={user.username?.charAt(0).toUpperCase()} />
        <View className="flex flex-col">
          <Text className="text-white font-semibold text-lg">
            {user.displayName}
          </Text>
          <Text className="text-gray-500 font-semibold text-sm">
            @{user.username}
          </Text>
        </View>
      </View>
      <View className="flex flex-row space-x-4 items-center">
        {transaction && (
          <View className="flex flex-row items-center space-x-2">
            <Text className={`font-semibold text-lg ${transaction.payeeId === user.id ? 'text-red-700' : 'text-green-700'}`}>
              ${transaction.amount}
            </Text>
          </View>
        )}
        <ChevronRight size={16} color="#FFF" />
      </View>
    </Pressable>
  );
}
