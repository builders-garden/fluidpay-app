import { Pressable, View, Text } from "react-native";
import { DBTransaction } from "../store/interfaces";
import TimeAgo from "@andordavoti/react-native-timeago";
import { router } from "expo-router";
import { useProfileStore } from "../store/use-profile-store";
import { useUserStore } from "../store/use-user-store";
import Avatar from "./avatar";

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
  const { createdAt, payee, payer, payeeId, payerId, amount } = transaction;
  const isFrom = payerId === user?.id;
  return (
    <View key={`transaction-${index}`}>
      <View className="flex flex-row items-center justify-between py-3">
        <View className="flex flex-row items-center space-x-4">
          <Pressable
            key={`profile-event-${index}`}
            onPress={async () => {
              setProfileUser({
                id: isFrom ? payeeId : payerId,
                address: isFrom ? payee.address : payer.address,
                username: isFrom ? payee.username : payer.username,
              });
              setProfileUserTransactions([]);
              router.push("/app/profile-modal");
            }}
          >
            <Avatar
              name={(isFrom ? payee.username : payer.username)
                .charAt(0)
                .toUpperCase()}
            />
          </Pressable>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/app/tx-detail-modal",
                params: { transaction: JSON.stringify(transaction) },
              })
            }
          >
            <View className="flex flex-col">
              <Text className="text-white font-semibold text-lg">
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
              <Text className="text-[#8F8F91]">
                <TimeAgo dateTo={new Date(createdAt)} />
              </Text>
              {/* </Pressable> */}
            </View>
          </Pressable>
        </View>
        <View className="flex flex-col items-end justify-center">
          <Text
            className={`${
              !isFrom ? "text-emerald-500" : "text-red-500"
            } font-semibold text-lg`}
          >
            {!isFrom ? "+" : "-"} ${amount.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}
