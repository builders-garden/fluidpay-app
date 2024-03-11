import {
  ThirdwebProvider,
  embeddedWallet,
  smartWallet,
} from "@thirdweb-dev/react-native";
import { Slot } from "expo-router";
import { LogBox, View } from "react-native";
import { PaperProvider } from "react-native-paper";
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
  ToastConfig,
} from "react-native-toast-message";
//@ts-ignore
import Icon from "react-native-vector-icons/FontAwesome";
import { base, sepolia } from "../constants/chains";

LogBox.ignoreLogs([new RegExp("TypeError:.*")]);

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

export default function AppLayout() {
  //   const [fontsLoaded] = useFonts({});
  return (
    <>
      <PaperProvider
        settings={{
          icon: (props) => <Icon {...props} />,
        }}
      >
        <ThirdwebProvider
          activeChain={sepolia.chainId}
          clientId={process.env.EXPO_PUBLIC_TW_CLIENT_ID}
          supportedChains={[base, sepolia]}
          supportedWallets={[
            smartWallet(
              embeddedWallet({
                auth: {
                  options: ["email", "google", "apple"],
                  redirectUrl: "crumina://",
                },
              }),
              {
                factoryAddress: process.env
                  .EXPO_PUBLIC_TW_FACTORY_ADDRESS as string,
                gasless: true,
              }
            ),
          ]}
        >
          <View className="bg-black flex-1">
            <Slot />
          </View>
        </ThirdwebProvider>
      </PaperProvider>
      <Toast
        config={toastConfig}
        position="top"
        topOffset={60}
        visibilityTime={2500}
      />
    </>
  );
}
