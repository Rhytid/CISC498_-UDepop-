import { AuthNote, Button, Field, Result, Section } from "@/components/test-ui";
import { useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

export default function SavedTest() {
  const saved = useQuery(api.saved.list);
  const add = useMutation(api.saved.add);
  const remove = useMutation(api.saved.remove);

  const [listingId, setListingId] = useState("");
  const [result, setResult] = useState("");

  const doAdd = async () => {
    if (!listingId) return;
    try {
      await add({ listingId: listingId as Id<"listings"> });
      setResult("");
    } catch (e) {
      setResult(String(e));
    }
  };

  const doRemove = async () => {
    if (!listingId) return;
    try {
      await remove({ listingId: listingId as Id<"listings"> });
      setResult("");
    } catch (e) {
      setResult(String(e));
    }
  };

  return (
    <View style={styles.container}>
      <AuthNote />

      <Section>Saved list</Section>
      {saved === undefined ? (
        <Text>Loading…</Text>
      ) : saved === null ? (
        <Text>Not authenticated</Text>
      ) : (
        saved.map(({ _id, listing }) => (
          <View key={_id} style={styles.row}>
            <Text style={styles.rowTitle}>{listing.title}</Text>
            <Text style={styles.rowSub}>${listing.price}</Text>
          </View>
        ))
      )}

      <Section>Add / remove by listing id</Section>
      <Field label="Listing id" value={listingId} onChangeText={setListingId} />
      <Button label="Save listing" onPress={doAdd} />
      <Button label="Unsave listing" onPress={doRemove} />

      <Result value={result} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, gap: 8 },
  row: {
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 6,
  },
  rowTitle: { fontWeight: "600" },
  rowSub: { color: "#666" },
});
