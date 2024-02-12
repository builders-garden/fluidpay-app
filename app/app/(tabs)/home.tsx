import { useConnectedWallet } from "@thirdweb-dev/react-native";
import { Link, Redirect } from "expo-router";
import { SafeAreaView, View, Text } from "react-native";
import { IconButton } from "react-native-paper";
import Avatar from "../../../components/avatar";
import CircularButton from "../../../components/circular-button";
import { router } from "expo-router";
import { useUserStore } from "../../../store";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Home() {
  const signer = useConnectedWallet();
  // const [refreshing, setRefreshing] = React.useState(false);
  const user = useUserStore((state) => state.user);
  // const { contract } = useContract(GHO_SEPOLIA_ADDRESS);

  // const { data: balanceData = BigNumber.from(0), refetch: balanceRefetch } =
  //   useContractRead(contract, "balanceOf", [user?.address]);
  // const transactions = useTransactionsStore((state) => state.transactions);
  // const setTransactions = useTransactionsStore(
  //   (state) => state.setTransactions
  // );
  // const balance = (balanceData / 10 ** 18).toFixed(2);

  // const navigation = useNavigation();

  // const onRefresh = async () => {
  //   setRefreshing(true);
  //   setTransactions([]);
  //   try {
  //     await Promise.all([balanceRefetch(), fetchTransactions()]);
  //     Toast.show({
  //       type: "success",
  //       text1: "Refreshed!",
  //       text2: "Your balance and transactions have been refreshed.",
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setRefreshing(false);
  //   }
  // };

  // React.useEffect(() => {
  //   // fetchTransactions();

  //   const refresh = async () => {
  //     await Promise.all([balanceRefetch(), fetchTransactions()]);
  //   };

  //   navigation.addListener("focus", refresh);

  //   return () => {
  //     navigation.removeListener("focus", refresh);
  //   };
  // }, []);

  // const fetchTransactions = async () => {
  //   setRefreshing(true);
  //   try {
  //     const toQ = query(
  //       collection(firebaseFirestore, "transactions"),
  //       where("to", "==", user?.address)
  //     );
  //     const fromQ = query(
  //       collection(firebaseFirestore, "transactions"),
  //       where("from", "==", user?.address)
  //     );

  //     const [toSnapshot, fromSnapshot] = await Promise.all([
  //       getDocs(toQ),
  //       getDocs(fromQ),
  //     ]);

  //     const toTransactions = toSnapshot.docs.map((doc) => {
  //       return { ...doc.data(), id: doc.id } as unknown as DBTransaction;
  //     });
  //     const fromTransactions = fromSnapshot.docs.map((doc) => {
  //       return { ...doc.data(), id: doc.id } as unknown as DBTransaction;
  //     });

  //     const transactions = [...toTransactions, ...fromTransactions].sort(
  //       (a, b) => {
  //         return (
  //           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //         );
  //       }
  //     );
  //     setTransactions(transactions);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setRefreshing(false);
  //   }
  // };

  if (!signer || !user) {
    return <Redirect href={"/"} />;
  }

  return (
    <SafeAreaView className="bg-[#201F2D] flex-1">
      <View className="flex flex-col px-4 mt-2 bg-[#201F2D]">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center space-x-4 pl-2">
            <Link href={"./settings"}>
              <Avatar name={user.username.charAt(0).toUpperCase()} />
            </Link>
          </View>
          <View className="flex flex-row items-center space-x-0">
            <IconButton
              icon={() => <Icon name="bell" color="#FFF" size={24} />}
              onPress={() => router.push("/app/qrcode-modal")}
            />
          </View>
        </View>
        <View className="p-14">
          <Text className="text-white font-semibold text-center">
            Main • USDC
          </Text>
          <Text className="text-white font-bold text-center text-5xl">
            $83,00
          </Text>
          <View className="flex flex-row justify-evenly items-center">
            <CircularButton
              text="Add money"
              icon="plus"
              onPress={() => router.push("/app/add-money-modal")}
            />
            <CircularButton
              text="Send"
              icon="paper-plane"
              onPress={() => router.push("/app/send")}
            />
          </View>
        </View>
        {/* <TransactionsList
          transactions={transactions}
          loading={refreshing}
          setLoading={setRefreshing}
          setTransactions={setTransactions}
          getTransactions={getUserTransactions}
        /> */}
      </View>
    </SafeAreaView>
  );
}
