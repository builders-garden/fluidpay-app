import { Link, router, useLocalSearchParams, useNavigation } from "expo-router";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Appbar, Checkbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../../store";
import { ArrowLeft, ChevronDown, Trash2 } from "lucide-react-native";
import AppButton from "../../components/app-button";
import { AmountChooser } from "../../components/amount-chooser";
import { useCallback, useEffect, useRef, useState } from "react";
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
import SelectPaidByModal from "../../components/bottom-sheets/select-paid-by";
import DatePicker from "../../components/date-picker";
import { useColorScheme } from "nativewind";
import DeleteExpenseModal from "../../components/modals/delete-expense";

export default function DetailExpenseModal() {
  const { colorScheme } = useColorScheme();
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
  const [deleteExpenseModalVisible, setDeleteExpenseModalVisible] =
    useState(false);
  const navigation = useNavigation();
  const [category, setCategory] = useState<string | null>(expenseData.category);
  const [date, setDate] = useState(new Date(expenseData.date));
  const [isLoading, setIsLoading] = useState(false);
  const [paidByModalOpen, setPaidByModalOpen] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    setPaidByModalOpen(true);
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
    await deleteGroupExpense(user!.token, {
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
    try {
      setIsLoading(true);
      const updatedExpenseData = {
        category: category!,
        paidById,
        description,
        amount,
        date: date.toISOString(),
        splitAmongIds: groupData.members
          .filter((member: any, index: number) => !!selected[index])
          .map((member: any) => member.user.id),
        // TODO: Fix this
        // splitAmong: groupData.members
        //   .filter((_: unknown, index: number) => !!selected[index])
        //   .map((member: any) => ({
        //     userId: member.user.id,
        //     amount: splitAmong.find((split) => split.userId === member.user.id)
        //       ?.amount,
        //     type: splitType,
        //   })),
      };

      const res = await updateGroupExpense(
        user!.token,
        { id: expenseData.groupId, expenseId: expenseData.id },
        updatedExpenseData
      );

      if (!!res.error) {
        throw new Error(res.error.message);
      }

      router.back();
    } catch (error) {
      console.error("Creating Expense", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 flex-col bg-absoluteWhite dark:bg-darkGrey"
      edges={{ top: "additive" }}
    >
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Appbar.Header
        elevated={false}
        statusBarHeight={0}
        className="bg-absoluteWhite dark:bg-darkGrey text-darkGrey dark:text-white"
      >
        <Appbar.Action
          icon={() => (
            <ArrowLeft
              size={24}
              color={colorScheme === "dark" ? "#FFF" : "#161618"}
            />
          )}
          onPress={() => {
            router.back();
          }}
          color={colorScheme === "dark" ? "#FFF" : "#161618"}
          size={24}
        />
        <Appbar.Content
          title=""
          color={colorScheme === "dark" ? "#FFF" : "#161618"}
          titleStyle={{ fontWeight: "bold" }}
        />
        <Appbar.Action
          icon={() => <Trash2 size={24} color="red" />}
          onPress={() => {
            setDeleteExpenseModalVisible(true);
          }}
          color={colorScheme === "dark" ? "#FFF" : "#161618"}
          size={24}
          animated={false}
        />
      </Appbar.Header>
      <View className="flex-1 px-4">
        <View className="flex space-y-2">
          <Text className="text-3xl text-darkGrey dark:text-white font-bold">
            Expense detail
          </Text>
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
              className="text-darkGrey dark:text-white bg-white dark:bg-[#232324] px-3 py-4 rounded-lg"
            />
            <View>
              <DatePicker date={date} setDate={setDate} />
            </View>
            <View className="bg-white dark:bg-[#232324] rounded-lg px-3 py-4 mb-4">
              <RNPickerSelect
                style={{
                  inputAndroid: {
                    color: colorScheme === "dark" ? "#FFF" : "#161618",
                  },
                  inputIOS: {
                    color: colorScheme === "dark" ? "#FFF" : "#161618",
                  },
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
          <Text className="text-2xl text-darkGrey dark:text-white font-bold">
            Split among
          </Text>
          <View className="rounded-lg flex flex-col space-y-4 bg-white dark:bg-[#232324] py-4 px-2 mt-2">
            {groupData?.members?.map((member: any, index: number) => (
              <View className="flex flex-row items-center" key={index}>
                <Checkbox.Android
                  status={
                    updateButtonDisabled
                      ? "indeterminate"
                      : selected[index]
                        ? "checked"
                        : "unchecked"
                  }
                  color="#FF238C"
                  uncheckedColor="#8F8F91"
                  onPress={() => {
                    const newSelected = selected.slice();
                    newSelected[index] = !newSelected[index];
                    setSelected(newSelected);
                  }}
                />
                <Avatar
                  name={member.user.displayName.charAt(0).toUpperCase()}
                  uri={member.user.avatarUrl}
                />
                <Text className="text-darkGrey dark:text-white font-semibold text-lg ml-2">
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
      {paidByModalOpen && (
        <SelectPaidByModal
          bottomSheetModalRef={bottomSheetModalRef}
          members={groupData.members}
          paidById={paidById!}
          setPaidById={setPaidById}
          handleClose={() => setPaidByModalOpen(false)}
        />
      )}
      <DeleteExpenseModal
        visible={deleteExpenseModalVisible}
        hideModal={() => setDeleteExpenseModalVisible(false)}
        handleDelete={deleteExpense}
      />
    </SafeAreaView>
  );
}
