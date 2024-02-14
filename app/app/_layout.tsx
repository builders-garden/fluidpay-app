import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="add-money-modal"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="borrow-modal"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="export-private-key-modal"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="details-modal"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="request-modal"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="pocket-info-modal"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="send-modal"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="vault-modal"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="aave-lending-modal"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="tx-detail-modal"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="profile-modal"
        options={{ presentation: "fullScreenModal", headerShown: false }}
      />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="security-privacy" options={{ headerShown: false }} />
      <Stack.Screen
        name="notification-settings"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="qrcode" options={{ headerShown: false }} />
    </Stack>
  );
}