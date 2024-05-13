import { router } from "expo-router";
import { Pressable, View, Text } from "react-native";
import Avatar from "./avatar";
import { useUserStore, useSendStore } from "../store";

export default function BalanceItem(balanceData: any, index: number) {
  const { balance } = balanceData;
  const user = useUserStore((state) => state.user);
  const setSendUser = useSendStore((state) => state.setSendUser);
  const isCurrentUserDebtor = balance.debtor.id === user?.id;
  return (
    <Pressable
      onPress={() => {
        if (isCurrentUserDebtor) {
          router.push({
            pathname: "/app/send-modal",
            params: {
              amount: balance.amount.toFixed(2),
              user: JSON.stringify(balance.creditor),
            },
          });
          return;
        } else {
          // TODO: send payment request to balance.debtor.id
        }
      }}
    >
      <View className="flex flex-row items-center justify-between py-3">
        <View className="flex flex-row space-x-4 items-center">
          <Avatar
            name={
              isCurrentUserDebtor
                ? balance.creditor.displayName.charAt(0).toUpperCase()
                : balance.debtor.displayName.charAt(0).toUpperCase()
            }
          />
          <View className="flex flex-col items-start justify-center">
            {isCurrentUserDebtor ? (
              <>
                <Text className="text-darkGrey dark:text-white font-semibold text-xl">
                  You
                </Text>
                <Text className="text-[#DC3F32] font-semibold">
                  owe {balance.creditor.displayName}
                </Text>
              </>
            ) : (
              <>
                <Text className="text-darkGrey dark:text-white font-semibold text-xl">
                  {balance.debtor.displayName}
                </Text>
                <Text className="text-[#39F183] font-semibold">owes you</Text>
              </>
            )}
          </View>
        </View>
        <View className="flex flex-col items-end justify-center">
          <Text
            className={`font-semibold text-lg text-darkGrey dark:text-white`}
          >
            ${balance.amount.toFixed(2)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
