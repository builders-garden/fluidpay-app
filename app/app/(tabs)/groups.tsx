import { Redirect, router } from "expo-router";
import { useGroupsStore, useUserStore } from "../../../store";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, Pressable } from "react-native";
import AppButton from "../../../components/app-button";
import { ScrollView } from "react-native-gesture-handler";
import Avatar from "../../../components/avatar";

export default function Pocket() {
  const user = useUserStore((state) => state.user);
  const groups = useGroupsStore((state) => state.groups);

  if (!user) {
    return <Redirect href={"/"} />;
  }

  if (groups.length === 0) {
    return (
      <LinearGradient
        colors={["#3500B7", "#000000"]}
        className="h-full"
        style={{}}
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
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView className="bg-black flex-1 px-4">
      <Text className="text-4xl text-white font-bold mb-4">Groups</Text>
      <ScrollView>
        {groups.map((group, index) => (
          <Pressable
            key={`group-${index}`}
            onPress={() =>
              router.push({
                pathname: "/app/group",
                params: { group: JSON.stringify(group) },
              })
            }
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
                      name={member.username.charAt(0).toUpperCase()}
                      // color="#FFFFFF"
                    />
                  </View>
                ))}
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <AppButton
        onPress={() => router.push("/app/create-group")}
        text="Create group"
      />
    </SafeAreaView>
  );
}
