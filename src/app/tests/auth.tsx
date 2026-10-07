import { useAuthActions, useConvexAuth } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { Button, Section } from "@/components/test-ui";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { api } from "../../../convex/_generated/api";

export default function AuthTest() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const me = useQuery(api.users.getMe);

  return (
    <View style={styles.container}>
      <Section>Auth state</Section>
      <Text>{isAuthenticated ? "Authenticated ✅" : "Not authenticated"}</Text>

      <Section>Current user (users.getMe)</Section>
      <Text style={styles.mono}>
        {me === undefined ? "Loading…" : JSON.stringify(me, null, 2)}
      </Text>

      <Button label="Sign out" onPress={() => signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, gap: 8 },
  mono: { fontFamily: "monospace", fontSize: 12 },
});
