import { Modal, Portal } from "react-native-paper";
import { Text, View } from "react-native";
import AppButton from "../app-button";
import Spacer from "../spacer";

import * as SecureStore from "expo-secure-store";
import { useUserStore } from "../../store";
import { useDisconnect } from "wagmi";
import { usePrivy } from "@privy-io/expo";
import { router } from "expo-router";

export default function LogoutModal({
  visible,
  hideModal,
}: {
  visible: boolean;
  hideModal: () => void;
}) {
  const user = useUserStore((state) => state.user);
  const { disconnect } = useDisconnect();
  const { logout } = usePrivy();
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
            onPress={async () => {
              console.log("deleting token");
              await SecureStore.deleteItemAsync(`token-${user?.address}`);
              console.log("logging out");
              await logout();
              console.log("disconnecting");
              await disconnect();
              console.log("replacing router");
              router.replace("/");
            }}
          />
          <Spacer h={16} />
          <AppButton
            text="Cancel"
            variant="primary"
            onPress={() => {
              hideModal();
            }}
          />
        </View>
      </Modal>
    </Portal>
  );
}
