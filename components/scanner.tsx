import { BarCodeScannedCallback, BarCodeScanner } from "expo-barcode-scanner";
import { ReactNode, useEffect, useState } from "react";
import { Platform, StyleSheet, View, ViewStyle, Text } from "react-native";

/** Scans a QR code. */
export function Scanner({
  handleBarCodeScanned,
}: {
  handleBarCodeScanned: BarCodeScannedCallback;
}) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    BarCodeScanner?.requestPermissionsAsync()
      .then(({ status }) => setHasPermission(status === "granted"))
      .catch((e) => console.error(e));
  }, []);

  let body: ReactNode;
  if (hasPermission === null) {
    body = (
      <View className="text-center">
        <Text>Requesting camera access</Text>
      </View>
    );
  } else if (hasPermission === false) {
    body = (
      <View className="text-center">
        <Text>Allow camera access in Settings</Text>
      </View>
    );
  } else {
    body = (
      <View style={styles.cameraBox}>
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={Platform.select<ViewStyle>({
            ios: StyleSheet.absoluteFillObject,
            android: styles.cameraAndroid,
          })}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        />
      </View>
    );
  }

  return body;
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
