import { Link, router } from "expo-router";
import { KeyboardAvoidingView, Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import { useUserStore } from "../../store";
import AppButton from "../../components/app-button";
import { ArrowLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Share } from "react-native";
import { useState } from "react";
import { AmountChooser } from "../../components/amount-chooser";

export default function SpecificRequestModal() {
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);
  const [amount, setAmount] = useState(0);

  if (!user) {
    return <View className="flex-1 bg-black" />;
  }

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
          size={20}
        />
        <Appbar.Content
          title={"Request via link"}
          color="#fff"
          titleStyle={{ fontWeight: "600", color: "#FAFBFA", fontSize: 16 }}
        />
      </Appbar.Header>
      <KeyboardAvoidingView className="w-full" behavior="padding">
        <View className="flex flex-col items-center px-4 space-y-4 h-full">
          <AmountChooser
            dollars={amount}
            onSetDollars={setAmount}
            showAmountAvailable
            autoFocus={true}
            lagAutoFocus={false}
          />

          <Text className="text-[#8F8F91] font-semibold">No fees</Text>

          <View className="flex flex-grow" />
          <SafeAreaView className="flex flex-col w-full mb-24">
            <View className="mb-4">
              <AppButton
                text="Create link"
                variant="primary"
                onPress={async () => {
                  await Share.share({
                    message: `gm! join me on fluidpay using this link: https://plink.finance/u/${user?.username}/request/${amount}`,
                  });
                }}
              />
            </View>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
