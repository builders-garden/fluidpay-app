import { Link, router, useLocalSearchParams, useNavigation } from "expo-router";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Appbar, Checkbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../../store";
import { ArrowLeft, ChevronDown, Edit, Trash2 } from "lucide-react-native";
import AppButton from "../../components/app-button";
import { AmountChooser } from "../../components/amount-chooser";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Avatar from "../../components/avatar";
import { CATEGORIES } from "../../constants/categories";
import RNPickerSelect from "react-native-picker-select";
import {
  deleteGroupExpense,
  getGroupExpenseById,
  updateGroupExpense,
} from "../../lib/api";
import { COLORS } from "../../constants/colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import SelectPaidByModal from "./select-paid-by-modal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import DatePicker from "../../components/date-picker";

export default function DetailExpenseModal() {
  const { expense, group } = useLocalSearchParams();
  const expenseData = JSON.parse(expense as string);
  const groupData = JSON.parse(group as string);
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);
  const [amount, setAmount] = useState(expenseData.amount);
  const [description, setDescription] = useState(expenseData.description);
  const [selected, setSelected] = useState<boolean[]>(
    groupData?.members?.map(() => false)
  );
  const [paidById, setPaidById] = useState<number | null>(user?.id!);
  const [updateButtonDisabled, setUpdateButtonDisabled] = useState(true);
  const navigation = useNavigation();
  const [category, setCategory] = useState<string | null>(expenseData.category);
  const [date, setDate] = useState(new Date(expenseData.date));
  const [isLoading, setIsLoading] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  useEffect(() => {
    const refresh = async () => {
      await fetchGroupExpense();
      setUpdateButtonDisabled(false);
    };

    navigation.addListener("focus", refresh);

    return () => {
      navigation.removeListener("focus", refresh);
    };
  }, []);

  const deleteExpense = async () => {
    const result = await deleteGroupExpense(user!.token, {
      id: groupData!.id,
      expenseId: expenseData.id,
    });
    router.back();
  };

  const fetchGroupExpense = async () => {
    const expense = await getGroupExpenseById(user!.token, {
      id: groupData.id,
      expenseId: expenseData.id,
    });
    const splitAmongIds = expense.splitAmong.map(
      (member: any) => member.user.id
    );
    setSelected(
      groupData.members.map((member: any) =>
        splitAmongIds.includes(member.user.id)
      )
    );
  };

  const updateExpense = async () => {
    setIsLoading(true);
    const updatedExpenseData = {
      category: category!,
      paidById,
      description,
      amount,
      date: date.toISOString(),
      splitAmongIds: groupData.members
        .filter((member: any, index: number) => selected[index])
        .map((member: any) => member.user.id),
    };
    await updateGroupExpense(
      user!.token,
      { id: expenseData.groupId, expenseId: expenseData.id },
      updatedExpenseData
    );
    setIsLoading(false);
    router.back();
  };

  return (
    <SafeAreaView
      className="flex-1 flex-col bg-[#161618]"
      edges={{ top: "additive" }}
    >
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Appbar.Header
        elevated={false}
        statusBarHeight={0}
        className="bg-[#161618] text-white"
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
        <Appbar.Action
          icon={() => <Trash2 size={24} color="red" />}
          onPress={async () => {
            await deleteExpense();
          }}
          color="#fff"
          size={24}
        />
      </Appbar.Header>
      <View className="flex-1 px-4">
        <View className="flex space-y-2">
          <Text className="text-3xl text-white font-bold">Expense detail</Text>
          <View className="flex flex-row space-x-1">
            <Text className="text-gray-400">Paid by</Text>
            <Pressable onPress={handlePresentModalPress}>
              <View className="flex flex-row items-center">
                <Text className="text-primary font-semibold">
                  {paidById === user?.id
                    ? "You"
                    : groupData.members.find(
                        (member: any) => member.user.id === paidById
                      )?.user.username}
                </Text>
                <ChevronDown size={16} color={`${COLORS.primary}`} />
              </View>
            </Pressable>
          </View>
        </View>
        <ScrollView>
          <View className="flex space-y-4">
            <View className="mx-auto">
              <AmountChooser
                dollars={amount}
                onSetDollars={setAmount}
                showAmountAvailable
                autoFocus={false}
                lagAutoFocus={false}
              />
            </View>
            <TextInput
              value={description}
              onChangeText={setDescription}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect={false}
              placeholder="Description"
              placeholderTextColor={"#8F8F91"}
              clearButtonMode="always"
              className="text-white bg-[#232324] px-3 py-4 rounded-lg"
            />
            <View>
              <DatePicker date={date} setDate={setDate} />
            </View>
            <View className="bg-[#232324] rounded-lg px-3 py-4 mb-4">
              <RNPickerSelect
                style={{
                  inputAndroid: { color: "white" },
                  inputIOS: { color: "white" },
                }}
                value={category}
                placeholder={{ label: "Select a category", value: null }}
                onValueChange={(value) => setCategory(value)}
                items={Object.keys(CATEGORIES).map((key: string) => ({
                  value: key,
                  label: CATEGORIES[key as keyof typeof CATEGORIES],
                }))}
              />
            </View>
          </View>
          <Text className="text-2xl text-white font-bold">Split among</Text>
          <View className="rounded-lg flex flex-col space-y-4 bg-[#232324] py-4 px-2 mt-2">
            {groupData?.members?.map((member: any, index: number) => (
              <View className="flex flex-row items-center" key={index}>
                <Checkbox.Android
                  status={selected[index] ? "checked" : "unchecked"}
                  color="#FF238C"
                  uncheckedColor="#8F8F91"
                  onPress={() => {
                    const newSelected = selected.slice();
                    newSelected[index] = !newSelected[index];
                    setSelected(newSelected);
                  }}
                />
                <Avatar name={member.user.username.charAt(0).toUpperCase()} />
                <Text className="text-white font-semibold text-lg ml-2">
                  {member.user.username === user?.username
                    ? "You"
                    : member.user.username}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
        <SafeAreaView className="mt-auto">
          <View className="mb-4">
            <AppButton
              text="Save"
              loading={isLoading}
              variant={updateButtonDisabled ? "disabled" : "primary"}
              onPress={() => {
                if (!updateButtonDisabled) {
                  updateExpense();
                }
              }}
            />
          </View>
        </SafeAreaView>
      </View>
      <SelectPaidByModal
        bottomSheetModalRef={bottomSheetModalRef}
        members={groupData.members}
        paidById={paidById}
        setPaidById={setPaidById}
      />
    </SafeAreaView>
  );
}
