import { Link, router, useLocalSearchParams } from "expo-router";
import {
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../../store";
import { ArrowLeft, ChevronDown } from "lucide-react-native";
import AppButton from "../../components/app-button";
import { AmountChooser } from "../../components/amount-chooser";
import { useCallback, useRef, useState } from "react";
import { CATEGORIES } from "../../constants/categories";
import RNPickerSelect from "react-native-picker-select";
import { createGroupExpense, SplitType } from "../../lib/api";
import { COLORS } from "../../constants/colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import DatePicker from "../../components/date-picker";
import SelectPaidByModal from "../../components/bottom-sheets/select-paid-by";
import SelectSplitTypeModal from "../../components/bottom-sheets/select-split-type";
import SplitAmong, { SplitAmongType } from "../../components/split-among";
import { useColorScheme } from "nativewind";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DismissKeyboardHOC from "../../components/hocs/dismiss-keyboard";
import Toast from "react-native-toast-message";

function CreateExpenseModal() {
  const { group } = useLocalSearchParams();
  const data = JSON.parse(group as string);

  const { colorScheme } = useColorScheme();

  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<
    { selected: boolean; amount: number }[]
  >(
    data?.members?.map(() => ({
      selected: false,
      amount: 0,
    }))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [paidById, setPaidById] = useState<number>(user?.id!);
  const [category, setCategory] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [splitType, setSplitType] = useState<SplitType>(SplitType.PERCENTAGE);
  const [splitAmong, setSplitAmong] = useState<SplitAmongType[]>([]);
  const [paidByModalOpen, setPaidByModalOpen] = useState(false);
  const [splitTypeModalOpen, setSplitTypeModalOpen] = useState(false);

  const createExpense = async () => {
    try {
      setIsLoading(true);
      const activeSplits = data.members.filter(
        (_: unknown, index: number) => !!selected[index].selected
      );
      const getAmount = (member: any) =>
        splitAmong.find((split) => split.userId === member.user.id)?.amount;

      const totalSelected = activeSplits.reduce((acc: number, member: any) => {
        return acc + (getAmount(member) || 0);
      }, 0);

      if (splitType === SplitType.AMOUNT && totalSelected !== amount) {
        throw new Error("Total amount mismatch.");
      }

      const expenseData = {
        category: category!,
        paidById,
        description,
        date: date.toISOString(),
        amount,
        splitAmong: activeSplits.map((member: any) => ({
          userId: member.user.id,
          amount: getAmount(member),
          type: splitType,
        })),
      };

      const res = await createGroupExpense(
        user!.token,
        { id: data.id },
        expenseData
      );

      if (!!res.error) {
        throw new Error(res.error.message);
      }
      router.back();
    } catch (error) {
      console.error("Creating Expense", error);
      Toast.show({
        type: "error",
        text1: (error as any).message || "An error occurred",
        position: "bottom",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const paidByBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const splitOptionsBottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handlePaidByPresentModalPress = useCallback(() => {
    Keyboard.dismiss();
    setPaidByModalOpen(true);
  }, []);

  const handleSplitOptionsPresentModalPress = useCallback(() => {
    Keyboard.dismiss();
    setSplitTypeModalOpen(true);
  }, []);

  const getUserPaidBy = () => {
    return paidById === user?.id
      ? "You"
      : data.members.find((member: any) => member.user.id === paidById)?.user
          .username;
  };

  const disableCreateButton = !amount;

  return (
    <SafeAreaView
      className="flex-1 flex-col bg-absoluteWhite dark:bg-darkGrey"
      edges={{ top: "off" }}
    >
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Appbar.Header
        elevated={false}
        statusBarHeight={48}
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
          animated={false}
        />
        <Appbar.Content
          title=""
          color={colorScheme === "dark" ? "#FFF" : "#161618"}
          titleStyle={{ fontWeight: "bold" }}
        />
      </Appbar.Header>
      <View className="flex-1 px-4">
        <View className="flex space-y-2">
          <Text className="text-3xl text-darkGrey dark:text-white font-bold">
            Create expense
          </Text>
          <View className="flex flex-row space-x-1">
            <Text className="text-gray-400">Paid by</Text>
            <Pressable onPress={handlePaidByPresentModalPress}>
              <View className="flex flex-row items-center">
                <Text className="text-primary font-semibold">
                  {getUserPaidBy()}
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
                autoFocus
                lagAutoFocus={false}
              />
            </View>
            <View>
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
            </View>
            <View>
              <DatePicker date={date} setDate={setDate} />
            </View>
            <View className="bg-white dark:bg-[#232324] rounded-lg px-3 py-4 mb-4">
              <RNPickerSelect
                style={{
                  inputAndroid: {
                    color: colorScheme === "dark" ? "white" : "black",
                  },
                  inputIOS: {
                    color: colorScheme === "dark" ? "white" : "black",
                  },
                }}
                value={category}
                placeholder={{ label: "Select a category", value: null }}
                onValueChange={(value) => setCategory(value)}
                items={Object.keys(CATEGORIES).map(
                  (key: string, index: number) => ({
                    value: key,
                    label: CATEGORIES[key as keyof typeof CATEGORIES],
                    key: `kk-${index}`,
                  })
                )}
              />
            </View>
          </View>

          <SplitAmong
            members={data.members}
            selected={selected}
            setSelected={setSelected}
            paidById={paidById}
            amount={amount}
            splitType={splitType}
            setSplitType={setSplitType}
            splitAmong={splitAmong}
            setSplitAmong={setSplitAmong}
            handleSplitOptionsPresentModalPress={() => {
              handleSplitOptionsPresentModalPress();
            }}
          />
        </ScrollView>
        <View className="pt-5">
          <AppButton
            text="Create"
            variant="primary"
            loading={isLoading}
            disabled={isLoading || disableCreateButton}
            onPress={() => createExpense()}
          />
        </View>
      </View>
      <GestureHandlerRootView>
        {paidByModalOpen && (
          <SelectPaidByModal
            bottomSheetModalRef={paidByBottomSheetModalRef}
            members={data.members}
            paidById={paidById}
            setPaidById={(id) => setPaidById(id)}
            handleClose={() => setPaidByModalOpen(false)}
          />
        )}
        {splitTypeModalOpen && (
          <SelectSplitTypeModal
            selectedSplitType={splitType}
            bottomSheetModalRef={splitOptionsBottomSheetModalRef}
            setSplitType={setSplitType}
            handleClose={() => setSplitTypeModalOpen(false)}
          />
        )}
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

export default DismissKeyboardHOC(CreateExpenseModal);
