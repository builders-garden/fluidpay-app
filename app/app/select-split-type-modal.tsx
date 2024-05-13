import { useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { useUserStore } from "../../store";
import { RadioButton } from "react-native-paper";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { DollarSign, Percent } from "lucide-react-native";
import { COLORS } from "../../constants/colors";

export enum SplitType {
  PERCENTAGE = "percentage",
  AMOUNT = "amount",
}

export default function SelectSplitTypeModal({
  selectedSplitType,
  bottomSheetModalRef,
  setSplitType,
}: {
  selectedSplitType: SplitType;
  bottomSheetModalRef: any;
  setSplitType: (splitType: SplitType) => void;
}) {
  const splitTypes = useMemo(
    () => [SplitType.PERCENTAGE, SplitType.AMOUNT],
    []
  );
  // variables
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  return (
    <BottomSheetModalProvider>
      <View>
        <BottomSheetModal
          backgroundStyle={{ backgroundColor: "#232324" }}
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
        >
          <BottomSheetView className="bg-white dark:bg-[#232324]">
            <View className="rounded-lg flex flex-col space-y-4 bg-inputGrey p-4">
              <Text className="text-2xl text-darkGrey dark:text-white font-bold">
                Split options
              </Text>
              <View className="flex flex-col space-y-2 bg-[#343435] rounded-lg p-2">
                {splitTypes.map((splitType, index) => (
                  <Pressable
                    key={`${splitType}-${index}`}
                    onPress={() => {
                      setSplitType(splitType);
                      bottomSheetModalRef.current?.dismiss();
                    }}
                  >
                    <View
                      className={`rounded-lg p-4 flex flex-row items-center ${splitType === selectedSplitType ? `bg-primary/10` : ""}`}
                      key={index}
                    >
                      <View className="rounded-full bg-primary/30 p-2">
                        {splitType === SplitType.PERCENTAGE ? (
                          <Percent size={24} color={`${COLORS.primary}`} />
                        ) : (
                          <DollarSign size={24} color={`${COLORS.primary}`} />
                        )}
                      </View>
                      <Text className="text-darkGrey dark:text-white font-semibold text-lg ml-2">
                        {splitType}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
}
