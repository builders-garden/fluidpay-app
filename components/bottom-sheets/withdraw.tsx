import { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Pressable,
} from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";

import AppButton from "../app-button";
import { CircleX } from "lucide-react-native";
import { useColorScheme } from "nativewind";

const sceenHeight = Dimensions.get("window").height;

type WithdrawProps = {
  cancelTransaction: () => void;
  isLoadingTransfer: boolean;
  bottomSheetRef: React.RefObject<BottomSheet>;
};

const Withdraw = ({
  isLoadingTransfer,
  bottomSheetRef,
  cancelTransaction,
}: WithdrawProps) => {
  const { colorScheme } = useColorScheme();
  const [address, setAddress] = useState("");

  const addressRef = useRef<TextInput>(null);

  const snapPoints = useMemo(() => ["40%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const sendTokens = () => {};

  // renders
  return (
    <View
      className="flex-1 p-6 bg-white/70 dark:bg-black/70 absolute w-full bottom-0 z-10"
      style={{ height: sceenHeight }}
    >
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={0}
        enablePanDownToClose={true}
        onClose={cancelTransaction}
        onChange={handleSheetChanges}
        handleIndicatorStyle={{
          backgroundColor: "#232324",
          width: 165,
          height: 6,
          top: 5,
        }}
        backgroundStyle={{
          backgroundColor: colorScheme === "dark" ? "#161618" : "#fff",
        }}
      >
        <BottomSheetView
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <View className="w-full flex-1 pb-10">
            <View className="w-full flex-1 pb-10 px-4">
              <Text className="text-darkGrey dark:text-white font-semibold text-2xl text-center pt-5">
                Withdraw
              </Text>

              <Text className="pt-3 pb-[18px] text-base text-center text-mutedGrey">
                Enter receiver address where to send money
              </Text>
            </View>

            <View className="mt-auto px-4 relative">
              <TextInput
                className={`flex-grow text-base h-[62px] bg-white dark:bg-[#232324] rounded-2xl p-2.5 pl-5 text-darkGrey dark:text-white tabular-nums`}
                selectTextOnFocus={false}
                placeholderTextColor={"#8F8F91"}
                placeholder="Address"
                numberOfLines={1}
                ref={addressRef}
                value={address}
                autoCorrect={false}
                autoComplete="off"
                autoFocus
                onChangeText={setAddress}
              />
              <Pressable
                onPress={() => setAddress("")}
                className="absolute right-7 top-[30%]"
              >
                <CircleX color="#8F8F91" />
              </Pressable>
            </View>

            <SafeAreaView className="mt-6">
              {isLoadingTransfer ? (
                <View className="flex flex-col space-y-4">
                  <ActivityIndicator animating={true} color={"#667DFF"} />
                  <Text className="text-primary text-center mt-4">
                    Confirming...
                  </Text>
                </View>
              ) : (
                <View className="px-4">
                  <AppButton
                    text={"Confirm"}
                    onPress={() => sendTokens()}
                    variant={"primary"}
                  />
                </View>
              )}
            </SafeAreaView>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default Withdraw;
