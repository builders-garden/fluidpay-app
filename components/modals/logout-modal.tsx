import { Modal, Portal } from "react-native-paper";
import { Text, View } from "react-native";
import AppButton from "../app-button";
import Spacer from "../spacer";

import * as SecureStore from "expo-secure-store";
import { useGroupsStore, useUserStore } from "../../store";
import { useDisconnect } from "wagmi";
import { usePrivy } from "@privy-io/expo";
import { router } from "expo-router";
import { useState } from "react";

export default function LogoutModal({
  visible,
  hideModal,
}: {
  visible: boolean;
  hideModal: () => void;
}) {
  const user = useUserStore((state) => state.user);
  const setFetched = useGroupsStore((state) => state.setFetched);
  const setUser = useUserStore((state) => state.setUser);
  const { disconnect } = useDisconnect();
  const { logout } = usePrivy();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await SecureStore.deleteItemAsync(`token-${user?.address}`);
      await logout();
      disconnect();
      setIsLoggingOut(false);
      setUser(undefined);
      setFetched(false);
      router.replace("/");
    } catch (error) {
      console.error("Error logging out", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={hideModal}>
        <View className="bg-black rounded-lg p-4 mx-4">
          <Text className="text-center text-white">
            Are you sure you want to logout?
          </Text>
          <Text className="text-center text-white mb-4">
            You will need to login again if confirmed.
          </Text>
          <AppButton
            text="Confirm logout"
            variant="ghost"
            onPress={handleLogout}
            disabled={isLoggingOut}
          />
          <Spacer h={16} />
          <AppButton
            text="Cancel"
            variant="primary"
            onPress={() => {
              hideModal();
            }}
            disabled={isLoggingOut}
          />
        </View>
      </Modal>
    </Portal>
  );
}
