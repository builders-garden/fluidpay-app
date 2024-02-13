import { useConnectedWallet } from "@thirdweb-dev/react-native";
import { Link, Redirect } from "expo-router";
import { SafeAreaView, View, Text, Pressable } from "react-native";
import { IconButton } from "react-native-paper";
import Avatar from "../../../components/avatar";
import CircularButton from "../../../components/circular-button";
import { router } from "expo-router";
import { useUserStore } from "../../../store";
import Icon from "react-native-vector-icons/FontAwesome";
import { ScrollView } from "react-native-gesture-handler";
import TransactionItem from "../../../components/transaction-item";
import { useProfileStore } from "../../../store/use-profile-store";

export default function Home() {
  const signer = useConnectedWallet();
  // const [refreshing, setRefreshing] = React.useState(false);
  const user = useUserStore((state) => state.user);
  const setProfileUser = useProfileStore((state) => state.setProfileUser);
  const setProfileUserTransactions = useProfileStore(
    (state) => state.setProfileUserTransactions
  );
  // const { contract } = useContract(GHO_SEPOLIA_ADDRESS);
  const transactions = [
    {
      receipt: null,
      from: "frankc",
      fromUsername: "frankc",
      to: "orbulo",
      toUsername: "orbulo",
      amount: "18.46",
      createdAt: new Date().toISOString(),
      txHash: "1",
    },
    {
      receipt: null,
      from: "frankc",
      fromUsername: "frankc",
      to: "orbulo",
      toUsername: "orbulo",
      amount: "18.46",
      createdAt: new Date().toISOString(),
      txHash: "2",
    },
    {
      receipt: null,
      from: "frankc",
      fromUsername: "frankc",
      to: "orbulo",
      toUsername: "orbulo",
      amount: "18.46",
      createdAt: new Date().toISOString(),
      txHash: "3",
    },
  ];

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
    <SafeAreaView className="bg-black flex-1">
      <View className="flex flex-col px-4 mt-2 bg-transparent">
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center space-x-4 pl-2">
            <Link href={"/app/settings"}>
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
        <ScrollView className="px-2">
          <View className="py-8 flex flex-col space-y-16">
            <View className="flex flex-col space-y-6">
              <Text className="text-white font-semibold text-center">
                Main • USDC
              </Text>
              <Text className="text-white font-bold text-center text-5xl">
                $83,00
              </Text>
            </View>
            <View className="flex flex-row items-center justify-evenly w-full">
              <CircularButton
                text="Add money"
                icon="plus"
                onPress={() => router.push("/app/add-money-modal")}
              />
              <CircularButton
                text="Request"
                icon="download"
                onPress={() => router.push("/app/request-modal")}
              />
              <CircularButton
                text="Send"
                icon="paper-plane"
                onPress={() => router.push("/app/send")}
              />
              <CircularButton
                text="Details"
                icon="paper-plane"
                onPress={() => router.push("/app/details-modal")}
              />
            </View>
          </View>
          <View className="bg-[#161618] h-[300px] w-full mx-auto rounded-lg p-4">
            <TransactionItem transaction={transactions[0]} index={0} />
            <TransactionItem transaction={transactions[1]} index={1} />
            <TransactionItem transaction={transactions[2]} index={2} />
            <Text className="text-[#667DFF] font-semibold text-center mt-2">
              See all
            </Text>
          </View>
          <View className="bg-[#161618] h-[158px] w-full mx-auto rounded-lg mt-8 mb-24 p-4">
            <View className="flex flex-row items-center space-x-2">
              <Text className="text-gray-400">Recent payees</Text>
              <Icon name="chevron-right" color="grey" size={14} />
            </View>
            <View className="flex flex-row justify-evenly w-full pt-6">
              <Pressable
                onPress={() => {
                  setProfileUser({
                    address: "0x123",
                    username: "orbulo",
                  });
                  setProfileUserTransactions([]);
                  router.push("/app/profile-modal");
                }}
              >
                <View className="flex space-y-2">
                  <Avatar name="O" />
                  <Text className="text-white font-semibold">orbulo</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  setProfileUser({
                    address: "0x123",
                    username: "orbulo",
                  });
                  setProfileUserTransactions([]);
                  router.push("/app/profile-modal");
                }}
              >
                <View className="flex space-y-2">
                  <Avatar name="O" />
                  <Text className="text-white font-semibold">orbulo</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => {
                  setProfileUser({
                    address: "0x123",
                    username: "orbulo",
                  });
                  setProfileUserTransactions([]);
                  router.push("/app/profile-modal");
                }}
              >
                <View className="flex space-y-2">
                  <Avatar name="O" />
                  <Text className="text-white font-semibold">orbulo</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
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
