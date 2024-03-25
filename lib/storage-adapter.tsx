import * as SecureStore from "expo-secure-store";

import type { Storage } from "@privy-io/js-sdk-core";

// Instead of always requiring the device to ALWYAS be unlocked before accessing storage,
// this adapter allows access if the device has been unlocked ONCE by the user.
export const MyPermissiveSecureStorageAdapter: Storage = {
  get(key) {
    return SecureStore.getItemAsync(key, {
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
    });
  },
  put(key, val) {
    return SecureStore.setItemAsync(key, val as string, {
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
    });
  },
  del(key) {
    return SecureStore.deleteItemAsync(key, {
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
    });
  },
  getKeys: async () => [],
};
