import { Redirect, router, useNavigation } from "expo-router";
import { useGroupsStore, useUserStore } from "../../../store";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
  ImageBackground,
} from "react-native";
import SkeletonLoader from "expo-skeleton-loader";
import AppButton from "../../../components/app-button";
import Avatar from "../../../components/avatar";
import { PlusIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { getGroups } from "../../../lib/api";

export default function Pocket() {
  const user = useUserStore((state) => state.user);
  const groups = useGroupsStore((state) => state.groups);
  const { setGroups, fetched, setFetched } = useGroupsStore((state) => state);
  const [fetchingGroups, setFetchingGroups] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    const refresh = async () => {
      setFetchingGroups(true);
      await Promise.all([fetchGroups()]);
      setFetched(true);
      setFetchingGroups(false);
    };

    navigation.addListener("focus", refresh);

    return () => {
      navigation.removeListener("focus", refresh);
    };
  }, []);

  const fetchGroups = async () => {
    const group = await getGroups(user!.token);
    setGroups(group);
  };

  if (!user) {
    return <Redirect href={"/"} />;
  }

  if (groups.length === 0 && fetched) {
    return (
      <ImageBackground
        source={require("../../../images/blur-bg.png")}
        className="flex-1"
      >
        <SafeAreaView className="bg-transparent flex-1 items-center py-24 px-16 space-y-4">
          <Text className="text-white text-4xl font-semibold text-center">
            Start sharing expenses
          </Text>
          <Text className="text-white text-center">
            Everything you need to split expenses with your frens
          </Text>
          <View>
            <AppButton
              variant="secondary"
              onPress={() => router.push("/app/create-group")}
              text="Create group"
            />
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <SafeAreaView className="bg-black flex-1 px-4">
      <View className="flex flex-row items-center w-full justify-between mb-4">
        <Text className="text-4xl text-white font-bold">Groups</Text>

        <TouchableOpacity
          onPress={() => router.push("/app/create-group")}
          className="bg-[#FF238C] border-2 border-[#FF238C] flex flex-row space-x-2 rounded-full items-center justify-center py-2 px-4"
        >
          <Text className="text-lg text-white font-semibold">New</Text>
          <PlusIcon size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {!groups.length &&
          !fetched &&
          fetchingGroups &&
          Array(4)
            .fill(null)
            .map((_, index) => (
              <View
                key={index}
                className="bg-[#232324] rounded-xl mb-4 flex flex-col space-y-4 p-4"
              >
                <TransactionLayout />
              </View>
            ))}

        {!!groups &&
          groups.map((group, index) => (
            <Pressable
              key={`group-${index}`}
              onPress={() => {
                router.push({
                  pathname: "/app/group",
                  params: { group: JSON.stringify(group) },
                });
              }}
            >
              <View className="bg-[#232324] rounded-xl mb-4 flex flex-col space-y-4 p-4">
                <Text className="text-white font-semibold text-2xl">
                  {group.name}
                </Text>
                <View className="flex flex-row">
                  {group.members.map((member: any, index: number) => (
                    <View
                      className={index === 0 ? "" : "-ml-6"}
                      key={`member-${index}-${group.name}`}
                    >
                      <Avatar
                        name={member.user.displayName.charAt(0).toUpperCase()}
                        // color="#FFFFFF"
                      />
                    </View>
                  ))}
                </View>
              </View>
            </Pressable>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const TransactionLayout = ({
  size = 48,
  style,
}: {
  size?: number;
  style?: ViewStyle;
}) => (
  <SkeletonLoader duration={850}>
    <SkeletonLoader.Container style={[{ flex: 1 }, style]}>
      <SkeletonLoader.Item style={{ width: 110, height: 30 }} />

      <SkeletonLoader.Container
        style={{ paddingVertical: 10, flexDirection: "row" }}
      >
        <SkeletonLoader.Item
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
        />
        <SkeletonLoader.Item
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            marginLeft: -24,
          }}
        />
      </SkeletonLoader.Container>
    </SkeletonLoader.Container>
  </SkeletonLoader>
);
