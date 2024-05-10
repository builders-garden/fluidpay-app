import { Pressable, View, Text } from "react-native";
import { DBTransaction } from "../store/interfaces";
import TimeAgo from "@andordavoti/react-native-timeago";
import { router } from "expo-router";
import { useProfileStore } from "../store/use-profile-store";
import { useUserStore } from "../store/use-user-store";
import Avatar from "./avatar";
import { PressableProps } from "react-native-paper/lib/typescript/components/TouchableRipple/Pressable";

export default function TransactionItem({
  transaction,
  index,
  time,
}: {
  transaction: DBTransaction;
  index: number;
  time?: string;
}) {
  const user = useUserStore((state) => state.user);
  const setProfileUser = useProfileStore((state) => state.setProfileUser);
  const setProfileUserTransactions = useProfileStore(
    (state) => state.setProfileUserTransactions
  );
  const { createdAt, payee, payer, payeeId, payerId, amount } = transaction;
  const isFrom = payerId === user?.id;
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/app/tx-detail-modal",
          params: { transaction: JSON.stringify(transaction) },
        })
      }
      key={`transaction-${index}`}
    >
      <View className="flex flex-row items-center justify-between py-3">
        <View className="flex flex-row items-center space-x-4">
          <Pressable
            key={`profile-event-${index}`}
            onPress={async () => {
              setProfileUserTransactions([]);
              router.push({
                pathname: "/app/profile-modal",
                params: { userId: isFrom ? payeeId : payerId },
              });
            }}
          >
            <Avatar
              name={(isFrom ? payee.displayName : payer.displayName)
                .charAt(0)
                .toUpperCase()}
            />
          </Pressable>

          <View className="flex flex-col">
            <Text className="text-darkGrey dark:text-white font-semibold text-lg">
              {isFrom ? payee.username : payer.username}
            </Text>
            {/* <Pressable
              key={`event-${index}`}
              onPress={async () => {
                await WebBrowser.openBrowserAsync(
                  `${sepolia.explorers[0].url}/tx/${txHash}`
                );
              }}
            > */}
            <Text className="text-mutedGrey">
              {time ?? <TimeAgo dateTo={new Date(createdAt)} />}
            </Text>
            {/* </Pressable> */}
          </View>
        </View>
        <View className="flex flex-col items-end justify-center">
          <Text className={`text-darkGrey dark:text-white font-normal text-lg`}>
            {!isFrom ? "+" : "-"} ${amount.toFixed(2)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
