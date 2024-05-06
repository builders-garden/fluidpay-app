import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

export const enableFaceID = async (address: string) => {
  try {
    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login to Plink",
    });

    if (!auth.success) {
      if (auth.error === "user_cancel") {
        return;
      }
      throw new Error(auth.error);
    }

    await SecureStore.setItemAsync(`user-faceid-${address}`, "true");
    return;
  } catch (error) {
    console.log("Error enabling FaceID", error);
    throw new Error(error as any);
  }
};

export const disableFaceID = async (address: string) => {
  try {
    await SecureStore.deleteItemAsync(`user-faceid-${address}`);
    return;
  } catch (error) {
    console.log("Error disabling FaceID", error);
    throw new Error(error as any);
  }
};
