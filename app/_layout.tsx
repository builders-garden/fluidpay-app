import { Slot, useNavigationContainerRef } from "expo-router";
import { LogBox, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import * as Linking from "expo-linking";
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
  ToastConfig,
} from "react-native-toast-message";
//@ts-ignore
import Icon from "react-native-vector-icons/FontAwesome";
import { PostHogProvider } from "posthog-react-native";
// Import the PrivyProvider
import { PrivyProvider } from "@privy-io/expo";
import { PrivyWagmiProvider } from "@buildersgarden/privy-wagmi-provider";
import { QueryClient } from "@tanstack/react-query";
import { createConfig } from "wagmi";
import { http } from "viem";
import { base, sepolia } from "viem/chains";
import { MyPermissiveSecureStorageAdapter } from "../lib/storage-adapter";
import { useEffect } from "react";
import { handleDeepLinks } from "../lib/deeplinks";
import "react-native-gesture-handler";
import { isRunningInExpoGo } from "expo";
import * as Sentry from "@sentry/react-native";

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: false,
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
      enableNativeFramesTracking: !isRunningInExpoGo(),
    }),
  ],
});

LogBox.ignoreLogs([new RegExp("TypeError:.*")]);

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [sepolia, base],
  transports: {
    [sepolia.id]: http(),
    [base.id]: http(),
  },
});
const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "green",
        backgroundColor: "#21202E",
      }}
      text1Style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
      text2Style={{ color: "white" }}
    />
  ),
  info: (props) => (
    <InfoToast
      {...props}
      style={{ borderLeftColor: "blue", backgroundColor: "#21202E" }}
      text1Style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
      text2Style={{ color: "white" }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "red", backgroundColor: "#21202E" }}
      text1Style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
      text2Style={{ color: "#8F8F91" }}
    />
  ),
};

function AppLayout() {
  const url = Linking.useURL();

  useEffect(() => {
    if (url) {
      handleDeepLinks(url);
    }
  }, [url]);

  // Capture the NavigationContainer ref and register it with the instrumentation.
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    <>
      {/* <PostHogProvider
        apiKey={process.env.EXPO_PUBLIC_POSTHOG_API_KEY!}
        options={{
          host: process.env.EXPO_PUBLIC_POSTHOG_HOST,
        }}
      > */}
        <PaperProvider
          settings={{
            icon: (props) => <Icon {...props} />,
          }}
        >
          <PrivyProvider
            appId={process.env.EXPO_PUBLIC_PRIVY_APP_ID!}
            storage={MyPermissiveSecureStorageAdapter}
            supportedChains={[sepolia, base]}
          >
            <PrivyWagmiProvider queryClient={queryClient} config={wagmiConfig}>
              <View className="bg-black flex-1">
                <Slot />
              </View>
            </PrivyWagmiProvider>
          </PrivyProvider>
        </PaperProvider>
      {/* </PostHogProvider> */}
      <Toast
        config={toastConfig}
        position="top"
        topOffset={60}
        visibilityTime={2500}
      />
    </>
  );
}

export default Sentry.wrap(AppLayout);
