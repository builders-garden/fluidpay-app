import { Link, router } from "expo-router";
import { Text, TextInput, View } from "react-native";
import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../../store";
import Avatar from "../../components/avatar";
import TimeAgo from "@andordavoti/react-native-timeago";
import { ArrowLeft, Share } from "lucide-react-native";
import AppButton from "../../components/app-button";
import { AmountChooser } from "../../components/amount-chooser";
import { useState } from "react";

export default function CreateExpenseModal() {
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);
  const [amount, setAmount] = useState(0);
  const [descriptiom, setDescription] = useState("");

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
            value={descriptiom}
            onChangeText={setDescription}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            placeholder="Description"
            clearButtonMode="always"
            className="mb-2 text-white bg-[#232324] px-3 py-4 rounded-lg placeholder-[#8F8F91]"
          />
        </View>

        <SafeAreaView className="mt-auto">
          <AppButton
            text="Create"
            variant="primary"
            onPress={() => router.back()}
          />
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}
