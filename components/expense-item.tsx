import { Pressable, View, Text } from "react-native";
import TimeAgo from "@andordavoti/react-native-timeago";
import { CATEGORIES, CATEGORIES_EMOJI } from "../constants/categories";
import Avatar from "./avatar";
import { router } from "expo-router";
import { formatDistanceToNow } from "date-fns";

export default function ExpenseItem({
  expense,
  group,
  index,
}: {
  group: any;
  expense: any;
  index: number;
}) {
  const { date, paidBy, amount, description, category, createdAt } = expense;
  return (
    <View key={`transaction-${index}`}>
      <View className="flex flex-row items-center justify-between py-3">
        <View className="flex flex-row items-center space-x-4">
          <Avatar
            name={CATEGORIES_EMOJI[category as keyof typeof CATEGORIES]}
          />

          <Pressable
            onPress={() => {
              router.push({
                params: {
                  expense: JSON.stringify(expense),
                  group: JSON.stringify(group),
                },
                pathname: "/app/detail-expense-modal",
              });
            }}
          >
            <View className="flex flex-col">
              <Text className="text-darkGrey dark:text-white font-semibold text-lg">
                {description}
              </Text>
              <Text className="text-mutedGrey">
                {paidBy.username} -{" "}
                {(() => {
                  const distance = formatDistanceToNow(new Date(createdAt));
                  return distance.startsWith("less than a minute") ? (
                    "now"
                  ) : (
                    <TimeAgo dateTo={new Date(date)} />
                  );
                })()}
              </Text>
            </View>
          </Pressable>
        </View>
        <View className="flex flex-col items-end justify-center">
          <Text
            className={`font-semibold text-lg text-darkGrey dark:text-white`}
          >
            ${amount.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}
