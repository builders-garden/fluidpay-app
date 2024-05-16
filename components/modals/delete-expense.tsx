import { Modal, Portal } from "react-native-paper";
import { Text, View } from "react-native";
import AppButton from "../app-button";
import Spacer from "../spacer";

import { useState } from "react";

export default function DeleteExpenseModal({
  visible,
  hideModal,
  handleDelete,
}: {
  visible: boolean;
  hideModal: () => void;
  handleDelete: () => Promise<void>;
}) {
  const [isDeletingExpense, setDeletingExpense] = useState(false);

  const deleteExpense = async () => {
    setDeletingExpense(true);
    await handleDelete();
    setDeletingExpense(false);
  };

  return (
    <Portal>
      <Modal visible={visible} dismissable={false} onDismiss={hideModal}>
        <View className="bg-white dark:bg-black rounded-lg px-4 py-5 mx-4">
          <Text className="text-center text-darkGrey dark:text-white text-lg font-semibold pb-4">
            Are you sure you want to delete this expense?
          </Text>

          <AppButton
            text="Confirm delete"
            variant="primary"
            onPress={deleteExpense}
            disabled={isDeletingExpense}
            loading={isDeletingExpense}
          />
          <Spacer h={16} />
          <AppButton
            text="Cancel"
            variant="ghost"
            onPress={() => {
              hideModal();
            }}
            disabled={isDeletingExpense}
          />
        </View>
      </Modal>
    </Portal>
  );
}
