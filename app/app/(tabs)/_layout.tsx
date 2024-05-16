import { Tabs } from "expo-router";
import { View } from "react-native";
import { Home, ArrowLeftRight, LayoutGrid } from "lucide-react-native";
import { useColorScheme } from "nativewind";

export default function AppTabsLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#252526" : "#F2F2F2",
          borderColor: colorScheme === "dark" ? "#252526" : "#F2F2F2",
          borderTopWidth: 0,
          minHeight: 94,
          // paddingVertical: 25,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <Home color={focused ? "#FF238C" : "#8F8F91"} size={24} />
          ),
          headerShown: false,
          title: "Home",
          tabBarInactiveTintColor: "#8F8F91",
          tabBarActiveTintColor: "#FF238C",
          tabBarBackground: () => (
            <View
              className="bg-[#ffdbec80] dark:bg-[#252526] flex-1"
              style={{
                backgroundColor:
                  colorScheme === "dark" ? "#252526" : "#ffdbec80",
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="transfers"
        options={{
          tabBarIcon: ({ focused }) => (
            <ArrowLeftRight color={focused ? "#FF238C" : "#8F8F91"} size={24} />
          ),
          headerShown: false,
          title: "Transfers",
          tabBarInactiveTintColor: "#8F8F91",
          tabBarActiveTintColor: "#FF238C",
          tabBarBackground: () => (
            <View
              className="bg-white dark:bg-[#252526] flex-1"
              style={{
                backgroundColor: colorScheme === "dark" ? "#252526" : "#fff",
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          tabBarIcon: ({ focused }) => (
            <LayoutGrid color={focused ? "#FF238C" : "#8F8F91"} size={24} />
          ),
          headerShown: false,
          title: "Groups",
          tabBarInactiveTintColor: "#8F8F91",
          tabBarActiveTintColor: "#FF238C",
          tabBarBackground: () => (
            <View
              className="bg-white dark:bg-[#252526] flex-1"
              style={{
                backgroundColor: colorScheme === "dark" ? "#252526" : "#fff",
              }}
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="cog"
              color={focused ? "#667DFF" : "#8F8F91"}
              size={24}
            />
          ),
          headerShown: false,
          title: "Settings",
          tabBarInactiveTintColor: "#8F8F91",
          tabBarActiveTintColor: "#667DFF",
          tabBarBackground: () => <View className="bg-[#252526] flex-1" />,
        }}
      /> */}
    </Tabs>
  );
}
