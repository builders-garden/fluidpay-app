import { Tabs } from "expo-router";
import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

export default function AppTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="home"
              color={focused ? "#C9B3F9" : "#53516C"}
              size={24}
            />
          ),
          headerShown: false,
          title: "Home",
          tabBarInactiveTintColor: "#53516C",
          tabBarActiveTintColor: "#C9B3F9",
          tabBarBackground: () => <View className="bg-[#201F2D] flex-1" />,
        }}
      />
      <Tabs.Screen
        name="send"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="paper-plane"
              solid={true}
              color={focused ? "#C9B3F9" : "#53516C"}
              size={24}
            />
          ),
          headerShown: false,
          title: "Send",
          tabBarInactiveTintColor: "#53516C",
          tabBarActiveTintColor: "#C9B3F9",
          tabBarBackground: () => <View className="bg-[#201F2D] flex-1" />,
        }}
      />
      <Tabs.Screen
        name="pocket"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="piggy-bank"
              color={focused ? "#C9B3F9" : "#53516C"}
              size={24}
            />
          ),
          headerShown: false,
          title: "Pocket",
          tabBarInactiveTintColor: "#53516C",
          tabBarActiveTintColor: "#C9B3F9",
          tabBarBackground: () => <View className="bg-[#201F2D] flex-1" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="cog"
              color={focused ? "#C9B3F9" : "#53516C"}
              size={24}
            />
          ),
          headerShown: false,
          title: "Settings",
          tabBarInactiveTintColor: "#53516C",
          tabBarActiveTintColor: "#C9B3F9",
          tabBarBackground: () => <View className="bg-[#201F2D] flex-1" />,
        }}
      />
    </Tabs>
  );
}
