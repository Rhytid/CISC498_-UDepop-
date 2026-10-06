import AnimatedMulti, { type TagType } from "@/tag/tagDef";
import { useConvex, useMutation, useQuery } from "convex/react";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

// Test screen for the listings backend functions.
export default function ListingsTest() {
  const convex = useConvex();

  const listings = useQuery(api.listings.list);
  const createListing = useMutation(api.listings.create);
  const updateListing = useMutation(api.listings.update);
  const removeListing = useMutation(api.listings.remove);

  // Create form state
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<TagType[]>([]);

  // Get / update state
  const [lookupId, setLookupId] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [result, setResult] = useState("");

  const submitCreate = async () => {
    if (!title || !price) return;
    await createListing({
      ownerId: "someUserId" as Id<"users">,
      title,
      price: Number(price),
      description,
      tags: tags.map((t) => t.value),
      photos: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setTitle("");
    setPrice("");
    setDescription("");
    setTags([]);
  };

  const doGet = async () => {
    if (!convex || !lookupId) return;
    const doc = await convex.query(api.listings.get, {
      id: lookupId as Id<"listings">,
    });
    setResult(doc === null ? "Not found" : JSON.stringify(doc, null, 2));
  };

  const doUpdate = async () => {
    if (!convex || !lookupId || !newPrice) return;
    const cur = await convex.query(api.listings.get, {
      id: lookupId as Id<"listings">,
    });
    if (cur === null) {
      setResult("Not found");
      return;
    }
    const updated = await updateListing({
      id: lookupId as Id<"listings">,
      ownerId: cur.ownerId,
      title: cur.title,
      price: Number(newPrice),
      description: cur.description,
      tags: cur.tags,
      photos: cur.photos,
      createdAt: cur.createdAt,
      updatedAt: Date.now(),
    });
    setResult(JSON.stringify(updated, null, 2));
    setNewPrice("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.section}>Create</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        <AnimatedMulti value={tags} onChange={setTags} />
        <Pressable onPress={submitCreate} style={styles.button}>
          <Text style={styles.buttonText}>Create listing</Text>
        </Pressable>
      </View>

      <Text style={styles.section}>List ({listings?.length ?? 0})</Text>
      {listings === undefined ? (
        <Text>Loading…</Text>
      ) : (
        listings.map((item) => (
          <View key={item._id} style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>
                {item.title}(id: {item._id}) — ${item.price}
              </Text>
              <Text>{item.description}</Text>
              <Text style={styles.rowTags}>{item.tags.join(", ")}</Text>
            </View>
            <Pressable
              onPress={() => removeListing({ id: item._id })}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        ))
      )}

      <Text style={styles.section}>Get by id</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="Listing id"
          value={lookupId}
          onChangeText={setLookupId}
          style={styles.input}
        />
        <Pressable onPress={doGet} style={styles.button}>
          <Text style={styles.buttonText}>Get</Text>
        </Pressable>
      </View>

      <Text style={styles.section}>Update price by id</Text>
      <View style={styles.form}>
        <TextInput
          placeholder="New price"
          value={newPrice}
          onChangeText={setNewPrice}
          keyboardType="numeric"
          style={styles.input}
        />
        <Pressable onPress={doUpdate} style={styles.button}>
          <Text style={styles.buttonText}>Update</Text>
        </Pressable>
      </View>

      {result !== "" && <Text style={styles.result}>{result}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, gap: 12 },
  section: { fontSize: 16, fontWeight: "600", marginTop: 8 },
  form: { gap: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 8,
  },
  rowText: { flex: 1 },
  rowTitle: { fontWeight: "600" },
  rowTags: { color: "#666", fontSize: 12 },
  deleteButton: { padding: 8 },
  deleteText: { color: "#dc2626" },
  result: {
    fontFamily: "monospace",
    fontSize: 12,
    padding: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
  },
});
