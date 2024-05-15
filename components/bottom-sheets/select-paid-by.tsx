import { useMemo } from "react";
import Avatar from "../../components/avatar";
import { View, Text, Pressable, Dimensions } from "react-native";
import { useUserStore } from "../../store";
import { RadioButton } from "react-native-paper";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useColorScheme } from "nativewind";

const sceenHeight = Dimensions.get("window").height;

type SelectPaidByModalProps = {
  members: any;
  paidById: number;
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  setPaidById: (paidById: number) => void;
  handleClose: () => void;
};

export default function SelectPaidByModal({
  members,
  paidById,
  bottomSheetModalRef,
  setPaidById,
  handleClose,
}: SelectPaidByModalProps) {
  const { colorScheme } = useColorScheme();
  const user = useUserStore((state) => state.user);

  const snapPoints = useMemo(() => ["25%", "50%"], []);

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
          backgroundColor: colorScheme === "dark" ? "#232324" : "#f2f2f2",
        }}
      >
        <BottomSheetView className="bg-white dark:bg-[#232324]">
          <View className="rounded-lg flex flex-col space-y-4 bg-white dark:bg-[#232324] py-4 px-4">
            <Text className="text-2xl text-darkGrey dark:text-white font-bold">
              Paid by
            </Text>
            {members?.map((member: any, index: number) => (
              <Pressable
                key={`${member.id}-${index}`}
                onPress={() => {
                  setPaidById(member.userId);
                  handleClose();
                }}
              >
                <View className="flex flex-row items-center" key={index}>
                  <RadioButton.Android
                    value={member.id}
                    status={
                      paidById === member.userId ? "checked" : "unchecked"
                    }
                    color="#FF238C"
                    uncheckedColor="#8F8F91"
                    onPress={() => {
                      setPaidById(member.userId);
                      handleClose();
                    }}
                  />
                  <Avatar
                    name={member.user.displayName.charAt(0).toUpperCase()}
                    uri={member.user.avatarUrl}
                  />
                  <Text className="text-darkGrey dark:text-white font-semibold text-lg ml-2">
                    {member.user.username === user?.username
                      ? "You"
                      : member.user.username}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
