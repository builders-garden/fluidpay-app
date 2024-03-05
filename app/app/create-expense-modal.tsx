import { Link, router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";
import { Appbar, Checkbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../../store";
import { ArrowLeft, ChevronDown } from "lucide-react-native";
import AppButton from "../../components/app-button";
import { AmountChooser } from "../../components/amount-chooser";
import { useState } from "react";
import Avatar from "../../components/avatar";
import { CATEGORIES } from "../../constants/categories";
import RNPickerSelect from "react-native-picker-select";
import { createGroupExpense } from "../../lib/api";
import { ScrollView } from "react-native-gesture-handler";
import { COLORS } from "../../constants/colors";

export default function CreateExpenseModal() {
  const { group } = useLocalSearchParams();
  const data = JSON.parse(group as string);

  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<boolean[]>(
    data?.members?.map(() => false)
  );
  const [paidById, setPaidById] = useState(user?.id);
  const [category, setCategory] = useState<string | null>(null);

  const createExpense = async () => {
    const expenseData = {
      category: category!,
      paidById: user!.id,
      description,
      date: new Date().toISOString(),
      amount,
      splitAmongIds: data.members
        .filter((member: any, index: number) => selected[index])
        .map((member: any) => member.user.id),
    };

    // console.log(expenseData);
    await createGroupExpense(user!.token, { id: data.id }, expenseData);
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
          <Text className="text-3xl text-white font-bold">Create expense</Text>
          <View className="flex flex-row space-x-1">
            <Text className="text-gray-400">Paid by</Text>
            <Pressable>
              <View className="flex flex-row items-center">
                <Text className="text-primary font-semibold">
                  {paidById === user?.id
                    ? "You"
                    : data.members.find(
                        (member: any) => member.user.id === paidById
                      )?.user.username}
                </Text>
                <ChevronDown size={16} color={`${COLORS.primary}`} />
              </View>
            </Pressable>
          </View>

          <View className="mx-auto">
            <AmountChooser
              dollars={amount}
              onSetDollars={setAmount}
              showAmountAvailable
              autoFocus
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
          {data?.members?.map((member: any, index: number) => (
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
          <AppButton
            text="Create"
            variant="primary"
            onPress={() => createExpense()}
          />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}
