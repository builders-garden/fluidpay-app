import { Link, router } from "expo-router";
import { Text, View } from "react-native";
import { Appbar } from "react-native-paper";
import { useUserStore } from "../../store";
import AppButton from "../../components/app-button";
import { ArrowLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Share } from "react-native";
import { useState } from "react";
import { AmountChooser } from "../../components/amount-chooser";
import { useColorScheme } from "nativewind";
import DismissKeyboardHOC from "../../components/hocs/dismiss-keyboard";

function SpecificRequestModal() {
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);
  const [amount, setAmount] = useState(0);
  const { colorScheme } = useColorScheme();

  if (!user) {
    return <View className="flex-1 bg-white dark:bg-black" />;
  }

  return (
    <SafeAreaView
      className="flex-1 flex-col bg-white dark:bg-darkGrey"
      edges={{ top: "off" }}
    >
      {!isPresented && <Link href="../">Dismiss</Link>}
      <Appbar.Header
        elevated={false}
        statusBarHeight={0}
        className="bg-white dark:bg-darkGrey text-darkGrey dark:text-white"
      >
        <Appbar.Action
          icon={() => (
            <ArrowLeft
              size={24}
              color={colorScheme === "dark" ? "#FFF" : "#161618"}
            />
          )}
          animated={false}
          onPress={() => {
            router.back();
          }}
          color={colorScheme === "dark" ? "#FFF" : "#161618"}
          size={20}
        />
        <Appbar.Content
          title={"Request via link"}
          color={colorScheme === "dark" ? "#FFF" : "#161618"}
          titleStyle={{
            fontWeight: "600",
            color: colorScheme === "dark" ? "#FAFBFA" : "#161618",
            fontSize: 16,
          }}
        />
      </Appbar.Header>

      <View className="flex flex-col items-center px-4 space-y-4 h-full">
        <AmountChooser
          dollars={amount}
          onSetDollars={setAmount}
          showAmountAvailable
          autoFocus={true}
          lagAutoFocus={false}
        />

        <Text className="text-mutedGrey font-semibold">No fees</Text>

        <View className="flex flex-grow" />
        <SafeAreaView className="flex flex-col w-full mb-24">
          <View className="mb-4">
            <AppButton
              text="Create link"
              variant={amount === 0 ? "disabled" : "primary"}
              disabled={amount === 0}
              onPress={async () => {
                await Share.share({
                  message: `gm! join me on fluidpay using this link: https://plink.finance/u/${user?.username}/request/${amount}`,
                });
              }}
            />
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaView>
  );
}

export default DismissKeyboardHOC(SpecificRequestModal, false);
