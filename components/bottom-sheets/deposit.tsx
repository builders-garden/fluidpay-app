import { useCallback, useMemo, useState } from "react";
import { View, Text, Dimensions, Pressable } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import * as Clipboard from "expo-clipboard";
import { Check, Copy } from "lucide-react-native";
import { DBUser } from "../../store/interfaces";

const sceenHeight = Dimensions.get("window").height;

type DepositProps = {
  cancelTransaction: () => void;
  user: DBUser | undefined;
  bottomSheetRef: React.RefObject<BottomSheet>;
};

const Deposit = ({ user, bottomSheetRef, cancelTransaction }: DepositProps) => {
  const [copied, setCopied] = useState(false);
  const snapPoints = useMemo(() => ["30%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  // renders
  return (
    <View
      className="flex-1 p-6 bg-black/70 absolute w-full bottom-0 z-10"
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
          backgroundColor: "#161618",
        }}
      >
        <BottomSheetView
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <View className="w-full flex-1 pb-10 px-4">
            <Text className="text-white font-semibold text-2xl text-center pt-5">
              Deposit
            </Text>

            <Text className="pt-3 pb-[18px] text-base text-center text-mutedGrey">
              Send <Text className="font-semibold text-primary">USDC</Text> on{" "}
              <Text className="font-semibold text-primary">Base</Text> to your
              address below.
            </Text>

            <View className="bg-[#232324] rounded-[10px] flex flex-row justify-between items-center px-4 py-3">
              <Text className="text-[#8F8F91] text-xs text-ellipsis">
                {user?.smartAccountAddress!}
              </Text>
              <Pressable
                onPress={async () => {
                  await Clipboard.setStringAsync(user!.smartAccountAddress);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 1500);
                }}
              >
                {copied ? (
                  <Check size={16} color={"green"} />
                ) : (
                  <Copy size={16} color={"#8F8F91"} />
                )}
              </Pressable>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default Deposit;
