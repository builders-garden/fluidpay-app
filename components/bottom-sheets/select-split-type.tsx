import { useMemo } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { DollarSign, Percent } from "lucide-react-native";
import { COLORS } from "../../constants/colors";
import { useColorScheme } from "nativewind";

export enum SplitType {
  PERCENTAGE = "percentage",
  AMOUNT = "amount",
}

const sceenHeight = Dimensions.get("window").height;

export default function SelectSplitTypeModal({
  selectedSplitType,
  bottomSheetModalRef,
  setSplitType,
  handleClose,
}: {
  selectedSplitType: SplitType;
  bottomSheetModalRef: any;
  setSplitType: (splitType: SplitType) => void;
  handleClose: () => void;
}) {
  const { colorScheme } = useColorScheme();
  const splitTypes = useMemo(
    () => [SplitType.PERCENTAGE, SplitType.AMOUNT],
    []
  );
  // variables
  const snapPoints = useMemo(() => ["25%", "40%"], []);

  return (
    <View
      className="flex-1 p-6 bg-black/70 absolute w-full bottom-0 z-10"
      style={{ height: sceenHeight }}
    >
      <BottomSheet
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={handleClose}
        handleIndicatorStyle={{
          backgroundColor: "#161618",
          width: 165,
          height: 6,
          top: 5,
        }}
        backgroundStyle={{
          backgroundColor: colorScheme === "dark" ? "#232324" : "#fff",
        }}
      >
        <BottomSheetView className="bg-absoluteWhite dark:bg-[#232324]">
          <View className="rounded-lg flex flex-col space-y-4 bg-inputGrey p-4">
            <Text className="text-2xl text-darkGrey dark:text-white font-bold">
              Split options
            </Text>
            <View className="flex flex-col space-y-2 bg-white dark:bg-[#343435] rounded-lg p-2">
              {splitTypes.map((splitType, index) => (
                <Pressable
                  key={`${splitType}-${index}`}
                  onPress={() => {
                    setSplitType(splitType);
                    handleClose();
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
      </BottomSheet>
    </View>
  );
}
