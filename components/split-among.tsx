import { ChevronDown } from "lucide-react-native";
import { View, Pressable, Text } from "react-native";
import Avatar from "./avatar";
import { Checkbox } from "react-native-paper";
import SelectSplitTypeModal, {
  SplitType,
} from "../app/app/select-split-type-modal";
import { COLORS } from "../constants/colors";
import { useEffect } from "react";
import { useUserStore } from "../store";

export interface SplitAmongType {
  userId: number;
  amount: number;
  type: SplitType;
}

export default function SplitAmong({
  paidById,
  splitType,
  setSplitType,
  splitAmong,
  setSplitAmong,
  amount,
  members,
  selected,
  setSelected,
  handleSplitOptionsPresentModalPress,
}: {
  paidById: number;
  amount: number;
  splitType: SplitType;
  setSplitType: (d: SplitType) => void;
  splitAmong: SplitAmongType[];
  setSplitAmong: (d: SplitAmongType[]) => void;
  selected: { selected: boolean; amount: number }[];
  members: any[];
  setSelected: (d: any) => void;
  handleSplitOptionsPresentModalPress: () => void;
}) {
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    let newSplitAmong: SplitAmongType[] = [];
    if (splitType === SplitType.PERCENTAGE) {
      // Assuming splitType and amount are available in this scope
      const amountPerUser = 100 / selected.filter((s) => s.selected).length; // calculate the amount per user
      newSplitAmong = selected
        .map((s, index) => {
          if (s.selected) {
            return {
              userId: members[index].user.id,
              amount: amountPerUser,
              type: splitType,
            };
          }
        })
        .filter(Boolean) as any;
    }
    if (splitType === SplitType.AMOUNT) {
      const amountPerUser = amount / selected.filter((s) => s.selected).length; // calculate the amount per user
      newSplitAmong = selected
        .map((s, index) => {
          if (s.selected) {
            return {
              userId: members[index].user.id,
              amount: amountPerUser,
              type: splitType,
            };
          }
        })
        .filter(Boolean) as any;
    }
    setSplitAmong(newSplitAmong);
  }, [splitType, selected, amount]);
  const getUserPaidBy = () => {
    return paidById === user?.id
      ? "You"
      : members.find((member: any) => member.user.id === paidById)?.user
          .username;
  };
  const getUserSplitAmong = (userId: number) => {
    return splitAmong.find((split) => split.userId === userId);
  };
  return (
    <View className="flex flex-col">
      <View className="flex flex-row justify-between items-center">
        <Text className="text-2xl text-white font-bold">Split among</Text>
        <Pressable
          className="flex flex-row items-center"
          onPress={handleSplitOptionsPresentModalPress}
        >
          <Text className="text-primary">
            {splitType === SplitType.PERCENTAGE ? "By percent" : "By amount"}
          </Text>
          <ChevronDown size={16} color={`${COLORS.primary}`} />
        </Pressable>
      </View>
      <View className="rounded-lg flex flex-col space-y-4 bg-[#232324] py-4 px-4 mt-2">
        {members?.map((member: any, index: number) => (
          <View
            key={"mem-" + index}
            className="flex flex-row justify-between items-center"
          >
            <View className="flex flex-row items-center space-x-4">
              <Checkbox.Android
                status={selected[index].selected ? "checked" : "unchecked"}
                color="#0061FF"
                uncheckedColor="#8F8F91"
                onPress={() => {
                  const newSelected = selected.slice();
                  newSelected[index].selected = !newSelected[index].selected;
                  setSelected(newSelected);
                }}
              />
              <Avatar name={member.user.username.charAt(0).toUpperCase()} />
              <View className="flex flex-col ">
                <Text className="text-white font-semibold text-lg">
                  {member.user.username === user?.username
                    ? "You"
                    : member.user.username}
                </Text>
                <Text className="text-gray-400">
                  {!selected[index].selected && "Not involved"}
                  {selected[index].selected &&
                    paidById === member.user!.id &&
                    `Paid $${amount}`}
                  {selected[index].selected &&
                    paidById !== member.user!.id &&
                    user!.id === member.user!.id && (
                      <Text>
                        <Text
                          className={`${splitType === SplitType.AMOUNT ? "text-amber-500" : ""}`}
                        >
                          Owe {getUserPaidBy()}
                        </Text>{" "}
                        {splitType === SplitType.PERCENTAGE && (
                          <Text className="text-amber-500">
                            $
                            {(
                              ((getUserSplitAmong(member.user.id)?.amount ||
                                0) *
                                amount) /
                              100
                            ).toFixed(2)}
                          </Text>
                        )}
                      </Text>
                    )}

                  {selected[index].selected &&
                    paidById !== member.user!.id &&
                    user!.id !== member.user!.id && (
                      <Text>
                        <Text
                          className={`${splitType === SplitType.AMOUNT ? "text-amber-500" : ""}`}
                        >
                          Owes {getUserPaidBy()}
                        </Text>{" "}
                        {splitType === SplitType.PERCENTAGE && (
                          <Text className="text-amber-500">
                            $
                            {(
                              ((getUserSplitAmong(member.user.id)?.amount ||
                                0) *
                                amount) /
                              100
                            ).toFixed(2)}
                          </Text>
                        )}
                      </Text>
                    )}
                </Text>
              </View>
            </View>
            <View>
              {!splitAmong.find((split) => {
                return split.userId === member.userId;
              }) && (
                <Text className="font-underline text-white">
                  {splitType === SplitType.PERCENTAGE ? "0%" : "$0"}
                </Text>
              )}
              {splitAmong
                .filter((split) => split.userId === member.userId)
                .map((split) =>
                  splitType === SplitType.PERCENTAGE ? (
                    <Text className="text-white">
                      {split.amount.toFixed(0)}%
                    </Text>
                  ) : (
                    <Text className="text-white">
                      ${split.amount.toFixed(2)}
                    </Text>
                  )
                )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
