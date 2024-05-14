import { Pressable, View, Text, Image } from "react-native";
import { Link, router } from "expo-router";
import { Appbar } from "react-native-paper";
import React, { useRef } from "react";
import { useUserStore } from "../../store";
import { ArrowLeft, SquareArrowOutUpRight } from "lucide-react-native";
import { Address } from "viem";
import { Linking } from "react-native";
import { PressableProps } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Withdraw from "../../components/bottom-sheets/withdraw";
import BottomSheet from "@gorhom/bottom-sheet";
import Deposit from "../../components/bottom-sheets/deposit";
import { useColorScheme } from "nativewind";
import DismissKeyboardHOC from "../../components/hocs/dismiss-keyboard";

function AddMoneyModal() {
  const isPresented = router.canGoBack();
  const user = useUserStore((state) => state.user);
  const { colorScheme } = useColorScheme();

  const [openedBottomSheet, setBottomSheet] = React.useState<
    "deposit" | "withdraw" | ""
  >("");

  const bottomSheetRef = useRef<BottomSheet>(null);

  const openBottomSheet = (sheet: "deposit" | "withdraw") =>
    setBottomSheet(sheet);

  const closeBottomSheet = () => setBottomSheet("");

  const depositOptions = getDepositOptions(user!.smartAccountAddress);

  return (
    <>
      <View className="flex-1 flex-col bg-absoluteWhite dark:bg-black">
        {!isPresented && <Link href="../">Dismiss</Link>}
        <Appbar.Header
          elevated={false}
          statusBarHeight={48}
          className="bg-absoluteWhite dark:bg-black text-darkGrey dark:text-white"
        >
          <Appbar.Action
            icon={() => (
              <ArrowLeft
                size={24}
                color={colorScheme === "dark" ? "#FFF" : "#161618"}
              />
            )}
            onPress={() => router.back()}
            color={colorScheme === "dark" ? "#FFF" : "#161618"}
            size={20}
            animated={false}
          />
          <Appbar.Content
            title=""
            color={colorScheme === "dark" ? "#FFF" : "#161618"}
            titleStyle={{ fontWeight: "bold" }}
          />
        </Appbar.Header>
        <View className="flex px-4">
          <Text className="text-4xl text-darkGrey dark:text-white font-semibold">
            Add money
          </Text>
          <Text className="text-mutedGrey mt-1.5">
            Refund your account using your preferred method.
          </Text>

          <View className="">
            {depositOptions.map((option) => (
              <DepositOption
                key={option.title}
                option={option}
                onPress={() =>
                  option.externalLink
                    ? Linking.openURL(option.externalLink)
                    : openBottomSheet(option.link as "deposit" | "withdraw")
                }
                isExternalLink={!!option.externalLink}
              />
            ))}
          </View>
        </View>
      </View>

      <GestureHandlerRootView>
        {openedBottomSheet === "withdraw" && (
          <Withdraw
            isLoadingTransfer={false}
            cancelTransaction={() => closeBottomSheet()}
            bottomSheetRef={bottomSheetRef}
          />
        )}
        {openedBottomSheet === "deposit" && (
          <Deposit
            user={user}
            cancelTransaction={() => closeBottomSheet()}
            bottomSheetRef={bottomSheetRef}
          />
        )}
      </GestureHandlerRootView>
    </>
  );
}

const DepositOption = ({
  option,
  onPress,
  isExternalLink,
}: {
  option: ReturnType<typeof getDepositOptions>[number];
  onPress: PressableProps["onPress"];
  isExternalLink: boolean;
}) => {
  const bgColor = isExternalLink
    ? "bg-white dark:bg-darkGrey"
    : option.variant === "ghost"
      ? "bg-[#FF5D8F4D]"
      : "bg-primary";

  return (
    <Pressable
      className={`px-2.5 py-3 rounded-[20px] flex-row justify-between items-center mt-5 ${bgColor}`}
      onPress={onPress}
    >
      <View className="flex-row items-center gap-3.5">
        <Image
          source={option.imagePath}
          className="rounded-full w-[50px] h-[50px]"
        />
        <Text
          className={`text-lg font-medium ${option.variant === "ghost" ? "text-primary" : "text-darkGrey dark:text-white"}`}
        >
          {option.title}
        </Text>
      </View>
      {isExternalLink && (
        <SquareArrowOutUpRight color="white" width={18} height={18} />
      )}
    </Pressable>
  );
};

const getDepositOptions = (address: Address) => [
  // {
  //   imagePath: require("../../images/coinbase.png"),
  //   title: "Deposit from Coinbase",
  //   externalLink: `https://pay.coinbase.com/buy/select-asset?appId=2be3ccd9-6ee4-4dba-aba8-d4b458fe476d&defaultExperience=send&destinationWallets=%5B%7B%22address%22%3A%22${address}%22%2C%22assets%22%3A%5B%22USDC%22%5D%2C%22supportedNetworks%22%3A%5B%22base%22%5D%7D%5D`,
  //   variant: "default",
  // },
  // {
  //   imagePath: require("../../images/usdc.png"),
  //   title: "Buy USDC",
  //   externalLink: `https://app.ramp.network/?hostApiKey=<plinkApiKey>&hostAppName=Fluidpay&hostLogoUrl=https://fluidpay.xyz/assets/icon-ramp.png&swapAsset=BASE_USDC&userAddress=${address}&finalUrl=fluidpay://`,
  //   variant: "default",
  // },
  {
    imagePath: require("../../images/base.png"),
    title: "Bridge USDC to Base",
    externalLink: `https://www.relay.link/bridge/base/?currency=usdc&toAddress=${address}&lockToChain=true&lockCurrency=true&header=plink`,
    variant: "default",
  },
  {
    imagePath: require("../../images/deposit.png"),
    title: "Deposit to your address",
    link: "deposit",
    variant: "default",
  },
  {
    imagePath: require("../../images/withdraw.png"),
    title: "Withdraw",
    link: "withdraw",
    variant: "ghost",
  },
];

export default DismissKeyboardHOC(AddMoneyModal, false);
