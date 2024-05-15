import { useLocalSearchParams } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Avatar from "../../components/avatar";
import { View, Text, ScrollView, Pressable } from "react-native";
import { useUserStore } from "../../store";
import { Checkbox, RadioButton } from "react-native-paper";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

export default function SelectPaidByModal({
  members,
  paidById,
  bottomSheetModalRef,
  handleSheetChanges,
  setPaidById,
}: any) {
  const user = useUserStore((state) => state.user);
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
          onChange={handleSheetChanges}
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
                    bottomSheetModalRef.current?.dismiss();
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
                        bottomSheetModalRef.current?.dismiss();
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
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
}
