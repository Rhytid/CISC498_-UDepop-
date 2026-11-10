import { Stack, useRouter } from "expo-router";
import React from "react";
import { Pressable, Text } from "react-native";

export default function AllUsersLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "All Users", headerLeft: () => null }}></Stack.Screen>
      <Stack.Screen
        name="[id]"
        options={{
          headerLeft: () => (
            <Pressable onPress={() => router.replace("/allusers")} style={{ paddingHorizontal: 15 }}>
              <Text style={{ color: "white", fontSize: 18}}>←</Text>
            </Pressable>
          )
        }}
      >
      </Stack.Screen>
    </Stack>
  )
}
