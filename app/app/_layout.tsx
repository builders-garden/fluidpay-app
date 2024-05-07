import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="add-money-modal" options={{ headerShown: false }} />
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
        name="specific-request-modal"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="send-modal"
        options={{ presentation: "fullScreenModal", headerShown: false }}
      />
      <Stack.Screen
        name="tx-detail-modal"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="create-expense-modal"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="detail-expense-modal"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="edit-expense-modal"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="select-paid-by-modal"
        options={{
          presentation: "containedTransparentModal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="select-split-type-modal"
        options={{
          presentation: "containedTransparentModal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="group-settings-modal"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile-modal"
        options={{ presentation: "fullScreenModal", headerShown: false }}
      />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen
        name="accounts-modal"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
      <Stack.Screen name="security-privacy" options={{ headerShown: false }} />
      <Stack.Screen
        name="notification-settings"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="create-group" options={{ headerShown: false }} />
      <Stack.Screen name="group" options={{ headerShown: false }} />
      <Stack.Screen
        name="qrcode"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="transactions-modal"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
    </Stack>
  );
}
