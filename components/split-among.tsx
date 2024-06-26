import { ChevronDown } from "lucide-react-native";
import {
  View,
  Pressable,
  Text,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  TextInput,
} from "react-native";
import Avatar from "./avatar";
import { Checkbox, TextInput as RNPTextInput } from "react-native-paper";
import { SplitType } from "../lib/api";
import { COLORS } from "../constants/colors";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../store";
import { useColorScheme } from "nativewind";

export interface SplitAmongType {
  userId: number;
  amount: number;
  type: SplitType;
}

export default function SplitAmong({
  fetchingData = false,
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
  fetchingData?: boolean;
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
      newSplitAmong = selected
        .map((s, index) => {
          if (s.selected) {
            return {
              userId: members[index].user.id,
              amount: s.amount,
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

  const selectUser = (index: number, isSelected: boolean, amount?: number) => {
    const newSelected = selected.slice();
    newSelected[index].selected = isSelected;

    if (amount) {
      newSelected[index].amount = amount;
    }
    setSelected(newSelected);
  };

  return (
    <View className="flex flex-col">
      <View className="flex flex-row justify-between items-center">
        <Text className="text-2xl text-darkGrey dark:text-white font-bold">
          Split among
        </Text>
        {!fetchingData && (
          <Pressable
            className="flex flex-row items-center"
            onPress={handleSplitOptionsPresentModalPress}
          >
            <Text className="text-primary">
              {splitType === SplitType.PERCENTAGE ? "By percent" : "By amount"}
            </Text>
            <ChevronDown size={16} color={`${COLORS.primary}`} />
          </Pressable>
        )}
      </View>
      <View className="rounded-lg flex flex-col space-y-4 bg-white dark:bg-[#232324] py-4 px-4 mt-2">
        {members?.map((member: any, index: number) => (
          <View
            key={"mem-" + index}
            className="flex flex-row justify-between items-center"
          >
            <View className="flex flex-row items-center space-x-4">
              <Checkbox.Android
                status={
                  fetchingData
                    ? "indeterminate"
                    : selected[index].selected
                      ? "checked"
                      : "unchecked"
                }
                color="#FF238C"
                uncheckedColor="#8F8F91"
                onPress={() => selectUser(index, !selected[index].selected)}
              />
              <Avatar
                name={member.user.displayName.charAt(0).toUpperCase()}
                uri={member.user.avatarUrl}
              />
              <View className="flex flex-col ">
                <Text className="text-darkGrey dark:text-white font-semibold text-lg">
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
                <Text className="font-underline text-darkGrey dark:text-white">
                  {splitType === SplitType.PERCENTAGE ? "0%" : "$0"}
                </Text>
              )}
              {splitAmong
                .filter((split) => split.userId === member.userId)
                .map((split) =>
                  splitType === SplitType.PERCENTAGE ? (
                    <Text
                      key={split.userId}
                      className="text-darkGrey dark:text-white"
                    >
                      {split?.amount?.toFixed(0)}%
                    </Text>
                  ) : (
                    // <Text
                    //   key={split.userId}
                    //   className="text-darkGrey dark:text-white"
                    // >
                    //   ${split.amount.toFixed(2)}
                    // </Text>

                    <SplitTextInput
                      key={split.userId}
                      saveSplit={(amount: number) =>
                        selectUser(index, true, amount)
                      }
                    />
                  )
                )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const SplitTextInput = ({
  saveSplit,
}: {
  saveSplit: (amount: number) => void;
}) => {
  const { colorScheme } = useColorScheme();
  const [text, setText] = useState("");
  const [inputWidth, setInputWidth] = useState(100); // Initial width

  const inputRef = useRef<TextInput>(null);

  const handleContentSizeChange = (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => {
    setInputWidth(event.nativeEvent.contentSize.width);
  };

  const onEndEditing = () => {
    const amount = parseFloat(!!text ? text : "0");
    saveSplit(amount);
  };

  return (
    <View className="flex-row items-center">
      <Pressable onPress={() => inputRef.current?.focus()}>
        <Text
          className="text-base pb-px"
          style={{
            color: !!text
              ? colorScheme === "dark"
                ? "#f2f2f2"
                : "#161618"
              : "#8F8F91",
          }}
        >
          $
        </Text>
      </Pressable>
      <RNPTextInput
        value={text}
        onChangeText={setText}
        autoFocus
        className="h-4 font-normal placeholder:text-base text-base !bg-transparent"
        placeholderTextColor="#8F8F91"
        numberOfLines={1}
        keyboardType="number-pad"
        style={{
          paddingStart: 0,
          paddingEnd: 0,
          paddingHorizontal: 0,
          paddingBottom: 5,
          width: inputWidth,
          paddingVertical: 0,
        }}
        placeholder="0"
        textColor={colorScheme === "dark" ? "#F2F2F2" : "#161618"}
        underlineColor="transparent"
        onContentSizeChange={handleContentSizeChange}
        // activeUnderlineColor="transparent"
        cursorColor="#FF238C"
        selectionColor="#FF238C"
        theme={{ colors: { primary: "#FF238C" } }}
        onEndEditing={onEndEditing}
        ref={inputRef}
      />
    </View>
  );
};
