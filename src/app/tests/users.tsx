import { AuthNote, Button, Field, Result, Section } from "@/components/test-ui";
import { useConvex, useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export default function UsersTest() {
  const convex = useConvex();
  const me = useQuery(api.users.getMe);
  const updateProfile = useMutation(api.users.updateProfile);

  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");

  const doGetByUsername = async () => {
    if (!convex || !username) return;
    const user = await convex.query(api.users.getByUsername, { username });
    setResult(user === null ? "Not found" : JSON.stringify(user, null, 2));
  };

  const doGetById = async () => {
    if (!convex || !userId) return;
    const user = await convex.query(api.users.getById, {
      userId: userId as Id<"users">,
    });
    setResult(user === null ? "Not found" : JSON.stringify(user, null, 2));
  };

  const doUpdate = async () => {
    try {
      const updated = await updateProfile({ bio, location });
      setResult(JSON.stringify(updated, null, 2));
    } catch (e) {
      setResult(String(e));
    }
  };

  const doSearch = async () => {
    if (!convex || !query) return;
    const found = await convex.query(api.users.search, { query });
    setResult(JSON.stringify(found, null, 2));
  };

  return (
    <View style={styles.container}>
      <AuthNote />

      <Section>getMe</Section>
      <Text style={styles.mono}>
        {me === undefined ? "Loading…" : JSON.stringify(me, null, 2)}
      </Text>

      <Section>getByUsername</Section>
      <Field label="Username" value={username} onChangeText={setUsername} />
      <Button label="Get by username" onPress={doGetByUsername} />

      <Section>getById</Section>
      <Field label="User id" value={userId} onChangeText={setUserId} />
      <Button label="Get by id" onPress={doGetById} />

      <Section>updateProfile</Section>
      <Field label="Bio" value={bio} onChangeText={setBio} />
      <Field label="Location" value={location} onChangeText={setLocation} />
      <Button label="Update profile" onPress={doUpdate} />

      <Section>search</Section>
      <Field label="Query" value={query} onChangeText={setQuery} />
      <Button label="Search users" onPress={doSearch} />

      <Result value={result} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, gap: 8 },
  mono: { fontFamily: "monospace", fontSize: 12 },
});
