import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

export const enableFaceID = async () => {
  try {
    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login to Plink",
    });

    if (!auth.success) {
      throw new Error(auth.error);
    }

    await SecureStore.setItemAsync("user-faceid", "true");
    return;
  } catch (error) {
    console.log("Error enabling FaceID", error);
    throw new Error(JSON.stringify(error));
  }
};

export const disableFaceID = async () => {
  try {
    await SecureStore.deleteItemAsync("user-faceid");
    return;
  } catch (error) {
    console.log("Error disabling FaceID", error);
    throw new Error(JSON.stringify(error));
  }
};
