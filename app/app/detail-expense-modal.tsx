import { Link, router, useLocalSearchParams, useNavigation } from "expo-router";
import { Text, TextInput, View } from "react-native";
import { Appbar, Checkbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../../store";
import { ArrowLeft } from "lucide-react-native";
import AppButton from "../../components/app-button";
import { AmountChooser } from "../../components/amount-chooser";
import { useEffect, useState } from "react";
import Avatar from "../../components/avatar";
import { CATEGORIES } from "../../constants/categories";
import RNPickerSelect from "react-native-picker-select";
import { getGroupExpenseById, updateGroupExpense } from "../../lib/api";
import { ScrollView } from "react-native-gesture-handler";

export default function DetailExpenseModal() {
  const { expense, group } = useLocalSearchParams();
  const expenseData = JSON.parse(expense as string);
  const groupData = JSON.parse(group as string);
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<boolean[]>(
    groupData?.members?.map(() => false)
  );
  const [updateButtonDisabled, setUpdateButtonDisabled] = useState(true);
  const navigation = useNavigation();
  const [category, setCategory] = useState<string | null>(null);

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

  const fetchGroupExpense = async () => {
    const expense = await getGroupExpenseById(user!.token, {
      id: expenseData.groupId,
      expenseId: expenseData.id,
    });
    setDescription(expense.description);
    setAmount(expense.amount);
    setCategory(expense.category);
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
    const updatedExpenseData = {
      category: category!,
      description,
      amount,
      date: expenseData.date,
      splitAmongIds: groupData.members
        .filter((member: any, index: number) => selected[index])
        .map((member: any) => member.user.id),
    };
    // console.log(expenseData);
    await updateGroupExpense(
      user!.token,
      { id: expenseData.groupId, expenseId: expenseData.id },
      updatedExpenseData
    );
    router.back();
  };

  return (
    <SafeAreaView
      className="flex-1 flex-col bg-[#161618]"
      edges={{ top: "off" }}
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
      </Appbar.Header>
      <View className="flex-1 px-4">
        <View className="flex space-y-4">
          <Text className="text-3xl text-white font-bold">Expense detail</Text>
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
        <ScrollView className="rounded-lg flex flex-col space-y-4 bg-[#232324] py-4 px-2 mt-2">
          {groupData?.members?.map((member: any, index: number) => (
            <View className="flex flex-row items-center" key={index}>
              <Checkbox.Android
                status={selected[index] ? "checked" : "unchecked"}
                color="#0061FF"
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
        </ScrollView>
        <SafeAreaView className="mt-auto">
          <View className="mb-4">
            <AppButton
              text="Update"
              variant={updateButtonDisabled ? "disabled" : "primary"}
              onPress={() => {
                if (!updateButtonDisabled) {
                  updateExpense();
                }
              }}
            />
          </View>
          <AppButton
            text="Cancel"
            variant="ghost"
            onPress={() => router.back()}
          />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}
