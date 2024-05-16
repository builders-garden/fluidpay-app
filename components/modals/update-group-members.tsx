import { Modal, Portal } from "react-native-paper";
import { Text, View } from "react-native";
import AppButton from "../app-button";
import Spacer from "../spacer";

import { useState } from "react";

const UpdateGroupMembersModal = ({
  visible,
  hideModal,
  handleUpdate,
}: {
  visible: boolean;
  hideModal: () => void;
  handleUpdate: () => Promise<void>;
}) => {
  const [isUpdatingGroup, setUpdatingGroup] = useState(false);

  const deleteGroup = async () => {
    setUpdatingGroup(true);
    await handleUpdate();
    setUpdatingGroup(false);
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
          <Text className="text-center text-darkGrey dark:text-white italic text-base font-semibold pb-4">
            Note: Deleting members of group can affect expenses splits
          </Text>

          <AppButton
            text="Confirm update"
            variant="primary"
            onPress={deleteGroup}
            disabled={isUpdatingGroup}
            loading={isUpdatingGroup}
          />
          <Spacer h={16} />
          <AppButton
            text="Cancel"
            variant="ghost"
            onPress={() => {
              hideModal();
            }}
            disabled={isUpdatingGroup}
          />
        </View>
      </Modal>
    </Portal>
  );
};

export default UpdateGroupMembersModal;
