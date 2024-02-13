import { View } from "react-native";
import {
  ConnectWallet,
  darkTheme,
  useAddress,
  useConnectionStatus,
} from "@thirdweb-dev/react-native";
import { ActivityIndicator } from "react-native-paper";
import { useEffect } from "react";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firebaseFirestore } from "../firebaseConfig";
import { useUserStore } from "../store";
import { doc, getDoc } from "firebase/firestore";

const theme = darkTheme({
  colors: {
    buttonBackgroundColor: "transparent",
    buttonTextColor: "#667DFF",
    buttonBorderColor: "#667DFF",
  },
});

const Home = () => {
  const connectionStatus = useConnectionStatus();
  const address = useAddress();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    if (connectionStatus === "connected" && address) {
      handleConnection();
    }
  }, [connectionStatus, address]);

  const handleConnection = async () => {
    // await SecureStore.deleteItemAsync(`onboarding-${address}`);
    const onboarding = await SecureStore.getItemAsync(`onboarding-${address}`);
    if (!onboarding) {
      return router.push("/onboarding");
    }
    const password = await SecureStore.getItemAsync(`password-${address}`);
    const email = `${address}@crumina.app`;
    await signInWithEmailAndPassword(firebaseAuth, email, password!);
    // get user and set it in the store
    const document = await getDoc(
      doc(firebaseFirestore, "users", firebaseAuth.currentUser!.uid)
    );
    if (document.exists()) {
      const { address, createdAt, username, rounding } = document.data();
      const user = {
        address,
        createdAt,
        username,
        rounding,
      };
      setUser(user);
      router.push("/app/home");
    } else {
      router.push("/onboarding");
    }
    router.push("/app/home");
  };

  return (
    <View className="flex-1 justify-center items-center space-y-3">
      {/* <Image className="h-32 w-32" source={require("../images/ghost.png")} /> */}

      {/* <Text className="text-white text-4xl font-bold mb-4">Ghost</Text> */}
      {connectionStatus === "connecting" && (
        <ActivityIndicator animating={true} color={"#667DFF"} />
      )}
      {connectionStatus === "disconnected" && (
        <ConnectWallet
          modalTitle="Crumina"
          buttonTitle="Login"
          modalTitleIconUrl=""
          theme={theme}
        />
      )}
    </View>
  );
};

export default Home;
