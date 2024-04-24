import analytics from "@react-native-firebase/analytics";
import { Stack, usePathname } from "expo-router";
import { useEffect } from "react";

export default function AppLayout() {
  const pathname = usePathname();

  useEffect(() => {
    const logScreenView = async () => {
      try {
        await analytics().logScreenView({
          screen_name: pathname,
          screen_class: pathname,
        });
      } catch (err: any) {
        console.error("ANALYTICS_FAILED", err);
      }
    };
    logScreenView();
  }, [pathname]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="add-money-modal"
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
        name="specific-request-modal"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="send-modal"
        options={{ presentation: "modal", headerShown: false }}
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
