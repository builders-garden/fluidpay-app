import { Modal, Portal } from "react-native-paper";
import { Text, View } from "react-native";
import AppButton from "../app-button";
import Spacer from "../spacer";

import { useState } from "react";

export default function DeleteGroupModal({
  visible,
  hideModal,
  handleDelete,
}: {
  visible: boolean;
  hideModal: () => void;
  handleDelete: () => Promise<void>;
}) {
  const [isDeletingGroup, setDeletingGroup] = useState(false);

  const deleteGroup = async () => {
    setDeletingGroup(true);
    await handleDelete();
    setDeletingGroup(false);
  };

  return (
    <Portal>
      <Modal
        style={{ zIndex: 1000 }}
        visible={visible}
        dismissable={false}
        onDismiss={hideModal}
      >
        <View className="bg-white dark:bg-black rounded-lg px-4 py-5 mx-4">
          <Text className="text-center text-darkGrey dark:text-white text-lg font-semibold pb-4">
            Are you sure you want to delete this group?
          </Text>

          <AppButton
            text="Confirm delete"
            variant="primary"
            onPress={deleteGroup}
            disabled={isDeletingGroup}
            loading={isDeletingGroup}
          />
          <Spacer h={16} />
          <AppButton
            text="Cancel"
            variant="ghost"
            onPress={() => {
              hideModal();
            }}
            disabled={isDeletingGroup}
          />
        </View>
      </Modal>
    </Portal>
  );
}
