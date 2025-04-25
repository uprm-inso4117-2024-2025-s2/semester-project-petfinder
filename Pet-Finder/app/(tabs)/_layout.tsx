import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { AuthProvider } from '../../context/AuthContext'; // Add this import
import { useAuth } from '../../context/AuthContext';

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

// New root layout wrapper
export default function RootLayout() {
  return (
    <AuthProvider>
      <TabLayout />
    </AuthProvider>
  );
}

// Your existing tab layout (now nested component)
function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, isLoggedIn } = useAuth(); // Get auth state

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
           <Tabs.Screen
        name={isLoggedIn ? "profile" : "login"}
        options={{
          title: isLoggedIn ? "Profile" : "Login",
          href: isLoggedIn ? "profile" : "login",
          tabBarIcon: ({ color }) => (
            <IconSymbol
              size={28}
              name={isLoggedIn ? "person.fill" : "lock.fill"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}