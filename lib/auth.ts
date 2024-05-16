import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

export const BiometricType = LocalAuthentication.AuthenticationType;

export const localAuthType = async () => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) {
    return [0];
  }
  return await LocalAuthentication.supportedAuthenticationTypesAsync();
};

export const getAuthType = async () => {
  const authType = await localAuthType();
  if (authType.includes(BiometricType.FACIAL_RECOGNITION)) {
    return "Face ID";
  } else if (authType.includes(BiometricType.FINGERPRINT)) {
    return "Fingerprint";
  } else if (authType.includes(BiometricType.IRIS)) {
    return "Iris";
  } else {
    return null;
  }
};

export const enableFaceID = async (address: string) => {
  try {
    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login to Plink",
    });

    if (!auth.success) {
      if (auth.error === "user_cancel") {
        return "user_cancel";
      }
      throw new Error(auth.error);
    }

    await SecureStore.setItemAsync(`user-faceid-${address}`, "true");
    return "success";
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
