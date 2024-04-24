import { Camera, CameraProps } from "expo-camera";
import { Platform, StyleSheet, View, ViewStyle, Text } from "react-native";
import AppButton from "./app-button";

/** Scans a QR code. */
export function Scanner({
  handleBarCodeScanned,
}: {
  handleBarCodeScanned: CameraProps["onBarCodeScanned"];
}) {
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View className="text-center">
        <Text>Requesting camera access</Text>
      </View>
    );
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View className="flex-1 justify-center">
        <Text className="text-center">
          Please grant permission to use your camera.
        </Text>
        <AppButton onPress={requestPermission} text="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.cameraBox}>
      <Camera
        onBarCodeScanned={handleBarCodeScanned}
        style={Platform.select<ViewStyle>({
          ios: StyleSheet.absoluteFillObject,
          android: styles.cameraAndroid,
        })}
        barCodeScannerSettings={{
          barCodeTypes: ["qr"],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cameraBox: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    overflow: "hidden",
  },
  cameraAndroid: {
    position: "absolute",
    width: 400,
    height: 600,
    top: -150,
    left: -20,
  },
});
