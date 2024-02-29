import { Modal, Portal } from "react-native-paper";
import { Text, View } from "react-native";
import AppButton from "../app-button";
import { useDisconnect } from "@thirdweb-dev/react-native";
import Spacer from "../spacer";

import * as SecureStore from "expo-secure-store";
import { useUserStore } from "../../store";

export default function LogoutModal({
  visible,
  hideModal,
}: {
  visible: boolean;
  hideModal: () => void;
}) {
  const user = useUserStore((state) => state.user);
  const disconnect = useDisconnect();
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
              await SecureStore.deleteItemAsync(`token-${user?.address}`)
              await disconnect();
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
